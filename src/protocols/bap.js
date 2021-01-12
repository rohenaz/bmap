import { cellValue, saveProtocolData } from '../utils';

const address = '1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT';

const querySchema = [
  { type: 'string' },
  { hash: 'string' },
  { sequence: 'string' },
];

export const handler = function (dataObj, cell, tape, tx) {
  // loop over the schema
  const bapObj = {};

  // Does not have the required number of fields
  if (cell.length < 4) {
    throw new Error('BAP requires at least 4 fields including the prefix', tx);
  }

  /* eslint-disable no-restricted-syntax */
  for (const [idx, schemaField] of Object.entries(querySchema)) {
    const x = parseInt(idx, 10);

    const [bapField] = Object.keys(schemaField);
    const [schemaEncoding] = Object.values(schemaField);
    bapObj[bapField] = cellValue(cell[x + 1], schemaEncoding);
  }

  saveProtocolData(dataObj, 'BAP', bapObj);
};

export const BAP = {
  name: 'BAP',
  address,
  querySchema,
  handler,
};
