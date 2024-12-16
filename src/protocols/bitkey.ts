import { BSM, BigNumber, Hash, PublicKey, Signature, Utils } from "@bsv/sdk";
import { Buffer } from "buffer";
import type { HandlerProps, Protocol } from "../../types/common";
import { cellValue, saveProtocolData } from "../utils";

const { toArray, toBase58Check, toHex } = Utils;
const { magicHash } = BSM;

const address = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC";

const opReturnSchema = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" },
];

// Helper to convert array to BigNumber
function toBigNumber(buffer: number[]): BigNumber {
  const hex = toHex(buffer);
  return new BigNumber(hex, 16);
}

// Recovers a public key from a BSM signature by brute forcing recovery factors
// Steps:
// 1. Apply magicHash to the raw message.
// 2. Try all recovery factors 0–3 with Signature.RecoverPublicKey()
// 3. If BSM.verify() returns true with the recovered pubkey, return it.
function recoverPublicKeyFromBSM(message: number[], signature: Signature): PublicKey {
  // First, BSM signatures are verified by applying magicHash internally,
  // so we must apply magicHash to the raw message ourselves for recovery:
  const msgHash = magicHash(message);

  const bigMsg = toBigNumber(msgHash);
  for (let recovery = 0; recovery < 4; recovery++) {
    try {
      const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
      // Verify using BSM.verify() with the original raw message (no magicHash)
      if (BSM.verify(message, signature, publicKey)) {
        return publicKey;
      }
    } catch {
      // Try next recovery factor
    }
  }
  throw new Error("Failed to recover public key from BSM signature");
}

const handler = async ({ dataObj, cell }: HandlerProps) => {
  if (cell.length < 5) {
    throw new Error("Invalid Bitkey tx");
  }

  const bitkeyObj: { [key: string]: string | boolean } = {};
  for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
    const x = Number.parseInt(idx, 10);
    const bitkeyField = Object.keys(schemaField)[0];
    const schemaEncoding = Object.values(schemaField)[0];
    bitkeyObj[bitkeyField] = cellValue(cell[x + 1], schemaEncoding) as string;
  }

  // Derive userAddress from pubkey
  const pubkeyHex = bitkeyObj.pubkey as string;
  const userPubkey = PublicKey.fromString(pubkeyHex);
  const userPubKeyHash = userPubkey.toHash() as number[];
  const userAddress = toBase58Check(userPubKeyHash);

  // Prepare raw message for bitkey signature verification: sha256(paymail_hex + pubkey_hex)
  const paymailHex = Buffer.from(bitkeyObj.paymail as string).toString("hex");
  const concatenated = paymailHex + pubkeyHex;
  const concatenatedBuffer = Buffer.from(concatenated, "hex");
  const bitkeyMessage = Hash.sha256(toArray(concatenatedBuffer));
  // This is the raw message. BSM.verify() will do magicHash internally.

  const bitkeySignature = Signature.fromCompact(bitkeyObj.bitkey_signature as string, 'base64');

  // Recover Bitkey pubkey
  const recoveredBitkeyPubkey = recoverPublicKeyFromBSM(bitkeyMessage, bitkeySignature);
  const recoveredBitkeyPubKeyHash = recoveredBitkeyPubkey.toHash() as number[];
  const recoveredBitkeyAddress = toBase58Check(recoveredBitkeyPubKeyHash);
  const bitkeySignatureVerified = BSM.verify(bitkeyMessage, bitkeySignature, recoveredBitkeyPubkey) && (recoveredBitkeyAddress === address);

  // Verify user signature by using the pubkey as the message
  const userMessage = toArray(Buffer.from(pubkeyHex, "utf8"));
  const userSignature = Signature.fromCompact(bitkeyObj.user_signature as string, 'base64');
  const recoveredUserPubkey = recoverPublicKeyFromBSM(userMessage, userSignature);
  const recoveredUserPubKeyHash = recoveredUserPubkey.toHash() as number[];
  const recoveredUserAddress = toBase58Check(recoveredUserPubKeyHash);
  const userSignatureVerified = BSM.verify(userMessage, userSignature, recoveredUserPubkey) && (recoveredUserAddress === userAddress);

  bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified;
  saveProtocolData(dataObj, "BITKEY", bitkeyObj);
};

export const BITKEY: Protocol = {
  name: "BITKEY",
  address,
  opReturnSchema,
  handler,
};