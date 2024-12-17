import { Out, Tape } from 'bpu-ts';
import { BmapTx, BobTx, Handler, HandlerProps, MomTx, Protocol, ScriptChecker } from '../types/common';
export declare const allProtocols: (Protocol | {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
})[];
export declare const supportedProtocols: string[];
export declare const defaultProtocols: Protocol[];
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
export declare const fetchRawTx: (txid: string) => Promise<string>;
export declare const bobFromRawTx: (rawTx: string) => Promise<BobTx>;
export declare const TransformTx: (tx: BobTx | string | MomTx | BmapTx, protocols?: string[] | Protocol[]) => Promise<BmapTx>;
