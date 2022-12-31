import { HandlerProps, Protocol } from '../../types/common'
import { AIPhandler, SIGPROTO } from './aip'

const address = '15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA'

const querySchema = [
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
        querySchema,
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
    querySchema,
    handler,
}
