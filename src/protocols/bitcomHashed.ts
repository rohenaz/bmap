import type { HandlerProps, Protocol } from "../../types/common";
import { SIGPROTO } from "./aip";
import { signatureHandler } from "../utils/signatureVerification";

const address = "15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA";

// see https://bsvalias.org/05-verify-public-key-owner.html
const opReturnSchema = [
	{ hash: "string" }, // sha256
	{ signature: "string" },
	{ pubkey: "binary" },
	{ paymail: "string" },
];

const handler = async ({ dataObj, cell, tape }: HandlerProps) => {
	if (!tape) {
		throw new Error("Invalid BITCOM_HASHED tx. Bad tape");
	}

	if (!cell.length || cell[0].s !== address || !cell[1] || !cell[2] || !cell[3] || !cell[4]) {
		throw new Error("Invalid BITCOM_HASHED record");
	}

	return await signatureHandler(
		opReturnSchema,
		SIGPROTO.BITCOM_HASHED,
		dataObj,
		cell,
		tape,
	);
};

export const BITCOM_HASHED: Protocol = {
	name: "BITCOM_HASHED",
	address,
	opReturnSchema,
	handler,
};
