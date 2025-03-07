import { Hash, Utils } from "@bsv/sdk";
import type { Cell, Tape } from "bpu-ts";
import type { BmapTx, BobTx, SchemaField } from "./types/common";
const { toArray } = Utils;

export const isStringArray = (arr: Array<any>): boolean => {
  return (
    arr.length > 0 &&
    arr.every((value) => {
      return typeof value === "string";
    })
  );
};
export const isObjectArray = (arr: Array<any>): boolean => {
  return (
    arr.length > 0 &&
    arr.every((value) => {
      return value === "object";
    })
  );
};
/**
 * returns the BOB cell value for a given encoding
 *
 * @param pushData
 * @param schemaEncoding
 * @returns {string|number}
 */
export const cellValue = (pushData: Cell, schemaEncoding?: string): string | number => {
  if (!pushData) {
    throw new Error(`cannot get cell value of: ${pushData}`);
  }
  if (schemaEncoding === "string") {
    return pushData.s ? pushData.s : pushData.ls || "";
  }
  if (schemaEncoding === "hex") {
    return pushData.h
      ? pushData.h
      : pushData.lh ||
          (pushData.b
            ? Buffer.from(pushData.b, "base64").toString("hex")
            : pushData.lb && Buffer.from(pushData.lb, "base64").toString("hex")) ||
          "";
  }
  if (schemaEncoding === "number") {
    return Number.parseInt(pushData.h ? pushData.h : pushData.lh || "0", 16);
  }
  if (schemaEncoding === "file") {
    return `bitfs://${pushData.f ? pushData.f : pushData.lf}`;
  }
  if (schemaEncoding === "binary") {
    return pushData.b || pushData.lb || "";
  }

  return (pushData.b ? pushData.b : pushData.lb) || "";
};

/**
 * Check if cells end with OP_RETURN
 */
export const checkOpReturn = (cc: Tape): boolean => {
  return cc.cell.some((c: Cell) => c.op === 106);
};

/**
 * Check if cells end with OP_FALSE + OP_RETURN
 */
export const checkOpFalseOpReturn = (cc: Tape): boolean => {
  if (cc.cell.length !== 2) {
    return false;
  }
  const opReturnIdx = cc.cell.findIndex((c) => c.op === 106);
  if (opReturnIdx !== -1) {
    return cc.cell[opReturnIdx - 1]?.op === 0;
  }
  return false;
};

/**
 * Helper function to store protocol data
 *
 * @param dataObj
 * @param protocolName
 * @param data
 */
export const saveProtocolData = (
  dataObj: { [key: string]: any },
  protocolName: string,
  data: any
) => {
  if (!dataObj[protocolName]) {
    dataObj[protocolName] = [data];
  } else {
    if (!Array.isArray(dataObj[protocolName])) {
      const prevData = dataObj[protocolName];
      dataObj[protocolName] = [];
      dataObj[protocolName][0] = prevData;
    }
    dataObj[protocolName].push(data);
  }
};

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
export const bmapOpReturnSchemaHandler = (
  protocolName: string,
  opReturnSchema: SchemaField[],
  dataObj: BmapTx,
  cell: Cell[],
  tx: BobTx
) => {
  // loop over the schema
  const obj: { [key: string]: any } = {};

  // Does not have the required number of fields
  const length = opReturnSchema.length + 1;
  if (cell.length < length) {
    throw new Error(
      `${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`
    );
  }

  for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
    const x = Number.parseInt(idx, 10);

    const [field] = Object.keys(schemaField);
    const [schemaEncoding] = Object.values(schemaField);
    obj[field] = cellValue(cell[x + 1], schemaEncoding as string);
  }

  saveProtocolData(dataObj, protocolName, obj);
};

/**
 * Check whether the given data is base64
 *
 * @param data
 * @returns {boolean}
 */
export const isBase64 = (data: string) => {
  const regex = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${regex}$`, "gi").test(data);
};

// hashes a message buffer, returns the hash as a buffer
export const sha256 = (msgBuffer: number[]) => {
  return Hash.sha256(toArray(msgBuffer));
};

export const shallowEqualArrays = <T>(arr1: T[], arr2: T[]): boolean => {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};
