import { Buffer } from 'buffer'
import crypto from 'crypto'
import { BobTx, Cell, Tape } from '../types/common'

export const isStringArray = (arr: Array<any>): boolean => {
    return (
        arr.length > 0 &&
        arr.every((value) => {
            return typeof value === 'string'
        })
    )
}
export const isObjectArray = (arr: Array<any>): boolean => {
    return (
        arr.length > 0 &&
        arr.every((value) => {
            return value === 'object'
        })
    )
}
/**
 * returns the BOB cell value for a given encoding
 *
 * @param pushData
 * @param schemaEncoding
 * @returns {string|number}
 */
export const cellValue = (
    pushData: Cell,
    schemaEncoding?: string
): string | number => {
    if (!pushData) {
        throw new Error(`cannot get cell value of: ${pushData}`)
    } else if (schemaEncoding === 'string') {
        return pushData['s'] ? pushData.s : pushData.ls || ''
    } else if (schemaEncoding === 'hex') {
        return pushData['h']
            ? pushData.h
            : pushData.lh ||
                  (pushData['b']
                      ? Buffer.from(pushData.b, 'base64').toString('hex')
                      : pushData.lb &&
                        Buffer.from(pushData.lb, 'base64').toString('hex')) ||
                  ''
    } else if (schemaEncoding === 'number') {
        return parseInt(pushData['h'] ? pushData.h : pushData.lh || '0', 16)
    } else if (schemaEncoding === 'file') {
        return `bitfs://${pushData['f'] ? pushData.f : pushData.lf}`
    }

    return (pushData['b'] ? pushData.b : pushData.lb) || ''
}

/**
 * Check a cell starts with OP_FALSE OP_RETURN -or- OP_RETURN
 *
 * @param cc
 * @returns {boolean}
 */
export const checkOpFalseOpReturn = function (cc: Tape) {
    return (
        (cc.cell[0] &&
            cc.cell[1] &&
            cc.cell[0].op === 0 &&
            cc.cell[1].op &&
            cc.cell[1].op === 106) ||
        cc.cell[0].op === 106
    )
}

/**
 * Helper function to store protocol data
 *
 * @param dataObj
 * @param protocolName
 * @param data
 */
export const saveProtocolData = (
    dataObj: { [key: string]: any },
    protocolName: string,
    data: any
) => {
    if (!dataObj[protocolName]) {
        dataObj[protocolName] = [data]
    } else {
        if (!Array.isArray(dataObj[protocolName])) {
            const prevData = dataObj[protocolName]
            dataObj[protocolName] = []
            dataObj[protocolName][0] = prevData
        }
        dataObj[protocolName][dataObj[protocolName].length] = data
    }
}

/**
 * BMAP default handler to work with query schema's
 *
 * @param opReturnSchema
 * @param protocolName
 * @param dataObj
 * @param cell
 * @param tape
 * @param tx
 */
export const bmapOpReturnSchemaHandler = function (
    protocolName: string,
    opReturnSchema: Object[],
    dataObj: Object,
    cell: Cell[],
    tx: BobTx
) {
    // loop over the schema
    const obj: { [key: string]: any } = {}

    // Does not have the required number of fields
    const length = opReturnSchema.length + 1
    if (cell.length < length) {
        throw new Error(
            `${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`
        )
    }

    for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
        const x = parseInt(idx, 10)

        const [field] = Object.keys(schemaField)
        const [schemaEncoding] = Object.values(schemaField)
        obj[field] = cellValue(cell[x + 1], schemaEncoding)
    }

    saveProtocolData(dataObj, protocolName, obj)
}

/**
 * Check whether the given data is base64
 *
 * @param data
 * @returns {boolean}
 */
export const isBase64 = function (data: string) {
    const regex =
        '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?'
    return new RegExp(`^${regex}$`, 'gi').test(data)
}

// hashes a message buffer, returns the hash as a buffer
export const sha256 = async (msgBuffer: Buffer) => {
    let hash: ArrayBuffer

    if (crypto.subtle) {
        hash = await crypto.subtle.digest('SHA-256', msgBuffer)
        return Buffer.from(hash)
    }
    // }
    return Buffer.from(new ArrayBuffer(0))
}
