import { BmapTx, BobTx, Handler, MomTx } from "../types/common";
export class BMAP {
    protocolMap: Map<string, string>;
    protocolHandlers: Map<string, Handler>;
    protocolQuerySchemas: Map<string, Object[]>;
    constructor();
    addProtocolHandler(protocolDefinition: {
        name: string;
        address: string;
        querySchema: Object[];
        handler: Handler;
    }): void;
    transformTx: (tx: BobTx | MomTx) => Promise<BmapTx>;
}
export const TransformTx: (tx: BobTx) => Promise<BmapTx>;

//# sourceMappingURL=types.d.ts.map
