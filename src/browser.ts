import { Buffer } from 'buffer'
import crypto from 'node:crypto'
import { BMAP, supportedProtocols, TransformTx } from './bmap'

// import { BOOST } from './protocols/boost'
export type bmapjs = {
    BMAP: typeof BMAP
    TransformTx: typeof TransformTx
    supportedProtocols: string[]
}

declare global {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        bmap: bmapjs
        crypto: typeof crypto
    }
}

const bmap = {
    BMAP,
    TransformTx,
    supportedProtocols,
} as bmapjs

if (typeof window !== 'undefined') {
    window.bmap = bmap

    if (crypto && !window.crypto) {
        // no way this works lol
        ;(window.crypto as any) = crypto
    }
    // const bm = new BMAP()
    // bm.addProtocolHandler(BOOST)
    // window.bmap.bmap = bm
    if (!window.Buffer) {
        window.Buffer = Buffer
    }
}

export default bmap
