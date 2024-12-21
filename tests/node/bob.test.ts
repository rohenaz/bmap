import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import { bobFromRawTx } from "../../src/bmap";

const bapHex = fs.readFileSync(
  path.resolve(
    __dirname,
    "../data/653947cee3268c26efdcc97ef4e775d990e49daf81ecd2555127bda22fe5a21f.hex"
  ),
  "utf8"
);

describe("bob", () => {
  test("from raw tx", async () => {
    const tx = await bobFromRawTx(bapHex);
    // console.log({ outs: JSON.stringify(tx.out, null, 2) })
    console.log({ outs: tx.out.length });
  });
});
