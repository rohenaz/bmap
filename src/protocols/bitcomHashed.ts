import { HandlerProps, Protocol } from '../../types/common'
import { AIPhandler, SIGPROTO } from './aip'

const address = '15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA'

const opReturnSchema = [
    { address: 'string' },
    { unknown_hex: 'string' },
    { unknown_binary: 'string' },
    { unknown_binary: 'binary' },
    { paymail: 'string' },
]

// https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md
const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
    if (!tape) {
        throw new Error(`Invalid BITCOM_HASHED tx. Bad tape`)
    }
    if (!tx) {
        throw new Error(`Invalid BITCOM_HASHED tx.`)
    }
    return await AIPhandler(
        opReturnSchema,
        SIGPROTO.BITCOM_HASHED,
        dataObj,
        cell,
        tape,
        tx
    )
}

export const BITCOM_HASHED: Protocol = {
    name: 'BITCOM_HASHED',
    address,
    opReturnSchema,
    handler,
}
