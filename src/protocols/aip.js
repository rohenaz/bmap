import bsv from 'bsv';
import Message from 'bsv/message';
import {
  cellValue,
  checkOpFalseOpReturn,
  saveProtocolData,
  isBase64
} from '../utils';

const address = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';

const querySchema = [
  { algorithm: 'string' },
  { address: 'string' },
  { signature: 'binary' },
  [{ index: 'binary' }],
];

const validateSignature = function (aipObj, cell, tape) {
  if (!Array.isArray(tape) || tape.length < 3) {
    throw new Error('AIP requires at least 3 cells including the prefix');
  }

  let cellIndex = -1;
  tape.forEach((cc, index) => {
    if (cc.cell === cell) {
      cellIndex = index;
    }
  });
  if (cellIndex === -1) {
    throw new Error('AIP could not find cell in tape');
  }

  let usingIndexes = aipObj.index || [];
  const signatureValues = ['6a']; // OP_RETURN - is included in AIP
  for (let i = 0; i < cellIndex; i++) {
    const cellContainer = tape[i];
    if (!checkOpFalseOpReturn(cellContainer)) {
      cellContainer.cell.forEach((statement) => {
        // add the value as hex
        signatureValues.push(statement.h);
      });
      signatureValues.push('7c'); // | hex
    }
  }

  if (aipObj.hashing_algorithm) {
    // when using HAIP, we need to parse the indexes in a non standard way
    // indexLength is byte size of the indexes being described
    if (aipObj.index_unit_size) {
      const indexLength = aipObj.index_unit_size * 2;
      usingIndexes = [];
      const indexes = cell[6].h;
      for (let i = 0; i < indexes.length; i += indexLength) {
        usingIndexes.push(parseInt(indexes.substr(i, indexLength), 16));
      }
      aipObj.index = usingIndexes;
    }
  }

  const signatureBufferStatements = [];
  // check whether we need to only sign some indexes
  if (usingIndexes.length > 0) {
    usingIndexes.forEach((index) => {
      signatureBufferStatements.push(Buffer.from(signatureValues[index], 'hex'));
    });
  } else {
    // add all the values to the signature buffer
    signatureValues.forEach((statement) => {
      signatureBufferStatements.push(Buffer.from(statement, 'hex'));
    });
  }

  let messageBuffer;
  if (aipObj.hashing_algorithm) {
    // this is actually Hashed-AIP (HAIP) and works a bit differently
    if (!aipObj.index_unit_size) {
      // remove OP_RETURN - will be added by bsv.Script.buildDataOut
      signatureBufferStatements.shift();
    }
    const dataScript = bsv.Script.buildDataOut(signatureBufferStatements);
    let dataBuffer = Buffer.from(dataScript.toHex(), 'hex');
    if (aipObj.index_unit_size) {
      // the indexed buffer should not contain the OP_RETURN opcode, but this
      // is added by the buildDataOut function automatically. Remove it.
      dataBuffer = dataBuffer.slice(1);
    }
    messageBuffer = bsv.crypto.Hash.sha256(Buffer.from(dataBuffer.toString('hex'))).toString('hex');
  } else {
    // regular AIP
    messageBuffer = Buffer.concat([
      ...signatureBufferStatements,
    ]);
  }

  // verify aip signature
  try {
    aipObj.verified = Message.verify(
      messageBuffer,
      aipObj.address || aipObj.signing_address,
      aipObj.signature,
    );
  } catch (e) {
    aipObj.verified = false;
  }

  return aipObj.verified;
};

export const AIPhandler = function (useQuerySchema, protocolName, dataObj, cell, tape, tx) {
  // loop over the schema
  const aipObj = {};

  // Does not have the required number of fields
  if (cell.length < 4) {
    throw new Error('AIP requires at least 4 fields including the prefix', tx);
  }

  for (const [idx, schemaField] of Object.entries(useQuerySchema)) {
    const x = parseInt(idx, 10);

    let schemaEncoding;
    let aipField;
    if (schemaField instanceof Array) {
      // signature indexes are specified
      schemaEncoding = schemaField[0].index;
      [aipField] = Object.keys(schemaField[0]);
      // run through the rest of the fields in this cell, should be de indexes
      aipObj[aipField] = [];
      for (let i = x + 1; i < cell.length; i++) {
        aipObj[aipField].push(parseInt(cell[i].h, 16));
      }
      continue;
    } else {
      [aipField] = Object.keys(schemaField);
      [schemaEncoding] = Object.values(schemaField);
    }

    aipObj[aipField] = cellValue(cell[x + 1], schemaEncoding);
  }

  // There is an issue where some services add the signature as binary to the transaction
  // whereas others add the signature as base64. This will confuse bob and the parser and
  // the signature will not be verified. When the signature is added in binary cell[3].s is
  // binary, otherwise cell[3].s contains the base64 signature and should be used.
  if (cell[0].s === address && cell[3].s && isBase64(cell[3].s)) {
    aipObj.signature = cell[3].s;
  }

  if (!aipObj.signature) {
    throw new Error('AIP requires a signature', tx);
  }

  if (!validateSignature(aipObj, cell, tape)) {
    // throw new Error('AIP requires a valid signature', tx);
  }

  saveProtocolData(dataObj, protocolName, aipObj);
};

const handler = function (dataObj, cell, tape, tx) {
  AIPhandler(querySchema, 'AIP', dataObj, cell, tape, tx);
};

export const AIP = {
  name: 'AIP',
  address,
  querySchema,
  handler,
};
