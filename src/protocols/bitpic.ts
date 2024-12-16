import { Address, Bsm, PubKey } from "@ts-bitcoin/core";
import { Buffer } from "buffer";
import type { HandlerProps, Protocol } from "../../types/common";
import type { BITPIC as BITPICType } from "../../types/protocols/bitpic";
import { saveProtocolData, sha256 } from "../utils";

const protocolAddress = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p";

const opReturnSchema = [
	{ paymail: "string" },
	{ pubkey: "binary" },
	{ signature: "string" },
];

const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
	// Validation
	if (
		cell[0].s !== protocolAddress ||
		!cell[1] ||
		!cell[2] ||
		!cell[3] ||
		!cell[1].s ||
		!cell[2].b ||
		!cell[3].s ||
		!tape
	) {
		throw new Error(`Invalid BITPIC record: ${tx}`);
	}

	const bitpicObj: BITPICType = {
		paymail: cell[1].s,
		pubkey: Buffer.from(cell[2].b, "base64").toString("hex"),
		signature: cell[3].s || "",
		verified: false,
	};

	const b = tape[1].cell;
	if (b[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut") {
		// verify bitpic signature

		// TODO: Verification
		// const pubkey = Buffer.from(cell[2].b, 'base64').toString('hex')
		// const address = Address.fromPubKey(PubKey.fromString(pubkey)).toString()
		// const hex = Buffer.from(hash, 'hex')
		// const verified = Message.verify(hex, address, expected)
		// return verified

		// const expected = res.cell[3].s
		// const paymail = res.cell[1].s
		// const pubkey = Buffer.from(res.cell[2].b, "base64").toString("hex")
		// const address = new bsv.PublicKey(pubkey).toAddress().toString()
		// const hex = Buffer.from(res.hash, "hex")
		// const verified = Message.verify(hex, address, expected)
		// return verified

		try {
			// TODO: bob transactions are missing this binary part, cannot verify signature
			const bin = (cell[1].lb || cell[1].b) as string;
			const buf = Buffer.from(bin, "base64");
			const hashBuff = await sha256(buf);
			const address = Address.fromPubKey(
				PubKey.fromString(bitpicObj.pubkey as string),
			);

			bitpicObj.verified = Bsm.verify(hashBuff, bitpicObj.signature, address);
		} catch (e) {
			// failed verification
			bitpicObj.verified = false;
		}
	}

	saveProtocolData(dataObj, "BITPIC", bitpicObj);
};

export const BITPIC: Protocol = {
	name: "BITPIC",
	address: protocolAddress,
	opReturnSchema,
	handler,
};
