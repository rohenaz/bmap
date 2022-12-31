export type BOOST = {
    hash?: string
    content: string
    bits: number
    diff: number
    metadataHash: string
    time: number
    category: number | string
    additionalData: string // Buffer.from(`{ "foo": 1234, "metadata": "hello"}`, 'utf8').toString('hex')
    userNonce: string // hex string
    tag: string
}

// Field Examples
// additionalData:
// Buffer.from(`{ "foo": 1234, "metadata": "hello"}`, 'utf8').toString('hex')
// category
// Buffer.from('B', 'utf8').toString('hex')
// nonce - a hex encoded utf8 encoded number
// Buffer.from(Math.random(999999999), 'utf8').toString('hex')

// TODO: not sure if difficulty is "diff" or "difficulty" its references both ways in docs
