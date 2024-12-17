import { parse as we } from "bpu-ts";
import { Hash as x, Signature as B, Utils as $, Script as Se, BSM as S, BigNumber as V, PublicKey as q } from "@bsv/sdk";
import ve from "node-fetch";
import { decode as C } from "@msgpack/msgpack";
const Ee = (t) => t.length > 0 && t.every((e) => typeof e == "string"), Pe = (t) => t.length > 0 && t.every((e) => e === "object"), E = (t, e) => {
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
}, xe = (t) => t.cell.some((e) => e.op === 106), z = (t) => {
  var r;
  if (t.cell.length !== 2)
    return !1;
  const e = t.cell.findIndex((n) => n.op === 106);
  return e !== -1 ? ((r = t.cell[e - 1]) == null ? void 0 : r.op) === 0 : !1;
}, y = (t, e, r) => {
  t[e] ? t[e].push(r) : t[e] = [r];
}, Ie = (t, e, r, n, s) => {
  const i = {}, o = e.length + 1;
  if (n.length < o)
    throw new Error(
      `${t} requires at least ${o} fields including the prefix: ${s.tx.h}`
    );
  for (const [a, f] of Object.entries(e)) {
    const d = Number.parseInt(a, 10), [c] = Object.keys(f), [h] = Object.values(f);
    i[c] = E(n[d + 1], h);
  }
  y(r, t, i);
}, Be = (t) => {
  const e = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${e}$`, "gi").test(t);
}, _ = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), Ae = (t) => {
  if (t.length !== 12)
    return !1;
  const e = [...t].map((s) => s.ops).splice(2, t.length), r = E(t[1], "hex"), n = Buffer.from(r).byteLength;
  return e[1] = `OP_${n}`, _[1] = `OP_${n}`, e.join() === _.join();
}, ke = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
  const n = E(e[0], "hex"), s = E(e[1], "hex");
  if (!s)
    throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0], null, 2)}`);
  const i = Buffer.from(s, "hex").byteLength, o = {
    target: s,
    difficulty: i,
    value: r.e.v,
    txid: n
  };
  y(t, "21E8", o);
}, H = {
  name: "21E8",
  handler: ke,
  scriptChecker: Ae
}, { toArray: P, toHex: U, fromBase58Check: $e, toBase58Check: Te } = $, Q = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", Y = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }]
], He = async (t) => {
  try {
    return await (await ve(`https://x.bitfs.network/${t}`)).buffer();
  } catch {
    return Buffer.from("");
  }
};
function Me(t) {
  const e = U(t);
  return new V(e, 16);
}
function L(t, e, r) {
  const n = S.magicHash(t), s = Me(n);
  for (let i = 0; i < 4; i++)
    try {
      const o = e.RecoverPublicKey(i, s), a = o.toHash(), { prefix: f } = $e(r), d = Te(a, f);
      if (d === r)
        return console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key"), o;
      console.log("[recoverPublicKeyFromBSM] Trying recovery=", i, "Recovered address=", d, "expected=", r);
    } catch (o) {
      console.log("[recoverPublicKeyFromBSM] Recovery error:", o);
    }
  throw console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address"), new Error("Failed to recover public key matching the expected address");
}
function Re(t) {
  const e = new Se();
  e.chunks.push({ op: 0 }), e.chunks.push({ op: 106 });
  for (const r of t) {
    const n = r.length;
    n <= 75 ? e.chunks.push({ op: n, data: Array.from(r) }) : n <= 255 ? e.chunks.push({ op: 76, data: Array.from(r) }) : n <= 65535 ? e.chunks.push({ op: 77, data: Array.from(r) }) : e.chunks.push({ op: 78, data: Array.from(r) });
  }
  return e;
}
async function Oe(t, e, r) {
  var I;
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
    if (!z(l)) {
      const g = [];
      for (const m of l.cell) {
        let p;
        if (m.h)
          p = m.h;
        else if (m.f) {
          const b = await He(m.f);
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
    const l = ((I = e[6]) == null ? void 0 : I.h) || "";
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
    const u = Re(o);
    let l = Buffer.from(u.toHex(), "hex");
    t.index_unit_size && (l = l.slice(1));
    const g = x.sha256(P(l));
    a = Buffer.from(g);
  } else
    a = Buffer.concat(o);
  const f = t.address || t.signing_address, d = t.signature, c = B.fromCompact(d, "base64"), h = () => {
    console.log("[validateSignature:tryNormalLogic] start");
    try {
      const u = P(a), l = L(u, c, f);
      console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const g = S.verify(u, c, l);
      return console.log("[tryNormalLogic] BSM.verify result:", g), g;
    } catch (u) {
      return console.log("[tryNormalLogic] error:", u), !1;
    }
  }, w = () => {
    if (console.log("[validateSignature:tryTwetchLogic] start"), o.length <= 2)
      return !1;
    const u = o.slice(1, -1);
    console.log("[tryTwetchLogic] trimmedStatements count:", u.length);
    const l = x.sha256(P(Buffer.concat(u))), g = U(l), m = Buffer.from(g, "utf8");
    try {
      const p = L(P(m), c, f);
      console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const b = S.verify(P(m), c, p);
      return console.log("[tryTwetchLogic] BSM.verify result:", b), b;
    } catch (p) {
      return console.log("[tryTwetchLogic] error:", p), !1;
    }
  };
  let v = h();
  return v || (v = w()), console.log("[validateSignature] final verified=", v), t.verified = v, v;
}
var Z = /* @__PURE__ */ ((t) => (t.HAIP = "HAIP", t.AIP = "AIP", t))(Z || {});
const j = async (t, e, r, n, s, i) => {
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
      o[c] = E(n[d + 1], h) || "";
    }
  }
  if (n[0].s === Q && n[3].s && Be(n[3].s) && (o.signature = n[3].s), console.log("[AIPhandler] AIP object before validate:", o), !o.signature)
    throw new Error("AIP requires a signature");
  await Oe(o, n, s), console.log("[AIPhandler] After validate, verified:", o.verified), y(r, e, o);
}, Ce = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (!r)
    throw new Error("Invalid AIP transaction");
  return await j(
    Y,
    "AIP",
    t,
    e,
    r
  );
}, G = {
  name: "AIP",
  address: Q,
  opReturnSchema: Y,
  handler: Ce
}, _e = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", M = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], Le = ({ dataObj: t, cell: e, tx: r }) => {
  var i;
  const n = /* @__PURE__ */ new Map();
  if (n.set("utf8", "string"), n.set("text", "string"), n.set("gzip", "binary"), n.set("text/plain", "string"), n.set("image/png", "binary"), n.set("image/jpeg", "binary"), !e[1] || !e[2])
    throw new Error(`Invalid B tx: ${r}`);
  if (e.length > M.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const s = {};
  for (const [o, a] of Object.entries(M)) {
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
    s[d] = E(h, c);
  }
  y(t, "B", s);
}, J = {
  name: "B",
  address: _e,
  opReturnSchema: M,
  handler: Le
}, Ne = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", D = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], Fe = ({ dataObj: t, cell: e, tx: r }) => {
  if (!r)
    throw new Error("Invalid BAP tx, tx required");
  Ie("BAP", D, t, e, r);
}, W = {
  name: "BAP",
  address: Ne,
  opReturnSchema: D,
  handler: Fe
}, Ke = "$", Ve = [
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
], qe = ({ dataObj: t, cell: e }) => {
  if (!e.length || !e.every((n) => n.s))
    throw new Error("Invalid Bitcom tx");
  const r = e.map((n) => n != null && n.s ? n.s : "");
  y(t, "BITCOM", r);
}, ze = {
  name: "BITCOM",
  address: Ke,
  opReturnSchema: Ve,
  handler: qe
}, { toArray: N, toBase58Check: T, toHex: Ue } = $, { magicHash: Qe } = S, X = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", ee = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function Ye(t) {
  const e = Ue(t);
  return new V(e, 16);
}
function F(t, e) {
  const r = Qe(t), n = Ye(r);
  for (let s = 0; s < 4; s++)
    try {
      const i = e.RecoverPublicKey(s, n);
      if (S.verify(t, e, i))
        return i;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const Ze = async ({ dataObj: t, cell: e }) => {
  if (e.length < 5)
    throw new Error("Invalid Bitkey tx");
  const r = {};
  for (const [me, O] of Object.entries(ee)) {
    const pe = Number.parseInt(me, 10), ye = Object.keys(O)[0], be = Object.values(O)[0];
    r[ye] = E(e[pe + 1], be);
  }
  const n = r.pubkey, i = q.fromString(n).toHash(), o = T(i), f = Buffer.from(r.paymail).toString("hex") + n, d = Buffer.from(f, "hex"), c = x.sha256(N(d)), h = B.fromCompact(r.bitkey_signature, "base64"), w = F(c, h), v = w.toHash(), I = T(v), u = S.verify(c, h, w) && I === X, l = N(Buffer.from(n, "utf8")), g = B.fromCompact(r.user_signature, "base64"), m = F(l, g), p = m.toHash(), b = T(p), ge = S.verify(l, g, m) && b === o;
  r.verified = u && ge, y(t, "BITKEY", r);
}, je = {
  name: "BITKEY",
  address: X,
  opReturnSchema: ee,
  handler: Ze
}, { magicHash: Ge } = S, { toArray: Je } = $, te = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", De = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], We = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (e[0].s !== te || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].b || !e[3].s || !r)
    throw new Error(`Invalid BITPIC record: ${n}`);
  const s = {
    paymail: e[1].s,
    pubkey: Buffer.from(e[2].b, "base64").toString("hex"),
    signature: e[3].s || "",
    verified: !1
  };
  if (r[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")
    try {
      const o = e[1].lb || e[1].b, a = x.sha256(Je(o, "base64")), f = B.fromCompact(s.signature, "base64"), d = q.fromString(s.pubkey), c = Ge(a);
      s.verified = S.verify(c, f, d);
    } catch {
      s.verified = !1;
    }
  y(t, "BITPIC", s);
}, Xe = {
  name: "BITPIC",
  address: te,
  opReturnSchema: De,
  handler: We
}, et = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", re = [
  { hashing_algorithm: "string" },
  { signing_algorithm: "string" },
  { signing_address: "string" },
  { signature: "string" },
  { index_unit_size: "number" },
  [{ index: "binary" }]
], tt = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (!r)
    throw new Error("Invalid HAIP tx. Bad tape");
  if (!n)
    throw new Error("Invalid HAIP tx.");
  return await j(
    re,
    Z.HAIP,
    t,
    e,
    r
    // tx,
  );
}, rt = {
  name: "HAIP",
  address: et,
  opReturnSchema: re,
  handler: tt
}, R = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", ne = [
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
], nt = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && Array.isArray(e[r]) && e[r].push(s);
  }
}, st = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && e[r].push(s);
  }
}, ot = (t, e) => {
  for (const r of t)
    if (r.i === 0 || r.i === 1) {
      e.SELECT = "TODO";
      continue;
    }
}, it = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        if (!C)
          throw new Error("Msgpack is required but not loaded");
        const n = Buffer.from(r.b, "base64");
        e = C(n);
      } catch {
        e = {};
      }
  return e;
}, at = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        e = JSON.parse(r.s);
      } catch {
        e = {};
      }
  return e;
}, ct = (t, e) => {
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
}, ft = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== R || !e[1] || !e[1].s || !e[2] || !e[2].s)
    throw new Error(`Invalid MAP record: ${r}`);
  let n = {};
  const s = [];
  let i = 0;
  for (let a = 1; a < e.length; a++)
    e[a].s === ":::" ? i++ : (s[i] || (s[i] = []), e[a].i = s[i].length + 1, s[i].push(e[a]));
  const o = Object.keys(ne[0])[0];
  n[o] = s[0][0].s;
  for (const a of s)
    switch (a.unshift({
      s: R,
      i: 0
    }), a[1].s) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        nt(a, n);
        break;
      }
      case "REMOVE": {
        n.key = a[2].s;
        break;
      }
      case "DELETE": {
        st(a, n);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        ot(a, n);
        break;
      }
      case "MSGPACK": {
        n = it(a, n);
        break;
      }
      case "JSON": {
        n = at(a, n);
        break;
      }
      case "SET": {
        ct(a, n);
        break;
      }
    }
  y(t, "MAP", n);
}, se = {
  name: "MAP",
  address: R,
  opReturnSchema: ne,
  handler: ft
}, { toArray: dt, toHex: ut } = $, ht = "meta", lt = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], K = async (t, e) => {
  const r = Buffer.from(t + e), n = x.sha256(dt(r));
  return ut(n);
}, gt = async ({ dataObj: t, cell: e, tx: r }) => {
  if (!e.length || e[0].s !== "meta" || !e[1] || !e[1].s || !e[2] || !e[2].s || !r)
    throw new Error(`Invalid Metanet tx ${r}`);
  const n = await K(e[1].s, r.tx.h), s = {
    a: e[1].s,
    tx: r.tx.h,
    id: n
  };
  let i = {};
  if (r.in) {
    const o = await K(r.in[0].e.a, e[2].s);
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
}, oe = {
  name: "METANET",
  address: ht,
  opReturnSchema: lt,
  handler: gt
}, mt = (t) => {
  if (t.length < 13)
    return !1;
  const e = k(t, (i) => i.ops === "OP_IF"), r = k(
    t,
    (i, o) => o > e && i.ops === "OP_ENDIF"
  ), n = t.slice(e, r), s = t[e - 1];
  return (s == null ? void 0 : s.op) === 0 && !!n[0] && !!n[1] && n[1].s == "ord";
}, pt = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const n = k(e, (d) => d.ops === "OP_IF"), s = k(
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
}, A = {
  name: "ORD",
  handler: pt,
  scriptChecker: mt
};
function k(t, e) {
  return yt(t, e);
}
function yt(t, e, r) {
  const n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  let s = n - 1;
  return bt(t, e, s);
}
function bt(t, e, r, n) {
  let s = r + 1;
  for (; s--; )
    if (e(t[s], s, t))
      return s;
  return -1;
}
const ie = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", wt = [
  { pair: "json" },
  { address: "string" },
  { timestamp: "string" }
], St = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== ie || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].s || !e[3].s)
    throw new Error(`Invalid RON record ${r == null ? void 0 : r.tx.h}`);
  const n = JSON.parse(e[1].s), s = Number(e[3].s);
  y(t, "RON", {
    pair: n,
    address: e[2].s,
    timestamp: s
  });
}, vt = {
  name: "RON",
  address: ie,
  opReturnSchema: wt,
  handler: St
}, ae = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", Et = [{ url: "string" }], Pt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== ae || !e[1] || !e[1].s)
    throw new Error(`Invalid SymRe tx: ${r}`);
  y(t, "SYMRE", { url: e[1].s });
}, xt = {
  name: "SYMRE",
  address: ae,
  opReturnSchema: Et,
  handler: Pt
}, ce = /* @__PURE__ */ new Map([]), fe = /* @__PURE__ */ new Map([]), de = /* @__PURE__ */ new Map([]), ue = /* @__PURE__ */ new Map(), he = [
  G,
  J,
  W,
  se,
  oe,
  H,
  ze,
  je,
  Xe,
  rt,
  vt,
  xt,
  A
], Mt = he.map((t) => t.name), le = [G, J, W, se, oe, A];
for (const t of le)
  t.address && ce.set(t.address, t.name), fe.set(t.name, t.handler), t.opReturnSchema && ue.set(t.name, t.opReturnSchema), t.scriptChecker && de.set(t.name, t.scriptChecker);
class It {
  enabledProtocols;
  protocolHandlers;
  protocolScriptCheckers;
  protocolOpReturnSchemas;
  constructor() {
    this.enabledProtocols = ce, this.protocolHandlers = fe, this.protocolScriptCheckers = de, this.protocolOpReturnSchemas = ue;
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
  transformTx = async (e) => {
    if (!e || !e.in || !e.out)
      throw new Error("Cannot process tx");
    let r = {};
    for (const [n, s] of Object.entries(e))
      if (n === "out")
        for (const i of e.out) {
          const { tape: o } = i;
          o != null && o.some((d) => xe(d)) && (r = await this.processDataProtocols(o, i, e, r));
          const a = this.protocolScriptCheckers.get(H.name), f = this.protocolScriptCheckers.get(A.name);
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
                h = H.name;
              else if (f != null && f(c))
                h = A.name;
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
  };
  processUnknown = (e, r, n) => {
    e && !r[e] && (r[e] = []), r[e].push({
      i: n.i,
      e: n.e,
      tape: []
    });
  };
  process = async (e, { cell: r, dataObj: n, tape: s, out: i, tx: o }) => {
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
  };
  processDataProtocols = async (e, r, n, s) => {
    var i;
    for (const o of e) {
      const { cell: a } = o;
      if (!a)
        throw new Error("empty cell while parsing");
      if (z(o))
        continue;
      const f = a[0].s;
      if (f) {
        const d = this.enabledProtocols.get(f) || ((i = le.filter((c) => c.name === f)[0]) == null ? void 0 : i.name);
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
  };
}
const Bt = async (t) => {
  const e = `https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;
  return console.log("hitting", e), await (await fetch(e)).text();
}, At = async (t) => await we({
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
}), Rt = async (t, e) => {
  if (typeof t == "string") {
    let n;
    if (t.length === 64 && (n = await Bt(t)), Buffer.from(t).byteLength <= 146)
      throw new Error("Invalid rawTx");
    n || (n = t);
    const s = await At(n);
    if (s)
      t = s;
    else
      throw new Error("Invalid txid");
  }
  const r = new It();
  if (e)
    if (r.enabledProtocols.clear(), Ee(e))
      for (const n of he)
        e != null && e.includes(n.name) && r.addProtocolHandler(n);
    else if (Pe(e))
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
  It as BMAP,
  Rt as TransformTx,
  he as allProtocols,
  At as bobFromRawTx,
  le as defaultProtocols,
  Bt as fetchRawTx,
  Mt as supportedProtocols
};
//# sourceMappingURL=bmap.es.js.map
