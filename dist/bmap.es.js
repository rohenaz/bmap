var Se = Object.defineProperty;
var ve = (t, e, r) => e in t ? Se(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var S = (t, e, r) => ve(t, typeof e != "symbol" ? e + "" : e, r);
import { parse as Ee } from "bpu-ts";
import { Hash as I, Signature as A, Utils as T, Script as Pe, BSM as v, BigNumber as q, PublicKey as z } from "@bsv/sdk";
import xe from "node-fetch";
import { decode as _ } from "@msgpack/msgpack";
const Ie = (t) => t.length > 0 && t.every((e) => typeof e == "string"), Be = (t) => t.length > 0 && t.every((e) => e === "object"), P = (t, e) => {
  if (t) {
    if (e === "string")
      return t.s ? t.s : t.ls || "";
    if (e === "hex")
      return t.h ? t.h : t.lh || (t.b ? Buffer.from(t.b, "base64").toString("hex") : t.lb && Buffer.from(t.lb, "base64").toString("hex")) || "";
    if (e === "number")
      return parseInt(t.h ? t.h : t.lh || "0", 16);
    if (e === "file")
      return `bitfs://${t.f ? t.f : t.lf}`;
  } else throw new Error(`cannot get cell value of: ${t}`);
  return (t.b ? t.b : t.lb) || "";
}, Ae = (t) => t.cell.some((e) => e.op === 106), U = (t) => {
  var r;
  if (t.cell.length !== 2)
    return !1;
  const e = t.cell.findIndex((n) => n.op === 106);
  return e !== -1 ? ((r = t.cell[e - 1]) == null ? void 0 : r.op) === 0 : !1;
}, y = (t, e, r) => {
  t[e] ? t[e].push(r) : t[e] = [r];
}, ke = (t, e, r, n, s) => {
  const i = {}, o = e.length + 1;
  if (n.length < o)
    throw new Error(
      `${t} requires at least ${o} fields including the prefix: ${s.tx.h}`
    );
  for (const [a, f] of Object.entries(e)) {
    const d = Number.parseInt(a, 10), [c] = Object.keys(f), [h] = Object.values(f);
    i[c] = P(n[d + 1], h);
  }
  y(r, t, i);
}, $e = (t) => {
  const e = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${e}$`, "gi").test(t);
}, L = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), Te = (t) => {
  if (t.length !== 12)
    return !1;
  const e = [...t].map((s) => s.ops).splice(2, t.length), r = P(t[1], "hex"), n = Buffer.from(r).byteLength;
  return e[1] = `OP_${n}`, L[1] = `OP_${n}`, e.join() === L.join();
}, He = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
  const n = P(e[0], "hex"), s = P(e[1], "hex");
  if (!s)
    throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0], null, 2)}`);
  const i = Buffer.from(s, "hex").byteLength, o = {
    target: s,
    difficulty: i,
    value: r.e.v,
    txid: n
  };
  y(t, "21E8", o);
}, M = {
  name: "21E8",
  handler: He,
  scriptChecker: Te
}, { toArray: x, toHex: Q, fromBase58Check: Me, toBase58Check: Re } = T, Y = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", Z = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }]
], Oe = async (t) => {
  try {
    return await (await xe(`https://x.bitfs.network/${t}`)).buffer();
  } catch {
    return Buffer.from("");
  }
};
function Ce(t) {
  const e = Q(t);
  return new q(e, 16);
}
function N(t, e, r) {
  const n = v.magicHash(t), s = Ce(n);
  for (let i = 0; i < 4; i++)
    try {
      const o = e.RecoverPublicKey(i, s), a = o.toHash(), { prefix: f } = Me(r), d = Re(a, f);
      if (d === r)
        return console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key"), o;
      console.log("[recoverPublicKeyFromBSM] Trying recovery=", i, "Recovered address=", d, "expected=", r);
    } catch (o) {
      console.log("[recoverPublicKeyFromBSM] Recovery error:", o);
    }
  throw console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address"), new Error("Failed to recover public key matching the expected address");
}
function _e(t) {
  const e = new Pe();
  e.chunks.push({ op: 0 }), e.chunks.push({ op: 106 });
  for (const r of t) {
    const n = r.length;
    n <= 75 ? e.chunks.push({ op: n, data: Array.from(r) }) : n <= 255 ? e.chunks.push({ op: 76, data: Array.from(r) }) : n <= 65535 ? e.chunks.push({ op: 77, data: Array.from(r) }) : e.chunks.push({ op: 78, data: Array.from(r) });
  }
  return e;
}
async function Le(t, e, r) {
  var B;
  if (!Array.isArray(r) || r.length < 3)
    throw new Error("AIP requires at least 3 cells including the prefix");
  let n = -1;
  if (r.forEach((u, l) => {
    u.cell === e && (n = l);
  }), n === -1)
    throw new Error("AIP could not find cell in tape");
  let s = t.index || [];
  const i = ["6a"];
  for (let u = 0; u < n; u++) {
    const l = r[u];
    if (!U(l)) {
      const g = [];
      for (const m of l.cell) {
        let p;
        if (m.h)
          p = m.h;
        else if (m.f) {
          const b = await Oe(m.f);
          p = b.length > 0 ? b.toString("hex") : void 0;
        } else if (m.b) {
          const b = Buffer.from(m.b, "base64");
          b.length > 0 && (p = b.toString("hex"));
        } else m.s && m.s.length > 0 && (p = Buffer.from(m.s).toString("hex"));
        p && p.length > 0 && g.push(p);
      }
      g.length > 0 && (i.push(...g), i.push("7c"));
    }
  }
  if (t.hashing_algorithm && t.index_unit_size) {
    const u = t.index_unit_size * 2;
    s = [];
    const l = ((B = e[6]) == null ? void 0 : B.h) || "";
    for (let g = 0; g < l.length; g += u)
      s.push(Number.parseInt(l.substr(g, u), 16));
    t.index = s;
  }
  console.log("usingIndexes", s), console.log("signatureValues", i);
  const o = [];
  if (s.length > 0)
    for (const u of s) {
      if (typeof i[u] != "string" && console.log("signatureValues[idx]", i[u], "idx", u), !i[u])
        return console.log("signatureValues is missing an index", u, "This means indexing is off"), !1;
      o.push(Buffer.from(i[u], "hex"));
    }
  else
    for (const u of i)
      o.push(Buffer.from(u, "hex"));
  console.log("signatureBufferStatements", o.map((u) => u.toString("hex")));
  let a;
  if (t.hashing_algorithm) {
    t.index_unit_size || o.shift();
    const u = _e(o);
    let l = Buffer.from(u.toHex(), "hex");
    t.index_unit_size && (l = l.slice(1));
    const g = I.sha256(x(l));
    a = Buffer.from(g);
  } else
    a = Buffer.concat(o);
  const f = t.address || t.signing_address, d = t.signature, c = A.fromCompact(d, "base64"), h = () => {
    console.log("[validateSignature:tryNormalLogic] start");
    try {
      const u = x(a), l = N(u, c, f);
      console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const g = v.verify(u, c, l);
      return console.log("[tryNormalLogic] BSM.verify result:", g), g;
    } catch (u) {
      return console.log("[tryNormalLogic] error:", u), !1;
    }
  }, w = () => {
    if (console.log("[validateSignature:tryTwetchLogic] start"), o.length <= 2)
      return !1;
    const u = o.slice(1, -1);
    console.log("[tryTwetchLogic] trimmedStatements count:", u.length);
    const l = I.sha256(x(Buffer.concat(u))), g = Q(l), m = Buffer.from(g, "utf8");
    try {
      const p = N(x(m), c, f);
      console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const b = v.verify(x(m), c, p);
      return console.log("[tryTwetchLogic] BSM.verify result:", b), b;
    } catch (p) {
      return console.log("[tryTwetchLogic] error:", p), !1;
    }
  };
  let E = h();
  return E || (E = w()), console.log("[validateSignature] final verified=", E), t.verified = E, E;
}
var j = /* @__PURE__ */ ((t) => (t.HAIP = "HAIP", t.AIP = "AIP", t))(j || {});
const G = async (t, e, r, n, s, i) => {
  const o = { verified: !1 };
  if (n.length < 4)
    throw new Error("AIP requires at least 4 fields including the prefix");
  for (const [a, f] of Object.entries(t)) {
    const d = Number.parseInt(a, 10);
    if (Array.isArray(f)) {
      const [c] = Object.keys(f[0]), h = [];
      for (let w = d + 1; w < n.length; w++)
        n[w].h && h.push(Number.parseInt(n[w].h, 16));
      o[c] = h;
    } else {
      const [c] = Object.keys(f), [h] = Object.values(f);
      o[c] = P(n[d + 1], h) || "";
    }
  }
  if (n[0].s === Y && n[3].s && $e(n[3].s) && (o.signature = n[3].s), console.log("[AIPhandler] AIP object before validate:", o), !o.signature)
    throw new Error("AIP requires a signature");
  await Le(o, n, s), console.log("[AIPhandler] After validate, verified:", o.verified), y(r, e, o);
}, Ne = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (!r)
    throw new Error("Invalid AIP transaction");
  return await G(
    Z,
    "AIP",
    t,
    e,
    r
  );
}, J = {
  name: "AIP",
  address: Y,
  opReturnSchema: Z,
  handler: Ne
}, Fe = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", R = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], Ke = ({ dataObj: t, cell: e, tx: r }) => {
  var i;
  const n = /* @__PURE__ */ new Map();
  if (n.set("utf8", "string"), n.set("text", "string"), n.set("gzip", "binary"), n.set("text/plain", "string"), n.set("image/png", "binary"), n.set("image/jpeg", "binary"), !e[1] || !e[2])
    throw new Error(`Invalid B tx: ${r}`);
  if (e.length > R.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const s = {};
  for (const [o, a] of Object.entries(R)) {
    const f = Number.parseInt(o, 10), d = Object.keys(a)[0];
    let c = Object.values(a)[0];
    if (d === "content")
      if (e[1].f)
        c = "file";
      else if ((!e[3] || !e[3].s) && e[2].s) {
        if (c = n.get(e[2].s), !c) {
          console.warn("Problem inferring encoding. Malformed B data.", e);
          return;
        }
        e[3] || (e[3] = { h: "", b: "", s: "", i: 0, ii: 0 }), e[3].s = c === "string" ? "utf-8" : "binary";
      } else
        c = (i = e[3]) != null && i.s ? n.get(e[3].s.replace("-", "").toLowerCase()) : null;
    if (d === "encoding" && !e[f + 1] || d === "filename" && !e[f + 1])
      continue;
    if (!e || !e[f + 1])
      throw new Error(`malformed B syntax ${e}`);
    const h = e[f + 1];
    s[d] = P(h, c);
  }
  y(t, "B", s);
}, D = {
  name: "B",
  address: Fe,
  opReturnSchema: R,
  handler: Ke
}, Ve = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", W = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], qe = ({ dataObj: t, cell: e, tx: r }) => {
  if (!r)
    throw new Error("Invalid BAP tx, tx required");
  ke("BAP", W, t, e, r);
}, X = {
  name: "BAP",
  address: Ve,
  opReturnSchema: W,
  handler: qe
}, ze = "$", Ue = [
  {
    su: [
      { pubkey: "string" },
      { sign_position: "string" },
      { signature: "string" }
    ],
    echo: [{ data: "string" }, { to: "string" }, { filename: "string" }],
    route: [
      [
        {
          add: [
            { bitcom_address: "string" },
            { route_matcher: "string" },
            { endpoint_template: "string" }
          ]
        },
        {
          enable: [{ path: "string" }]
        }
      ]
    ],
    useradd: [{ address: "string" }]
  }
], Qe = ({ dataObj: t, cell: e }) => {
  if (!e.length || !e.every((n) => n.s))
    throw new Error("Invalid Bitcom tx");
  const r = e.map((n) => n != null && n.s ? n.s : "");
  y(t, "BITCOM", r);
}, Ye = {
  name: "BITCOM",
  address: ze,
  opReturnSchema: Ue,
  handler: Qe
}, { toArray: F, toBase58Check: H, toHex: Ze } = T, { magicHash: je } = v, ee = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", te = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function Ge(t) {
  const e = Ze(t);
  return new q(e, 16);
}
function K(t, e) {
  const r = je(t), n = Ge(r);
  for (let s = 0; s < 4; s++)
    try {
      const i = e.RecoverPublicKey(s, n);
      if (v.verify(t, e, i))
        return i;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const Je = async ({ dataObj: t, cell: e }) => {
  if (e.length < 5)
    throw new Error("Invalid Bitkey tx");
  const r = {};
  for (const [pe, C] of Object.entries(te)) {
    const ye = Number.parseInt(pe, 10), be = Object.keys(C)[0], we = Object.values(C)[0];
    r[be] = P(e[ye + 1], we);
  }
  const n = r.pubkey, i = z.fromString(n).toHash(), o = H(i), f = Buffer.from(r.paymail).toString("hex") + n, d = Buffer.from(f, "hex"), c = I.sha256(F(d)), h = A.fromCompact(r.bitkey_signature, "base64"), w = K(c, h), E = w.toHash(), B = H(E), u = v.verify(c, h, w) && B === ee, l = F(Buffer.from(n, "utf8")), g = A.fromCompact(r.user_signature, "base64"), m = K(l, g), p = m.toHash(), b = H(p), me = v.verify(l, g, m) && b === o;
  r.verified = u && me, y(t, "BITKEY", r);
}, De = {
  name: "BITKEY",
  address: ee,
  opReturnSchema: te,
  handler: Je
}, { magicHash: We } = v, { toArray: Xe } = T, re = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", et = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], tt = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (e[0].s !== re || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].b || !e[3].s || !r)
    throw new Error(`Invalid BITPIC record: ${n}`);
  const s = {
    paymail: e[1].s,
    pubkey: Buffer.from(e[2].b, "base64").toString("hex"),
    signature: e[3].s || "",
    verified: !1
  };
  if (r[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")
    try {
      const o = e[1].lb || e[1].b, a = I.sha256(Xe(o, "base64")), f = A.fromCompact(s.signature, "base64"), d = z.fromString(s.pubkey), c = We(a);
      s.verified = v.verify(c, f, d);
    } catch {
      s.verified = !1;
    }
  y(t, "BITPIC", s);
}, rt = {
  name: "BITPIC",
  address: re,
  opReturnSchema: et,
  handler: tt
}, nt = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", ne = [
  { hashing_algorithm: "string" },
  { signing_algorithm: "string" },
  { signing_address: "string" },
  { signature: "string" },
  { index_unit_size: "number" },
  [{ index: "binary" }]
], st = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (!r)
    throw new Error("Invalid HAIP tx. Bad tape");
  if (!n)
    throw new Error("Invalid HAIP tx.");
  return await G(
    ne,
    j.HAIP,
    t,
    e,
    r
    // tx,
  );
}, ot = {
  name: "HAIP",
  address: nt,
  opReturnSchema: ne,
  handler: st
}, O = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", se = [
  {
    cmd: {
      SET: [{ key: "string" }, { val: "string" }],
      SELECT: [{ tx: "string" }],
      ADD: [{ key: "string" }, [{ val: "string" }]],
      DELETE: [{ key: "string" }, [{ val: "string" }]],
      JSON: "string",
      REMOVE: [[{ key: "string" }]],
      CLEAR: [[{ txid: "string" }]]
    }
  }
], it = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && Array.isArray(e[r]) && e[r].push(s);
  }
}, at = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && e[r].push(s);
  }
}, ct = (t, e) => {
  for (const r of t)
    if (r.i === 0 || r.i === 1) {
      e.SELECT = "TODO";
      continue;
    }
}, ft = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        if (!_)
          throw new Error("Msgpack is required but not loaded");
        const n = Buffer.from(r.b, "base64");
        e = _(n);
      } catch {
        e = {};
      }
  return e;
}, dt = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        e = JSON.parse(r.s);
      } catch {
        e = {};
      }
  return e;
}, ut = (t, e) => {
  let r = null;
  for (const n of t) {
    if (!n.s || n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    if (n.i % 2 === 0)
      e[s] = "", r = s;
    else {
      if (!r)
        throw new Error(`malformed MAP syntax. Cannot parse.${r}`);
      e[r] = s;
    }
  }
}, ht = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== O || !e[1] || !e[1].s || !e[2] || !e[2].s)
    throw new Error(`Invalid MAP record: ${r}`);
  let n = {};
  const s = [];
  let i = 0;
  for (let a = 1; a < e.length; a++)
    e[a].s === ":::" ? i++ : (s[i] || (s[i] = []), e[a].i = s[i].length + 1, s[i].push(e[a]));
  const o = Object.keys(se[0])[0];
  n[o] = s[0][0].s;
  for (const a of s)
    switch (a.unshift({
      s: O,
      i: 0
    }), a[1].s) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        it(a, n);
        break;
      }
      case "REMOVE": {
        n.key = a[2].s;
        break;
      }
      case "DELETE": {
        at(a, n);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        ct(a, n);
        break;
      }
      case "MSGPACK": {
        n = ft(a, n);
        break;
      }
      case "JSON": {
        n = dt(a, n);
        break;
      }
      case "SET": {
        ut(a, n);
        break;
      }
    }
  y(t, "MAP", n);
}, oe = {
  name: "MAP",
  address: O,
  opReturnSchema: se,
  handler: ht
}, { toArray: lt, toHex: gt } = T, mt = "meta", pt = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], V = async (t, e) => {
  const r = Buffer.from(t + e), n = I.sha256(lt(r));
  return gt(n);
}, yt = async ({ dataObj: t, cell: e, tx: r }) => {
  if (!e.length || e[0].s !== "meta" || !e[1] || !e[1].s || !e[2] || !e[2].s || !r)
    throw new Error(`Invalid Metanet tx ${r}`);
  const n = await V(e[1].s, r.tx.h), s = {
    a: e[1].s,
    tx: r.tx.h,
    id: n
  };
  let i = {};
  if (r.in) {
    const o = await V(r.in[0].e.a, e[2].s);
    i = {
      a: r.in[0].e.a,
      tx: e[2].s,
      id: o
    };
  }
  t.METANET || (t.METANET = []), t.METANET.push({
    node: s,
    parent: i
  });
}, ie = {
  name: "METANET",
  address: mt,
  opReturnSchema: pt,
  handler: yt
}, bt = (t) => {
  if (t.length < 13)
    return !1;
  const e = $(t, (i) => i.ops === "OP_IF"), r = $(
    t,
    (i, o) => o > e && i.ops === "OP_ENDIF"
  ), n = t.slice(e, r), s = t[e - 1];
  return (s == null ? void 0 : s.op) === 0 && !!n[0] && !!n[1] && n[1].s == "ord";
}, wt = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const n = $(e, (d) => d.ops === "OP_IF"), s = $(
    e,
    (d, c) => c > n && d.ops === "OP_ENDIF"
  ) + 1, i = e.slice(n, s);
  if (!i[0] || !i[1] || i[1].s !== "ord")
    throw new Error("Invalid Ord tx. Prefix not found.");
  let o, a;
  if (i.forEach((d, c, h) => {
    d.ops === "OP_1" && (a = h[c + 1].s), d.ops === "OP_0" && (o = h[c + 1].b);
  }), !o)
    throw new Error("Invalid Ord data.");
  if (!a)
    throw new Error("Invalid Ord content type.");
  y(t, "ORD", {
    data: o,
    contentType: a
  });
}, k = {
  name: "ORD",
  handler: wt,
  scriptChecker: bt
};
function $(t, e) {
  return St(t, e);
}
function St(t, e, r) {
  const n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  let s = n - 1;
  return vt(t, e, s);
}
function vt(t, e, r, n) {
  let s = r + 1;
  for (; s--; )
    if (e(t[s], s, t))
      return s;
  return -1;
}
const ae = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", Et = [
  { pair: "json" },
  { address: "string" },
  { timestamp: "string" }
], Pt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== ae || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].s || !e[3].s)
    throw new Error(`Invalid RON record ${r == null ? void 0 : r.tx.h}`);
  const n = JSON.parse(e[1].s), s = Number(e[3].s);
  y(t, "RON", {
    pair: n,
    address: e[2].s,
    timestamp: s
  });
}, xt = {
  name: "RON",
  address: ae,
  opReturnSchema: Et,
  handler: Pt
}, ce = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", It = [{ url: "string" }], Bt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== ce || !e[1] || !e[1].s)
    throw new Error(`Invalid SymRe tx: ${r}`);
  y(t, "SYMRE", { url: e[1].s });
}, At = {
  name: "SYMRE",
  address: ce,
  opReturnSchema: It,
  handler: Bt
}, fe = /* @__PURE__ */ new Map([]), de = /* @__PURE__ */ new Map([]), ue = /* @__PURE__ */ new Map([]), he = /* @__PURE__ */ new Map(), le = [
  J,
  D,
  X,
  oe,
  ie,
  M,
  Ye,
  De,
  rt,
  ot,
  xt,
  At,
  k
], _t = le.map((t) => t.name), ge = [J, D, X, oe, ie, k];
for (const t of ge)
  t.address && fe.set(t.address, t.name), de.set(t.name, t.handler), t.opReturnSchema && he.set(t.name, t.opReturnSchema), t.scriptChecker && ue.set(t.name, t.scriptChecker);
class kt {
  constructor() {
    S(this, "enabledProtocols");
    S(this, "protocolHandlers");
    S(this, "protocolScriptCheckers");
    S(this, "protocolOpReturnSchemas");
    S(this, "transformTx", async (e) => {
      if (!e || !e.in || !e.out)
        throw new Error("Cannot process tx");
      let r = {};
      for (const [n, s] of Object.entries(e))
        if (n === "out")
          for (const i of e.out) {
            const { tape: o } = i;
            o != null && o.some((d) => Ae(d)) && (r = await this.processDataProtocols(o, i, e, r));
            const a = this.protocolScriptCheckers.get(M.name), f = this.protocolScriptCheckers.get(k.name);
            if (o != null && o.some((d) => {
              const { cell: c } = d;
              if (a != null && a(c) || f != null && f(c))
                return !0;
            }))
              for (const d of o) {
                const { cell: c } = d;
                if (!c)
                  throw new Error("empty cell while parsing");
                let h = "";
                if (a != null && a(c))
                  h = M.name;
                else if (f != null && f(c))
                  h = k.name;
                else
                  continue;
                this.process(h, {
                  tx: e,
                  cell: c,
                  dataObj: r,
                  tape: o,
                  out: i
                });
              }
          }
        else n === "in" ? r[n] = s.map((i) => {
          const o = { ...i };
          return delete o.tape, o;
        }) : r[n] = s;
      if (r.METANET && e.parent) {
        const n = {
          ancestor: e.ancestor,
          parent: e.parent,
          child: e.child,
          head: e.head
        };
        r.METANET.push(n), delete r.ancestor, delete r.child, delete r.parent, delete r.head, delete r.node;
      }
      return r;
    });
    S(this, "processUnknown", (e, r, n) => {
      e && !r[e] && (r[e] = []), r[e].push({
        i: n.i,
        e: n.e,
        tape: []
      });
    });
    S(this, "process", async (e, { cell: r, dataObj: n, tape: s, out: i, tx: o }) => {
      if (this.protocolHandlers.has(e) && typeof this.protocolHandlers.get(e) == "function") {
        const a = this.protocolHandlers.get(e);
        a && await a({
          dataObj: n,
          cell: r,
          tape: s,
          out: i,
          tx: o
        });
      } else
        y(n, e, r);
    });
    S(this, "processDataProtocols", async (e, r, n, s) => {
      var i;
      for (const o of e) {
        const { cell: a } = o;
        if (!a)
          throw new Error("empty cell while parsing");
        if (U(o))
          continue;
        const f = a[0].s;
        if (f) {
          const d = this.enabledProtocols.get(f) || ((i = ge.filter((c) => c.name === f)[0]) == null ? void 0 : i.name);
          d ? await this.process(d, {
            cell: a,
            dataObj: s,
            tape: e,
            out: r,
            tx: n
          }) : this.processUnknown(f, s, r);
        }
      }
      return s;
    });
    this.enabledProtocols = fe, this.protocolHandlers = de, this.protocolScriptCheckers = ue, this.protocolOpReturnSchemas = he;
  }
  addProtocolHandler({
    name: e,
    address: r,
    opReturnSchema: n,
    handler: s,
    scriptChecker: i
  }) {
    r && this.enabledProtocols.set(r, e), this.protocolHandlers.set(e, s), n && this.protocolOpReturnSchemas.set(e, n), i && this.protocolScriptCheckers.set(e, i);
  }
}
const $t = async (t) => {
  const e = `https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;
  return console.log("hitting", e), await (await fetch(e)).text();
}, Tt = async (t) => await Ee({
  tx: { r: t },
  split: [
    {
      token: { op: 106 },
      include: "l"
    },
    {
      token: { s: "|" }
    }
  ]
}), Lt = async (t, e) => {
  if (typeof t == "string") {
    let n;
    if (t.length === 64 && (n = await $t(t)), Buffer.from(t).byteLength <= 146)
      throw new Error("Invalid rawTx");
    n || (n = t);
    const s = await Tt(n);
    if (s)
      t = s;
    else
      throw new Error("Invalid txid");
  }
  const r = new kt();
  if (e)
    if (r.enabledProtocols.clear(), Ie(e))
      for (const n of le)
        e != null && e.includes(n.name) && r.addProtocolHandler(n);
    else if (Be(e))
      for (const n of e) {
        const s = n;
        s && r.addProtocolHandler(s);
      }
    else
      throw new Error(
        "Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[])."
      );
  return r.transformTx(t);
};
export {
  kt as BMAP,
  Lt as TransformTx,
  le as allProtocols,
  Tt as bobFromRawTx,
  ge as defaultProtocols,
  $t as fetchRawTx,
  _t as supportedProtocols
};
