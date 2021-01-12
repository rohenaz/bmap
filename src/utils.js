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
 * returns the BOB cell value for a given encoding
 *
 * @param pushData
 * @param schemaEncoding
 * @returns {string|number}
 */
export const cellValue = function (pushData, schemaEncoding) {
  if (!pushData) {
    throw new Error('cannot get cell value of: ' + pushData);
  }

  if (schemaEncoding === 'string') {
    return pushData.hasOwnProperty('s') ? pushData.s : pushData.ls;
  }

  if (schemaEncoding === 'hex') {
    return pushData.hasOwnProperty('h') ? pushData.h : pushData.lh;
  }

  if (schemaEncoding === 'number') {
    return parseInt((pushData.hasOwnProperty('h') ? pushData.h : pushData.lh), 16);
  }

  return pushData.hasOwnProperty('b') ? pushData.b : pushData.lb;
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
