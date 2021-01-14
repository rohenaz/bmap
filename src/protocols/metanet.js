import bsv from 'bsv';

const address = 'meta';

const querySchema = [
  { address: 'string' },
  { parent: 'string' },
  { name: 'string' },
];

export const getEnvSafeMetanetID = function (a, tx) {
  // Calculate the node ID
  const buf = Buffer.from(a + tx);
  return bsv.crypto.Hash.sha256(buf).toString('hex');
};

const handler = function (dataObj, cell, tape, tx) {
  if (cell[0].s !== 'meta' || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) {
    throw new Error('Invalid Metanet tx', tx);
  }
  // For now, we just copy from MOM keys later if available, or keep BOB format

  // Described this node
  const node = {
    address: cell[1].s,
    txId: tx.tx.h,
    id: getEnvSafeMetanetID(cell[1].s, tx.tx.h),
  };

  // Parent node
  const parent = {
    address: tx.in[0].e.a,
    txId: cell[2].s,
    id: getEnvSafeMetanetID(tx.in[0].e.a, cell[2].s),
  };

  dataObj.METANET = {
    node,
    parent,
  };
};

export const METANET = {
  name: 'METANET',
  address,
  querySchema,
  handler,
};
