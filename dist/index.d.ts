import { BmapTx } from './types/common';
import { BobTx } from './types/common';
import { Handler } from './types/common';
import { HandlerProps } from './types/common';
import { MomTx } from './types/common';
import { Out } from 'bpu-ts';
import { Protocol } from './types/common';
import { ScriptChecker } from './types/common';
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

export { Handler }

export { HandlerProps }

export { MomTx }

export { Protocol }

export { ScriptChecker }

export declare const supportedProtocols: string[];

export declare const TransformTx: (tx: BobTx | string | MomTx | BmapTx, protocols?: string[] | Protocol[]) => Promise<BmapTx>;

export { }
