import { Address, Bsm, PubKey } from '@ts-bitcoin/core'
import { Buffer } from 'buffer'
import { HandlerProps, Protocol } from '../../types/common'
import { cellValue, saveProtocolData, sha256 } from '../utils'

const address = '13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC'

const opReturnSchema = [
    { bitkey_signature: 'string' },
    { user_signature: 'string' },
    { paymail: 'string' },
    { pubkey: 'string' },
]

// const handler = function (dataObj, cell, tape, tx) {
// https://bitkey.network/how
const handler = async ({ dataObj, cell }: HandlerProps) => {
    if (!cell.length) {
        throw new Error('Invalid Bitkey tx')
    }

    const bitkeyObj: { [key: string]: string | boolean } = {}

    // loop over the schema
    for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
        const x = parseInt(idx, 10)
        const bitkeyField = Object.keys(schemaField)[0]
        const schemaEncoding = Object.values(schemaField)[0]
        bitkeyObj[bitkeyField] = cellValue(
            cell[x + 1],
            schemaEncoding
        ) as string
    }

    const userAddress = Address.fromPubKey(
        PubKey.fromString(bitkeyObj.pubkey as string)
    ).toString()

    // sha256( hex(paymail(USER)) | hex(pubkey(USER)) )
    const paymailHex = Buffer.from(bitkeyObj.paymail as string).toString('hex')
    const pubkeyHex = Buffer.from(bitkeyObj.pubkey as string).toString('hex')
    const concatenated = paymailHex + pubkeyHex
    const bitkeySignatureBuffer = await sha256(Buffer.from(concatenated, 'hex'))

    const bitkeySignatureVerified = Bsm.verify(
        bitkeySignatureBuffer,
        bitkeyObj.bitkey_signature as string,
        Address.fromString('13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC')
    )
    const userSignatureVerified = Bsm.verify(
        Buffer.from(bitkeyObj.pubkey as string),
        bitkeyObj.user_signature as string,
        Address.fromString(userAddress)
    )
    bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified

    saveProtocolData(dataObj, 'BITKEY', bitkeyObj)
}

export const BITKEY: Protocol = {
    name: 'BITKEY',
    address,
    opReturnSchema,
    handler,
}
