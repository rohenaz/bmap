const bmap = {}

Map.prototype.getKey = function (searchValue) {
  for (let [key, value] of this.entries()) {
    if (value === searchValue)
      return key
  }
  return null
}

// Takes a BOB formatted op_return transaction
bmap.TransformTx = async (tx) => {
  if (!tx || !tx.hasOwnProperty('in') || !tx.hasOwnProperty('out')) {
    throw new Error('Cant process tx', tx)
  }

  let protocolMap = new Map()
  protocolMap.set('B','19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut')
  protocolMap.set('MAP','1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5')
  protocolMap.set('METANET', 'meta')
  protocolMap.set('AIP','15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva')

  let encodingMap = new Map()
  encodingMap.set('utf8', 'string')
  encodingMap.set('text', 'string') // invalid but people use it :(
  encodingMap.set('gzip', 'binary') // invalid but people use it :(
  encodingMap.set('image/png', 'binary')
  encodingMap.set('image/jpeg', 'binary')
  
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
      { 'name': 'string' }
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
              case 'AIP':
                console.log('AIP')
                dataObj[protocolName] = cell
              break;
              case 'B': 
                // loop over the schema
                for (let [idx, schemaField] of Object.entries(querySchema.B)) {
                  let x = parseInt(idx)
                  let bField = Object.keys(schemaField)[0]
                  let schemaEncoding = Object.values(schemaField)[0]
                  if (bField === 'content') {
                    // If the encoding is ommitted, try to infer from content-type instead of breaking
                    if (!cell[3]) {
                      schemaEncoding = encodingMap.get(cell[2].s)
                      if (!schemaEncoding) {
                        console.warn('Problem inferring encoding. Malformed B data.', cell)
                        break
                      } else {
                        // add the missing encoding field
                        cell.push({ s: schemaEncoding === 'string' ? 'utf8' : 'binary' })
                      }
                    } else {
                      schemaEncoding = cell[3] && cell[3].s ? encodingMap.get(cell[3].s.replace('-','').toLowerCase()) : null
                    }
                  }


                  // Sometimes filename is not used
                  if (bField === 'filename' && !cell[x + 1]) {
                    // filename ommitted
                    continue
                  }

                  // check for malformed syntax
                  if (!cell.hasOwnProperty(x + 1)) {
                    console.warn('malformed B syntax', cell)
                    continue
                  }

                  // set field value from either s, b, ls, or lb depending on encoding and availability
                  let correctValue = schemaEncoding === 'string' ? (cell[x + 1].hasOwnProperty('s') ? cell[x + 1].s : cell[x + 1].ls) : (cell[x + 1].hasOwnProperty('b') ? cell[x + 1].b : cell[x + 1].lb)
                  dataObj[protocolName][bField] = correctValue
                  
                }
                // dataObj[protocolName]
              break;
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
                      if (pushdata_container.i === 0 || pushdata_container.i === 1) {
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
              case 'METANET':
                // For now, we just copy from MOM keys later if available, or keep BOB format

                // Described this node
                // Calculate the node ID
                let buf = new ArrayBuffer(tx.in[0].e.a + tx.in[0].e.h)
                let digest = await crypto.subtle.digest('SHA-256', buf)
                let id = buf2hex(digest)                

                let node = {
                  a: cell[1].s,
                  tx: tx.tx.h,
                  id: id,
                }

                // Parent node
                let parent = {
                  a: cell[1].s,
                  tx: tx.in[0].e.h,
                  id: cell[2].s
                }

                dataObj[protocolName] = {}
                dataObj[protocolName] = {
                  node: node,
                  parent: parent
                }                              
              break;
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
    } else if (key === 'in') {
      dataObj[key] = val.map(v => {
        let r = Object.assign({}, v)
        delete r.tape
        return r
      })
    } else {
      dataObj[key] = val
    }
  }


  // If this is a MOM planaria it will have metanet keys available
  if (dataObj.hasOwnProperty('METANET') && tx.hasOwnProperty('parent')) {
    
    dataObj.METANET['ancestor'] = tx.ancestor
    delete dataObj.ancestor
    dataObj.METANET['child'] = tx.child
    delete dataObj.child

    // remove parent and node from root level for (MOM data)
    delete dataObj.parent
    delete dataObj.node

    dataObj.METANET['head'] = tx.head
    delete dataObj.head
  }
  return dataObj
}

// Check a cell starts with OP_FALSE OP_RETURN -or- OP_RETURN
function checkOpFalseOpReturn(cc) {
  return (cc.cell[0].op === 0 && cc.cell[1].hasOwnProperty('op') && cc.cell[1].op === 106) || cc.cell[0].op === 106
}


// ArrayBuffer to hex string
function buf2hex(buffer) { 
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


export default bmap