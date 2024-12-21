import { describe, expect, test } from "bun:test";
import type { Cell, Tape } from "bpu-ts";
import { MAP } from "../../src/protocols/map";
import type { BmapTx, BobTx } from "../../src/types/common";
import mapTransactions from "../data/map-transactions.json";

describe("map", () => {
  test("protocol definition", () => {
    expect(typeof MAP.name).toEqual("string");
    expect(typeof MAP.address).toEqual("string");
    expect(typeof MAP.opReturnSchema).toEqual("object");
    expect(typeof MAP.handler).toEqual("function");
  });

  test("parse invalid tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [] as Cell[];
    const tx = {} as BobTx;
    expect(() => {
      MAP.handler({ dataObj, cell, tx });
    }).toThrow();
  });

  test("parse tx", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[0] as BobTx;
    const { tape } = tx.out[0];
    if (tape) {
      const { cell } = tape[1];
      MAP.handler({ dataObj, cell, tape, tx });
      expect(dataObj.MAP?.[0]).toEqual({
        cmd: "SET",
        app: "2paymail",
        paymail: "hagbard@moneybutton.com",
        public_key: "02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0",
        platform: "twitter",
        proof_url: "https://twitter.com/hagbarddd/status/1205189580309377024",
        proof_body: "Hi\n\nMy paymail is hagbard@moneybutton.com",
        proof_id: "Jk9vQgpdDpoW0qDY",
      });
    }
  });

  test("parse tx 2", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[1] as BobTx;
    const { tape } = tx.out[0];
    if (tape) {
      const { cell } = tape[3];
      MAP.handler({ dataObj, cell, tape, tx });
      expect(dataObj.MAP?.[0]).toEqual({
        cmd: "SET",
        type: "content",
        cost: "free",
        encryption: "secretbox",
        title:
          "QMgkQwvfPSDSciCcBzMlKekCIyi7O8SrGIZT6fr0aHx608HjjGkAN12Wi+gXowdwXkvFAc9ElcCW5k+bDX2YVtTGnvQw7RG6DsAHcOcyrZFmt1SfftV+kU0bZtSuw7PUk6eTmO9vV7cfTjp1bJIqBkU50BE=",
        titleNonce: "vY/G7emWqrVSvjwdSi6xwnlissY36PPC",
        hash: "bfa3e480160ded9dfcb1547b09366ea50ed92943e68e60e17bf9df49c5f17eee",
        magicdata:
          "31465061787a5643464c6944654b7064427a76456b7268477a434c525241624c506f0a7c0a4d41500a5345540a706172656e740a323165383030393663323165326465353264373431616332373630376532353137373063306239663765363434663638346366333731373365383731383230650a6e616d6573706163650a37343333663836312d303631652d346630392d613730322d6432643135343733313462360a7c0a4d41500a4144440a746167730a4253560a417070730a4561726e696e67",
        app: "Bit.sv",
        timestamp: "1586997452",
      });
    }
  });

  test("parse tx 3", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[1];
    const { tape } = tx.out[0];
    const { cell } = tape[4];
    MAP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "ADD",
      tags: ["BSV", "Apps", "Earning"],
    });
  });

  test("parse REMOVE", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[2];
    const { tape } = tx.out[0];
    const { cell } = tape[0];
    MAP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "REMOVE",
      key: "public_key",
    });
  });

  test("parse DELETE", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[3];
    const { tape } = tx.out[0];
    const { cell } = tape[0];
    MAP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "DELETE",
      public_key: ["02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0"],
    });
  });

  test("parse MSGPACK", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[4];
    const { tape } = tx.out[0];
    const { cell } = tape[0];
    MAP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.MAP?.[0]).toEqual({});
  });

  test("parse JSON", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const tx = mapTransactions[5];
    const { tape } = tx.out[0];
    const { cell } = tape[0];
    MAP.handler({ dataObj, cell, tape, tx });
    expect(dataObj.MAP?.[0]).toEqual({});
  });

  // advanced tests

  test("parse DELETE", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [
      { s: "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", i: 0 },
      { s: "DELETE", i: 1 },
      { s: "public_key", i: 2 },
      {
        s: "02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0",
        i: 3,
      },
    ] as Cell[];
    MAP.handler({ dataObj, cell, tape: [] as Tape[], tx: {} as BmapTx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "DELETE",
      public_key: ["02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0"],
    });
  });

  test("parse protocol separator", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [
      { s: "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", i: 0 },
      { s: "SET", i: 1 },
      { s: "app", i: 2 },
      { s: "social", i: 3 },
      { s: ":::", i: 4 },
      { s: "ADD", i: 5 },
      { s: "tag", i: 6 },
      { s: "bitcoin", i: 7 },
      { s: "social", i: 8 },
    ] as Cell[];
    MAP.handler({ dataObj, cell, tape: [], tx: {} as BmapTx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "SET",
      app: "social",
      tag: ["bitcoin", "social"],
    });
  });

  test("parse poll", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [
      { s: "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", i: 0 },
      { s: "SET", i: 1 },
      { s: "app", i: 2 },
      { s: "social", i: 3 },
      { s: "type", i: 4 },
      { s: "poll", i: 5 },
      { s: ":::", i: 6 },
      { s: "ADD", i: 7 },
      { s: "options", i: 8 },
      { s: "bitcoin", i: 9 },
      { s: "social", i: 10 },
    ] as Cell[];
    MAP.handler({ dataObj, cell, tape: [] as Tape[], tx: {} as BmapTx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "SET",
      app: "social",
      type: "poll",
      options: ["bitcoin", "social"],
    });
  });

  test("parse vote", () => {
    const dataObj = { timestamp: Date.now() } as BmapTx;
    const cell = [
      { s: "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", i: 0 },
      { s: "SET", i: 1 },
      { s: "app", i: 2 },
      { s: "social", i: 3 },
      { s: "type", i: 4 },
      { s: "vote", i: 5 },
      { s: "tx", i: 6 },
      { s: "txId", i: 7 },
      { s: "vote", i: 8 },
      { s: "bitcoin", i: 9 },
    ] as Cell[];
    MAP.handler({ dataObj, cell, tape: [] as Tape[], tx: {} as BmapTx });
    expect(dataObj.MAP?.[0]).toEqual({
      cmd: "SET",
      app: "social",
      type: "vote",
      tx: "txId",
      vote: "bitcoin",
    });
  });
});

// TODO: Test bad B + MAP txs
// 'a970f70aad77704e55379ef22150c1bfd77232da5701959093d20cbe68fc1327',
// 'a970f70aad77704e55379ef22150c1bfd77232da5701959093d20cbe68fc1327',
// Bad Twetch '20df173a582d85b4bb337dc5e849daca6b10664aae3b6cb04dd7975eb2a99a12',
// Bad MAP JSON '4eedd926d8b8f32f11699e35d323aa102daf705543803c281b572ca559f435f6',
// Very bad MAP JSON '13b59940d3ad80b1203e20dadd54103a4343b39c93c700f20edd07d08bacd329',
