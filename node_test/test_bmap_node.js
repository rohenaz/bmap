const bmap = require('bmapjs')
const fetch = require('node-fetch')
const btoa = require('btoa')

// B | MAP 
// B | MAP | AIP
const query = {
  "v": 3,
  "q": {
    "find": {
      "tx.h": {
        "$in": ["0272e1b230dfe2603a77469037ad04b32661261ec1453261ded793da0ce297f6", "46991bd7b30c136e41626e998fc04fab8830bb0a8fab8ae8410081426c3d6505", "6645b54733bf630597a89540bc336804d297161113a3290e4285c1bb5e54119b"]
      }
    }
  }
}

// Turn the query into base64 encoded string.
// This is required for accessing a public bitdb node
var b64 = btoa(JSON.stringify(query))
var url = 'https://genesis.bitdb.network/q/1FnauZ9aUH2Bex6JzdcV4eNX7oLSSEbxtN/' + b64

// Attach API KEY as header
var header = {
  headers: { key: '14yHvrKQEosfAbkoXcEwY6wSvxNKteFbzU' }
}

// Make an HTTP request to bmap endpoint
fetch(url, header).then((r) => {
  return r.json()
}).then((r) => {
  for (tx of r.c) {
  // console.log('raw:', r)
  let bmapTx = bmap.TransformTx(tx)
  console.log('result', bmapTx)
  }
})
