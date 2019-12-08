const bmap = {}

Map.prototype.getKey = function (searchValue) {
  for (let [key, value] of this.entries()) {
    if (value === searchValue)
      return key
  }
  return null
}

// Takes a BOB formatted op_return transaction
bmap.TransformTx = (tx) => {
  if (!tx || !tx.hasOwnProperty('in') || !tx.hasOwnProperty('out')) {
    throw new Error('Cant process tx', tx)
  }

  let protocolMap = new Map()
  protocolMap.set('B','19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut')
  protocolMap.set('MAP','1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5')
  protocolMap.set('METANET', 'meta')
  protocolMap.set('AIP','15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva')

  
  let querySchema = {
    'B': [
      { 'content': ['string', 'binary'] },
      { 'content-type': 'string' },
      { 'encoding': 'string' }, // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
      { 'filename': 'string' }
    ],
    'MAP': [
      { 'cmd': 'string' },
      [
        { 'key': 'string' },
        { 'val': 'string' }
      ]
    ],
    'METANET': [
      { 'address': 'string'},
      { 'parent': 'string' },
      { 'name': 'string' },
      [ 
        {'kwd': 'string'}
      ]
    ],
    'AIP': [
      { 'algorithm': 'string' },
      { 'address': 'string' },
      { 'signature': 'binary' },
      [
        {'index': 'binary'}
      ]
    ],
    'default': [
      [{'pushdata': 'string'}]
    ]
  }

  // This will become our nicely formatted response object
  let dataObj = {}

  for (let [key, val] of Object.entries(tx)) {
    console.log('key', key, 'val', val)

    if (key === 'out') {
      // loop over the outputs
      for (let out of tx.out) {
        let tape = out.tape

        if (tape.some((cc) => {
          return checkOpFalseOpReturn(cc)
        })) {
          for (let cell_container of tape) {
            // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
            if(checkOpFalseOpReturn(cell_container)) {
              continue
            }
            
            let cell = cell_container.cell
      

            // Get protocol name from prefix
            let protocolName = protocolMap.getKey(cell[0].s) || cell[0].s

            dataObj[protocolName] = {}

            switch (protocolName) {
              case 'MAP':
                let command = cell[1].s

                // Get the MAP command key name from the query schema
                let mapCmdKey = Object.keys(querySchema[protocolName][0])[0]

                // Add the MAP command in the response object
                dataObj[protocolName][mapCmdKey] = command

                // Individual parsing rules for each MAP command
                switch (command) {
                  case 'SET':
                    let last = null
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if ( pushdata_container.i === 0) {
                        continue
                      }
                      let pushdata = pushdata_container.s
                      if (pushdata_container.i % 2 === 0) {
                        // key
                        dataObj[protocolName][pushdata] = ''
                        last = pushdata
                      } else {
                        // value
                        if (!last) { console.warn('malformed MAP syntax. Cannot parse.', last); continue }
                        dataObj[protocolName][last] = pushdata
                      }
                    }      
                  break
                }
              break
              default:
                // Unknown protocol prefix. Keep BOB's cell format
                dataObj[protocolName] = cell
              break
            }
          }
        } else {
          // No OP_RETURN in this outputs
          // ToDo - Keep it
          // dataObj[key] = val
        }
      }
    } else {
      dataObj[key] = val
    }
  }

  return dataObj
}

// Check a cell starts with OP_FALSE OP_RETURN -or- OP_RETURN
function checkOpFalseOpReturn(cc) {
  return (cc.cell[0].op === 0 && cc.cell[1].hasOwnProperty('op') && cc.cell[1].op === 106) || cc.cell[0].op === 106
}

export default bmap