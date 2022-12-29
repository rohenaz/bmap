// import default protocols
import {
    BmapTx,
    BobTx,
    Handler,
    In,
    MetaNet,
    MomTx,
    Out,
} from '../types/common'
import { AIP } from './protocols/aip'
import { B } from './protocols/b'
import { BAP } from './protocols/bap'
import { HAIP } from './protocols/haip'
import { MAP } from './protocols/map'
import { METANET } from './protocols/metanet'
import { PSP } from './protocols/psp'
import { checkOpFalseOpReturn, saveProtocolData } from './utils'

const protocolMap = new Map<string, string>()
const protocolHandlers = new Map<string, Handler>()
const protocolQuerySchemas = new Map<string, Object[]>()

;[AIP, B, BAP, HAIP, MAP, METANET, PSP].forEach((protocol) => {
    protocolMap.set(protocol.address, protocol.name)
    protocolHandlers.set(protocol.name, protocol.handler)
    protocolQuerySchemas.set(protocol.name, protocol.querySchema)
})

// Takes a BOB formatted op_return transaction
export default class bmap {
    protocolMap: Map<string, string>

    protocolHandlers: Map<string, Handler>

    protocolQuerySchemas: Map<string, Object[]>

    constructor() {
        // initial default protocol handlers in this instantiation
        this.protocolMap = protocolMap
        this.protocolHandlers = protocolHandlers
        this.protocolQuerySchemas = protocolQuerySchemas
    }

    addProtocolHandler(protocolDefinition: {
        name: string
        address: string
        querySchema: Object[]
        handler: Handler
    }) {
        const { name, address, querySchema, handler } = protocolDefinition
        this.protocolMap.set(address, name)
        this.protocolHandlers.set(name, handler)
        this.protocolQuerySchemas.set(name, querySchema)
    }

    transformTx = async (tx: BobTx | MomTx): Promise<BmapTx> => {
        const self = this

        if (!tx || !tx['in'] || !tx['out']) {
            throw new Error('Cannot process tx')
        }

        // This will become our nicely formatted response object
        const dataObj: {
            [key: string]: (Out | In | MetaNet)[] | string | Object
        } = {
            in: [],
            out: [],
            _id: '',
            tx: {},
            blk: {},
        }

        for (const [key, val] of Object.entries(tx)) {
            if (key === 'out') {
                // loop over the outputs
                for (const out of tx.out) {
                    const { tape } = out

                    if (tape?.some((cc) => checkOpFalseOpReturn(cc))) {
                        for (const cellContainer of tape) {
                            // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                            if (checkOpFalseOpReturn(cellContainer)) {
                                continue
                            }

                            const { cell } = cellContainer
                            if (!cell) {
                                throw new Error('empty cell while parsing')
                            }

                            // Get protocol name from prefix
                            const prefix = cell[0].s as string

                            const protocolName =
                                self.protocolMap.get(prefix) || prefix

                            if (
                                self.protocolHandlers.has(protocolName) &&
                                typeof self.protocolHandlers.get(
                                    protocolName
                                ) === 'function'
                            ) {
                                /* eslint-disable no-await-in-loop */
                                const handler = self.protocolHandlers.get(
                                    protocolName
                                )
                                if (handler) {
                                    await handler({
                                        dataObj: dataObj as BmapTx,
                                        cell,
                                        tape,
                                        tx,
                                    })
                                }
                            } else {
                                saveProtocolData(dataObj, protocolName, cell)
                            }
                        }
                    } else {
                        // No OP_RETURN in this outputs
                        if (key && !dataObj[key]) {
                            dataObj[key] = []
                        }

                        ;(dataObj[key] as Out[]).push({
                            i: out.i,
                            e: out.e,
                        })
                    }
                }
            } else if (key === 'in') {
                dataObj[key] = val.map((v: In) => {
                    const r = { ...v }
                    delete r.tape
                    return r
                })
            } else if (Object.keys(dataObj).includes(key)) {
                // knwon key, just write it retaining original type
                dataObj[key] = val
            } else if (!dataObj[key]) {
                // unknown key. push into array incase there are many of these detected
                dataObj[key] = []
                ;(dataObj[key] as Object[]).push(val)
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
}

const TransformTx = async (tx: BobTx) => {
    const b = new bmap()
    return b.transformTx(tx)
}

export { TransformTx }
