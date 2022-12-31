import { BmapTx, BobTx, Handler, HandlerProps, MomTx, Protocol } from "../types/common";
export class BMAP {
    protocolMap: Map<string, string>;
    protocolHandlers: Map<string, Handler>;
    protocolQuerySchemas: Map<string, Object[]>;
    constructor();
    addProtocolHandler({ name, address, querySchema, handler }: Protocol): void;
    transformTx: (tx: BobTx | MomTx) => Promise<BmapTx>;
    process: ({ cell, dataObj, tape, out, tx }: HandlerProps) => Promise<void>;
}
export const TransformTx: (tx: BobTx) => Promise<BmapTx>;

//# sourceMappingURL=index.d.ts.map
