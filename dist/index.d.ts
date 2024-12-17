import { _21E8 } from './types/protocols/_21e8';
import { AIP } from './types/protocols/aip';
import { B } from './types/protocols/b';
import { BAP } from './types/protocols/bap';
import { BITCOM } from './types/protocols/bitcom';
import { BITKEY } from './types/protocols/bitkey';
import { BITPIC } from './types/protocols/bitpic';
import { BmapTx } from './types/common';
import { BobTx } from './types/common';
import { HAIP } from './types/protocols/haip';
import { Handler } from './types/common';
import { HandlerProps } from './types/common';
import { MAP } from './types/protocols/map';
import { MetaNet } from './types/common';
import { MomTx } from './types/common';
import { ORD } from './types/protocols/ord';
import { Out } from 'bpu-ts';
import { Protocol } from './types/common';
import { RON } from './types/protocols/ron';
import { ScriptChecker } from './types/common';
import { SYMRE } from './types/protocols/symre';
import { Tape } from 'bpu-ts';

export { _21E8 }

export { AIP }

export declare const allProtocols: (Protocol | {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
})[];

export { B }

export { BAP }

export { BITCOM }

export { BITKEY }

export { BITPIC }

export declare class BMAP {
    enabledProtocols: Map<string, string>;
    protocolHandlers: Map<string, Handler>;
    protocolScriptCheckers: Map<string, ScriptChecker>;
    protocolOpReturnSchemas: Map<string, Object[]>;
    constructor();
    addProtocolHandler({ name, address, opReturnSchema, handler, scriptChecker, }: Protocol): void;
    transformTx: (tx: BobTx | MomTx) => Promise<BmapTx>;
    processUnknown: (key: string, dataObj: Partial<BmapTx>, out: Out) => void;
    process: (protocolName: string, { cell, dataObj, tape, out, tx }: HandlerProps) => Promise<void>;
    processDataProtocols: (tape: Tape[], out: Out, tx: BobTx, dataObj: Partial<BobTx>) => Promise<Partial<BobTx>>;
}

export { BmapTx }

export declare const bobFromRawTx: (rawTx: string) => Promise<BobTx>;

export { BobTx }

export declare const defaultProtocols: Protocol[];

export declare const fetchRawTx: (txid: string) => Promise<string>;

export { HAIP }

export { Handler }

export { HandlerProps }

export { MAP }

export { MetaNet }

export { MomTx }

export { ORD }

export { Protocol }

export { RON }

export { ScriptChecker }

export declare const supportedProtocols: string[];

export { SYMRE }

export declare const TransformTx: (tx: BobTx | string | MomTx | BmapTx, protocols?: string[] | Protocol[]) => Promise<BmapTx>;

export { }
