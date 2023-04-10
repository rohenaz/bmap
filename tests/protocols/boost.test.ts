import { describe, expect, test } from '@jest/globals'
import { BOOST } from '../../src/protocols/boost'

import { Cell, Out, Tape } from 'bpu-ts/src/types/common'
import { BmapTx, BobTx } from '../../types/common'
import boostTransaction from '../data/boost-transaction.json'

describe('boost', () => {
    test('protocol definition', () => {
        expect(typeof BOOST.name).toEqual('string')
        expect(typeof BOOST.handler).toEqual('function')
        expect(typeof BOOST.address).toEqual('string')
    })

    test('parse invalid tx', () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        expect(() => {
            BOOST.handler({ dataObj, cell })
        }).toThrow()
    })

    test('parse tx', () => {
        const dataObj = {} as BmapTx
        const tx = boostTransaction as BobTx
        const cell = boostTransaction.out[4].tape[0].cell as Cell[]
        const tape = boostTransaction.out[4].tape as Tape[]
        const out = boostTransaction.out[4] as Out

        BOOST.handler({ dataObj, cell, tx, tape, out })

        expect(Array.isArray(dataObj.BOOST)).toBe(true)
        expect(dataObj.BOOST && typeof dataObj.BOOST[0]).toEqual('object')
    })
})
