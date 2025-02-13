import { type In, type Out, type Tape, parse } from "bpu-ts";
import { _21E8 } from "./protocols/_21e8";
import { AIP } from "./protocols/aip";
import { B } from "./protocols/b";
import { BAP } from "./protocols/bap";
import { BITCOM } from "./protocols/bitcom";
import { BITKEY } from "./protocols/bitkey";
import { BITPIC } from "./protocols/bitpic";
import { HAIP } from "./protocols/haip";
import { MAP } from "./protocols/map";
import { METANET } from "./protocols/metanet";
import { ORD } from "./protocols/ord";
import { RON } from "./protocols/ron";
import { SYMRE } from "./protocols/symre";
import type {
  BmapTx,
  BobTx,
  Handler,
  HandlerProps,
  MetaNet,
  MomTx,
  Protocol,
  SchemaField,
  ScriptChecker,
} from "./types/common";
import {
  checkOpFalseOpReturn,
  checkOpReturn,
  isObjectArray,
  isStringArray,
  saveProtocolData,
} from "./utils";

// Names of enabled protocols
const enabledProtocols = new Map<string, string>([]);
// Protocol Handlers
const protocolHandlers = new Map<string, Handler>([]);
// Script checkers are intentionally minimalistic detection functions for identifying matching scripts for a given protocol. Only if a checker returns true is a handler called for processing.
const protocolScriptCheckers = new Map<string, ScriptChecker>([]);
const protocolOpReturnSchemas = new Map<string, SchemaField[]>();

export const allProtocols: Protocol[] = [
  AIP,
  B,
  BAP,
  MAP,
  METANET,
  _21E8,
  BITCOM,
  BITKEY,
  BITPIC,
  HAIP,
  RON,
  SYMRE,
  ORD,
];

export const supportedProtocols = allProtocols.map((p) => p.name);
export const defaultProtocols = [AIP, B, BAP, MAP, METANET, ORD];

// prepare protocol map, handlers and schemas
for (const protocol of defaultProtocols) {
  if (protocol.address) {
    enabledProtocols.set(protocol.address, protocol.name);
  }
  protocolHandlers.set(protocol.name, protocol.handler);
  if (protocol.opReturnSchema) {
    protocolOpReturnSchemas.set(protocol.name, protocol.opReturnSchema);
  }
  if (protocol.scriptChecker) {
    protocolScriptCheckers.set(protocol.name, protocol.scriptChecker);
  }
}

// Takes a BOB formatted op_return transaction
export class BMAP {
  enabledProtocols: Map<string, string>;
  protocolHandlers: Map<string, Handler>;
  protocolScriptCheckers: Map<string, ScriptChecker>;
  protocolOpReturnSchemas: Map<string, SchemaField[]>;

  constructor() {
    // initial default protocol handlers in this instantiation
    this.enabledProtocols = enabledProtocols;
    this.protocolHandlers = protocolHandlers;
    this.protocolScriptCheckers = protocolScriptCheckers;
    this.protocolOpReturnSchemas = protocolOpReturnSchemas;
  }

  addProtocolHandler({ name, address, opReturnSchema, handler, scriptChecker }: Protocol) {
    if (address) {
      this.enabledProtocols.set(address, name);
    }
    this.protocolHandlers.set(name, handler);
    if (opReturnSchema) {
      this.protocolOpReturnSchemas.set(name, opReturnSchema);
    }
    if (scriptChecker) {
      this.protocolScriptCheckers.set(name, scriptChecker);
    }
  }

  transformTx = async (tx: BobTx | MomTx): Promise<BmapTx> => {
    if (!tx || !tx.in || !tx.out) {
      throw new Error("Cannot process tx");
    }

    // This will become our nicely formatted response object
    let dataObj: Partial<BobTx> = {
      // Initialize blk with default values
      blk: {
        i: tx.blk?.i ?? 0,
        t: tx.blk?.t ?? 0,
        h: tx.blk?.h ?? ""
      }
    };

    for (const [key, val] of Object.entries(tx)) {
      if (key === "out") {
        // loop over the outputs
        for (const out of tx.out) {
          const { tape } = out;

          // Process opReturn data
          if (tape?.some((cc) => checkOpReturn(cc))) {
            dataObj = await this.processDataProtocols(tape, out, tx, dataObj);
          }

          // No OP_FALSE OP_RETURN in this tape
          const _21e8Checker = this.protocolScriptCheckers.get(_21E8.name);
          const ordChecker = this.protocolScriptCheckers.get(ORD.name);

          // Check for 21e8 and ords
          if (
            tape?.some((cc) => {
              const { cell } = cc;
              if (_21e8Checker?.(cell)) {
                // 'found 21e8'
                return true;
              }
              if (ordChecker?.(cell)) {
                // 'found 1sat ordinal'
                return true;
              }
            })
          ) {
            // find the cell array
            // loop over tape
            for (const cellContainer of tape) {
              const { cell } = cellContainer;
              // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
              if (!cell) {
                throw new Error("empty cell while parsing");
              }
              let protocolName = "";
              if (_21e8Checker?.(cell)) {
                protocolName = _21E8.name;
              } else if (ordChecker?.(cell)) {
                protocolName = ORD.name;
              } else {
                // nothing found
                continue;
              }

              this.process(protocolName, {
                tx,
                cell,
                dataObj: dataObj as BmapTx,
                tape,
                out,
              });
            }
          }
        }
      } else if (key === "in") {
        dataObj[key] = val.map((v: In) => {
          const r = { ...v } as any;
          r.tape = undefined;
          return r as In;
        });
      } else {
        // known key, just write it retaining original type
        dataObj[key] = val;
      }
    }

    // If this is a MOM planaria it will have metanet keys available
    if (dataObj.METANET && (tx as MomTx).parent) {
      const meta = {
        ancestor: (tx as MomTx).ancestor,
        parent: (tx as MomTx).parent,
        child: (tx as MomTx).child,
        head: (tx as MomTx).head,
      } as MetaNet;
      (dataObj.METANET as MetaNet[]).push(meta);
      // remove parent and node from root level for (MOM data)
      dataObj.ancestor = undefined;
      dataObj.child = undefined;
      dataObj.parent = undefined;
      dataObj.head = undefined;
      dataObj.node = undefined;
    }

    return dataObj as BmapTx;
  };

  processUnknown = (key: string, dataObj: Partial<BmapTx>, out: Out) => {
    // no known non-OP_RETURN scripts
    if (key && !dataObj[`_${key}`]) {
      dataObj[`_${key}`] = [];
    }
    (dataObj[`_${key}`] as Out[]).push({
      i: out.i,
      e: out.e,
      tape: [],
    });
  };

  process = async (protocolName: string, { cell, dataObj, tape, out, tx }: HandlerProps) => {
    if (
      this.protocolHandlers.has(protocolName) &&
      typeof this.protocolHandlers.get(protocolName) === "function"
    ) {
      const handler = this.protocolHandlers.get(protocolName);
      if (handler) {
        await handler({
          dataObj,
          cell,
          tape,
          out,
          tx,
        });
      }
    } else {
      saveProtocolData(dataObj, protocolName, cell);
    }
  };

  processDataProtocols = async (
    tape: Tape[],
    out: Out,
    tx: BobTx,
    dataObj: Partial<BobTx>
  ): Promise<Partial<BobTx>> => {
    // loop over tape
    for (const cellContainer of tape) {
      const { cell } = cellContainer;
      if (!cell) {
        throw new Error("empty cell while parsing");
      }

      // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
      if (checkOpFalseOpReturn(cellContainer)) {
        continue;
      }

      const prefix = cell[0].s;

      if (prefix) {
        const protocolName = this.enabledProtocols.get(prefix);
        if (protocolName) {
          await this.process(protocolName, {
            cell,
            dataObj: dataObj as BmapTx,
            tape,
            out,
            tx,
          });
        } else {
          this.processUnknown(prefix, dataObj, out);
        }
      }
    }
    return dataObj;
  };
}

export const fetchRawTx = async (txid: string): Promise<string> => {
  const url = `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`;
  console.log("hitting", url);
  const res = await fetch(url);
  return await res.text();
};

export const bobFromRawTx = async (rawTx: string): Promise<BobTx> => {
  const bpuTx = await parse({
    tx: { r: rawTx },
    split: [
      {
        token: { op: 106 },
        include: "l",
      },
      {
        token: { s: "|" },
      },
    ],
  });
  return bpuTx as BobTx;
};

// TransformTx
// tx - a raw hex string or a Bob/Bmap/Mom transaction object
// protocols - the handlers you want to load and use to process the tx
// reducing the number of supported protocols may improve transform speed
// at the expense of detecting more data protocols
export const TransformTx = async (
  tx: BobTx | string | MomTx | BmapTx,
  protocols?: string[] | Protocol[]
) => {
  if (typeof tx === "string") {
    let rawTx: string | undefined;
    // if it a txid or  complete transaction hex?
    if (tx.length === 64) {
      // txid - fetch raw tx
      rawTx = await fetchRawTx(tx);
    }

    if (Buffer.from(tx).byteLength <= 146) {
      throw new Error("Invalid rawTx");
    }

    if (!rawTx) {
      rawTx = tx;
    }

    // TODO: Double check 146 is intended to be minimum possible byte length for a tx
    const bobTx = await bobFromRawTx(rawTx);

    if (bobTx) {
      tx = bobTx;
    } else {
      throw new Error("Invalid txid");
    }
  }

  const b = new BMAP();

  // if protocols are specified
  if (protocols) {
    // wipe out defaults
    b.enabledProtocols.clear();
    if (isStringArray(protocols)) {
      // set enabled protocols
      for (const protocol of allProtocols) {
        if ((protocols as string[])?.includes(protocol.name)) {
          b.addProtocolHandler(protocol);
        }
      }
    } else if (isObjectArray(protocols)) {
      for (const p of protocols) {
        const protocol = p as Protocol;
        if (protocol) {
          b.addProtocolHandler(protocol);
        }
      }
    } else {
      throw new Error(
        "Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[])."
      );
    }
  }

  return b.transformTx(tx);
};

// Export types
export type {
  BmapTx,
  BobTx,
  Handler,
  HandlerProps,
  MomTx,
  Protocol,
  ScriptChecker,
} from "./types/common";

// Export all protocol types
export type { _21E8 } from "./types/protocols/_21e8";
export type { AIP } from "./types/protocols/aip";
export type { B } from "./types/protocols/b";
export type { BAP } from "./types/protocols/bap";
export type { BITCOM } from "./types/protocols/bitcom";
export type { BITKEY } from "./types/protocols/bitkey";
export type { BITPIC } from "./types/protocols/bitpic";
export type { HAIP } from "./types/protocols/haip";
export type { MAP } from "./types/protocols/map";
export type { ORD } from "./types/protocols/ord";
export type { RON } from "./types/protocols/ron";
export type { SYMRE } from "./types/protocols/symre";
