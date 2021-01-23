import { cellValue, saveProtocolData } from '../utils';

const address = '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut';

const querySchema = [
  { content: ['string', 'binary', 'file'] },
  { 'content-type': 'string' },
  { encoding: 'string' }, // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: 'string' },
];

const handler = function (dataObj, cell, tape, tx) {
  const encodingMap = {
    utf8: 'string',
    text: 'string', // invalid but people use it :(
    gzip: 'binary', // invalid but people use it :(
    'text/plain': 'string',
    'image/png': 'binary',
    'image/jpeg': 'binary',
  };

  if (!cell[1] || !cell[2]) {
    throw new Error('Invalid B tx: ' + tx);
  }

  // Check pushdata length + 1 for protocol prefix
  if (cell.length > querySchema.length + 1) {
    throw new Error('Invalid B tx. Too many fields.');
  }

  // Make sure there are not more fields than possible

  const bObj = {};
  // loop over the schema
  for (const [idx, schemaField] of Object.entries(querySchema)) {
    const x = parseInt(idx, 10);
    const bField = Object.keys(schemaField)[0];
    let schemaEncoding = Object.values(schemaField)[0];
    if (bField === 'content') {
      // If the encoding is ommitted, try to infer from content-type instead of breaking
      if (cell[1].f) {
        // this is file reference to B files
        schemaEncoding = 'file';
      } else if (!cell[3] || !cell[3].s) {
        schemaEncoding = encodingMap[cell[2].s];
        if (!schemaEncoding) {
          console.warn('Problem inferring encoding. Malformed B data.', cell);
          return;
        }

        // add the missing encoding field
        cell[3].s = schemaEncoding === 'string' ? 'utf-8' : 'binary';
      } else {
        schemaEncoding = cell[3] && cell[3].s
          ? encodingMap[cell[3].s.replace('-', '').toLowerCase()]
          : null;
      }
    }

    // Sometimes filename is not used
    if (bField === 'filename' && !cell[x + 1]) {
      // filename ommitted
      continue;
    }

    // check for malformed syntax
    if (!cell || !cell.hasOwnProperty(x + 1)) {
      throw new Error('malformed B syntax', cell);
    }

    // set field value from either s, b, ls, or lb depending on encoding and availability
    const data = cell[x + 1];
    bObj[bField] = cellValue(data, schemaEncoding);
  }

  saveProtocolData(dataObj, 'B', bObj);
};

export const B = {
  name: 'B',
  address,
  querySchema,
  handler,
};
