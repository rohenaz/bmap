import { BpuTx, Cell, In, Out, Tape } from 'bpu-ts'
import { _21E8 } from './protocols/_21e8'
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
import { ORD } from './protocols/ord'
import { PSP } from './protocols/psp'
import { RON } from './protocols/ron'
import { SYMRE } from './protocols/symre'

export type HandlerProps = {
    dataObj: BmapTx
    cell: Cell[]
    tape?: Tape[]
    tx?: BobTx
    out?: Out
}

export type Handler = (handlerProps: HandlerProps) => any
export type ScriptChecker = (cell: Cell[]) => boolean

export interface BobTx extends BpuTx {
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
    ORD?: ORD[]
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
