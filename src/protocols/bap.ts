import { HandlerProps } from '../../types/common'
import { bmapQuerySchemaHandler } from '../utils'

const address = '1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT'

const querySchema = [
    { type: 'string' },
    { hash: 'string' },
    { sequence: 'string' },
]

export const handler = ({ dataObj, cell, tape, tx }: HandlerProps) => {
    if (!tape) {
        throw new Error(`Invalid BAP tx, tape required`)
    }
    if (!tx) {
        throw new Error(`Invalid BAP tx, tx required`)
    }
    bmapQuerySchemaHandler('BAP', querySchema, dataObj, cell, tape, tx)
}

export const BAP = {
    name: 'BAP',
    address,
    querySchema,
    handler,
}
