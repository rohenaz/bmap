import bsv from 'bsv';
import Message from 'bsv/message';
import { cellValue, saveProtocolData } from '../utils';

const address = '13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC';

const querySchema = [
  { bitkey_signature: 'string' },
  { user_signature: 'string' },
  { paymail: 'string' },
  { pubkey: 'string' },
];

// const handler = function (dataObj, cell, tape, tx) {
// https://bitkey.network/how
const handler = function (dataObj, cell) {
  const bitkeyObj = {};

  // loop over the schema
  for (const [idx, schemaField] of Object.entries(querySchema)) {
    const x = parseInt(idx, 10);
    const bitkeyField = Object.keys(schemaField)[0];
    const schemaEncoding = Object.values(schemaField)[0];
    bitkeyObj[bitkeyField] = cellValue(
      cell[x + 1],
      schemaEncoding,
    );
  }

  const userAddress = bsv.PublicKey.fromString(bitkeyObj.pubkey).toAddress().toString();

  // sha256( hex(paymail(USER)) | hex(pubkey(USER)) )
  const paymailHex = Buffer.from(bitkeyObj.paymail).toString('hex');
  const pubkeyHex = Buffer.from(bitkeyObj.pubkey).toString('hex');
  const concatenated = paymailHex + pubkeyHex;
  const bitkeySignatureBuffer = bsv.crypto.Hash.sha256(Buffer.from(concatenated, 'hex'));

  const bitkeySignatureVerified = Message.verify(
    bitkeySignatureBuffer,
    '13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC',
    bitkeyObj.bitkey_signature,
  );
  const userSignatureVerified = Message.verify(
    Buffer.from(bitkeyObj.pubkey),
    userAddress,
    bitkeyObj.user_signature,
  );

  bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified;

  saveProtocolData(dataObj, 'BITKEY', bitkeyObj);
};

export const BITKEY = {
  name: 'BITKEY',
  address,
  querySchema,
  handler,
};
