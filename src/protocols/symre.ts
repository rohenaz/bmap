import { HandlerProps } from '../../types/common'
import { saveProtocolData } from '../utils'

const address = '1SymRe7erxM46GByucUWnB9fEEMgo7spd'

const querySchema = [{ url: 'string' }]

const handler = function ({ dataObj, cell, tx }: HandlerProps) {
    if (cell[0].s !== address || !cell[1] || !cell[1].s) {
        throw new Error(`Invalid SymRe tx: ${tx}`)
    }

    saveProtocolData(dataObj, 'SYMRE', { url: cell[1].s })
}

export const SYMRE = {
    name: 'SYMRE',
    address,
    querySchema,
    handler,
}
