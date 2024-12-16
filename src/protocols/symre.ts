import type { HandlerProps } from "../../types/common";
import { saveProtocolData } from "../utils";

const address = "1SymRe7erxM46GByucUWnB9fEEMgo7spd";

const opReturnSchema = [{ url: "string" }];

const handler = ({ dataObj, cell, tx }: HandlerProps) => {
	if (cell[0].s !== address || !cell[1] || !cell[1].s) {
		throw new Error(`Invalid SymRe tx: ${tx}`);
	}

	saveProtocolData(dataObj, "SYMRE", { url: cell[1].s });
};

export const SYMRE = {
	name: "SYMRE",
	address,
	opReturnSchema,
	handler,
};
