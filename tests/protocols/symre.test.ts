import { describe, expect, test } from '@jest/globals'
import { Cell } from 'bpu-ts'
import { SYMRE } from '../../src/protocols/symre'
import { BmapTx, BobTx } from '../../types/common'
import symreTransactions from '../data/symre-haip-transactions.json'

describe('symre', () => {
    test('protocol definition', () => {
        expect(typeof SYMRE.name).toEqual('string')
        expect(typeof SYMRE.address).toEqual('string')
        expect(typeof SYMRE.opReturnSchema).toEqual('object')
        expect(typeof SYMRE.handler).toEqual('function')
    })

    test('parse invalid tx', () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        const tx = {} as BobTx
        expect(() => {
            SYMRE.handler({ dataObj, cell, tx })
        }).toThrow()
    })

    test('parse tx', () => {
        const dataObj = {} as BmapTx
        const { cell } = symreTransactions[0].out[0].tape[1]
        const tx = symreTransactions[0]

        SYMRE.handler({ dataObj, cell, tx })
        expect(dataObj.SYMRE && typeof dataObj.SYMRE[0]).toEqual('object')
        expect(dataObj.SYMRE && dataObj.SYMRE[0].url).toEqual(
            'https://medium.com/@Stas33496115/bitcoin-script-engineering-part-ii-ba8095f093c0'
        )
    })
})

// TODO: Test old Symre format (or just remove this if its unimportant)
// symre_old: [
//   'de6e22a88a7739325793941c53eab6c39b8f817e15f4e305ea6a084040f271f9',
// ],
