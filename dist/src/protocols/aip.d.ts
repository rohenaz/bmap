import { Cell, Tape } from 'bpu-ts';
import { Protocol } from '../../types/common';
export declare enum SIGPROTO {
    HAIP = "HAIP",
    AIP = "AIP"
}
export declare const AIPhandler: (useOpReturnSchema: any[], protocol: SIGPROTO, dataObj: any, cell: Cell[], tape: Tape[], tx?: any) => Promise<void>;
export declare const AIP: Protocol;
