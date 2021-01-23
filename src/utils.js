/**
 * returns the BOB cell value for a given encoding
 *
 * @param pushData
 * @param schemaEncoding
 * @returns {string|number}
 */
export const cellValue = function (pushData, schemaEncoding) {
  if (!pushData) {
    throw new Error('cannot get cell value of: ' + pushData);
  } else if (schemaEncoding === 'string') {
    return pushData.hasOwnProperty('s') ? pushData.s : pushData.ls;
  } else if (schemaEncoding === 'hex') {
    return pushData.hasOwnProperty('h') ? pushData.h : pushData.lh;
  } else if (schemaEncoding === 'number') {
    return parseInt((pushData.hasOwnProperty('h') ? pushData.h : pushData.lh), 16);
  } else if (schemaEncoding === 'file') {
    return 'bitfs://' + (pushData.hasOwnProperty('f') ? pushData.f : pushData.lf);
  }

  return pushData.hasOwnProperty('b') ? pushData.b : pushData.lb;
};

/**
 * Check a cell starts with OP_FALSE OP_RETURN -or- OP_RETURN
 *
 * @param cc
 * @returns {boolean}
 */
export const checkOpFalseOpReturn = function (cc) {
  return (
    (cc.cell[0]
      && cc.cell[1]
      && cc.cell[0].op === 0
      && cc.cell[1].hasOwnProperty('op')
      && cc.cell[1].op === 106
    )
    || cc.cell[0].op === 106
  );
};

/**
 * Helper function to store protocol data
 *
 * @param dataObj
 * @param protocolName
 * @param data
 */
export const saveProtocolData = (dataObj, protocolName, data) => {
  if (!dataObj.hasOwnProperty(protocolName)) {
    dataObj[protocolName] = data;
  } else {
    if (!Array.isArray(dataObj[protocolName])) {
      const prevData = dataObj[protocolName];
      dataObj[protocolName] = [];
      dataObj[protocolName][0] = prevData;
    }
    dataObj[protocolName][dataObj[protocolName].length] = data;
  }
};

/**
 * BMAP default handler to work with query schema's
 *
 * @param querySchema
 * @param protocolName
 * @param dataObj
 * @param cell
 * @param tape
 * @param tx
 */
export const bmapQuerySchemaHandler = function (
  protocolName, querySchema, dataObj, cell, tape, tx,
) {
  // loop over the schema
  const obj = {};

  // Does not have the required number of fields
  const length = querySchema.length + 1;
  if (cell.length < length) {
    throw new Error(
      `${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`,
    );
  }

  for (const [idx, schemaField] of Object.entries(querySchema)) {
    const x = parseInt(idx, 10);

    const [field] = Object.keys(schemaField);
    const [schemaEncoding] = Object.values(schemaField);
    obj[field] = cellValue(cell[x + 1], schemaEncoding);
  }

  saveProtocolData(dataObj, protocolName, obj);
};

/**
 * Check whether the given data is base64
 *
 * @param data
 * @returns {boolean}
 */
export const isBase64 = function (data) {
  const regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';
  return (new RegExp('^' + regex + '$', 'gi')).test(data);
};
