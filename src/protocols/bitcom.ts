import { HandlerProps, Protocol } from '../../types/common'
import { saveProtocolData } from '../utils'

const protocolAddress = '$'

const opReturnSchema = [
    {
        su: [
            { pubkey: 'string' },
            { sign_position: 'string' },
            { signature: 'string' },
        ],
        echo: [{ data: 'string' }, { to: 'string' }, { filename: 'string' }],
        route: [
            [
                {
                    add: [
                        { bitcom_address: 'string' },
                        { route_matcher: 'string' },
                        { endpoint_template: 'string' },
                    ],
                },
                {
                    enable: [{ path: 'string' }],
                },
            ],
        ],
        useradd: [{ address: 'string' }],
    },
]

// const handler = function (dataObj, protocolName, cell, tape, tx) {
const handler = ({ dataObj, cell }: HandlerProps) => {
    if (!cell.length || !cell.every((c) => c.s)) {
        throw new Error('Invalid Bitcom tx')
    }

    // gather up the string values
    const bitcomObj = cell.map((c) => (c && c.s ? c.s : ''))

    saveProtocolData(dataObj, 'BITCOM', bitcomObj)
}

export const BITCOM: Protocol = {
    name: 'BITCOM',
    address: protocolAddress,
    opReturnSchema,
    handler,
}
