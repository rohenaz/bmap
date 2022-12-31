import { HandlerProps, Protocol } from '../../types/common'
import { bmapQuerySchemaHandler } from '../utils'

const address = '1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT'

const querySchema = [
    { type: 'string' },
    { hash: 'string' },
    { sequence: 'string' },
]

export const handler = ({ dataObj, cell, tx }: HandlerProps) => {
    if (!tx) {
        throw new Error(`Invalid BAP tx, tx required`)
    }
    bmapQuerySchemaHandler('BAP', querySchema, dataObj, cell, tx)
}

export const BAP: Protocol = {
    name: 'BAP',
    address,
    querySchema,
    handler,
}
