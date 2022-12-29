import { B } from './protocols/b'
import { MAP } from './protocols/map'

export type SigProto = [
    { s: string },
    { h: string },
    { h: string },
    { h: string },
    { s: string }
]

export type HandlerProps = {
    dataObj: BmapTx
    cell: Cell[]
    tape?: Tape[]
    tx?: BobTx
}

export type Handler = (handlerProps: HandlerProps) => any

type Cell = {
    op?: number
    b?: string
    s?: string
    ii: number
    i: number
    h?: string
    f?: string
    ls?: string
    lh?: string
    lf?: string
    lb?: string
}

type Out = {
    tape?: Tape[]
    i: number
    e: {
        i: number
        a: string
        v: number
    }
}

type In = {
    tape?: Tape[]
    i: number
    e: {
        h: string
        a: string
        v?: number
    }
}

type Tape = {
    cell: Cell[]
    i: number
}

export type BobTx = {
    blk?: {
        t: number
        i: number
    }
    mem?: number
    out: Out[]
    in?: In[]
    tx: {
        h: string
    }
    lock?: number
}

export type MetanetNode = {
    tx: string
    id: string
    a: string
}

export type MetaNet = {
    parent: MetanetNode
    ancestor?: MetanetNode[]
    child?: MetanetNode[]
    head?: boolean
    node: MetanetNode
}
export interface MomTx extends BobTx, MetaNet {}

export interface BmapTx extends BobTx {
    timestamp: number
    B: B[]
    MAP: MAP[]
    _id: string
    '15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA'?: SigProto | any
    [key: string]: any[]
}
