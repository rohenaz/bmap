import { describe, test } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { bobFromRawTx } from '../../src/bmap'

let bapHex = fs.readFileSync(
    path.resolve(
        __dirname,
        '../data/653947cee3268c26efdcc97ef4e775d990e49daf81ecd2555127bda22fe5a21f.hex'
    ),
    'utf8'
)

describe('bob', () => {
    test('from raw tx', async () => {
        const tx = await bobFromRawTx(bapHex)
        // console.log({ outs: JSON.stringify(tx.out, null, 2) })
        console.log({ outs: tx.out.length })
    })
})
