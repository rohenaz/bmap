import type { BpuTx, Cell, In, Out, Tape } from "bpu-ts";
import type { _21E8 } from "./protocols/_21e8";
import type { AIP } from "./protocols/aip";
import type { B } from "./protocols/b";
import type { BAP } from "./protocols/bap";
import type { BITCOM } from "./protocols/bitcom";
import type { BITKEY } from "./protocols/bitkey";
import type { BITPIC } from "./protocols/bitpic";
import type { HAIP } from "./protocols/haip";
import type { MAP } from "./protocols/map";
import type { ORD } from "./protocols/ord";
import type { RON } from "./protocols/ron";
import type { SYMRE } from "./protocols/symre";

export type HandlerProps = {
  dataObj: BmapTx;
  cell: Cell[];
  tape?: Tape[];
  tx?: BobTx;
  out?: Out;
};

export type Handler = (handlerProps: HandlerProps) => any;
export type ScriptChecker = (cell: Cell[]) => boolean;

export type BobTx = {
  blk?: {
    t: number;
    i: number;
  };
  mem?: number;
  out: Out[];
  in?: In[];
  tx: {
    h: string;
  };
  lock?: number;
  [key: string]: any;
} & BpuTx

export type MetanetNode = {
  tx: string;
  id: string;
  a: string;
};

export type MetaNet = {
  parent: MetanetNode;
  ancestor?: MetanetNode[];
  child?: MetanetNode[];
  head?: boolean;
  node: MetanetNode;
};
export type MomTx = {} & BobTx & MetaNet

export type BmapTx = {
  timestamp: number;
  B?: B[];
  AIP?: AIP[];
  MAP?: MAP[];
  BAP?: BAP[];
  "21E8"?: _21E8[];
  ORD?: ORD[];
  BITCOM?: BITCOM[];
  BITPIC?: BITPIC[];
  BITKEY?: BITKEY[];
  METANET?: MetaNet[];
  SYMRE?: SYMRE[];
  RON?: RON[];
  HAIP?: HAIP[];
} & BobTx

type SimpleField = { [key: string]: string }
type ComplexField = { [key: string]: SimpleField[] | string | SimpleField[][] }
export type SchemaField = { [key: string]: string | SimpleField | SimpleField[] | ComplexField } | SimpleField[]

export type Protocol = {
  name: string;
  handler: Handler;
  address?: string;
  opReturnSchema?: SchemaField[];
  scriptChecker?: ScriptChecker;
};