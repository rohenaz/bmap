import { findIndex } from 'lodash-es'
import { Cell, HandlerProps, Protocol } from '../../types/common'
import { Ord as OrdType } from '../../types/protocols/ord'
import { cellValue, saveProtocolData } from '../utils'

// const OrdScript =
//     'OP_FALSE OP_IF 6F7264 OP_1 <CONTENT_TYPE_PLACEHOLDER> OP_0 <DATA_PLACEHOLDER> OP_ENDIF'.split(
//         ' '
//     )

const scriptChecker = (cell: Cell[]) => {
    // TODO: What is the actual minimum length?
    if (cell.length < 11) {
        // wrong length
        return false
    }

    // Find OP_IF wrapper
    const startIdx = findIndex(cell, (c: Cell) => c.ops === 'OP_IF')
    const endIdx = findIndex(
        cell,
        (c: Cell, i: number) => i > startIdx && c.ops === 'OP_ENDIF'
    )
    const ordScript = cell.slice(startIdx, endIdx)
    const prevCell = cell[startIdx - 1]
    return (
        prevCell?.ops === 'OP_FALSE' &&
        !!ordScript[0] &&
        !!ordScript[1] &&
        ordScript[1].s == 'ord'
    )
}

const handler = ({ dataObj, cell, out }: HandlerProps): void => {
    if (!cell[0] || !out) {
        throw new Error(
            `Invalid Ord tx. dataObj, cell, out and tx are required.`
        )
    }

    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next

    // Find OP_IF wrapper
    const startIdx = findIndex(cell, (c: Cell) => c.ops === 'OP_IF')
    const endIdx = findIndex(
        cell,
        (c: Cell, i: number) => i > startIdx && c.ops === 'OP_ENDIF'
    )
    const ordScript = cell.slice(startIdx, endIdx)

    if (!ordScript[0] || !ordScript[1] || ordScript[1].s != 'ord') {
        throw new Error(`Invalid Ord tx. Prefix not found.`)
    }

    console.log({ ordScript })

    let data: string | undefined
    let contentType: string | undefined
    ordScript.forEach((push, idx, all) => {
        // content-type
        if (push.ops === 'OP_1') {
            contentType = cellValue(all[idx + 1], 'string') as string
        }
        // data
        if (push.ops === 'OP_0') {
            data = cellValue(all[idx + 1]) as string
        }
    })

    if (!data) {
        throw new Error(`Invalid Ord data.`)
    }
    if (!contentType) {
        throw new Error(`Invalid Ord content type.`)
    }

    const OrdObj: OrdType = {
        data,
        contentType,
    }

    saveProtocolData(dataObj, 'Ord', OrdObj)
}

export const Ord: Protocol = {
    name: 'Ord',
    handler,
    scriptChecker,
}
