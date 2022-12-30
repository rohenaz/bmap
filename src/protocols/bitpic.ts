import { Address, Bsm, PubKey } from '@ts-bitcoin/core'
import { Buffer } from 'buffer'
import { HandlerProps } from '../../types/common'
import { saveProtocolData, sha256 } from '../utils'

const protocolAddress = '18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p'

const querySchema = [{ paymail: 'string' }, { signature: 'string' }]

const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
    // Validation
    if (
        cell[0].s !== protocolAddress ||
        !cell[1] ||
        !cell[2] ||
        !cell[3] ||
        !cell[1].s ||
        !cell[2].b ||
        !cell[3].b ||
        !tape
    ) {
        throw new Error(`Invalid BITPIC record: ${tx}`)
    }

    const bitpicObj = {
        paymail: cell[1].s,
        pubkey: cell[2].h,
        signature: cell[3].b,
        verified: false,
    }

    const b = tape[1].cell
    if (b[0].s === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut') {
        // verify aip signature
        try {
            // TODO: bob transactions are missing this binary part, cannot verify signature
            const bin = (cell[1].lb || cell[1].b) as string
            const buf = Buffer.from(bin, 'base64')
            const hashBuff = await sha256(buf)
            const address = Address.fromPubKey(
                PubKey.fromString(bitpicObj.pubkey as string)
            )

            bitpicObj.verified = Bsm.verify(
                hashBuff,
                bitpicObj.signature,
                address
            )
        } catch (e) {
            // failed verification
            bitpicObj.verified = false
        }
    }

    saveProtocolData(dataObj, 'BITPIC', bitpicObj)
}

export const BITPIC = {
    name: 'BITPIC',
    address: protocolAddress,
    querySchema,
    handler,
}
