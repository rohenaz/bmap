import { BmapTx, BobTx, Handler, HandlerProps, MomTx, Out, Protocol, ScriptChecker } from "../types/common";
export const allProtocols: (Protocol | {
    name: string;
    address: string;
    opReturnSchema: {
        url: string;
    }[];
    handler: ({ dataObj, cell, tx }: HandlerProps) => void;
})[];
export const supportedProtocols: string[];
export const defaultProtocols: Protocol[];
export class BMAP {
    enabledProtocols: Map<string, string>;
    protocolHandlers: Map<string, Handler>;
    protocolScriptCheckers: Map<string, ScriptChecker>;
    protocolOpReturnSchemas: Map<string, Object[]>;
    constructor();
    addProtocolHandler({ name, address, opReturnSchema, handler, scriptChecker, }: Protocol): void;
    transformTx: (tx: BobTx | MomTx) => Promise<BmapTx>;
    processUnknown: (key: string, dataObj: Partial<BmapTx>, out: Out) => void;
    process: (protocolName: string, { cell, dataObj, tape, out, tx }: HandlerProps) => Promise<void>;
}
export const TransformTx: (tx: BobTx, protocols?: string[] | Protocol[]) => Promise<BmapTx>;

//# sourceMappingURL=index.d.ts.map
