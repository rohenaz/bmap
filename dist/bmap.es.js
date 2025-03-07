import { parse as Ee } from "bpu-ts";
import { Utils as k, Script as Se, Hash as $, Signature as R, BSM as S, BigNumber as J, PublicKey as G } from "@bsv/sdk";
import { decode as F } from "@msgpack/msgpack";
const { toArray: kt } = k, ve = (t) => t.length > 0 && t.every((e) => typeof e == "string"), xe = (t) => t.length > 0 && t.every((e) => e === "object"), x = (t, e) => {
  if (!t)
    throw new Error(`cannot get cell value of: ${t}`);
  return e === "string" ? t.s ? t.s : t.ls || "" : e === "hex" ? t.h ? t.h : t.lh || (t.b ? Buffer.from(t.b, "base64").toString("hex") : t.lb && Buffer.from(t.lb, "base64").toString("hex")) || "" : e === "number" ? Number.parseInt(t.h ? t.h : t.lh || "0", 16) : e === "file" ? `bitfs://${t.f ? t.f : t.lf}` : e === "binary" ? t.b || t.lb || "" : (t.b ? t.b : t.lb) || "";
}, Pe = (t) => t.cell.some((e) => e.op === 106), D = (t) => {
  var r;
  if (t.cell.length !== 2)
    return !1;
  const e = t.cell.findIndex((n) => n.op === 106);
  return e !== -1 ? ((r = t.cell[e - 1]) == null ? void 0 : r.op) === 0 : !1;
}, w = (t, e, r) => {
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
  const o = {}, c = e.length + 1;
  if (n.length < c)
    throw new Error(
      `${t} requires at least ${c} fields including the prefix: ${s.tx.h}`
    );
  for (const [a, u] of Object.entries(e)) {
    const f = Number.parseInt(a, 10), [d] = Object.keys(u), [l] = Object.values(u);
    o[d] = x(n[f + 1], l);
  }
  w(r, t, o);
}, Ie = (t) => {
  const e = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${e}$`, "gi").test(t);
}, $e = (t, e) => t.length === e.length && t.every((r, n) => r === e[n]), q = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), ke = (t) => {
  if (t.length !== 12)
    return !1;
  const e = [...t].map((s) => s.ops).splice(2, t.length), r = x(t[1], "hex"), n = Buffer.from(r).byteLength;
  return e[1] = `OP_${n}`, q[1] = `OP_${n}`, e.join() === q.join();
}, Be = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
  const n = x(e[0], "hex"), s = x(e[1], "hex");
  if (!s)
    throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0], null, 2)}`);
  const o = Buffer.from(s, "hex").byteLength, c = {
    target: s,
    difficulty: o,
    value: r.e.v,
    txid: n
  };
  w(t, "21E8", c);
}, _ = {
  name: "21E8",
  handler: Be,
  scriptChecker: ke
}, { toArray: y, toHex: H, fromBase58Check: V, toBase58Check: U } = k, W = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", X = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "number[]" }]
];
function He(t, e, r) {
  if (!Array.isArray(r) || r.length < 3)
    throw new Error("AIP requires at least 3 cells including the prefix");
  let n = -1;
  for (let i = 0; i < r.length; i++)
    if ($e(r[i].cell, e)) {
      console.log("[validateSignature] found cell in tape"), n = i;
      break;
    }
  if (n === -1)
    throw new Error("AIP could not find cell in tape");
  console.log(
    "[validateSignature] tape:",
    r.map(
      (i) => i.cell.map(
        (g) => {
          var h, p, v;
          return `c.ii: ${g.ii}, c.h: ${(h = g.h) == null ? void 0 : h.slice(0, 10)}, c.b: ${(p = g.b) == null ? void 0 : p.slice(0, 10)}, c.s: ${(v = g.s) == null ? void 0 : v.slice(0, 10)}`;
        }
      )
    )
  );
  let s = t.index || [];
  const o = [], c = r.flatMap((i) => i.cell).filter((i) => i.ii !== void 0).sort((i, g) => (i.ii || 0) - (g.ii || 0)), a = c[0];
  a == null || a.op, o.push(y("6a", "hex"));
  const u = /* @__PURE__ */ new Map();
  for (const i of c)
    i.ii !== void 0 && u.set(i.ii, i);
  console.log("[validateSignature] All cells in order:");
  for (const i of c)
    console.log(`ii: ${i.ii}, hex: ${i.h}, s: ${i.s}`);
  if (s.length > 0) {
    console.log("[validateSignature] Using indexes:", s);
    for (let i = 0; i < s.length; i++) {
      const g = s[i];
      if (g === 0) continue;
      const h = c.find((p) => (p.ii || 0) === g);
      if (!h) {
        o.push(y("7c", "hex"));
        continue;
      }
      if (h.h)
        o.push(y(h.h, "hex"));
      else if (h.b)
        o.push(y(h.b, "base64"));
      else if (h.s)
        o.push(y(h.s));
      else
        return console.log(`[validateSignature] No usable value found in cell with ii: ${h.ii}`), !1;
    }
  } else
    for (let i = 1; i < n; i++) {
      const g = r[i].cell;
      if (!D({ cell: g })) {
        for (const h of g)
          h.h ? o.push(y(h.h, "hex")) : h.b ? o.push(y(h.b, "base64")) : h.s && o.push(y(h.s));
        o.push(y("7c", "hex"));
      }
    }
  if (t.hashing_algorithm && t.index_unit_size) {
    const i = t.index_unit_size * 2;
    s = [];
    const g = e[6].h;
    for (let h = 0; h < g.length; h += i)
      s.push(Number.parseInt(g.substr(h, i), 16));
    t.index = s;
  }
  console.log(
    "[validateSignature] Final signature values:",
    o.map((i) => H(i))
  );
  let f;
  if (t.hashing_algorithm) {
    t.index_unit_size || o.shift();
    const i = Se.fromHex(H(o.flat()));
    let g = y(i.toHex(), "hex");
    t.index_unit_size && (g = g.slice(1)), f = $.sha256(g);
  } else
    f = o.flat();
  const d = t.address || t.signing_address;
  if (!d || !t.signature)
    return !1;
  let l;
  try {
    l = R.fromCompact(t.signature, "base64");
  } catch (i) {
    return console.log("[validateSignature] Failed to parse signature:", i), !1;
  }
  const m = () => {
    try {
      const i = S.magicHash(f), g = z(i);
      for (let h = 0; h < 4; h++)
        try {
          const p = l.RecoverPublicKey(h, g), v = p.toHash(), { prefix: I } = V(d);
          if (U(v, I) === d)
            return S.verify(f, l, p);
        } catch (p) {
          console.log("[tryNormalLogic] Recovery error:", p);
        }
    } catch (i) {
      console.log("[tryNormalLogic] error:", i);
    }
    return !1;
  }, b = () => {
    if (o.length <= 2)
      return !1;
    try {
      const i = o.slice(1, -1), g = $.sha256(i.flat()), h = H(g), p = y(h, "utf8"), v = S.magicHash(p), I = z(v);
      for (let P = 0; P < 4; P++)
        try {
          const A = l.RecoverPublicKey(P, I), B = A.toHash(), { prefix: C } = V(d);
          if (U(B, C) === d)
            return S.verify(p, l, A);
        } catch (A) {
          console.log("[tryTwetchLogic] Recovery error:", A);
        }
    } catch (i) {
      console.log("[tryTwetchLogic] error:", i);
    }
    return !1;
  };
  let E = m();
  return E || (E = b()), t.verified = E, E;
}
function z(t) {
  const e = H(t);
  return new J(e, 16);
}
var j = /* @__PURE__ */ ((t) => (t.HAIP = "HAIP", t.AIP = "AIP", t))(j || {});
const ee = async (t, e, r, n, s) => {
  const o = {};
  if (n.length < 4)
    throw new Error("AIP requires at least 4 fields including the prefix");
  for (const [c, a] of Object.entries(t)) {
    const u = Number.parseInt(c, 10);
    if (Array.isArray(a)) {
      const [f] = Object.keys(a[0]);
      console.log("[AIPhandler] aipField:", f);
      const d = [];
      for (let l = u + 1; l < n.length; l++)
        n[l].h && Array.isArray(d) && d.push(Number.parseInt(n[l].h || "", 16));
      console.log("[AIPhandler] fieldData:", d), o[f] = d;
    } else {
      const [f] = Object.keys(a), [d] = Object.values(a);
      o[f] = x(n[u + 1], d) || "";
    }
  }
  if (n[0].s === W && n[3].s && Ie(n[3].s) && (o.signature = n[3].s), !o.signature)
    throw new Error("AIP requires a signature");
  return He(o, n, s), w(r, e, o), { dataObj: r, cell: n, tape: s };
}, Re = async ({ dataObj: t, cell: e, tape: r }) => {
  if (!r)
    throw new Error("Invalid AIP transaction. tape is required");
  return ee(X, "AIP", t, e, r);
}, te = {
  name: "AIP",
  address: W,
  opReturnSchema: X,
  handler: Re
}, Te = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", N = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], Me = ({ dataObj: t, cell: e, tx: r }) => {
  var o;
  const n = /* @__PURE__ */ new Map();
  if (n.set("utf8", "string"), n.set("text", "string"), n.set("gzip", "binary"), n.set("text/plain", "string"), n.set("image/png", "binary"), n.set("image/jpeg", "binary"), n.set("application/octet-stream", "binary"), !e[1] || !e[2])
    throw new Error(`Invalid B tx: ${r}`);
  if (e.length > N.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const s = {};
  for (const [c, a] of Object.entries(N)) {
    const u = Number.parseInt(c, 10), f = Object.keys(a)[0];
    let d = Object.values(a)[0];
    if (f === "content")
      if (e[1].f)
        d = "file";
      else if ((!e[3] || !e[3].s) && e[2].s)
        d = n.get(e[2].s), d || (d = "binary"), e[3] || (e[3] = { h: "", b: "", s: "", i: 0, ii: 0 }), e[3].s = d === "string" ? "utf-8" : "binary";
      else {
        const m = (o = e[3]) != null && o.s ? n.get(e[3].s.replace("-", "").toLowerCase()) : null;
        m ? d = m : d = "binary";
      }
    if (f === "encoding" && !e[u + 1] || f === "filename" && !e[u + 1])
      continue;
    if (!e || !e[u + 1])
      throw new Error(`malformed B syntax ${e}`);
    const l = e[u + 1];
    s[f] = x(l, d);
  }
  w(t, "B", s);
}, re = {
  name: "B",
  address: Te,
  opReturnSchema: N,
  handler: Me
}, Ce = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", ne = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], Oe = ({ dataObj: t, cell: e, tx: r }) => {
  if (!r)
    throw new Error("Invalid BAP tx, tx required");
  Ae("BAP", ne, t, e, r);
}, se = {
  name: "BAP",
  address: Ce,
  opReturnSchema: ne,
  handler: Oe
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
  w(t, "BITCOM", r);
}, Ke = {
  name: "BITCOM",
  address: _e,
  opReturnSchema: Ne,
  handler: Le
}, { toArray: Q, toBase58Check: O, toHex: Fe } = k, { magicHash: qe } = S, oe = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", ie = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function Ve(t) {
  const e = Fe(t);
  return new J(e, 16);
}
function Y(t, e) {
  const r = qe(t), n = Ve(r);
  for (let s = 0; s < 4; s++)
    try {
      const o = e.RecoverPublicKey(s, n);
      if (S.verify(t, e, o))
        return o;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const Ue = async ({ dataObj: t, cell: e }) => {
  if (e.length < 5)
    throw new Error("Invalid Bitkey tx");
  const r = {};
  for (const [A, B] of Object.entries(ie)) {
    const C = Number.parseInt(A, 10), K = Object.keys(B)[0], we = Object.values(B)[0];
    r[K] = x(e[C + 1], we);
  }
  const n = r.pubkey, o = G.fromString(n).toHash(), c = O(o), u = Buffer.from(r.paymail).toString("hex") + n, f = Buffer.from(u, "hex"), d = $.sha256(Q(f)), l = R.fromCompact(r.bitkey_signature, "base64"), m = Y(d, l), b = m.toHash(), E = O(b), i = S.verify(d, l, m) && E === oe, g = Q(Buffer.from(n, "utf8")), h = R.fromCompact(r.user_signature, "base64"), p = Y(g, h), v = p.toHash(), I = O(v), P = S.verify(g, h, p) && I === c;
  r.verified = i && P, w(t, "BITKEY", r);
}, ze = {
  name: "BITKEY",
  address: oe,
  opReturnSchema: ie,
  handler: Ue
}, { magicHash: Qe } = S, { toArray: Ye } = k, ae = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", Ze = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], Je = async ({ dataObj: t, cell: e, tape: r, tx: n }) => {
  if (e[0].s !== ae || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].b || !e[3].s || !r)
    throw new Error(`Invalid BITPIC record: ${n}`);
  const s = {
    paymail: e[1].s,
    pubkey: Buffer.from(e[2].b, "base64").toString("hex"),
    signature: e[3].s || "",
    verified: !1
  };
  if (r[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")
    try {
      const c = e[1].lb || e[1].b, a = $.sha256(Ye(c, "base64")), u = R.fromCompact(s.signature, "base64"), f = G.fromString(s.pubkey), d = Qe(a);
      s.verified = S.verify(d, u, f);
    } catch {
      s.verified = !1;
    }
  w(t, "BITPIC", s);
}, Ge = {
  name: "BITPIC",
  address: ae,
  opReturnSchema: Ze,
  handler: Je
}, De = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", ce = [
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
  return await ee(
    ce,
    j.HAIP,
    t,
    e,
    r
    // tx,
  );
}, Xe = {
  name: "HAIP",
  address: De,
  opReturnSchema: ce,
  handler: We
}, L = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", fe = [
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
], je = (t, e) => {
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
        if (!F)
          throw new Error("Msgpack is required but not loaded");
        const n = Buffer.from(r.b, "base64");
        e = F(n);
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
  if (e[0].s !== L || !e[1] || !e[1].s || !e[2] || !e[2].s)
    throw new Error(`Invalid MAP record: ${JSON.stringify(r, null, 2).substring(0, 100)}`);
  let n = {};
  const s = [];
  let o = 0;
  for (let a = 1; a < e.length; a++)
    e[a].s === ":::" ? o++ : (s[o] || (s[o] = []), e[a].i = s[o].length + 1, s[o].push(e[a]));
  const c = Object.keys(fe[0])[0];
  n[c] = s[0][0].s;
  for (const a of s)
    switch (a.unshift({
      s: L,
      i: 0
    }), a[1].s) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        je(a, n);
        break;
      }
      case "REMOVE": {
        n.key = a[2].s;
        break;
      }
      case "DELETE": {
        et(a, n);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        tt(a, n);
        break;
      }
      case "MSGPACK": {
        n = rt(a, n);
        break;
      }
      case "JSON": {
        n = nt(a, n);
        break;
      }
      case "SET": {
        st(a, n);
        break;
      }
    }
  w(t, "MAP", n);
}, de = {
  name: "MAP",
  address: L,
  opReturnSchema: fe,
  handler: ot
}, { toArray: it, toHex: at } = k, ct = "meta", ft = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], Z = async (t, e) => {
  const r = Buffer.from(t + e), n = $.sha256(it(r));
  return at(n);
}, dt = async ({ dataObj: t, cell: e, tx: r }) => {
  if (!e.length || e[0].s !== "meta" || !e[1] || !e[1].s || !e[2] || !e[2].s || !r)
    throw new Error(`Invalid Metanet tx ${r}`);
  const n = await Z(e[1].s, r.tx.h), s = {
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
    const c = await Z(r.in[0].e.a, e[2].s);
    o = {
      a: r.in[0].e.a,
      tx: e[2].s,
      id: c
    };
  }
  t.METANET || (t.METANET = []), t.METANET.push({
    node: s,
    parent: o
  });
}, he = {
  name: "METANET",
  address: ct,
  opReturnSchema: ft,
  handler: dt
}, ht = (t) => {
  if (t.length < 13)
    return !1;
  const e = M(t, (o) => o.ops === "OP_IF"), r = M(t, (o, c) => c > e && o.ops === "OP_ENDIF"), n = t.slice(e, r), s = t[e - 1];
  return (s == null ? void 0 : s.op) === 0 && !!n[0] && !!n[1] && n[1].s === "ord";
}, ut = ({ dataObj: t, cell: e, out: r }) => {
  if (!e[0] || !r)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const n = M(e, (f) => f.ops === "OP_IF"), s = M(e, (f, d) => d > n && f.ops === "OP_ENDIF") + 1, o = e.slice(n, s);
  if (!o[0] || !o[1] || o[1].s !== "ord")
    throw new Error("Invalid Ord tx. Prefix not found.");
  let c, a;
  if (o.forEach((f, d, l) => {
    f.ops === "OP_1" && (a = l[d + 1].s), f.ops === "OP_0" && (c = l[d + 1].b);
  }), !c)
    throw new Error("Invalid Ord data.");
  if (!a)
    throw new Error("Invalid Ord content type.");
  const u = {
    data: c,
    contentType: a
  };
  t.ORD || (t.ORD = []), t.ORD.push(u);
}, T = {
  name: "ORD",
  handler: ut,
  scriptChecker: ht
};
function M(t, e) {
  return lt(t, e);
}
function lt(t, e, r) {
  const n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  let s = n - 1;
  return gt(t, e, s);
}
function gt(t, e, r, n) {
  const { length: s } = t;
  let o = r + 1;
  for (; o--; )
    if (e(t[o], o, t))
      return o;
  return -1;
}
const ue = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", pt = [
  { pair: "json" },
  { address: "string" },
  { timestamp: "string" }
], mt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== ue || !e[1] || !e[2] || !e[3] || !e[1].s || !e[2].s || !e[3].s)
    throw new Error(`Invalid RON record ${r == null ? void 0 : r.tx.h}`);
  const n = JSON.parse(e[1].s), s = Number(e[3].s);
  w(t, "RON", {
    pair: n,
    address: e[2].s,
    timestamp: s
  });
}, yt = {
  name: "RON",
  address: ue,
  opReturnSchema: pt,
  handler: mt
}, le = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", bt = [{ url: "string" }], wt = ({ dataObj: t, cell: e, tx: r }) => {
  if (e[0].s !== le || !e[1] || !e[1].s)
    throw new Error(`Invalid SymRe tx: ${r}`);
  w(t, "SYMRE", { url: e[1].s });
}, Et = {
  name: "SYMRE",
  address: le,
  opReturnSchema: bt,
  handler: wt
}, ge = /* @__PURE__ */ new Map([]), pe = /* @__PURE__ */ new Map([]), me = /* @__PURE__ */ new Map([]), ye = /* @__PURE__ */ new Map(), be = [
  te,
  re,
  se,
  de,
  he,
  _,
  Ke,
  ze,
  Ge,
  Xe,
  yt,
  Et,
  T
], Bt = be.map((t) => t.name), St = [te, re, se, de, he, T];
for (const t of St)
  t.address && ge.set(t.address, t.name), pe.set(t.name, t.handler), t.opReturnSchema && ye.set(t.name, t.opReturnSchema), t.scriptChecker && me.set(t.name, t.scriptChecker);
class vt {
  enabledProtocols;
  protocolHandlers;
  protocolScriptCheckers;
  protocolOpReturnSchemas;
  constructor() {
    this.enabledProtocols = ge, this.protocolHandlers = pe, this.protocolScriptCheckers = me, this.protocolOpReturnSchemas = ye;
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
    for (const [c, a] of Object.entries(e))
      if (c === "out")
        for (const u of e.out) {
          const { tape: f } = u;
          f != null && f.some((m) => Pe(m)) && (r = await this.processDataProtocols(f, u, e, r));
          const d = this.protocolScriptCheckers.get(_.name), l = this.protocolScriptCheckers.get(T.name);
          if (f != null && f.some((m) => {
            const { cell: b } = m;
            if (d != null && d(b) || l != null && l(b))
              return !0;
          }))
            for (const m of f) {
              const { cell: b } = m;
              if (!b)
                throw new Error("empty cell while parsing");
              let E = "";
              if (d != null && d(b))
                E = _.name;
              else if (l != null && l(b))
                E = T.name;
              else
                continue;
              this.process(E, {
                tx: e,
                cell: b,
                dataObj: r,
                tape: f,
                out: u
              });
            }
        }
      else c === "in" ? r[c] = a.map((u) => {
        const f = { ...u };
        return f.tape = void 0, f;
      }) : r[c] = a;
    if (r.METANET && e.parent) {
      const c = {
        ancestor: e.ancestor,
        parent: e.parent,
        child: e.child,
        head: e.head
      };
      r.METANET.push(c), r.ancestor = void 0, r.child = void 0, r.parent = void 0, r.head = void 0, r.node = void 0;
    }
    return r;
  };
  processUnknown = (e, r, n) => {
    e && !r[`_${e}`] && (r[`_${e}`] = []), r[`_${e}`].push({
      i: n.i,
      e: n.e,
      tape: []
    });
  };
  process = async (e, { cell: r, dataObj: n, tape: s, out: o, tx: c }) => {
    if (this.protocolHandlers.has(e) && typeof this.protocolHandlers.get(e) == "function") {
      const a = this.protocolHandlers.get(e);
      a && await a({
        dataObj: n,
        cell: r,
        tape: s,
        out: o,
        tx: c
      });
    } else
      w(n, e, r);
  };
  processDataProtocols = async (e, r, n, s) => {
    for (const o of e) {
      const { cell: c } = o;
      if (!c)
        throw new Error("empty cell while parsing");
      if (D(o))
        continue;
      const a = c[0].s;
      if (a) {
        const u = this.enabledProtocols.get(a);
        u ? await this.process(u, {
          cell: c,
          dataObj: s,
          tape: e,
          out: r,
          tx: n
        }) : this.processUnknown(a, s, r);
      }
    }
    return s;
  };
}
const xt = async (t) => {
  const e = `https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;
  return console.log("hitting", e), await (await fetch(e)).text();
}, Pt = async (t) => await Ee({
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
    if (t.length === 64 && (n = await xt(t)), Buffer.from(t).byteLength <= 146)
      throw new Error("Invalid rawTx");
    n || (n = t);
    const s = await Pt(n);
    if (s)
      t = s;
    else
      throw new Error("Invalid txid");
  }
  const r = new vt();
  if (e)
    if (r.enabledProtocols.clear(), ve(e))
      for (const n of be)
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
  vt as BMAP,
  Ht as TransformTx,
  be as allProtocols,
  Pt as bobFromRawTx,
  St as defaultProtocols,
  xt as fetchRawTx,
  Bt as supportedProtocols
};
//# sourceMappingURL=bmap.es.js.map
