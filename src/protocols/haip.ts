import type { HandlerProps, Protocol } from "../../types/common";
import { AIPhandler, SIGPROTO } from "./aip";

const address = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3";

const opReturnSchema = [
  { hashing_algorithm: "string" },
  { signing_algorithm: "string" },
  { signing_address: "string" },
  { signature: "string" },
  { index_unit_size: "number" },
  [{ index: "binary" }],
];

// https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md
const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
  if (!tape) {
    throw new Error("Invalid HAIP tx. Bad tape");
  }
  if (!tx) {
    throw new Error("Invalid HAIP tx.");
  }
  return await AIPhandler(
    opReturnSchema,
    SIGPROTO.HAIP,
    dataObj,
    cell,
    tape,
    // tx,
  );
};

export const HAIP: Protocol = {
  name: "HAIP",
  address,
  opReturnSchema,
  handler,
};
