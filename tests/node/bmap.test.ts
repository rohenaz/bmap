import { describe, expect, test } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
import { BMAP, TransformTx, allProtocols, bobFromRawTx } from "../../src/bmap";
import { _21E8 } from "../../src/protocols/_21e8";
import { AIP } from "../../src/protocols/aip";
import { B } from "../../src/protocols/b";
import { BOOST } from "../../src/protocols/boost";
import { MAP } from "../../src/protocols/map";
import { METANET } from "../../src/protocols/metanet";
import type { BobTx, Handler, HandlerProps } from "../../types/common";
import indexedTransaction from "../data/b-aip-transaction-with-indexes.json";
import validBobTransaction from "../data/bap-transaction.json";
import boostTransaction from "../data/boost-transaction.json";
import mapTransactions from "../data/map-transactions.json";
import unknownBitcom from "../data/unknown-bitcom.json";

const ordHex = fs.readFileSync(
	path.resolve(
		__dirname,
		"../data/10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6.hex",
	),
	"utf8",
);

const ordMegaHex = fs.readFileSync(
	path.resolve(
		__dirname,
		"../data/e17d7856c375640427943395d2341b6ed75f73afc8b22bb3681987278978a584.hex",
	),
	"utf8",
);

describe("bmap", () => {
	test("class init", () => {
		const bmap = new BMAP();
		expect(typeof bmap.enabledProtocols).toEqual("object");
		expect(bmap.enabledProtocols.size).toEqual(5);
		expect(bmap.enabledProtocols.get("meta")).toEqual("METANET");
		expect(
			bmap.enabledProtocols.get("15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva"),
		).toEqual("AIP");

		expect(typeof bmap.protocolHandlers).toEqual("object");
		expect(bmap.protocolHandlers.size).toEqual(6);
	});

	test("add handler", () => {
		const bmap = new BMAP();
		const opReturnSchema = [];
		const protocolHandler: Handler = ({
			dataObj,
			cell,
			tape,
			tx,
		}: HandlerProps) => {};
		bmap.addProtocolHandler({
			name: "test",
			address: "123TEST",
			opReturnSchema,
			handler: protocolHandler,
		});

		expect(typeof bmap.protocolHandlers).toEqual("object");
		expect(bmap.protocolHandlers.size).toEqual(7);
		expect(bmap.enabledProtocols.get("123TEST")).toEqual("test");
	});

	test("invalid tx", async () => {
		await expect(TransformTx({} as BobTx)).rejects.toThrow("Cannot process tx");
	});

	test("parse tx", async () => {
		const bmap = new BMAP();
		const parseTx = await bmap.transformTx(validBobTransaction as BobTx);

		expect(parseTx._id).toEqual("5f08ddb0f797435fbff1ddf0");
		expect(parseTx.tx.h).toEqual(
			"744a55a8637aa191aa058630da51803abbeadc2de3d65b4acace1f5f10789c5b",
		);

		expect(parseTx.AIP?.[0].algorithm).toEqual("BITCOIN_ECDSA");
		expect(parseTx.AIP?.[0].address).toEqual(
			"134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da",
		);
		expect(parseTx.AIP?.[0].signature).toEqual(
			"H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo=",
		);
		expect(parseTx.AIP?.[0].verified).toEqual(true);

		expect(parseTx.BAP?.[0].type).toEqual("ATTEST");
		expect(parseTx.BAP?.[0].hash).toEqual(
			"cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5",
		);
		expect(parseTx.BAP?.[0].sequence).toEqual("0");
	});

	test("parse twetch tx", async () => {
		return; // twetch signature seems different
		// const bmap = new BMAP()
		// const parseTx = await bmap.transformTx(twetchTransaction)
		// console.log(parseTx)

		// expect(parseTx._id).toEqual('5f08ddb0f797435fbff1ddf0')
		// expect(parseTx.tx.h).toEqual(
		//     '744a55a8637aa191aa058630da51803abbeadc2de3d65b4acace1f5f10789c5b'
		// )

		// expect(parseTx.AIP.algorithm).toEqual('BITCOIN_ECDSA')
		// expect(parseTx.AIP.address).toEqual(
		//     '134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da'
		// )
		// expect(parseTx.AIP.signature).toEqual(
		//     'H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo='
		// )
		// expect(parseTx.AIP.verified).toEqual(true)

		// expect(parseTx.BAP.type).toEqual('ATTEST')
		// expect(parseTx.BAP.hash).toEqual(
		//     'cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5'
		// )
		// expect(parseTx.BAP.sequence).toEqual('0')
	});

	test("parse double signed tx", async () => {
		const parseTx = await TransformTx(indexedTransaction as BobTx, [
			AIP.name,
			B.name,
		]);

		expect(parseTx._id).toEqual("5ee2aad74a4f6f397faf9971");
		expect(parseTx.tx.h).toEqual(
			"d4738845dc0d045a35c72fcacaa2d4dee19a3be1cbfcb0d333ce2aec6f0de311",
		);

		expect(parseTx.AIP).toBeDefined();
		expect(Array.isArray(parseTx.AIP)).toEqual(true);
		expect(parseTx.AIP?.[0].address).toEqual(
			"1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz",
		);
		expect(parseTx.AIP?.[0].verified).toEqual(true);
		expect(parseTx.AIP?.[1].address).toEqual(
			"19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR",
		);
		expect(parseTx.AIP?.[1].verified).toEqual(true);

		expect(Array.isArray(parseTx.B)).toBe(true);
		expect(parseTx.B?.[0].content).toEqual("Hello world!");
		expect(parseTx.B?.[0]["content-type"]).toEqual("text/plain");
		expect(parseTx.B?.[0].encoding).toEqual("utf-8");
		expect(parseTx.B?.[0].filename).toEqual("\u0000");
	});

	test("parse meta double map tx", async () => {
		const parseTx = await TransformTx(mapTransactions[1] as BobTx, [
			METANET.name,
			MAP.name,
		]);

		expect(parseTx._id).toEqual("5ee5e9544a4f6f5fbb7d0ff0");
		expect(parseTx.tx.h).toEqual(
			"ba7a5ac78fe11e8dc92f1c48b1707cdc49d91317062465aad9ae0a36c059f3cc",
		);

		expect(Array.isArray(parseTx.METANET)).toBe(true);
		expect(parseTx.METANET && typeof parseTx.METANET[0]).toEqual("object");
		// rest is checked in metanet.test.js

		expect(Array.isArray(parseTx.MAP)).toBe(true);
		expect(parseTx.MAP?.length).toEqual(2);
		expect(parseTx.MAP?.[0].cmd).toEqual("SET");
		expect(parseTx.MAP?.[1].cmd).toEqual("ADD");
		// rest is checked in map.test.js
	});

	test("parse boost double 21e8 tx", async () => {
		const bmap = new BMAP();
		bmap.addProtocolHandler(_21E8);
		bmap.addProtocolHandler(BOOST);
		const parseTx = await bmap.transformTx(boostTransaction as BobTx);

		expect(parseTx.tx.h).toEqual(
			"6bb713a65d0735cbe581ac66458ab83b557a58c198af2e2b5a2228d1b7ff8b87",
		);

		expect(Array.isArray(parseTx.BOOST)).toBe(true);
		expect(parseTx.BOOST && typeof parseTx.BOOST[0]).toEqual("object");
		// rest is checked in boost.test.js

		expect(Array.isArray(parseTx["21E8"])).toBe(true);
		expect(parseTx["21E8"]?.length).toEqual(2);
		expect(parseTx["21E8"]?.[0].value).toEqual(700);
		expect(parseTx["21E8"]?.[1].value).toEqual(700);
		// rest is checked in and _21e8.test.js
	});

	test("test TransformTx - override protocol list", async () => {
		const parseTx = await TransformTx(boostTransaction as BobTx, [
			"BOOST",
			"AIP",
		]);

		expect(parseTx.tx.h).toEqual(
			"6bb713a65d0735cbe581ac66458ab83b557a58c198af2e2b5a2228d1b7ff8b87",
		);

		expect(Array.isArray(parseTx.BOOST)).toBe(true);
		expect(parseTx.BOOST && typeof parseTx.BOOST[0]).toEqual("object");
		// rest is checked in boost.test.js

		expect(Array.isArray(parseTx["21E8"])).toBe(true);
		expect(parseTx["21E8"]?.length).toEqual(2);
		expect(parseTx["21E8"]?.[0].value).toEqual(700);
		expect(parseTx["21E8"]?.[1].value).toEqual(700);
		// rest is checked in and _21e8.test.js

		//MAP should not be available
		expect(!!parseTx.MAP).toBe(false);
	});

	test("test OP_RETURN without OP_FALSE", async () => {
		// TODO: This is working but we should add a test anyway
		// bap-op-return-no-op-false.json
	});

	test("test unknown bitcom", async () => {
		const parseTx = await TransformTx(unknownBitcom as BobTx);

		expect(parseTx.tx.h).toEqual(
			"cdfe7ae5c91afe4dc3a5db383e0ca948ec3d51dc2954a9d18ca464db7c9d5d3d",
		);

		expect(
			parseTx["1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo"] &&
				Array.isArray(parseTx["1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo"]),
		).toBe(true);
		// expect(parseTx.BOOST && typeof parseTx.BOOST[0]).toEqual('object')
		// // rest is checked in boost.test.js

		// expect(Array.isArray(parseTx['21E8'])).toBe(true)
		// expect(parseTx['21E8'] && parseTx['21E8'].length).toEqual(2)
		// expect(parseTx['21E8'] && parseTx['21E8'][0].value).toEqual(700)
		// expect(parseTx['21E8'] && parseTx['21E8'][1].value).toEqual(700)
		// rest is checked in and _21e8.test.js
	});
});

describe("Ord 2", () => {
	test("parse tx - output TransformTx", async () => {
		const tx = await TransformTx(
			ordHex,
			allProtocols.map((n) => n.name),
		);
		expect(tx).toBeTruthy();
		expect(tx.tx?.h).toEqual(
			"10f4465cd18c39fbc7aa4089268e57fc719bf19c8c24f2e09156f4a89a2809d6",
		);
		expect(tx.ORD).toBeDefined();
	});

	test("parse tx - multiple outs w map collection", async () => {
		const tx = await bobFromRawTx(ordMegaHex);
		expect(tx).toBeTruthy();
		expect(tx.tx?.h).toEqual(
			"e17d7856c375640427943395d2341b6ed75f73afc8b22bb3681987278978a584",
		);
		const bmapTx = await TransformTx(tx);
		expect(bmapTx.ORD).toBeDefined();
		expect(Array.isArray(bmapTx.ORD)).toBe(true);
		expect(bmapTx.ORD?.[0].contentType).toBe("image/png");

		expect(bmapTx.MAP).toBeDefined();
		expect(bmapTx.MAP?.[0].collection).toBe("sMon");
	});
});
