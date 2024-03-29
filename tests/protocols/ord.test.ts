import { describe, expect, test } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { bobFromRawTx } from '../../src/bmap'
import { ORD } from '../../src/protocols/ord'

import { Cell, Out } from 'bpu-ts'
import { BmapTx } from '../../types/common'

let ordHex = fs.readFileSync(
    path.resolve(
        __dirname,
        '../data/10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6.hex'
    ),
    'utf8'
)

describe('Ord', () => {
    test('ord protocol definition', () => {
        expect(typeof ORD.name).toEqual('string')
        expect(typeof ORD.handler).toEqual('function')
    })

    test('parse invalid tx', () => {
        const dataObj = {} as BmapTx
        const cell = [] as Cell[]
        expect(() => {
            ORD.handler({ dataObj, cell })
        }).toThrow()
    })

    test('parse tx - output 0', async () => {
        const dataObj = {} as BmapTx
        const tx = await bobFromRawTx(ordHex)
        expect(tx).toBeTruthy()
        expect(tx.tx?.h).toEqual(
            '10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6'
        )
        if (tx && tx.out[0] && tx.out[0].tape) {
            const cell = tx.out[0].tape[0].cell as Cell[]
            const out = tx.out[0] as Out

            ORD.handler({ dataObj, cell, out })

            expect(dataObj['ORD']).toBeDefined()

            expect(Array.isArray(dataObj['ORD'])).toBe(true)

            expect(dataObj['ORD'] && dataObj['ORD'][0].contentType).toBe(
                'model/gltf-binary'
            )
            expect(dataObj['ORD'] && dataObj['ORD'][0].data).toBe(
                'Z2xURgIAAABobgwAbAcAAEpTT057ImFzc2V0Ijp7ImdlbmVyYXRvciI6Ik1pY3Jvc29mdCBHTFRGIEV4cG9ydGVyIDIuOC4zLjQwIiwidmVyc2lvbiI6IjIuMCJ9LCJhY2Nlc3NvcnMiOlt7ImJ1ZmZlclZpZXciOjAsImNvbXBvbmVudFR5cGUiOjUxMjUsImNvdW50IjozNDgsInR5cGUiOiJTQ0FMQVIifSx7ImJ1ZmZlclZpZXciOjEsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjozNDgsInR5cGUiOiJWRUMzIiwibWF4IjpbMC4zNjIyNjQ5OTA4MDY1Nzk2LDEuMTU1ODU4OTkzNTMwMjczNSwwLjQwOTIwNjAwMjk1MDY2ODM2XSwibWluIjpbLTAuNDUyMjI4OTkzMTc3NDEzOTYsLTAuNjI1MDc5OTg5NDMzMjg4NiwtMC40MDY1NDk5OTAxNzcxNTQ1Nl19LHsiYnVmZmVyVmlldyI6MiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjM0OCwidHlwZSI6IlZFQzMifSx7ImJ1ZmZlclZpZXciOjMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjozNDgsInR5cGUiOiJWRUM0In0seyJidWZmZXJWaWV3Ijo0LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MzQ4LCJ0eXBlIjoiVkVDMiJ9XSwiYnVmZmVyVmlld3MiOlt7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MCwiYnl0ZUxlbmd0aCI6MTM5MiwidGFyZ2V0IjozNDk2M30seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjEzOTIsImJ5dGVMZW5ndGgiOjQxNzYsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NTY4LCJieXRlTGVuZ3RoIjo0MTc2LCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6OTc0NCwiYnl0ZUxlbmd0aCI6NTU2OCwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjE1MzEyLCJieXRlTGVuZ3RoIjoyNzg0LCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MTgwOTYsImJ5dGVMZW5ndGgiOjc5NDY2OX1dLCJidWZmZXJzIjpbeyJieXRlTGVuZ3RoIjo4MTI3NjV9XSwiaW1hZ2VzIjpbeyJidWZmZXJWaWV3Ijo1LCJtaW1lVHlwZSI6ImltYWdlL3BuZyJ9XSwibWF0ZXJpYWxzIjpbeyJwYnJNZXRhbGxpY1JvdWdobmVzcyI6eyJiYXNlQ29sb3JUZXh0dXJlIjp7ImluZGV4IjowfSwibWV0YWxsaWNGYWN0b3IiOjAuMCwicm91Z2huZXNzRmFjdG9yIjowLjEwOTgwMzkyOTkyNDk2NDl9LCJkb3VibGVTaWRlZCI6dHJ1ZX1dLCJtZXNoZXMiOlt7InByaW1pdGl2ZXMiOlt7ImF0dHJpYnV0ZXMiOnsiVEFOR0VOVCI6MywiTk9STUFMIjoyLCJQT1NJVElPTiI6MSwiVEVYQ09PUkRfMCI6NH0sImluZGljZXMiOjAsIm1hdGVyaWFsIjowfV19XSwibm9kZXMiOlt7ImNoaWxkcmVuIjpbMV0sInJvdGF0aW9uIjpbLTAuNzA3MTA2NzA5NDgwMjg1NiwwLjAsLTAuMCwwLjcwNzEwNjgyODY4OTU3NTJdLCJzY2FsZSI6WzEuMCwwLjk5OTk5OTk0MDM5NTM1NTIsMC45OTk5OTk5NDAzOTUzNTUyXSwibmFtZSI6IlJvb3ROb2RlIChnbHRmIG9yaWVudGF0aW9uIG1hdHJpeCkifSx7ImNoaWxkcmVuIjpbMl0sIm5hbWUiOiJSb290Tm9kZSAobW9kZWwgY29ycmVjdGlvbiBtYXRyaXgpIn0seyJjaGlsZHJlbiI6WzNdLCJyb3RhdGlvbiI6WzAuNzA3MTA2NzY5MDg0OTMwNCwwLjAsMC4wLDAuNzA3MTA2NzY5MDg0OTMwNF0sIm5hbWUiOiI5MzcwMjFkNDkyYjM0ZjBlOWM4NDU3YjBmMTNhYTBmZS5mYngifSx7ImNoaWxkcmVuIjpbNF0sIm5hbWUiOiJSb290Tm9kZSJ9LHsiY2hpbGRyZW4iOls1XSwibmFtZSI6ImNyeXN0YWxMb3c6TWVzaCJ9LHsibWVzaCI6MCwibmFtZSI6ImNyeXN0YWxMb3c6TWVzaF9sYW1iZXJ0NF8wIn1dLCJzYW1wbGVycyI6W3sibWFnRmlsdGVyIjo5NzI5LCJtaW5GaWx0ZXIiOjk5ODd9XSwic2NlbmVzIjpbeyJub2RlcyI6WzBdfV0sInRleHR1cmVzIjpbeyJzYW1wbGVyIjowLCJzb3VyY2UiOjB9XSwic2NlbmUiOjB94GYMAEJJTgAAAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAzAAAANAAAADUAAAA2AAAANwAAADgAAAA5AAAAOgAAADsAAAA8AAAAPQAAAD4AAAA='
            )
        }
    })
})
