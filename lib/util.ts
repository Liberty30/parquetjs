import thrift from "thrift";
import fs from 'fs'
import parquet_thrift from '../gen-nodejs/parquet_types'

/** We need to use a patched version of TFramedTransport where
  * readString returns the original buffer instead of a string if the 
  * buffer can not be safely encoded as utf8 (see http://bit.ly/2GXeZEF)
  */

class fixedTFramedTransport extends thrift.TFramedTransport {
  inBuf: Buffer
  readPos: number
  constructor(inBuf: Buffer) {
    super(inBuf)
    this.inBuf = inBuf
    this.readPos = 0
  }
  readString(len: number) {
    this.ensureAvailable(len);
    var buffer = this.inBuf.slice(this.readPos, this.readPos + len);
    var str = this.inBuf.toString('utf8', this.readPos, this.readPos + len);
    this.readPos += len;
    return (Buffer.from(str).equals(buffer)) ? str : buffer;
  }
}


/** Patch PageLocation to be three element array that has getters/setters
  * for each of the properties (offset, compressed_page_size, first_row_index)
  * This saves space considerably as we do not need to store the full variable
  * names for every PageLocation
  */

const previousPageLocation = parquet_thrift.PageLocation.prototype;
const PageLocation = parquet_thrift.PageLocation.prototype = [];
PageLocation.write = previousPageLocation.write;
PageLocation.read = previousPageLocation.read;

const getterSetter = (index: number) => ({
  get: function() { return this[index]; },
  set: function(value) { return this[index] = value;}
});

Object.defineProperty(PageLocation,'offset', getterSetter(0));
Object.defineProperty(PageLocation,'compressed_page_size', getterSetter(1));
Object.defineProperty(PageLocation,'first_row_index', getterSetter(2));


export const force32 = function() {
  const protocol = thrift.TCompactProtocol.prototype;
  protocol.zigzagToI64 = protocol.zigzagToI32;
  protocol.readVarint64 = protocol.readVarint32 = function() {
    let lo = 0;
    let shift = 0;
    let b;
    while (true) {
      b = this.trans.readByte();
      lo = lo | ((b & 0x7f) << shift);
      shift += 7;
      if (!(b & 0x80)) {
        break;
      }
    }
    return lo;
  };
}

/**
 * Helper function that serializes a thrift object into a buffer
 */
export const serializeThrift = function(obj: thrift.Thrift.TApplicationException) {
  let output:Array<Uint8Array> = []

  let transport = new thrift.TBufferedTransport(null, function (buf: Buffer) {
    output.push(buf)
  })

  let protocol = new thrift.TCompactProtocol(transport)
  obj.write(protocol)
  transport.flush()

  return Buffer.concat(output)
}

export const decodeThrift = function(obj: thrift.Thrift.TApplicationException, buf: Buffer, offset: number) {
  if (!offset) {
    offset = 0;
  }

  var transport = new fixedTFramedTransport(buf);
  transport.readPos = offset;
  var protocol = new thrift.TCompactProtocol(transport);
  obj.read(protocol);
  return transport.readPos - offset;
}

/**
 * Get the number of bits required to store a given value
 */
export const getBitWidth = function(val: number) {
  if (val === 0) {
    return 0;
  } else {
    return Math.ceil(Math.log2(val + 1));
  }
}

/**
 * FIXME not ideal that this is linear
 */
export const getThriftEnum = function(klass: Array<unknown>, value: unknown) {
  for (let k in klass) {
    if (klass[k] === value) {
      return k;
    }
  }

  throw 'Invalid ENUM value';
}

export const fopen = function(filePath: string | Buffer | URL) {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fd) => {
      if (err) {
        reject(err);
      } else {
        resolve(fd);
      }
    })
  });
}

export const fstat = function(filePath: string | Buffer | URL) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    })
  });
}

export const fread = function(fd: number, position: number | null, length: number) {
  let buffer = Buffer.alloc(length);

  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, 0, length, position, (err, bytesRead, buf) => {
      if (err || bytesRead != length) {
        reject(err || Error('read failed'));
      } else {
        resolve(buf);
      }
    });
  });
}

export const fclose = function(fd: number) {
  return new Promise((resolve, reject) => {
    fs.close(fd, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
}

export const oswrite = function(os, buf) {
  return new Promise((resolve, reject) => {
    os.write(buf, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const osend = function(os) {
  return new Promise((resolve, reject) => {
    os.end((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const osopen = function(path: string | Buffer | URL, opts: string) {
  return new Promise((resolve, reject) => {
    let outputStream = fs.createWriteStream(path, opts);

    outputStream.on('open', function(fd) {
      resolve(outputStream);
    });

    outputStream.on('error', function(err) {
      reject(err);
    });
  });
}

export const fieldIndexOf = function(arr, elem) {
  for (let j = 0; j < arr.length; ++j) {
    if (arr[j].length !== elem.length) {
      continue;
    }

    let m = true;
    for (let i = 0; i < elem.length; ++i) {
      if (arr[j][i] !== elem[i]) {
        m = false;
        break;
      }
    }

    if (m) {
      return j;
    }
  }

  return -1;
}
