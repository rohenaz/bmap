import { describe, expect, test } from "bun:test";
import type { Cell, Tape } from "bpu-ts";
import { AIP } from "../../src/protocols/aip";
import type { BmapTx, BobTx } from "../../src/types";
import aipTransactions from "../data/aip-transactions.json";
import indexedTransaction from "../data/b-aip-transaction-with-indexes.json";
import validBobTransaction from "../data/bap-transaction.json";
import unsignedBobTransaction from "../data/bap-unsigned-transaction.json";
import mapTransactions from "../data/map-transactions.json";
import twetchTransaction from "../data/twetch-transaction.json";
// import bmap from "../../src/bmap";
// import { TransformTx } from "../../src/bmap";
// import { HD } from "@bsv/sdk";

describe("aip", () => {
  test("protocol definition", async () => {
    expect(typeof AIP.name).toEqual("string");
    expect(typeof AIP.address).toEqual("string");
    expect(typeof AIP.opReturnSchema).toEqual("object");
    expect(typeof AIP.handler).toEqual("function");
  });

  test("parse invalid tx", async () => {
    const dataObj = {} as BmapTx;
    const cell = [] as Cell[];
    const tape = [] as Tape[];
    const tx = {} as BobTx;
    await expect(AIP.handler({ dataObj, cell, tx, tape })).rejects.toThrow(
      "AIP requires at least 4 fields including the prefix"
    );
  });

  test("parse tx", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = validBobTransaction.out[0].tape[2] as Tape;
    const { tape } = validBobTransaction.out[0];
    const tx = validBobTransaction;
    AIP.handler({ dataObj, cell, tape, tx });
    expect(typeof dataObj.AIP).toEqual("object");
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo="
    );
    expect(dataObj.AIP?.[0].verified).toEqual(true);
  });

  test("parse twetch tx", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = twetchTransaction[0].out[0].tape[2] as Tape;
    const { tape } = twetchTransaction[0].out[0];
    const tx = twetchTransaction[0] as BobTx;
    AIP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.AIP && typeof dataObj.AIP[0]).toEqual("object");
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("1LQKZfR4YMWPZ9FwktC4PSwCzR71VbyMEi");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "IGazHTNxQ/i//jjkynlaIr5jwBdlYtHVWlJQIc0Y0YX+H2Kv8tmv9rxMgf8StsZnSvKUKK7KCpio6pCQzN3oifs="
    );
    expect(dataObj.AIP?.[0].verified).toEqual(true);
  });

  test("parse twetch tx 2", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = twetchTransaction[1].out[0].tape[3] as Tape;
    const { tape } = twetchTransaction[1].out[0];
    const tx = twetchTransaction[1] as BobTx;
    AIP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.AIP && typeof dataObj.AIP[0]).toEqual("object");
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("1DL2kssJGtY9szPfURVt7dxR1JsMXvBKZH");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "H+hD160bLia7bDBX0MWsh1D6JX9HjNt6+HC33km0EkzJdSTug6P5mhdLFPLleOjpOXDY0Be0SdVTshjEGRVBdn0="
    );
    expect(dataObj.AIP?.[0].verified).toEqual(true);
  });

  test("unsigned tx", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = unsignedBobTransaction.out[0].tape[2] as Tape;
    const { tape } = unsignedBobTransaction.out[0];
    const tx = unsignedBobTransaction as BobTx;
    await expect(AIP.handler({ dataObj, cell, tx, tape })).rejects.toThrow(
      "AIP requires a signature"
    );
  });

  test("indexed tx - first AIP", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = indexedTransaction.out[0].tape[2];
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;
    AIP.handler({ dataObj, cell, tape, tx });
    // console.log({ JSON: JSON.stringify(dataObj, null, 2) });
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "HKzuHb43Xj4XpmK1YJROD/eN/58ZR0T7LuRi2QW8eFcnQg1d7tSy3QGQI/VQr09PeTQFAXniFyIFkqQYgvAlHvQ="
    );
    expect(dataObj.AIP?.[0].index).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(dataObj.AIP?.[0].verified).toEqual(false);
  });

  test("indexed tx - second AIP", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = indexedTransaction.out[0].tape[3];
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;
    AIP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "G0IShkx5mp0vHOt7To4UxcttlDo4BnG7xV3NaZkwNDy9Ht9iogRYn4o4T4lHZbS5iy4ay9Opr0kwB++FYk0tLFA="
    );
    expect(dataObj.AIP?.[0].index).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ]);
    // Is this signature actually invalid? Everything looks perfect!?
    expect(dataObj.AIP?.[0].verified).toEqual(false);
  });

  test("bsocial tx", async () => {
    const dataObj = {} as BmapTx;
    const tx = mapTransactions[6];
    const { tape } = tx.out[0];
    const { cell } = tape[3];
    AIP.handler({ dataObj, cell, tape, tx });
    expect(Array.isArray(dataObj.AIP)).toBe(true);
    expect(dataObj.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
    expect(dataObj.AIP?.[0].address).toEqual("1PXpeXKc7TXrofPm5paDWziLjvcCDPvjnY");
    expect(dataObj.AIP?.[0].signature).toEqual(
      "INJnUoEOjo6uu0MvcJ8VK07C1WdwWUdQLZySiXtOEG4YNaqF99yPFLlJRXd1B1fpQ2x2avhoBWf+TE/0jrCMDuQ="
    );
    expect(dataObj.AIP?.[0].index).toEqual([]);
    expect(dataObj.AIP?.[0].verified).toEqual(true);
  });

  // TODO: bitfs is not available causing AIP verification to fail on transactions that do no include their own data
  // test('bsocial tx with image', async () => {
  //     const dataObj = {} as BmapTx
  //     const tx = mapTransactions[7]
  //     const { tape } = tx.out[0]
  //     const { cell } = tape[3]
  //     AIP.handler({ dataObj, cell, tape, tx })
  //     expect(dataObj.AIP[0].algorithm).toEqual('BITCOIN_ECDSA')
  //     expect(dataObj.AIP[0].address).toEqual(
  //         '1PXpeXKc7TXrofPm5paDWziLjvcCDPvjnY'
  //     )
  //     expect(dataObj.AIP[0].signature).toEqual(
  //         'IGjc44XGNse1kPUveBS8zXqnbuLL7Lsl5veqLjJzpjGpEJWGoYweYs1oSP5vbb+23GxBTFwA6yThmK8TzvXxKBA='
  //     )
  //     expect(dataObj.AIP[0].index).toEqual([])
  //     // TODO: This may have been previously passing
  //     // it is failing now after the typescript migration
  //     // set this to true and find out why it isnt verifying,
  //     // or confirm it is not a valid signature and remove this message
  //     expect(dataObj.AIP[0].verified).toEqual(false)
  // })

  test("badly signed tx", async () => {
    const dataObj = {} as BmapTx;
    const tx = aipTransactions[0];
    const { tape } = tx.out[0];
    const { cell } = tape[3];
    await expect(AIP.handler({ dataObj, cell, tx, tape })).rejects.toThrow(
      "AIP requires at least 4 fields including the prefix"
    );
  });

  //   test("double sign op_return data", async () => {
  //     const { PrivateKey, BSM, Hash, Script, Transaction, P2PKH, Utils } = await import("@bsv/sdk");
  //     const { BAP } = await import("bsv-bap");

  //     const bap = new BAP(HD.fromRandom());
  //     const bapId = bap.newId()
  //     const { toHex, toArray } = Utils;
  //     // Create two private keys for signing
  //     const privateKey1 = PrivateKey.fromRandom();
  //     const privateKey2 = PrivateKey.fromRandom();
  //     const address1 = privateKey1.toPublicKey().toAddress().toString();
  //     const address2 = privateKey2.toPublicKey().toAddress().toString();

  //     // Create OP_RETURN data to sign
  //     const message = "Hello, Bitcoin! Needs a long enough mesage to get past the size limit in bsvSdk";
  //     const lockingScript = Script.fromASM(`OP_FALSE OP_RETURN ${toHex(toArray(message, 'utf8'))}`);

  //     // Create transaction structure
  //     const opReturnOutput = {
  //       lockingScript,
  //       satoshis: 0
  //     };

  //     const tx = new Transaction(1, [], [opReturnOutput]);
  //     await tx.sign();

  //     // Parse and verify signatures
  //     const result = await TransformTx(tx.toHex());
  // const opReturnData: string[]
  //  bapId.signOpReturnWithAIP(opReturnData)
  //     expect(result.AIP?.[0].verified).toBe(true);
  //     expect(result.AIP?.[1].verified).toBe(true);
  //   });
});
