import { Cell, Tape } from 'bpu-ts';
import { BobTx } from '../types/common';
export declare const isStringArray: (arr: Array<any>) => boolean;
export declare const isObjectArray: (arr: Array<any>) => boolean;
/**
 * returns the BOB cell value for a given encoding
 *
 * @param pushData
 * @param schemaEncoding
 * @returns {string|number}
 */
export declare const cellValue: (pushData: Cell, schemaEncoding?: string) => string | number;
/**
 * Check if cells end with OP_RETURN
 */
export declare const checkOpReturn: (cc: Tape) => boolean;
/**
 * Check if cells end with OP_FALSE + OP_RETURN
 */
export declare const checkOpFalseOpReturn: (cc: Tape) => boolean;
/**
 * Helper function to store protocol data
 *
 * @param dataObj
 * @param protocolName
 * @param data
 */
export declare const saveProtocolData: (dataObj: {
    [key: string]: any;
}, protocolName: string, data: any) => void;
/**
 * BMAP default handler to work with query schema's
 *
 * @param opReturnSchema
 * @param protocolName
 * @param dataObj
 * @param cell
 * @param tape
 * @param tx
 */
export declare const bmapOpReturnSchemaHandler: (protocolName: string, opReturnSchema: Object[], dataObj: Object, cell: Cell[], tx: BobTx) => void;
/**
 * Check whether the given data is base64
 *
 * @param data
 * @returns {boolean}
 */
export declare const isBase64: (data: string) => boolean;
export declare const sha256: (msgBuffer: number[]) => number[];
