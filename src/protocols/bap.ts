import type { HandlerProps, Protocol, SchemaField } from "../types/common";
import { bmapOpReturnSchemaHandler } from "../utils";

const address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";

const opReturnSchema: SchemaField[] = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" },
];

export const handler = ({ dataObj, cell, tx }: HandlerProps) => {
  if (!tx) {
    throw new Error("Invalid BAP tx, tx required");
  }
  bmapOpReturnSchemaHandler("BAP", opReturnSchema, dataObj, cell, tx);
};

export const BAP: Protocol = {
  name: "BAP",
  address,
  opReturnSchema,
  handler,
};
