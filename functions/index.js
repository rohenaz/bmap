import { allProtocols, TransformTx } from 'bmapjs'
import * as functions from 'firebase-functions'
import { createRequire } from 'module'
import fetch from 'node-fetch'

const require = createRequire(import.meta.url)

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin')
admin.initializeApp()

const cors = require('cors-async')({ origin: true })
const BPU = require('bpu')

export const decode = functions.https.onRequest(async (req, res) => {
    await cors(req, res)
    let parts = req.url.split('/').splice(1)
    const tx = parts[1]
    const format = parts[2]
    console.log('tx', tx)

    // fetch the tx
    try {
        if (format === 'raw') {
            let rawTx = await rawTxFromTxid(tx)
            res.status(200).send(rawTx)
            return
        } else if (format === 'json') {
            let json = await jsonFromTxid(tx)
            res.status(200).send(json)
            return
        }

        let bob = await bobFromTxid(tx)
        console.log('bob', bob.out[0])

        // Transform from BOB to BMAP
        console.log('loading protocols', allProtocols)
        let decoded = await TransformTx(
            bob,
            allProtocols.map((p) => p.name)
        )
        console.log('bmap', decoded)
        // Response (segment and formatting optional)
        res.status(200).send(
            format === 'bob'
                ? bob
                : format === 'bmap'
                ? decoded
                : format && decoded.hasOwnProperty(format)
                ? decoded[format]
                : format && format.length
                ? `Key ${format} not found in tx`
                : `<pre>${JSON.stringify(decoded, undefined, 2)}</pre>`
        )
    } catch (e) {
        res.status(400).send('Failed to process tx ' + e)
    }
})

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

const bobFromPlanariaByTxid = async (txid) => {
    // // The query we constructed from step 2.
    let query = {
        v: 3,
        q: {
            find: {
                'tx.h': txid,
            },
            sort: {
                'blk.i': -1,
                i: -1,
            },
            limit: 1,
        },
    }

    // Turn the query into base64 encoded string.
    let b64 = Buffer.from(JSON.stringify(query)).toString('base64')
    let url = `https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/${b64}`
    // Attach planaria API KEY as header
    let header = {
        headers: { key: '14yHvrKQEosfAbkoXcEwY6wSvxNKteFbzU' },
    }
    try {
        let res = await fetch(url, header)
        let j = await res.json()
        return j.c.concat(j.u)[0]
    } catch (e) {
        throw e
    }
}

const rawTxFromTxid = async (txid) => {
    // get rawtx for txid
    let url = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid + '/hex'

    console.log('hitting', url)
    try {
        // let res = await fetch(url, header)
        let res = await fetch(url)
        return await res.text()
    } catch (e) {
        throw e
    }
}

const jsonFromTxid = async (txid) => {
    // get rawtx for txid
    let url = 'https://api.whatsonchain.com/v1/bsv/main/tx/' + txid

    console.log('hitting', url)
    try {
        // let res = await fetch(url, header)
        let res = await fetch(url)
        return await res.json()
    } catch (e) {
        throw e
    }
}

const bobFromTxid = async (txid) => {
    let rawtx = await rawTxFromTxid(txid)
    // Transform using BPU
    try {
        return await bobFromRawTx(rawtx)
    } catch (e) {
        console.log(
            'Failed to ger rawtx from whatsonchain for.',
            txid,
            'Failing back to BOB planaria.',
            e
        )
        return await bobFromPlanariaByTxid(txid)
    }
}
