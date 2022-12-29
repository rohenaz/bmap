import { HandlerProps } from '../../types/common'
import { saveProtocolData } from '../utils'

const address = '1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1'

const querySchema = [
    { pair: 'json' },
    { address: 'string' },
    { timestamp: 'string' },
]

const handler = function ({ dataObj, cell, tx }: HandlerProps) {
    if (
        cell[0].s !== address ||
        !cell[1] ||
        !cell[2] ||
        !cell[3] ||
        !cell[1].s ||
        !cell[2].s ||
        !cell[3].s
    ) {
        throw new Error(`Invalid RON record ${tx?.tx.h}`)
    }

    const pair = JSON.parse(cell[1].s)
    const timestamp = Number(cell[3].s)

    saveProtocolData(dataObj, 'RON', {
        pair,
        address: cell[2].s,
        timestamp,
    })
}

export const RON = {
    name: 'RON',
    address,
    querySchema,
    handler,
}
