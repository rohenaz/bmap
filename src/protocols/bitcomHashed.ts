import type { HandlerProps, Protocol } from "../../types/common";
import { SIGPROTO } from "./aip";
import { PSPhandler } from "./psp";

const address = "15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA";

// should be very similar to PSP
// see https://bsvalias.org/05-verify-public-key-owner.html

// TODO: Really need some documentation ro to verify what these fields are
const opReturnSchema = [
	{ hash: "string" }, // sha256?
	{ signature: "string" }, // not sure
	{ pubkey: "binary" }, // not sure
	{ paymail: "string" },
];

const handler = async ({ dataObj, cell, tape }: HandlerProps) => {
	if (!tape) {
		throw new Error("Invalid BITCOM_HASHED tx. Bad tape");
	}

	return await PSPhandler(
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
