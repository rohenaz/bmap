import { Address, Bsm, PubKey, Script } from '@ts-bitcoin/core'
import { Buffer } from 'buffer'
import { Cell, HandlerProps, Protocol, Tape } from '../../types/common'
import { BITCOM_HASHED } from '../../types/protocols/bitcomHashed'
import { PSP as PSPType } from '../../types/protocols/psp'
import { verifyPaymailPublicKey } from '../paymail'
import { cellValue, checkOpReturn, saveProtocolData } from '../utils'
import { SIGPROTO } from './aip'

const address = '1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4'

const opReturnSchema = [
    { signature: 'string' },
    { pubkey: 'string' },
    { paymail: 'string' },
]

const validateSignature = (pspObj: PSPType, cell: Cell[], tape: Tape[]) => {
    if (!Array.isArray(tape) || tape.length < 3) {
        throw new Error('PSP requires at least 3 cells including the prefix')
    }

    let cellIndex = -1
    tape.forEach((cc, index) => {
        if (cc.cell === cell) {
            cellIndex = index
        }
    })
    if (cellIndex === -1) {
        throw new Error('PSP could not find cell in tape')
    }

    const signatureBufferStatements = []
    for (let i = 0; i < cellIndex; i++) {
        const cellContainer = tape[i]
        if (!checkOpReturn(cellContainer)) {
            cellContainer.cell.forEach((statement) => {
                // add the value as hex
                let value = statement.h
                if (!value) {
                    value = Buffer.from(
                        statement.b as string,
                        'base64'
                    ).toString('hex')
                }
                if (!value) {
                    value = Buffer.from(statement.s as string).toString('hex')
                }
                signatureBufferStatements.push(Buffer.from(value, 'hex'))
            })
            signatureBufferStatements.push(Buffer.from('7c', 'hex')) // | hex ????
        }
    }
    const dataScript = Script.fromSafeDataArray(signatureBufferStatements)
    const messageBuffer = Buffer.from(dataScript.toHex(), 'hex')

    // verify psp signature
    const publicKey = PubKey.fromString(pspObj.pubkey)
    const signingAddress = Address.fromPubKey(publicKey)
    try {
        pspObj.verified = Bsm.verify(
            messageBuffer,
            pspObj.signature,
            signingAddress
        )
    } catch (e) {
        pspObj.verified = false
    }

    return pspObj.verified
}

const handler = async ({ dataObj, cell, tape }: HandlerProps) => {
    // Paymail Signature Protocol
    // Validation
    if (
        !cell.length ||
        cell[0].s !== address ||
        !cell[1] ||
        !cell[2] ||
        !cell[3] ||
        !cell[1].b ||
        !cell[2].s ||
        !cell[3].s ||
        !tape
    ) {
        throw new Error(`Invalid Paymail Signature Protocol record`)
    }

    return await PSPhandler(opReturnSchema, SIGPROTO.PSP, dataObj, cell, tape)
}

export const PSPhandler = async (
    useOpReturnSchema: Object[],
    protocol: SIGPROTO,
    dataObj: Object,
    cell: Cell[],
    tape: Tape[]
) => {
    // loop over the schema
    const pspObj: Partial<PSPType | BITCOM_HASHED> = {
        verified: false,
    }

    // Does not have the required number of fields
    if (cell.length < 4) {
        throw new Error(
            'PSP requires at least 4 fields including the prefix ' + cell
        )
    }

    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)) {
        const x = parseInt(idx, 10)

        const [pspField] = Object.keys(schemaField) as (keyof PSPType)[]
        const [schemaEncoding] = Object.values(schemaField) as string[]

        ;(pspObj as any)[pspField] = cellValue(cell[x + 1], schemaEncoding)
    }

    if (!pspObj.signature) {
        throw new Error('PSP requires a signature ' + cell)
    }

    //  TODO: we can only check on PSP until we figure out the BITCOM_HASHED fields
    //  verify signature
    if (
        protocol === SIGPROTO.PSP &&
        !validateSignature(pspObj as PSPType, cell, tape)
    ) {
        throw new Error('PSP requires a valid signature ' + pspObj)
    }

    // check the paymail public key
    if (pspObj.pubkey && pspObj.paymail) {
        const paymailPublicKeyVerified = await verifyPaymailPublicKey(
            pspObj.paymail,
            pspObj.pubkey
        )
        pspObj.verified = (pspObj.verified &&
            paymailPublicKeyVerified) as boolean
    }

    saveProtocolData(dataObj, protocol, pspObj)
}

// TODO: Add concept of validators so they can be passed in / reused more easily
export const PSP: Protocol = {
    name: 'PSP',
    address,
    opReturnSchema,
    handler,
}
