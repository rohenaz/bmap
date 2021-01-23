import { decode } from '@msgpack/msgpack';
import { saveProtocolData } from '../utils';

const address = '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5';

const querySchema = [
  {
    cmd: {
      SET: [{ key: 'string' }, { val: 'string' }],
      SELECT: [{ tx: 'string' }],
      ADD: [{ key: 'string' }, [{ val: 'string' }]],
      DELETE: [{ key: 'string' }, [{ val: 'string' }]],
      JSON: 'string',
      REMOVE: [[{ key: 'string' }]],
      CLEAR: [[{ txid: 'string' }]],
    },
  },
];

const processADD = function (cell, mapObj) {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      continue;
    }
    const pushdata = pushdataContainer.s;
    if (pushdataContainer.i === 2) {
      // Key name
      mapObj[pushdata] = [];
      last = pushdata;
    } else {
      mapObj[last].push(pushdata);
    }
  }
};

const proccessDELETE = function (cell, mapObj) {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      continue;
    }
    const pushdata = pushdataContainer.s;
    if (pushdataContainer.i === 2) {
      // Key name
      mapObj[pushdata] = [];
      last = pushdata;
    } else {
      mapObj[last].push(pushdata);
    }
  }
};

const processSELECT = function (cell, mapObj) {
  // TODO
  // console.log('MAP SELECT');
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      mapObj.SELECT = 'TODO';
      continue;
    }
  }
};

const processMSGPACK = function (cell, mapObj) {
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      continue;
    }
    if (pushdataContainer.i === 2) {
      try {
        if (!decode) {
          throw new Error('Msgpack is required but not loaded');
        }
        const buff = buffer.from(
          pushdataContainer.b,
          'base64',
        );
        mapObj = decode(buff);
      } catch (e) {
        mapObj = {};
      }
    }
  }
  return mapObj;
};

const processJSON = function (cell, mapObj) {
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      continue;
    }
    if (pushdataContainer.i === 2) {
      try {
        mapObj = JSON.parse(pushdataContainer.s);
      } catch (e) {
        mapObj = {};
      }
    }
  }
  return mapObj;
};

const processSET = function (cell, mapObj) {
  let last = null;
  for (const pushdataContainer of cell) {
    // ignore MAP command
    if (
      !pushdataContainer.s
      || pushdataContainer.i === 0
      || pushdataContainer.i === 1
    ) {
      continue;
    }

    const pushdata = pushdataContainer.s;
    if (pushdataContainer.i % 2 === 0) {
      // key
      mapObj[pushdata] = '';
      last = pushdata;
    } else {
      // value
      if (!last) {
        throw new Error('malformed MAP syntax. Cannot parse.' + last);
      }
      mapObj[last] = pushdata;
    }
  }
};

const handler = function (dataObj, cell, tape, tx) {
  // Validate
  if (cell[0].s !== address
    || !cell[1]
    || !cell[1].s
    || !cell[2]
    || !cell[2].s
  ) {
    throw new Error('Invalid MAP record: ' + tx);
  }

  let mapObj = {};

  // parse the protocol separator
  const commands = [];
  let commandSeparator = 0;
  for (let i = 1; i < cell.length; i++) {
    if (cell[i].s === ':::') {
      commandSeparator++;
    } else {
      if (!commands[commandSeparator]) commands[commandSeparator] = [];
      cell[i].i = commands[commandSeparator].length + 1;
      commands[commandSeparator].push(cell[i]);
    }
  }

  // Get the MAP command key name from the query schema
  const mapCmdKey = Object.keys(querySchema[0])[0];

  // Add the firt MAP command in the response object
  mapObj[mapCmdKey] = commands[0][0].s;

  commands.forEach((cc) => {
    // re-add the MAP address
    cc.unshift({
      s: address,
      i: 0,
    });

    const command = cc[1].s;
    // Individual parsing rules for each MAP command
    switch (command) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case 'ADD': {
        processADD(cc, mapObj);
        break;
      }
      case 'REMOVE': {
        mapObj.key = cc[2].s;
        break;
      }
      case 'DELETE': {
        proccessDELETE(cc, mapObj);
        break;
      }
      case 'CLEAR': {
        // TODO
        // console.log('MAP CLEAR');
        break;
      }
      case 'SELECT': {
        processSELECT(cc, mapObj);
        break;
      }
      case 'MSGPACK': {
        mapObj = processMSGPACK(cc, mapObj);
        break;
      }
      case 'JSON': {
        mapObj = processJSON(cc, mapObj);
        break;
      }
      case 'SET': {
        processSET(cc, mapObj);
        break;
      }
      default: {
        // don't know what to do ...
      }
    }
  });

  saveProtocolData(dataObj, 'MAP', mapObj);
};

export const MAP = {
  name: 'MAP',
  address,
  querySchema,
  handler,
};
