(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const bmap = {}
// Takes a bitdb formatted op_return transaction
bmap.TransformTx = (tx) => {
  if (!tx) {
    throw new Error('Cant process tx', tx)
  }
  let protocolSchema = {
    '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut': 'B',
    '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5': 'MAP'
  }

  let querySchema = {
    'B': [
      { 'content': 'string' },
      { 'content-type': 'string' },
      { 'encoding': 'string' },
      { 'filename': 'string' }
    ],
    'MAP': [
      { 'cmd': 'string' },
      [
        { 'key': 'string' },
        { 'val': 'string' }
      ]
    ]
  }

  // This will become our nicely formatted response object
  let dataObj = {}

  // We always know what the first protocol is, it's always in s1
  let protocolName = protocolSchema[tx.out.filter(tx => { return tx && tx.b0.op === 106 })[0].s1]
  // Flag for handling pipes
  let relativeIndex = 0

  // Loop over the tx keys (in, out, tx, blk ...)
  for (let key of Object.keys(tx)) {
    // Check for op_return
    if (key === 'out' && tx[key].some((output) => { return output && output.b0 && output.b0.op === 106 })) {
      // There can be only one
      let opReturnOutput = tx[key][0]

      // used to loop over repeating schema patterns
      let roundIndex = 0

      // walk pushdatas
      for (let pushdataKey in opReturnOutput) {
        // if the 's' key push is unavailable, assume the 'l' variant exists
        pushdataKey = opReturnOutput.hasOwnProperty(pushdataKey) ? pushdataKey : opReturnOutput.hasOwnProperty('l' + pushdataKey) ? 'l' + pushdataKey : null
        if (!pushdataKey) {
          // missing large data fields (ex. chronos bitsocket)
          pushdataKey = 'lb' + relativeIndex
          pushdataKey = 'ls' + relativeIndex
        }
        let pushdata = opReturnOutput[pushdataKey]

        if ((!pushdataKey.startsWith('s') && !pushdataKey.startsWith('ls')) || pushdataKey === 'str') {
          // skip the non string values
          continue
        }

        // If its an op, we dont need it now...
        if (pushdata.hasOwnProperty('op')) {
          continue
        }

        // If pushdata is the protocol name, skip it
        if (Object.keys(protocolSchema).some((address) => { return address === pushdata }) && relativeIndex === 0) {
          protocolName = protocolSchema[pushdata]
          continue
        }

        // If its the protocol prefix, we dont need it now...
        if (!relativeIndex) {
          // new Protocol
          dataObj[protocolName] = []
        }

        // if the value is a pipe, set the name again and continue without pushing
        if (pushdata === '|') {
          relativeIndex = 0
          continue
        }

        let schemaKey
        // Check for an array for this query schema key (repeating pattern)
        let schemaField = querySchema[protocolName][relativeIndex]
        let obj = {}
        if (schemaField instanceof Array) {
          // loop through the schema as we add values
          roundIndex = roundIndex % schemaField.length
          let thekey = Object.keys(schemaField[roundIndex++])[0]
          obj[thekey] = pushdata
          dataObj[protocolName].push(obj)
          continue
        } else {
          // get the key,value pair from this query schema
          if (schemaField) {
            schemaKey = Object.keys(schemaField)[0]
            obj[schemaKey] = pushdata
          }

          dataObj[protocolName].push(obj)
          relativeIndex++
        }
      }
    }
    dataObj[key] = tx[key]
  }

  // TRANSFORM
  let newMap = {}
  let newB = {}
  let keyTemp
  let self = dataObj
  if (self.hasOwnProperty('MAP')) {
    for (let kv of self.MAP) {
      let key = Object.keys(kv)[0]
      if (key === 'key') {
        keyTemp = Object.values(kv)[0]
      } else if (key === 'val') {
        newMap[keyTemp] = Object.values(kv)[0]
      }
    }
    self.MAP = newMap
  }

  if (self.hasOwnProperty('B')) {
    for (let kv of self.B) {
      let key = Object.keys(kv)[0]
      newB[key] = Object.values(kv)[0]
    }

    // Detect & swap binary encoding
    if (newB.hasOwnProperty('encoding') && newB['encoding'] === 'binary' && self.out.some(out => { return out.s1 === this.B_PREFIX && out.s4 === 'binary' })) {
      newB['content'] = self.out.filter(out => { return out && out.s1 === this.B_PREFIX }).map((out) => { return out.lb2 })[0]
    }
    self.B = newB
  }

  // Now my object is ready
  return self
}

exports.TransformTx = function(tx) {
  console.log("This is a message from the demo package")
  return bmap.TransformTx(tx)
}
},{}]},{},[1]);
