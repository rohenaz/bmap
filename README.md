# bmap
Bmap is a BOB parser for `B | MAP` OP_RETURN protocols. Bmap processes transaction outputs and transforms them into self descriptive js objects based on the OP_RETURN protocols it discovers in the data.

BMAPjs supports supports B, MAP, AIP, HAIP, and METANET protocols in both BOB and MOM formats. Support for more formats is planed.

# Note 

Previous versions of bmap used [TXO](https://github.com/interplanaria/txo) formatted transactions
# Pre-requisites
  - Read [B Protocol](https://github.com/unwriter/B)
  - Read [MAP protocol](https://github.com/rohenaz/MAP)
  - Read [AIP protocol](https://github.com/BitcoinFiles/AUTHOR_IDENTITY_PROTOCOL)
  - Read [HAIP protocol](https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md)
  - Read [Metanet protocol](https://nchain.com/app/uploads/2019/06/The-Metanet-Technical-Summary-v1.0.pdf)
  - Read [Su protocol]()
  
  - Using [MOM](https://github.com/interplanaria/mom) enables additional fields for MetaNet protocol transactions
  - A [BOB](https://github.com/interplanaria/bob) formatted transaction. This is the format used by popular [planaria APIs](https://github.com/interplanaria) Tx
  - npm

# Install

```
npm install bmapjs
```

or for using it in the browser:
```
<script src="bmap.js"></script>
```

# Importing
using node:
```js
require('bmapjs')
```

or in the browser:

```js
let prom = import('./bmap.js')
prom.then((bmap) => {
  .. use it here ...
})

```

# Usage
Turn a BOB or MOM formatted transaction into a BMAP tx. It will throw an error if the transaction is malformed.
```js
try {
  bmap.TransformTx(bob_or_mom_tx)
} catch (e) {
  console.error(e)
}

```

After transforming a transaction it will have a key for each protocol used in the transaction:
```json
{
  "AIP": { ... },
  "B": { ... },
  "MAP": { ... },
  "1SymRe7erxM46GByucUWnB9fEEMgo7spd": { ... }
}
```

There is a collection of sample transactions listed in the examples.html page.

# B support
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

# MAP support
example:
```json
{
  "MAP":  {
    "cmd": "SET",
    "app": "metalens",
    "type": "comment",
    "url": "https://twitter.com/",
    "user": "Satchmo"
  }
}
```

# MetaNet Support

bmap will include metanet relavent keys from MOM Planaria when available. When not available (BOB data source), bmap will provide the "parent" and "node" keys only. These will be provided in the same data structure as MOM Planaria.

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

# Bitkey support

```json
	"BITKEY": {
		"bitkey_signature": "SDQwdkEyVnN0emtIY2VnYXJVTm1WUm1wQ3ZLUVBSdXR4KzczdG9Jcm4vMWxRWU9aQ1lRQ0cyaFhBdHRQRFl0L0h2KzE0dWtUZ25MWVh1UUNsTFp6blBnPQ==",
		"user_signature": "SUxzZWpEWXVwMlBEYjltdnJET1dSaWxMSy9Xd1BtVlRiazFOWnZnUHZiczRWVzYyenM1MFY5c3E0akdrQm8yeDlLOG9jSE5acTlLd1hRMkREV0V2OGNjPQ==",
		"paymail": "oktets@moneybutton.com",
		"pubkey": "0210fdec2372cb65dd9d6adb982101d9cdbb407d9f2e2d5be31cd9d59a561ccacf"
  }
```

# Bitcom support

BITCOM commands 
`useradd, echo, su, route`

```json
{
  "BITCOM": [
    "$",
    "echo",
    "delphe_test2",
    "to",
    "name"
  ]
}
```

# Unknown Protocols

When an unknown protocol is encountered, bmap will keep the incoming format and use the protocol prefix as the key name on the response object:
```json
{
  "1SymRe7erxM46GByucUWnB9fEEMgo7spd": [
    {
      "b": "MVN5bVJlN2VyeE00NkdCeXVjVVduQjlmRUVNZ283c3Bk",
      "s": "1SymRe7erxM46GByucUWnB9fEEMgo7spd",
      "ii": 2,
      "i": 0
    },
    {
      "b": "aHR0cHM6Ly9zYXRvc2hpZG9vZGxlcy5jb20vc3B2LWlzaC8=",
      "s": "https://satoshidoodles.com/spv-ish/",
      "ii": 3,
      "i": 1
    }
  ]
}
```

# Roadmap
- [x] B support
- [x] MAP v1 support
- [x] Bitcom support
- [x] Bitkey support
- [ ] MAP v2 support
- [x] AIP support
- [x] HAIP support
- [x] MetaNet support
- [ ] C support
- [ ] D Support
- [ ] BCAT support
- [x] SymRe support
- [x] RON support
