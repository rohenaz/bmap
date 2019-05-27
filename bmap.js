const bmap = {}
// Takes a bitdb formatted op_return transaction
bmap.TransformTx = (tx) => {
  if (!tx || !tx.hasOwnProperty('in') || !tx.hasOwnProperty('out')) {
    throw new Error('Cant process tx', tx)
  }

  let protocolMap = new Map()
  protocolMap.set('B','19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut')
  protocolMap.set('MAP','1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5')
  protocolMap.set('AIP','15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva')

  let protocolSchema = {
    '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut': 'B',
    '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5': 'MAP',
    '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva': 'AIP'
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
    ],
    'AIP': [
      { 'algorithm': 'string' },
      { 'address': 'string' },
      { 'signature': 'binary' },
      [
        {'index': 'string'}
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
    if (key === 'out' && tx.out.some((output) => { return output && output.b0 && output.b0.op === 106 })) {
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

        // TODO - only do this if the field in question should be a string
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
  let newAIP = {}
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

    // Detect & swap binary encoding for B files
    if (newB.hasOwnProperty('encoding') && newB['encoding'] === 'binary' && self.out.some(out => { return out.s1 === protocolMap.get('B') && out.s4 === 'binary' })) {
      newB['content'] = self.out.filter(out => { return out && out.s1 === protocolMap.get('B') }).map((out) => { return out.lb2 })[0]
    }

    self.B = newB
  }

  if (self.hasOwnProperty('AIP')) {
    for (let kv of self.AIP) {
      let key = Object.keys(kv)[0]
      newAIP[key] = Object.values(kv)[0]
    }

    // Detect and swap signature
    if (newAIP.hasOwnProperty('signature') && newAIP.signature.length > 0) {

      // find where the bad signature lives, and replace 's' with 'b'
      let opOuts = self.out.filter((out) => { return out && out.hasOwnProperty('b0') && out.b0.hasOwnProperty('op') && out.b0.op === 106 })
      for (let [key, val] of Object.entries(opOuts[0])) {
        if (val === newAIP.signature) {
          // replace signature with binary
          newAIP.signature = opOuts[0][key.replace('s','b')]
          break
        }
      }
    }

    self.AIP = newAIP
  }

  // Now my object is ready
  return self
}

export default bmap