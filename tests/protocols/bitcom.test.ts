import { describe, expect, test } from "bun:test";
import type { Cell } from "bpu-ts";
import { BITCOM } from "../../src/protocols/bitcom";
import type { BmapTx } from "../../src/types/common";
import bitcomTransactions from "../data/bitcom-transactions.json";

describe("bitcom", () => {
  test("protocol definition", () => {
    expect(typeof BITCOM.name).toEqual("string");
    expect(typeof BITCOM.address).toEqual("string");
    expect(typeof BITCOM.opReturnSchema).toEqual("object");
    expect(typeof BITCOM.handler).toEqual("function");
  });

  test("parse invalid tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [] as Cell[];
    expect(() => {
      BITCOM.handler({ dataObj, cell });
    }).toThrow();
  });

  test("parse useradd tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = bitcomTransactions[0].out[0].tape[1].cell as Cell[];

    BITCOM.handler({ dataObj, cell });
    expect(Array.isArray(dataObj.BITCOM)).toBe(true);
    expect(dataObj.BITCOM && Array.isArray(dataObj.BITCOM[0])).toBe(true);
    expect(dataObj.BITCOM?.[0][0]).toEqual("$");
    expect(dataObj.BITCOM?.[0][1]).toEqual("useradd");
    expect(dataObj.BITCOM?.[0][2]).toEqual("188PLHvKNaEWHVZZFrX23maw5TtsnmgSSE");
  });

  test("parse echo tx", () => {
    const dataObj = {} as BmapTx;
    const cell = bitcomTransactions[1].out[0].tape[1].cell as Cell[];

    BITCOM.handler({ dataObj, cell });
    expect(Array.isArray(dataObj.BITCOM)).toBe(true);
    expect(dataObj.BITCOM && Array.isArray(dataObj.BITCOM[0])).toBe(true);
    expect(dataObj.BITCOM?.[0][0]).toEqual("$");
    expect(dataObj.BITCOM?.[0][1]).toEqual("echo");
    expect(dataObj.BITCOM?.[0][2]).toEqual("genesis");
    expect(dataObj.BITCOM?.[0][3]).toEqual("to");
    expect(dataObj.BITCOM?.[0][4]).toEqual("name");
  });
});
