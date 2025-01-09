# BMAPjs

[![npm](https://img.shields.io/npm/v/bmapjs.svg)](https://www.npmjs.com/package/bmapjs)
[![downloads](https://img.shields.io/npm/dt/bmapjs.svg)](https://www.npmjs.com/package/bmap)
![GitHub](https://img.shields.io/github/license/rohenaz/bmap)

BMAPjs is a transaction parser for Bitcoin data protocols like B, MAP, BAP, 1Sat Ordinals, METANET and AIP/HAIP. Supports multiple outputs, signature verification, and multiple instances in a single OP_RETURN. It also has support for some Script based protocols like [21e8](https://21e8.network).

It processes BOB formatted transactions for `B | MAP` OP_RETURN protocols. It processes transaction outputs and transforms them into self-descriptive TypeScript objects based on the OP_RETURN protocols it discovers in the data.

It supports B, MAP, AIP, METANET and a list of other popular protocols. It ingests structured JSON objects in [BOB](https://bob.planaria.network/) format.

It is written in TypeScript and can be used both as an ESM module or in the browser as CommonJS via script tag. See the `dist` folder for compiled outputs.

## Why this exists

BOB format is a great way to express Bitcoin transaction outputs, especially those containing data protocols, but there are some problems. For example, each field has multiple options to choose from, be it a base64 encoded binary representation in the b field, a string value in the s field, or a hex value in the h field. Depending on the protocol and the specific field you might choose one or another. This means you have to have a full understanding of the protocol you're trying to use. That's where bmapjs comes in. It can recognize many protocols, structure the data according to their individual protocols, and provide an easy to use BMAP transaction object with no mysteries about the data.

# Pre-requisites

- A [BOB](https://bob.planaria.network/) formatted transaction. If you only have a raw transaction you can convert to BOB using [BPU](https://github.com/interplanaria/bpu). More information [here](#note-convert-raw-tx-to-bob-using-bpu)
- [Bun](https://bun.sh) (for development)

# Install

```bash
bun add bmapjs
```

or

```bash
npm install bmapjs
```

# Development Setup

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Lint
bun run lint

# Format
bun run format
```

# Importing

```js
import { BMAP, TransformTx } from 'bmapjs'
```

# Using in the browser

You can use bmapjs in the browser by pointing to the ES module in the dist folder:

```html
<script type="module">
    import { BMAP, TransformTx } from './dist/bmap.es.js'
    // more code here
</script>
```

For legacy support, a CommonJS version is also available:

```html
<script src="dist/bmap.cjs"></script>
```

# Other languages

[Go](https://github.com/rohenaz/go-bmap)

# Usage

Turn a BOB formatted transaction into a BMAP tx. It will throw an error if the transaction is malformed.

```js
import { TransformTx } from 'bmapjs'

try {
    const bmapTx = await TransformTx(bob_tx_object)
} catch (e) {
    console.error(e)
}
```

## BMAP (Transaction object)

After transforming the object will contain a key for each protocol found within the transaction. Each value will be an array. Most of the time the array will have only one value indicating the protocol was detected only once. However, in some cases where protocols will be used multiple times in the same transaction, the array will contain one object for each protocol instance detected.

```typescript
interface BmapTx {
  tx: {
    h: string;  // Transaction hash
    r: string;  // Raw transaction
  };
  blk?: {
    i: number;  // Block index
    h: string;  // Block hash
    t: number;  // Block time
  };
  in: Input[];  // Transaction inputs
  out: Output[];  // Transaction outputs
  
  // Protocol data
  AIP?: AIP[];  // Identity protocol
  B?: B[];      // Data protocol
  BAP?: BAP[];  // Bitcoin Attestation Protocol
  MAP?: MAP[];  // Magic Attribute Protocol
  ORD?: ORD[];  // 1Sat Ordinals
  "21E8"?: _21E8[];  // Proof of work protocol
  BITCOM?: BITCOM[];
  BITKEY?: BITKEY[];
  BITPIC?: BITPIC[];
  METANET?: METANET[];
  RON?: RON[];
  SYMRE?: SYMRE[];
  HAIP?: HAIP[];
}
```

## Adding other protocols

Not all protocols available in `bmap.js` are active by default. These are less used or older protocols, but they can be easily added at runtime.

```typescript
import { BMAP, RON } from 'bmapjs'

const bmap = new BMAP()
bmap.addProtocolHandler(RON)
```

The protocols that are available but not active by default are `BITCOM`, `BITKEY`, `BITPIC`, `RON` and `SYMRE`.

## Extending the BMAP class

You can also easily add new handlers for processing any type of bitcom output.

```typescript
import { BMAP } from 'bmapjs'
import type { Protocol, SchemaField } from 'bmapjs'

const bmap = new BMAP()
const opReturnSchema: SchemaField[] = [{}] // optional

const handler: Protocol['handler'] = ({ dataObj, cell, tape, tx }) => {
    // dataObj is the object that all data is added to
    // cell is the current cell being processed
    // tape is the tape the cell is in
    // tx is the total transaction
}

bmap.addProtocolHandler({
    name: 'TEST',
    address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
    opReturnSchema,
    handler,
})

await bmap.transformTx(bob_tx)
```

You can also use the default protocol handler with a well-defined schema to make it even easier:

```typescript
import { BMAP } from 'bmapjs'
import { bmapOpReturnSchemaHandler } from './utils'
import type { SchemaField } from 'bmapjs'

const opReturnSchema: SchemaField[] = [
  { type: 'string' },
  { hash: 'string' },
  { sequence: 'string' },
]

const handler = ({ dataObj, cell, tape, tx }) => {
  bmapOpReturnSchemaHandler('TEST', opReturnSchema, dataObj, cell, tx)
}

bmap.addProtocolHandler({
  name: 'TEST',
  address: '1FJrobAYoQ6qSVJH7yiawfaUmZ3G13q9iJ',
  opReturnSchema,
  handler,
})
```

# License

Open BSV
