import { Cell, HandlerProps, Protocol } from '../../types/common'
import { ORD as OrdType } from '../../types/protocols/ord'
import { cellValue, saveProtocolData } from '../utils'

// const OrdScript =
//     'OP_FALSE OP_IF 6F7264 OP_1 <CONTENT_TYPE_PLACEHOLDER> OP_0 <DATA_PLACEHOLDER> OP_ENDIF'.split(
//         ' '
//     )

const scriptChecker = (cell: Cell[]) => {
    if (cell.length < 13) {
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
        prevCell?.op === 0 &&
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

    saveProtocolData(dataObj, 'ORD', OrdObj)
}

export const ORD: Protocol = {
    name: 'ORD',
    handler,
    scriptChecker,
}

function findIndex(array: any[], predicate: Function) {
    return findLastIndex(array, predicate)
}
function findLastIndex(array: any[], predicate: Function, fromIndex?: number) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return -1
    }
    let index = length - 1
    if (fromIndex !== undefined) {
        index = fromIndex
        index =
            fromIndex < 0
                ? Math.max(length + index, 0)
                : Math.min(index, length - 1)
    }
    return baseFindIndex(array, predicate, index, true)
}

function baseFindIndex(
    array: any[],
    predicate: Function,
    fromIndex: number,
    fromRight: boolean
) {
    const { length } = array
    let index = fromIndex + (fromRight ? 1 : -1)

    while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
            return index
        }
    }
    return -1
}
