import { parse as Ee } from "bpu-ts";
import { Script as Se, Hash as I, Signature as k, Utils as R, BSM as b, BigNumber as Y, PublicKey as Z } from "@bsv/sdk";
import { decode as L } from "@msgpack/msgpack";
const Pe = (t) => t.length > 0 && t.every((e) => typeof e == "string"), xe = (t) => t.length > 0 && t.every((e) => e === "object"), w = (t, e) => {
  if (!t)
    throw new Error(`cannot get cell value of: ${t}`);
  return e === "string" ? t.s ? t.s : t.ls || "" : e === "hex" ? t.h ? t.h : t.lh || (t.b ? Buffer.from(t.b, "base64").toString("hex") : t.lb && Buffer.from(t.lb, "base64").toString("hex")) || "" : e === "number" ? Number.parseInt(t.h ? t.h : t.lh || "0", 16) : e === "file" ? `bitfs://${t.f ? t.f : t.lf}` : e === "binary" ? t.b || t.lb || "" : (t.b ? t.b : t.lb) || "";
}, ve = (t) => t.cell.some((e) => e.op === 106), J = (t) => {
  var r;
  if (t.cell.length !== 2)
    return !1;
  const e = t.cell.findIndex((n) => n.op === 106);
  return e !== -1 ? ((r = t.cell[e - 1]) == null ? void 0 : r.op) === 0 : !1;
}, m = (t, e, r) => {
  if (!t[e])
    t[e] = [r];
  else {
    if (!Array.isArray(t[e])) {
      const n = t[e];
      t[e] = [], t[e][0] = n;
    }
    t[e].push(r);
  }
}, Ae = (t, e, r, n, s) => {
  const o = {}, a = e.length + 1;
  if (n.length < a)
    throw new Error(
      `${t} requires at least ${a} fields including the prefix: ${s.tx.h}`
    );
  for (const [i, h] of Object.entries(e)) {
    const c = Number.parseInt(i, 10), [d] = Object.keys(h), [u] = Object.values(h);
    o[d] = w(n[c + 1], u);
  }
  m(r, t, o);
}, Ie = (t) => {
  const e = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${e}$`, "gi").test(t);
}, K = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), ke = (t) => {
  if (t.length !== 12)
    return !1;
  const e = [...t].map((s) => s.ops).splice(2, t.length), r = w(t[1], "hex"), n = Buffer.from(r).byteLength;
  return e[1] = `OP_${n}`, K[1] = `OP_${n}`, e.join() === K.join();
}, Be = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
  const n = w(e[0], "hex"), s = w(e[1], "hex");
  if (!s)
    throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0], null, 2)}`);
  const o = Buffer.from(s, "hex").byteLength, a = {
    target: s,
    difficulty: o,
    value: r.e.v,
    txid: n
  };
  m(t, "21E8", a);
}, O = {
  name: "21E8",
  handler: Be,
  scriptChecker: ke
}, { toArray: v, toHex: A, fromBase58Check: F, toBase58Check: V } = R, G = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", W = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }]
];
function He(t, e, r) {
  if (!Array.isArray(r) || r.length < 3)
    throw new Error("AIP requires at least 3 cells including the prefix");
  let n = -1;
  for (let f = 0; f < r.length; f++)
    if (r[f].cell === e) {
      n = f;
      break;
    }
  if (n === -1)
    throw new Error("AIP could not find cell in tape");
  let s = t.index || [];
  const o = ["6a"];
  for (let f = 0; f < n; f++) {
    const g = r[f];
    if (!J(g)) {
      for (const l of g.cell)
        l.h ? o.push(l.h) : l.b ? o.push(A(v(l.b, "base64"))) : l.s && o.push(A(v(l.s)));
      o.push("7c");
    }
  }
  if (t.hashing_algorithm && t.index_unit_size) {
    const f = t.index_unit_size * 2;
    s = [];
    const g = e[6].h;
    for (let l = 0; l < g.length; l += f)
      s.push(Number.parseInt(g.substr(l, f), 16));
    t.index = s;
  }
  const a = [];
  if (s.length > 0)
    for (const f of s) {
      if (f >= o.length)
        return console.log("[validateSignature] Index out of bounds:", f), !1;
      a.push(v(o[f], "hex"));
    }
  else
    for (const f of o)
      a.push(v(f, "hex"));
  let i;
  if (t.hashing_algorithm) {
    t.index_unit_size || a.shift();
    const f = Se.fromHex(A(a.flat()));
    let g = v(f.toHex(), "hex");
    t.index_unit_size && (g = g.slice(1)), i = I.sha256(g);
  } else
    i = a.flat();
  const h = t.address || t.signing_address;
  if (!h || !t.signature)
    return !1;
  let c;
  try {
    c = k.fromCompact(t.signature, "base64");
  } catch (f) {
    return console.log("[validateSignature] Failed to parse signature:", f), !1;
  }
  const d = () => {
    try {
      const f = b.magicHash(i), g = q(f);
      for (let l = 0; l < 4; l++)
        try {
          const y = c.RecoverPublicKey(l, g), E = y.toHash(), { prefix: S } = F(h);
          if (V(E, S) === h)
            return b.verify(i, c, y);
        } catch (y) {
          console.log("[tryNormalLogic] Recovery error:", y);
        }
    } catch (f) {
      console.log("[tryNormalLogic] error:", f);
    }
    return !1;
  }, u = () => {
    if (a.length <= 2)
      return !1;
    try {
      const f = a.slice(1, -1), g = I.sha256(f.flat()), l = A(g), y = v(l, "utf8"), E = b.magicHash(y), S = q(E);
      for (let P = 0; P < 4; P++)
        try {
          const x = c.RecoverPublicKey(P, S), $ = x.toHash(), { prefix: T } = F(h);
          if (V($, T) === h)
            return b.verify(y, c, x);
        } catch (x) {
          console.log("[tryTwetchLogic] Recovery error:", x);
        }
    } catch (f) {
      console.log("[tryTwetchLogic] error:", f);
    }
    return !1;
  };
  let p = d();
  return p || (p = u()), t.verified = p, p;
}
function q(t) {
  const e = A(t);
  return new Y(e, 16);
}
var D = /* @__PURE__ */ ((t) => (t.HAIP = "HAIP", t.AIP = "AIP", t))(D || {});
const X = async (t, e, r, n, s) => {
  const o = {};
  if (n.length < 4)
    throw new Error("AIP requires at least 4 fields including the prefix");
  for (const [a, i] of Object.entries(t)) {
    const h = Number.parseInt(a, 10);
    if (Array.isArray(i)) {
      const [c] = Object.keys(i[0]), d = [];
      for (let u = h + 1; u < n.length; u++)
        n[u].h && Array.isArray(d) && d.push(Number.parseInt(n[u].h || "", 16));
      o[c] = d;
    } else {
      const [c] = Object.keys(i), [d] = Object.values(i);
      o[c] = w(n[h + 1], d) || "";
    }
  }
  if (n[0].s === G && n[3].s && Ie(n[3].s) && (o.signature = n[3].s), !o.signature)
    throw new Error("AIP requires a signature");
  return He(o, n, s), m(r, e, o), { dataObj: r, cell: n, tape: s };
}, Re = async ({ dataObj: t, cell: e, tape: r }) => {
  if (!r)
    throw new Error("Invalid AIP transaction. tape is required");
  return X(W, "AIP", t, e, r);
}, j = {
  name: "AIP",
  address: G,
  opReturnSchema: W,
  handler: Re
}, $e = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", _ = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], Te = ({ dataObj: t, cell: e, tx: r }) => {
  var o;
  const n = /* @__PURE__ */ new Map();
  if (n.set("utf8", "string"), n.set("text", "string"), n.set("gzip", "binary"), n.set("text/plain", "string"), n.set("image/png", "binary"), n.set("image/jpeg", "binary"), n.set("application/octet-stream", "binary"), !e[1] || !e[2])
    throw new Error(`Invalid B tx: ${r}`);
  if (e.length > _.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const s = {};
  for (const [a, i] of Object.entries(_)) {
    const h = Number.parseInt(a, 10), c = Object.keys(i)[0];
    let d = Object.values(i)[0];
    if (c === "content")
      if (e[1].f)
        d = "file";
      else if ((!e[3] || !e[3].s) && e[2].s)
        d = n.get(e[2].s), d || (d = "binary"), e[3] || (e[3] = { h: "", b: "", s: "", i: 0, ii: 0 }), e[3].s = d === "string" ? "utf-8" : "binary";
      else {
        const p = (o = e[3]) != null && o.s ? n.get(e[3].s.replace("-", "").toLowerCase()) : null;
        p ? d = p : d = "binary";
      }
    if (c === "encoding" && !e[h + 1] || c === "filename" && !e[h + 1])
      continue;
    if (!e || !e[h + 1])
      throw new Error(`malformed B syntax ${e}`);
    const u = e[h + 1];
    s[c] = w(u, d);
  }
  m(t, "B", s);
}, ee = {
  name: "B",
  address: $e,
  opReturnSchema: _,
  handler: Te
}, Me = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", te = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], Ce = ({ dataObj: t, cell: e, tx: r }) => {
  if (!r)
    throw new Error("Invalid BAP tx, tx required");
  Ae("BAP", te, t, e, r);
}, re = {
  name: "BAP",
  address: Me,
  opReturnSchema: te,
  handler: Ce
}, Oe = "$", _e = [
  {
    su: [{ pubkey: "string" }, { sign_position: "string" }, { signature: "string" }],
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
], Ne = ({ dataObj: t, cell: e }) => {
  if (!e.length || !e.every((n) => n.s))
    throw new Error("Invalid Bitcom tx");
  const r = e.map((n) => n != null && n.s ? n.s : "");
  m(t, "BITCOM", r);
}, Le = {
  name: "BITCOM",
  address: Oe,
  opReturnSchema: _e,
  handler: Ne
}, { toArray: z, toBase58Check: C, toHex: Ke } = R, { magicHash: Fe } = b, ne = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", se = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function Ve(t) {
  const e = Ke(t);
  return new Y(e, 16);
}
function U(t, e) {
  const r = Fe(t), n = Ve(r);
  for (let s = 0; s < 4; s++)
    try {
      const o = e.RecoverPublicKey(s, n);
      if (b.verify(t, e, o))
        return o;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const qe = async ({ dataObj: t, cell: e }) => {
  if (e.length < 5)
    throw new Error("Invalid Bitkey tx");
  const r = {};
  for (const [T, M] of Object.entries(se)) {
    const ye = Number.parseInt(T, 10), be = Object.keys(M)[0], we = Object.values(M)[0];
    r[be] = w(e[ye + 1], we);
  }
  const n = r.pubkey, o = Z.fromString(n).toHash(), a = C(o), h = Buffer.from(r.paymail).toString("hex") + n, c = Buffer.from(h, "hex"), d = I.sha256(z(c)), u = k.fromCompact(r.bitkey_signature, "base64"), p = U(d, u), f = p.toHash(), g = C(f), l = b.verify(d, u, p) && g === ne, y = z(Buffer.from(n, "utf8")), E = k.fromCompact(r.user_signature, "base64"), S = U(y, E), P = S.toHash(), x = C(P), $ = b.verify(y, E, S) && x === a;
  r.verified = l && $, m(t, "BITKEY", r);
}, ze = {
  name: "BITKEY",
  address: ne,
  opReturnSchema: se,
  handler: qe
}, { magicHash: Ue } = b, { toArray: Qe } = R, oe = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", Ye = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], Ze = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (e[0].s !== oe || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].b || !e[3].s || !r)
    throw new Error(`Invalid BITPIC record: ${n}`);
  const s = {
    paymail: e[1].s,
    pubkey: Buffer.from(e[2].b, "base64").toString("hex"),
    signature: e[3].s || "",
    verified: !1
  };
  if (r[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")
    try {
      const a = e[1].lb || e[1].b, i = I.sha256(Qe(a, "base64")), h = k.fromCompact(s.signature, "base64"), c = Z.fromString(s.pubkey), d = Ue(i);
      s.verified = b.verify(d, h, c);
    } catch {
      s.verified = !1;
    }
  m(t, "BITPIC", s);
}, Je = {
  name: "BITPIC",
  address: oe,
  opReturnSchema: Ye,
  handler: Ze
}, Ge = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", ie = [
  { algorithm: "string" },
  { algorithm: "string" },
  { address: "string" },
  { signature: "string" },
  { algorithm: "string" },
  [{ index: "binary" }]
], We = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (!r)
    throw new Error("Invalid HAIP tx. Bad tape");
  if (!n)
    throw new Error("Invalid HAIP tx.");
  return await X(
    ie,
    D.HAIP,
    t,
    e,
    r
    // tx,
  );
}, De = {
  name: "HAIP",
  address: Ge,
  opReturnSchema: ie,
  handler: We
}, N = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", ae = [
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
], Xe = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && Array.isArray(e[r]) && e[r].push(s);
  }
}, je = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && e[r].push(s);
  }
}, et = (t, e) => {
  for (const r of t)
    (r.i === 0 || r.i === 1) && (e.SELECT = "TODO");
}, tt = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        if (!L)
          throw new Error("Msgpack is required but not loaded");
        const n = Buffer.from(r.b, "base64");
        e = L(n);
      } catch {
        e = {};
      }
  return e;
}, rt = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        e = JSON.parse(r.s);
      } catch {
        e = {};
      }
  return e;
}, nt = (t, e) => {
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
}, st = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== N || !e[1] || !e[1].s || !e[2] || !e[2].s)
    throw new Error(`Invalid MAP record: ${JSON.stringify(r, null, 2).substring(0, 100)}`);
  let n = {};
  const s = [];
  let o = 0;
  for (let i = 1; i < e.length; i++)
    e[i].s === ":::" ? o++ : (s[o] || (s[o] = []), e[i].i = s[o].length + 1, s[o].push(e[i]));
  const a = Object.keys(ae[0])[0];
  n[a] = s[0][0].s;
  for (const i of s)
    switch (i.unshift({
      s: N,
      i: 0
    }), i[1].s) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        Xe(i, n);
        break;
      }
      case "REMOVE": {
        n.key = i[2].s;
        break;
      }
      case "DELETE": {
        je(i, n);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        et(i, n);
        break;
      }
      case "MSGPACK": {
        n = tt(i, n);
        break;
      }
      case "JSON": {
        n = rt(i, n);
        break;
      }
      case "SET": {
        nt(i, n);
        break;
      }
    }
  m(t, "MAP", n);
}, ce = {
  name: "MAP",
  address: N,
  opReturnSchema: ae,
  handler: st
}, { toArray: ot, toHex: it } = R, at = "meta", ct = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], Q = async (t, e) => {
  const r = Buffer.from(t + e), n = I.sha256(ot(r));
  return it(n);
}, ft = async ({ dataObj: t, cell: e, tx: r }) => {
  if (!e.length || e[0].s !== "meta" || !e[1] || !e[1].s || !e[2] || !e[2].s || !r)
    throw new Error(`Invalid Metanet tx ${r}`);
  const n = await Q(e[1].s, r.tx.h), s = {
    a: e[1].s,
    tx: r.tx.h,
    id: n
  };
  let o = {
    a: "",
    tx: "",
    id: ""
  };
  if (r.in) {
    const a = await Q(r.in[0].e.a, e[2].s);
    o = {
      a: r.in[0].e.a,
      tx: e[2].s,
      id: a
    };
  }
  t.METANET || (t.METANET = []), t.METANET.push({
    node: s,
    parent: o
  });
}, fe = {
  name: "METANET",
  address: at,
  opReturnSchema: ct,
  handler: ft
}, dt = (t) => {
  if (t.length < 13)
    return !1;
  const e = H(t, (o) => o.ops === "OP_IF"), r = H(t, (o, a) => a > e && o.ops === "OP_ENDIF"), n = t.slice(e, r), s = t[e - 1];
  return (s == null ? void 0 : s.op) === 0 && !!n[0] && !!n[1] && n[1].s === "ord";
}, ht = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const n = H(e, (c) => c.ops === "OP_IF"), s = H(e, (c, d) => d > n && c.ops === "OP_ENDIF") + 1, o = e.slice(n, s);
  if (!o[0] || !o[1] || o[1].s !== "ord")
    throw new Error("Invalid Ord tx. Prefix not found.");
  let a, i;
  if (o.forEach((c, d, u) => {
    c.ops === "OP_1" && (i = u[d + 1].s), c.ops === "OP_0" && (a = u[d + 1].b);
  }), !a)
    throw new Error("Invalid Ord data.");
  if (!i)
    throw new Error("Invalid Ord content type.");
  const h = {
    data: a,
    contentType: i
  };
  t.ORD || (t.ORD = []), t.ORD.push(h);
}, B = {
  name: "ORD",
  handler: ht,
  scriptChecker: dt
};
function H(t, e) {
  return ut(t, e);
}
function ut(t, e, r) {
  const n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  let s = n - 1;
  return gt(t, e, s);
}
function gt(t, e, r, n) {
  let s = r + 1;
  for (; s--; )
    if (e(t[s], s, t))
      return s;
  return -1;
}
const de = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", lt = [
  { pair: "json" },
  { address: "string" },
  { timestamp: "string" }
], pt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== de || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].s || !e[3].s)
    throw new Error(`Invalid RON record ${r == null ? void 0 : r.tx.h}`);
  const n = JSON.parse(e[1].s), s = Number(e[3].s);
  m(t, "RON", {
    pair: n,
    address: e[2].s,
    timestamp: s
  });
}, mt = {
  name: "RON",
  address: de,
  opReturnSchema: lt,
  handler: pt
}, he = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", yt = [{ url: "string" }], bt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== he || !e[1] || !e[1].s)
    throw new Error(`Invalid SymRe tx: ${r}`);
  m(t, "SYMRE", { url: e[1].s });
}, wt = {
  name: "SYMRE",
  address: he,
  opReturnSchema: yt,
  handler: bt
}, ue = /* @__PURE__ */ new Map([]), ge = /* @__PURE__ */ new Map([]), le = /* @__PURE__ */ new Map([]), pe = /* @__PURE__ */ new Map(), me = [
  j,
  ee,
  re,
  ce,
  fe,
  O,
  Le,
  ze,
  Je,
  De,
  mt,
  wt,
  B
], kt = me.map((t) => t.name), Et = [j, ee, re, ce, fe, B];
for (const t of Et)
  t.address && ue.set(t.address, t.name), ge.set(t.name, t.handler), t.opReturnSchema && pe.set(t.name, t.opReturnSchema), t.scriptChecker && le.set(t.name, t.scriptChecker);
class St {
  enabledProtocols;
  protocolHandlers;
  protocolScriptCheckers;
  protocolOpReturnSchemas;
  constructor() {
    this.enabledProtocols = ue, this.protocolHandlers = ge, this.protocolScriptCheckers = le, this.protocolOpReturnSchemas = pe;
  }
  addProtocolHandler({ name: e, address: r, opReturnSchema: n, handler: s, scriptChecker: o }) {
    r && this.enabledProtocols.set(r, e), this.protocolHandlers.set(e, s), n && this.protocolOpReturnSchemas.set(e, n), o && this.protocolScriptCheckers.set(e, o);
  }
  transformTx = async (e) => {
    var n, s, o;
    if (!e || !e.in || !e.out)
      throw new Error("Cannot process tx");
    let r = {
      // Initialize blk with default values
      blk: {
        i: ((n = e.blk) == null ? void 0 : n.i) ?? 0,
        t: ((s = e.blk) == null ? void 0 : s.t) ?? 0,
        h: ((o = e.blk) == null ? void 0 : o.h) ?? ""
      }
    };
    for (const [a, i] of Object.entries(e))
      if (a === "out")
        for (const h of e.out) {
          const { tape: c } = h;
          c != null && c.some((p) => ve(p)) && (r = await this.processDataProtocols(c, h, e, r));
          const d = this.protocolScriptCheckers.get(O.name), u = this.protocolScriptCheckers.get(B.name);
          if (c != null && c.some((p) => {
            const { cell: f } = p;
            if (d != null && d(f) || u != null && u(f))
              return !0;
          }))
            for (const p of c) {
              const { cell: f } = p;
              if (!f)
                throw new Error("empty cell while parsing");
              let g = "";
              if (d != null && d(f))
                g = O.name;
              else if (u != null && u(f))
                g = B.name;
              else
                continue;
              this.process(g, {
                tx: e,
                cell: f,
                dataObj: r,
                tape: c,
                out: h
              });
            }
        }
      else a === "in" ? r[a] = i.map((h) => {
        const c = { ...h };
        return c.tape = void 0, c;
      }) : r[a] = i;
    if (r.METANET && e.parent) {
      const a = {
        ancestor: e.ancestor,
        parent: e.parent,
        child: e.child,
        head: e.head
      };
      r.METANET.push(a), r.ancestor = void 0, r.child = void 0, r.parent = void 0, r.head = void 0, r.node = void 0;
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
  process = async (e, { cell: r, dataObj: n, tape: s, out: o, tx: a }) => {
    if (this.protocolHandlers.has(e) && typeof this.protocolHandlers.get(e) == "function") {
      const i = this.protocolHandlers.get(e);
      i && await i({
        dataObj: n,
        cell: r,
        tape: s,
        out: o,
        tx: a
      });
    } else
      m(n, e, r);
  };
  processDataProtocols = async (e, r, n, s) => {
    for (const o of e) {
      const { cell: a } = o;
      if (!a)
        throw new Error("empty cell while parsing");
      if (J(o))
        continue;
      const i = a[0].s;
      if (i) {
        const h = this.enabledProtocols.get(i);
        h ? await this.process(h, {
          cell: a,
          dataObj: s,
          tape: e,
          out: r,
          tx: n
        }) : this.processUnknown(i, s, r);
      }
    }
    return s;
  };
}
const Pt = async (t) => {
  const e = `https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;
  return console.log("hitting", e), await (await fetch(e)).text();
}, xt = async (t) => await Ee({
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
}), Bt = async (t, e) => {
  if (typeof t == "string") {
    let n;
    if (t.length === 64 && (n = await Pt(t)), Buffer.from(t).byteLength <= 146)
      throw new Error("Invalid rawTx");
    n || (n = t);
    const s = await xt(n);
    if (s)
      t = s;
    else
      throw new Error("Invalid txid");
  }
  const r = new St();
  if (e)
    if (r.enabledProtocols.clear(), Pe(e))
      for (const n of me)
        e != null && e.includes(n.name) && r.addProtocolHandler(n);
    else if (xe(e))
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
  St as BMAP,
  Bt as TransformTx,
  me as allProtocols,
  xt as bobFromRawTx,
  Et as defaultProtocols,
  Pt as fetchRawTx,
  kt as supportedProtocols
};
//# sourceMappingURL=bmap.es.js.map
