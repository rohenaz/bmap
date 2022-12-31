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
} from '../types/common'
import { AIP } from './protocols/aip'
import { B } from './protocols/b'
import { BAP } from './protocols/bap'
import { BOOST, checkBoostpow } from './protocols/boost'
import { MAP } from './protocols/map'
import { METANET } from './protocols/metanet'
import { check21e8, _21E8 } from './protocols/_21e8'
import { checkOpFalseOpReturn, saveProtocolData } from './utils'

const protocolMap = new Map<string, string>([])
const protocolHandlers = new Map<string, Handler>()
const protocolQuerySchemas = new Map<string, Object[]>()

const defaultProtocols = [AIP, B, BAP, MAP, METANET]

// prepare protocol map, handlers and schemas
defaultProtocols.forEach((protocol) => {
    if (protocol.address) {
        protocolMap.set(protocol.address, protocol.name)
    }
    protocolHandlers.set(protocol.name, protocol.handler)
    if (protocol.querySchema) {
        protocolQuerySchemas.set(protocol.name, protocol.querySchema)
    }
})

// Takes a BOB formatted op_return transaction
export class BMAP {
    protocolMap: Map<string, string>

    protocolHandlers: Map<string, Handler>

    protocolQuerySchemas: Map<string, Object[]>

    constructor() {
        // initial default protocol handlers in this instantiation
        this.protocolMap = protocolMap
        this.protocolHandlers = protocolHandlers
        this.protocolQuerySchemas = protocolQuerySchemas
    }

    addProtocolHandler({ name, address, querySchema, handler }: Protocol) {
        if (address) {
            this.protocolMap.set(address, name)
        }
        this.protocolHandlers.set(name, handler)
        if (querySchema) {
            this.protocolQuerySchemas.set(name, querySchema)
        }
    }

    transformTx = async (tx: BobTx | MomTx): Promise<BmapTx> => {
        if (!tx || !tx['in'] || !tx['out']) {
            throw new Error('Cannot process tx')
        }

        // This will become our nicely formatted response object
        const dataObj: Partial<BmapTx> = {}

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
                                this.protocolMap.get(prefix || '') || '',
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

                        // Check for boostpow and 21e8
                        if (
                            tape?.some((cc) => {
                                const { cell } = cc
                                if (
                                    this.protocolHandlers.has(BOOST.name) &&
                                    checkBoostpow(cell)
                                ) {
                                    // 'found boost'
                                    return true
                                }
                                if (
                                    this.protocolHandlers.has(_21E8.name) &&
                                    check21e8(cell)
                                ) {
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
                                if (checkBoostpow(cell)) {
                                    protocolName = BOOST.name
                                } else if (check21e8(cell)) {
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

export const TransformTx = async (tx: BobTx) => {
    const b = new BMAP()
    return b.transformTx(tx)
}
