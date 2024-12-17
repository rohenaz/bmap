var le = Object.defineProperty;
var ye = (o, n, a) => n in o ? le(o, n, { enumerable: !0, configurable: !0, writable: !0, value: a }) : o[n] = a;
var O = (o, n, a) => ye(o, typeof n != "symbol" ? n + "" : n, a);
import { parse as de } from "bpu-ts";
import { Hash as z, Signature as G, Utils as j, Script as we, BSM as N, BigNumber as Fr, PublicKey as Tr } from "@bsv/sdk";
import ge from "node-fetch";
import { decode as mr } from "@msgpack/msgpack";
var or = {}, q = {}, xr;
function me() {
  if (xr) return q;
  xr = 1, q.byteLength = s, q.toByteArray = x, q.fromByteArray = R;
  for (var o = [], n = [], a = typeof Uint8Array < "u" ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, y = u.length; f < y; ++f)
    o[f] = u[f], n[u.charCodeAt(f)] = f;
  n[45] = 62, n[95] = 63;
  function h(g) {
    var B = g.length;
    if (B % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var d = g.indexOf("=");
    d === -1 && (d = B);
    var v = d === B ? 0 : 4 - d % 4;
    return [d, v];
  }
  function s(g) {
    var B = h(g), d = B[0], v = B[1];
    return (d + v) * 3 / 4 - v;
  }
  function m(g, B, d) {
    return (B + d) * 3 / 4 - d;
  }
  function x(g) {
    var B, d = h(g), v = d[0], I = d[1], A = new a(m(g, v, I)), S = 0, U = I > 0 ? v - 4 : v, k;
    for (k = 0; k < U; k += 4)
      B = n[g.charCodeAt(k)] << 18 | n[g.charCodeAt(k + 1)] << 12 | n[g.charCodeAt(k + 2)] << 6 | n[g.charCodeAt(k + 3)], A[S++] = B >> 16 & 255, A[S++] = B >> 8 & 255, A[S++] = B & 255;
    return I === 2 && (B = n[g.charCodeAt(k)] << 2 | n[g.charCodeAt(k + 1)] >> 4, A[S++] = B & 255), I === 1 && (B = n[g.charCodeAt(k)] << 10 | n[g.charCodeAt(k + 1)] << 4 | n[g.charCodeAt(k + 2)] >> 2, A[S++] = B >> 8 & 255, A[S++] = B & 255), A;
  }
  function w(g) {
    return o[g >> 18 & 63] + o[g >> 12 & 63] + o[g >> 6 & 63] + o[g & 63];
  }
  function E(g, B, d) {
    for (var v, I = [], A = B; A < d; A += 3)
      v = (g[A] << 16 & 16711680) + (g[A + 1] << 8 & 65280) + (g[A + 2] & 255), I.push(w(v));
    return I.join("");
  }
  function R(g) {
    for (var B, d = g.length, v = d % 3, I = [], A = 16383, S = 0, U = d - v; S < U; S += A)
      I.push(E(g, S, S + A > U ? U : S + A));
    return v === 1 ? (B = g[d - 1], I.push(
      o[B >> 2] + o[B << 4 & 63] + "=="
    )) : v === 2 && (B = (g[d - 2] << 8) + g[d - 1], I.push(
      o[B >> 10] + o[B >> 4 & 63] + o[B << 2 & 63] + "="
    )), I.join("");
  }
  return q;
}
var Q = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Er;
function xe() {
  return Er || (Er = 1, Q.read = function(o, n, a, u, f) {
    var y, h, s = f * 8 - u - 1, m = (1 << s) - 1, x = m >> 1, w = -7, E = a ? f - 1 : 0, R = a ? -1 : 1, g = o[n + E];
    for (E += R, y = g & (1 << -w) - 1, g >>= -w, w += s; w > 0; y = y * 256 + o[n + E], E += R, w -= 8)
      ;
    for (h = y & (1 << -w) - 1, y >>= -w, w += u; w > 0; h = h * 256 + o[n + E], E += R, w -= 8)
      ;
    if (y === 0)
      y = 1 - x;
    else {
      if (y === m)
        return h ? NaN : (g ? -1 : 1) * (1 / 0);
      h = h + Math.pow(2, u), y = y - x;
    }
    return (g ? -1 : 1) * h * Math.pow(2, y - u);
  }, Q.write = function(o, n, a, u, f, y) {
    var h, s, m, x = y * 8 - f - 1, w = (1 << x) - 1, E = w >> 1, R = f === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, g = u ? 0 : y - 1, B = u ? 1 : -1, d = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
    for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (s = isNaN(n) ? 1 : 0, h = w) : (h = Math.floor(Math.log(n) / Math.LN2), n * (m = Math.pow(2, -h)) < 1 && (h--, m *= 2), h + E >= 1 ? n += R / m : n += R * Math.pow(2, 1 - E), n * m >= 2 && (h++, m /= 2), h + E >= w ? (s = 0, h = w) : h + E >= 1 ? (s = (n * m - 1) * Math.pow(2, f), h = h + E) : (s = n * Math.pow(2, E - 1) * Math.pow(2, f), h = 0)); f >= 8; o[a + g] = s & 255, g += B, s /= 256, f -= 8)
      ;
    for (h = h << f | s, x += f; x > 0; o[a + g] = h & 255, g += B, h /= 256, x -= 8)
      ;
    o[a + g - B] |= d * 128;
  }), Q;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Br;
function Ee() {
  return Br || (Br = 1, function(o) {
    var n = me(), a = xe(), u = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    o.Buffer = s, o.SlowBuffer = A, o.INSPECT_MAX_BYTES = 50;
    var f = 2147483647;
    o.kMaxLength = f, s.TYPED_ARRAY_SUPPORT = y(), !s.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function y() {
      try {
        var t = new Uint8Array(1), r = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(t, r), t.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(s.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (s.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(s.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (s.isBuffer(this))
          return this.byteOffset;
      }
    });
    function h(t) {
      if (t > f)
        throw new RangeError('The value "' + t + '" is invalid for option "size"');
      var r = new Uint8Array(t);
      return Object.setPrototypeOf(r, s.prototype), r;
    }
    function s(t, r, e) {
      if (typeof t == "number") {
        if (typeof r == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return E(t);
      }
      return m(t, r, e);
    }
    s.poolSize = 8192;
    function m(t, r, e) {
      if (typeof t == "string")
        return R(t, r);
      if (ArrayBuffer.isView(t))
        return B(t);
      if (t == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t
        );
      if ($(t, ArrayBuffer) || t && $(t.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && ($(t, SharedArrayBuffer) || t && $(t.buffer, SharedArrayBuffer)))
        return d(t, r, e);
      if (typeof t == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      var i = t.valueOf && t.valueOf();
      if (i != null && i !== t)
        return s.from(i, r, e);
      var c = v(t);
      if (c) return c;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof t[Symbol.toPrimitive] == "function")
        return s.from(
          t[Symbol.toPrimitive]("string"),
          r,
          e
        );
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t
      );
    }
    s.from = function(t, r, e) {
      return m(t, r, e);
    }, Object.setPrototypeOf(s.prototype, Uint8Array.prototype), Object.setPrototypeOf(s, Uint8Array);
    function x(t) {
      if (typeof t != "number")
        throw new TypeError('"size" argument must be of type number');
      if (t < 0)
        throw new RangeError('The value "' + t + '" is invalid for option "size"');
    }
    function w(t, r, e) {
      return x(t), t <= 0 ? h(t) : r !== void 0 ? typeof e == "string" ? h(t).fill(r, e) : h(t).fill(r) : h(t);
    }
    s.alloc = function(t, r, e) {
      return w(t, r, e);
    };
    function E(t) {
      return x(t), h(t < 0 ? 0 : I(t) | 0);
    }
    s.allocUnsafe = function(t) {
      return E(t);
    }, s.allocUnsafeSlow = function(t) {
      return E(t);
    };
    function R(t, r) {
      if ((typeof r != "string" || r === "") && (r = "utf8"), !s.isEncoding(r))
        throw new TypeError("Unknown encoding: " + r);
      var e = S(t, r) | 0, i = h(e), c = i.write(t, r);
      return c !== e && (i = i.slice(0, c)), i;
    }
    function g(t) {
      for (var r = t.length < 0 ? 0 : I(t.length) | 0, e = h(r), i = 0; i < r; i += 1)
        e[i] = t[i] & 255;
      return e;
    }
    function B(t) {
      if ($(t, Uint8Array)) {
        var r = new Uint8Array(t);
        return d(r.buffer, r.byteOffset, r.byteLength);
      }
      return g(t);
    }
    function d(t, r, e) {
      if (r < 0 || t.byteLength < r)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (t.byteLength < r + (e || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      var i;
      return r === void 0 && e === void 0 ? i = new Uint8Array(t) : e === void 0 ? i = new Uint8Array(t, r) : i = new Uint8Array(t, r, e), Object.setPrototypeOf(i, s.prototype), i;
    }
    function v(t) {
      if (s.isBuffer(t)) {
        var r = I(t.length) | 0, e = h(r);
        return e.length === 0 || t.copy(e, 0, 0, r), e;
      }
      if (t.length !== void 0)
        return typeof t.length != "number" || ir(t.length) ? h(0) : g(t);
      if (t.type === "Buffer" && Array.isArray(t.data))
        return g(t.data);
    }
    function I(t) {
      if (t >= f)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
      return t | 0;
    }
    function A(t) {
      return +t != t && (t = 0), s.alloc(+t);
    }
    s.isBuffer = function(r) {
      return r != null && r._isBuffer === !0 && r !== s.prototype;
    }, s.compare = function(r, e) {
      if ($(r, Uint8Array) && (r = s.from(r, r.offset, r.byteLength)), $(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), !s.isBuffer(r) || !s.isBuffer(e))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (r === e) return 0;
      for (var i = r.length, c = e.length, p = 0, l = Math.min(i, c); p < l; ++p)
        if (r[p] !== e[p]) {
          i = r[p], c = e[p];
          break;
        }
      return i < c ? -1 : c < i ? 1 : 0;
    }, s.isEncoding = function(r) {
      switch (String(r).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, s.concat = function(r, e) {
      if (!Array.isArray(r))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (r.length === 0)
        return s.alloc(0);
      var i;
      if (e === void 0)
        for (e = 0, i = 0; i < r.length; ++i)
          e += r[i].length;
      var c = s.allocUnsafe(e), p = 0;
      for (i = 0; i < r.length; ++i) {
        var l = r[i];
        if ($(l, Uint8Array))
          p + l.length > c.length ? s.from(l).copy(c, p) : Uint8Array.prototype.set.call(
            c,
            l,
            p
          );
        else if (s.isBuffer(l))
          l.copy(c, p);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        p += l.length;
      }
      return c;
    };
    function S(t, r) {
      if (s.isBuffer(t))
        return t.length;
      if (ArrayBuffer.isView(t) || $(t, ArrayBuffer))
        return t.byteLength;
      if (typeof t != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t
        );
      var e = t.length, i = arguments.length > 2 && arguments[2] === !0;
      if (!i && e === 0) return 0;
      for (var c = !1; ; )
        switch (r) {
          case "ascii":
          case "latin1":
          case "binary":
            return e;
          case "utf8":
          case "utf-8":
            return nr(t).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return e * 2;
          case "hex":
            return e >>> 1;
          case "base64":
            return dr(t).length;
          default:
            if (c)
              return i ? -1 : nr(t).length;
            r = ("" + r).toLowerCase(), c = !0;
        }
    }
    s.byteLength = S;
    function U(t, r, e) {
      var i = !1;
      if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, r >>>= 0, e <= r))
        return "";
      for (t || (t = "utf8"); ; )
        switch (t) {
          case "hex":
            return se(this, r, e);
          case "utf8":
          case "utf-8":
            return fr(this, r, e);
          case "ascii":
            return ie(this, r, e);
          case "latin1":
          case "binary":
            return oe(this, r, e);
          case "base64":
            return te(this, r, e);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ae(this, r, e);
          default:
            if (i) throw new TypeError("Unknown encoding: " + t);
            t = (t + "").toLowerCase(), i = !0;
        }
    }
    s.prototype._isBuffer = !0;
    function k(t, r, e) {
      var i = t[r];
      t[r] = t[e], t[e] = i;
    }
    s.prototype.swap16 = function() {
      var r = this.length;
      if (r % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var e = 0; e < r; e += 2)
        k(this, e, e + 1);
      return this;
    }, s.prototype.swap32 = function() {
      var r = this.length;
      if (r % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var e = 0; e < r; e += 4)
        k(this, e, e + 3), k(this, e + 1, e + 2);
      return this;
    }, s.prototype.swap64 = function() {
      var r = this.length;
      if (r % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var e = 0; e < r; e += 8)
        k(this, e, e + 7), k(this, e + 1, e + 6), k(this, e + 2, e + 5), k(this, e + 3, e + 4);
      return this;
    }, s.prototype.toString = function() {
      var r = this.length;
      return r === 0 ? "" : arguments.length === 0 ? fr(this, 0, r) : U.apply(this, arguments);
    }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(r) {
      if (!s.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
      return this === r ? !0 : s.compare(this, r) === 0;
    }, s.prototype.inspect = function() {
      var r = "", e = o.INSPECT_MAX_BYTES;
      return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
    }, u && (s.prototype[u] = s.prototype.inspect), s.prototype.compare = function(r, e, i, c, p) {
      if ($(r, Uint8Array) && (r = s.from(r, r.offset, r.byteLength)), !s.isBuffer(r))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
        );
      if (e === void 0 && (e = 0), i === void 0 && (i = r ? r.length : 0), c === void 0 && (c = 0), p === void 0 && (p = this.length), e < 0 || i > r.length || c < 0 || p > this.length)
        throw new RangeError("out of range index");
      if (c >= p && e >= i)
        return 0;
      if (c >= p)
        return -1;
      if (e >= i)
        return 1;
      if (e >>>= 0, i >>>= 0, c >>>= 0, p >>>= 0, this === r) return 0;
      for (var l = p - c, b = i - e, F = Math.min(l, b), T = this.slice(c, p), L = r.slice(e, i), P = 0; P < F; ++P)
        if (T[P] !== L[P]) {
          l = T[P], b = L[P];
          break;
        }
      return l < b ? -1 : b < l ? 1 : 0;
    };
    function Y(t, r, e, i, c) {
      if (t.length === 0) return -1;
      if (typeof e == "string" ? (i = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, ir(e) && (e = c ? 0 : t.length - 1), e < 0 && (e = t.length + e), e >= t.length) {
        if (c) return -1;
        e = t.length - 1;
      } else if (e < 0)
        if (c) e = 0;
        else return -1;
      if (typeof r == "string" && (r = s.from(r, i)), s.isBuffer(r))
        return r.length === 0 ? -1 : K(t, r, e, i, c);
      if (typeof r == "number")
        return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? c ? Uint8Array.prototype.indexOf.call(t, r, e) : Uint8Array.prototype.lastIndexOf.call(t, r, e) : K(t, [r], e, i, c);
      throw new TypeError("val must be string, number or Buffer");
    }
    function K(t, r, e, i, c) {
      var p = 1, l = t.length, b = r.length;
      if (i !== void 0 && (i = String(i).toLowerCase(), i === "ucs2" || i === "ucs-2" || i === "utf16le" || i === "utf-16le")) {
        if (t.length < 2 || r.length < 2)
          return -1;
        p = 2, l /= 2, b /= 2, e /= 2;
      }
      function F(wr, gr) {
        return p === 1 ? wr[gr] : wr.readUInt16BE(gr * p);
      }
      var T;
      if (c) {
        var L = -1;
        for (T = e; T < l; T++)
          if (F(t, T) === F(r, L === -1 ? 0 : T - L)) {
            if (L === -1 && (L = T), T - L + 1 === b) return L * p;
          } else
            L !== -1 && (T -= T - L), L = -1;
      } else
        for (e + b > l && (e = l - b), T = e; T >= 0; T--) {
          for (var P = !0, J = 0; J < b; J++)
            if (F(t, T + J) !== F(r, J)) {
              P = !1;
              break;
            }
          if (P) return T;
        }
      return -1;
    }
    s.prototype.includes = function(r, e, i) {
      return this.indexOf(r, e, i) !== -1;
    }, s.prototype.indexOf = function(r, e, i) {
      return Y(this, r, e, i, !0);
    }, s.prototype.lastIndexOf = function(r, e, i) {
      return Y(this, r, e, i, !1);
    };
    function rr(t, r, e, i) {
      e = Number(e) || 0;
      var c = t.length - e;
      i ? (i = Number(i), i > c && (i = c)) : i = c;
      var p = r.length;
      i > p / 2 && (i = p / 2);
      for (var l = 0; l < i; ++l) {
        var b = parseInt(r.substr(l * 2, 2), 16);
        if (ir(b)) return l;
        t[e + l] = b;
      }
      return l;
    }
    function er(t, r, e, i) {
      return W(nr(r, t.length - e), t, e, i);
    }
    function tr(t, r, e, i) {
      return W(fe(r), t, e, i);
    }
    function re(t, r, e, i) {
      return W(dr(r), t, e, i);
    }
    function ee(t, r, e, i) {
      return W(he(r, t.length - e), t, e, i);
    }
    s.prototype.write = function(r, e, i, c) {
      if (e === void 0)
        c = "utf8", i = this.length, e = 0;
      else if (i === void 0 && typeof e == "string")
        c = e, i = this.length, e = 0;
      else if (isFinite(e))
        e = e >>> 0, isFinite(i) ? (i = i >>> 0, c === void 0 && (c = "utf8")) : (c = i, i = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      var p = this.length - e;
      if ((i === void 0 || i > p) && (i = p), r.length > 0 && (i < 0 || e < 0) || e > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      c || (c = "utf8");
      for (var l = !1; ; )
        switch (c) {
          case "hex":
            return rr(this, r, e, i);
          case "utf8":
          case "utf-8":
            return er(this, r, e, i);
          case "ascii":
          case "latin1":
          case "binary":
            return tr(this, r, e, i);
          case "base64":
            return re(this, r, e, i);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ee(this, r, e, i);
          default:
            if (l) throw new TypeError("Unknown encoding: " + c);
            c = ("" + c).toLowerCase(), l = !0;
        }
    }, s.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function te(t, r, e) {
      return r === 0 && e === t.length ? n.fromByteArray(t) : n.fromByteArray(t.slice(r, e));
    }
    function fr(t, r, e) {
      e = Math.min(t.length, e);
      for (var i = [], c = r; c < e; ) {
        var p = t[c], l = null, b = p > 239 ? 4 : p > 223 ? 3 : p > 191 ? 2 : 1;
        if (c + b <= e) {
          var F, T, L, P;
          switch (b) {
            case 1:
              p < 128 && (l = p);
              break;
            case 2:
              F = t[c + 1], (F & 192) === 128 && (P = (p & 31) << 6 | F & 63, P > 127 && (l = P));
              break;
            case 3:
              F = t[c + 1], T = t[c + 2], (F & 192) === 128 && (T & 192) === 128 && (P = (p & 15) << 12 | (F & 63) << 6 | T & 63, P > 2047 && (P < 55296 || P > 57343) && (l = P));
              break;
            case 4:
              F = t[c + 1], T = t[c + 2], L = t[c + 3], (F & 192) === 128 && (T & 192) === 128 && (L & 192) === 128 && (P = (p & 15) << 18 | (F & 63) << 12 | (T & 63) << 6 | L & 63, P > 65535 && P < 1114112 && (l = P));
          }
        }
        l === null ? (l = 65533, b = 1) : l > 65535 && (l -= 65536, i.push(l >>> 10 & 1023 | 55296), l = 56320 | l & 1023), i.push(l), c += b;
      }
      return ne(i);
    }
    var hr = 4096;
    function ne(t) {
      var r = t.length;
      if (r <= hr)
        return String.fromCharCode.apply(String, t);
      for (var e = "", i = 0; i < r; )
        e += String.fromCharCode.apply(
          String,
          t.slice(i, i += hr)
        );
      return e;
    }
    function ie(t, r, e) {
      var i = "";
      e = Math.min(t.length, e);
      for (var c = r; c < e; ++c)
        i += String.fromCharCode(t[c] & 127);
      return i;
    }
    function oe(t, r, e) {
      var i = "";
      e = Math.min(t.length, e);
      for (var c = r; c < e; ++c)
        i += String.fromCharCode(t[c]);
      return i;
    }
    function se(t, r, e) {
      var i = t.length;
      (!r || r < 0) && (r = 0), (!e || e < 0 || e > i) && (e = i);
      for (var c = "", p = r; p < e; ++p)
        c += pe[t[p]];
      return c;
    }
    function ae(t, r, e) {
      for (var i = t.slice(r, e), c = "", p = 0; p < i.length - 1; p += 2)
        c += String.fromCharCode(i[p] + i[p + 1] * 256);
      return c;
    }
    s.prototype.slice = function(r, e) {
      var i = this.length;
      r = ~~r, e = e === void 0 ? i : ~~e, r < 0 ? (r += i, r < 0 && (r = 0)) : r > i && (r = i), e < 0 ? (e += i, e < 0 && (e = 0)) : e > i && (e = i), e < r && (e = r);
      var c = this.subarray(r, e);
      return Object.setPrototypeOf(c, s.prototype), c;
    };
    function C(t, r, e) {
      if (t % 1 !== 0 || t < 0) throw new RangeError("offset is not uint");
      if (t + r > e) throw new RangeError("Trying to access beyond buffer length");
    }
    s.prototype.readUintLE = s.prototype.readUIntLE = function(r, e, i) {
      r = r >>> 0, e = e >>> 0, i || C(r, e, this.length);
      for (var c = this[r], p = 1, l = 0; ++l < e && (p *= 256); )
        c += this[r + l] * p;
      return c;
    }, s.prototype.readUintBE = s.prototype.readUIntBE = function(r, e, i) {
      r = r >>> 0, e = e >>> 0, i || C(r, e, this.length);
      for (var c = this[r + --e], p = 1; e > 0 && (p *= 256); )
        c += this[r + --e] * p;
      return c;
    }, s.prototype.readUint8 = s.prototype.readUInt8 = function(r, e) {
      return r = r >>> 0, e || C(r, 1, this.length), this[r];
    }, s.prototype.readUint16LE = s.prototype.readUInt16LE = function(r, e) {
      return r = r >>> 0, e || C(r, 2, this.length), this[r] | this[r + 1] << 8;
    }, s.prototype.readUint16BE = s.prototype.readUInt16BE = function(r, e) {
      return r = r >>> 0, e || C(r, 2, this.length), this[r] << 8 | this[r + 1];
    }, s.prototype.readUint32LE = s.prototype.readUInt32LE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
    }, s.prototype.readUint32BE = s.prototype.readUInt32BE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
    }, s.prototype.readIntLE = function(r, e, i) {
      r = r >>> 0, e = e >>> 0, i || C(r, e, this.length);
      for (var c = this[r], p = 1, l = 0; ++l < e && (p *= 256); )
        c += this[r + l] * p;
      return p *= 128, c >= p && (c -= Math.pow(2, 8 * e)), c;
    }, s.prototype.readIntBE = function(r, e, i) {
      r = r >>> 0, e = e >>> 0, i || C(r, e, this.length);
      for (var c = e, p = 1, l = this[r + --c]; c > 0 && (p *= 256); )
        l += this[r + --c] * p;
      return p *= 128, l >= p && (l -= Math.pow(2, 8 * e)), l;
    }, s.prototype.readInt8 = function(r, e) {
      return r = r >>> 0, e || C(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
    }, s.prototype.readInt16LE = function(r, e) {
      r = r >>> 0, e || C(r, 2, this.length);
      var i = this[r] | this[r + 1] << 8;
      return i & 32768 ? i | 4294901760 : i;
    }, s.prototype.readInt16BE = function(r, e) {
      r = r >>> 0, e || C(r, 2, this.length);
      var i = this[r + 1] | this[r] << 8;
      return i & 32768 ? i | 4294901760 : i;
    }, s.prototype.readInt32LE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
    }, s.prototype.readInt32BE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
    }, s.prototype.readFloatLE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), a.read(this, r, !0, 23, 4);
    }, s.prototype.readFloatBE = function(r, e) {
      return r = r >>> 0, e || C(r, 4, this.length), a.read(this, r, !1, 23, 4);
    }, s.prototype.readDoubleLE = function(r, e) {
      return r = r >>> 0, e || C(r, 8, this.length), a.read(this, r, !0, 52, 8);
    }, s.prototype.readDoubleBE = function(r, e) {
      return r = r >>> 0, e || C(r, 8, this.length), a.read(this, r, !1, 52, 8);
    };
    function H(t, r, e, i, c, p) {
      if (!s.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (r > c || r < p) throw new RangeError('"value" argument is out of bounds');
      if (e + i > t.length) throw new RangeError("Index out of range");
    }
    s.prototype.writeUintLE = s.prototype.writeUIntLE = function(r, e, i, c) {
      if (r = +r, e = e >>> 0, i = i >>> 0, !c) {
        var p = Math.pow(2, 8 * i) - 1;
        H(this, r, e, i, p, 0);
      }
      var l = 1, b = 0;
      for (this[e] = r & 255; ++b < i && (l *= 256); )
        this[e + b] = r / l & 255;
      return e + i;
    }, s.prototype.writeUintBE = s.prototype.writeUIntBE = function(r, e, i, c) {
      if (r = +r, e = e >>> 0, i = i >>> 0, !c) {
        var p = Math.pow(2, 8 * i) - 1;
        H(this, r, e, i, p, 0);
      }
      var l = i - 1, b = 1;
      for (this[e + l] = r & 255; --l >= 0 && (b *= 256); )
        this[e + l] = r / b & 255;
      return e + i;
    }, s.prototype.writeUint8 = s.prototype.writeUInt8 = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
    }, s.prototype.writeUint16LE = s.prototype.writeUInt16LE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
    }, s.prototype.writeUint16BE = s.prototype.writeUInt16BE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
    }, s.prototype.writeUint32LE = s.prototype.writeUInt32LE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
    }, s.prototype.writeUint32BE = s.prototype.writeUInt32BE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
    }, s.prototype.writeIntLE = function(r, e, i, c) {
      if (r = +r, e = e >>> 0, !c) {
        var p = Math.pow(2, 8 * i - 1);
        H(this, r, e, i, p - 1, -p);
      }
      var l = 0, b = 1, F = 0;
      for (this[e] = r & 255; ++l < i && (b *= 256); )
        r < 0 && F === 0 && this[e + l - 1] !== 0 && (F = 1), this[e + l] = (r / b >> 0) - F & 255;
      return e + i;
    }, s.prototype.writeIntBE = function(r, e, i, c) {
      if (r = +r, e = e >>> 0, !c) {
        var p = Math.pow(2, 8 * i - 1);
        H(this, r, e, i, p - 1, -p);
      }
      var l = i - 1, b = 1, F = 0;
      for (this[e + l] = r & 255; --l >= 0 && (b *= 256); )
        r < 0 && F === 0 && this[e + l + 1] !== 0 && (F = 1), this[e + l] = (r / b >> 0) - F & 255;
      return e + i;
    }, s.prototype.writeInt8 = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
    }, s.prototype.writeInt16LE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
    }, s.prototype.writeInt16BE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
    }, s.prototype.writeInt32LE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
    }, s.prototype.writeInt32BE = function(r, e, i) {
      return r = +r, e = e >>> 0, i || H(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
    };
    function pr(t, r, e, i, c, p) {
      if (e + i > t.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }
    function lr(t, r, e, i, c) {
      return r = +r, e = e >>> 0, c || pr(t, r, e, 4), a.write(t, r, e, i, 23, 4), e + 4;
    }
    s.prototype.writeFloatLE = function(r, e, i) {
      return lr(this, r, e, !0, i);
    }, s.prototype.writeFloatBE = function(r, e, i) {
      return lr(this, r, e, !1, i);
    };
    function yr(t, r, e, i, c) {
      return r = +r, e = e >>> 0, c || pr(t, r, e, 8), a.write(t, r, e, i, 52, 8), e + 8;
    }
    s.prototype.writeDoubleLE = function(r, e, i) {
      return yr(this, r, e, !0, i);
    }, s.prototype.writeDoubleBE = function(r, e, i) {
      return yr(this, r, e, !1, i);
    }, s.prototype.copy = function(r, e, i, c) {
      if (!s.isBuffer(r)) throw new TypeError("argument should be a Buffer");
      if (i || (i = 0), !c && c !== 0 && (c = this.length), e >= r.length && (e = r.length), e || (e = 0), c > 0 && c < i && (c = i), c === i || r.length === 0 || this.length === 0) return 0;
      if (e < 0)
        throw new RangeError("targetStart out of bounds");
      if (i < 0 || i >= this.length) throw new RangeError("Index out of range");
      if (c < 0) throw new RangeError("sourceEnd out of bounds");
      c > this.length && (c = this.length), r.length - e < c - i && (c = r.length - e + i);
      var p = c - i;
      return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, i, c) : Uint8Array.prototype.set.call(
        r,
        this.subarray(i, c),
        e
      ), p;
    }, s.prototype.fill = function(r, e, i, c) {
      if (typeof r == "string") {
        if (typeof e == "string" ? (c = e, e = 0, i = this.length) : typeof i == "string" && (c = i, i = this.length), c !== void 0 && typeof c != "string")
          throw new TypeError("encoding must be a string");
        if (typeof c == "string" && !s.isEncoding(c))
          throw new TypeError("Unknown encoding: " + c);
        if (r.length === 1) {
          var p = r.charCodeAt(0);
          (c === "utf8" && p < 128 || c === "latin1") && (r = p);
        }
      } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
      if (e < 0 || this.length < e || this.length < i)
        throw new RangeError("Out of range index");
      if (i <= e)
        return this;
      e = e >>> 0, i = i === void 0 ? this.length : i >>> 0, r || (r = 0);
      var l;
      if (typeof r == "number")
        for (l = e; l < i; ++l)
          this[l] = r;
      else {
        var b = s.isBuffer(r) ? r : s.from(r, c), F = b.length;
        if (F === 0)
          throw new TypeError('The value "' + r + '" is invalid for argument "value"');
        for (l = 0; l < i - e; ++l)
          this[l + e] = b[l % F];
      }
      return this;
    };
    var ce = /[^+/0-9A-Za-z-_]/g;
    function ue(t) {
      if (t = t.split("=")[0], t = t.trim().replace(ce, ""), t.length < 2) return "";
      for (; t.length % 4 !== 0; )
        t = t + "=";
      return t;
    }
    function nr(t, r) {
      r = r || 1 / 0;
      for (var e, i = t.length, c = null, p = [], l = 0; l < i; ++l) {
        if (e = t.charCodeAt(l), e > 55295 && e < 57344) {
          if (!c) {
            if (e > 56319) {
              (r -= 3) > -1 && p.push(239, 191, 189);
              continue;
            } else if (l + 1 === i) {
              (r -= 3) > -1 && p.push(239, 191, 189);
              continue;
            }
            c = e;
            continue;
          }
          if (e < 56320) {
            (r -= 3) > -1 && p.push(239, 191, 189), c = e;
            continue;
          }
          e = (c - 55296 << 10 | e - 56320) + 65536;
        } else c && (r -= 3) > -1 && p.push(239, 191, 189);
        if (c = null, e < 128) {
          if ((r -= 1) < 0) break;
          p.push(e);
        } else if (e < 2048) {
          if ((r -= 2) < 0) break;
          p.push(
            e >> 6 | 192,
            e & 63 | 128
          );
        } else if (e < 65536) {
          if ((r -= 3) < 0) break;
          p.push(
            e >> 12 | 224,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else if (e < 1114112) {
          if ((r -= 4) < 0) break;
          p.push(
            e >> 18 | 240,
            e >> 12 & 63 | 128,
            e >> 6 & 63 | 128,
            e & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return p;
    }
    function fe(t) {
      for (var r = [], e = 0; e < t.length; ++e)
        r.push(t.charCodeAt(e) & 255);
      return r;
    }
    function he(t, r) {
      for (var e, i, c, p = [], l = 0; l < t.length && !((r -= 2) < 0); ++l)
        e = t.charCodeAt(l), i = e >> 8, c = e % 256, p.push(c), p.push(i);
      return p;
    }
    function dr(t) {
      return n.toByteArray(ue(t));
    }
    function W(t, r, e, i) {
      for (var c = 0; c < i && !(c + e >= r.length || c >= t.length); ++c)
        r[c + e] = t[c];
      return c;
    }
    function $(t, r) {
      return t instanceof r || t != null && t.constructor != null && t.constructor.name != null && t.constructor.name === r.name;
    }
    function ir(t) {
      return t !== t;
    }
    var pe = function() {
      for (var t = "0123456789abcdef", r = new Array(256), e = 0; e < 16; ++e)
        for (var i = e * 16, c = 0; c < 16; ++c)
          r[i + c] = t[e] + t[c];
      return r;
    }();
  }(or)), or;
}
var M = Ee();
const Be = (o) => o.length > 0 && o.every((n) => typeof n == "string"), ve = (o) => o.length > 0 && o.every((n) => n === "object"), D = (o, n) => {
  if (o) {
    if (n === "string")
      return o.s ? o.s : o.ls || "";
    if (n === "hex")
      return o.h ? o.h : o.lh || (o.b ? M.Buffer.from(o.b, "base64").toString("hex") : o.lb && M.Buffer.from(o.lb, "base64").toString("hex")) || "";
    if (n === "number")
      return parseInt(o.h ? o.h : o.lh || "0", 16);
    if (n === "file")
      return `bitfs://${o.f ? o.f : o.lf}`;
  } else throw new Error(`cannot get cell value of: ${o}`);
  return (o.b ? o.b : o.lb) || "";
}, Ae = (o) => o.cell.some((n) => n.op === 106), kr = (o) => {
  var a;
  if (o.cell.length !== 2)
    return !1;
  const n = o.cell.findIndex((u) => u.op === 106);
  return n !== -1 ? ((a = o.cell[n - 1]) == null ? void 0 : a.op) === 0 : !1;
}, _ = (o, n, a) => {
  o[n] ? o[n].push(a) : o[n] = [a];
}, Ie = function(o, n, a, u, f) {
  const y = {}, h = n.length + 1;
  if (u.length < h)
    throw new Error(
      `${o} requires at least ${h} fields including the prefix: ${f.tx.h}`
    );
  for (const [s, m] of Object.entries(n)) {
    const x = parseInt(s, 10), [w] = Object.keys(m), [E] = Object.values(m);
    y[w] = D(u[x + 1], E);
  }
  _(a, o, y);
}, be = function(o) {
  const n = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  return new RegExp(`^${n}$`, "gi").test(o);
}, vr = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(
  " "
), Se = (o) => {
  if (o.length !== 12)
    return !1;
  const n = [...o].map((f) => f.ops).splice(2, o.length), a = D(o[1], "hex"), u = Buffer.from(a).byteLength;
  return n[1] = `OP_${u}`, vr[1] = `OP_${u}`, n.join() === vr.join();
}, Fe = ({ dataObj: o, cell: n, out: a }) => {
  if (!n[0] || !a)
    throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
  const u = D(n[0], "hex"), f = D(n[1], "hex");
  if (!f)
    throw new Error(`Invalid 21e8 target. ${JSON.stringify(n[0], null, 2)}`);
  const y = Buffer.from(f, "hex").byteLength, h = {
    target: f,
    difficulty: y,
    value: a.e.v,
    txid: u
  };
  _(o, "21E8", h);
}, ar = {
  name: "21E8",
  handler: Fe,
  scriptChecker: Se
}, { toArray: V, toHex: Pr, fromBase58Check: Te, toBase58Check: ke } = j, Rr = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva", Ur = [
  { algorithm: "string" },
  { address: "string" },
  { signature: "binary" },
  [{ index: "binary" }]
], Pe = async (o) => {
  try {
    return await (await ge(`https://x.bitfs.network/${o}`)).buffer();
  } catch {
    return M.Buffer.from("");
  }
};
function Re(o) {
  const n = Pr(o);
  return new Fr(n, 16);
}
function Ar(o, n, a) {
  const u = N.magicHash(o), f = Re(u);
  for (let y = 0; y < 4; y++)
    try {
      const h = n.RecoverPublicKey(y, f), s = h.toHash(), { prefix: m } = Te(a), x = ke(s, m);
      if (x === a)
        return console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key"), h;
      console.log("[recoverPublicKeyFromBSM] Trying recovery=", y, "Recovered address=", x, "expected=", a);
    } catch (h) {
      console.log("[recoverPublicKeyFromBSM] Recovery error:", h);
    }
  throw console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address"), new Error("Failed to recover public key matching the expected address");
}
function Ue(o) {
  const n = new we();
  n.chunks.push({ op: 0 }), n.chunks.push({ op: 106 });
  for (const a of o) {
    const u = a.length;
    u <= 75 ? n.chunks.push({ op: u, data: Array.from(a) }) : u <= 255 ? n.chunks.push({ op: 76, data: Array.from(a) }) : u <= 65535 ? n.chunks.push({ op: 77, data: Array.from(a) }) : n.chunks.push({ op: 78, data: Array.from(a) });
  }
  return n;
}
async function Ce(o, n, a) {
  var B;
  if (!Array.isArray(a) || a.length < 3)
    throw new Error("AIP requires at least 3 cells including the prefix");
  let u = -1;
  if (a.forEach((d, v) => {
    d.cell === n && (u = v);
  }), u === -1)
    throw new Error("AIP could not find cell in tape");
  let f = o.index || [];
  const y = ["6a"];
  for (let d = 0; d < u; d++) {
    const v = a[d];
    if (!kr(v)) {
      const I = [];
      for (const A of v.cell) {
        let S;
        if (A.h)
          S = A.h;
        else if (A.f) {
          const U = await Pe(A.f);
          S = U.length > 0 ? U.toString("hex") : void 0;
        } else if (A.b) {
          const U = M.Buffer.from(A.b, "base64");
          U.length > 0 && (S = U.toString("hex"));
        } else A.s && A.s.length > 0 && (S = M.Buffer.from(A.s).toString("hex"));
        S && S.length > 0 && I.push(S);
      }
      I.length > 0 && (y.push(...I), y.push("7c"));
    }
  }
  if (o.hashing_algorithm && o.index_unit_size) {
    const d = o.index_unit_size * 2;
    f = [];
    const v = ((B = n[6]) == null ? void 0 : B.h) || "";
    for (let I = 0; I < v.length; I += d)
      f.push(Number.parseInt(v.substr(I, d), 16));
    o.index = f;
  }
  console.log("usingIndexes", f), console.log("signatureValues", y);
  const h = [];
  if (f.length > 0)
    for (const d of f) {
      if (typeof y[d] != "string" && console.log("signatureValues[idx]", y[d], "idx", d), !y[d])
        return console.log("signatureValues is missing an index", d, "This means indexing is off"), !1;
      h.push(M.Buffer.from(y[d], "hex"));
    }
  else
    for (const d of y)
      h.push(M.Buffer.from(d, "hex"));
  console.log("signatureBufferStatements", h.map((d) => d.toString("hex")));
  let s;
  if (o.hashing_algorithm) {
    o.index_unit_size || h.shift();
    const d = Ue(h);
    let v = M.Buffer.from(d.toHex(), "hex");
    o.index_unit_size && (v = v.slice(1));
    const I = z.sha256(V(v));
    s = M.Buffer.from(I);
  } else
    s = M.Buffer.concat(h);
  const m = o.address || o.signing_address, x = o.signature, w = G.fromCompact(x, "base64"), E = () => {
    console.log("[validateSignature:tryNormalLogic] start");
    try {
      const d = V(s), v = Ar(d, w, m);
      console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const I = N.verify(d, w, v);
      return console.log("[tryNormalLogic] BSM.verify result:", I), I;
    } catch (d) {
      return console.log("[tryNormalLogic] error:", d), !1;
    }
  }, R = () => {
    if (console.log("[validateSignature:tryTwetchLogic] start"), h.length <= 2)
      return !1;
    const d = h.slice(1, -1);
    console.log("[tryTwetchLogic] trimmedStatements count:", d.length);
    const v = z.sha256(V(M.Buffer.concat(d))), I = Pr(v), A = M.Buffer.from(I, "utf8");
    try {
      const S = Ar(V(A), w, m);
      console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");
      const U = N.verify(V(A), w, S);
      return console.log("[tryTwetchLogic] BSM.verify result:", U), U;
    } catch (S) {
      return console.log("[tryTwetchLogic] error:", S), !1;
    }
  };
  let g = E();
  return g || (g = R()), console.log("[validateSignature] final verified=", g), o.verified = g, g;
}
var Cr = /* @__PURE__ */ ((o) => (o.HAIP = "HAIP", o.AIP = "AIP", o))(Cr || {});
const Mr = async (o, n, a, u, f, y) => {
  const h = { verified: !1 };
  if (u.length < 4)
    throw new Error("AIP requires at least 4 fields including the prefix");
  for (const [s, m] of Object.entries(o)) {
    const x = Number.parseInt(s, 10);
    if (Array.isArray(m)) {
      const [w] = Object.keys(m[0]), E = [];
      for (let R = x + 1; R < u.length; R++)
        u[R].h && E.push(Number.parseInt(u[R].h, 16));
      h[w] = E;
    } else {
      const [w] = Object.keys(m), [E] = Object.values(m);
      h[w] = D(u[x + 1], E) || "";
    }
  }
  if (u[0].s === Rr && u[3].s && be(u[3].s) && (h.signature = u[3].s), console.log("[AIPhandler] AIP object before validate:", h), !h.signature)
    throw new Error("AIP requires a signature");
  await Ce(h, u, f), console.log("[AIPhandler] After validate, verified:", h.verified), _(a, n, h);
}, Me = async ({ dataObj: o, cell: n, tape: a, tx: u }) => {
  if (!a)
    throw new Error("Invalid AIP transaction");
  return await Mr(
    Ur,
    "AIP",
    o,
    n,
    a
  );
}, Lr = {
  name: "AIP",
  address: Rr,
  opReturnSchema: Ur,
  handler: Me
}, Le = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", cr = [
  { content: ["string", "binary", "file"] },
  { "content-type": "string" },
  { encoding: "string" },
  // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
  { filename: "string" }
], He = ({ dataObj: o, cell: n, tx: a }) => {
  var y;
  const u = /* @__PURE__ */ new Map();
  if (u.set("utf8", "string"), u.set("text", "string"), u.set("gzip", "binary"), u.set("text/plain", "string"), u.set("image/png", "binary"), u.set("image/jpeg", "binary"), !n[1] || !n[2])
    throw new Error(`Invalid B tx: ${a}`);
  if (n.length > cr.length + 1)
    throw new Error("Invalid B tx. Too many fields.");
  const f = {};
  for (const [h, s] of Object.entries(cr)) {
    const m = Number.parseInt(h, 10), x = Object.keys(s)[0];
    let w = Object.values(s)[0];
    if (x === "content")
      if (n[1].f)
        w = "file";
      else if ((!n[3] || !n[3].s) && n[2].s) {
        if (w = u.get(n[2].s), !w) {
          console.warn("Problem inferring encoding. Malformed B data.", n);
          return;
        }
        n[3] || (n[3] = { h: "", b: "", s: "", i: 0, ii: 0 }), n[3].s = w === "string" ? "utf-8" : "binary";
      } else
        w = (y = n[3]) != null && y.s ? u.get(n[3].s.replace("-", "").toLowerCase()) : null;
    if (x === "encoding" && !n[m + 1] || x === "filename" && !n[m + 1])
      continue;
    if (!n || !n[m + 1])
      throw new Error(`malformed B syntax ${n}`);
    const E = n[m + 1];
    f[x] = D(E, w);
  }
  _(o, "B", f);
}, Hr = {
  name: "B",
  address: Le,
  opReturnSchema: cr,
  handler: He
}, _e = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT", _r = [
  { type: "string" },
  { hash: "string" },
  { sequence: "string" }
], $e = ({ dataObj: o, cell: n, tx: a }) => {
  if (!a)
    throw new Error("Invalid BAP tx, tx required");
  Ie("BAP", _r, o, n, a);
}, $r = {
  name: "BAP",
  address: _e,
  opReturnSchema: _r,
  handler: $e
}, Oe = "$", Ne = [
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
], De = ({ dataObj: o, cell: n }) => {
  if (!n.length || !n.every((u) => u.s))
    throw new Error("Invalid Bitcom tx");
  const a = n.map((u) => u != null && u.s ? u.s : "");
  _(o, "BITCOM", a);
}, Ke = {
  name: "BITCOM",
  address: Oe,
  opReturnSchema: Ne,
  handler: De
}, { toArray: Ir, toBase58Check: sr, toHex: qe } = j, { magicHash: Ve } = N, Or = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC", Nr = [
  { bitkey_signature: "string" },
  { user_signature: "string" },
  { paymail: "string" },
  { pubkey: "string" }
];
function ze(o) {
  const n = qe(o);
  return new Fr(n, 16);
}
function br(o, n) {
  const a = Ve(o), u = ze(a);
  for (let f = 0; f < 4; f++)
    try {
      const y = n.RecoverPublicKey(f, u);
      if (N.verify(o, n, y))
        return y;
    } catch {
    }
  throw new Error("Failed to recover public key from BSM signature");
}
const Ye = async ({ dataObj: o, cell: n }) => {
  if (n.length < 5)
    throw new Error("Invalid Bitkey tx");
  const a = {};
  for (const [Y, K] of Object.entries(Nr)) {
    const rr = Number.parseInt(Y, 10), er = Object.keys(K)[0], tr = Object.values(K)[0];
    a[er] = D(n[rr + 1], tr);
  }
  const u = a.pubkey, y = Tr.fromString(u).toHash(), h = sr(y), m = M.Buffer.from(a.paymail).toString("hex") + u, x = M.Buffer.from(m, "hex"), w = z.sha256(Ir(x)), E = G.fromCompact(a.bitkey_signature, "base64"), R = br(w, E), g = R.toHash(), B = sr(g), d = N.verify(w, E, R) && B === Or, v = Ir(M.Buffer.from(u, "utf8")), I = G.fromCompact(a.user_signature, "base64"), A = br(v, I), S = A.toHash(), U = sr(S), k = N.verify(v, I, A) && U === h;
  a.verified = d && k, _(o, "BITKEY", a);
}, We = {
  name: "BITKEY",
  address: Or,
  opReturnSchema: Nr,
  handler: Ye
}, { magicHash: Je } = N, { toArray: Qe } = j, Dr = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", Ge = [
  { paymail: "string" },
  { pubkey: "binary" },
  { signature: "string" }
], Ze = async ({ dataObj: o, cell: n, tape: a, tx: u }) => {
  if (n[0].s !== Dr || !n[1] || !n[2] || !n[3] || !n[1].s || !n[2].b || !n[3].s || !a)
    throw new Error(`Invalid BITPIC record: ${u}`);
  const f = {
    paymail: n[1].s,
    pubkey: M.Buffer.from(n[2].b, "base64").toString("hex"),
    signature: n[3].s || "",
    verified: !1
  };
  if (a[1].cell[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")
    try {
      const h = n[1].lb || n[1].b, s = z.sha256(Qe(h, "base64")), m = G.fromCompact(f.signature, "base64"), x = Tr.fromString(f.pubkey), w = Je(s);
      f.verified = N.verify(w, m, x);
    } catch {
      f.verified = !1;
    }
  _(o, "BITPIC", f);
}, Xe = {
  name: "BITPIC",
  address: Dr,
  opReturnSchema: Ge,
  handler: Ze
}, je = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3", Kr = [
  { hashing_algorithm: "string" },
  { signing_algorithm: "string" },
  { signing_address: "string" },
  { signature: "string" },
  { index_unit_size: "number" },
  [{ index: "binary" }]
], rt = async ({ dataObj: o, cell: n, tape: a, tx: u }) => {
  if (!a)
    throw new Error("Invalid HAIP tx. Bad tape");
  if (!u)
    throw new Error("Invalid HAIP tx.");
  return await Mr(
    Kr,
    Cr.HAIP,
    o,
    n,
    a
    // tx,
  );
}, et = {
  name: "HAIP",
  address: je,
  opReturnSchema: Kr,
  handler: rt
}, ur = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", qr = [
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
], tt = (o, n) => {
  let a = null;
  for (const u of o) {
    if (u.i === 0 || u.i === 1)
      continue;
    const f = u.s;
    u.i === 2 ? (n[f] = [], a = f) : a && Array.isArray(n[a]) && n[a].push(f);
  }
}, nt = (o, n) => {
  let a = null;
  for (const u of o) {
    if (u.i === 0 || u.i === 1)
      continue;
    const f = u.s;
    u.i === 2 ? (n[f] = [], a = f) : a && n[a].push(f);
  }
}, it = (o, n) => {
  for (const a of o)
    if (a.i === 0 || a.i === 1) {
      n.SELECT = "TODO";
      continue;
    }
}, ot = (o, n) => {
  for (const a of o)
    if (!(a.i === 0 || a.i === 1) && a.i === 2)
      try {
        if (!mr)
          throw new Error("Msgpack is required but not loaded");
        const u = M.Buffer.from(a.b, "base64");
        n = mr(u);
      } catch {
        n = {};
      }
  return n;
}, st = (o, n) => {
  for (const a of o)
    if (!(a.i === 0 || a.i === 1) && a.i === 2)
      try {
        n = JSON.parse(a.s);
      } catch {
        n = {};
      }
  return n;
}, at = (o, n) => {
  let a = null;
  for (const u of o) {
    if (!u.s || u.i === 0 || u.i === 1)
      continue;
    const f = u.s;
    if (u.i % 2 === 0)
      n[f] = "", a = f;
    else {
      if (!a)
        throw new Error(`malformed MAP syntax. Cannot parse.${a}`);
      n[a] = f;
    }
  }
}, ct = ({ dataObj: o, cell: n, tx: a }) => {
  if (n[0].s !== ur || !n[1] || !n[1].s || !n[2] || !n[2].s)
    throw new Error(`Invalid MAP record: ${a}`);
  let u = {};
  const f = [];
  let y = 0;
  for (let s = 1; s < n.length; s++)
    n[s].s === ":::" ? y++ : (f[y] || (f[y] = []), n[s].i = f[y].length + 1, f[y].push(n[s]));
  const h = Object.keys(qr[0])[0];
  u[h] = f[0][0].s;
  for (const s of f)
    switch (s.unshift({
      s: ur,
      i: 0
    }), s[1].s) {
      // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
      case "ADD": {
        tt(s, u);
        break;
      }
      case "REMOVE": {
        u.key = s[2].s;
        break;
      }
      case "DELETE": {
        nt(s, u);
        break;
      }
      case "CLEAR":
        break;
      case "SELECT": {
        it(s, u);
        break;
      }
      case "MSGPACK": {
        u = ot(s, u);
        break;
      }
      case "JSON": {
        u = st(s, u);
        break;
      }
      case "SET": {
        at(s, u);
        break;
      }
    }
  _(o, "MAP", u);
}, Vr = {
  name: "MAP",
  address: ur,
  opReturnSchema: qr,
  handler: ct
}, { toArray: ut, toHex: ft } = j, ht = "meta", pt = [
  { address: "string" },
  { parent: "string" },
  { name: "string" }
], Sr = async (o, n) => {
  const a = M.Buffer.from(o + n), u = z.sha256(ut(a));
  return ft(u);
}, lt = async ({ dataObj: o, cell: n, tx: a }) => {
  if (!n.length || n[0].s !== "meta" || !n[1] || !n[1].s || !n[2] || !n[2].s || !a)
    throw new Error(`Invalid Metanet tx ${a}`);
  const u = await Sr(n[1].s, a.tx.h), f = {
    a: n[1].s,
    tx: a.tx.h,
    id: u
  };
  let y = {};
  if (a.in) {
    const h = await Sr(a.in[0].e.a, n[2].s);
    y = {
      a: a.in[0].e.a,
      tx: n[2].s,
      id: h
    };
  }
  o.METANET || (o.METANET = []), o.METANET.push({
    node: f,
    parent: y
  });
}, zr = {
  name: "METANET",
  address: ht,
  opReturnSchema: pt,
  handler: lt
}, yt = (o) => {
  if (o.length < 13)
    return !1;
  const n = X(o, (y) => y.ops === "OP_IF"), a = X(
    o,
    (y, h) => h > n && y.ops === "OP_ENDIF"
  ), u = o.slice(n, a), f = o[n - 1];
  return (f == null ? void 0 : f.op) === 0 && !!u[0] && !!u[1] && u[1].s == "ord";
}, dt = ({ dataObj: o, cell: n, out: a }) => {
  if (!n[0] || !a)
    throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
  const u = X(n, (x) => x.ops === "OP_IF"), f = X(
    n,
    (x, w) => w > u && x.ops === "OP_ENDIF"
  ) + 1, y = n.slice(u, f);
  if (!y[0] || !y[1] || y[1].s !== "ord")
    throw new Error("Invalid Ord tx. Prefix not found.");
  let h, s;
  if (y.forEach((x, w, E) => {
    x.ops === "OP_1" && (s = E[w + 1].s), x.ops === "OP_0" && (h = E[w + 1].b);
  }), !h)
    throw new Error("Invalid Ord data.");
  if (!s)
    throw new Error("Invalid Ord content type.");
  _(o, "ORD", {
    data: h,
    contentType: s
  });
}, Z = {
  name: "ORD",
  handler: dt,
  scriptChecker: yt
};
function X(o, n) {
  return wt(o, n);
}
function wt(o, n, a) {
  const u = o == null ? 0 : o.length;
  if (!u)
    return -1;
  let f = u - 1;
  return gt(o, n, f);
}
function gt(o, n, a, u) {
  let f = a + 1;
  for (; f--; )
    if (n(o[f], f, o))
      return f;
  return -1;
}
const Yr = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1", mt = [
  { pair: "json" },
  { address: "string" },
  { timestamp: "string" }
], xt = ({ dataObj: o, cell: n, tx: a }) => {
  if (n[0].s !== Yr || !n[1] || !n[2] || !n[3] || !n[1].s || !n[2].s || !n[3].s)
    throw new Error(`Invalid RON record ${a == null ? void 0 : a.tx.h}`);
  const u = JSON.parse(n[1].s), f = Number(n[3].s);
  _(o, "RON", {
    pair: u,
    address: n[2].s,
    timestamp: f
  });
}, Et = {
  name: "RON",
  address: Yr,
  opReturnSchema: mt,
  handler: xt
}, Wr = "1SymRe7erxM46GByucUWnB9fEEMgo7spd", Bt = [{ url: "string" }], vt = ({ dataObj: o, cell: n, tx: a }) => {
  if (n[0].s !== Wr || !n[1] || !n[1].s)
    throw new Error(`Invalid SymRe tx: ${a}`);
  _(o, "SYMRE", { url: n[1].s });
}, At = {
  name: "SYMRE",
  address: Wr,
  opReturnSchema: Bt,
  handler: vt
}, Jr = /* @__PURE__ */ new Map([]), Qr = /* @__PURE__ */ new Map([]), Gr = /* @__PURE__ */ new Map([]), Zr = /* @__PURE__ */ new Map(), Xr = [
  Lr,
  Hr,
  $r,
  Vr,
  zr,
  ar,
  Ke,
  We,
  Xe,
  et,
  Et,
  At,
  Z
], Ut = Xr.map((o) => o.name), jr = [Lr, Hr, $r, Vr, zr, Z];
for (const o of jr)
  o.address && Jr.set(o.address, o.name), Qr.set(o.name, o.handler), o.opReturnSchema && Zr.set(o.name, o.opReturnSchema), o.scriptChecker && Gr.set(o.name, o.scriptChecker);
class It {
  constructor() {
    O(this, "enabledProtocols");
    O(this, "protocolHandlers");
    O(this, "protocolScriptCheckers");
    O(this, "protocolOpReturnSchemas");
    O(this, "transformTx", async (n) => {
      if (!n || !n.in || !n.out)
        throw new Error("Cannot process tx");
      let a = {};
      for (const [u, f] of Object.entries(n))
        if (u === "out")
          for (const y of n.out) {
            const { tape: h } = y;
            h != null && h.some((x) => Ae(x)) && (a = await this.processDataProtocols(h, y, n, a));
            const s = this.protocolScriptCheckers.get(ar.name), m = this.protocolScriptCheckers.get(Z.name);
            if (h != null && h.some((x) => {
              const { cell: w } = x;
              if (s != null && s(w) || m != null && m(w))
                return !0;
            }))
              for (const x of h) {
                const { cell: w } = x;
                if (!w)
                  throw new Error("empty cell while parsing");
                let E = "";
                if (s != null && s(w))
                  E = ar.name;
                else if (m != null && m(w))
                  E = Z.name;
                else
                  continue;
                this.process(E, {
                  tx: n,
                  cell: w,
                  dataObj: a,
                  tape: h,
                  out: y
                });
              }
          }
        else u === "in" ? a[u] = f.map((y) => {
          const h = { ...y };
          return delete h.tape, h;
        }) : a[u] = f;
      if (a.METANET && n.parent) {
        const u = {
          ancestor: n.ancestor,
          parent: n.parent,
          child: n.child,
          head: n.head
        };
        a.METANET.push(u), delete a.ancestor, delete a.child, delete a.parent, delete a.head, delete a.node;
      }
      return a;
    });
    O(this, "processUnknown", (n, a, u) => {
      n && !a[n] && (a[n] = []), a[n].push({
        i: u.i,
        e: u.e,
        tape: []
      });
    });
    O(this, "process", async (n, { cell: a, dataObj: u, tape: f, out: y, tx: h }) => {
      if (this.protocolHandlers.has(n) && typeof this.protocolHandlers.get(n) == "function") {
        const s = this.protocolHandlers.get(n);
        s && await s({
          dataObj: u,
          cell: a,
          tape: f,
          out: y,
          tx: h
        });
      } else
        _(u, n, a);
    });
    O(this, "processDataProtocols", async (n, a, u, f) => {
      var y;
      for (const h of n) {
        const { cell: s } = h;
        if (!s)
          throw new Error("empty cell while parsing");
        if (kr(h))
          continue;
        const m = s[0].s;
        if (m) {
          const x = this.enabledProtocols.get(m) || ((y = jr.filter((w) => w.name === m)[0]) == null ? void 0 : y.name);
          x ? await this.process(x, {
            cell: s,
            dataObj: f,
            tape: n,
            out: a,
            tx: u
          }) : this.processUnknown(m, f, a);
        }
      }
      return f;
    });
    this.enabledProtocols = Jr, this.protocolHandlers = Qr, this.protocolScriptCheckers = Gr, this.protocolOpReturnSchemas = Zr;
  }
  addProtocolHandler({
    name: n,
    address: a,
    opReturnSchema: u,
    handler: f,
    scriptChecker: y
  }) {
    a && this.enabledProtocols.set(a, n), this.protocolHandlers.set(n, f), u && this.protocolOpReturnSchemas.set(n, u), y && this.protocolScriptCheckers.set(n, y);
  }
}
const bt = async (o) => {
  const n = `https://api.whatsonchain.com/v1/bsv/main/tx/${o}/hex`;
  return console.log("hitting", n), await (await fetch(n)).text();
}, St = async (o) => await de({
  tx: { r: o },
  split: [
    {
      token: { op: 106 },
      include: "l"
    },
    {
      token: { s: "|" }
    }
  ]
}), Ct = async (o, n) => {
  if (typeof o == "string") {
    let u;
    if (o.length === 64 && (u = await bt(o)), Buffer.from(o).byteLength <= 146)
      throw new Error("Invalid rawTx");
    u || (u = o);
    const f = await St(u);
    if (f)
      o = f;
    else
      throw new Error("Invalid txid");
  }
  const a = new It();
  if (n)
    if (a.enabledProtocols.clear(), Be(n))
      for (const u of Xr)
        n != null && n.includes(u.name) && a.addProtocolHandler(u);
    else if (ve(n))
      for (const u of n) {
        const f = u;
        f && a.addProtocolHandler(f);
      }
    else
      throw new Error(
        "Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[])."
      );
  return a.transformTx(o);
};
export {
  It as BMAP,
  Ct as TransformTx,
  Xr as allProtocols,
  St as bobFromRawTx,
  jr as defaultProtocols,
  bt as fetchRawTx,
  Ut as supportedProtocols
};
