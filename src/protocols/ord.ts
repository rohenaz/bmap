import type { Cell } from "bpu-ts";
import type { HandlerProps, Protocol } from "../types/common";
import type { ORD as OrdType } from "../types/protocols/ord";

const scriptChecker = (cell: Cell[]) => {
  if (cell.length < 13) {
    // wrong length
    return false;
  }

  // Find OP_IF wrapper
  const startIdx = findIndex(cell, (c: Cell) => c.ops === "OP_IF");
  const endIdx = findIndex(cell, (c: Cell, i: number) => i > startIdx && c.ops === "OP_ENDIF");
  const ordScript = cell.slice(startIdx, endIdx);
  const prevCell = cell[startIdx - 1];
  return prevCell?.op === 0 && !!ordScript[0] && !!ordScript[1] && ordScript[1].s === "ord";
};

const handler = ({ dataObj, cell, out }: HandlerProps): void => {
  if (!cell[0] || !out) {
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  }

  // Find OP_IF wrapper
  const startIdx = findIndex(cell, (c: Cell) => c.ops === "OP_IF");
  const endIdx = findIndex(cell, (c: Cell, i: number) => i > startIdx && c.ops === "OP_ENDIF") + 1;
  const ordScript = cell.slice(startIdx, endIdx);

  if (!ordScript[0] || !ordScript[1] || ordScript[1].s !== "ord") {
    throw new Error("Invalid Ord tx. Prefix not found.");
  }

  let data: string | undefined;
  let contentType: string | undefined;
  ordScript.forEach((push, idx, all) => {
    // content-type
    if (push.ops === "OP_1") {
      contentType = all[idx + 1].s;
    }
    // data
    if (push.ops === "OP_0") {
      data = all[idx + 1].b;
    }
  });

  if (!data) {
    throw new Error("Invalid Ord data.");
  }
  if (!contentType) {
    throw new Error("Invalid Ord content type.");
  }

  const OrdObj: OrdType = {
    data,
    contentType,
  };

  if (!dataObj.ORD) {
    dataObj.ORD = [];
  }
  dataObj.ORD.push(OrdObj);
};

export const ORD: Protocol = {
  name: "ORD",
  handler,
  scriptChecker,
};

function findIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): number {
  return findLastIndex(array, predicate);
}

function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  fromIndex?: number
): number {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length - 1;
  if (fromIndex !== undefined) {
    index = fromIndex;
    index = fromIndex < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
  }
  return baseFindIndex(array, predicate, index, true);
}

function baseFindIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  fromIndex: number,
  fromRight: boolean
): number {
  const { length } = array;
  let index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
