import { describe, expect, test } from '@jest/globals'
import BPU from 'bpu-ts'
import { RON } from '../../src/protocols/ron'
import { BmapTx, BobTx, Cell } from '../../types/common'
import ronTransactions from '../data/ron-transactions.json'

describe('ron', () => {
    test('protocol definition', () => {
        expect(typeof RON.name).toEqual('string')
        expect(typeof RON.address).toEqual('string')
        expect(typeof RON.opReturnSchema).toEqual('object')
        expect(typeof RON.handler).toEqual('function')
    })

    test('parse invalid tx', () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        const tx = {} as BobTx
        expect(() => {
            RON.handler({ dataObj, cell, tx })
        }).toThrow()
    })

    test('parse tx', () => {
        const dataObj = {} as BmapTx
        const cell = ronTransactions[0].out[1].tape[1].cell
        const tx = ronTransactions[0]

        RON.handler({ dataObj, cell, tx })
        expect(dataObj.RON && typeof dataObj.RON[0]).toEqual('object')
        expect(dataObj.RON && dataObj.RON[0].pair).toEqual({
            USDZAR: '14.751981',
        })
        expect(dataObj.RON && dataObj.RON[0].address).toEqual(
            '1DRfVXbQTATHefCHTSKxniEEHySTi7CvKH'
        )
        expect(dataObj.RON && dataObj.RON[0].timestamp).toEqual(1574689916)
    })

    test('parse raw tx', async () => {
        // This tx was failing to parse on version 0.3.x
        const rawTx =
            '0100000001c95da08cbf8812772319c2c2b90a5be5b0c1114088f1dd625fb5af3fd2f507cf000000006b48304502210091e4b7edeb429f15bd1e6f6d44f8ff8c39950ccca1ca4d46dda5910cf9dd1eb702202e7341614f06fe64c4ee35df38fa1ed31a468deba7517f2ec0011b8994d079e04121021fd8f9c9f1c47f6f11ea5888be257117a3fafbfa5e98fa0478e40436e05829c3ffffffff02cde70400000000001976a914ac9049038c6bc731840a98a9432a046b3f6cb75088ac0000000000000000686a2231477646597a7774466978337153415a6845535156547a3944657564485a4e6f6831157b22555344434144223a22312e333233313235227d2231476a53353743785563396b61665a78666d3262636d714431514a583352736d565a0a3135373539313131393400000000'

        let tx = await BPU.parse({
            tx: { r: rawTx },
            split: [
                {
                    token: { op: 106 },
                    include: 'l',
                },
                {
                    token: { op: 0 },
                    include: 'l',
                },
                {
                    token: { s: '|' },
                },
            ],
        })

        const dataObj = {} as BmapTx
        let cell = tx.out[1].tape[1].cell as Cell[]

        RON.handler({ dataObj, cell, tx: tx as BobTx })
        expect(dataObj.RON && typeof dataObj.RON[0]).toEqual('object')
        expect(dataObj.RON && dataObj.RON[0].pair).toEqual({
            USDCAD: '1.323125',
        })
        expect(dataObj.RON && dataObj.RON[0].address).toEqual(
            '1GjS57CxUc9kafZxfm2bcmqD1QJX3RsmVZ'
        )
        expect(dataObj.RON && dataObj.RON[0].timestamp).toEqual(1575911194)
    })
})
