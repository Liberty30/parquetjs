import Long = require('long')
import {expect} from "chai"
import * as sinon from "sinon"
import {makeListN, randInt, times} from "./util/general";
import SplitBlockBloomFilter from "../lib/bloom/sbbf";

describe("Split Block Bloom Filters", () => {
    const expectedDefaultBytes = 29920

    it("Mask works", () => {
        const testMaskX = Long.fromString("deadbeef", true, 16);
        const testMaskRes = SplitBlockBloomFilter.mask(testMaskX)

        // all mask values should have exactly one bit set
        const expectedVals = [
            1 << 29,
            1 << 15,
            1 << 12,
            1 << 14,
            1 << 13,
            1 << 25,
            1 << 24,
            1 << 21
        ]
        for (let i = 0; i < expectedVals.length; i++) {
            expect(testMaskRes[i]).to.eq(expectedVals[i])
        }
    })
    it("block insert + check works", () => {
        let blk = SplitBlockBloomFilter.initBlock()
        let isInsertedX: Long = Long.fromString("6f6f6f6f6", true, 16)
        let isInsertedY: Long = Long.fromString("deadbeef", true, 16)
        let notInsertedZ: Long = Long.fromNumber(3)

        SplitBlockBloomFilter.blockInsert(blk, isInsertedX)

        expect(SplitBlockBloomFilter.blockCheck(blk, isInsertedX)).to.eq(true)
        expect(SplitBlockBloomFilter.blockCheck(blk, isInsertedY)).to.eq(false)
        expect(SplitBlockBloomFilter.blockCheck(blk, notInsertedZ)).to.eq(false)

        SplitBlockBloomFilter.blockInsert(blk, isInsertedY)
        expect(SplitBlockBloomFilter.blockCheck(blk, isInsertedY)).to.eq(true)
        expect(SplitBlockBloomFilter.blockCheck(blk, notInsertedZ)).to.eq(false)

        makeListN(50, () => {// declare module "parquet" {
//     interface ParquetEnvelopeReader {
//         read(offset: number, length: number): Promise<any>
//         getCursor(columnList?: any): any
//     }
//     interface ParquetReader {
//         openFile(filePath: string, options?: any): any
//
//         openUrl(request: any, params: any, options?: any): any
//     }
//     type schemaPath = string|Array<string>
//     interface ParquetSchema {
//         findField(path:schemaPath):any
//         findFieldBranch(path:any):any
//         buildFields(schema:ParquetSchema,
//                     rLevelParentMax:number,
//                     dLevelParentMax:number,
//                     path:schemaPath):any
//         listFields(fields: Array<string>):any
//     }
//
//
//     interface ParquetWriter{
//         openFile(schema:ParquetSchema, path:schemaPath, opts?:any):ParquetWriter
//         openStream(schema:ParquetSchema, outputStream: Buffer, opts?:any): ParquetWriter
//
//         appendRow(row: any): void
//         close(callback?: Function):void
//         setMetadata(key:any, value:any):void
//         setRowGroupSize(cnt:number): void
//         setPageSize(cnt:number): void
//     }
// }

            SplitBlockBloomFilter.blockInsert(
                blk,
                new Long(randInt(2 ** 30), randInt(2 ** 30), true)
            )
        })

        expect(SplitBlockBloomFilter.blockCheck(blk, isInsertedX)).to.eq(true)
        expect(SplitBlockBloomFilter.blockCheck(blk, isInsertedY)).to.eq(true)
        expect(SplitBlockBloomFilter.blockCheck(blk, notInsertedZ)).to.eq(false)
    })

    const exes = [
        new Long(0xFFFFFFFF, 0x7FFFFFFF, true),
        new Long(0xABCDEF98, 0x70000000, true),
        new Long(0xDEADBEEF, 0x7FFFFFFF, true),
        new Long(0x0, 0x7FFFFFFF, true),
        new Long(0xC0FFEE3, 0x0, true),
        new Long(0x0, 0x1, true),
        new Long(793516929, -2061372197, true) // regression test; this one was failing get blockIndex
    ]
    const badVal = Long.fromNumber(0xfafafafa, true)

    it("filter insert + check works", () => {
        const zees = [32, 128, 1024, 99]

        zees.forEach((z) => {
            const filter = new SplitBlockBloomFilter().setOptionNumFilterBytes(z).init()
            exes.forEach((x) => {
                filter.insert(x)
            })
            exes.forEach((x) => expect(filter.check(x)).to.eq(true))
            expect(filter.check(badVal)).to.eq(false)
        })
    })
    it("number of filter bytes is set to defaults on init", () => {
        const filter = new SplitBlockBloomFilter().init()
        exes.forEach((x) => {
            filter.insert(x)
        })
        exes.forEach((x) => expect(filter.check(x)).to.eq(true))
        expect(filter.check(badVal)).to.eq(false)
        expect(filter.getNumFilterBytes()).to.eq(expectedDefaultBytes)
    })

    describe("setOptionNumBytes", () => {
        it("does not set invalid values", () => {
            const filter = new SplitBlockBloomFilter().init()
            const filterBytes = filter.getNumFilterBytes()
            const badZees = [-1, 512, 1023]

            badZees.forEach((bz) => {
                const spy = sinon.spy(console, "error")
                filter.setOptionNumFilterBytes(bz)
                expect(filter.getNumFilterBytes()).to.eq(filterBytes)
                expect(spy.calledOnce)
                spy.restore()
            })
        })
        it("sets filter bytes to next power of 2", () => {
            let filter = new SplitBlockBloomFilter().init()
            expect(filter.getNumFilterBytes()).to.eq(expectedDefaultBytes)

            filter = new SplitBlockBloomFilter()
                .setOptionNumFilterBytes(1024)
                .init()
            expect(filter.getNumFilterBytes()).to.eq(1024)

            filter = new SplitBlockBloomFilter().setOptionNumFilterBytes(1025).init()
            expect(filter.getNumFilterBytes()).to.eq(2048)

            const below2 = 2 ** 12 - 1
            filter = new SplitBlockBloomFilter().setOptionNumFilterBytes(below2).init()
            expect(filter.getNumFilterBytes()).to.eq(2 ** 12)
        })
        it("can't be set twice after initializing", () => {
            const spy = sinon.spy(console, "error")
            const filter = new SplitBlockBloomFilter()
                .setOptionNumFilterBytes(333333)
                .setOptionNumFilterBytes(2 ** 20)
                .init()
            expect(spy.notCalled)
            filter.setOptionNumFilterBytes(44444)
            expect(spy.calledOnce)
            expect(filter.getNumFilterBytes()).to.eq(2 ** 20)
            spy.restore()
        })
    })

    describe("setOptionFalsePositiveRate", () => {
        it("can be set", () => {
            const filter = new SplitBlockBloomFilter().setOptionFalsePositiveRate(.001010)
            expect(filter.getFalsePositiveRate()).to.eq(.001010)
        })
        it("can't be set twice after initializing", () => {
            const spy = sinon.spy(console, "error")
            const filter = new SplitBlockBloomFilter()
                .setOptionFalsePositiveRate(.001010)
                .setOptionFalsePositiveRate(.002)
                .init()
            expect(spy.notCalled)
            filter.setOptionFalsePositiveRate(.0099)
            expect(spy.calledOnce)
            expect(filter.getFalsePositiveRate()).to.eq(.002)
            spy.restore()
        })
    })

    describe("setOptionNumDistinct", () => {
        it("can be set", () => {
            const filter = new SplitBlockBloomFilter().setOptionNumDistinct(10000)
            expect(filter.getNumDistinct()).to.eq(10000)
        })
        it("can't be set twice after initializing", () => {
            const spy = sinon.spy(console, "error")
            const filter = new SplitBlockBloomFilter()
                .setOptionNumDistinct(10000)
                .setOptionNumDistinct(9999)
            expect(spy.notCalled)
            filter.init().setOptionNumDistinct(38383)
            expect(filter.getNumDistinct()).to.eq(9999)
            expect(spy.calledOnce)
            spy.restore()
        })
    })

    describe("init", () => {
        it("does not allocate filter twice", () => {
            const spy = sinon.spy(console, "error")
            new SplitBlockBloomFilter().setOptionNumFilterBytes(1024).init().init()
            expect(spy.calledOnce)
            spy.restore()
        })
        it("allocates the filter", () => {
            const filter = new SplitBlockBloomFilter().setOptionNumFilterBytes(1024).init()
            expect(filter.getNumFilterBlocks()).to.eq(32)
            expect(filter.getFilter().length).to.eq(32)
        })
    })
    describe("optimal number of blocks", () => {
        // Some general ideas of what size filters are needed for different parameters
        // Note there is a small but non-negligible difference between this and what
        // is stated in https://github.com/apache/parquet-format/blob/master/BloomFilter.md
        it("can be called", () => {
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(13107, 0.0004)).to.eq(869)
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(26214, 0.0126)).to.eq(949)
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(52428, 0.18)).to.eq(997)

            expect(SplitBlockBloomFilter.optimalNumOfBlocks(25000, 0.001)).to.eq(1427)
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(50000, 0.0001)).to.eq(4111)
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(50000, 0.00001)).to.eq(5773)
            expect(SplitBlockBloomFilter.optimalNumOfBlocks(100000, 0.000001)).to.eq(15961)
        })

        it("sets good values", (done) => {
            const numDistinct = 100000
            const fpr = 0.01
            const filter = new SplitBlockBloomFilter()
                .setOptionNumDistinct(numDistinct)
                .setOptionFalsePositiveRate(fpr)
                .init()

            times(numDistinct, () => {
                const hashValue = new Long(randInt(2 ** 30), randInt(2 ** 30), true)
                filter.insert(hashValue)
                expect(filter.check(hashValue))
            })

            let falsePositive = 0
            times(numDistinct, () => {
                const notInFilter = new Long(randInt(2 ** 30), randInt(2 ** 30), true)
                if (!filter.check(notInFilter)) falsePositive++
            })

            if (falsePositive > 0) console.log("Found false positive: ", falsePositive)
            expect(falsePositive < (numDistinct * fpr))
            done()
        }).timeout(10000)
    })

    /**
     * Some of these test cases may seem redundant or superfluous. They're put here to
     * suggest how filter data might be inserted, or not.
     */
    describe("insert, check", () => {
         const pojo = {
            name: "William Shakespeare",
                preferredName: "Shakesey",
                url: "http://placekitten.com/800/600"
        }
        type testCase = { name: string, val: any }
        const testCases: Array<testCase> = [
            { name: "boolean", val: true },
            { name: "int number", val: 23423},
            { name: "float number", val: 23334.23},
            {name: "string", val: "hello hello hello"},
            {name: "UInt8Array", val: Uint8Array.from([0x1,0x4,0xa,0xb])},
            {name: "Long", val: new Long(randInt(2 ** 30), randInt(2 ** 30), true)},
            {name: "Buffer", val: Buffer.from("Hello Hello Hello")},
            {name: "BigInt", val: BigInt(1234324434440)},
            {name: "stringified object", val: JSON.stringify(pojo)},
            {name: "stringified array", val: [383838, 222, 5898, 1, 0].toString()}
         ]
        const filter = new SplitBlockBloomFilter().setOptionNumDistinct(1000).init()
        testCases.forEach(tc => {
            it(`works for a ${tc.name} type`, () => {
                filter.insert(tc.val)
                expect(filter.check(tc.val))
            })
        })

        const throwCases = [
            {name: "POJO", val: pojo },
            {name: "Array", val: [383838, 222, 5898, 1, 0]},
            {name: "Uint32Array", val: new Uint32Array(8).fill(39383)},
            {name: "Set", val: (new Set()).add("foo").add(5).add([1,2,3])},
            {name: "Map", val: new Map() }
        ]
        throwCases.forEach((tc) => {
            it(`throws on type ${tc.name}`, () => {
                expect(() => {
                    filter.insert(tc.val)
                }).to.throw(/unsupported type/)
            })
        })

    })
})
