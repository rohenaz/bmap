import { describe, expect, test } from '@jest/globals'
import { Cell, Out, Tape } from 'bpu-ts/src/types/common'
import { PSP } from '../../src/protocols/psp'
import { BmapTx, BobTx } from '../../types/common'

import mapTransactions from '../data/map-transactions.json'

describe('p2p', () => {
    test('protocol definition', () => {
        expect(typeof PSP.name).toEqual('string')
        expect(typeof PSP.address).toEqual('string')
        expect(typeof PSP.opReturnSchema).toEqual('object')
        expect(typeof PSP.handler).toEqual('function')
    })

    test('parse invalid tx', async () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        const tx = {} as BobTx
        await expect(PSP.handler({ dataObj, cell, tx })).rejects.toThrow(
            'Invalid Paymail Signature Protocol record'
        )
    })

    test('parse tx', async () => {
        const dataObj = {} as BmapTx
        const { cell } = mapTransactions[0].out[0].tape[2] as Tape
        const { tape } = mapTransactions[0].out[0] as Out
        const tx = mapTransactions[0] as BobTx

        await PSP.handler({ dataObj, cell, tape, tx })
        expect(dataObj.PSP && typeof dataObj.PSP[0]).toEqual('object')
        expect(dataObj.PSP && dataObj.PSP[0].paymail).toEqual(
            'hagbard@moneybutton.com'
        )
        expect(dataObj.PSP && dataObj.PSP[0].pubkey).toEqual(
            '02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0'
        )
        expect(dataObj.PSP && dataObj.PSP[0].signature).toEqual(
            'INKFb15MnAXqNQny+b4KAVnGNtymG0dHSu13+871+ti0WN5FBeA/7DgUn1tlw6F7odbW7IDrVePKTLrTPAiDqyo='
        )
        expect(dataObj.PSP && dataObj.PSP[0].verified).toEqual(true)
    })
})
