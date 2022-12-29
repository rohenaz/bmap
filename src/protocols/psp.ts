import { Address, Bsm, PubKey, Script } from '@ts-bitcoin/core'
import { Cell, HandlerProps, Tape } from '../../types/common'
import { PSP as PSPType } from '../../types/protocols/psp'
import { verifyPaymailPublicKey } from '../paymail'
import { checkOpFalseOpReturn, saveProtocolData } from '../utils'

const address = '1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4'

const querySchema = [
    { signature: 'string' },
    { pubkey: 'string' },
    { paymail: 'string' },
]

const validateSignature = function (
    pspObj: PSPType,
    cell: Cell[],
    tape: Tape[]
) {
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
        if (!checkOpFalseOpReturn(cellContainer)) {
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

const handler = async function ({ dataObj, cell, tape }: HandlerProps) {
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

    const pspObj = {
        signature: cell[1].s,
        pubkey: cell[2].s,
        paymail: cell[3].s,
        verified: false,
    } as PSPType

    // verify signature
    validateSignature(pspObj, cell, tape)

    // check the paymail public key
    const paymailPublicKeyVerified = await verifyPaymailPublicKey(
        pspObj.paymail,
        pspObj.pubkey
    )
    pspObj.verified = pspObj.verified && paymailPublicKeyVerified

    saveProtocolData(dataObj, 'PSP', pspObj)
}

export const PSP = {
    name: 'PSP',
    address,
    querySchema,
    handler,
}
