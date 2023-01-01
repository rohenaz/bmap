// import default protocols
import {
    BmapTx,
    BobTx,
    Handler,
    HandlerProps,
    In,
    MetaNet,
    MomTx,
    Out,
    Protocol,
    ScriptChecker,
} from '../types/common'
import { AIP } from './protocols/aip'
import { B } from './protocols/b'
import { BAP } from './protocols/bap'
import { BITCOM } from './protocols/bitcom'
import { BITCOM_HASHED } from './protocols/bitcomHashed'
import { BITKEY } from './protocols/bitkey'
import { BITPIC } from './protocols/bitpic'
import { BOOST } from './protocols/boost'
import { HAIP } from './protocols/haip'
import { MAP } from './protocols/map'
import { METANET } from './protocols/metanet'
import { PSP } from './protocols/psp'
import { RON } from './protocols/ron'
import { SYMRE } from './protocols/symre'
import { _21E8 } from './protocols/_21e8'
import {
    checkOpFalseOpReturn,
    isObjectArray,
    isStringArray,
    saveProtocolData,
} from './utils'

// Names of enabled protocols
const enabledProtocols = new Map<string, string>([])
// Protocol Handlers
const protocolHandlers = new Map<string, Handler>([])
// Script checkers are intentionally minimalistic detection functions for identifying matching scripts for a given protocol. Only if a checker returns true is a handler called for processing.
const protocolScriptCheckers = new Map<string, ScriptChecker>([])
const protocolOpReturnSchemas = new Map<string, Object[]>()

export const allProtocols = [
    AIP,
    B,
    BAP,
    MAP,
    METANET,
    BOOST,
    _21E8,
    BITCOM,
    BITKEY,
    BITPIC,
    HAIP,
    BITCOM_HASHED,
    PSP,
    RON,
    SYMRE,
]

export const supportedProtocols = allProtocols.map((p) => p.name)
export const defaultProtocols = [AIP, B, BAP, MAP, METANET]

// prepare protocol map, handlers and schemas
defaultProtocols.forEach((protocol) => {
    if (protocol.address) {
        enabledProtocols.set(protocol.address, protocol.name)
    }
    protocolHandlers.set(protocol.name, protocol.handler)
    if (protocol.opReturnSchema) {
        protocolOpReturnSchemas.set(protocol.name, protocol.opReturnSchema)
    }
    if (protocol.scriptChecker) {
        protocolScriptCheckers.set(protocol.name, protocol.scriptChecker)
    }
})

// Takes a BOB formatted op_return transaction
export class BMAP {
    enabledProtocols: Map<string, string>

    protocolHandlers: Map<string, Handler>

    protocolScriptCheckers: Map<string, ScriptChecker>

    protocolOpReturnSchemas: Map<string, Object[]>

    constructor() {
        // initial default protocol handlers in this instantiation
        this.enabledProtocols = enabledProtocols
        this.protocolHandlers = protocolHandlers
        this.protocolScriptCheckers = protocolScriptCheckers
        this.protocolOpReturnSchemas = protocolOpReturnSchemas
    }

    addProtocolHandler({
        name,
        address,
        opReturnSchema,
        handler,
        scriptChecker,
    }: Protocol) {
        if (address) {
            this.enabledProtocols.set(address, name)
        }
        this.protocolHandlers.set(name, handler)
        if (opReturnSchema) {
            this.protocolOpReturnSchemas.set(name, opReturnSchema)
        }
        if (scriptChecker) {
            this.protocolScriptCheckers.set(name, scriptChecker)
        }
    }

    transformTx = async (tx: BobTx | MomTx): Promise<BmapTx> => {
        if (!tx || !tx['in'] || !tx['out']) {
            throw new Error('Cannot process tx')
        }

        // This will become our nicely formatted response object
        const dataObj: Partial<BobTx> = {}

        for (const [key, val] of Object.entries(tx)) {
            if (key === 'out') {
                // loop over the outputs
                for (const out of tx.out) {
                    const { tape } = out

                    if (tape?.some((cc) => checkOpFalseOpReturn(cc))) {
                        // loop over tape
                        for (const cellContainer of tape) {
                            // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                            if (checkOpFalseOpReturn(cellContainer)) {
                                continue
                            }

                            const { cell } = cellContainer
                            if (!cell) {
                                throw new Error('empty cell while parsing')
                            }

                            const prefix = cell[0].s

                            await this.process(
                                this.enabledProtocols.get(prefix || '') ||
                                    prefix ||
                                    '',
                                {
                                    cell,
                                    dataObj: dataObj as BmapTx,
                                    tape,
                                    out,
                                    tx,
                                }
                            )
                        }
                    } else {
                        // No OP_RETURN in this tape

                        const boostChecker = this.protocolScriptCheckers.get(
                            BOOST.name
                        )
                        const _21e8Checker = this.protocolScriptCheckers.get(
                            _21E8.name
                        )

                        // Check for boostpow and 21e8
                        if (
                            tape?.some((cc) => {
                                const { cell } = cc
                                if (boostChecker && boostChecker(cell)) {
                                    // 'found boost'
                                    return true
                                }
                                if (_21e8Checker && _21e8Checker(cell)) {
                                    // 'found 21e8'
                                    return true
                                }
                            })
                        ) {
                            // find the cell array
                            // loop over tape
                            for (const cellContainer of tape) {
                                const { cell } = cellContainer
                                // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                                if (!cell) {
                                    throw new Error('empty cell while parsing')
                                }
                                let protocolName = ''
                                if (boostChecker && boostChecker(cell)) {
                                    protocolName = BOOST.name
                                } else if (_21e8Checker && _21e8Checker(cell)) {
                                    protocolName = _21E8.name
                                } else {
                                    // nothing found
                                    continue
                                }

                                this.process(protocolName, {
                                    tx,
                                    cell,
                                    dataObj: dataObj as BmapTx,
                                    tape,
                                    out,
                                })
                            }
                        } else {
                            this.processUnknown(key, dataObj, out)
                        }
                    }
                }
            } else if (key === 'in') {
                // TODO: Boost check inputs to see if this is a tx solving a puzzle
                // TODO: 21e8 check inputs to see if this is a tx solving a puzzle
                dataObj[key] = val.map((v: In) => {
                    const r = { ...v }
                    delete r.tape
                    return r
                })
            } else {
                // known key, just write it retaining original type
                dataObj[key] = val
            }
        }

        // If this is a MOM planaria it will have metanet keys available
        if (dataObj['METANET'] && (tx as MomTx).parent) {
            const meta = {
                ancestor: (tx as MomTx).ancestor,
                parent: (tx as MomTx).parent,
                child: (tx as MomTx).child,
                head: (tx as MomTx).head,
            } as MetaNet

            ;(dataObj.METANET as MetaNet[]).push(meta)
            // remove parent and node from root level for (MOM data)
            delete dataObj.ancestor
            delete dataObj.child
            delete dataObj.parent
            delete dataObj.head
            delete dataObj.node
        }

        return dataObj as BmapTx
    }

    processUnknown = (key: string, dataObj: Partial<BmapTx>, out: Out) => {
        // no known non-OP_RETURN scripts
        if (key && !dataObj[key]) {
            dataObj[key] = []
        }

        ;(dataObj[key] as Out[]).push({
            i: out.i,
            e: out.e,
        })
    }

    process = async (
        protocolName: string,
        { cell, dataObj, tape, out, tx }: HandlerProps
    ) => {
        if (
            this.protocolHandlers.has(protocolName) &&
            typeof this.protocolHandlers.get(protocolName) === 'function'
        ) {
            const handler = this.protocolHandlers.get(protocolName)
            if (handler) {
                /* eslint-disable no-await-in-loop */
                await handler({
                    dataObj: dataObj,
                    cell,
                    tape,
                    out,
                    tx,
                })
            }
        } else {
            saveProtocolData(dataObj, protocolName, cell)
        }
    }
}

export const TransformTx = async (
    tx: BobTx,
    protocols?: string[] | Protocol[]
) => {
    const b = new BMAP()

    // if protocols are specified
    if (protocols) {
        // wipe out defaults
        b.enabledProtocols.clear()
        if (isStringArray(protocols)) {
            // set enabled protocols
            for (const protocol of allProtocols) {
                if ((protocols as string[])?.includes(protocol.name)) {
                    b.addProtocolHandler(protocol)
                }
            }
        } else if (isObjectArray(protocols)) {
            for (const p of protocols) {
                const protocol = p as Protocol
                if (protocol) {
                    b.addProtocolHandler(protocol)
                }
            }
        } else {
            throw new Error(
                `Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).`
            )
        }
    }

    return b.transformTx(tx)
}
