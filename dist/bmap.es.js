import { parse as Pe } from "bpu-ts";
import { Script as Se, Hash as A, Signature as B, Utils as k, BSM as b, BigNumber as Y, PublicKey as Z } from "@bsv/sdk";
import { decode as L } from "@msgpack/msgpack";
const xe = (t) => t.length > 0 && t.every((e) => typeof e == "string"), ve = (t) => t.length > 0 && t.every((e) => e === "object"), w = (t, e) => {
  if (!t)
    throw new Error(`cannot get cell value of: ${t}`);
  return e === "string" ? t.s ? t.s : t.ls || "" : e === "hex" ? t.h ? t.h : t.lh || (t.b ? Buffer.from(t.b, "base64").toString("hex") : t.lb && Buffer.from(t.lb, "base64").toString("hex")) || "" : e === "number" ? Number.parseInt(t.h ? t.h : t.lh || "0", 16) : e === "file" ? `bitfs://${t.f ? t.f : t.lf}` : (t.b ? t.b : t.lb) || "";
}, Ie = (t) => t.cell.some((e) => e.op === 106), G = (t) => {
  var r;
  if (t.cell.length !== 2)
    return !1;
  const e = t.cell.findIndex((n) => n.op === 106);
  return e !== -1 ? ((r = t.cell[e - 1]) == null ? void 0 : r.op) === 0 : !1;
}, m = (t, e, r) => {
  t[e] ? t[e].push(r) : t[e] = [r];
}, Ae = (t, e, r, n, s) => {
  const o = {}, a = e.length + 1;
  if (n.length < a)
    throw new Error(
      `${t} requires at least ${a} fields including the prefix: ${s.tx.h}`
    );
  for (const [i, d] of Object.entries(e)) {
    const c = Number.parseInt(i, 10), [f] = Object.keys(d), [u] = Object.values(d);
    o[f] = w(n[c + 1], u);
  }
  m(r, t, o);
}, Be = (t) => {
  const e = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${e}$`, "gi").test(t);
}, K = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), He = (t) => {
  if (t.length !== 12)
    return !1;
  const e = [...t].map((s) => s.ops).splice(2, t.length), r = w(t[1], "hex"), n = Buffer.from(r).byteLength;
  return e[1] = `OP_${n}`, K[1] = `OP_${n}`, e.join() === K.join();
}, Re = ({ dataObj: t, cell: e, out: r }) => {
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
}, C = {
  name: "21E8",
  handler: Re,
  scriptChecker: He
}, { toArray: v, toHex: I, fromBase58Check: F, toBase58Check: V } = k, J = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", D = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }]
];
function ke(t, e, r) {
  if (!Array.isArray(r) || r.length < 3)
    throw new Error("AIP requires at least 3 cells including the prefix");
  let n = -1;
  for (let h = 0; h < r.length; h++)
    if (r[h].cell === e) {
      n = h;
      break;
    }
  if (n === -1)
    throw new Error("AIP could not find cell in tape");
  let s = t.index || [];
  const o = ["6a"];
  for (let h = 0; h < n; h++) {
    const l = r[h];
    if (!G(l)) {
      for (const g of l.cell)
        g.h ? o.push(g.h) : g.b ? o.push(I(v(g.b, "base64"))) : g.s && o.push(I(v(g.s)));
      o.push("7c");
    }
  }
  if (t.hashing_algorithm && t.index_unit_size) {
    const h = t.index_unit_size * 2;
    s = [];
    const l = e[6].h;
    for (let g = 0; g < l.length; g += h)
      s.push(Number.parseInt(l.substr(g, h), 16));
    t.index = s;
  }
  const a = [];
  if (s.length > 0)
    for (const h of s) {
      if (h >= o.length)
        return console.log("[validateSignature] Index out of bounds:", h), !1;
      a.push(v(o[h], "hex"));
    }
  else
    for (const h of o)
      a.push(v(h, "hex"));
  let i;
  if (t.hashing_algorithm) {
    t.index_unit_size || a.shift();
    const h = Se.fromHex(I(a.flat()));
    let l = v(h.toHex(), "hex");
    t.index_unit_size && (l = l.slice(1)), i = A.sha256(l);
  } else
    i = a.flat();
  const d = t.address || t.signing_address;
  if (!d || !t.signature)
    return !1;
  let c;
  try {
    c = B.fromCompact(t.signature, "base64");
  } catch (h) {
    return console.log("[validateSignature] Failed to parse signature:", h), !1;
  }
  const f = () => {
    try {
      const h = b.magicHash(i), l = q(h);
      for (let g = 0; g < 4; g++)
        try {
          const y = c.RecoverPublicKey(g, l), E = y.toHash(), { prefix: P } = F(d);
          if (V(E, P) === d)
            return b.verify(i, c, y);
        } catch (y) {
          console.log("[tryNormalLogic] Recovery error:", y);
        }
    } catch (h) {
      console.log("[tryNormalLogic] error:", h);
    }
    return !1;
  }, u = () => {
    if (a.length <= 2)
      return !1;
    try {
      const h = a.slice(1, -1), l = A.sha256(h.flat()), g = I(l), y = v(g, "utf8"), E = b.magicHash(y), P = q(E);
      for (let S = 0; S < 4; S++)
        try {
          const x = c.RecoverPublicKey(S, P), $ = x.toHash(), { prefix: T } = F(d);
          if (V($, T) === d)
            return b.verify(y, c, x);
        } catch (x) {
          console.log("[tryTwetchLogic] Recovery error:", x);
        }
    } catch (h) {
      console.log("[tryTwetchLogic] error:", h);
    }
    return !1;
  };
  let p = f();
  return p || (p = u()), t.verified = p, p;
}
function q(t) {
  const e = I(t);
  return new Y(e, 16);
}
var W = /* @__PURE__ */ ((t) => (t.HAIP = "HAIP", t.AIP = "AIP", t))(W || {});
const j = async (t, e, r, n, s) => {
  const o = {};
  if (n.length < 4)
    throw new Error("AIP requires at least 4 fields including the prefix");
  for (const [a, i] of Object.entries(t)) {
    const d = Number.parseInt(a, 10);
    if (Array.isArray(i)) {
      const [c] = Object.keys(i[0]), f = [];
      for (let u = d + 1; u < n.length; u++)
        n[u].h && Array.isArray(f) && f.push(Number.parseInt(n[u].h || "", 16));
      o[c] = f;
    } else {
      const [c] = Object.keys(i), [f] = Object.values(i);
      o[c] = w(n[d + 1], f) || "";
    }
  }
  if (n[0].s === J && n[3].s && Be(n[3].s) && (o.signature = n[3].s), !o.signature)
    throw new Error("AIP requires a signature");
  return ke(o, n, s), m(r, e, o), { dataObj: r, cell: n, tape: s };
}, $e = async ({ dataObj: t, cell: e, tape: r }) => {
  if (!r)
    throw new Error("Invalid AIP transaction. tape is required");
  return j(D, "AIP", t, e, r);
}, X = {
  name: "AIP",
  address: J,
  opReturnSchema: D,
  handler: $e
}, Te = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", _ = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], Me = ({ dataObj: t, cell: e, tx: r }) => {
  var o;
  const n = /* @__PURE__ */ new Map();
  if (n.set("utf8", "string"), n.set("text", "string"), n.set("gzip", "binary"), n.set("text/plain", "string"), n.set("image/png", "binary"), n.set("image/jpeg", "binary"), !e[1] || !e[2])
    throw new Error(`Invalid B tx: ${r}`);
  if (e.length > _.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const s = {};
  for (const [a, i] of Object.entries(_)) {
    const d = Number.parseInt(a, 10), c = Object.keys(i)[0];
    let f = Object.values(i)[0];
    if (c === "content")
      if (e[1].f)
        f = "file";
      else if ((!e[3] || !e[3].s) && e[2].s) {
        if (f = n.get(e[2].s), !f) {
          console.warn("Problem inferring encoding. Malformed B data.", e);
          return;
        }
        e[3] || (e[3] = { h: "", b: "", s: "", i: 0, ii: 0 }), e[3].s = f === "string" ? "utf-8" : "binary";
      } else {
        const p = (o = e[3]) != null && o.s ? n.get(e[3].s.replace("-", "").toLowerCase()) : null;
        if (!p) {
          console.warn("Problem inferring encoding. Malformed B data.", e);
          return;
        }
        f = p;
      }
    if (c === "encoding" && !e[d + 1] || c === "filename" && !e[d + 1])
      continue;
    if (!e || !e[d + 1])
      throw new Error(`malformed B syntax ${e}`);
    const u = e[d + 1];
    s[c] = w(u, f);
  }
  m(t, "B", s);
}, ee = {
  name: "B",
  address: Te,
  opReturnSchema: _,
  handler: Me
}, Oe = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", te = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], Ce = ({ dataObj: t, cell: e, tx: r }) => {
  if (!r)
    throw new Error("Invalid BAP tx, tx required");
  Ae("BAP", te, t, e, r);
}, re = {
  name: "BAP",
  address: Oe,
  opReturnSchema: te,
  handler: Ce
}, _e = "$", Ne = [
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
], Le = ({ dataObj: t, cell: e }) => {
  if (!e.length || !e.every((n) => n.s))
    throw new Error("Invalid Bitcom tx");
  const r = e.map((n) => n != null && n.s ? n.s : "");
  m(t, "BITCOM", r);
}, Ke = {
  name: "BITCOM",
  address: _e,
  opReturnSchema: Ne,
  handler: Le
}, { toArray: z, toBase58Check: O, toHex: Fe } = k, { magicHash: Ve } = b, ne = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", se = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function qe(t) {
  const e = Fe(t);
  return new Y(e, 16);
}
function U(t, e) {
  const r = Ve(t), n = qe(r);
  for (let s = 0; s < 4; s++)
    try {
      const o = e.RecoverPublicKey(s, n);
      if (b.verify(t, e, o))
        return o;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const ze = async ({ dataObj: t, cell: e }) => {
  if (e.length < 5)
    throw new Error("Invalid Bitkey tx");
  const r = {};
  for (const [T, M] of Object.entries(se)) {
    const be = Number.parseInt(T, 10), we = Object.keys(M)[0], Ee = Object.values(M)[0];
    r[we] = w(e[be + 1], Ee);
  }
  const n = r.pubkey, o = Z.fromString(n).toHash(), a = O(o), d = Buffer.from(r.paymail).toString("hex") + n, c = Buffer.from(d, "hex"), f = A.sha256(z(c)), u = B.fromCompact(r.bitkey_signature, "base64"), p = U(f, u), h = p.toHash(), l = O(h), g = b.verify(f, u, p) && l === ne, y = z(Buffer.from(n, "utf8")), E = B.fromCompact(r.user_signature, "base64"), P = U(y, E), S = P.toHash(), x = O(S), $ = b.verify(y, E, P) && x === a;
  r.verified = g && $, m(t, "BITKEY", r);
}, Ue = {
  name: "BITKEY",
  address: ne,
  opReturnSchema: se,
  handler: ze
}, { magicHash: Qe } = b, { toArray: Ye } = k, oe = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", Ze = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], Ge = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
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
      const a = e[1].lb || e[1].b, i = A.sha256(Ye(a, "base64")), d = B.fromCompact(s.signature, "base64"), c = Z.fromString(s.pubkey), f = Qe(i);
      s.verified = b.verify(f, d, c);
    } catch {
      s.verified = !1;
    }
  m(t, "BITPIC", s);
}, Je = {
  name: "BITPIC",
  address: oe,
  opReturnSchema: Ze,
  handler: Ge
}, De = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", ie = [
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
  return await j(
    ie,
    W.HAIP,
    t,
    e,
    r
    // tx,
  );
}, je = {
  name: "HAIP",
  address: De,
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
}, et = (t, e) => {
  let r = null;
  for (const n of t) {
    if (n.i === 0 || n.i === 1)
      continue;
    const s = n.s;
    n.i === 2 ? (e[s] = [], r = s) : r && e[r].push(s);
  }
}, tt = (t, e) => {
  for (const r of t)
    (r.i === 0 || r.i === 1) && (e.SELECT = "TODO");
}, rt = (t, e) => {
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
}, nt = (t, e) => {
  for (const r of t)
    if (!(r.i === 0 || r.i === 1) && r.i === 2)
      try {
        e = JSON.parse(r.s);
      } catch {
        e = {};
      }
  return e;
}, st = (t, e) => {
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
}, ot = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== N || !e[1] || !e[1].s || !e[2] || !e[2].s)
    throw new Error(`Invalid MAP record: ${r}`);
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
        et(i, n);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        tt(i, n);
        break;
      }
      case "MSGPACK": {
        n = rt(i, n);
        break;
      }
      case "JSON": {
        n = nt(i, n);
        break;
      }
      case "SET": {
        st(i, n);
        break;
      }
    }
  m(t, "MAP", n);
}, ce = {
  name: "MAP",
  address: N,
  opReturnSchema: ae,
  handler: ot
}, { toArray: it, toHex: at } = k, ct = "meta", ft = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], Q = async (t, e) => {
  const r = Buffer.from(t + e), n = A.sha256(it(r));
  return at(n);
}, dt = async ({ dataObj: t, cell: e, tx: r }) => {
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
  address: ct,
  opReturnSchema: ft,
  handler: dt
}, ht = (t) => {
  if (t.length < 13)
    return !1;
  const e = R(t, (o) => o.ops === "OP_IF"), r = R(t, (o, a) => a > e && o.ops === "OP_ENDIF"), n = t.slice(e, r), s = t[e - 1];
  return (s == null ? void 0 : s.op) === 0 && !!n[0] && !!n[1] && n[1].s === "ord";
}, ut = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const n = R(e, (c) => c.ops === "OP_IF"), s = R(e, (c, f) => f > n && c.ops === "OP_ENDIF") + 1, o = e.slice(n, s);
  if (!o[0] || !o[1] || o[1].s !== "ord")
    throw new Error("Invalid Ord tx. Prefix not found.");
  let a, i;
  if (o.forEach((c, f, u) => {
    c.ops === "OP_1" && (i = u[f + 1].s), c.ops === "OP_0" && (a = u[f + 1].b);
  }), !a)
    throw new Error("Invalid Ord data.");
  if (!i)
    throw new Error("Invalid Ord content type.");
  const d = {
    data: a,
    contentType: i
  };
  t.ORD || (t.ORD = []), t.ORD.push(d);
}, H = {
  name: "ORD",
  handler: ut,
  scriptChecker: ht
};
function R(t, e) {
  return gt(t, e);
}
function gt(t, e, r) {
  const n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  let s = n - 1;
  return lt(t, e, s);
}
function lt(t, e, r, n) {
  let s = r + 1;
  for (; s--; )
    if (e(t[s], s, t))
      return s;
  return -1;
}
const de = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", mt = [
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
}, yt = {
  name: "RON",
  address: de,
  opReturnSchema: mt,
  handler: pt
}, he = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", bt = [{ url: "string" }], wt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== he || !e[1] || !e[1].s)
    throw new Error(`Invalid SymRe tx: ${r}`);
  m(t, "SYMRE", { url: e[1].s });
}, Et = {
  name: "SYMRE",
  address: he,
  opReturnSchema: bt,
  handler: wt
}, ue = /* @__PURE__ */ new Map([]), ge = /* @__PURE__ */ new Map([]), le = /* @__PURE__ */ new Map([]), me = /* @__PURE__ */ new Map(), pe = [
  X,
  ee,
  re,
  ce,
  fe,
  C,
  Ke,
  Ue,
  Je,
  je,
  yt,
  Et,
  H
], Bt = pe.map((t) => t.name), ye = [X, ee, re, ce, fe, H];
for (const t of ye)
  t.address && ue.set(t.address, t.name), ge.set(t.name, t.handler), t.opReturnSchema && me.set(t.name, t.opReturnSchema), t.scriptChecker && le.set(t.name, t.scriptChecker);
class Pt {
  enabledProtocols;
  protocolHandlers;
  protocolScriptCheckers;
  protocolOpReturnSchemas;
  constructor() {
    this.enabledProtocols = ue, this.protocolHandlers = ge, this.protocolScriptCheckers = le, this.protocolOpReturnSchemas = me;
  }
  addProtocolHandler({ name: e, address: r, opReturnSchema: n, handler: s, scriptChecker: o }) {
    r && this.enabledProtocols.set(r, e), this.protocolHandlers.set(e, s), n && this.protocolOpReturnSchemas.set(e, n), o && this.protocolScriptCheckers.set(e, o);
  }
  transformTx = async (e) => {
    if (!e || !e.in || !e.out)
      throw new Error("Cannot process tx");
    let r = {};
    for (const [n, s] of Object.entries(e))
      if (n === "out")
        for (const o of e.out) {
          const { tape: a } = o;
          a != null && a.some((c) => Ie(c)) && (r = await this.processDataProtocols(a, o, e, r));
          const i = this.protocolScriptCheckers.get(C.name), d = this.protocolScriptCheckers.get(H.name);
          if (a != null && a.some((c) => {
            const { cell: f } = c;
            if (i != null && i(f) || d != null && d(f))
              return !0;
          }))
            for (const c of a) {
              const { cell: f } = c;
              if (!f)
                throw new Error("empty cell while parsing");
              let u = "";
              if (i != null && i(f))
                u = C.name;
              else if (d != null && d(f))
                u = H.name;
              else
                continue;
              this.process(u, {
                tx: e,
                cell: f,
                dataObj: r,
                tape: a,
                out: o
              });
            }
        }
      else n === "in" ? r[n] = s.map((o) => {
        const a = { ...o };
        return a.tape = void 0, a;
      }) : r[n] = s;
    if (r.METANET && e.parent) {
      const n = {
        ancestor: e.ancestor,
        parent: e.parent,
        child: e.child,
        head: e.head
      };
      r.METANET.push(n), r.ancestor = void 0, r.child = void 0, r.parent = void 0, r.head = void 0, r.node = void 0;
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
    var o;
    for (const a of e) {
      const { cell: i } = a;
      if (!i)
        throw new Error("empty cell while parsing");
      if (G(a))
        continue;
      const d = i[0].s;
      if (d) {
        const c = this.enabledProtocols.get(d) || ((o = ye.filter((f) => f.name === d)[0]) == null ? void 0 : o.name);
        c ? await this.process(c, {
          cell: i,
          dataObj: s,
          tape: e,
          out: r,
          tx: n
        }) : this.processUnknown(d, s, r);
      }
    }
    return s;
  };
}
const St = async (t) => {
  const e = `https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;
  return console.log("hitting", e), await (await fetch(e)).text();
}, xt = async (t) => await Pe({
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
}), Ht = async (t, e) => {
  if (typeof t == "string") {
    let n;
    if (t.length === 64 && (n = await St(t)), Buffer.from(t).byteLength <= 146)
      throw new Error("Invalid rawTx");
    n || (n = t);
    const s = await xt(n);
    if (s)
      t = s;
    else
      throw new Error("Invalid txid");
  }
  const r = new Pt();
  if (e)
    if (r.enabledProtocols.clear(), xe(e))
      for (const n of pe)
        e != null && e.includes(n.name) && r.addProtocolHandler(n);
    else if (ve(e))
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
  Pt as BMAP,
  Ht as TransformTx,
  pe as allProtocols,
  xt as bobFromRawTx,
  ye as defaultProtocols,
  St as fetchRawTx,
  Bt as supportedProtocols
};
//# sourceMappingURL=bmap.es.js.map
