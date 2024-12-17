
import { decode } from "@msgpack/msgpack";
import type { Cell } from "bpu-ts";
import type { HandlerProps, Protocol } from "../types/common";
import type { MAP as MAPType } from "../types/protocols/map";
import { saveProtocolData } from "../utils";

const address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";

const opReturnSchema = [
  {
    cmd: {
      SET: [{ key: "string" }, { val: "string" }],
      SELECT: [{ tx: "string" }],
      ADD: [{ key: "string" }, [{ val: "string" }]],
      DELETE: [{ key: "string" }, [{ val: "string" }]],
      JSON: "string",
      REMOVE: [[{ key: "string" }]],
      CLEAR: [[{ txid: "string" }]],
    },
  },
];

const processADD = (cell: Cell[], mapObj: MAPType) => {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
      continue;
    }
    const pushdata = pushdataContainer.s as string;
    if (pushdataContainer.i === 2) {
      // Key name
      mapObj[pushdata] = [];
      last = pushdata;
    } else {
      if (last && Array.isArray(mapObj[last])) {
        (mapObj[last] as string[]).push(pushdata);
      }
    }
  }
};

const proccessDELETE = (cell: Cell[], mapObj: MAPType) => {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
      continue;
    }
    const pushdata = pushdataContainer.s as string;
    if (pushdataContainer.i === 2) {
      // Key name
      mapObj[pushdata] = [];
      last = pushdata;
    } else {
      if (last) {
        (mapObj[last] as string[]).push(pushdata);
      }
    }
  }
};

const processSELECT = (cell: Cell[], mapObj: MAPType) => {
  // TODO
  // console.log('MAP SELECT');
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
      mapObj.SELECT = "TODO";
      continue;
    }
  }
};

const processMSGPACK = (cell: Cell[], mapObj: MAPType) => {
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
      continue;
    }
    if (pushdataContainer.i === 2) {
      try {
        if (!decode) {
          throw new Error("Msgpack is required but not loaded");
        }
        const buff = Buffer.from(pushdataContainer.b as string, "base64");
        mapObj = decode(buff) as MAPType;
      } catch (e) {
        mapObj = {} as MAPType;
      }
    }
  }
  return mapObj;
};

const processJSON = (cell: Cell[], mapObj: MAPType) => {
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
      continue;
    }
    if (pushdataContainer.i === 2) {
      try {
        mapObj = JSON.parse(pushdataContainer.s as string);
      } catch (e) {
        mapObj = {} as MAPType;
      }
    }
  }
  return mapObj;
};

const processSET = (cell: Cell[], mapObj: MAPType) => {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      !pushdataContainer.s ||
      pushdataContainer.i === 0 ||
      pushdataContainer.i === 1
    ) {
      continue;
    }

    const pushdata = pushdataContainer.s;
    if (pushdataContainer.i % 2 === 0) {
      // key
      mapObj[pushdata] = "";
      last = pushdata;
    } else {
      // value
      if (!last) {
        throw new Error(`malformed MAP syntax. Cannot parse.${last}`);
      }
      mapObj[last] = pushdata;
    }
  }
};

const handler = ({ dataObj, cell, tx }: HandlerProps) => {
  // Validate
  if (
    cell[0].s !== address ||
    !cell[1] ||
    !cell[1].s ||
    !cell[2] ||
    !cell[2].s
  ) {
    throw new Error(`Invalid MAP record: ${tx}`);
  }

  let mapObj = {} as MAPType;

  // parse the protocol separator
  const commands: any[] = [];
  let commandSeparator = 0;
  for (let i = 1; i < cell.length; i++) {
    if (cell[i].s === ":::") {
      commandSeparator++;
    } else {
      if (!commands[commandSeparator]) commands[commandSeparator] = [];
      cell[i].i = commands[commandSeparator].length + 1;
      commands[commandSeparator].push(cell[i]);
    }
  }

  // Get the MAP command key name from the query schema
  const mapCmdKey = Object.keys(opReturnSchema[0])[0];

  // Add the firt MAP command in the response object
  mapObj[mapCmdKey] = commands[0][0].s;

  for (const cc of commands) {
    // re-add the MAP address
    cc.unshift({
      s: address,
      i: 0,
    });

    const command = cc[1].s;
    // Individual parsing rules for each MAP command
    switch (command) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        processADD(cc, mapObj);
        break;
      }
      case "REMOVE": {
        mapObj.key = cc[2].s;
        break;
      }
      case "DELETE": {
        proccessDELETE(cc, mapObj);
        break;
      }
      case "CLEAR": {
        // TODO
        // console.log('MAP CLEAR');
        break;
      }
      case "SELECT": {
        processSELECT(cc, mapObj);
        break;
      }
      case "MSGPACK": {
        mapObj = processMSGPACK(cc, mapObj);
        break;
      }
      case "JSON": {
        mapObj = processJSON(cc, mapObj);
        break;
      }
      case "SET": {
        processSET(cc, mapObj);
        break;
      }
      default: {
        // don't know what to do ...
      }
    }
  }

  saveProtocolData(dataObj, "MAP", mapObj);
};

export const MAP: Protocol = {
  name: "MAP",
  address,
  opReturnSchema,
  handler,
};
