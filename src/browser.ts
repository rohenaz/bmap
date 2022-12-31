import { Buffer } from 'buffer'
import { allProtocols, BMAP, TransformTx } from './bmap'

// import { BOOST } from './protocols/boost'

declare global {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        bmap: any
        crypto: any
    }
}

if (typeof window !== 'undefined') {
    window.bmap = {
        BMAP,
        TransformTx,
        supportedProtocols: allProtocols.map((p) => p.name),
    }
    // const bm = new BMAP()
    // bm.addProtocolHandler(BOOST)
    // window.bmap.bmap = bm
    if (!window.Buffer) {
        window.Buffer = Buffer
    }
}
