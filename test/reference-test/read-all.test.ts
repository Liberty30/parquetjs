import { expect } from "chai";
import path from "node:path";
import fs from "node:fs";

import parquet from '../../parquet';

// Used for testing a single file. Example:
// const onlyTest = 'single_nan.parquet';
const onlyTest = null;

// Test files currently unsupported / needing separate test
const unsupported = [
  'byte_stream_split.zstd.parquet', // ZSTD unsupported
  'hadoop_lz4_compressed.parquet', // LZ4 unsupported
  'hadoop_lz4_compressed_larger.parquet', // LZ4 unsupported
  'lz4_raw_compressed.parquet', // LZ4_RAW unsupported
  'lz4_raw_compressed_larger.parquet', // LZ4_RAW unsupported
  'nested_structs.rust.parquet', // ZSTD unsupported
  'non_hadoop_lz4_compressed.parquet', // ZSTD unsupported
  'rle_boolean_encoding.parquet', // BUG?: https://github.com/LibertyDSNP/parquetjs/issues/113
  'datapage_v2.snappy.parquet', // DELTA_BINARY_PACKED unsupported
  'delta_binary_packed.parquet', // DELTA_BINARY_PACKED unsupported
  'delta_byte_array.parquet', // DELTA_BYTE_ARRAY unsupported
  'delta_encoding_optional_column.parquet', // DELTA_BINARY_PACKED unsupported
  'delta_encoding_required_column.parquet', // DELTA_BINARY_PACKED unsupported
  'delta_length_byte_array.parquet', // ZSTD unsupported, DELTA_BINARY_PACKED unsupported
  'float16_nonzeros_and_nans.parquet', // missing option: typeLength (required for FIXED_LEN_BYTE_ARRAY)
  'float16_zeros_and_nans.parquet', // missing option: typeLength (required for FIXED_LEN_BYTE_ARRAY)
  'large_string_map.brotli.parquet', // BUG?
];

describe("Read Test for all files", function () {

  const listOfFiles = fs.readdirSync(path.join(__dirname, 'files'))
    .filter(x => x.endsWith(".parquet") && !unsupported.includes(x));

  for (const filename of listOfFiles) {
    if (onlyTest && onlyTest !== filename) continue;
    it(`Reading ${filename}`, async function () {
      const reader = await parquet.ParquetReader.openFile(path.join(__dirname, 'files', filename));
      const schema = reader.getSchema();
      expect(schema.fieldList).to.have.length.greaterThan(0);
      const cursor = reader.getCursor();
      const record = await cursor.next() as any;
      // Expect the same keys as top-level fields
      const expectedRecordKeys = schema.fieldList.filter(x => x.path.length === 1).map(x => x.name);
      expect(Object.keys(record)).to.deep.equal(expectedRecordKeys);
    })
  }
});
