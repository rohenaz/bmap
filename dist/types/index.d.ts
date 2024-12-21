import { _21E8 } from './protocols';
import { AIP } from './protocols';
import { B } from './protocols';
import { BAP } from './protocols';
import { BITCOM } from './protocols';
import { BITKEY } from './protocols';
import { BITPIC } from './protocols';
import { BpuTx } from 'bpu-ts';
import { Cell } from 'bpu-ts';
import { HAIP } from './protocols';
import { In } from 'bpu-ts';
import { MAP } from './protocols';
import { ORD } from './protocols';
import { Out } from 'bpu-ts';
import { RON } from './protocols';
import { SYMRE } from './protocols';
import { Tape } from 'bpu-ts';

export declare const allProtocols: (Protocol | {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
})[];

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

export declare type Handler = (handlerProps: HandlerProps) => any;

export declare type HandlerProps = {
    dataObj: BmapTx;
    cell: Cell[];
    tape?: Tape[];
    tx?: BobTx;
    out?: Out;
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

export declare type Protocol = {
    name: string;
    handler: Handler;
    address?: string;
    opReturnSchema?: SchemaField[];
    scriptChecker?: ScriptChecker;
};

declare type SchemaField = { [key: string]: SchemaValue } | SimpleField[];

declare type SchemaValue = string | SimpleField | { [key: string]: SchemaValue } | SchemaValue[];

export declare type ScriptChecker = (cell: Cell[]) => boolean;

declare type SimpleField = { [key: string]: string };

export declare const supportedProtocols: string[];

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
