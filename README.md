# BMAPjs

[![npm](https://img.shields.io/npm/v/bmapjs.svg)](https://www.npmjs.com/package/bmapjs)
[![downloads](https://img.shields.io/npm/dt/bmapjs.svg)](https://www.npmjs.com/package/bmap)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![GitHub](https://img.shields.io/github/license/rohenaz/bmap)

BMAPjs is a transaction parser for Bitcoin data protocols like B, MAP, BAP, METANET and AIP/HAIP. Supports multiple outputs, signature verification, and multiple instances in a single OP_RETURN. It also has support for some Script based protocols like [Boost POW](https://pow.co) and [21e8](https://21e8.network)

It processes BOB formatted transactions for `B | MAP` OP_RETURN protocols. It processes transaction outputs and transforms them into self
descriptive js objects based on the OP_RETURN protocols it discovers in the data.

It supports B, MAP, AIP, METANET and a list of other popular protocols It ingests structured JSON objects in
both [BOB](https://bob.planaria.network/) and [MOM](https://mom.planaria.network/) formats.

It is written in typescript and can be used both as an esm module or in the browser as commonjs via script tag. See the `dist` folder for compiled outputs.

## Why this exists

BOB format is a great way to express Bitcoin transaction outputs, especially those containing data protocols, but there are some problems. For example, each field has multiple options to choose from, be it a base64 encoded binary representation in the b field, a string value in the s field, or a hex value in the h field. Depending on the protocol and the specific field you might choose one or another. This means you have to have a full understanding of the protocol you're trying to use. That's where bmapjs comes in. It can recognize many protocols, structure the data according to their individual protocols, and provide an easy to use BMAP transaction object with no mysteries about the data.

# Pre-requisites

-   A [BOB](https://bob.planaria.network/) formatted transaction. If you only have a raw transaction you can convert to BOB using [BPU](https://github.com/interplanaria/bpu). More information [here](#note-convert-raw-tx-to-bob-using-bpu)
-   npm / yarn

# Install

```
npm install bmapjs
```

or

```
yarn add bmapjs
```

# Importing

Yopu can import bmap using require

```js
var { BMAP } = require('bmapjs')
```

or using esm module import

```js
import { BMAP, TransformTx } from 'bmapjs'
```

# Using in the browser

You can also use bmapjs in the browser by pointing to the .cjs file in the dist fodler.

```html
<script src="dist/bmap.cjs"></script>
```

The CJS is by far the largest package since it includes dependencies. It is also possible to import in the browser using the module syntax.

```html
<script src="dist/bmap" type="module">
    import { TransformTx } from 'bmapjs'
    ... more code here
</script>
```

# Other languages

[Go](https://github.com/rohenaz/go-bmap)

# Demo

[Examples](https://bmapjs.firebaseapp.com)

# Usage

Turn a BOB or MOM formatted transaction into a BMAP tx. It will throw an error if the transaction is malformed.

in node:

```js
import { TransformTx } from 'bmapjs'

try {
    const bmapTx = await TransformTx(bob_or_mom_tx_object)
} catch (e) {
    console.error(e)
}
```

or in the browser:

```html
<script src="dist/bmap.cjs"></script>
```

`bmap` will be available on the window object

```js
const bmapTx = await bmap.TransformTx(bob_or_mom_tx_object)
```

## BMAP (Transaction object)

After transforming the object will contain a key for each protocol found within the transaction. Each value will be an array. Most of the time the array will have only one value indicating the protocol was detected only once. However, in some cases where protocols will be used multiple times in the same transaction, the array will contain one object for each protocol instance detected.

```json
{
  "tx": {
    "h": [TRANSACTION HASH],
    "r": [RAW TRANSACTION]
  },
  "blk" {
    "i": [BLOCK INDEX],
    "h": [BLOCK HASH],
    "t": [BLOCK TIME]
  },
  "in": [
    INPUT1,
    INPUT2,
    INPUT3,
    ...
  ],
  "out": [
    OUTPUT1,
    OUTPUT2,
    OUTPUT3,
    ...
  ],
  "coinbase": [COINBASE]

  // array of transaction inputs
  in: [{
    // index
    i: 0,
    e: {
        // transaction
    }
  }],
  // transaction outputs
  out: [ ...],
  //
  "AIP": [{
    ...
  }],
  "B": [{
    // B protocol - output 1
    // ...
  }, {
    // B protocol - output 2
    // ...
  }],
  "BAP": [{
    // Bitcoin Attestation Protocol
    // ...
  }],
  "MAP": [{
    // Magic Attribute Protocol - output 1
    // ...
  }, {
    // Magic Attribute Protocol - output 2
    // ...
  }],
  "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo": [{
    ...
  }]
}
```

If you want to use a raw transaction as your input, first transform it using [BPU](https://github.com/interplanaria/bpu), then use
bmapjs on the output. More information [here](#note-convert-raw-tx-to-bob-using-bpu).

## Adding other protocols

Not all protocols available in `bmap.js` are active by default. These are less used or older protocols, but they can be easily added at runtime.

```javascript
import { BMAP, RON } from 'bmapjs'

const bmap = new BMAP()
bmap.addProtocolHandler(RON)
```

The protocols that are available, but not active by default are `BITCOM`, `BITKEY`, `BITPIC`, `RON` and `SYMRE`.

## Extending the BMAP class

You can also easily add new handlers for processing any type of bitcom output.

```javascript
import { BMAP } from 'bmapjs'

const bmap = new BMAP()
const opReturnSchema = [{}] // optional
const handler = function (dataObj, cell, tape, tx) {
    // dataObj is the object that all data is added to
    // cell is the current cell being processed
    // tape is the tape the cell is in
    // tx is the total transaction
}
// addProtocolHandler(name, address, opReturnSchema, handler);
bmap.addProtocolHandler({
    name: 'TEST',
    address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
    opReturnSchema,
    handler,
})

bmap.transformTx(bob_or_mom_tx)
```

You can also use the default protocol handler, with a well defined query schema to make it even easier:

In this example the OP_RETURN has 4 fields (the first is the bitcom address and is not included in the definition).

```
OP_FALSE OP_RETURN
  1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ
  <type>
  <hash>
  <sequence>
```

```javascript
import { BMAP } from 'bmapjs';
import { bmapOpReturnSchemaHandler } from './utils';

const bmap = new BMAP();
const opReturnSchema = [{
  { type: 'string' },
  { hash: 'string' },
  { sequence: 'string' },
}];

const handler = bmapOpReturnSchemaHandler.bind(this, 'TEST', opReturnSchema);
// or
const handler2 = function(dataObj, cell, tape, tx) {
  bmapOpReturnSchemaHandler('TEST', opReturnSchema, dataObj, cell, tape, tx);
}

// addProtocolHandler(name, address, opReturnSchema, handler);
bmap.addProtocolHandler({
  name: 'TEST',
  address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
  opReturnSchema,
  handler,
});

bmap.transformTx(bob_or_mom_tx);
```

See the current protocol handlers in `src/protocols/` for examples on how to create your own handler.

# Change log

## v0.4

There are several big changes in 0.4

-   Library is now typescript based
-   Using Parcel to build for multiple targets. bmap.cjs is a commonjs library for script tag imports. bmap.js is an esm module.
-   Breaking Change: Protocol data is now always in an array. For example bmapTx.MAP used to be an array only if more than one MAP instance was found in the transaction. Now it will always be an array and have only one element if there is only one match.
-   Exports have changed. Update your import statements.

    <br />
    <br />

Import syntax has changed from:

```js
import BMAP from 'bmapjs'
```

to

```js
import { BMAP } from 'bmapjs'
```

## Protocols

-   [B](https://github.com/unwriter/B)
-   [MAP](https://github.com/rohenaz/MAP)
-   [BAP](https://github.com/icellan/BAP)
-   [AIP](https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL)
-   [HAIP](https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md)
-   [Metanet](https://nchain.com/app/uploads/2019/06/The-Metanet-Technical-Summary-v1.0.pdf)

## Planarias

-   [BOB](https://bob.planaria.network/)
-   [BMAP](https://b.map.sv/) (a public BMAPjs pre-formatted planaria indexing MAP, BITPIC, BITKEY, transactions)
-   [MOM](https://mom.planaria.network/) (enables additional fields for MetaNet)

# Example Responses

## B

example:

```json
{
    "B": {
        "content": "{\"name\":\"myname\",\"bio\":\"<p>bio</p>\\n\",\"logo\":\"\"}",
        "content-type": "application/json",
        "encoding": "utf-8",
        "filename": "matter.profile.json"
    }
}
```

## BAP

example:

```json
{
    "BAP": [
        {
            "type": "ATTEST",
            "hash": "cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5",
            "sequence": "0"
        }
    ]
}
```

## MAP

example:

```json
{
    "MAP": [
        {
            "cmd": "SET",
            "app": "metalens",
            "type": "comment",
            "url": "https://twitter.com/",
            "user": "Satchmo"
        }
    ]
}
```

## MetaNet

Response will include metanet relavent keys from MOM Planaria when available. When not available (BOB data source), bmap
will provide the "parent" and "node" keys only. These will be provided in the same data structure as MOM Planaria.

#### BOB Data Source

```json
{
    "METANET": [
        {
            "node": {
                "a": "15ZCvDUJ6wG1hoiSyw1ftfiRhpKTVGLMnn",
                "tx": "70bcbe4dc1ff796389e3de4f5f151cff7eb4a172142468a79677c703afd930b9",
                "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            },
            "parent": {
                "a": "15ZCvDUJ6wG1hoiSyw1ftfiRhpKTVGLMnn",
                "tx": "577cc5de372f65e33045745129699139568eb46b2ef09d2ca5bf44a9bcb07c71",
                "id": "59f2e83ac0607d44d764b9040aaa8dd8741e6169444739464f97422055ad001c"
            }
        }
    ]
}
```

#### MOM Data Source

```json
{
    "METANET": [
        {
            "node": {
                "a": "15ZCvDUJ6wG1hoiSyw1ftfiRhpKTVGLMnn",
                "tx": "70bcbe4dc1ff796389e3de4f5f151cff7eb4a172142468a79677c703afd930b9",
                "id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            },
            "parent": {
                "a": "15ZCvDUJ6wG1hoiSyw1ftfiRhpKTVGLMnn",
                "tx": "577cc5de372f65e33045745129699139568eb46b2ef09d2ca5bf44a9bcb07c71",
                "id": "59f2e83ac0607d44d764b9040aaa8dd8741e6169444739464f97422055ad001c"
            },
            "ancestor": [
                {
                    "tx": "06ea0de45680b790d25372bc12b52c7e740e3b10f36d8aabd8b8a31e858a79c2",
                    "id": "9d9fee655e15decf639cf13617cadaf285ff15c5e5c593e1ff24c38c3c6edbcc",
                    "a": "1NXHduuvxtXVgsTyXjm9VrbV7Zy8BZ1JHr"
                },
                {
                    "tx": "59f2e83ac0607d44d764b9040aaa8dd8741e6169444739464f97422055ad001c",
                    "id": "44807057a5235e022477d7c75425132d31b0a53f86b9a98cd21dd681c42945f5",
                    "a": "1j161kyQh6jxWxFySch9Kk6YRt6ZK31jA"
                }
            ],
            "child": [],
            "head": true
        }
    ]
}
```

## Bitkey

`bitkey_signature` and `user_signature` are in base64 encoded binary format

```json
{
    "BITKEY": [
        {
            "bitkey_signature": "SDQwdkEyVnN0emtIY2VnYXJVTm1WUm1wQ3ZLUVBSdXR4KzczdG9Jcm4vMWxRWU9aQ1lRQ0cyaFhBdHRQRFl0L0h2KzE0dWtUZ25MWVh1UUNsTFp6blBnPQ==",
            "user_signature": "SUxzZWpEWXVwMlBEYjltdnJET1dSaWxMSy9Xd1BtVlRiazFOWnZnUHZiczRWVzYyenM1MFY5c3E0akdrQm8yeDlLOG9jSE5acTlLd1hRMkREV0V2OGNjPQ==",
            "paymail": "oktets@moneybutton.com",
            "pubkey": "0210fdec2372cb65dd9d6adb982101d9cdbb407d9f2e2d5be31cd9d59a561ccacf"
        }
    ]
}
```

## Bitcom

BITCOM commands
`useradd, echo, su, route`

```json
{
    "BITCOM": ["$", "echo", "delphe_test2", "to", "name"]
}
```

## Bitpic

`pubkey` and `sig` fields are returned in base64 encoded binary format

```json
{
    "BITPIC": [
        {
            "paymail": "stockrt@moneybutton.com",
            "pubkey": "AoAgqoMucQcdi7kyLHhN4y1HVCPMyVpcPrj75AAoFo/6",
            "sig": "SVBJVzU3NnplSnUzODlKNTVPT0RSNjVvSlhDdldYTDY0SWtEa1dOQzNkZ0xBdGZGVUx0MlYzWW1OWkNUQTBsUlV1M2dJMlIrRkswT1JlUnl1Vm9SQjVZPQ=="
        }
    ]
}
```

## Unknown Protocols

When an unknown protocol is encountered, bmap will keep the incoming format and use the protocol prefix as the key name
on the response object:

```json
{
    "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo": [
        [
            {
                "b": "MU1BRWVwemdXZWk2ekttYnNkUVN5OHdBWUw1eVNEaXpLbw==",
                "s": "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo",
                "ii": 7,
                "i": 0
            }
        ],
        [
            {
                "b": "bWF0dGVyLWNyZWF0ZS1wb3N0",
                "s": "matter-create-post",
                "ii": 8,
                "i": 1
            }
        ],
        [
            {
                "b": "djE=",
                "s": "v1",
                "ii": 9,
                "i": 2
            }
        ],
        [
            {
                "b": "aGVsbG8td29ybGQtcG9zdA==",
                "s": "hello-world-post",
                "ii": 10,
                "i": 3
            }
        ]
    ]
}
```

# Support Checklist

-   [x] 21E8
-   [x] AIP
-   [x] AIP validation
-   [x] B
-   [x] BAP
-   [ ] BCAT
-   [x] Bitcom
-   [ ] BITCOM-HASHED (Relay Paymail Signatures)
-   [x] Bitkey
-   [x] Bitpic
-   [ ] Bitpic validation
-   [x] BOOST
-   [ ] D
-   [x] HAIP
-   [ ] HAIP validation
-   [x] MAP v1
-   [ ] MAP v2
-   [x] MetaNet
-   [ ] ORDER LOCK
-   [x] PSP
-   [x] RON
-   [x] SymRe

### Known Issues

    - Issue validating Twetch signatures with the AIP package (they use a slightly different signing scheme)
    - HAIP validation is failing as of v0.4

#### Note: TXO Format Deprecation

Beginning with v0.2.0, bmapjs uses BOB as the source format for transaction processing. The previous versions of bmap
used [TXO](https://github.com/interplanaria/txo) formatted transactions. To use bmapjs with TXO data, use v0.1.5.

You can also use [BPU](https://github.com/interplanaria/bpu) to get a BOB format tx from a raw tx, and then parse it
with bmapjs v0.2.0 or higher:

```js
const BPU = require('bpu')
const BMAP = require('bmapjs')
  // 'rawtx' is a raw transaction string
  (async function () {
    let bob = await BPU.parse({
      tx: { r: rawtx }
    });
    const bmapjs = new BMAP();
    let bmap = bmapjs.TransformTx(bob);
  ...
  })()
```

### Note: Convert raw tx to BOB using BPU

bmapjs is a BOB formatted transaction processor. If you need to convert from a raw transaction, you can use the BPU package and pass the output in to bmap.TransformTx.

Raw Tx to Bob example:

```js
const bobFromRawTx = async (rawtx) => {
    return await BPU.parse({
        tx: { r: rawtx },
        split: [
            {
                token: { op: 106 },
                include: 'l',
            },
            {
                token: { op: 0 },
                include: 'l',
            },
            {
                token: { s: '|' },
            },
        ],
    })
}
```

and use it like this

```js
const bobTx = await bobFromRawTx(ctx.transaction)
const bmapTx = await TransformTx(bobTx)
```
