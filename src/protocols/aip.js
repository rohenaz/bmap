import bsv from 'bsv';
import Message from 'bsv/message';
import { cellValue, saveProtocolData, checkOpFalseOpReturn } from '../utils';

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

  const usingIndexes = aipObj.index || [];
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

  // create signature buffer
  let messageBuffer;
  const addHaipSignatureStatementToBuffer = function (signatureBufferStatement) {
    // get the length in hex
    let statementLengthHex = signatureBufferStatement.length.toString(16);
    if (statementLengthHex.length % 2) {
      statementLengthHex = '0' + statementLengthHex;
    }

    messageBuffer = Buffer.concat([
      messageBuffer,
      Buffer.from(statementLengthHex, 'hex'),
      signatureBufferStatement,
    ]);
  };

  if (aipObj.hashing_algorithm) {
    // this is actually HAIP and works a bit differently
    signatureBufferStatements.shift(); // remove OP_RETURN

    if (usingIndexes.length) {
      usingIndexes.forEach((index) => {
        addHaipSignatureStatementToBuffer(signatureBufferStatements[index]);
      });
    } else {
      messageBuffer = Buffer.from('6a', 'hex'); // add the OP_RETURN without length
      signatureBufferStatements.forEach((signatureBufferStatement) => {
        addHaipSignatureStatementToBuffer(signatureBufferStatement);
      });
    }

    // console.log(messageBuffer.toString('hex'))
    messageBuffer = bsv.crypto.Hash.sha256(Buffer.from(messageBuffer.toString('hex')));
    // console.log(messageBuffer.toString('hex'));
  } else {
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

  /* eslint-disable no-restricted-syntax */
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
