import type { Cell } from "bpu-ts";
import type { HandlerProps, Protocol } from "../../types/common";
import type { _21E8 as _21E8Type } from "../../types/protocols/_21e8";
import { cellValue, saveProtocolData } from "../utils";

// 21e8 does not use the first pushdata for id
// in fact there is no id since the 21e8 is designed for difficulty and can be changed
// instead we use the static part of the script to indentfy the transaction
// TODO - the OP_X_PLACEHOLDER is the number of bytes to push onto the stack and must match difficulty size
const _21e8Script =
	"OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
		" ",
	);

const scriptChecker = (cell: Cell[]) => {
	if (cell.length !== 12) {
		// wrong length
		return false;
	}

	// match exact script
	const ops = [...cell].map((c) => c.ops).splice(2, cell.length);

	// calculate target byte length
	const target = cellValue(cell[1], "hex") as string;
	const targetOpSize = Buffer.from(target).byteLength;

	// replace the placeholder opcode with actual
	ops[1] = `OP_${targetOpSize}`;
	_21e8Script[1] = `OP_${targetOpSize}`;

	// protocol identifier always in first pushdata
	return ops.join() === _21e8Script.join();
};

const handler = ({ dataObj, cell, out }: HandlerProps): void => {
	if (!cell[0] || !out) {
		throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
	}

	// assemble asm
	// make sure first piece matches a txid
	// 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
	// next

	const txid = cellValue(cell[0], "hex") as string;
	const target = cellValue(cell[1], "hex") as string;
	if (!target) {
		throw new Error(`Invalid 21e8 target. ${JSON.stringify(cell[0], null, 2)}`);
	}
	const difficulty = Buffer.from(target, "hex").byteLength;

	const _21e8Obj: _21E8Type = {
		target,
		difficulty,
		value: out.e.v,
		txid,
	};

	saveProtocolData(dataObj, "21E8", _21e8Obj);
};

export const _21E8: Protocol = {
	name: "21E8",
	handler,
	scriptChecker,
};
