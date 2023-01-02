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
import { PSP } from './protocols/psp'
import { RON } from './protocols/ron'
import { SYMRE } from './protocols/symre'
import { _21E8 } from './protocols/_21e8'

export type HandlerProps = {
    dataObj: BmapTx
    cell: Cell[]
    tape?: Tape[]
    tx?: BobTx
    out?: Out
}

export type Handler = (handlerProps: HandlerProps) => any
export type ScriptChecker = (cell: Cell[]) => boolean

type Cell = {
    op?: number
    ops?: string
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
        a: string | false
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
    [key: string]: any
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
    B?: B[]
    AIP?: AIP[]
    MAP?: MAP[]
    BAP?: BAP[]
    PSP?: PSP[]
    '21E8'?: _21E8[]
    BOOST?: BOOST[]
    BITCOM?: BITCOM[]
    BITPIC?: BITPIC[]
    BITKEY?: BITKEY[]
    METANET?: MetaNet[]
    SYMRE?: SYMRE[]
    RON?: RON[]
    HAIP?: HAIP[]
    BITCOM_HASHED?: BITCOM_HASHED[]
}

export type Protocol = {
    name: string
    handler: Handler
    address?: string
    opReturnSchema?: Object[]
    scriptChecker?: ScriptChecker
}
