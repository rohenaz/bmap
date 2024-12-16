import { allProtocols, TransformTx } from "bmapjs";
import { parse } from "bpu-ts/src/index";
import corsModule from "cors";
import * as functions from "firebase-functions";
import fetch from "node-fetch";
const allowedOrigins = ["http://localhost:80"];
const options = {
	origin: allowedOrigins,
};
const cors = corsModule(options);
// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
initializeApp();

export const decode = functions.https.onRequest(async (req, res) => {
	cors(req, res, async (err) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		const parts = req.url.split("/").splice(1);
		const tx = parts[1];
		const format = parts[2];
		console.log("tx", tx);

		// fetch the tx
		try {
			if (format === "raw") {
				const rawTx = await rawTxFromTxid(tx);
				res.status(200).send(rawTx);
				return;
			}
			if (format === "json") {
				const json = await jsonFromTxid(tx);
				res.status(200).send(json);
				return;
			}

			const bob = await bobFromTxid(tx);
			console.log("bob", bob.out[0]);

			// Transform from BOB to BMAP
			console.log("loading protocols", allProtocols);
			const decoded = await TransformTx(
				bob,
				allProtocols.map((p) => p.name),
			);
			console.log("bmap", decoded);
			// Response (segment and formatting optional)
			res
				.status(200)
				.send(
					format === "bob"
						? bob
						: format === "bmap"
							? decoded
							: format && decoded[format]
								? decoded[format]
								: format?.length
									? `Key ${format} not found in tx`
									: `<pre>${JSON.stringify(decoded, undefined, 2)}</pre>`,
				);
		} catch (e) {
			res.status(400).send(`Failed to process tx ${e}`);
		}
	});
});

const bobFromRawTx = async (rawtx: string) => {
	return await parse({
		tx: { r: rawtx },
		split: [
			{
				token: { op: 106 },
				include: "l",
			},
			{
				token: { s: "|" },
			},
		],
	});
};

const bobFromPlanariaByTxid = async (txid: string) => {
	// // The query we constructed from step 2.
	const query = {
		v: 3,
		q: {
			find: {
				"tx.h": txid,
			},
			sort: {
				"blk.i": -1,
				i: -1,
			},
			limit: 1,
		},
	};

	// Turn the query into base64 encoded string.
	const b64 = Buffer.from(JSON.stringify(query)).toString("base64");
	const url = `https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/${b64}`;
	// Attach planaria API KEY as header
	const header = {
		headers: { key: "14yHvrKQEosfAbkoXcEwY6wSvxNKteFbzU" },
	};

	const res = await fetch(url, header);
	const j = (await res.json()) as any;
	return j.c.concat(j.u)[0];
};

const jsonFromTxid = async (txid: string) => {
	// get rawtx for txid
	const url = `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}`;

	console.log("hitting", url);

	// let res = await fetch(url, header)
	const res = await fetch(url);
	return await res.json();
};

const bobFromTxid = async (txid: string) => {
	const rawtx = await rawTxFromTxid(txid);
	// Transform using BPU
	try {
		return await bobFromRawTx(rawtx);
	} catch (e) {
		console.log(
			"Failed to ger rawtx from whatsonchain for.",
			txid,
			"Failing back to BOB planaria.",
			e,
		);
		return await bobFromPlanariaByTxid(txid);
	}
};

const rawTxFromTxid = async (txid: string) => {
	// get rawtx for txid
	const url = `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`;

	console.log("hitting", url);

	// let res = await fetch(url, header)
	const res = await fetch(url);
	return await res.text();
};
