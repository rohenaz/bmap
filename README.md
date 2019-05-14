# bmap
Bmap is a TXO parser for `B | MAP` OP_RETURN protocols. Bmap processes transaction outputs and transforms them into self descriptive js objects based on the OP_RETURN protocols it discovers in the data.

While the initial release only supports B and MAP protocols, the idea is to support many more in the future.

# Pre-requisites
  - Read [B Protocol](https://github.com/unwriter/B)
  - Read [MAP protocol](https://github.com/rohenaz/MAP)
  - A [TXO formatted](https://github.com/interplanaria/txo) transaction. This is the format used by popular [planaria APIs](https://github.com/interplanaria)
  - npm

# Install

```
npm install bmapjs
```

# Usage

```js
require('bmapjs')
bmap.TransformTx(txo)
```

# Example
`ToDo`

# Roadmap
- [ ] AIP support
- [ ] C support
- [ ] D Support
- [ ] BCAT support
