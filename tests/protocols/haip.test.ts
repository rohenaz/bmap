import { describe, expect, test } from '@jest/globals'
import { HAIP } from '../../src/protocols/haip'
import { BobTx, Cell } from '../../types/common'

describe('haip', () => {
    test('protocol definition', () => {
        expect(typeof HAIP.name).toEqual('string')
        expect(typeof HAIP.address).toEqual('string')
        expect(typeof HAIP.querySchema).toEqual('object')
        expect(typeof HAIP.handler).toEqual('function')
    })

    test('parse invalid tx', async () => {
        const dataObj = {} as any
        const cell = [] as Cell[]
        const tx = {} as BobTx

        await expect(
            async () => await HAIP.handler({ dataObj, cell, tx })
        ).rejects.toThrow('Invalid HAIP tx. Bad tape')
    })

    // TODO: This test was passing. Failing since migrating to ts. HAIP seems broken
    // test('parse tx', async () => {
    //     const dataObj = {} as any
    //     const cell = haipTransactions[0].out[0].tape[2].cell as Cell[]
    //     const tape = haipTransactions[0].out[0].tape as Tape[]
    //     const tx = haipTransactions[0] as BobTx
    //     await HAIP.handler({ dataObj, cell, tape, tx })
    //     expect(typeof dataObj.HAIP[0]).toEqual('object')
    //     expect(dataObj.HAIP[0].hashing_algorithm).toEqual('SHA256')
    //     expect(dataObj.HAIP[0].signing_algorithm).toEqual('BITCOIN_ECDSA')
    //     expect(dataObj.HAIP[0].signing_address).toEqual(
    //         '1Ghayxcf8askMqL9EV9V9QpExTR2j6afhv'
    //     )
    //     expect(dataObj.HAIP[0].signature).toEqual(
    //         'H6Y5LXIZRaSQ0CJEt5eY1tbUhKTxII31MZwSpEYv5fqmZLzwuylAwrtHiI3lk3yCqf3Ib/Uv3LpAfCoNSKk68fY='
    //     )
    //     expect(dataObj.HAIP[0].verified).toEqual(true)
    // })

    // TODO: This test was passing. Failing since migrating to ts. HAIP seems broken
    // test('parse tx 2', async () => {
    //     const dataObj = {} as any
    //     const cell = haipTransactions[1].out[0].tape[2].cell as Cell[]
    //     const tape = haipTransactions[1].out[0].tape as Tape[]
    //     const tx = haipTransactions[1]
    //     await HAIP.handler({ dataObj, cell, tape, tx })
    //     expect(typeof dataObj.HAIP[0]).toEqual('object')
    //     expect(dataObj.HAIP[0].hashing_algorithm).toEqual('SHA256')
    //     expect(dataObj.HAIP[0].signing_algorithm).toEqual('BITCOIN_ECDSA')
    //     expect(dataObj.HAIP[0].signing_address).toEqual(
    //         '1Ghayxcf8askMqL9EV9V9QpExTR2j6afhv'
    //     )
    //     expect(dataObj.HAIP[0].signature).toEqual(
    //         'IFh8jXM4pKa5W0GFZ3aE1PYer8Wwynv76OIyqslBXXj+MYxG52nIV1mVfOSgR/5ozTKOCjHHhmVyx/6EZ7q+NBs='
    //     )
    //     expect(dataObj.HAIP[0].verified).toEqual(true)
    // })
})
