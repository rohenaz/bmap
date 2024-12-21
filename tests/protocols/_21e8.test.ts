import { describe, expect, test } from "bun:test";
import { _21E8 } from "../../src/protocols/_21e8";

import type { Cell, Out } from "bpu-ts";
import type { BmapTx } from "../../src/types/common";

import boostTransaction from "../data/boost-transaction.json";

describe("21e8", () => {
  test("protocol definition", () => {
    expect(typeof _21E8.name).toEqual("string");
    expect(typeof _21E8.handler).toEqual("function");
  });

  test("parse invalid tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [] as Cell[];
    expect(() => {
      _21E8.handler({ dataObj, cell });
    }).toThrow();
  });

  test("parse tx - output index 3", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = boostTransaction.out[3].tape[0].cell as Cell[];
    const out = boostTransaction.out[3] as Out;

    _21E8.handler({ dataObj, cell, out });

    expect(Array.isArray(dataObj["21E8"])).toBe(true);
    expect(dataObj["21E8"] && typeof dataObj["21E8"][0]).toEqual("object");
    expect(dataObj["21E8"]?.[0].target).toEqual("21e8");
    expect(dataObj["21E8"]?.[0].value).toEqual(700);
    expect(dataObj["21E8"]?.[0].difficulty).toEqual(2);
    expect(dataObj["21E8"]?.[0].txid).toEqual(
      "18eaa89db7431a62d32510bd0253e0d9758d805ae629a3ca78245878cee60b1d"
    );
  });

  test("parse tx - output index 5", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = boostTransaction.out[5].tape[0].cell as Cell[];
    const out = boostTransaction.out[5] as Out;

    _21E8.handler({ dataObj, cell, out });

    expect(Array.isArray(dataObj["21E8"])).toBe(true);
    expect(dataObj["21E8"] && typeof dataObj["21E8"][0]).toEqual("object");
  });
});
