import { describe, expect, test } from "bun:test";
import type { Cell, Tape } from "bpu-ts";
import { BAP } from "../../src/protocols/bap";
import type { BmapTx, BobTx } from "../../src/types/common";

import validBobTransaction from "../data/bap-transaction.json";

describe("bap", () => {
  test("protocol definition", () => {
    expect(typeof BAP.name).toEqual("string");
    expect(typeof BAP.address).toEqual("string");
    expect(typeof BAP.opReturnSchema).toEqual("object");
    expect(typeof BAP.handler).toEqual("function");
  });

  test("parse invalid tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [] as Cell[];
    const tape = [] as Tape[];
    const tx = {} as BobTx;
    expect(() => {
      BAP.handler({ dataObj, cell, tape, tx });
    }).toThrow();
  });

  test("parse tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = validBobTransaction.out[0].tape[1].cell as Cell[];
    const tape = validBobTransaction.out[0].tape as Tape[];
    const tx = {} as BobTx;
    BAP.handler({ dataObj, cell, tape, tx });
    expect(Array.isArray(dataObj.BAP)).toBe(true);
    expect(typeof dataObj.BAP).toEqual("object");
    expect(dataObj.BAP?.[0].type).toEqual("ATTEST");
    expect(dataObj.BAP?.[0].hash).toEqual(
      "cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5"
    );
    expect(dataObj.BAP?.[0].sequence).toEqual("0");
  });
});
