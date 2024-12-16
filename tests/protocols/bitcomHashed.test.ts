import { describe, expect, test } from "@jest/globals";
import type { Cell, Out, Tape } from "bpu-ts";
import { BITCOM_HASHED } from "../../src/protocols/bitcomHashed";
import type { BmapTx, BobTx } from "../../types/common";
import bitcomHashedTransaction from "../data/bitcom-hashed.json";

describe("bitcom hashed", () => {
	test("protocol definition", () => {
		expect(typeof BITCOM_HASHED.name).toEqual("string");
		expect(typeof BITCOM_HASHED.address).toEqual("string");
		expect(typeof BITCOM_HASHED.opReturnSchema).toEqual("object");
		expect(typeof BITCOM_HASHED.handler).toEqual("function");
	});

	test("parse invalid tx", async () => {
		const dataObj = {} as BmapTx;
		const cell = [] as Cell[];
		const tx = {} as BobTx;
		await expect(BITCOM_HASHED.handler({ dataObj, cell, tx })).rejects.toThrow(
			"Invalid BITCOM_HASHED tx. Bad tape",
		);
	});

	// export type BITCOM_HASHED = [
	//     { address: string },
	//     { h: string },
	//     { b64: string },
	//     { b: string },
	//     { paymail: string }
	// ]

	test("parse tx - out 1", async () => {
		const dataObj = {} as BmapTx;
		const tx = bitcomHashedTransaction as BobTx;
		const { cell } = bitcomHashedTransaction.out[0].tape[2] as Tape;
		const { tape } = bitcomHashedTransaction.out[0] as Out;

		await BITCOM_HASHED.handler({ dataObj, cell, tape, tx });
		expect(dataObj.BITCOM_HASHED && typeof dataObj.BITCOM_HASHED[0]).toEqual(
			"object",
		);
		expect(dataObj.BITCOM_HASHED?.[0].paymail).toEqual("luke@relayx.io");

		// TODO: The next 2 expectations are incorrect!
		expect(dataObj.BITCOM_HASHED?.[0].pubkey).toEqual(
			"Ar2rUhi8D442diOa26+PlcroBf2Itrj35Uuc6ks82l0J",
		);
		expect(dataObj.BITCOM_HASHED?.[0].signature).toEqual(
			"H+he+WQ5VO2SsyZorUAA/i+WUyX0HuDVnARB+eu6NhNmYr5VJXQIm3p/+IsglyxzdRtJAhCU9/MwGokkfKKlE2g=",
		);
		// TODO: FIX ME when we know what fields these are and how to use them
		expect(dataObj.BITCOM_HASHED?.[0].verified).toEqual(false);
	});

	test("parse tx - out 2", async () => {
		const dataObj = {} as BmapTx;
		const tx = bitcomHashedTransaction as BobTx;
		const { cell } = bitcomHashedTransaction.out[1].tape[2] as Tape;
		const { tape } = bitcomHashedTransaction.out[1] as Out;

		await BITCOM_HASHED.handler({ dataObj, cell, tape, tx });
		expect(dataObj.BITCOM_HASHED && typeof dataObj.BITCOM_HASHED[0]).toEqual(
			"object",
		);
		expect(dataObj.BITCOM_HASHED?.[0].paymail).toEqual("luke@relayx.io");

		// TODO: The next 2 expectations are incorrect!
		expect(dataObj.BITCOM_HASHED?.[0].pubkey).toEqual(
			"Ar2rUhi8D442diOa26+PlcroBf2Itrj35Uuc6ks82l0J",
		);
		expect(dataObj.BITCOM_HASHED?.[0].signature).toEqual(
			"H/b853l7JYOp9H2K1zqsu/VHTlnqLPUnI/+wJ98k4ArEGlNrqR1yZuBBNdlxA/ZuEHoGSD5Q5GcKIhlweNvswBo=",
		);

		// TODO: FIX ME when we know what fields these are and how to use them
		expect(dataObj.BITCOM_HASHED?.[0].verified).toEqual(false);
	});
});
