# BMAPjs

BMAPjs is a BOB parser for `B | MAP` OP_RETURN protocols. It processes transaction outputs and transforms them into self
descriptive js objects based on the OP_RETURN protocols it discovers in the data.

It supports B, MAP, AIP, METANET and a list of other popular protocols It ingests structured JSON objects in
both [BOB](https://bob.planaria.network/) and [MOM](https://mom.planaria.network/) formats.

# Pre-requisites

-   A [BOB](https://bob.planaria.network/) formatted transaction. This is the format used by
    popular [planaria APIs](https://github.com/interplanaria)
-   npm

# Install

```
npm install bmapjs
```

or

```
yarn add bmapjs
```

# Importing

using node:

```js
var BMAP = require('bmapjs')
```

or

```js
import { TransformTx } from 'bmapjs'
```

or in the browser:

```html
<script src="bmap.js"></script>
```

# Other languages

[Go](https://github.com/rohenaz/go-bmap)

# Demo

[Examples](https://bmapjs.firebaseapp.com)

# Usage

Turn a BOB or MOM formatted transaction into a BMAP tx. It will throw an error if the transaction is malformed.

in node:

```js
try {
    const bmapTx = await bmap.TransformTx(bob_or_mom_tx_object)
} catch (e) {
    console.error(e)
}
```

or in the browser:

```js
const bmapTx = await window.bmap.TransformTx(bob_or_mom_tx_object)
```

After transforming a transaction it will have a key for each protocol used in the transaction:

```json
{
  "AIP": {
    ...
  },
  "B": {
    ...
  },
  "BAP": {
    ...
  },
  "MAP": {
    ...
  },
  "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo": {
    ...
  }
}
```

If you want to use a raw transaction, first transform it using [BPU](https://github.com/interplanaria/bpu), then use
bmapjs on the output.

There is a collection of sample transactions listed in the examples.html page.

## Adding other protocols

Not all protocols available in `bmap.js` are active by default. These are less used or older protocols, but they can be easily added at runtime.

```javascript
import BMAP from 'bmapjs'
import { RON } from 'bmapjs/dist/protocols/ron.js'

const bmap = new BMAP()
bmap.addProtocolHandler(RON)
```

The protocols that are available, but not active by default are `BITCOM`, `BITKEY`, `BITPIC`, `RON` and `SYMRE`.

## Extending the BMAP class

You can also easily add new handlers for processing any type of bitcom output.

```javascript
import BMAP from 'bmapjs'

const bmap = new BMAP()
const querySchema = {} // optional
const handler = function (dataObj, cell, tape, tx) {
    // dataObj is the object that all data is added to
    // cell is the current cell being processed
    // tape is the tape the cell is in
    // tx is the total transaction
}
// addProtocolHandler(name, address, querySchema, handler);
bmap.addProtocolHandler({
    name: 'TEST',
    address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
    querySchema,
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
import BMAP from 'bmapjs';
import { bmapQuerySchemaHandler } from './utils';

const bmap = new BMAP();
const querySchema = {
  { type: 'string' },
  { hash: 'string' },
  { sequence: 'string' },
};

const handler = bmapQuerySchemaHandler.bind(this, 'TEST', querySchema);
// or
const handler2 = function(dataObj, cell, tape, tx) {
  bmapQuerySchemaHandler('TEST', querySchema, dataObj, cell, tape, tx);
}

// addProtocolHandler(name, address, querySchema, handler);
bmap.addProtocolHandler({
  name: 'TEST',
  address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
  querySchema,
  handler,
});

bmap.transformTx(bob_or_mom_tx);
```

See the current protocol handlers in `src/protocols/` for examples on how to create your own handler.

# Additional Documentation

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
    "BAP": {
        "type": "ATTEST",
        "hash": "cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5",
        "sequence": "0"
    }
}
```

## MAP

example:

```json
{
    "MAP": {
        "cmd": "SET",
        "app": "metalens",
        "type": "comment",
        "url": "https://twitter.com/",
        "user": "Satchmo"
    }
}
```

## MetaNet

Response will include metanet relavent keys from MOM Planaria when available. When not available (BOB data source), bmap
will provide the "parent" and "node" keys only. These will be provided in the same data structure as MOM Planaria.

#### BOB Data Source

```json
{
    "METANET": {
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
}
```

#### MOM Data Source

```json
{
    "METANET": {
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
}
```

## Bitkey

`bitkey_signature` and `user_signature` are in base64 encoded binary format

```json
{
    "BITKEY": {
        "bitkey_signature": "SDQwdkEyVnN0emtIY2VnYXJVTm1WUm1wQ3ZLUVBSdXR4KzczdG9Jcm4vMWxRWU9aQ1lRQ0cyaFhBdHRQRFl0L0h2KzE0dWtUZ25MWVh1UUNsTFp6blBnPQ==",
        "user_signature": "SUxzZWpEWXVwMlBEYjltdnJET1dSaWxMSy9Xd1BtVlRiazFOWnZnUHZiczRWVzYyenM1MFY5c3E0akdrQm8yeDlLOG9jSE5acTlLd1hRMkREV0V2OGNjPQ==",
        "paymail": "oktets@moneybutton.com",
        "pubkey": "0210fdec2372cb65dd9d6adb982101d9cdbb407d9f2e2d5be31cd9d59a561ccacf"
    }
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
    "BITPIC": {
        "paymail": "stockrt@moneybutton.com",
        "pubkey": "AoAgqoMucQcdi7kyLHhN4y1HVCPMyVpcPrj75AAoFo/6",
        "sig": "SVBJVzU3NnplSnUzODlKNTVPT0RSNjVvSlhDdldYTDY0SWtEa1dOQzNkZ0xBdGZGVUx0MlYzWW1OWkNUQTBsUlV1M2dJMlIrRkswT1JlUnl1Vm9SQjVZPQ=="
    }
}
```

## Unknown Protocols

When an unknown protocol is encountered, bmap will keep the incoming format and use the protocol prefix as the key name
on the response object:

```json
{
    "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo": [
        {
            "b": "MU1BRWVwemdXZWk2ekttYnNkUVN5OHdBWUw1eVNEaXpLbw==",
            "s": "1MAEepzgWei6zKmbsdQSy8wAYL5ySDizKo",
            "ii": 7,
            "i": 0
        },
        {
            "b": "bWF0dGVyLWNyZWF0ZS1wb3N0",
            "s": "matter-create-post",
            "ii": 8,
            "i": 1
        },
        {
            "b": "djE=",
            "s": "v1",
            "ii": 9,
            "i": 2
        },
        {
            "b": "aGVsbG8td29ybGQtcG9zdA==",
            "s": "hello-world-post",
            "ii": 10,
            "i": 3
        }
    ]
}
```

# Support Checklist

-   [x] AIP
-   [x] AIP validation
-   [x] B
-   [x] BAP
-   [ ] BCAT
-   [x] Bitcom
-   [x] Bitkey
-   [x] Bitpic
-   [ ] D
-   [x] HAIP
-   [ ] HAIP validation
-   [x] MAP v1
-   [ ] MAP v2
-   [x] MetaNet
-   [x] PSP
-   [x] RON
-   [x] SymRe

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

```

```
