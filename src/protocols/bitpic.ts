import { BSM, Hash, PublicKey, Signature, Utils } from "@bsv/sdk";
import type { HandlerProps, Protocol } from "../types/common";
import type { BITPIC as BITPICType } from "../types/protocols/bitpic";
import { saveProtocolData } from "../utils";
const { magicHash } = BSM;
const { toArray } = Utils;


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

    try {
      // TODO: bob transactions are missing this binary part, cannot verify signature
      const bin = (cell[1].lb || cell[1].b) as string;
      const hashBuff = Hash.sha256(toArray(bin, "base64"));
      const sig = Signature.fromCompact(bitpicObj.signature as string, "base64");
      const pubkey = PublicKey.fromString(bitpicObj.pubkey as string);
      const msgHash = magicHash(hashBuff);
      bitpicObj.verified = BSM.verify(msgHash, sig, pubkey);
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
