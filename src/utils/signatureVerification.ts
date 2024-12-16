import { BSM, PublicKey, Script, Signature, Utils } from "@bsv/sdk";
import type { Cell, Tape } from "bpu-ts";
import { Buffer } from "buffer";
import type { BmapTx } from "../../types/common";
import { cellValue, checkOpReturn, saveProtocolData } from "../utils";

const { magicHash } = BSM;
const { toArray } = Utils;

const validateSignature = (signedObj: any, cell: Cell[], tape: Tape[]) => {
  if (!Array.isArray(tape) || tape.length < 3) {
    throw new Error("PSP requires at least 3 cells including the prefix");
  }

  const cellIndex = tape.findIndex(cc => cc.cell === cell);
  if (cellIndex === -1) {
    throw new Error("PSP could not find cell in tape");
  }

  const signatureBufferStatements: Buffer[] = [];
  for (let i = 0; i < cellIndex; i++) {
    const cellContainer = tape[i];
    if (!checkOpReturn(cellContainer)) {
      for (const statement of cellContainer.cell) {
        let value = statement.h;
        if (!value && statement.b) {
          value = Buffer.from(statement.b, "base64").toString("hex");
        }
        if (!value && statement.s) {
          value = Buffer.from(statement.s).toString("hex");
        }
        signatureBufferStatements.push(Buffer.from(value || "", "hex"));
      }
      // Append the '|' as hex 7c
      signatureBufferStatements.push(Buffer.from("7c", "hex"));
    }
  }

  // Replicate old behavior: build a script from data and get its hex representation
  const dataArrays = signatureBufferStatements.map(b => toArray(b));
  const script = Script.fromASM(`OP_FALSE  OP_RETURN ${dataArrays.join("")}`);

  const sig = Signature.fromCompact(signedObj.signature, 'base64');
  const pubkey = PublicKey.fromString(signedObj.pubkey);
  const msgHash = magicHash(script.toBinary());

  try {
    signedObj.verified = BSM.verify(msgHash, sig, pubkey);
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
  const obj: { [key: string]: any } = { verified: false };

  if (cell.length < 4) {
    throw new Error("PSP requires at least 4 fields including the prefix");
  }

  for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
    const x = Number.parseInt(idx, 10);
    const pspField = Object.keys(schemaField)[0];
    const schemaEncoding = Object.values(schemaField)[0] as string;
    obj[pspField] = cellValue(cell[x + 1], schemaEncoding);
  }

  if (!obj.signature) {
    throw new Error(`PSP requires a signature`);
  }

  validateSignature(obj, cell, tape);
  saveProtocolData(dataObj, protocolName, obj);
};