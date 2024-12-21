import { describe, expect, test } from "bun:test";
import type { Cell, Tape } from "bpu-ts";
import { METANET } from "../../src/protocols/metanet";
import type { BmapTx } from "../../src/types/common";
import type { BobTx } from "../../src/types/common";
import mapTransactions from "../data/map-transactions.json";
import metanetTransactions from "../data/metanet-transactions.json";

describe("metanet", () => {
  test("protocol definition", () => {
    expect(typeof METANET.name).toEqual("string");
    expect(typeof METANET.address).toEqual("string");
    expect(typeof METANET.opReturnSchema).toEqual("object");
    expect(typeof METANET.handler).toEqual("function");
  });

  test("parse invalid tx", async () => {
    const dataObj = {} as BmapTx;
    const cell = [] as Cell[];
    const tx = {} as BobTx;

    await expect(METANET.handler({ dataObj, cell, tx })).rejects.toThrow();
  });

  test("parse tx", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = mapTransactions[1].out[0].tape[1] as Tape;
    const { tape } = mapTransactions[1].out[0];
    const tx = mapTransactions[1];

    await METANET.handler({ dataObj, cell, tape, tx });

    expect(Array.isArray(dataObj.METANET)).toBe(true);
    expect(dataObj.METANET && typeof dataObj.METANET[0]).toEqual("object");
    expect(dataObj.METANET?.[0].node).toEqual({
      a: "1Gh97GZgcd6XkcwNBhWLVFzJAobWbHiyvd",
      tx: "ba7a5ac78fe11e8dc92f1c48b1707cdc49d91317062465aad9ae0a36c059f3cc",
      id: "2077c8667102a907be6bb5ffc2ad4e96bd178925e62c9b558258d0ebb278421e",
    });
    expect(dataObj.METANET?.[0].parent).toEqual({
      a: "1L4QsQsWd98ZqJtbi841dApmadFEfKZjMM",
      tx: "e03a98adcbcc0c44706d57f36335c94dc922488732c78a2f36e1f989c18dd9ff",
      id: "5479aaad72d05325a6f055905fa49933e9a2731f282472282a2883b7165a284c",
    });
  });

  test("parse tx 2", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = metanetTransactions[0].out[0].tape[1] as Tape;
    const { tape } = metanetTransactions[0].out[0];
    const tx = metanetTransactions[0];

    await METANET.handler({ dataObj, cell, tape, tx });
    expect(Array.isArray(dataObj.METANET)).toBe(true);
    expect(dataObj.METANET && typeof dataObj.METANET[0]).toEqual("object");
    expect(dataObj.METANET?.[0].node).toEqual({
      a: "1FqmFgY45CqSGXRNVpHNRQWqoNVCkRpUau",
      tx: "2f24d7edb8de0ef534d8e0bc2413eddda451b4accc481519a1647d7af79d8e88",
      id: "ef456f1afc40e789efb29e184f331e90d5c35b66423698da1553448c7ef9e0a5",
    });
    expect(dataObj.METANET?.[0].parent).toEqual({
      a: "1MncX49XDHnH3291wUdCfuUFQFJWSab8Uj",
      tx: "588aa018df5a029f01bbefb3bf3c212600d0caf83fdd7355ee8994f8b5a87e8a",
      id: "a8e9189b51b9cfedb4725dadae718a6a53a7a129b6433af4836e40e0efeec116",
    });
  });

  test("parse tx 3", async () => {
    const dataObj = {} as BmapTx;
    const { cell } = metanetTransactions[1].out[0].tape[1] as Tape;
    const { tape } = metanetTransactions[1].out[0];
    const tx = metanetTransactions[1];

    await METANET.handler({ dataObj, cell, tape, tx });
    expect(Array.isArray(dataObj.METANET)).toBe(true);
    expect(dataObj.METANET && typeof dataObj.METANET[0]).toEqual("object");
    expect(dataObj.METANET?.[0].node).toEqual({
      a: "1DmFvHmysemLdnFPoVxiJr5kvVMXZ1KySR",
      tx: "296ddbbbfd704f907ae5e1669a5ff266ba8335713298dd87cdf0ee8af0b4691a",
      id: "f3c88658391af6ab7ba876ab668ab112d189e5e396aaf2ad70935e226ab17f20",
    });
    expect(dataObj.METANET?.[0].parent).toEqual({
      a: "15YpmH1p5DowYa9mYRV9Vd5UzUo95JHRwe",
      tx: "46ed587c0305367efe3762e1e28c441b99e4ea13ab0d110c1f3818e4362ad90d",
      id: "3245c5fb93cc053ea440d18442afdda418638a0a3b64dde421db0617e254236a",
    });
  });
});

// TODO: Add test
// '66cc4d27e1b657871f6389e061a611ec2a4bb1a1fdd9253c5e94d89e61365bd8',
// this uses string '0' instead of OP_FALSE
