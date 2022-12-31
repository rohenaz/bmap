import { describe, expect, test } from '@jest/globals'
import { BITPIC } from '../../src/protocols/bitpic'
import { BmapTx, BobTx, Cell, Tape } from '../../types/common'
import bitpicTransactions from '../data/b-bitpic-transactions.json'

describe('bitpic', () => {
    test('protocol definition', () => {
        expect(typeof BITPIC.name).toEqual('string')
        expect(typeof BITPIC.address).toEqual('string')
        expect(typeof BITPIC.querySchema).toEqual('object')
        expect(typeof BITPIC.handler).toEqual('function')
    })

    test('parse invalid tx', async () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        const tx = {} as BobTx
        await expect(async () => {
            await BITPIC.handler({ dataObj, cell, tx })
        }).rejects.toThrow()
    })

    test('parse tx', async () => {
        const dataObj = {} as BmapTx
        const cell = bitpicTransactions[0].out[0].tape[2].cell as Cell[]
        const tape = bitpicTransactions[0].out[0].tape as Tape[]
        const tx = bitpicTransactions[0] as BobTx

        await BITPIC.handler({ dataObj, cell, tape, tx })

        expect(Array.isArray(dataObj.BITPIC)).toBe(true)

        expect(dataObj.BITPIC && typeof dataObj.BITPIC[0]).toEqual('object')
        expect(dataObj.BITPIC && dataObj.BITPIC[0].paymail).toEqual(
            '644@moneybutton.com'
        )
        expect(dataObj.BITPIC && dataObj.BITPIC[0].pubkey).toEqual(
            '03836714653ab7b17569be03eaf6593d59116700a226a3c812cc1f3b3c8f1cbd6c'
        )
        expect(dataObj.BITPIC && dataObj.BITPIC[0].signature).toEqual(
            'IJALxGtX2Ks+XiBChvQvNXsvVH5EBFnUXFLvrFsUTPwtKrkfPTZjWR88m2RIkW0oEqhKqh1JkqbAFm/G9SbsA/0='
        )
        // expect(dataObj.BITPIC && dataObj.BITPIC[0].verified).toEqual(true)
    })
})
