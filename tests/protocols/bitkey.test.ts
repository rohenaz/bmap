import { describe, expect, test } from "bun:test";
import type { Cell } from "bpu-ts";
import { BITKEY } from "../../src/protocols/bitkey";
import type { BmapTx } from "../../src/types/common";
import bitkeyTransactions from "../data/bitkey-transactions.json";

describe("bitkey", () => {
  test("protocol definition", () => {
    expect(typeof BITKEY.name).toEqual("string");
    expect(typeof BITKEY.address).toEqual("string");
    expect(typeof BITKEY.opReturnSchema).toEqual("object");
    expect(typeof BITKEY.handler).toEqual("function");
  });

  test("parse invalid tx", async () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [] as Cell[];
    await expect(BITKEY.handler({ dataObj, cell })).rejects.toThrow();
  });

  test("parse tx", async () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = bitkeyTransactions[0].out[0].tape[1].cell as Cell[];

    await BITKEY.handler({ dataObj, cell });

    expect(dataObj.BITKEY && typeof dataObj.BITKEY[0]).toEqual("object");
    expect(dataObj.BITKEY?.[0].bitkey_signature).toEqual(
      "H+g5cgN6ILgrtoxSpt25ogVkOMuC6irp8Il7e5SGVrrkC2xZMIdCNwt8TPjbIG9ZTBDrVQujT0CeRWINpXXTRHU="
    );
    expect(dataObj.BITKEY?.[0].user_signature).toEqual(
      "H+OgWIxuPUV18+FFl1sXvEQ0lZ2OsYbWf385F3ZnBPSxBo4X/2K94xuSbWwDIuD8DS4O98RywgkAzgEOxRhN6+4="
    );
    expect(dataObj.BITKEY?.[0].paymail).toEqual("644@moneybutton.com");
    expect(dataObj.BITKEY?.[0].pubkey).toEqual(
      "03836714653ab7b17569be03eaf6593d59116700a226a3c812cc1f3b3c8f1cbd6c"
    );
    // TODO: The bitkey_signature is not matching the bitkey server key 13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC
    // expect(dataObj.BITKEY && dataObj.BITKEY[0].verified).toEqual(false)
  });
});
