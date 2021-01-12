import { bmapQuerySchemaHandler } from '../utils';

const address = '1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT';

const querySchema = [
  { type: 'string' },
  { hash: 'string' },
  { sequence: 'string' },
];

export const handler = function (dataObj, cell, tape, tx) {
  bmapQuerySchemaHandler('BAP', querySchema, dataObj, cell, tape, tx);
};

export const BAP = {
  name: 'BAP',
  address,
  querySchema,
  handler,
};
