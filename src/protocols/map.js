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

  const command = cell[1].s;

  // Get the MAP command key name from the query schema
  const mapCmdKey = Object.keys(querySchema[0])[0];

  // Add the MAP command in the response object
  mapObj[mapCmdKey] = command;

  // Individual parsing rules for each MAP command
  switch (command) {
    // ToDo - MAP v2: Check for protocol separator and run commands in a loop
    // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
    case 'ADD': {
      let last = null;
      /* eslint-disable no-restricted-syntax */
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
      break;
    }
    case 'REMOVE': {
      mapObj.key = cell[2].s;
      break;
    }
    case 'DELETE': {
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
      break;
    }
    case 'CLEAR': {
      // TODO
      // console.log('MAP CLEAR');
      break;
    }
    case 'SELECT': {
      // TODO
      // console.log('MAP SELECT');
      /* eslint-disable no-restricted-syntax */
      for (const pushdataContainer of cell) {
        // ignore MAP command
        if (
          pushdataContainer.i === 0
          || pushdataContainer.i === 1
        ) {
          continue;
        }
      }
      break;
    }
    case 'MSGPACK': {
      /* eslint-disable no-restricted-syntax */
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
      break;
    }
    case 'JSON': {
      /* eslint-disable no-restricted-syntax */
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
      break;
    }
    case 'SET': {
      let last = null;
      /* eslint-disable no-restricted-syntax */
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
      break;
    }
    default: {
      // don't know what to do ...
    }
  }

  saveProtocolData(dataObj, 'MAP', mapObj);
};

export const MAP = {
  name: 'MAP',
  address,
  querySchema,
  handler,
};
