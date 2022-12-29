import { HandlerProps } from '../../types/common'
import { AIPhandler } from './aip'

const address = '1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3'

const querySchema = [
    { hashing_algorithm: 'string' },
    { signing_algorithm: 'string' },
    { signing_address: 'string' },
    { signature: 'string' },
    { index_unit_size: 'number' },
    [{ index: 'binary' }],
]

// https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md
const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
    if (!tape) {
        throw new Error(`Invalid HAIP tx. Bad tape`)
    }
    if (!tx) {
        throw new Error(`Invalid HAIP tx.`)
    }
    return await AIPhandler(querySchema, 'HAIP', dataObj, cell, tape, tx)
}

export const HAIP = {
    name: 'HAIP',
    address,
    querySchema,
    handler,
}
