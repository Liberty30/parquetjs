import * as parquetjs from '../../dist/browser/parquet.esm';
import { assert } from 'chai';

const buffer = require('buffer');

describe('Browser tests', function () {
  describe('reader', function () {
    it('can read snappy compressed data', async function () {
      // Data from test/test-files/snappy-compressed.parquet
      const uint8Array = [
        80, 65, 82, 49, 21, 6, 21, 80, 21, 82, 92, 21, 8, 21, 0, 21, 8, 21, 0, 21, 0, 21, 0, 17, 28, 24, 5, 119, 111,
        114, 108, 100, 24, 8, 49, 112, 111, 97, 52, 98, 112, 102, 22, 0, 22, 8, 24, 5, 119, 111, 114, 108, 100, 24, 8,
        49, 112, 111, 97, 52, 98, 112, 102, 0, 0, 0, 40, 32, 5, 0, 0, 0, 104, 101, 108, 108, 111, 1, 9, 104, 119, 111,
        114, 108, 100, 6, 0, 0, 0, 98, 97, 110, 97, 110, 97, 8, 0, 0, 0, 49, 112, 111, 97, 52, 98, 112, 102, 21, 12, 25,
        37, 6, 0, 25, 24, 16, 99, 111, 109, 112, 114, 101, 115, 115, 101, 100, 83, 116, 114, 105, 110, 103, 21, 2, 22,
        8, 22, 206, 1, 22, 206, 1, 38, 8, 60, 24, 5, 119, 111, 114, 108, 100, 24, 8, 49, 112, 111, 97, 52, 98, 112, 102,
        22, 0, 22, 8, 24, 5, 119, 111, 114, 108, 100, 24, 8, 49, 112, 111, 97, 52, 98, 112, 102, 0, 0, 41, 24, 8, 49,
        112, 111, 97, 52, 98, 112, 102, 25, 24, 5, 119, 111, 114, 108, 100, 0, 25, 28, 22, 8, 21, 206, 1, 22, 0, 0, 0,
        21, 2, 25, 44, 72, 4, 114, 111, 111, 116, 21, 2, 0, 21, 12, 37, 0, 24, 16, 99, 111, 109, 112, 114, 101, 115,
        115, 101, 100, 83, 116, 114, 105, 110, 103, 37, 0, 0, 22, 8, 25, 28, 25, 28, 38, 214, 1, 28, 21, 12, 25, 37, 6,
        0, 25, 24, 16, 99, 111, 109, 112, 114, 101, 115, 115, 101, 100, 83, 116, 114, 105, 110, 103, 21, 2, 22, 8, 22,
        206, 1, 22, 206, 1, 38, 8, 60, 24, 5, 119, 111, 114, 108, 100, 24, 8, 49, 112, 111, 97, 52, 98, 112, 102, 22, 0,
        22, 8, 24, 5, 119, 111, 114, 108, 100, 24, 8, 49, 112, 111, 97, 52, 98, 112, 102, 0, 0, 22, 154, 3, 21, 22, 22,
        242, 2, 21, 40, 0, 22, 234, 2, 22, 8, 0, 25, 12, 24, 15, 64, 100, 115, 110, 112, 47, 112, 97, 114, 113, 117,
        101, 116, 106, 115, 0, 163, 0, 0, 0, 80, 65, 82, 49,
      ];
      const snappyCompressedBuffer = buffer.Buffer.from(uint8Array);
      const reader = await parquetjs.ParquetReader.openBuffer(snappyCompressedBuffer);
      const data: any[] = [];
      for await (const record of reader) {
        data.push(record);
      }
      assert.equal(data.length, 4);

      after(async function () {
        await reader.close();
      });
    });

    it('can read gzip compressed data', async function () {
      // Data from test/test-files/gzip-nation.impala.parquet
      const uint8Array = [
        80, 65, 82, 49, 21, 0, 21, 212, 1, 21, 132, 1, 44, 21, 50, 21, 0, 21, 6, 21, 8, 0, 0, 31, 139, 8, 0, 0, 0, 0, 0,
        0, 3, 21, 196, 197, 1, 128, 64, 12, 0, 176, 114, 184, 187, 204, 193, 254, 195, 17, 30, 73, 138, 136, 55, 83,
        252, 37, 114, 10, 74, 42, 106, 26, 90, 58, 122, 6, 70, 38, 102, 22, 86, 54, 118, 14, 78, 46, 110, 30, 62, 67, 2,
        243, 142, 106, 0, 0, 0, 38, 178, 1, 28, 21, 2, 25, 37, 0, 6, 25, 24, 11, 110, 95, 110, 97, 116, 105, 111, 110,
        107, 101, 121, 21, 4, 22, 50, 22, 250, 1, 22, 170, 1, 38, 8, 0, 0, 21, 4, 21, 170, 4, 21, 248, 2, 76, 21, 50,
        21, 4, 0, 0, 31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 69, 142, 91, 18, 194, 48, 8, 69, 251, 225, 123, 212, 53, 184, 149,
        219, 4, 43, 106, 72, 37, 137, 51, 237, 254, 23, 34, 84, 103, 252, 202, 1, 78, 46, 108, 187, 174, 195, 115, 32,
        101, 236, 29, 117, 32, 169, 44, 216, 88, 209, 43, 102, 126, 58, 5, 8, 34, 214, 70, 52, 76, 99, 221, 57, 212, 27,
        231, 145, 23, 241, 170, 144, 64, 91, 35, 11, 74, 144, 201, 77, 150, 248, 205, 52, 200, 66, 133, 177, 242, 194,
        212, 223, 251, 114, 235, 142, 17, 226, 25, 247, 172, 17, 226, 173, 7, 201, 4, 15, 75, 89, 115, 8, 249, 176, 224,
        140, 212, 243, 171, 145, 127, 30, 73, 155, 155, 225, 102, 151, 186, 169, 217, 182, 50, 142, 134, 5, 45, 242, 5,
        138, 158, 151, 209, 155, 169, 10, 146, 175, 208, 86, 236, 138, 179, 81, 19, 174, 20, 47, 15, 150, 33, 230, 116,
        250, 119, 74, 69, 165, 242, 1, 116, 204, 243, 193, 21, 1, 0, 0, 21, 0, 21, 48, 21, 88, 44, 21, 50, 21, 4, 21, 6,
        21, 8, 0, 0, 31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 99, 98, 96, 96, 48, 98, 100, 229, 84, 232, 112, 236, 178, 212, 88,
        121, 116, 86, 181, 193, 41, 207, 213, 123, 37, 0, 169, 207, 22, 92, 24, 0, 0, 0, 38, 142, 6, 28, 21, 12, 25, 53,
        0, 6, 4, 25, 24, 6, 110, 95, 110, 97, 109, 101, 21, 4, 22, 50, 22, 154, 5, 22, 144, 4, 38, 148, 5, 38, 254, 1,
        0, 0, 21, 0, 21, 212, 1, 21, 112, 44, 21, 50, 21, 0, 21, 6, 21, 8, 0, 0, 31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 99,
        98, 96, 96, 48, 98, 4, 18, 12, 140, 72, 152, 133, 1, 2, 152, 161, 152, 9, 138, 89, 160, 152, 9, 73, 13, 12, 48,
        66, 197, 153, 145, 212, 192, 244, 131, 228, 0, 65, 89, 191, 200, 106, 0, 0, 0, 38, 238, 7, 28, 21, 2, 25, 37, 0,
        6, 25, 24, 11, 110, 95, 114, 101, 103, 105, 111, 110, 107, 101, 121, 21, 4, 22, 50, 22, 248, 1, 22, 148, 1, 38,
        218, 6, 0, 0, 21, 4, 21, 202, 30, 21, 216, 11, 76, 21, 50, 21, 4, 0, 0, 31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 109,
        85, 75, 143, 19, 49, 12, 222, 127, 66, 14, 136, 83, 153, 3, 28, 144, 86, 66, 43, 56, 35, 184, 131, 56, 164, 169,
        103, 154, 109, 26, 207, 230, 177, 219, 249, 247, 56, 47, 39, 179, 203, 165, 170, 38, 126, 124, 159, 253, 217,
        254, 124, 119, 119, 39, 206, 114, 89, 12, 76, 66, 73, 7, 115, 52, 102, 19, 179, 182, 210, 136, 19, 172, 232,
        117, 240, 244, 39, 128, 10, 194, 155, 141, 222, 228, 34, 245, 15, 114, 35, 131, 25, 111, 224, 197, 234, 240,
        170, 61, 180, 103, 165, 208, 157, 180, 93, 68, 64, 17, 206, 32, 28, 44, 209, 72, 151, 31, 162, 13, 126, 18, 71,
        52, 39, 250, 252, 20, 193, 83, 112, 105, 208, 94, 40, 222, 150, 255, 45, 94, 159, 64, 224, 156, 93, 87, 176, 57,
        82, 3, 50, 66, 244, 43, 40, 77, 24, 86, 169, 46, 114, 33, 24, 244, 34, 228, 17, 99, 200, 174, 218, 161, 213,
        138, 16, 58, 122, 155, 42, 182, 230, 3, 148, 14, 164, 39, 226, 20, 188, 88, 30, 132, 215, 6, 108, 224, 120, 205,
        167, 193, 223, 229, 153, 163, 211, 24, 201, 64, 224, 51, 184, 156, 48, 104, 250, 37, 175, 217, 196, 121, 214,
        244, 146, 88, 170, 194, 235, 72, 86, 217, 168, 195, 143, 54, 250, 72, 80, 232, 43, 158, 208, 232, 144, 125, 75,
        217, 227, 66, 44, 74, 162, 167, 168, 213, 37, 87, 213, 161, 247, 57, 70, 207, 221, 160, 157, 222, 81, 154, 103,
        176, 29, 227, 139, 188, 176, 239, 148, 237, 62, 144, 201, 190, 187, 173, 1, 83, 139, 115, 40, 165, 184, 39, 75,
        42, 171, 145, 1, 12, 12, 207, 220, 64, 113, 251, 232, 228, 118, 223, 40, 28, 118, 6, 223, 200, 155, 128, 194,
        77, 69, 79, 64, 148, 124, 68, 211, 165, 193, 36, 122, 149, 89, 100, 171, 211, 84, 126, 233, 40, 135, 75, 170,
        44, 62, 112, 91, 29, 144, 147, 244, 219, 117, 13, 152, 203, 196, 188, 155, 107, 17, 112, 241, 24, 53, 82, 69,
        112, 70, 117, 129, 45, 81, 218, 192, 121, 50, 3, 88, 197, 209, 164, 134, 141, 246, 159, 146, 42, 138, 227, 27,
        37, 22, 48, 60, 22, 164, 75, 176, 74, 39, 48, 223, 201, 43, 37, 97, 48, 71, 68, 79, 60, 2, 174, 217, 179, 117,
        112, 95, 244, 7, 254, 94, 200, 188, 167, 40, 185, 169, 85, 4, 7, 38, 190, 232, 57, 112, 29, 229, 23, 178, 27,
        147, 37, 141, 52, 38, 131, 250, 123, 9, 186, 124, 255, 166, 162, 182, 137, 106, 253, 169, 149, 235, 154, 234,
        163, 86, 77, 59, 146, 149, 250, 131, 226, 8, 210, 86, 129, 177, 212, 87, 73, 140, 195, 239, 36, 49, 155, 230,
        187, 1, 202, 131, 78, 162, 113, 9, 233, 21, 211, 78, 72, 224, 12, 122, 248, 223, 100, 17, 162, 1, 73, 118, 102,
        25, 62, 124, 76, 194, 154, 120, 90, 219, 252, 116, 93, 20, 76, 156, 219, 61, 146, 195, 160, 98, 126, 24, 150,
        10, 183, 177, 164, 110, 116, 6, 157, 66, 30, 171, 78, 124, 183, 129, 202, 194, 40, 99, 241, 135, 178, 169, 87,
        210, 232, 92, 90, 9, 45, 6, 116, 86, 55, 13, 238, 55, 76, 95, 144, 36, 60, 89, 109, 234, 128, 32, 133, 47, 70,
        157, 239, 126, 225, 213, 100, 226, 26, 77, 208, 171, 209, 164, 244, 137, 243, 238, 184, 90, 185, 12, 43, 169,
        20, 84, 14, 227, 82, 113, 252, 164, 148, 9, 76, 165, 201, 251, 154, 175, 69, 109, 35, 203, 163, 181, 177, 112,
        27, 138, 200, 163, 70, 17, 115, 11, 40, 158, 86, 212, 131, 113, 190, 153, 124, 42, 249, 161, 142, 203, 175, 164,
        217, 126, 41, 232, 242, 88, 95, 232, 114, 103, 115, 235, 44, 164, 53, 252, 230, 244, 236, 103, 204, 229, 70,
        126, 205, 187, 223, 182, 57, 125, 123, 80, 250, 94, 228, 133, 71, 54, 189, 241, 54, 239, 244, 130, 111, 60, 22,
        248, 82, 239, 97, 157, 85, 94, 191, 13, 69, 59, 48, 140, 252, 232, 64, 170, 243, 171, 178, 83, 172, 166, 237,
        166, 187, 127, 35, 248, 110, 78, 165, 7, 0, 0, 21, 0, 21, 48, 21, 88, 44, 21, 50, 21, 4, 21, 6, 21, 8, 0, 0, 31,
        139, 8, 0, 0, 0, 0, 0, 0, 3, 99, 98, 96, 96, 48, 98, 100, 229, 84, 232, 112, 236, 178, 212, 88, 121, 116, 86,
        181, 193, 41, 207, 213, 123, 37, 0, 169, 207, 22, 92, 24, 0, 0, 0, 38, 172, 21, 28, 21, 12, 25, 53, 0, 6, 4, 25,
        24, 9, 110, 95, 99, 111, 109, 109, 101, 110, 116, 21, 4, 22, 50, 22, 186, 31, 22, 240, 12, 38, 178, 20, 38, 188,
        8, 0, 0, 21, 2, 25, 92, 72, 6, 115, 99, 104, 101, 109, 97, 21, 8, 0, 21, 2, 37, 2, 24, 11, 110, 95, 110, 97,
        116, 105, 111, 110, 107, 101, 121, 0, 21, 12, 37, 2, 24, 6, 110, 95, 110, 97, 109, 101, 0, 21, 2, 37, 2, 24, 11,
        110, 95, 114, 101, 103, 105, 111, 110, 107, 101, 121, 0, 21, 12, 37, 2, 24, 9, 110, 95, 99, 111, 109, 109, 101,
        110, 116, 0, 22, 50, 25, 28, 25, 76, 38, 178, 1, 28, 21, 2, 25, 37, 0, 6, 25, 24, 11, 110, 95, 110, 97, 116,
        105, 111, 110, 107, 101, 121, 21, 4, 22, 50, 22, 250, 1, 22, 170, 1, 38, 8, 0, 0, 38, 142, 6, 28, 21, 12, 25,
        53, 0, 6, 4, 25, 24, 6, 110, 95, 110, 97, 109, 101, 21, 4, 22, 50, 22, 154, 5, 22, 144, 4, 38, 148, 5, 38, 254,
        1, 0, 0, 38, 238, 7, 28, 21, 2, 25, 37, 0, 6, 25, 24, 11, 110, 95, 114, 101, 103, 105, 111, 110, 107, 101, 121,
        21, 4, 22, 50, 22, 248, 1, 22, 148, 1, 38, 218, 6, 0, 0, 38, 172, 21, 28, 21, 12, 25, 53, 0, 6, 4, 25, 24, 9,
        110, 95, 99, 111, 109, 109, 101, 110, 116, 21, 4, 22, 50, 22, 186, 31, 22, 240, 12, 38, 178, 20, 38, 188, 8, 0,
        0, 22, 190, 19, 22, 50, 0, 40, 76, 105, 109, 112, 97, 108, 97, 32, 118, 101, 114, 115, 105, 111, 110, 32, 49,
        46, 50, 45, 73, 78, 84, 69, 82, 78, 65, 76, 32, 40, 98, 117, 105, 108, 100, 32, 97, 52, 54, 50, 101, 99, 52, 50,
        101, 53, 53, 48, 99, 55, 53, 102, 99, 99, 98, 102, 102, 57, 56, 99, 55, 50, 48, 102, 51, 55, 102, 51, 101, 101,
        57, 100, 53, 53, 97, 51, 41, 0, 71, 1, 0, 0, 80, 65, 82, 49,
      ];
      const gzipCompressedBuffer = buffer.Buffer.from(uint8Array);
      const reader = await parquetjs.ParquetReader.openBuffer(gzipCompressedBuffer);
      const data: any[] = [];
      for await (const record of reader) {
        data.push(record);
      }
      assert.equal(data.length, 25);

      after(async function () {
        await reader.close();
      });
    });

    it('can read brotli compressed data', async function () {
      // Data from test/test-files/sample_brotli_compressed.parquet
      const uint8Array = [
        80, 65, 82, 49, 21, 4, 21, 80, 21, 34, 76, 21, 10, 21, 0, 18, 0, 0, 27, 39, 0, 0, 4, 238, 248, 108, 160, 17, 74,
        10, 145, 22, 229, 106, 14, 21, 0, 21, 22, 21, 30, 44, 21, 10, 21, 16, 21, 6, 21, 6, 28, 24, 8, 5, 0, 0, 0, 0, 0,
        0, 0, 24, 8, 1, 0, 0, 0, 0, 0, 0, 0, 22, 0, 40, 8, 5, 0, 0, 0, 0, 0, 0, 0, 24, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 11, 5, 128, 2, 0, 0, 0, 10, 1, 3, 3, 136, 70, 0, 3, 38, 222, 1, 28, 21, 4, 25, 53, 0, 6, 16, 25, 24, 2, 105,
        100, 21, 8, 22, 10, 22, 252, 1, 22, 214, 1, 38, 70, 38, 8, 28, 24, 8, 5, 0, 0, 0, 0, 0, 0, 0, 24, 8, 1, 0, 0, 0,
        0, 0, 0, 0, 22, 0, 40, 8, 5, 0, 0, 0, 0, 0, 0, 0, 24, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 25, 44, 21, 4, 21, 0, 21, 2,
        0, 21, 0, 21, 16, 21, 2, 0, 0, 0, 21, 4, 21, 86, 21, 94, 76, 21, 10, 21, 0, 18, 0, 0, 11, 21, 128, 5, 0, 0, 0,
        65, 108, 105, 99, 101, 3, 0, 0, 0, 66, 111, 98, 7, 0, 0, 0, 67, 104, 97, 114, 108, 105, 101, 5, 0, 0, 0, 68, 97,
        118, 105, 100, 3, 0, 0, 0, 69, 118, 101, 3, 21, 0, 21, 22, 21, 30, 44, 21, 10, 21, 16, 21, 6, 21, 6, 28, 54, 0,
        40, 3, 69, 118, 101, 24, 5, 65, 108, 105, 99, 101, 0, 0, 0, 11, 5, 128, 2, 0, 0, 0, 10, 1, 3, 3, 136, 70, 0, 3,
        38, 240, 4, 28, 21, 12, 25, 53, 0, 6, 16, 25, 24, 4, 110, 97, 109, 101, 21, 8, 22, 10, 22, 202, 1, 22, 218, 1,
        38, 144, 4, 38, 150, 3, 28, 54, 0, 40, 3, 69, 118, 101, 24, 5, 65, 108, 105, 99, 101, 0, 25, 44, 21, 4, 21, 0,
        21, 2, 0, 21, 0, 21, 16, 21, 2, 0, 0, 0, 21, 4, 21, 80, 21, 44, 76, 21, 10, 21, 0, 18, 0, 0, 27, 39, 0, 0, 4,
        54, 224, 18, 77, 150, 101, 57, 27, 104, 132, 146, 66, 164, 69, 185, 154, 3, 21, 0, 21, 22, 21, 30, 44, 21, 10,
        21, 16, 21, 6, 21, 6, 28, 24, 8, 45, 0, 0, 0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0, 22, 0, 40, 8, 45, 0,
        0, 0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 5, 128, 2, 0, 0, 0, 10, 1, 3, 3, 136, 70, 0, 3,
        38, 216, 7, 28, 21, 4, 25, 53, 0, 6, 16, 25, 24, 3, 97, 103, 101, 21, 8, 22, 10, 22, 252, 1, 22, 224, 1, 38,
        192, 6, 38, 248, 5, 28, 24, 8, 45, 0, 0, 0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0, 22, 0, 40, 8, 45, 0, 0,
        0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0, 0, 25, 44, 21, 4, 21, 0, 21, 2, 0, 21, 0, 21, 16, 21, 2, 0, 0, 0,
        21, 4, 25, 76, 53, 0, 24, 6, 115, 99, 104, 101, 109, 97, 21, 6, 0, 21, 4, 37, 2, 24, 2, 105, 100, 0, 21, 12, 37,
        2, 24, 4, 110, 97, 109, 101, 37, 0, 76, 28, 0, 0, 0, 21, 4, 37, 2, 24, 3, 97, 103, 101, 0, 22, 10, 25, 28, 25,
        60, 38, 222, 1, 28, 21, 4, 25, 53, 0, 6, 16, 25, 24, 2, 105, 100, 21, 8, 22, 10, 22, 252, 1, 22, 214, 1, 38, 70,
        38, 8, 28, 24, 8, 5, 0, 0, 0, 0, 0, 0, 0, 24, 8, 1, 0, 0, 0, 0, 0, 0, 0, 22, 0, 40, 8, 5, 0, 0, 0, 0, 0, 0, 0,
        24, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 25, 44, 21, 4, 21, 0, 21, 2, 0, 21, 0, 21, 16, 21, 2, 0, 0, 0, 38, 240, 4, 28,
        21, 12, 25, 53, 0, 6, 16, 25, 24, 4, 110, 97, 109, 101, 21, 8, 22, 10, 22, 202, 1, 22, 218, 1, 38, 144, 4, 38,
        150, 3, 28, 54, 0, 40, 3, 69, 118, 101, 24, 5, 65, 108, 105, 99, 101, 0, 25, 44, 21, 4, 21, 0, 21, 2, 0, 21, 0,
        21, 16, 21, 2, 0, 0, 0, 38, 216, 7, 28, 21, 4, 25, 53, 0, 6, 16, 25, 24, 3, 97, 103, 101, 21, 8, 22, 10, 22,
        252, 1, 22, 224, 1, 38, 192, 6, 38, 248, 5, 28, 24, 8, 45, 0, 0, 0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0,
        22, 0, 40, 8, 45, 0, 0, 0, 0, 0, 0, 0, 24, 8, 25, 0, 0, 0, 0, 0, 0, 0, 0, 25, 44, 21, 4, 21, 0, 21, 2, 0, 21, 0,
        21, 16, 21, 2, 0, 0, 0, 22, 194, 5, 22, 10, 38, 8, 22, 144, 5, 20, 0, 0, 25, 44, 24, 6, 112, 97, 110, 100, 97,
        115, 24, 251, 4, 123, 34, 105, 110, 100, 101, 120, 95, 99, 111, 108, 117, 109, 110, 115, 34, 58, 32, 91, 123,
        34, 107, 105, 110, 100, 34, 58, 32, 34, 114, 97, 110, 103, 101, 34, 44, 32, 34, 110, 97, 109, 101, 34, 58, 32,
        110, 117, 108, 108, 44, 32, 34, 115, 116, 97, 114, 116, 34, 58, 32, 48, 44, 32, 34, 115, 116, 111, 112, 34, 58,
        32, 53, 44, 32, 34, 115, 116, 101, 112, 34, 58, 32, 49, 125, 93, 44, 32, 34, 99, 111, 108, 117, 109, 110, 95,
        105, 110, 100, 101, 120, 101, 115, 34, 58, 32, 91, 123, 34, 110, 97, 109, 101, 34, 58, 32, 110, 117, 108, 108,
        44, 32, 34, 102, 105, 101, 108, 100, 95, 110, 97, 109, 101, 34, 58, 32, 110, 117, 108, 108, 44, 32, 34, 112, 97,
        110, 100, 97, 115, 95, 116, 121, 112, 101, 34, 58, 32, 34, 117, 110, 105, 99, 111, 100, 101, 34, 44, 32, 34,
        110, 117, 109, 112, 121, 95, 116, 121, 112, 101, 34, 58, 32, 34, 111, 98, 106, 101, 99, 116, 34, 44, 32, 34,
        109, 101, 116, 97, 100, 97, 116, 97, 34, 58, 32, 123, 34, 101, 110, 99, 111, 100, 105, 110, 103, 34, 58, 32, 34,
        85, 84, 70, 45, 56, 34, 125, 125, 93, 44, 32, 34, 99, 111, 108, 117, 109, 110, 115, 34, 58, 32, 91, 123, 34,
        110, 97, 109, 101, 34, 58, 32, 34, 105, 100, 34, 44, 32, 34, 102, 105, 101, 108, 100, 95, 110, 97, 109, 101, 34,
        58, 32, 34, 105, 100, 34, 44, 32, 34, 112, 97, 110, 100, 97, 115, 95, 116, 121, 112, 101, 34, 58, 32, 34, 105,
        110, 116, 54, 52, 34, 44, 32, 34, 110, 117, 109, 112, 121, 95, 116, 121, 112, 101, 34, 58, 32, 34, 105, 110,
        116, 54, 52, 34, 44, 32, 34, 109, 101, 116, 97, 100, 97, 116, 97, 34, 58, 32, 110, 117, 108, 108, 125, 44, 32,
        123, 34, 110, 97, 109, 101, 34, 58, 32, 34, 110, 97, 109, 101, 34, 44, 32, 34, 102, 105, 101, 108, 100, 95, 110,
        97, 109, 101, 34, 58, 32, 34, 110, 97, 109, 101, 34, 44, 32, 34, 112, 97, 110, 100, 97, 115, 95, 116, 121, 112,
        101, 34, 58, 32, 34, 117, 110, 105, 99, 111, 100, 101, 34, 44, 32, 34, 110, 117, 109, 112, 121, 95, 116, 121,
        112, 101, 34, 58, 32, 34, 111, 98, 106, 101, 99, 116, 34, 44, 32, 34, 109, 101, 116, 97, 100, 97, 116, 97, 34,
        58, 32, 110, 117, 108, 108, 125, 44, 32, 123, 34, 110, 97, 109, 101, 34, 58, 32, 34, 97, 103, 101, 34, 44, 32,
        34, 102, 105, 101, 108, 100, 95, 110, 97, 109, 101, 34, 58, 32, 34, 97, 103, 101, 34, 44, 32, 34, 112, 97, 110,
        100, 97, 115, 95, 116, 121, 112, 101, 34, 58, 32, 34, 105, 110, 116, 54, 52, 34, 44, 32, 34, 110, 117, 109, 112,
        121, 95, 116, 121, 112, 101, 34, 58, 32, 34, 105, 110, 116, 54, 52, 34, 44, 32, 34, 109, 101, 116, 97, 100, 97,
        116, 97, 34, 58, 32, 110, 117, 108, 108, 125, 93, 44, 32, 34, 99, 114, 101, 97, 116, 111, 114, 34, 58, 32, 123,
        34, 108, 105, 98, 114, 97, 114, 121, 34, 58, 32, 34, 112, 121, 97, 114, 114, 111, 119, 34, 44, 32, 34, 118, 101,
        114, 115, 105, 111, 110, 34, 58, 32, 34, 49, 55, 46, 48, 46, 48, 34, 125, 44, 32, 34, 112, 97, 110, 100, 97,
        115, 95, 118, 101, 114, 115, 105, 111, 110, 34, 58, 32, 34, 50, 46, 50, 46, 50, 34, 125, 0, 24, 12, 65, 82, 82,
        79, 87, 58, 115, 99, 104, 101, 109, 97, 24, 192, 9, 47, 47, 47, 47, 47, 52, 103, 68, 65, 65, 65, 81, 65, 65, 65,
        65, 65, 65, 65, 75, 65, 65, 52, 65, 66, 103, 65, 70, 65, 65, 103, 65, 67, 103, 65, 65, 65, 65, 65, 66, 66, 65,
        65, 81, 65, 65, 65, 65, 65, 65, 65, 75, 65, 65, 119, 65, 65, 65, 65, 69, 65, 65, 103, 65, 67, 103, 65, 65, 65,
        76, 65, 67, 65, 65, 65, 69, 65, 65, 65, 65, 65, 81, 65, 65, 65, 65, 119, 65, 65, 65, 65, 73, 65, 65, 119, 65,
        66, 65, 65, 73, 65, 65, 103, 65, 65, 65, 67, 73, 65, 103, 65, 65, 66, 65, 65, 65, 65, 72, 115, 67, 65, 65, 66,
        55, 73, 109, 108, 117, 90, 71, 86, 52, 88, 50, 78, 118, 98, 72, 86, 116, 98, 110, 77, 105, 79, 105, 66, 98, 101,
        121, 74, 114, 97, 87, 53, 107, 73, 106, 111, 103, 73, 110, 74, 104, 98, 109, 100, 108, 73, 105, 119, 103, 73,
        109, 53, 104, 98, 87, 85, 105, 79, 105, 66, 117, 100, 87, 120, 115, 76, 67, 65, 105, 99, 51, 82, 104, 99, 110,
        81, 105, 79, 105, 65, 119, 76, 67, 65, 105, 99, 51, 82, 118, 99, 67, 73, 54, 73, 68, 85, 115, 73, 67, 74, 122,
        100, 71, 86, 119, 73, 106, 111, 103, 77, 88, 49, 100, 76, 67, 65, 105, 89, 50, 57, 115, 100, 87, 49, 117, 88,
        50, 108, 117, 90, 71, 86, 52, 90, 88, 77, 105, 79, 105, 66, 98, 101, 121, 74, 117, 89, 87, 49, 108, 73, 106,
        111, 103, 98, 110, 86, 115, 98, 67, 119, 103, 73, 109, 90, 112, 90, 87, 120, 107, 88, 50, 53, 104, 98, 87, 85,
        105, 79, 105, 66, 117, 100, 87, 120, 115, 76, 67, 65, 105, 99, 71, 70, 117, 90, 71, 70, 122, 88, 51, 82, 53, 99,
        71, 85, 105, 79, 105, 65, 105, 100, 87, 53, 112, 89, 50, 57, 107, 90, 83, 73, 115, 73, 67, 74, 117, 100, 87, 49,
        119, 101, 86, 57, 48, 101, 88, 66, 108, 73, 106, 111, 103, 73, 109, 57, 105, 97, 109, 86, 106, 100, 67, 73, 115,
        73, 67, 74, 116, 90, 88, 82, 104, 90, 71, 70, 48, 89, 83, 73, 54, 73, 72, 115, 105, 90, 87, 53, 106, 98, 50, 82,
        112, 98, 109, 99, 105, 79, 105, 65, 105, 86, 86, 82, 71, 76, 84, 103, 105, 102, 88, 49, 100, 76, 67, 65, 105,
        89, 50, 57, 115, 100, 87, 49, 117, 99, 121, 73, 54, 73, 70, 116, 55, 73, 109, 53, 104, 98, 87, 85, 105, 79, 105,
        65, 105, 97, 87, 81, 105, 76, 67, 65, 105, 90, 109, 108, 108, 98, 71, 82, 102, 98, 109, 70, 116, 90, 83, 73, 54,
        73, 67, 74, 112, 90, 67, 73, 115, 73, 67, 74, 119, 89, 87, 53, 107, 89, 88, 78, 102, 100, 72, 108, 119, 90, 83,
        73, 54, 73, 67, 74, 112, 98, 110, 81, 50, 78, 67, 73, 115, 73, 67, 74, 117, 100, 87, 49, 119, 101, 86, 57, 48,
        101, 88, 66, 108, 73, 106, 111, 103, 73, 109, 108, 117, 100, 68, 89, 48, 73, 105, 119, 103, 73, 109, 49, 108,
        100, 71, 70, 107, 89, 88, 82, 104, 73, 106, 111, 103, 98, 110, 86, 115, 98, 72, 48, 115, 73, 72, 115, 105, 98,
        109, 70, 116, 90, 83, 73, 54, 73, 67, 74, 117, 89, 87, 49, 108, 73, 105, 119, 103, 73, 109, 90, 112, 90, 87,
        120, 107, 88, 50, 53, 104, 98, 87, 85, 105, 79, 105, 65, 105, 98, 109, 70, 116, 90, 83, 73, 115, 73, 67, 74,
        119, 89, 87, 53, 107, 89, 88, 78, 102, 100, 72, 108, 119, 90, 83, 73, 54, 73, 67, 74, 49, 98, 109, 108, 106, 98,
        50, 82, 108, 73, 105, 119, 103, 73, 109, 53, 49, 98, 88, 66, 53, 88, 51, 82, 53, 99, 71, 85, 105, 79, 105, 65,
        105, 98, 50, 74, 113, 90, 87, 78, 48, 73, 105, 119, 103, 73, 109, 49, 108, 100, 71, 70, 107, 89, 88, 82, 104,
        73, 106, 111, 103, 98, 110, 86, 115, 98, 72, 48, 115, 73, 72, 115, 105, 98, 109, 70, 116, 90, 83, 73, 54, 73,
        67, 74, 104, 90, 50, 85, 105, 76, 67, 65, 105, 90, 109, 108, 108, 98, 71, 82, 102, 98, 109, 70, 116, 90, 83, 73,
        54, 73, 67, 74, 104, 90, 50, 85, 105, 76, 67, 65, 105, 99, 71, 70, 117, 90, 71, 70, 122, 88, 51, 82, 53, 99, 71,
        85, 105, 79, 105, 65, 105, 97, 87, 53, 48, 78, 106, 81, 105, 76, 67, 65, 105, 98, 110, 86, 116, 99, 72, 108,
        102, 100, 72, 108, 119, 90, 83, 73, 54, 73, 67, 74, 112, 98, 110, 81, 50, 78, 67, 73, 115, 73, 67, 74, 116, 90,
        88, 82, 104, 90, 71, 70, 48, 89, 83, 73, 54, 73, 71, 53, 49, 98, 71, 120, 57, 88, 83, 119, 103, 73, 109, 78,
        121, 90, 87, 70, 48, 98, 51, 73, 105, 79, 105, 66, 55, 73, 109, 120, 112, 89, 110, 74, 104, 99, 110, 107, 105,
        79, 105, 65, 105, 99, 72, 108, 104, 99, 110, 74, 118, 100, 121, 73, 115, 73, 67, 74, 50, 90, 88, 74, 122, 97,
        87, 57, 117, 73, 106, 111, 103, 73, 106, 69, 51, 76, 106, 65, 117, 77, 67, 74, 57, 76, 67, 65, 105, 99, 71, 70,
        117, 90, 71, 70, 122, 88, 51, 90, 108, 99, 110, 78, 112, 98, 50, 52, 105, 79, 105, 65, 105, 77, 105, 52, 121,
        76, 106, 73, 105, 102, 81, 65, 71, 65, 65, 65, 65, 99, 71, 70, 117, 90, 71, 70, 122, 65, 65, 65, 68, 65, 65, 65,
        65, 100, 65, 65, 65, 65, 68, 81, 65, 65, 65, 65, 69, 65, 65, 65, 65, 113, 80, 47, 47, 47, 119, 65, 65, 65, 81,
        73, 81, 65, 65, 65, 65, 70, 65, 65, 65, 65, 65, 81, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 119, 65, 65, 65, 71,
        70, 110, 90, 81, 67, 89, 47, 47, 47, 47, 65, 65, 65, 65, 65, 85, 65, 65, 65, 65, 68, 85, 47, 47, 47, 47, 65, 65,
        65, 66, 66, 82, 65, 65, 65, 65, 65, 99, 65, 65, 65, 65, 66, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 69, 65, 65,
        65, 65, 98, 109, 70, 116, 90, 81, 65, 65, 65, 65, 65, 69, 65, 65, 81, 65, 66, 65, 65, 65, 65, 66, 65, 65, 70,
        65, 65, 73, 65, 65, 89, 65, 66, 119, 65, 77, 65, 65, 65, 65, 69, 65, 65, 81, 65, 65, 65, 65, 65, 65, 65, 66, 65,
        104, 65, 65, 65, 65, 65, 99, 65, 65, 65, 65, 66, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 67, 65, 65, 65, 65, 97,
        87, 81, 65, 65, 65, 103, 65, 68, 65, 65, 73, 65, 65, 99, 65, 67, 65, 65, 65, 65, 65, 65, 65, 65, 65, 70, 65, 65,
        65, 65, 65, 0, 24, 32, 112, 97, 114, 113, 117, 101, 116, 45, 99, 112, 112, 45, 97, 114, 114, 111, 119, 32, 118,
        101, 114, 115, 105, 111, 110, 32, 49, 55, 46, 48, 46, 48, 25, 60, 28, 0, 0, 28, 0, 0, 28, 0, 0, 0, 208, 8, 0, 0,
        80, 65, 82, 49,
      ];
      const brotliCompressedBuffer = buffer.Buffer.from(uint8Array);
      const reader = await parquetjs.ParquetReader.openBuffer(brotliCompressedBuffer);
      const data: any[] = [];
      for await (const record of reader) {
        data.push(record);
      }
      assert.equal(data.length, 5);
      after(async function () {
        await reader.close();
      });
    });
  });
});
