import { BSM, BigNumber, Hash, Script, Signature, Utils } from "@bsv/sdk";
import type { Cell, Tape } from "bpu-ts";
import type { BmapTx, BobTx, HandlerProps, Protocol, SchemaField } from "../types/common";
import type { AIP as AIPType } from "../types/protocols/aip";
import type { HAIP as HAIPType } from "../types/protocols/haip";
import { cellValue, checkOpFalseOpReturn, isBase64, saveProtocolData } from "../utils";

const { toArray, toHex, fromBase58Check, toBase58Check } = Utils;

const address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";

const opReturnSchema: SchemaField[] = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }],
];

function validateSignature(
  aipObj: Partial<AIPType | HAIPType>,
  cell: Cell[],
  tape: Tape[]
): boolean {
  if (!Array.isArray(tape) || tape.length < 3) {
    throw new Error("AIP requires at least 3 cells including the prefix");
  }

  let cellIndex = -1;
  for (let i = 0; i < tape.length; i++) {
    if (tape[i].cell === cell) {
      cellIndex = i;
      break;
    }
  }
  if (cellIndex === -1) {
    throw new Error("AIP could not find cell in tape");
  }

  let usingIndexes: number[] = aipObj.index || [];
  const signatureValues = ["6a"]; // OP_RETURN - is included in AIP
  for (let i = 0; i < cellIndex; i++) {
    const cellContainer = tape[i];
    if (!checkOpFalseOpReturn(cellContainer)) {
      for (const statement of cellContainer.cell) {
        // add the value as hex
        if (statement.h) {
          signatureValues.push(statement.h);
        } else if (statement.b) {
          // no hex? try base64
          signatureValues.push(toHex(toArray(statement.b, "base64")));
        } else if (statement.s) {
          signatureValues.push(toHex(toArray(statement.s)));
        }
      }
      signatureValues.push("7c"); // | hex
    }
  }

  if (aipObj.hashing_algorithm) {
    // when using HAIP, we need to parse the indexes in a non standard way
    // indexLength is byte size of the indexes being described
    if (aipObj.index_unit_size) {
      const indexLength = aipObj.index_unit_size * 2;
      usingIndexes = [];
      const indexes = cell[6].h as string;
      for (let i = 0; i < indexes.length; i += indexLength) {
        usingIndexes.push(Number.parseInt(indexes.substr(i, indexLength), 16));
      }
      aipObj.index = usingIndexes;
    }
  }

  const signatureBufferStatements: number[][] = [];
  // check whether we need to only sign some indexes
  if (usingIndexes.length > 0) {
    for (const index of usingIndexes) {
      if (index >= signatureValues.length) {
        console.log("[validateSignature] Index out of bounds:", index);
        return false;
      }
      signatureBufferStatements.push(toArray(signatureValues[index], "hex"));
    }
  } else {
    // add all the values to the signature buffer
    for (const statement of signatureValues) {
      signatureBufferStatements.push(toArray(statement, "hex"));
    }
  }

  let messageBuffer: number[];
  if (aipObj.hashing_algorithm) {
    // this is actually Hashed-AIP (HAIP) and works a bit differently
    if (!aipObj.index_unit_size) {
      // remove OP_RETURN - will be added by Script.buildDataOut
      signatureBufferStatements.shift();
    }
    const dataScript = Script.fromHex(toHex(signatureBufferStatements.flat()));
    let dataArray = toArray(dataScript.toHex(), "hex");
    if (aipObj.index_unit_size) {
      // the indexed buffer should not contain the OP_RETURN opcode, but this
      // is added by the buildDataOut function automatically. Remove it.
      dataArray = dataArray.slice(1);
    }
    messageBuffer = Hash.sha256(dataArray);
  } else {
    // regular AIP
    messageBuffer = signatureBufferStatements.flat();
  }

  // AIOP uses address, HAIP uses signing_address field names
  const addressString = (aipObj as AIPType).address || (aipObj as HAIPType).signing_address;
  if (!addressString || !aipObj.signature) {
    return false;
  }

  let signature: Signature;
  try {
    signature = Signature.fromCompact(aipObj.signature, "base64");
  } catch (e) {
    console.log("[validateSignature] Failed to parse signature:", e);
    return false;
  }

  const tryNormalLogic = (): boolean => {
    try {
      const msgHash = BSM.magicHash(messageBuffer);
      const bigMsg = toBigNumberFromBuffer(msgHash);

      for (let recovery = 0; recovery < 4; recovery++) {
        try {
          const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
          const pubKeyHash = publicKey.toHash() as number[];
          const { prefix } = fromBase58Check(addressString);
          const recoveredAddress = toBase58Check(pubKeyHash, prefix as number[]);
          if (recoveredAddress === addressString) {
            return BSM.verify(messageBuffer, signature, publicKey);
          }
        } catch (e) {
          console.log("[tryNormalLogic] Recovery error:", e);
        }
      }
    } catch (e) {
      console.log("[tryNormalLogic] error:", e);
    }
    return false;
  };

  const tryTwetchLogic = (): boolean => {
    // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
    // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")
    if (signatureBufferStatements.length <= 2) {
      return false;
    }

    try {
      const trimmed = signatureBufferStatements.slice(1, -1);
      const buff = Hash.sha256(trimmed.flat());
      const hexStr = toHex(buff);
      const twetchMsg = toArray(hexStr, "utf8");

      const msgHash = BSM.magicHash(twetchMsg);
      const bigMsg = toBigNumberFromBuffer(msgHash);

      for (let recovery = 0; recovery < 4; recovery++) {
        try {
          const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
          const pubKeyHash = publicKey.toHash() as number[];
          const { prefix } = fromBase58Check(addressString);
          const recoveredAddress = toBase58Check(pubKeyHash, prefix as number[]);
          if (recoveredAddress === addressString) {
            return BSM.verify(twetchMsg, signature, publicKey);
          }
        } catch (e) {
          console.log("[tryTwetchLogic] Recovery error:", e);
        }
      }
    } catch (e) {
      console.log("[tryTwetchLogic] error:", e);
    }
    return false;
  };

  let verified = tryNormalLogic();
  if (!verified) {
    verified = tryTwetchLogic();
  }

  aipObj.verified = verified;
  return verified;
}

function toBigNumberFromBuffer(buffer: number[]): BigNumber {
  const hex = toHex(buffer);
  return new BigNumber(hex, 16);
}

export enum SIGPROTO {
  HAIP = "HAIP",
  AIP = "AIP",
}

export const AIPhandler = async (
  useOpReturnSchema: SchemaField[],
  protocol: SIGPROTO,
  dataObj: Partial<BobTx>,
  cell: Cell[],
  tape: Tape[]
): Promise<HandlerProps> => {
  // loop over the schema
  const aipObj: { [key: string]: number | number[] | string | boolean } = {};

  // Does not have the required number of fields
  if (cell.length < 4) {
    throw new Error("AIP requires at least 4 fields including the prefix");
  }

  for (const [idx, schemaField] of Object.entries(useOpReturnSchema)) {
    const x = Number.parseInt(idx, 10);

    if (Array.isArray(schemaField)) {
      // signature indexes are specified
      const [aipField] = Object.keys(schemaField[0]) as (keyof AIPType)[];
      // run through the rest of the fields in this cell, should be de indexes
      const fieldData: number[] = [];
      for (let i = x + 1; i < cell.length; i++) {
        if (cell[i].h && Array.isArray(fieldData)) {
          fieldData.push(Number.parseInt(cell[i].h || "", 16));
        }
      }
      aipObj[aipField] = fieldData;
    } else {
      const [aipField] = Object.keys(schemaField) as (keyof AIPType)[];
      const [schemaEncoding] = Object.values(schemaField);
      aipObj[aipField] = cellValue(cell[x + 1], schemaEncoding as string) || "";
    }
  }

  // There is an issue where some services add the signature as binary to the transaction
  // whereas others add the signature as base64. This will confuse bob and the parser and
  // the signature will not be verified. When the signature is added in binary cell[3].s is
  // binary, otherwise cell[3].s contains the base64 signature and should be used.
  if (cell[0].s === address && cell[3].s && isBase64(cell[3].s)) {
    aipObj.signature = cell[3].s;
  }

  if (!aipObj.signature) {
    throw new Error("AIP requires a signature");
  }

  validateSignature(aipObj as Partial<AIPType>, cell, tape);

  saveProtocolData(dataObj, protocol, aipObj);
  return { dataObj: dataObj as BmapTx, cell, tape };
};

const handler = async ({ dataObj, cell, tape }: HandlerProps): Promise<HandlerProps> => {
  if (!tape) {
    throw new Error("Invalid AIP transaction. tape is required");
  }
  return AIPhandler(opReturnSchema, SIGPROTO.AIP, dataObj, cell, tape);
};

export const AIP: Protocol = {
  name: "AIP",
  address,
  opReturnSchema,
  handler,
};
