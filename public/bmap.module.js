import {Script as $7AlAh$Script, Bsm as $7AlAh$Bsm, Address as $7AlAh$Address, PubKey as $7AlAh$PubKey} from "@ts-bitcoin/core";
import {Buffer as $7AlAh$Buffer} from "buffer";
import $7AlAh$nodefetch from "node-fetch";
import {webcrypto as $7AlAh$webcrypto} from "crypto";
import {decode as $7AlAh$decode} from "@msgpack/msgpack";
import {PaymailClient as $7AlAh$PaymailClient} from "@moneybutton/paymail-client";
import $7AlAh$dns from "dns";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $414950da4f87d079$exports = {};

$parcel$export($414950da4f87d079$exports, "BMAP", () => $414950da4f87d079$export$894a720e71f90b3c, (v) => $414950da4f87d079$export$894a720e71f90b3c = v);
$parcel$export($414950da4f87d079$exports, "TransformTx", () => $414950da4f87d079$export$b2a90e318402f6bc, (v) => $414950da4f87d079$export$b2a90e318402f6bc = v);
var $98aa1784bfd49640$exports = {};

$parcel$export($98aa1784bfd49640$exports, "AIPhandler", () => $98aa1784bfd49640$export$f0079d0908cdbf96, (v) => $98aa1784bfd49640$export$f0079d0908cdbf96 = v);
$parcel$export($98aa1784bfd49640$exports, "AIP", () => $98aa1784bfd49640$export$474d593e43f12abd, (v) => $98aa1784bfd49640$export$474d593e43f12abd = v);



var $c2053de758ee1450$exports = {};

$parcel$export($c2053de758ee1450$exports, "cellValue", () => $c2053de758ee1450$export$b691916706e0e9cc, (v) => $c2053de758ee1450$export$b691916706e0e9cc = v);
$parcel$export($c2053de758ee1450$exports, "checkOpFalseOpReturn", () => $c2053de758ee1450$export$238b4e54af8fe886, (v) => $c2053de758ee1450$export$238b4e54af8fe886 = v);
$parcel$export($c2053de758ee1450$exports, "saveProtocolData", () => $c2053de758ee1450$export$23dbc584560299c3, (v) => $c2053de758ee1450$export$23dbc584560299c3 = v);
$parcel$export($c2053de758ee1450$exports, "bmapQuerySchemaHandler", () => $c2053de758ee1450$export$9c363cd18b34077b, (v) => $c2053de758ee1450$export$9c363cd18b34077b = v);
$parcel$export($c2053de758ee1450$exports, "isBase64", () => $c2053de758ee1450$export$ca4d6504ca148ae4, (v) => $c2053de758ee1450$export$ca4d6504ca148ae4 = v);
$parcel$export($c2053de758ee1450$exports, "sha256", () => $c2053de758ee1450$export$bced8d2aada2d1c9, (v) => $c2053de758ee1450$export$bced8d2aada2d1c9 = v);


var $c2053de758ee1450$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $c2053de758ee1450$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $c2053de758ee1450$export$b691916706e0e9cc = (pushData, schemaEncoding) => {
    if (!pushData) throw new Error("cannot get cell value of: ".concat(pushData));
    else if (schemaEncoding === "string") return pushData["s"] ? pushData.s : pushData.ls || "";
    else if (schemaEncoding === "hex") return pushData["h"] ? pushData.h : pushData.lh || "";
    else if (schemaEncoding === "number") return Number.parseInt(pushData["h"] ? pushData.h : pushData.lh || "0", 16);
    else if (schemaEncoding === "file") return "bitfs://".concat(pushData["f"] ? pushData.f : pushData.lf);
    return (pushData["b"] ? pushData.b : pushData.lb) || "";
};
var $c2053de758ee1450$export$238b4e54af8fe886 = (cc) => cc.cell[0] && cc.cell[1] && cc.cell[0].op === 0 && cc.cell[1].op && cc.cell[1].op === 106 || cc.cell[0].op === 106;
var $c2053de758ee1450$export$23dbc584560299c3 = (dataObj, protocolName, data) => {
    if (!dataObj[protocolName]) dataObj[protocolName] = [
        data
    ];
    else {
        if (!Array.isArray(dataObj[protocolName])) {
            var prevData = dataObj[protocolName];
            dataObj[protocolName] = [];
            dataObj[protocolName][0] = prevData;
        }
        dataObj[protocolName][dataObj[protocolName].length] = data;
    }
};
var $c2053de758ee1450$export$9c363cd18b34077b = (protocolName, querySchema, dataObj, cell, tape, tx) => {
    // loop over the schema
    var obj = {};
    // Does not have the required number of fields
    var length = querySchema.length + 1;
    if (cell.length < length) throw new Error("".concat(protocolName, " requires at least ").concat(length, " fields including the prefix: ").concat(tx.tx.h));
    for(var _i = 0, _a = Object.entries(querySchema); _i < _a.length; _i++){
        var _b = _a[_i], idx = _b[0], schemaField = _b[1];
        var x = Number.parseInt(idx, 10);
        var field = Object.keys(schemaField)[0];
        var schemaEncoding = Object.values(schemaField)[0];
        obj[field] = $c2053de758ee1450$export$b691916706e0e9cc(cell[x + 1], schemaEncoding);
    }
    $c2053de758ee1450$export$23dbc584560299c3(dataObj, protocolName, obj);
};
var $c2053de758ee1450$export$ca4d6504ca148ae4 = (data) => {
    var regex = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
    return new RegExp("^".concat(regex, "$"), "gi").test(data);
};
var $c2053de758ee1450$export$bced8d2aada2d1c9 = (msgBuffer) => $c2053de758ee1450$var$__awaiter(void 0, void 0, void 0, function() {
        var hash;
        return $c2053de758ee1450$var$__generator(this, (_a) => {
            switch(_a.label){
                case 0:
                    return [
                        4 /*yield*/ ,
                        ((0, $7AlAh$webcrypto) || window.crypto).subtle.digest("SHA-256", msgBuffer)
                    ];
                case 1:
                    hash = _a.sent();
                    return [
                        2 /*return*/ ,
                        (0, $7AlAh$Buffer).from(hash)
                    ];
            }
        });
    });


var $98aa1784bfd49640$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $98aa1784bfd49640$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $98aa1784bfd49640$var$__spreadArray = undefined && undefined.__spreadArray || ((to, from, pack) => {
    if (pack || arguments.length === 2) {
        for(var i = 0, l = from.length, ar; i < l; i++)if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
});
var $98aa1784bfd49640$var$address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
var $98aa1784bfd49640$var$querySchema = [
    {
        algorithm: "string"
    },
    {
        address: "string"
    },
    {
        signature: "binary"
    },
    [
        {
            index: "binary"
        }
    ]
];
var $98aa1784bfd49640$var$getFileBuffer = function(bitfsRef) {
    return $98aa1784bfd49640$var$__awaiter(this, void 0, void 0, function() {
        var fileBuffer, result, e_1;
        return $98aa1784bfd49640$var$__generator(this, (_a) => {
            switch(_a.label){
                case 0:
                    fileBuffer = (0, $7AlAh$Buffer).from("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4 /*yield*/ ,
                        (0, $7AlAh$nodefetch)("https://x.bitfs.network/".concat(bitfsRef), {})
                    ];
                case 2:
                    result = _a.sent();
                    return [
                        4 /*yield*/ ,
                        result.buffer()
                    ];
                case 3:
                    fileBuffer = _a.sent();
                    return [
                        3 /*break*/ ,
                        5
                    ];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [
                        3 /*break*/ ,
                        5
                    ];
                case 5:
                    return [
                        2 /*return*/ ,
                        fileBuffer
                    ];
            }
        });
    });
};
var $98aa1784bfd49640$var$validateSignature = function(aipObj, cell, tape) {
    return $98aa1784bfd49640$var$__awaiter(this, void 0, Promise, function() {
        var cellIndex, usingIndexes, signatureValues, i, cellContainer, nc, statement, fileBuffer, indexLength, indexes, i, signatureBufferStatements, messageBuffer, dataScript, dataBuffer, buff;
        return $98aa1784bfd49640$var$__generator(this, (_a) => {
            switch(_a.label){
                case 0:
                    if (!Array.isArray(tape) || tape.length < 3) throw new Error("AIP requires at least 3 cells including the prefix");
                    cellIndex = -1;
                    tape.forEach((cc, index) => {
                        if (cc.cell === cell) cellIndex = index;
                    });
                    if (cellIndex === -1) throw new Error("AIP could not find cell in tape");
                    usingIndexes = aipObj.index || [];
                    signatureValues = [
                        "6a"
                    ] // OP_RETURN - is included in AIP
                    ;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < cellIndex)) return [
                        3 /*break*/ ,
                        9
                    ];
                    cellContainer = tape[i];
                    if (!!(0, $c2053de758ee1450$exports.checkOpFalseOpReturn)(cellContainer)) return [
                        3 /*break*/ ,
                        8
                    ];
                    nc = 0;
                    _a.label = 2;
                case 2:
                    if (!(nc < cellContainer.cell.length)) return [
                        3 /*break*/ ,
                        7
                    ];
                    statement = cellContainer.cell[nc];
                    if (!statement.h) return [
                        3 /*break*/ ,
                        3
                    ];
                    signatureValues.push(statement.h);
                    return [
                        3 /*break*/ ,
                        6
                    ];
                case 3:
                    if (!statement.f) return [
                        3 /*break*/ ,
                        5
                    ];
                    return [
                        4 /*yield*/ ,
                        $98aa1784bfd49640$var$getFileBuffer(statement.f)
                    ];
                case 4:
                    fileBuffer = _a.sent();
                    signatureValues.push(fileBuffer.toString("hex"));
                    return [
                        3 /*break*/ ,
                        6
                    ];
                case 5:
                    if (statement.b) // no hex? try base64
                    signatureValues.push((0, $7AlAh$Buffer).from(statement.b, "base64").toString("hex"));
                    else if (statement.s) signatureValues.push((0, $7AlAh$Buffer).from(statement.s).toString("hex"));
                    _a.label = 6;
                case 6:
                    nc++;
                    return [
                        3 /*break*/ ,
                        2
                    ];
                case 7:
                    signatureValues.push("7c"); // | hex
                    _a.label = 8;
                case 8:
                    i++;
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 9:
                    if (aipObj.hashing_algorithm) // when using HAIP, we need to parse the indexes in a non standard way
                    // indexLength is byte size of the indexes being described
                    {
                        if (aipObj.index_unit_size) {
                            indexLength = aipObj.index_unit_size * 2;
                            usingIndexes = [];
                            indexes = cell[6].h;
                            for(i = 0; i < indexes.length; i += indexLength)usingIndexes.push(Number.parseInt(indexes.substr(i, indexLength), 16));
                            aipObj.index = usingIndexes;
                        }
                    }
                    signatureBufferStatements = [];
                    // check whether we need to only sign some indexes
                    if (usingIndexes.length > 0) usingIndexes.forEach((index) => {
                        signatureBufferStatements.push((0, $7AlAh$Buffer).from(signatureValues[index], "hex"));
                    });
                    else // add all the values to the signature buffer
                    signatureValues.forEach((statement) => {
                        signatureBufferStatements.push((0, $7AlAh$Buffer).from(statement, "hex"));
                    });
                    if (!aipObj.hashing_algorithm) return [
                        3 /*break*/ ,
                        11
                    ];
                    // this is actually Hashed-AIP (HAIP) and works a bit differently
                    if (!aipObj.index_unit_size) // remove OP_RETURN - will be added by Script.buildDataOut
                    signatureBufferStatements.shift();
                    dataScript = (0, $7AlAh$Script).fromSafeDataArray(signatureBufferStatements);
                    dataBuffer = (0, $7AlAh$Buffer).from(dataScript.toHex(), "hex");
                    if (aipObj.index_unit_size) // the indexed buffer should not contain the OP_RETURN opcode, but this
                    // is added by the buildDataOut function automatically. Remove it.
                    dataBuffer = dataBuffer.slice(1);
                    return [
                        4 /*yield*/ ,
                        (0, $c2053de758ee1450$exports.sha256)((0, $7AlAh$Buffer).from(dataBuffer.toString("hex")))
                    ];
                case 10:
                    messageBuffer = _a.sent();
                    return [
                        3 /*break*/ ,
                        12
                    ];
                case 11:
                    // regular AIP
                    messageBuffer = (0, $7AlAh$Buffer).concat($98aa1784bfd49640$var$__spreadArray([], signatureBufferStatements, true));
                    _a.label = 12;
                case 12:
                    // verify aip signature
                    try {
                        aipObj.verified = (0, $7AlAh$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $7AlAh$Address).fromString(aipObj.address || "") || (0, $7AlAh$Address).fromString(aipObj.signing_address || ""));
                    } catch (e) {
                        aipObj.verified = false;
                    }
                    if (!!aipObj.verified) return [
                        3 /*break*/ ,
                        14
                    ];
                    // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
                    // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")
                    messageBuffer = (0, $7AlAh$Buffer).concat($98aa1784bfd49640$var$__spreadArray([], signatureBufferStatements.slice(1, signatureBufferStatements.length - 1), true));
                    return [
                        4 /*yield*/ ,
                        (0, $c2053de758ee1450$exports.sha256)(messageBuffer)
                    ];
                case 13:
                    buff = _a.sent();
                    messageBuffer = (0, $7AlAh$Buffer).from(buff.toString("hex"));
                    try {
                        aipObj.verified = (0, $7AlAh$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $7AlAh$Address).fromString(aipObj.address || aipObj.signing_address || ""));
                    } catch (e1) {
                        aipObj.verified = false;
                    }
                    _a.label = 14;
                case 14:
                    return [
                        2 /*return*/ ,
                        aipObj.verified || false
                    ];
            }
        });
    });
};
var $98aa1784bfd49640$export$f0079d0908cdbf96 = function(useQuerySchema, protocolName, dataObj, cell, tape, tx) {
    return $98aa1784bfd49640$var$__awaiter(this, void 0, void 0, function() {
        var aipObj, _i, _a, _b, idx, schemaField, x, schemaEncoding, aipField, fieldData, i;
        return $98aa1784bfd49640$var$__generator(this, (_c) => {
            switch(_c.label){
                case 0:
                    aipObj = {};
                    // Does not have the required number of fields
                    if (cell.length < 4) throw new Error("AIP requires at least 4 fields including the prefix " + tx);
                    for(_i = 0, _a = Object.entries(useQuerySchema); _i < _a.length; _i++){
                        _b = _a[_i], idx = _b[0], schemaField = _b[1];
                        x = Number.parseInt(idx, 10);
                        schemaEncoding = void 0;
                        aipField = void 0;
                        if (schemaField instanceof Array) {
                            // signature indexes are specified
                            schemaEncoding = schemaField[0].index;
                            aipField = Object.keys(schemaField[0])[0];
                            fieldData = [];
                            for(i = x + 1; i < cell.length; i++)if (cell[i].h && Array.isArray(fieldData)) fieldData.push(Number.parseInt(cell[i].h || "", 16));
                            aipObj[aipField] = fieldData;
                            continue;
                        } else {
                            aipField = Object.keys(schemaField)[0];
                            schemaEncoding = Object.values(schemaField)[0];
                        }
                        aipObj[aipField] = (0, $c2053de758ee1450$exports.cellValue)(cell[x + 1], schemaEncoding) || "";
                    }
                    // There is an issue where some services add the signature as binary to the transaction
                    // whereas others add the signature as base64. This will confuse bob and the parser and
                    // the signature will not be verified. When the signature is added in binary cell[3].s is
                    // binary, otherwise cell[3].s contains the base64 signature and should be used.
                    if (cell[0].s === $98aa1784bfd49640$var$address && cell[3].s && (0, $c2053de758ee1450$exports.isBase64)(cell[3].s)) aipObj.signature = cell[3].s;
                    if (!aipObj.signature) throw new Error("AIP requires a signature " + tx);
                    return [
                        4 /*yield*/ ,
                        $98aa1784bfd49640$var$validateSignature(aipObj, cell, tape)
                    ];
                case 1:
                    _c.sent();
                    (0, $c2053de758ee1450$exports.saveProtocolData)(dataObj, protocolName, aipObj);
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
};
var $98aa1784bfd49640$var$handler = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tape = _a.tape, tx = _a.tx;
    return $98aa1784bfd49640$var$__awaiter(void 0, void 0, void 0, function() {
        return $98aa1784bfd49640$var$__generator(this, (_b) => {
            switch(_b.label){
                case 0:
                    if (!tape) throw new Error("Invalid AIP transaction. tape is required");
                    if (!tx) throw new Error("Invalid AIP transaction. tx is required");
                    return [
                        4 /*yield*/ ,
                        $98aa1784bfd49640$export$f0079d0908cdbf96($98aa1784bfd49640$var$querySchema, "AIP", dataObj, cell, tape, tx)
                    ];
                case 1:
                    return [
                        2 /*return*/ ,
                        _b.sent()
                    ];
            }
        });
    });
};
var $98aa1784bfd49640$export$474d593e43f12abd = {
    name: "AIP",
    address: $98aa1784bfd49640$var$address,
    querySchema: $98aa1784bfd49640$var$querySchema,
    handler: $98aa1784bfd49640$var$handler
};



var $a429761762b93e1b$var$address = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
var $a429761762b93e1b$var$querySchema = [
    {
        content: [
            "string",
            "binary",
            "file"
        ]
    },
    {
        "content-type": "string"
    },
    {
        encoding: "string"
    },
    {
        filename: "string"
    }
];
var $a429761762b93e1b$var$handler = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tx = _a.tx;
    var encodingMap = new Map();
    encodingMap.set("utf8", "string");
    encodingMap.set("text", "string"); // invalid but people use it :(
    encodingMap.set("gzip", "binary"); // invalid but people use it :(
    encodingMap.set("text/plain", "string");
    encodingMap.set("image/png", "binary");
    encodingMap.set("image/jpeg", "binary");
    if (!cell[1] || !cell[2]) throw new Error("Invalid B tx: ".concat(tx));
    // Check pushdata length + 1 for protocol prefix
    if (cell.length > $a429761762b93e1b$var$querySchema.length + 1) throw new Error("Invalid B tx. Too many fields.");
    // Make sure there are not more fields than possible
    var bObj = {};
    // loop over the schema
    for(var _i = 0, _b = Object.entries($a429761762b93e1b$var$querySchema); _i < _b.length; _i++){
        var _c = _b[_i], idx = _c[0], schemaField = _c[1];
        var x = Number.parseInt(idx, 10);
        var bField = Object.keys(schemaField)[0];
        var schemaEncoding = Object.values(schemaField)[0];
        if (bField === "content") {
            // If the encoding is ommitted, try to infer from content-type instead of breaking
            if (cell[1].f) // this is file reference to B files
            schemaEncoding = "file";
            else if ((!cell[3] || !cell[3].s) && cell[2].s) {
                schemaEncoding = encodingMap.get(cell[2].s);
                if (!schemaEncoding) {
                    console.warn("Problem inferring encoding. Malformed B data.", cell);
                    return;
                }
                // add the missing encoding field
                if (!cell[3]) cell[3] = {
                    h: "",
                    b: "",
                    s: "",
                    i: 0,
                    ii: 0
                };
                cell[3].s = schemaEncoding === "string" ? "utf-8" : "binary";
            } else schemaEncoding = cell[3] && cell[3].s ? encodingMap.get(cell[3].s.replace("-", "").toLowerCase()) : null;
        }
        // encoding is not required
        if (bField === "encoding" && !cell[x + 1]) continue;
        // filename is not required
        if (bField === "filename" && !cell[x + 1]) continue;
        // check for malformed syntax
        if (!cell || !cell[x + 1]) throw new Error("malformed B syntax " + cell);
        // set field value from either s, b, ls, or lb depending on encoding and availability
        var data = cell[x + 1];
        bObj[bField] = (0, $c2053de758ee1450$exports.cellValue)(data, schemaEncoding);
    }
    (0, $c2053de758ee1450$exports.saveProtocolData)(dataObj, "B", bObj);
};
var $a429761762b93e1b$export$ef35774e6d314e91 = {
    name: "B",
    address: $a429761762b93e1b$var$address,
    querySchema: $a429761762b93e1b$var$querySchema,
    handler: $a429761762b93e1b$var$handler
};



var $0d2672e9817499e3$var$address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";
var $0d2672e9817499e3$var$querySchema = [
    {
        type: "string"
    },
    {
        hash: "string"
    },
    {
        sequence: "string"
    }
];
var $0d2672e9817499e3$export$c3c52e219617878 = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tape = _a.tape, tx = _a.tx;
    if (!tape) throw new Error("Invalid BAP tx, tape required");
    if (!tx) throw new Error("Invalid BAP tx, tx required");
    (0, $c2053de758ee1450$exports.bmapQuerySchemaHandler)("BAP", $0d2672e9817499e3$var$querySchema, dataObj, cell, tape, tx);
};
var $0d2672e9817499e3$export$5935ea4bf04c4453 = {
    name: "BAP",
    address: $0d2672e9817499e3$var$address,
    querySchema: $0d2672e9817499e3$var$querySchema,
    handler: $0d2672e9817499e3$export$c3c52e219617878
};


var $e22c244abfee4b98$exports = {};

$parcel$export($e22c244abfee4b98$exports, "HAIP", () => $e22c244abfee4b98$export$12815d889fe90b8, (v) => $e22c244abfee4b98$export$12815d889fe90b8 = v);

var $e22c244abfee4b98$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $e22c244abfee4b98$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $e22c244abfee4b98$var$address = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3";
var $e22c244abfee4b98$var$querySchema = [
    {
        hashing_algorithm: "string"
    },
    {
        signing_algorithm: "string"
    },
    {
        signing_address: "string"
    },
    {
        signature: "string"
    },
    {
        index_unit_size: "number"
    },
    [
        {
            index: "binary"
        }
    ]
];
// https://github.com/torusJKL/BitcoinBIPs/blob/master/HAIP.md
var $e22c244abfee4b98$var$handler = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tape = _a.tape, tx = _a.tx;
    return $e22c244abfee4b98$var$__awaiter(void 0, void 0, void 0, function() {
        return $e22c244abfee4b98$var$__generator(this, (_b) => {
            switch(_b.label){
                case 0:
                    if (!tape) throw new Error("Invalid HAIP tx. Bad tape");
                    if (!tx) throw new Error("Invalid HAIP tx.");
                    return [
                        4 /*yield*/ ,
                        (0, $98aa1784bfd49640$exports.AIPhandler)($e22c244abfee4b98$var$querySchema, "HAIP", dataObj, cell, tape, tx)
                    ];
                case 1:
                    return [
                        2 /*return*/ ,
                        _b.sent()
                    ];
            }
        });
    });
};
var $e22c244abfee4b98$export$12815d889fe90b8 = {
    name: "HAIP",
    address: $e22c244abfee4b98$var$address,
    querySchema: $e22c244abfee4b98$var$querySchema,
    handler: $e22c244abfee4b98$var$handler
};





var $5a1837533efd883a$var$address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
var $5a1837533efd883a$var$querySchema = [
    {
        cmd: {
            SET: [
                {
                    key: "string"
                },
                {
                    val: "string"
                }
            ],
            SELECT: [
                {
                    tx: "string"
                }
            ],
            ADD: [
                {
                    key: "string"
                },
                [
                    {
                        val: "string"
                    }
                ]
            ],
            DELETE: [
                {
                    key: "string"
                },
                [
                    {
                        val: "string"
                    }
                ]
            ],
            JSON: "string",
            REMOVE: [
                [
                    {
                        key: "string"
                    }
                ]
            ],
            CLEAR: [
                [
                    {
                        txid: "string"
                    }
                ]
            ]
        }
    }
];
var $5a1837533efd883a$var$processADD = (cell, mapObj) => {
    var last = null;
    for(var _i = 0, cell_1 = cell; _i < cell_1.length; _i++){
        var pushdataContainer = cell_1[_i];
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        var pushdata = pushdataContainer.s;
        if (pushdataContainer.i === 2) {
            // Key name
            mapObj[pushdata] = [];
            last = pushdata;
        } else if (last && Array.isArray(mapObj[last])) mapObj[last].push(pushdata);
    }
};
var $5a1837533efd883a$var$proccessDELETE = (cell, mapObj) => {
    var last = null;
    for(var _i = 0, cell_2 = cell; _i < cell_2.length; _i++){
        var pushdataContainer = cell_2[_i];
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        var pushdata = pushdataContainer.s;
        if (pushdataContainer.i === 2) {
            // Key name
            mapObj[pushdata] = [];
            last = pushdata;
        } else if (last) mapObj[last].push(pushdata);
    }
};
var $5a1837533efd883a$var$processSELECT = (cell, mapObj) => {
    // TODO
    // console.log('MAP SELECT');
    for(var _i = 0, cell_3 = cell; _i < cell_3.length; _i++){
        var pushdataContainer = cell_3[_i];
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
            mapObj.SELECT = "TODO";
            continue;
        }
    }
};
var $5a1837533efd883a$var$processMSGPACK = (cell, mapObj) => {
    for(var _i = 0, cell_4 = cell; _i < cell_4.length; _i++){
        var pushdataContainer = cell_4[_i];
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            if (!(0, $7AlAh$decode)) throw new Error("Msgpack is required but not loaded");
            var buff = (0, $7AlAh$Buffer).from(pushdataContainer.b, "base64");
            mapObj = (0, $7AlAh$decode)(buff);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
var $5a1837533efd883a$var$processJSON = (cell, mapObj) => {
    for(var _i = 0, cell_5 = cell; _i < cell_5.length; _i++){
        var pushdataContainer = cell_5[_i];
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            mapObj = JSON.parse(pushdataContainer.s);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
var $5a1837533efd883a$var$processSET = (cell, mapObj) => {
    var last = null;
    for(var _i = 0, cell_6 = cell; _i < cell_6.length; _i++){
        var pushdataContainer = cell_6[_i];
        // ignore MAP command
        if (!pushdataContainer.s || pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        var pushdata = pushdataContainer.s;
        if (pushdataContainer.i % 2 === 0) {
            // key
            mapObj[pushdata] = "";
            last = pushdata;
        } else {
            // value
            if (!last) throw new Error("malformed MAP syntax. Cannot parse.".concat(last));
            mapObj[last] = pushdata;
        }
    }
};
var $5a1837533efd883a$var$handler = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tx = _a.tx;
    // Validate
    if (cell[0].s !== $5a1837533efd883a$var$address || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) throw new Error("Invalid MAP record: ".concat(tx));
    var mapObj = {};
    // parse the protocol separator
    var commands = [];
    var commandSeparator = 0;
    for(var i = 1; i < cell.length; i++)if (cell[i].s === ":::") commandSeparator++;
    else {
        if (!commands[commandSeparator]) commands[commandSeparator] = [];
        cell[i].i = commands[commandSeparator].length + 1;
        commands[commandSeparator].push(cell[i]);
    }
    // Get the MAP command key name from the query schema
    var mapCmdKey = Object.keys($5a1837533efd883a$var$querySchema[0])[0];
    // Add the firt MAP command in the response object
    mapObj[mapCmdKey] = commands[0][0].s;
    commands.forEach((cc) => {
        // re-add the MAP address
        cc.unshift({
            s: $5a1837533efd883a$var$address,
            i: 0
        });
        var command = cc[1].s;
        // Individual parsing rules for each MAP command
        switch(command){
            // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
            case "ADD":
                $5a1837533efd883a$var$processADD(cc, mapObj);
                break;
            case "REMOVE":
                mapObj.key = cc[2].s;
                break;
            case "DELETE":
                $5a1837533efd883a$var$proccessDELETE(cc, mapObj);
                break;
            case "CLEAR":
                break;
            case "SELECT":
                $5a1837533efd883a$var$processSELECT(cc, mapObj);
                break;
            case "MSGPACK":
                mapObj = $5a1837533efd883a$var$processMSGPACK(cc, mapObj);
                break;
            case "JSON":
                mapObj = $5a1837533efd883a$var$processJSON(cc, mapObj);
                break;
            case "SET":
                $5a1837533efd883a$var$processSET(cc, mapObj);
                break;
            default:
        }
    });
    (0, $c2053de758ee1450$exports.saveProtocolData)(dataObj, "MAP", mapObj);
};
var $5a1837533efd883a$export$ce970371e0e850bc = {
    name: "MAP",
    address: $5a1837533efd883a$var$address,
    querySchema: $5a1837533efd883a$var$querySchema,
    handler: $5a1837533efd883a$var$handler
};


var $1dadca38d7be2882$exports = {};

$parcel$export($1dadca38d7be2882$exports, "METANET", () => $1dadca38d7be2882$export$7830a85a59ca4593, (v) => $1dadca38d7be2882$export$7830a85a59ca4593 = v);


var $1dadca38d7be2882$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $1dadca38d7be2882$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $1dadca38d7be2882$var$address = "meta";
var $1dadca38d7be2882$var$querySchema = [
    {
        address: "string"
    },
    {
        parent: "string"
    },
    {
        name: "string"
    }
];
var $1dadca38d7be2882$export$3eb18141230d6532 = function(a, tx) {
    return $1dadca38d7be2882$var$__awaiter(this, void 0, void 0, function() {
        var buf, hashBuf;
        return $1dadca38d7be2882$var$__generator(this, (_a) => {
            switch(_a.label){
                case 0:
                    buf = (0, $7AlAh$Buffer).from(a + tx);
                    return [
                        4 /*yield*/ ,
                        (0, $c2053de758ee1450$exports.sha256)(buf)
                    ];
                case 1:
                    hashBuf = _a.sent();
                    return [
                        2 /*return*/ ,
                        hashBuf.toString("hex")
                    ];
            }
        });
    });
};
var $1dadca38d7be2882$var$handler = (_a) => {
    var dataObj = _a.dataObj, cell = _a.cell, tx = _a.tx;
    return $1dadca38d7be2882$var$__awaiter(void 0, void 0, void 0, function() {
        var nodeId, node, parent, parentId;
        return $1dadca38d7be2882$var$__generator(this, (_b) => {
            switch(_b.label){
                case 0:
                    if (!cell.length || cell[0].s !== "meta" || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s || !tx) throw new Error("Invalid Metanet tx " + tx);
                    return [
                        4 /*yield*/ ,
                        $1dadca38d7be2882$export$3eb18141230d6532(cell[1].s, tx.tx.h)
                    ];
                case 1:
                    nodeId = _b.sent();
                    node = {
                        a: cell[1].s,
                        tx: tx.tx.h,
                        id: nodeId
                    };
                    parent = {};
                    if (!tx.in) return [
                        3 /*break*/ ,
                        3
                    ];
                    return [
                        4 /*yield*/ ,
                        $1dadca38d7be2882$export$3eb18141230d6532(tx.in[0].e.a, cell[2].s)
                    ];
                case 2:
                    parentId = _b.sent();
                    // Parent node
                    parent = {
                        a: tx.in[0].e.a,
                        tx: cell[2].s,
                        id: parentId
                    };
                    _b.label = 3;
                case 3:
                    if (!dataObj.METANET) dataObj.METANET = [];
                    dataObj.METANET.push({
                        node: node,
                        parent: parent
                    });
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
};
var $1dadca38d7be2882$export$7830a85a59ca4593 = {
    name: "METANET",
    address: $1dadca38d7be2882$var$address,
    querySchema: $1dadca38d7be2882$var$querySchema,
    handler: $1dadca38d7be2882$var$handler
};


var $b57223da72fa21e9$exports = {};

$parcel$export($b57223da72fa21e9$exports, "PSP", () => $b57223da72fa21e9$export$bd49ff9d0c7fbe97, (v) => $b57223da72fa21e9$export$bd49ff9d0c7fbe97 = v);


var $cd237abf67628bc8$exports = {};

$parcel$export($cd237abf67628bc8$exports, "verifyPaymailPublicKey", () => $cd237abf67628bc8$export$fe8725667d42151, (v) => $cd237abf67628bc8$export$fe8725667d42151 = v);



var $cd237abf67628bc8$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $cd237abf67628bc8$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $cd237abf67628bc8$export$fe8725667d42151 = function(paymail, publicKey) {
    return $cd237abf67628bc8$var$__awaiter(this, void 0, void 0, function() {
        var client;
        return $cd237abf67628bc8$var$__generator(this, (_a) => {
            client = new (0, $7AlAh$PaymailClient)((0, $7AlAh$dns), (0, $7AlAh$nodefetch));
            return [
                2 /*return*/ ,
                client.verifyPubkeyOwner(publicKey, paymail)
            ];
        });
    });
};



var $b57223da72fa21e9$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $b57223da72fa21e9$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $b57223da72fa21e9$var$address = "1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4";
var $b57223da72fa21e9$var$querySchema = [
    {
        signature: "string"
    },
    {
        pubkey: "string"
    },
    {
        paymail: "string"
    }
];
var $b57223da72fa21e9$var$validateSignature = (pspObj, cell, tape) => {
    if (!Array.isArray(tape) || tape.length < 3) throw new Error("PSP requires at least 3 cells including the prefix");
    var cellIndex = -1;
    tape.forEach((cc, index) => {
        if (cc.cell === cell) cellIndex = index;
    });
    if (cellIndex === -1) throw new Error("PSP could not find cell in tape");
    var signatureBufferStatements = [];
    for(var i = 0; i < cellIndex; i++){
        var cellContainer = tape[i];
        if (!(0, $c2053de758ee1450$exports.checkOpFalseOpReturn)(cellContainer)) {
            cellContainer.cell.forEach((statement) => {
                // add the value as hex
                var value = statement.h;
                if (!value) value = (0, $7AlAh$Buffer).from(statement.b, "base64").toString("hex");
                if (!value) value = (0, $7AlAh$Buffer).from(statement.s).toString("hex");
                signatureBufferStatements.push((0, $7AlAh$Buffer).from(value, "hex"));
            });
            signatureBufferStatements.push((0, $7AlAh$Buffer).from("7c", "hex")); // | hex ????
        }
    }
    var dataScript = (0, $7AlAh$Script).fromSafeDataArray(signatureBufferStatements);
    var messageBuffer = (0, $7AlAh$Buffer).from(dataScript.toHex(), "hex");
    // verify psp signature
    var publicKey = (0, $7AlAh$PubKey).fromString(pspObj.pubkey);
    var signingAddress = (0, $7AlAh$Address).fromPubKey(publicKey);
    try {
        pspObj.verified = (0, $7AlAh$Bsm).verify(messageBuffer, pspObj.signature, signingAddress);
    } catch (e) {
        pspObj.verified = false;
    }
    return pspObj.verified;
};
var $b57223da72fa21e9$var$handler = function(_a) {
    var dataObj = _a.dataObj, cell = _a.cell, tape = _a.tape;
    return $b57223da72fa21e9$var$__awaiter(this, void 0, void 0, function() {
        var pspObj, paymailPublicKeyVerified;
        return $b57223da72fa21e9$var$__generator(this, (_b) => {
            switch(_b.label){
                case 0:
                    // Paymail Signature Protocol
                    // Validation
                    if (!cell.length || cell[0].s !== $b57223da72fa21e9$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].b || !cell[2].s || !cell[3].s || !tape) throw new Error("Invalid Paymail Signature Protocol record");
                    pspObj = {
                        signature: cell[1].s,
                        pubkey: cell[2].s,
                        paymail: cell[3].s,
                        verified: false
                    };
                    // verify signature
                    $b57223da72fa21e9$var$validateSignature(pspObj, cell, tape);
                    return [
                        4 /*yield*/ ,
                        (0, $cd237abf67628bc8$exports.verifyPaymailPublicKey)(pspObj.paymail, pspObj.pubkey)
                    ];
                case 1:
                    paymailPublicKeyVerified = _b.sent();
                    pspObj.verified = pspObj.verified && paymailPublicKeyVerified;
                    (0, $c2053de758ee1450$exports.saveProtocolData)(dataObj, "PSP", pspObj);
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
};
var $b57223da72fa21e9$export$bd49ff9d0c7fbe97 = {
    name: "PSP",
    address: $b57223da72fa21e9$var$address,
    querySchema: $b57223da72fa21e9$var$querySchema,
    handler: $b57223da72fa21e9$var$handler
};



var $414950da4f87d079$var$__assign = undefined && undefined.__assign || function() {
    $414950da4f87d079$var$__assign = Object.assign || ((t) => {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    });
    return $414950da4f87d079$var$__assign.apply(this, arguments);
};
var $414950da4f87d079$var$__awaiter = undefined && undefined.__awaiter || ((thisArg, _arguments, P, generator) => {
    function adopt(value) {
        return value instanceof P ? value : new P((resolve) => {
            resolve(value);
        });
    }
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
var $414950da4f87d079$var$__generator = undefined && undefined.__generator || ((thisArg, body) => {
    var _ = {
        label: 0,
        sent: () => {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return (v) => step([
                n,
                v
            ]);
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
});
var $414950da4f87d079$var$protocolMap = new Map([]);
var $414950da4f87d079$var$protocolHandlers = new Map();
var $414950da4f87d079$var$protocolQuerySchemas = new Map();
[
    (0, $98aa1784bfd49640$exports.AIP),
    (0, $a429761762b93e1b$export$ef35774e6d314e91),
    (0, $0d2672e9817499e3$export$5935ea4bf04c4453),
    (0, $e22c244abfee4b98$exports.HAIP),
    (0, $5a1837533efd883a$export$ce970371e0e850bc),
    (0, $1dadca38d7be2882$exports.METANET),
    (0, $b57223da72fa21e9$exports.PSP)
].forEach((protocol) => {
    $414950da4f87d079$var$protocolMap.set(protocol.address, protocol.name);
    $414950da4f87d079$var$protocolHandlers.set(protocol.name, protocol.handler);
    $414950da4f87d079$var$protocolQuerySchemas.set(protocol.name, protocol.querySchema);
});
// Takes a BOB formatted op_return transaction
var $414950da4f87d079$export$894a720e71f90b3c = /** @class */ (() => {
    function BMAP() {
        this.transformTx = (tx) => $414950da4f87d079$var$__awaiter(this, void 0, Promise, function() {
                var self, dataObj, _i, _a, _b, key, val, _c, _d, out, tape, _e, tape_1, cellContainer, cell, prefix, protocolName, handler, meta;
                return $414950da4f87d079$var$__generator(this, function(_f) {
                    switch(_f.label){
                        case 0:
                            self = this;
                            if (!tx || !tx["in"] || !tx["out"]) throw new Error("Cannot process tx");
                            dataObj = {
                                in: [],
                                out: [],
                                _id: "",
                                tx: {},
                                blk: {}
                            };
                            _i = 0, _a = Object.entries(tx);
                            _f.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [
                                3 /*break*/ ,
                                14
                            ];
                            _b = _a[_i], key = _b[0], val = _b[1];
                            if (!(key === "out")) return [
                                3 /*break*/ ,
                                12
                            ];
                            _c = 0, _d = tx.out;
                            _f.label = 2;
                        case 2:
                            if (!(_c < _d.length)) return [
                                3 /*break*/ ,
                                11
                            ];
                            out = _d[_c];
                            tape = out.tape;
                            if (!(tape === null || tape === void 0 ? void 0 : tape.some((cc) => (0, $c2053de758ee1450$exports.checkOpFalseOpReturn)(cc)))) return [
                                3 /*break*/ ,
                                9
                            ];
                            _e = 0, tape_1 = tape;
                            _f.label = 3;
                        case 3:
                            if (!(_e < tape_1.length)) return [
                                3 /*break*/ ,
                                8
                            ];
                            cellContainer = tape_1[_e];
                            // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                            if ((0, $c2053de758ee1450$exports.checkOpFalseOpReturn)(cellContainer)) return [
                                3 /*break*/ ,
                                7
                            ];
                            cell = cellContainer.cell;
                            if (!cell) throw new Error("empty cell while parsing");
                            prefix = cell[0].s;
                            protocolName = self.protocolMap.get(prefix) || prefix;
                            if (!(self.protocolHandlers.has(protocolName) && typeof self.protocolHandlers.get(protocolName) === "function")) return [
                                3 /*break*/ ,
                                6
                            ];
                            handler = self.protocolHandlers.get(protocolName);
                            if (!handler) return [
                                3 /*break*/ ,
                                5
                            ];
                            /* eslint-disable no-await-in-loop */ return [
                                4 /*yield*/ ,
                                handler({
                                    dataObj: dataObj,
                                    cell: cell,
                                    tape: tape,
                                    tx: tx
                                })
                            ];
                        case 4:
                            /* eslint-disable no-await-in-loop */ _f.sent();
                            _f.label = 5;
                        case 5:
                            return [
                                3 /*break*/ ,
                                7
                            ];
                        case 6:
                            (0, $c2053de758ee1450$exports.saveProtocolData)(dataObj, protocolName, cell);
                            _f.label = 7;
                        case 7:
                            _e++;
                            return [
                                3 /*break*/ ,
                                3
                            ];
                        case 8:
                            return [
                                3 /*break*/ ,
                                10
                            ];
                        case 9:
                            // No OP_RETURN in this outputs
                            if (key && !dataObj[key]) dataObj[key] = [];
                            dataObj[key].push({
                                i: out.i,
                                e: out.e
                            });
                            _f.label = 10;
                        case 10:
                            _c++;
                            return [
                                3 /*break*/ ,
                                2
                            ];
                        case 11:
                            return [
                                3 /*break*/ ,
                                13
                            ];
                        case 12:
                            if (key === "in") dataObj[key] = val.map((v) => {
                                var r = $414950da4f87d079$var$__assign({}, v);
                                delete r.tape;
                                return r;
                            });
                            else if (Object.keys(dataObj).includes(key)) // knwon key, just write it retaining original type
                            dataObj[key] = val;
                            else if (!dataObj[key]) {
                                // unknown key. push into array incase there are many of these detected
                                dataObj[key] = [];
                                dataObj[key].push(val);
                            }
                            _f.label = 13;
                        case 13:
                            _i++;
                            return [
                                3 /*break*/ ,
                                1
                            ];
                        case 14:
                            // If this is a MOM planaria it will have metanet keys available
                            if (dataObj["METANET"] && tx.parent) {
                                meta = {
                                    ancestor: tx.ancestor,
                                    parent: tx.parent,
                                    child: tx.child,
                                    head: tx.head
                                };
                                dataObj.METANET.push(meta);
                                // remove parent and node from root level for (MOM data)
                                delete dataObj.ancestor;
                                delete dataObj.child;
                                delete dataObj.parent;
                                delete dataObj.head;
                                delete dataObj.node;
                            }
                            return [
                                2 /*return*/ ,
                                dataObj
                            ];
                    }
                });
            });
        // initial default protocol handlers in this instantiation
        this.protocolMap = $414950da4f87d079$var$protocolMap;
        this.protocolHandlers = $414950da4f87d079$var$protocolHandlers;
        this.protocolQuerySchemas = $414950da4f87d079$var$protocolQuerySchemas;
    }
    BMAP.prototype.addProtocolHandler = function(protocolDefinition) {
        var name = protocolDefinition.name, address = protocolDefinition.address, querySchema = protocolDefinition.querySchema, handler = protocolDefinition.handler;
        this.protocolMap.set(address, name);
        this.protocolHandlers.set(name, handler);
        this.protocolQuerySchemas.set(name, querySchema);
    };
    return BMAP;
})();
var $414950da4f87d079$export$b2a90e318402f6bc = (tx) => $414950da4f87d079$var$__awaiter(void 0, void 0, void 0, function() {
        var b;
        return $414950da4f87d079$var$__generator(this, (_a) => {
            b = new $414950da4f87d079$export$894a720e71f90b3c();
            return [
                2 /*return*/ ,
                b.transformTx(tx)
            ];
        });
    });


export {$414950da4f87d079$export$894a720e71f90b3c as BMAP, $414950da4f87d079$export$b2a90e318402f6bc as TransformTx, $414950da4f87d079$exports as default};
//# sourceMappingURL=bmap.module.js.map
