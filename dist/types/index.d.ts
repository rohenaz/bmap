import { BpuTx } from 'bpu-ts';
import { Cell } from 'bpu-ts';
import { In } from 'bpu-ts';
import { Out } from 'bpu-ts';
import { Tape } from 'bpu-ts';

declare type _21E8 = {
    txid: string;
    target: string;
    difficulty: number;
    value: number;
};

declare type AIP = {
    address?: string;
    algorithm?: string;
    signing_algorithm?: string;
    signing_address?: string;
    index?: number[];
    hashing_algorithm?: string;
    index_unit_size?: number;
    signature?: string;
    verified?: boolean;
};

export declare const allProtocols: (Protocol | {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
})[];

declare type B = {
    content: string;
    "content-type": string;
    encoding: string;
    filename?: string;
};

declare type BAP = {
    type: string;
    hash: string;
    sequence: string;
};

declare type BITCOM = string[];

declare type BITKEY = {
    bitkey_signature: string;
    user_signature: string;
    paymail: string;
    pubkey: string;
};

declare type BITPIC = {
    paymail: string;
    pubkey: string;
    signature: string;
    verified: boolean;
};

export declare class BMAP {
    enabledProtocols: Map<string, string>;
    protocolHandlers: Map<string, Handler>;
    protocolScriptCheckers: Map<string, ScriptChecker>;
    protocolOpReturnSchemas: Map<string, SchemaField[]>;
    constructor();
    addProtocolHandler({ name, address, opReturnSchema, handler, scriptChecker }: Protocol): void;
    transformTx: (tx: BobTx | MomTx) => Promise<BmapTx>;
    processUnknown: (key: string, dataObj: Partial<BmapTx>, out: Out) => void;
    process: (protocolName: string, { cell, dataObj, tape, out, tx }: HandlerProps) => Promise<void>;
    processDataProtocols: (tape: Tape[], out: Out, tx: BobTx, dataObj: Partial<BobTx>) => Promise<Partial<BobTx>>;
}

export declare interface BmapTx extends BobTx {
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

export declare const bobFromRawTx: (rawTx: string) => Promise<BobTx>;

export declare interface BobTx extends BpuTx {
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
}

export declare const defaultProtocols: Protocol[];

export declare const fetchRawTx: (txid: string) => Promise<string>;

declare type HAIP = {
    signing_address?: string;
    hashing_algorithm?: string;
    signing_algorithm?: string;
    index?: number[];
    index_unit_size?: number;
    signature?: string;
    verified?: boolean;
};

export declare type Handler = (handlerProps: HandlerProps) => any;

export declare type HandlerProps = {
    dataObj: BmapTx;
    cell: Cell[];
    tape?: Tape[];
    tx?: BobTx;
    out?: Out;
};

declare type MAP = {
    app: string;
    type: string;
    context?: string;
    subcontext?: string;
    collection?: string;
    url?: string;
    audio?: string;
    channel?: string;
    rarity?: string;
    tx?: string;
    videoID?: string;
    provider?: string;
    tags?: string[];
    start?: string;
    duration?: string;
    [prop: string]: string | string[];
};

declare type MetaNet = {
    parent: MetanetNode;
    ancestor?: MetanetNode[];
    child?: MetanetNode[];
    head?: boolean;
    node: MetanetNode;
};

declare type MetanetNode = {
    tx: string;
    id: string;
    a: string;
};

export declare interface MomTx extends BobTx, MetaNet {}

declare type ORD = {
    data: string; //base64
    contentType: string;
};

export declare type Protocol = {
    name: string;
    handler: Handler;
    address?: string;
    opReturnSchema?: SchemaField[];
    scriptChecker?: ScriptChecker;
};

declare type RON = {
    pair: string; // TODO: json tring - needs parsing
    address: string;
    timestamp: string;
};

declare type SchemaField = { [key: string]: SchemaValue } | SimpleField[];

declare type SchemaValue = string | SimpleField | { [key: string]: SchemaValue } | SchemaValue[];

export declare type ScriptChecker = (cell: Cell[]) => boolean;

declare type SimpleField = { [key: string]: string };

export declare const supportedProtocols: string[];

declare type SYMRE = {
    url: string;
};

export declare const TransformTx: (tx: BobTx | string | MomTx | BmapTx, protocols?: string[] | Protocol[]) => Promise<BmapTx>;

export { }

declare module "bun:test" {
  export interface Assertion {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeDefined(): void;
    toBeTruthy(): void;
    toThrow(expected?: string | RegExp): void;
    rejects: {
      toThrow(expected?: string | RegExp): Promise<void>;
    };
  }

  export function expect(actual: any): Assertion;
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
}
