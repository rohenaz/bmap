import { Address, Bsm, PubKey, Script } from "@ts-bitcoin/core";
import { Cell, Tape } from "bpu-ts";
import { Buffer } from "buffer";
import type { BmapTx } from "../../types/common";
import { cellValue, checkOpReturn, saveProtocolData } from "../utils";

const validateSignature = (signedObj: any, cell: Cell[], tape: Tape[]) => {
	if (!Array.isArray(tape) || tape.length < 3) {
		throw new Error("Signature validation requires at least 3 cells including the prefix");
	}

	let cellIndex = -1;
	tape.forEach((cc, index) => {
		if (cc.cell === cell) {
			cellIndex = index;
		}
	});
	if (cellIndex === -1) {
		throw new Error("Could not find cell in tape");
	}

	const signatureBufferStatements = [];
	for (let i = 0; i < cellIndex; i++) {
		const cellContainer = tape[i];
		if (!checkOpReturn(cellContainer)) {
			for (const statement of cellContainer.cell) {
				// add the value as hex
				let value = statement.h;
				if (!value) {
					value = Buffer.from(statement.b as string, "base64").toString("hex");
				}
				if (!value) {
					value = Buffer.from(statement.s as string).toString("hex");
				}
				signatureBufferStatements.push(Buffer.from(value, "hex"));
			}
			signatureBufferStatements.push(Buffer.from("7c", "hex")); // pipe separator
		}
	}
	const dataScript = Script.fromSafeDataArray(signatureBufferStatements);
	const messageBuffer = Buffer.from(dataScript.toHex(), "hex");

	// verify signature
	const publicKey = PubKey.fromString(signedObj.pubkey);
	const signingAddress = Address.fromPubKey(publicKey);
	try {
		signedObj.verified = Bsm.verify(
			messageBuffer,
			signedObj.signature,
			signingAddress,
		);
	} catch (e) {
		signedObj.verified = false;
	}

	return signedObj.verified;
};

export const signatureHandler = async (
	opReturnSchema: any[],
	protocolName: string,
	dataObj: BmapTx,
	cell: Cell[],
	tape: Tape[],
) => {
	const obj: { [key: string]: any } = {
		verified: false,
	};

	// Does not have the required number of fields
	if (cell.length < opReturnSchema.length + 1) {
		throw new Error(
			`Requires at least ${opReturnSchema.length + 1} fields including the prefix`,
		);
	}

	// loop over schema
	for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
		const x = Number.parseInt(idx, 10);
		const key = Object.keys(schemaField)[0];
		const type = schemaField[key];

		// get the cell value
		const val = cellValue(cell[x + 1], type);
		if (val) {
			obj[key] = val;
		}
	}

	if (!obj.signature) {
		throw new Error(`Requires a signature`);
	}

	// verify signature if we have all required fields
	if (obj.signature && obj.pubkey && tape) {
		validateSignature(obj, cell, tape);
	}

	saveProtocolData(dataObj, protocolName, obj);
}; 