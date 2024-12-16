import { BSM, BigNumber, Hash, type PublicKey, Script, Signature, Utils } from "@bsv/sdk";
import type { Cell, Tape } from "bpu-ts";
import { Buffer } from "buffer";
import fetch from "node-fetch";
import type { HandlerProps, Protocol } from "../../types/common";
import type { AIP as AIPType } from "../../types/protocols/aip";
import type { HAIP as HAIPType } from "../../types/protocols/haip";
import { cellValue, checkOpFalseOpReturn, isBase64, saveProtocolData } from "../utils";

const { toArray, toHex, fromBase58Check, toBase58Check } = Utils;

const address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
const opReturnSchema = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }],
];

const getFileBuffer = async (bitfsRef: string) => {
  try {
    const result = await fetch(`https://x.bitfs.network/${bitfsRef}`);
    return await result.buffer();
  } catch {
    return Buffer.from("");
  }
};

function toBigNumberFromBuffer(buffer: number[]): BigNumber {
  const hex = toHex(buffer);
  return new BigNumber(hex, 16);
}

function recoverPublicKeyFromBSM(message: number[], signature: Signature, expectedAddress: string): PublicKey {
  const msgHash = BSM.magicHash(message);
  const bigMsg = toBigNumberFromBuffer(msgHash);

  for (let recovery = 0; recovery < 4; recovery++) {
    try {
      const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
      const pubKeyHash = publicKey.toHash() as number[];
      const { prefix } = fromBase58Check(expectedAddress);
      const recoveredAddress = toBase58Check(pubKeyHash, prefix as number[]);
      if (recoveredAddress === expectedAddress) {
        console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key");
        return publicKey;
      } else {
        console.log("[recoverPublicKeyFromBSM] Trying recovery=", recovery, "Recovered address=", recoveredAddress, "expected=", expectedAddress);
      }
    } catch (e) {
      console.log("[recoverPublicKeyFromBSM] Recovery error:", e);
    }
  }

  console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address");
  throw new Error("Failed to recover public key matching the expected address");
}

function fromSafeDataArray(dataBufs: Buffer[]): Script {
  const script = new Script();
  script.chunks.push({ op: 0 }); // OP_FALSE
  script.chunks.push({ op: 106 }); // OP_RETURN
  for (const buf of dataBufs) {
    const length = buf.length;
    if (length <= 75) {
      script.chunks.push({ op: length, data: Array.from(buf) });
    } else if (length <= 0xff) {
      script.chunks.push({ op: 0x4c, data: Array.from(buf) });
    } else if (length <= 0xffff) {
      script.chunks.push({ op: 0x4d, data: Array.from(buf) });
    } else {
      script.chunks.push({ op: 0x4e, data: Array.from(buf) });
    }
  }
  return script;
}

async function validateSignature(
  aipObj: Partial<AIPType | HAIPType>,
  cell: Cell[],
  tape: Tape[]
): Promise<boolean> {
  if (!Array.isArray(tape) || tape.length < 3) {
    throw new Error("AIP requires at least 3 cells including the prefix");
  }

  let cellIndex = -1;
  tape.forEach((cc, index) => {
    if (cc.cell === cell) {
      cellIndex = index;
    }
  });
  if (cellIndex === -1) {
    throw new Error("AIP could not find cell in tape");
  }

  let usingIndexes: number[] = (aipObj.index as number[]) || [];
  const signatureValues: string[] = ["6a"]; // index 0: OP_RETURN

  // Gather data from all previous cells
  for (let i = 0; i < cellIndex; i++) {
    const cellContainer = tape[i];
    if (!checkOpFalseOpReturn(cellContainer)) {
      const cellData: string[] = [];
      for (const statement of cellContainer.cell) {
        let value: string | undefined;
        if (statement.h) {
          value = statement.h;
        } else if (statement.f) {
          const fileBuffer = await getFileBuffer(statement.f);
          value = fileBuffer.length > 0 ? fileBuffer.toString("hex") : undefined;
        } else if (statement.b) {
          const buf = Buffer.from(statement.b, "base64");
          if (buf.length > 0) {
            value = buf.toString("hex");
          }
        } else if (statement.s) {
          if (statement.s.length > 0) {
            value = Buffer.from(statement.s).toString("hex");
          }
        }

        if (value && value.length > 0) {
          cellData.push(value);
        }
      }
      if (cellData.length > 0) {
        // add all cellData
        signatureValues.push(...cellData);
        // add pipe after this cell
        signatureValues.push("7c");
      }
    }
  }

  // Now HAIP indexing logic
  if (aipObj.hashing_algorithm && aipObj.index_unit_size) {
    const indexLength = aipObj.index_unit_size * 2;
    usingIndexes = [];
    const indexesHex = cell[6]?.h || "";
    for (let i = 0; i < indexesHex.length; i += indexLength) {
      usingIndexes.push(Number.parseInt(indexesHex.substr(i, indexLength), 16));
    }
    aipObj.index = usingIndexes;
  }

  console.log("usingIndexes", usingIndexes);
  console.log("signatureValues", signatureValues);

  const signatureBufferStatements: Buffer[] = [];
  if (usingIndexes.length > 0) {
    for (const idx of usingIndexes) {
      if (typeof signatureValues[idx] !== 'string') {
        console.log("signatureValues[idx]", signatureValues[idx], "idx", idx);
      }
      if (!signatureValues[idx]) {
        console.log("signatureValues is missing an index", idx, "This means indexing is off");
        return false;
      }
      signatureBufferStatements.push(Buffer.from(signatureValues[idx], "hex"));
    }
  } else {
    for (const val of signatureValues) {
      signatureBufferStatements.push(Buffer.from(val, "hex"));
    }
  }

  console.log("signatureBufferStatements", signatureBufferStatements.map((b) => b.toString("hex")));

  let messageBuffer: Buffer;
  if (aipObj.hashing_algorithm) {
    // HAIP logic
    if (!aipObj.index_unit_size) {
      // remove OP_RETURN chunk
      signatureBufferStatements.shift();
    }
    const dataScript = fromSafeDataArray(signatureBufferStatements);
    let dataBuffer = Buffer.from(dataScript.toHex(), "hex");
    if (aipObj.index_unit_size) {
      dataBuffer = dataBuffer.slice(1);
    }
    const hashed = Hash.sha256(toArray(dataBuffer));
    messageBuffer = Buffer.from(hashed);
  } else {
    // regular AIP
    messageBuffer = Buffer.concat(signatureBufferStatements);
  }

  const addressString = (aipObj as AIPType).address || (aipObj as HAIPType).signing_address;
  const signatureStr = aipObj.signature as string;
  const signature = Signature.fromCompact(signatureStr, 'base64');

  const tryNormalLogic = (): boolean => {
    console.log("[validateSignature:tryNormalLogic] start");
    try {
      const msgArr = toArray(messageBuffer);
      const recoveredPubkey = recoverPublicKeyFromBSM(msgArr, signature, addressString);
      console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const res = BSM.verify(msgArr, signature, recoveredPubkey);
      console.log("[tryNormalLogic] BSM.verify result:", res);
      return res;
    } catch (err) {
      console.log("[tryNormalLogic] error:", err);
      return false;
    }
  };

  const tryTwetchLogic = (): boolean => {
    console.log("[validateSignature:tryTwetchLogic] start");
    // For twetch: remove first and last item and sha256 the remainder, interpret hex as utf8
    if (signatureBufferStatements.length <= 2) {
      return false;
    }
    const trimmed = signatureBufferStatements.slice(1, -1);
    console.log("[tryTwetchLogic] trimmedStatements count:", trimmed.length);
    const buff = Hash.sha256(toArray(Buffer.concat(trimmed)));
    const hexStr = toHex(buff);
    const twetchMsg = Buffer.from(hexStr, "utf8");
    try {
      const recoveredPubkey = recoverPublicKeyFromBSM(toArray(twetchMsg), signature, addressString);
      console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const res = BSM.verify(toArray(twetchMsg), signature, recoveredPubkey);
      console.log("[tryTwetchLogic] BSM.verify result:", res);
      return res;
    } catch (err) {
      console.log("[tryTwetchLogic] error:", err);
      return false;
    }
  };

  let verified = tryNormalLogic();
  if (!verified) {
    verified = tryTwetchLogic();
  }

  console.log("[validateSignature] final verified=", verified);
  (aipObj as AIPType).verified = verified;
  return verified;
}

export enum SIGPROTO {
  HAIP = "HAIP",
  AIP = "AIP",
}

export const AIPhandler = async (
  useOpReturnSchema: any[],
  protocol: SIGPROTO,
  dataObj: any,
  cell: Cell[],
  tape: Tape[],
  tx?: any
) => {
  const aipObj: { [key: string]: any } = { verified: false };

  // minimal fields check
  if (cell.length < 4) {
    throw new Error("AIP requires at least 4 fields including the prefix");
  }

  for (const [idx, schemaField] of Object.entries(useOpReturnSchema)) {
    const x = Number.parseInt(idx, 10);
    if (Array.isArray(schemaField)) {
      const [aipField] = Object.keys(schemaField[0]) as (keyof AIPType)[];
      const fieldData: number[] = [];
      for (let i = x + 1; i < cell.length; i++) {
        if (cell[i].h) {
          fieldData.push(Number.parseInt(cell[i].h!, 16));
        }
      }
      aipObj[aipField] = fieldData;
    } else {
      const [aipField] = Object.keys(schemaField) as (keyof AIPType)[];
      const [schemaEncoding] = Object.values(schemaField);
      aipObj[aipField] = cellValue(cell[x + 1], schemaEncoding as string) || "";
    }
  }

  if (cell[0].s === address && cell[3].s && isBase64(cell[3].s)) {
    aipObj.signature = cell[3].s;
  }

  console.log("[AIPhandler] AIP object before validate:", aipObj);

  if (!aipObj.signature) {
    throw new Error("AIP requires a signature");
  }

  await validateSignature(aipObj as Partial<AIPType>, cell, tape);
  console.log("[AIPhandler] After validate, verified:", aipObj.verified);

  saveProtocolData(dataObj, protocol, aipObj);
};

const handler = async ({ dataObj, cell, tape, tx }: HandlerProps) => {
  if (!tape) {
    throw new Error("Invalid AIP transaction");
  }
  return await AIPhandler(
    opReturnSchema,
    SIGPROTO.AIP,
    dataObj,
    cell,
    tape,
    tx
  );
};

export const AIP: Protocol = {
  name: "AIP",
  address,
  opReturnSchema,
  handler,
};