import type { BpuTx, Cell, In, Out, Tape } from "bpu-ts";
import type {
  AIP,
  B,
  BAP,
  BITCOM,
  BITKEY,
  BITPIC,
  HAIP,
  MAP,
  ORD,
  RON,
  SYMRE,
  _21E8,
} from "./protocols";

export type HandlerProps = {
  dataObj: BmapTx;
  cell: Cell[];
  tape?: Tape[];
  tx?: BobTx;
  out?: Out;
};

export type Handler = (handlerProps: HandlerProps) => any;
export type ScriptChecker = (cell: Cell[]) => boolean;

export interface BobTx extends BpuTx {
  blk?: {
    t: number;
    i: number;
    h: string;
  };
  mem?: number;
  out: Out[];
  in?: In[];
  tx: {
    h: string;
  };
  lock?: number;
  [key: string]: any;
}

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

export interface MomTx extends BobTx, MetaNet {}

export interface BmapTx extends BobTx {
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
}

type SimpleField = { [key: string]: string };
type SchemaValue = string | SimpleField | { [key: string]: SchemaValue } | SchemaValue[];
export type SchemaField = { [key: string]: SchemaValue } | SimpleField[];

export type Protocol = {
  name: string;
  handler: Handler;
  address?: string;
  opReturnSchema?: SchemaField[];
  scriptChecker?: ScriptChecker;
};
