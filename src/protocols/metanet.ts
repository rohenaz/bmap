import { Buffer } from 'buffer'
import { HandlerProps, MetaNet, MetanetNode } from '../../types/common'
import { sha256 } from '../utils'

const address = 'meta'

const querySchema = [
    { address: 'string' },
    { parent: 'string' },
    { name: 'string' },
]

export const getEnvSafeMetanetID = async function (a: string, tx: string) {
    // Calculate the node ID
    const buf = Buffer.from(a + tx)
    const hashBuf = await sha256(buf)
    return hashBuf.toString('hex')
}

const handler = async ({ dataObj, cell, tx }: HandlerProps) => {
    if (
        !cell.length ||
        cell[0].s !== 'meta' ||
        !cell[1] ||
        !cell[1].s ||
        !cell[2] ||
        !cell[2].s ||
        !tx
    ) {
        throw new Error('Invalid Metanet tx ' + tx)
    }
    // For now, we just copy from MOM keys later if available, or keep BOB format

    const nodeId = await getEnvSafeMetanetID(cell[1].s, tx.tx.h)
    // Described this node
    const node = {
        a: cell[1].s,
        tx: tx.tx.h,
        id: nodeId,
    }
    let parent = {} as MetanetNode
    if (tx.in) {
        const parentId = await getEnvSafeMetanetID(tx.in[0].e.a, cell[2].s)
        // Parent node
        parent = {
            a: tx.in[0].e.a,
            tx: cell[2].s,
            id: parentId,
        }
    }

    if (!dataObj.METANET) {
        dataObj.METANET = []
    }
    dataObj.METANET.push({
        node,
        parent,
    } as MetaNet)
}

export const METANET = {
    name: 'METANET',
    address,
    querySchema,
    handler,
}
