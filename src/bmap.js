import {
  checkOpFalseOpReturn,
  saveProtocolData,
} from './utils';

// import default protocols
import { AIP } from './protocols/aip';
import { B } from './protocols/b';
import { BAP } from './protocols/bap';
import { BITCOM } from './protocols/bitcom';
import { BITKEY } from './protocols/bitkey';
import { BITPIC } from './protocols/bitpic';
import { HAIP } from './protocols/haip';
import { MAP } from './protocols/map';
import { METANET } from './protocols/metanet';
import { PSP } from './protocols/psp';
import { RON } from './protocols/ron';
import { SYMRE } from './protocols/symre';

const protocolMap = {};
const protocolHandlers = {};
const protocolQuerySchemas = {};
[AIP, B, BAP, BITCOM, BITKEY, BITPIC, HAIP, MAP, METANET, PSP, RON, SYMRE].forEach((protocol) => {
  protocolMap[protocol.address] = protocol.name;
  protocolHandlers[protocol.name] = protocol.handler;
  protocolQuerySchemas[protocol.name] = protocol.querySchema;
});

// Takes a BOB formatted op_return transaction
export default class BMAP {
  constructor() {
    // initial default protocol handlers in this instantiation
    this.protocolMap = protocolMap;
    this.protocolHandlers = protocolHandlers;
    this.protocolQuerySchemas = protocolQuerySchemas;
  }

  addProtocolHandler(name, address, querySchema, handler) {
    this.protocolMap[address] = name;
    this.protocolHandlers[name] = handler;
    this.protocolQuerySchemas[name] = querySchema;
  }

  /**
   * Transform tx to BMAP format
   *
   * @param tx
   * @returns {{}}
   */
  transformTx = async function (tx) {
    const self = this;

    if (!tx || !tx.hasOwnProperty('in') || !tx.hasOwnProperty('out')) {
      throw new Error('Cannot process tx');
    }

    // This will become our nicely formatted response object
    const dataObj = {};

    /* eslint-disable no-restricted-syntax */
    for (const [key, val] of Object.entries(tx)) {
      if (key === 'out') {
        // loop over the outputs
        for (const out of tx.out) {
          const { tape } = out;

          if (
            tape.some((cc) => {
              return checkOpFalseOpReturn(cc);
            })
          ) {
            for (const cellContainer of tape) {
              // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
              if (checkOpFalseOpReturn(cellContainer)) {
                continue;
              }

              const { cell } = cellContainer;
              if (!cell) {
                throw new Error('empty cell while parsing');
              }

              // Get protocol name from prefix
              const protocolName = self.protocolMap[cell[0].s] || cell[0].s;

              if (
                self.protocolHandlers.hasOwnProperty(protocolName)
                && typeof self.protocolHandlers[protocolName] === 'function'
              ) {
                /* eslint-disable no-await-in-loop */
                await self.protocolHandlers[protocolName](dataObj, cell, tape, tx);
              } else {
                saveProtocolData(dataObj, protocolName, cell, tape, tx);
              }
            }
          } else {
            // No OP_RETURN in this outputs
            if (!dataObj[key]) {
              dataObj[key] = [];
            }
            dataObj[key].push({
              i: out.i,
              e: out.e,
            });
          }
        }
      } else if (key === 'in') {
        dataObj[key] = val.map((v) => {
          const r = { ...v };
          delete r.tape;
          return r;
        });
      } else {
        dataObj[key] = val;
      }
    }

    // If this is a MOM planaria it will have metanet keys available
    if (dataObj.hasOwnProperty('METANET') && tx.hasOwnProperty('parent')) {
      dataObj.METANET.ancestor = tx.ancestor;
      delete dataObj.ancestor;
      dataObj.METANET.child = tx.child;
      delete dataObj.child;

      // remove parent and node from root level for (MOM data)
      delete dataObj.parent;
      delete dataObj.node;

      dataObj.METANET.head = tx.head;
      delete dataObj.head;
    }

    return dataObj;
  };
}

export const bmap = {
  TransformTx: async (tx) => {
    const b = new BMAP();
    return b.transformTx(tx);
  },
};
