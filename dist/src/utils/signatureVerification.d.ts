import { Cell, Tape } from 'bpu-ts';
import { BmapTx } from '../../types/common';
export declare const signatureHandler: (opReturnSchema: any[], protocolName: string, dataObj: BmapTx, cell: Cell[], tape: Tape[]) => Promise<void>;
