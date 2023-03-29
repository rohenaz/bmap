import { describe, expect, test } from '@jest/globals'
import { B } from '../../src/protocols/b'
import { BmapTx, BobTx, Cell } from '../../types/common'
import indexedTransaction from '../data/b-aip-transaction-with-indexes.json'
import badFieldsTransaction from '../data/b-bad-fields-transaction.json'
import bitpicTransactions from '../data/b-bitpic-transactions.json'
import bSocial from '../data/bsocial-2-b-outputs.json'
import mapTransactions from '../data/map-transactions.json'

describe('b', () => {
    test('protocol definition', () => {
        expect(typeof B.name).toEqual('string')
        expect(typeof B.address).toEqual('string')
        expect(typeof B.opReturnSchema).toEqual('object')
        expect(typeof B.handler).toEqual('function')
    })

    test('parse invalid tx', () => {
        const dataObj = {} as BmapTx
        const cell: Cell[] = []
        const tx = {} as BobTx
        expect(() => {
            B.handler({ dataObj, cell, tape: [], tx })
        }).toThrow()
    })

    test('parse tx', () => {
        const dataObj = {} as BmapTx
        let itx = indexedTransaction as BobTx
        if (itx) {
            let firstOutput = itx.out[0]
            if (firstOutput && firstOutput.tape) {
                const { cell } = firstOutput.tape[1]
                const { tape } = firstOutput
                const tx = indexedTransaction as BobTx

                B.handler({ dataObj, cell, tape, tx })
                expect(dataObj.B && typeof dataObj.B).toEqual('object')
                expect(dataObj.B && dataObj.B[0].content).toEqual(
                    'Hello world!'
                )
                expect(dataObj.B && dataObj.B[0]['content-type']).toEqual(
                    'text/plain'
                )
                expect(dataObj.B && dataObj.B[0].encoding).toEqual('utf-8')
                expect(dataObj.B && dataObj.B[0].filename).toEqual('\u0000')
            }
        } else {
            throw new Error(`Invalid transaction`)
        }
    })

    test('parse tx without encoding', () => {
        const dataObj = {} as BmapTx
        const cell = JSON.parse(
            JSON.stringify(indexedTransaction.out[0].tape[1].cell)
        )
        // remove encoding, parser should try to infer
        cell[3].s = ''
        cell[3].h = ''
        cell[3].b = ''
        const { tape } = indexedTransaction.out[0]
        const tx = indexedTransaction as unknown as BmapTx

        B.handler({ dataObj, cell, tape, tx })
        expect(dataObj.B && typeof dataObj.B[0]).toEqual('object')
        expect(dataObj.B && dataObj.B[0].content).toEqual('Hello world!')
        expect(dataObj.B && dataObj.B[0]['content-type']).toEqual('text/plain')
        expect(dataObj.B && dataObj.B[0].encoding).toEqual('utf-8')
        expect(dataObj.B && dataObj.B[0].filename).toEqual('\u0000')
    })

    test('parse tx with too many fields for schema', () => {
        // too many fields for schema, should warn
        const dataObj = {} as BmapTx
        const tx = badFieldsTransaction as BobTx
        const { tape } = tx.out[0]
        if (tape) {
            const cell = JSON.parse(JSON.stringify(tape[1].cell))
            expect(() => {
                B.handler({ dataObj, cell, tape, tx })
            }).toThrow()
        }
    })

    test('parse tx without filename', () => {
        const dataObj = {} as BmapTx
        const cell = JSON.parse(
            JSON.stringify(indexedTransaction.out[0].tape[1].cell)
        )
        // remove encoding, parser should try to infer
        cell[4].s = ''
        cell[4].h = ''
        cell[4].b = ''
        const { tape } = indexedTransaction.out[0]
        const tx = indexedTransaction

        B.handler({ dataObj, cell, tape, tx })
        expect(dataObj.B && typeof dataObj.B[0]).toEqual('object')
        expect(dataObj.B && dataObj.B[0].content).toEqual('Hello world!')
        expect(dataObj.B && dataObj.B[0]['content-type']).toEqual('text/plain')
        expect(dataObj.B && dataObj.B[0].encoding).toEqual('utf-8')
        expect(dataObj.B && dataObj.B[0].filename).toEqual('')
    })

    test('parse bitpic', () => {
        const dataObj = {} as BmapTx
        const tx = bitpicTransactions[0] as BobTx
        const { tape } = tx.out[0]
        if (tape) {
            const { cell } = tape[1]
            B.handler({ dataObj, cell, tape, tx })
            expect(dataObj.B && typeof dataObj.B[0]).toEqual('object')
            expect(dataObj.B && dataObj.B[0].content).toEqual(
                'bitfs://7fde64ea6989985719b72032c77fd2042428fb2f94958fdbba1ec2ae8044e5cc.out.0.3'
            )
            expect(dataObj.B && dataObj.B[0]['content-type']).toEqual(
                'image/jpeg'
            )
            expect(dataObj.B && dataObj.B[0].encoding).toEqual('binary')
            expect(dataObj.B && dataObj.B[0].filename).toEqual(undefined)
        }
    })

    test('bsocial tx with image', () => {
        const dataObj = {} as BmapTx
        const tx = mapTransactions[7]
        const { tape } = tx.out[0]
        const { cell } = tape[1]
        B.handler({ dataObj, cell, tape, tx })
        expect(dataObj.B && typeof dataObj.B[0]).toEqual('object')
        expect(dataObj.B && dataObj.B[0].content).toEqual(
            'bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3'
        )
        expect(dataObj.B && dataObj.B[0]['content-type']).toEqual('image/jpeg')
        expect(dataObj.B && dataObj.B[0].encoding).toEqual(undefined)
        expect(dataObj.B && dataObj.B[0].filename).toEqual(undefined)
    })

    test('bsocial tx with image - no encoding', () => {
        const dataObj = {} as BmapTx
        const tx = bSocial[0] as BobTx
        const { tape } = tx.out[0]
        if (tape) {
            // first image
            const { cell } = tape[2]
            B.handler({ dataObj, cell, tape, tx })

            expect(dataObj.B && typeof dataObj.B[0]).toEqual('object')
            expect(dataObj.B && dataObj.B[0].content).toEqual('')
            expect(dataObj.B && dataObj.B[0]['content-type']).toEqual(
                'image/png'
            )
            expect(dataObj.B && dataObj.B[0].encoding).toEqual('binary')
            expect(dataObj.B && dataObj.B[0].filename).toEqual(undefined)
        }
    })
})
