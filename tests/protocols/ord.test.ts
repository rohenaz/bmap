import { describe, expect, test } from "bun:test";
import fs from "fs";
import path from "path";
import { bobFromRawTx } from "../../src/bmap";
import { ORD } from "../../src/protocols/ord";

import type { Cell, Out } from "bpu-ts";
import type { BmapTx } from "../../src/types/common";

const ordHex = fs.readFileSync(
  path.resolve(
    __dirname,
    "../data/10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6.hex"
  ),
  "utf8"
);

describe("Ord", () => {
  test("ord protocol definition", () => {
    expect(typeof ORD.name).toEqual("string");
    expect(typeof ORD.handler).toEqual("function");
  });

  test("parse invalid tx", () => {
    const dataObj = {} as BmapTx;
    const cell = [] as Cell[];
    expect(() => {
      ORD.handler({ dataObj, cell });
    }).toThrow();
  });

  test("parse tx - output 0", async () => {
    const dataObj = {} as BmapTx;
    const tx = await bobFromRawTx(ordHex);
    expect(tx).toBeTruthy();
    expect(tx?.tx?.h).toEqual("10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6");
    if (tx?.out[0]?.tape) {
      const cell = tx.out[0].tape[0].cell as Cell[];
      const out = tx.out[0] as Out;

      ORD.handler({ dataObj, cell, out });

      expect(dataObj.ORD).toBeDefined();
      expect(Array.isArray(dataObj.ORD)).toBe(true);
      expect(dataObj.ORD?.[0]?.contentType).toBe("model/gltf-binary");
      expect(dataObj.ORD?.[0]?.data.startsWith("Z2xURgIAAABobgwAbAcAAEpTT057")).toBe(true);
    }
  });
});
