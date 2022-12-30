import { TransformTx } from './bmap'

declare global {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        bmap: any
    }
}

if (typeof window !== 'undefined') {
    window.bmap = {
        TransformTx,
    }
}
