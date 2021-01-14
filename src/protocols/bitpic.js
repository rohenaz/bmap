import bsv from 'bsv';
import Message from 'bsv/message';
import { saveProtocolData } from '../utils';

const protocolAddress = '18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p';

const querySchema = [
  { paymail: 'string' },
  { signature: 'string' },
];

const handler = function (dataObj, cell, tape, tx) {
  // Validation
  if (
    cell[0].s !== protocolAddress
    || !cell[1]
    || !cell[2]
    || !cell[3]
    || !cell[1].s
    || !cell[2].b
    || !cell[3].b
  ) {
    throw new Error('Invalid BITPIC record: ' + tx);
  }

  const bitpicObj = {
    paymail: cell[1].s,
    pubkey: cell[2].h,
    signature: cell[3].b,
  };

  const b = tape[1].cell;
  if (b[0].s === '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut') {
    // verify aip signature
    try {
      // TODO: bob transactions are missing this binary part, cannot verify signature
      const bin = cell[1].lb || cell[1].b;
      const buf = Buffer.from(bin, 'base64');
      const hash = bsv.crypto.Hash.sha256(buf);
      const address = new bsv.PublicKey(bitpicObj.pubkey).toAddress().toString();

      bitpicObj.verified = Message.verify(
        hash,
        address,
        bitpicObj.signature,
      );
    } catch (e) {
      // failed verification
      bitpicObj.verified = false;
    }
  }

  saveProtocolData(dataObj, 'BITPIC', bitpicObj);
};

export const BITPIC = {
  name: 'BITPIC',
  address: protocolAddress,
  querySchema,
  handler,
};
