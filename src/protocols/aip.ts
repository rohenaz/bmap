import { Address, Bsm, Script } from '@ts-bitcoin/core'
import { Buffer } from 'buffer'
import fetch from 'node-fetch'
import { BobTx, Cell, HandlerProps, Protocol, Tape } from '../../types/common'
import { AIP as AIPType } from '../../types/protocols/aip'
import { HAIP as HAIPType } from '../../types/protocols/haip'

import {
    cellValue,
    checkOpFalseOpReturn,
    isBase64,
    saveProtocolData,
    sha256,
} from '../utils'

const address = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva'

const opReturnSchema = [
    { algorithm: 'string' },
    { address: 'string' },
    { signature: 'binary' },
    [{ index: 'binary' }],
]

const getFileBuffer = async function (bitfsRef: string) {
    let fileBuffer = Buffer.from('')
    try {
        const result = await fetch(`https://x.bitfs.network/${bitfsRef}`, {})
        fileBuffer = await result.buffer()
    } catch (e) {
        console.error(e)
    }

    return fileBuffer
}

const validateSignature = async function (
    aipObj: Partial<AIPType | HAIPType>,
    cell: Cell[],
    tape: Tape[]
): Promise<boolean> {
    if (!Array.isArray(tape) || tape.length < 3) {
        throw new Error('AIP requires at least 3 cells including the prefix')
    }

    let cellIndex = -1
    tape.forEach((cc, index) => {
        if (cc.cell === cell) {
            cellIndex = index
        }
    })
    if (cellIndex === -1) {
        throw new Error('AIP could not find cell in tape')
    }

    let usingIndexes: number[] = aipObj.index || []
    const signatureValues = ['6a'] // OP_RETURN - is included in AIP
    for (let i = 0; i < cellIndex; i++) {
        const cellContainer = tape[i]
        if (!checkOpFalseOpReturn(cellContainer)) {
            for (let nc = 0; nc < cellContainer.cell.length; nc++) {
                const statement = cellContainer.cell[nc]
                // add the value as hex
                if (statement.h) {
                    signatureValues.push(statement.h)
                } else if (statement.f) {
                    // file reference - we need to get the file from bitfs
                    const fileBuffer = await getFileBuffer(statement.f)
                    signatureValues.push(fileBuffer.toString('hex'))
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

    if (aipObj.hashing_algorithm) {
        // when using HAIP, we need to parse the indexes in a non standard way
        // indexLength is byte size of the indexes being described
        if (aipObj.index_unit_size) {
            const indexLength = aipObj.index_unit_size * 2
            usingIndexes = []
            const indexes = cell[6].h as string
            for (let i = 0; i < indexes.length; i += indexLength) {
                usingIndexes.push(parseInt(indexes.substr(i, indexLength), 16))
            }
            aipObj.index = usingIndexes
        }
    }

    const signatureBufferStatements: Buffer[] = []
    // check whether we need to only sign some indexes
    if (usingIndexes.length > 0) {
        usingIndexes.forEach((index) => {
            signatureBufferStatements.push(
                Buffer.from(signatureValues[index], 'hex')
            )
        })
    } else {
        // add all the values to the signature buffer
        signatureValues.forEach((statement) => {
            signatureBufferStatements.push(Buffer.from(statement, 'hex'))
        })
    }

    let messageBuffer: Buffer | string
    if (aipObj.hashing_algorithm) {
        // this is actually Hashed-AIP (HAIP) and works a bit differently
        if (!aipObj.index_unit_size) {
            // remove OP_RETURN - will be added by Script.buildDataOut
            signatureBufferStatements.shift()
        }
        const dataScript = Script.fromSafeDataArray(signatureBufferStatements)
        let dataBuffer = Buffer.from(dataScript.toHex(), 'hex')
        if (aipObj.index_unit_size) {
            // the indexed buffer should not contain the OP_RETURN opcode, but this
            // is added by the buildDataOut function automatically. Remove it.
            dataBuffer = dataBuffer.slice(1)
        }
        messageBuffer = await sha256(Buffer.from(dataBuffer.toString('hex')))
    } else {
        // regular AIP
        messageBuffer = Buffer.concat([...signatureBufferStatements])
    }

    // AIOP uses address, HAIP uses signing_address field names
    const adressString =
        (aipObj as AIPType).address || (aipObj as HAIPType).signing_address
    // verify aip signature
    try {
        aipObj.verified = Bsm.verify(
            messageBuffer,
            aipObj.signature || '',
            Address.fromString(adressString)
        )
    } catch (e) {
        aipObj.verified = false
    }

    // Try if this is a Twetch compatible AIP signature
    if (!aipObj.verified) {
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
            aipObj.verified = Bsm.verify(
                messageBuffer,
                aipObj.signature || '',
                Address.fromString(adressString)
            )
        } catch (e) {
            aipObj.verified = false
        }
    }

    return aipObj.verified || false
}

export const enum SIGPROTO {
    HAIP = 'HAIP',
    AIP = 'AIP',
    BITCOM_HASHED = 'BITCOM_HASHED',
    PSP = 'PSP',
}

export const AIPhandler = async function (
    useOpReturnSchema: Object[],
    protocol: SIGPROTO,
    dataObj: Object,
    cell: Cell[],
    tape: Tape[],
    tx: BobTx
) {
    // loop over the schema
    const aipObj: { [key: string]: number | number[] | string } = {}

    // Does not have the required number of fields
    if (cell.length < 4) {
        throw new Error(
            'AIP requires at least 4 fields including the prefix ' + tx
        )
    }

    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)) {
        const x = parseInt(idx, 10)

        let schemaEncoding
        let aipField: keyof AIPType
        if (schemaField instanceof Array) {
            // signature indexes are specified
            schemaEncoding = schemaField[0].index
            ;[aipField] = Object.keys(schemaField[0]) as (keyof AIPType)[]
            // run through the rest of the fields in this cell, should be de indexes
            const fieldData: number[] = []
            for (let i = x + 1; i < cell.length; i++) {
                if (cell[i].h && Array.isArray(fieldData)) {
                    fieldData.push(parseInt(cell[i].h || '', 16))
                }
            }
            aipObj[aipField] = fieldData
            continue
        } else {
            ;[aipField] = Object.keys(schemaField) as (keyof AIPType)[]
            ;[schemaEncoding] = Object.values(schemaField)
        }

        aipObj[aipField] = cellValue(cell[x + 1], schemaEncoding) || ''
    }

    // There is an issue where some services add the signature as binary to the transaction
    // whereas others add the signature as base64. This will confuse bob and the parser and
    // the signature will not be verified. When the signature is added in binary cell[3].s is
    // binary, otherwise cell[3].s contains the base64 signature and should be used.
    if (cell[0].s === address && cell[3].s && isBase64(cell[3].s)) {
        aipObj.signature = cell[3].s
    }

    if (!aipObj.signature) {
        throw new Error('AIP requires a signature ' + tx)
    }

    if (!(await validateSignature(aipObj as Partial<AIPType>, cell, tape))) {
        // throw new Error('AIP requires a valid signature', tx);
    }

    saveProtocolData(dataObj, protocol, aipObj)
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

export const AIP: Protocol = {
    name: 'AIP',
    address,
    opReturnSchema,
    handler,
}
