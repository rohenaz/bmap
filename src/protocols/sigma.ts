import { Address, Bsm } from '@ts-bitcoin/core'
import { Buffer } from 'buffer'
import { BobTx, HandlerProps, Protocol } from '../../types/common'

import { Cell } from 'bpu-ts'
import { SIGMA as SigmaType } from '../../types/protocols/sigma'
import {
    cellValue,
    checkOpReturn,
    isBase64,
    saveProtocolData,
    sha256,
} from '../utils'

const prefix = 'SIGMA'

const opReturnSchema = [
    { algorithm: 'string' },
    { address: 'string' },
    { signature: 'binary' },
    [{ index: 'binary' }],
]

const validateSignature = async function (
    sigmaObj: Partial<SigmaType>,
    cell: Cell[],
    tape: Tape[]
): Promise<boolean> {
    if (!Array.isArray(tape) || tape.length < 3) {
        throw new Error('Sigma requires at least 3 cells including the prefix')
    }

    let cellIndex = -1
    tape.forEach((cc, index) => {
        if (cc.cell === cell) {
            cellIndex = index
        }
    })
    if (cellIndex === -1) {
        throw new Error('Sigma: could not find cell in tape')
    }

    const signatureValues = ['6a'] // OP_RETURN - is included in SIGMA
    for (let i = 0; i < cellIndex; i++) {
        const cellContainer = tape[i]
        if (!checkOpReturn(cellContainer)) {
            for (let nc = 0; nc < cellContainer.cell.length; nc++) {
                const statement = cellContainer.cell[nc]
                // add the value as hex
                if (statement.h) {
                    signatureValues.push(statement.h)
                } else if (statement.b) {
                    // no hex? try base64
                    signatureValues.push(
                        Buffer.from(statement.b, 'base64').toString('hex')
                    )
                } else {
                    if (statement.s) {
                        signatureValues.push(
                            Buffer.from(statement.s).toString('hex')
                        )
                    }
                }
            }
            signatureValues.push('7c') // | hex
        }
    }

    const signatureBufferStatements: Buffer[] = []

    // add all the values to the signature buffer
    signatureValues.forEach((statement) => {
        signatureBufferStatements.push(Buffer.from(statement, 'hex'))
    })

    let messageBuffer: Buffer | string

    messageBuffer = Buffer.concat([...signatureBufferStatements])

    // AIOP uses address, HAIP uses signing_address field names
    const adressString = sigmaObj.address
    if (!adressString) {
        sigmaObj.verified = false
        return false
    }

    // verify aip signature
    try {
        sigmaObj.verified = Bsm.verify(
            messageBuffer,
            sigmaObj.signature || '',
            Address.fromString(adressString)
        )
    } catch (e) {
        sigmaObj.verified = false
    }

    // Try if this is a Twetch compatible AIP signature
    if (!sigmaObj.verified) {
        // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
        // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")

        messageBuffer = Buffer.concat([
            ...signatureBufferStatements.slice(
                1,
                signatureBufferStatements.length - 1
            ),
        ])
        const buff = await sha256(messageBuffer)
        messageBuffer = Buffer.from(buff.toString('hex'))
        try {
            sigmaObj.verified = Bsm.verify(
                messageBuffer,
                sigmaObj.signature || '',
                Address.fromString(adressString)
            )
        } catch (e) {
            sigmaObj.verified = false
        }
    }

    return sigmaObj.verified || false
}

export const SigmaHandler = async function (
    useOpReturnSchema: Object[],
    protocol: 'SIGMA',
    dataObj: Object,
    tx: BobTx,
    cell: Cell[]
) {
    // loop over the schema
    const sigmaObj: { [key: string]: number | number[] | string } = {}

    // Does not have the required number of fields
    if (cell.length < 4) {
        throw new Error(
            'AIP requires at least 4 fields including the prefix ' + tx
        )
    }

    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)) {
        const x = parseInt(idx, 10)

        let schemaEncoding
        let sigmaField: keyof SigmaType
        if (schemaField instanceof Array) {
            // signature indexes are specified
            schemaEncoding = schemaField[0].index
            ;[sigmaField] = Object.keys(schemaField[0]) as (keyof SigmaType)[]
            // run through the rest of the fields in this cell, should be de indexes
            const fieldData: number[] = []
            for (let i = x + 1; i < cell.length; i++) {
                if (cell[i].h && Array.isArray(fieldData)) {
                    fieldData.push(parseInt(cell[i].h || '', 16))
                }
            }
            sigmaObj[sigmaField] = fieldData
            continue
        } else {
            ;[sigmaField] = Object.keys(schemaField) as (keyof SigmaType)[]
            ;[schemaEncoding] = Object.values(schemaField)
        }

        sigmaObj[sigmaField] = cellValue(cell[x + 1], schemaEncoding) || ''
    }

    // There is an issue where some services add the signature as binary to the transaction
    // whereas others add the signature as base64. This will confuse bob and the parser and
    // the signature will not be verified. When the signature is added in binary cell[3].s is
    // binary, otherwise cell[3].s contains the base64 signature and should be used.
    if (cell[0].s === prefix && cell[3].s && isBase64(cell[3].s)) {
        sigmaObj.signature = cell[3].s
    }

    if (!sigmaObj.signature) {
        throw new Error('SIGMA requires a signature ' + tx)
    }

    if (
        !(await validateSignature(sigmaObj as Partial<SigmaType>, cell, tape))
    ) {
        // throw new Error('AIP requires a valid signature', tx);
    }

    saveProtocolData(dataObj, protocol, sigmaObj)
}

const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
    if (!tape) {
        throw new Error('Invalid AIP transaction. tape is required')
    }
    if (!tx) {
        throw new Error('Invalid AIP transaction. tx is required')
    }
    return await AIPhandler(
        opReturnSchema,
        SIGPROTO.AIP,
        dataObj,
        cell,
        tape,
        tx
    )
}

export const SIGMA: Protocol = {
    name: 'SIGMA',
    address: prefix,
    opReturnSchema,
    handler,
}
