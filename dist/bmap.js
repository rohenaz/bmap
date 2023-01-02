import {Buffer as $7QDub$Buffer} from "buffer";
import $7QDub$crypto from "crypto";

var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire7c15"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire7c15"] = parcelRequire;
}



var $dCoPe = parcelRequire("dCoPe");
const $9bdd8cec732fb4b1$var$bmap = {
    BMAP: $dCoPe.BMAP,
    TransformTx: $dCoPe.TransformTx,
    supportedProtocols: $dCoPe.supportedProtocols
};
if (typeof window !== "undefined") {
    window.bmap = $9bdd8cec732fb4b1$var$bmap;
    if ((0, $7QDub$crypto) && !window.crypto) window.crypto = (0, $7QDub$crypto);
    // const bm = new BMAP()
    // bm.addProtocolHandler(BOOST)
    // window.bmap.bmap = bm
    if (!window.Buffer) window.Buffer = (0, $7QDub$Buffer);
}
var $9bdd8cec732fb4b1$export$2e2bcd8739ae039 = $9bdd8cec732fb4b1$var$bmap;


export {$9bdd8cec732fb4b1$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=bmap.js.map
