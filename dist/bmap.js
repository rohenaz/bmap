var $71XCL$bputs = require("bpu-ts");
var $71XCL$bsvsdk = require("@bsv/sdk");
var $71XCL$buffer = require("buffer");
var $71XCL$nodefetch = require("node-fetch");
var $71XCL$msgpackmsgpack = require("@msgpack/msgpack");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "allProtocols", () => $0bef5cd148f6f4f7$export$6b22fa9a84a4797f);
$parcel$export(module.exports, "supportedProtocols", () => $0bef5cd148f6f4f7$export$63e9417ed8d8533a);
$parcel$export(module.exports, "defaultProtocols", () => $0bef5cd148f6f4f7$export$4f34a1c822988d11);
$parcel$export(module.exports, "BMAP", () => $0bef5cd148f6f4f7$export$894a720e71f90b3c);
$parcel$export(module.exports, "fetchRawTx", () => $0bef5cd148f6f4f7$export$54850c299f4a06d8);
$parcel$export(module.exports, "bobFromRawTx", () => $0bef5cd148f6f4f7$export$2905b0423a229d9);
$parcel$export(module.exports, "TransformTx", () => $0bef5cd148f6f4f7$export$b2a90e318402f6bc);



const { toArray: $caee5781971edf71$var$toArray } = (0, $71XCL$bsvsdk.Utils);
const $caee5781971edf71$export$f6e922e536d8305c = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return typeof value === 'string';
    });
};
const $caee5781971edf71$export$37b8d83213de0f5f = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return value === 'object';
    });
};
const $caee5781971edf71$export$b691916706e0e9cc = (pushData, schemaEncoding)=>{
    if (!pushData) throw new Error(`cannot get cell value of: ${pushData}`);
    else if (schemaEncoding === 'string') return pushData['s'] ? pushData.s : pushData.ls || '';
    else if (schemaEncoding === 'hex') return pushData['h'] ? pushData.h : pushData.lh || (pushData['b'] ? (0, $71XCL$buffer.Buffer).from(pushData.b, 'base64').toString('hex') : pushData.lb && (0, $71XCL$buffer.Buffer).from(pushData.lb, 'base64').toString('hex')) || '';
    else if (schemaEncoding === 'number') return parseInt(pushData['h'] ? pushData.h : pushData.lh || '0', 16);
    else if (schemaEncoding === 'file') return `bitfs://${pushData['f'] ? pushData.f : pushData.lf}`;
    return (pushData['b'] ? pushData.b : pushData.lb) || '';
};
const $caee5781971edf71$export$429a4e8902c23802 = (cc)=>{
    return cc.cell.some((c)=>c.op === 106);
};
const $caee5781971edf71$export$238b4e54af8fe886 = (cc)=>{
    if (cc.cell.length !== 2) return false;
    const opReturnIdx = cc.cell.findIndex((c)=>c.op === 106);
    if (opReturnIdx !== -1) return cc.cell[opReturnIdx - 1]?.op === 0;
    return false;
};
const $caee5781971edf71$export$23dbc584560299c3 = (dataObj, protocolName, data)=>{
    if (!dataObj[protocolName]) dataObj[protocolName] = [
        data
    ];
    else dataObj[protocolName].push(data);
};
const $caee5781971edf71$export$ee2a8bbe689a8ef5 = function(protocolName, opReturnSchema, dataObj, cell, tx) {
    // loop over the schema
    const obj = {};
    // Does not have the required number of fields
    const length = opReturnSchema.length + 1;
    if (cell.length < length) throw new Error(`${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`);
    for (const [idx, schemaField] of Object.entries(opReturnSchema)){
        const x = parseInt(idx, 10);
        const [field] = Object.keys(schemaField);
        const [schemaEncoding] = Object.values(schemaField);
        obj[field] = $caee5781971edf71$export$b691916706e0e9cc(cell[x + 1], schemaEncoding);
    }
    $caee5781971edf71$export$23dbc584560299c3(dataObj, protocolName, obj);
};
const $caee5781971edf71$export$ca4d6504ca148ae4 = function(data) {
    const regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?';
    return new RegExp(`^${regex}$`, 'gi').test(data);
};
const $caee5781971edf71$export$bced8d2aada2d1c9 = (msgBuffer)=>{
    return (0, $71XCL$bsvsdk.Hash).sha256($caee5781971edf71$var$toArray(msgBuffer));
};


// 21e8 does not use the first pushdata for id
// in fact there is no id since the 21e8 is designed for difficulty and can be changed
// instead we use the static part of the script to indentfy the transaction
// TODO - the OP_X_PLACEHOLDER is the number of bytes to push onto the stack and must match difficulty size
const $370fc9f1fb64c5cc$var$_21e8Script = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" ");
const $370fc9f1fb64c5cc$var$scriptChecker = (cell)=>{
    if (cell.length !== 12) // wrong length
    return false;
    // match exact script
    const ops = [
        ...cell
    ].map((c)=>c.ops).splice(2, cell.length);
    // calculate target byte length
    const target = (0, $caee5781971edf71$export$b691916706e0e9cc)(cell[1], "hex");
    const targetOpSize = Buffer.from(target).byteLength;
    // replace the placeholder opcode with actual
    ops[1] = `OP_${targetOpSize}`;
    $370fc9f1fb64c5cc$var$_21e8Script[1] = `OP_${targetOpSize}`;
    // protocol identifier always in first pushdata
    return ops.join() === $370fc9f1fb64c5cc$var$_21e8Script.join();
};
const $370fc9f1fb64c5cc$var$handler = ({ dataObj: dataObj, cell: cell, out: out })=>{
    if (!cell[0] || !out) throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    const txid = (0, $caee5781971edf71$export$b691916706e0e9cc)(cell[0], "hex");
    const target = (0, $caee5781971edf71$export$b691916706e0e9cc)(cell[1], "hex");
    if (!target) throw new Error(`Invalid 21e8 target. ${JSON.stringify(cell[0], null, 2)}`);
    const difficulty = Buffer.from(target, "hex").byteLength;
    const _21e8Obj = {
        target: target,
        difficulty: difficulty,
        value: out.e.v,
        txid: txid
    };
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "21E8", _21e8Obj);
};
const $370fc9f1fb64c5cc$export$85479a00ad164ad6 = {
    name: "21E8",
    handler: $370fc9f1fb64c5cc$var$handler,
    scriptChecker: $370fc9f1fb64c5cc$var$scriptChecker
};






const { toArray: $9d2ad5acc773d924$var$toArray, toHex: $9d2ad5acc773d924$var$toHex, fromBase58Check: $9d2ad5acc773d924$var$fromBase58Check, toBase58Check: $9d2ad5acc773d924$var$toBase58Check } = (0, $71XCL$bsvsdk.Utils);
const $9d2ad5acc773d924$var$address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
const $9d2ad5acc773d924$var$opReturnSchema = [
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
const $9d2ad5acc773d924$var$getFileBuffer = async (bitfsRef)=>{
    try {
        const result = await (0, ($parcel$interopDefault($71XCL$nodefetch)))(`https://x.bitfs.network/${bitfsRef}`);
        return await result.buffer();
    } catch  {
        return (0, $71XCL$buffer.Buffer).from("");
    }
};
function $9d2ad5acc773d924$var$toBigNumberFromBuffer(buffer) {
    const hex = $9d2ad5acc773d924$var$toHex(buffer);
    return new (0, $71XCL$bsvsdk.BigNumber)(hex, 16);
}
function $9d2ad5acc773d924$var$recoverPublicKeyFromBSM(message, signature, expectedAddress) {
    const msgHash = (0, $71XCL$bsvsdk.BSM).magicHash(message);
    const bigMsg = $9d2ad5acc773d924$var$toBigNumberFromBuffer(msgHash);
    for(let recovery = 0; recovery < 4; recovery++)try {
        const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
        const pubKeyHash = publicKey.toHash();
        const { prefix: prefix } = $9d2ad5acc773d924$var$fromBase58Check(expectedAddress);
        const recoveredAddress = $9d2ad5acc773d924$var$toBase58Check(pubKeyHash, prefix);
        if (recoveredAddress === expectedAddress) {
            console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key");
            return publicKey;
        } else console.log("[recoverPublicKeyFromBSM] Trying recovery=", recovery, "Recovered address=", recoveredAddress, "expected=", expectedAddress);
    } catch (e) {
        console.log("[recoverPublicKeyFromBSM] Recovery error:", e);
    }
    console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address");
    throw new Error("Failed to recover public key matching the expected address");
}
function $9d2ad5acc773d924$var$fromSafeDataArray(dataBufs) {
    const script = new (0, $71XCL$bsvsdk.Script)();
    script.chunks.push({
        op: 0
    }); // OP_FALSE
    script.chunks.push({
        op: 106
    }); // OP_RETURN
    for (const buf of dataBufs){
        const length = buf.length;
        if (length <= 75) script.chunks.push({
            op: length,
            data: Array.from(buf)
        });
        else if (length <= 0xff) script.chunks.push({
            op: 0x4c,
            data: Array.from(buf)
        });
        else if (length <= 0xffff) script.chunks.push({
            op: 0x4d,
            data: Array.from(buf)
        });
        else script.chunks.push({
            op: 0x4e,
            data: Array.from(buf)
        });
    }
    return script;
}
async function $9d2ad5acc773d924$var$validateSignature(aipObj, cell, tape) {
    if (!Array.isArray(tape) || tape.length < 3) throw new Error("AIP requires at least 3 cells including the prefix");
    let cellIndex = -1;
    tape.forEach((cc, index)=>{
        if (cc.cell === cell) cellIndex = index;
    });
    if (cellIndex === -1) throw new Error("AIP could not find cell in tape");
    let usingIndexes = aipObj.index || [];
    const signatureValues = [
        "6a"
    ]; // index 0: OP_RETURN
    // Gather data from all previous cells
    for(let i = 0; i < cellIndex; i++){
        const cellContainer = tape[i];
        if (!(0, $caee5781971edf71$export$238b4e54af8fe886)(cellContainer)) {
            const cellData = [];
            for (const statement of cellContainer.cell){
                let value;
                if (statement.h) value = statement.h;
                else if (statement.f) {
                    const fileBuffer = await $9d2ad5acc773d924$var$getFileBuffer(statement.f);
                    value = fileBuffer.length > 0 ? fileBuffer.toString("hex") : undefined;
                } else if (statement.b) {
                    const buf = (0, $71XCL$buffer.Buffer).from(statement.b, "base64");
                    if (buf.length > 0) value = buf.toString("hex");
                } else if (statement.s) {
                    if (statement.s.length > 0) value = (0, $71XCL$buffer.Buffer).from(statement.s).toString("hex");
                }
                if (value && value.length > 0) cellData.push(value);
            }
            if (cellData.length > 0) {
                // add all cellData
                signatureValues.push(...cellData);
                // add pipe after this cell
                signatureValues.push("7c");
            }
        }
    }
    // Now HAIP indexing logic
    if (aipObj.hashing_algorithm && aipObj.index_unit_size) {
        const indexLength = aipObj.index_unit_size * 2;
        usingIndexes = [];
        const indexesHex = cell[6]?.h || "";
        for(let i = 0; i < indexesHex.length; i += indexLength)usingIndexes.push(Number.parseInt(indexesHex.substr(i, indexLength), 16));
        aipObj.index = usingIndexes;
    }
    console.log("usingIndexes", usingIndexes);
    console.log("signatureValues", signatureValues);
    const signatureBufferStatements = [];
    if (usingIndexes.length > 0) for (const idx of usingIndexes){
        if (typeof signatureValues[idx] !== 'string') console.log("signatureValues[idx]", signatureValues[idx], "idx", idx);
        if (!signatureValues[idx]) {
            console.log("signatureValues is missing an index", idx, "This means indexing is off");
            return false;
        }
        signatureBufferStatements.push((0, $71XCL$buffer.Buffer).from(signatureValues[idx], "hex"));
    }
    else for (const val of signatureValues)signatureBufferStatements.push((0, $71XCL$buffer.Buffer).from(val, "hex"));
    console.log("signatureBufferStatements", signatureBufferStatements.map((b)=>b.toString("hex")));
    let messageBuffer;
    if (aipObj.hashing_algorithm) {
        // HAIP logic
        if (!aipObj.index_unit_size) // remove OP_RETURN chunk
        signatureBufferStatements.shift();
        const dataScript = $9d2ad5acc773d924$var$fromSafeDataArray(signatureBufferStatements);
        let dataBuffer = (0, $71XCL$buffer.Buffer).from(dataScript.toHex(), "hex");
        if (aipObj.index_unit_size) dataBuffer = dataBuffer.slice(1);
        const hashed = (0, $71XCL$bsvsdk.Hash).sha256($9d2ad5acc773d924$var$toArray(dataBuffer));
        messageBuffer = (0, $71XCL$buffer.Buffer).from(hashed);
    } else // regular AIP
    messageBuffer = (0, $71XCL$buffer.Buffer).concat(signatureBufferStatements);
    const addressString = aipObj.address || aipObj.signing_address;
    const signatureStr = aipObj.signature;
    const signature = (0, $71XCL$bsvsdk.Signature).fromCompact(signatureStr, 'base64');
    const tryNormalLogic = ()=>{
        console.log("[validateSignature:tryNormalLogic] start");
        try {
            const msgArr = $9d2ad5acc773d924$var$toArray(messageBuffer);
            const recoveredPubkey = $9d2ad5acc773d924$var$recoverPublicKeyFromBSM(msgArr, signature, addressString);
            console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");
            const res = (0, $71XCL$bsvsdk.BSM).verify(msgArr, signature, recoveredPubkey);
            console.log("[tryNormalLogic] BSM.verify result:", res);
            return res;
        } catch (err) {
            console.log("[tryNormalLogic] error:", err);
            return false;
        }
    };
    const tryTwetchLogic = ()=>{
        console.log("[validateSignature:tryTwetchLogic] start");
        // For twetch: remove first and last item and sha256 the remainder, interpret hex as utf8
        if (signatureBufferStatements.length <= 2) return false;
        const trimmed = signatureBufferStatements.slice(1, -1);
        console.log("[tryTwetchLogic] trimmedStatements count:", trimmed.length);
        const buff = (0, $71XCL$bsvsdk.Hash).sha256($9d2ad5acc773d924$var$toArray((0, $71XCL$buffer.Buffer).concat(trimmed)));
        const hexStr = $9d2ad5acc773d924$var$toHex(buff);
        const twetchMsg = (0, $71XCL$buffer.Buffer).from(hexStr, "utf8");
        try {
            const recoveredPubkey = $9d2ad5acc773d924$var$recoverPublicKeyFromBSM($9d2ad5acc773d924$var$toArray(twetchMsg), signature, addressString);
            console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");
            const res = (0, $71XCL$bsvsdk.BSM).verify($9d2ad5acc773d924$var$toArray(twetchMsg), signature, recoveredPubkey);
            console.log("[tryTwetchLogic] BSM.verify result:", res);
            return res;
        } catch (err) {
            console.log("[tryTwetchLogic] error:", err);
            return false;
        }
    };
    let verified = tryNormalLogic();
    if (!verified) verified = tryTwetchLogic();
    console.log("[validateSignature] final verified=", verified);
    aipObj.verified = verified;
    return verified;
}
var $9d2ad5acc773d924$export$6c117c038f18b127 = /*#__PURE__*/ function(SIGPROTO) {
    SIGPROTO["HAIP"] = "HAIP";
    SIGPROTO["AIP"] = "AIP";
    return SIGPROTO;
}({});
const $9d2ad5acc773d924$export$f0079d0908cdbf96 = async (useOpReturnSchema, protocol, dataObj, cell, tape, tx)=>{
    const aipObj = {
        verified: false
    };
    // minimal fields check
    if (cell.length < 4) throw new Error("AIP requires at least 4 fields including the prefix");
    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)){
        const x = Number.parseInt(idx, 10);
        if (Array.isArray(schemaField)) {
            const [aipField] = Object.keys(schemaField[0]);
            const fieldData = [];
            for(let i = x + 1; i < cell.length; i++)if (cell[i].h) fieldData.push(Number.parseInt(cell[i].h, 16));
            aipObj[aipField] = fieldData;
        } else {
            const [aipField] = Object.keys(schemaField);
            const [schemaEncoding] = Object.values(schemaField);
            aipObj[aipField] = (0, $caee5781971edf71$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding) || "";
        }
    }
    if (cell[0].s === $9d2ad5acc773d924$var$address && cell[3].s && (0, $caee5781971edf71$export$ca4d6504ca148ae4)(cell[3].s)) aipObj.signature = cell[3].s;
    console.log("[AIPhandler] AIP object before validate:", aipObj);
    if (!aipObj.signature) throw new Error("AIP requires a signature");
    await $9d2ad5acc773d924$var$validateSignature(aipObj, cell, tape);
    console.log("[AIPhandler] After validate, verified:", aipObj.verified);
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, protocol, aipObj);
};
const $9d2ad5acc773d924$var$handler = async ({ dataObj: dataObj, cell: cell, tape: tape, tx: tx })=>{
    if (!tape) throw new Error("Invalid AIP transaction");
    return await $9d2ad5acc773d924$export$f0079d0908cdbf96($9d2ad5acc773d924$var$opReturnSchema, "AIP", dataObj, cell, tape, tx);
};
const $9d2ad5acc773d924$export$474d593e43f12abd = {
    name: "AIP",
    address: $9d2ad5acc773d924$var$address,
    opReturnSchema: $9d2ad5acc773d924$var$opReturnSchema,
    handler: $9d2ad5acc773d924$var$handler
};



const $c5a475aecaa24150$var$address = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
const $c5a475aecaa24150$var$opReturnSchema = [
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
const $c5a475aecaa24150$var$handler = ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    const encodingMap = new Map();
    encodingMap.set("utf8", "string");
    encodingMap.set("text", "string"); // invalid but people use it :(
    encodingMap.set("gzip", "binary"); // invalid but people use it :(
    encodingMap.set("text/plain", "string");
    encodingMap.set("image/png", "binary");
    encodingMap.set("image/jpeg", "binary");
    if (!cell[1] || !cell[2]) throw new Error(`Invalid B tx: ${tx}`);
    // Check pushdata length + 1 for protocol prefix
    if (cell.length > $c5a475aecaa24150$var$opReturnSchema.length + 1) throw new Error("Invalid B tx. Too many fields.");
    // Make sure there are not more fields than possible
    const bObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($c5a475aecaa24150$var$opReturnSchema)){
        const x = Number.parseInt(idx, 10);
        const bField = Object.keys(schemaField)[0];
        let schemaEncoding = Object.values(schemaField)[0];
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
            } else schemaEncoding = cell[3]?.s ? encodingMap.get(cell[3].s.replace("-", "").toLowerCase()) : null;
        }
        // encoding is not required
        if (bField === "encoding" && !cell[x + 1]) continue;
        // filename is not required
        if (bField === "filename" && !cell[x + 1]) continue;
        // check for malformed syntax
        if (!cell || !cell[x + 1]) throw new Error(`malformed B syntax ${cell}`);
        // set field value from either s, b, ls, or lb depending on encoding and availability
        const data = cell[x + 1];
        bObj[bField] = (0, $caee5781971edf71$export$b691916706e0e9cc)(data, schemaEncoding);
    }
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "B", bObj);
};
const $c5a475aecaa24150$export$ef35774e6d314e91 = {
    name: "B",
    address: $c5a475aecaa24150$var$address,
    opReturnSchema: $c5a475aecaa24150$var$opReturnSchema,
    handler: $c5a475aecaa24150$var$handler
};



const $2519a10c9a0ebef2$var$address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";
const $2519a10c9a0ebef2$var$opReturnSchema = [
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
const $2519a10c9a0ebef2$export$c3c52e219617878 = ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    if (!tx) throw new Error("Invalid BAP tx, tx required");
    (0, $caee5781971edf71$export$ee2a8bbe689a8ef5)("BAP", $2519a10c9a0ebef2$var$opReturnSchema, dataObj, cell, tx);
};
const $2519a10c9a0ebef2$export$5935ea4bf04c4453 = {
    name: "BAP",
    address: $2519a10c9a0ebef2$var$address,
    opReturnSchema: $2519a10c9a0ebef2$var$opReturnSchema,
    handler: $2519a10c9a0ebef2$export$c3c52e219617878
};



const $44221962b60306bc$var$protocolAddress = "$";
const $44221962b60306bc$var$opReturnSchema = [
    {
        su: [
            {
                pubkey: "string"
            },
            {
                sign_position: "string"
            },
            {
                signature: "string"
            }
        ],
        echo: [
            {
                data: "string"
            },
            {
                to: "string"
            },
            {
                filename: "string"
            }
        ],
        route: [
            [
                {
                    add: [
                        {
                            bitcom_address: "string"
                        },
                        {
                            route_matcher: "string"
                        },
                        {
                            endpoint_template: "string"
                        }
                    ]
                },
                {
                    enable: [
                        {
                            path: "string"
                        }
                    ]
                }
            ]
        ],
        useradd: [
            {
                address: "string"
            }
        ]
    }
];
// const handler = function (dataObj, protocolName, cell, tape, tx) {
const $44221962b60306bc$var$handler = ({ dataObj: dataObj, cell: cell })=>{
    if (!cell.length || !cell.every((c)=>c.s)) throw new Error("Invalid Bitcom tx");
    // gather up the string values
    const bitcomObj = cell.map((c)=>c?.s ? c.s : "");
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "BITCOM", bitcomObj);
};
const $44221962b60306bc$export$c19e3a57d69468ea = {
    name: "BITCOM",
    address: $44221962b60306bc$var$protocolAddress,
    opReturnSchema: $44221962b60306bc$var$opReturnSchema,
    handler: $44221962b60306bc$var$handler
};





const { toArray: $d53bca867b0d5879$var$toArray, toBase58Check: $d53bca867b0d5879$var$toBase58Check, toHex: $d53bca867b0d5879$var$toHex } = (0, $71XCL$bsvsdk.Utils);
const { magicHash: $d53bca867b0d5879$var$magicHash } = (0, $71XCL$bsvsdk.BSM);
const $d53bca867b0d5879$var$address = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC";
const $d53bca867b0d5879$var$opReturnSchema = [
    {
        bitkey_signature: "string"
    },
    {
        user_signature: "string"
    },
    {
        paymail: "string"
    },
    {
        pubkey: "string"
    }
];
// Helper to convert array to BigNumber
function $d53bca867b0d5879$var$toBigNumber(buffer) {
    const hex = $d53bca867b0d5879$var$toHex(buffer);
    return new (0, $71XCL$bsvsdk.BigNumber)(hex, 16);
}
// Recovers a public key from a BSM signature by brute forcing recovery factors
// Steps:
// 1. Apply magicHash to the raw message.
// 2. Try all recovery factors 0–3 with Signature.RecoverPublicKey()
// 3. If BSM.verify() returns true with the recovered pubkey, return it.
function $d53bca867b0d5879$var$recoverPublicKeyFromBSM(message, signature) {
    // First, BSM signatures are verified by applying magicHash internally,
    // so we must apply magicHash to the raw message ourselves for recovery:
    const msgHash = $d53bca867b0d5879$var$magicHash(message);
    const bigMsg = $d53bca867b0d5879$var$toBigNumber(msgHash);
    for(let recovery = 0; recovery < 4; recovery++)try {
        const publicKey = signature.RecoverPublicKey(recovery, bigMsg);
        // Verify using BSM.verify() with the original raw message (no magicHash)
        if ((0, $71XCL$bsvsdk.BSM).verify(message, signature, publicKey)) return publicKey;
    } catch  {
    // Try next recovery factor
    }
    throw new Error("Failed to recover public key from BSM signature");
}
const $d53bca867b0d5879$var$handler = async ({ dataObj: dataObj, cell: cell })=>{
    if (cell.length < 5) throw new Error("Invalid Bitkey tx");
    const bitkeyObj = {};
    for (const [idx, schemaField] of Object.entries($d53bca867b0d5879$var$opReturnSchema)){
        const x = Number.parseInt(idx, 10);
        const bitkeyField = Object.keys(schemaField)[0];
        const schemaEncoding = Object.values(schemaField)[0];
        bitkeyObj[bitkeyField] = (0, $caee5781971edf71$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding);
    }
    // Derive userAddress from pubkey
    const pubkeyHex = bitkeyObj.pubkey;
    const userPubkey = (0, $71XCL$bsvsdk.PublicKey).fromString(pubkeyHex);
    const userPubKeyHash = userPubkey.toHash();
    const userAddress = $d53bca867b0d5879$var$toBase58Check(userPubKeyHash);
    // Prepare raw message for bitkey signature verification: sha256(paymail_hex + pubkey_hex)
    const paymailHex = (0, $71XCL$buffer.Buffer).from(bitkeyObj.paymail).toString("hex");
    const concatenated = paymailHex + pubkeyHex;
    const concatenatedBuffer = (0, $71XCL$buffer.Buffer).from(concatenated, "hex");
    const bitkeyMessage = (0, $71XCL$bsvsdk.Hash).sha256($d53bca867b0d5879$var$toArray(concatenatedBuffer));
    // This is the raw message. BSM.verify() will do magicHash internally.
    const bitkeySignature = (0, $71XCL$bsvsdk.Signature).fromCompact(bitkeyObj.bitkey_signature, 'base64');
    // Recover Bitkey pubkey
    const recoveredBitkeyPubkey = $d53bca867b0d5879$var$recoverPublicKeyFromBSM(bitkeyMessage, bitkeySignature);
    const recoveredBitkeyPubKeyHash = recoveredBitkeyPubkey.toHash();
    const recoveredBitkeyAddress = $d53bca867b0d5879$var$toBase58Check(recoveredBitkeyPubKeyHash);
    const bitkeySignatureVerified = (0, $71XCL$bsvsdk.BSM).verify(bitkeyMessage, bitkeySignature, recoveredBitkeyPubkey) && recoveredBitkeyAddress === $d53bca867b0d5879$var$address;
    // Verify user signature by using the pubkey as the message
    const userMessage = $d53bca867b0d5879$var$toArray((0, $71XCL$buffer.Buffer).from(pubkeyHex, "utf8"));
    const userSignature = (0, $71XCL$bsvsdk.Signature).fromCompact(bitkeyObj.user_signature, 'base64');
    const recoveredUserPubkey = $d53bca867b0d5879$var$recoverPublicKeyFromBSM(userMessage, userSignature);
    const recoveredUserPubKeyHash = recoveredUserPubkey.toHash();
    const recoveredUserAddress = $d53bca867b0d5879$var$toBase58Check(recoveredUserPubKeyHash);
    const userSignatureVerified = (0, $71XCL$bsvsdk.BSM).verify(userMessage, userSignature, recoveredUserPubkey) && recoveredUserAddress === userAddress;
    bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified;
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "BITKEY", bitkeyObj);
};
const $d53bca867b0d5879$export$6a60f6b74bbaccb8 = {
    name: "BITKEY",
    address: $d53bca867b0d5879$var$address,
    opReturnSchema: $d53bca867b0d5879$var$opReturnSchema,
    handler: $d53bca867b0d5879$var$handler
};





const { magicHash: $7d567cbd150e6a61$var$magicHash } = (0, $71XCL$bsvsdk.BSM);
const { toArray: $7d567cbd150e6a61$var$toArray } = (0, $71XCL$bsvsdk.Utils);
const $7d567cbd150e6a61$var$protocolAddress = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p";
const $7d567cbd150e6a61$var$opReturnSchema = [
    {
        paymail: "string"
    },
    {
        pubkey: "binary"
    },
    {
        signature: "string"
    }
];
const $7d567cbd150e6a61$var$handler = async ({ dataObj: dataObj, cell: cell, tape: tape, tx: tx })=>{
    // Validation
    if (cell[0].s !== $7d567cbd150e6a61$var$protocolAddress || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].b || !cell[3].s || !tape) throw new Error(`Invalid BITPIC record: ${tx}`);
    const bitpicObj = {
        paymail: cell[1].s,
        pubkey: (0, $71XCL$buffer.Buffer).from(cell[2].b, "base64").toString("hex"),
        signature: cell[3].s || "",
        verified: false
    };
    const b = tape[1].cell;
    if (b[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut") // verify bitpic signature
    try {
        // TODO: bob transactions are missing this binary part, cannot verify signature
        const bin = cell[1].lb || cell[1].b;
        const hashBuff = (0, $71XCL$bsvsdk.Hash).sha256($7d567cbd150e6a61$var$toArray(bin, "base64"));
        const sig = (0, $71XCL$bsvsdk.Signature).fromCompact(bitpicObj.signature, "base64");
        const pubkey = (0, $71XCL$bsvsdk.PublicKey).fromString(bitpicObj.pubkey);
        const msgHash = $7d567cbd150e6a61$var$magicHash(hashBuff);
        bitpicObj.verified = (0, $71XCL$bsvsdk.BSM).verify(msgHash, sig, pubkey);
    } catch (e) {
        // failed verification
        bitpicObj.verified = false;
    }
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "BITPIC", bitpicObj);
};
const $7d567cbd150e6a61$export$bbef9cc099c72f9d = {
    name: "BITPIC",
    address: $7d567cbd150e6a61$var$protocolAddress,
    opReturnSchema: $7d567cbd150e6a61$var$opReturnSchema,
    handler: $7d567cbd150e6a61$var$handler
};



const $969c5b61dd3c02f1$var$address = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3";
const $969c5b61dd3c02f1$var$opReturnSchema = [
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
const $969c5b61dd3c02f1$var$handler = async ({ dataObj: dataObj, cell: cell, tape: tape, tx: tx })=>{
    if (!tape) throw new Error("Invalid HAIP tx. Bad tape");
    if (!tx) throw new Error("Invalid HAIP tx.");
    return await (0, $9d2ad5acc773d924$export$f0079d0908cdbf96)($969c5b61dd3c02f1$var$opReturnSchema, (0, $9d2ad5acc773d924$export$6c117c038f18b127).HAIP, dataObj, cell, tape);
};
const $969c5b61dd3c02f1$export$12815d889fe90b8 = {
    name: "HAIP",
    address: $969c5b61dd3c02f1$var$address,
    opReturnSchema: $969c5b61dd3c02f1$var$opReturnSchema,
    handler: $969c5b61dd3c02f1$var$handler
};





const $f735e67f61f64b89$var$address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const $f735e67f61f64b89$var$opReturnSchema = [
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
const $f735e67f61f64b89$var$processADD = (cell, mapObj)=>{
    let last = null;
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        const pushdata = pushdataContainer.s;
        if (pushdataContainer.i === 2) {
            // Key name
            mapObj[pushdata] = [];
            last = pushdata;
        } else if (last && Array.isArray(mapObj[last])) mapObj[last].push(pushdata);
    }
};
const $f735e67f61f64b89$var$proccessDELETE = (cell, mapObj)=>{
    let last = null;
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        const pushdata = pushdataContainer.s;
        if (pushdataContainer.i === 2) {
            // Key name
            mapObj[pushdata] = [];
            last = pushdata;
        } else if (last) mapObj[last].push(pushdata);
    }
};
const $f735e67f61f64b89$var$processSELECT = (cell, mapObj)=>{
    // TODO
    // console.log('MAP SELECT');
    for (const pushdataContainer of cell)// ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
        mapObj.SELECT = "TODO";
        continue;
    }
};
const $f735e67f61f64b89$var$processMSGPACK = (cell, mapObj)=>{
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            if (!(0, $71XCL$msgpackmsgpack.decode)) throw new Error("Msgpack is required but not loaded");
            const buff = (0, $71XCL$buffer.Buffer).from(pushdataContainer.b, "base64");
            mapObj = (0, $71XCL$msgpackmsgpack.decode)(buff);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
const $f735e67f61f64b89$var$processJSON = (cell, mapObj)=>{
    for (const pushdataContainer of cell){
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
const $f735e67f61f64b89$var$processSET = (cell, mapObj)=>{
    let last = null;
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (!pushdataContainer.s || pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        const pushdata = pushdataContainer.s;
        if (pushdataContainer.i % 2 === 0) {
            // key
            mapObj[pushdata] = "";
            last = pushdata;
        } else {
            // value
            if (!last) throw new Error(`malformed MAP syntax. Cannot parse.${last}`);
            mapObj[last] = pushdata;
        }
    }
};
const $f735e67f61f64b89$var$handler = ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    // Validate
    if (cell[0].s !== $f735e67f61f64b89$var$address || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) throw new Error(`Invalid MAP record: ${tx}`);
    let mapObj = {};
    // parse the protocol separator
    const commands = [];
    let commandSeparator = 0;
    for(let i = 1; i < cell.length; i++)if (cell[i].s === ":::") commandSeparator++;
    else {
        if (!commands[commandSeparator]) commands[commandSeparator] = [];
        cell[i].i = commands[commandSeparator].length + 1;
        commands[commandSeparator].push(cell[i]);
    }
    // Get the MAP command key name from the query schema
    const mapCmdKey = Object.keys($f735e67f61f64b89$var$opReturnSchema[0])[0];
    // Add the firt MAP command in the response object
    mapObj[mapCmdKey] = commands[0][0].s;
    for (const cc of commands){
        // re-add the MAP address
        cc.unshift({
            s: $f735e67f61f64b89$var$address,
            i: 0
        });
        const command = cc[1].s;
        // Individual parsing rules for each MAP command
        switch(command){
            // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
            case "ADD":
                $f735e67f61f64b89$var$processADD(cc, mapObj);
                break;
            case "REMOVE":
                mapObj.key = cc[2].s;
                break;
            case "DELETE":
                $f735e67f61f64b89$var$proccessDELETE(cc, mapObj);
                break;
            case "CLEAR":
                break;
            case "SELECT":
                $f735e67f61f64b89$var$processSELECT(cc, mapObj);
                break;
            case "MSGPACK":
                mapObj = $f735e67f61f64b89$var$processMSGPACK(cc, mapObj);
                break;
            case "JSON":
                mapObj = $f735e67f61f64b89$var$processJSON(cc, mapObj);
                break;
            case "SET":
                $f735e67f61f64b89$var$processSET(cc, mapObj);
                break;
            default:
        }
    }
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "MAP", mapObj);
};
const $f735e67f61f64b89$export$ce970371e0e850bc = {
    name: "MAP",
    address: $f735e67f61f64b89$var$address,
    opReturnSchema: $f735e67f61f64b89$var$opReturnSchema,
    handler: $f735e67f61f64b89$var$handler
};




const { toArray: $23bc52f6d80ffa0b$var$toArray, toHex: $23bc52f6d80ffa0b$var$toHex } = (0, $71XCL$bsvsdk.Utils);
const $23bc52f6d80ffa0b$var$address = "meta";
const $23bc52f6d80ffa0b$var$opReturnSchema = [
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
const $23bc52f6d80ffa0b$export$3eb18141230d6532 = async (a, tx)=>{
    // Calculate the node ID
    const buf = (0, $71XCL$buffer.Buffer).from(a + tx);
    const hashBuf = (0, $71XCL$bsvsdk.Hash).sha256($23bc52f6d80ffa0b$var$toArray(buf));
    return $23bc52f6d80ffa0b$var$toHex(hashBuf);
};
const $23bc52f6d80ffa0b$var$handler = async ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    if (!cell.length || cell[0].s !== "meta" || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s || !tx) throw new Error(`Invalid Metanet tx ${tx}`);
    // For now, we just copy from MOM keys later if available, or keep BOB format
    const nodeId = await $23bc52f6d80ffa0b$export$3eb18141230d6532(cell[1].s, tx.tx.h);
    // Described this node
    const node = {
        a: cell[1].s,
        tx: tx.tx.h,
        id: nodeId
    };
    let parent = {};
    if (tx.in) {
        const parentId = await $23bc52f6d80ffa0b$export$3eb18141230d6532(tx.in[0].e.a, cell[2].s);
        // Parent node
        parent = {
            a: tx.in[0].e.a,
            tx: cell[2].s,
            id: parentId
        };
    }
    if (!dataObj.METANET) dataObj.METANET = [];
    dataObj.METANET.push({
        node: node,
        parent: parent
    });
};
const $23bc52f6d80ffa0b$export$7830a85a59ca4593 = {
    name: "METANET",
    address: $23bc52f6d80ffa0b$var$address,
    opReturnSchema: $23bc52f6d80ffa0b$var$opReturnSchema,
    handler: $23bc52f6d80ffa0b$var$handler
};



// const OrdScript =
//     'OP_FALSE OP_IF 6F7264 OP_1 <CONTENT_TYPE_PLACEHOLDER> OP_0 <DATA_PLACEHOLDER> OP_ENDIF'.split(
//         ' '
//     )
const $cf02eb2496a3bc72$var$scriptChecker = (cell)=>{
    if (cell.length < 13) // wrong length
    return false;
    // Find OP_IF wrapper
    const startIdx = $cf02eb2496a3bc72$var$findIndex(cell, (c)=>c.ops === "OP_IF");
    const endIdx = $cf02eb2496a3bc72$var$findIndex(cell, (c, i)=>i > startIdx && c.ops === "OP_ENDIF");
    const ordScript = cell.slice(startIdx, endIdx);
    const prevCell = cell[startIdx - 1];
    return prevCell?.op === 0 && !!ordScript[0] && !!ordScript[1] && ordScript[1].s == "ord";
};
const $cf02eb2496a3bc72$var$handler = ({ dataObj: dataObj, cell: cell, out: out })=>{
    if (!cell[0] || !out) throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    // Find OP_IF wrapper
    const startIdx = $cf02eb2496a3bc72$var$findIndex(cell, (c)=>c.ops === "OP_IF");
    const endIdx = $cf02eb2496a3bc72$var$findIndex(cell, (c, i)=>i > startIdx && c.ops === "OP_ENDIF") + 1;
    const ordScript = cell.slice(startIdx, endIdx);
    if (!ordScript[0] || !ordScript[1] || ordScript[1].s !== "ord") throw new Error("Invalid Ord tx. Prefix not found.");
    let data;
    let contentType;
    ordScript.forEach((push, idx, all)=>{
        // content-type
        if (push.ops === "OP_1") contentType = all[idx + 1].s;
        // data
        if (push.ops === "OP_0") data = all[idx + 1].b;
    });
    if (!data) throw new Error("Invalid Ord data.");
    if (!contentType) throw new Error("Invalid Ord content type.");
    const OrdObj = {
        data: data,
        contentType: contentType
    };
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "ORD", OrdObj);
};
const $cf02eb2496a3bc72$export$a3deb2ff0da16a68 = {
    name: "ORD",
    handler: $cf02eb2496a3bc72$var$handler,
    scriptChecker: $cf02eb2496a3bc72$var$scriptChecker
};
function $cf02eb2496a3bc72$var$findIndex(array, predicate) {
    return $cf02eb2496a3bc72$var$findLastIndex(array, predicate);
}
function $cf02eb2496a3bc72$var$findLastIndex(array, predicate, fromIndex) {
    const length = array == null ? 0 : array.length;
    if (!length) return -1;
    let index = length - 1;
    if (fromIndex !== undefined) {
        index = fromIndex;
        index = fromIndex < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
    }
    return $cf02eb2496a3bc72$var$baseFindIndex(array, predicate, index, true);
}
function $cf02eb2496a3bc72$var$baseFindIndex(array, predicate, fromIndex, fromRight) {
    const { length: length } = array;
    let index = fromIndex + (fromRight ? 1 : -1);
    while(fromRight ? index-- : ++index < length){
        if (predicate(array[index], index, array)) return index;
    }
    return -1;
}



const $6c2cab82920c5ead$var$address = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1";
const $6c2cab82920c5ead$var$opReturnSchema = [
    {
        pair: "json"
    },
    {
        address: "string"
    },
    {
        timestamp: "string"
    }
];
const $6c2cab82920c5ead$var$handler = ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    if (cell[0].s !== $6c2cab82920c5ead$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].s || !cell[3].s) throw new Error(`Invalid RON record ${tx?.tx.h}`);
    const pair = JSON.parse(cell[1].s);
    const timestamp = Number(cell[3].s);
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "RON", {
        pair: pair,
        address: cell[2].s,
        timestamp: timestamp
    });
};
const $6c2cab82920c5ead$export$2839d627b6f3bcfe = {
    name: "RON",
    address: $6c2cab82920c5ead$var$address,
    opReturnSchema: $6c2cab82920c5ead$var$opReturnSchema,
    handler: $6c2cab82920c5ead$var$handler
};



const $49d2b3729450186e$var$address = "1SymRe7erxM46GByucUWnB9fEEMgo7spd";
const $49d2b3729450186e$var$opReturnSchema = [
    {
        url: "string"
    }
];
const $49d2b3729450186e$var$handler = ({ dataObj: dataObj, cell: cell, tx: tx })=>{
    if (cell[0].s !== $49d2b3729450186e$var$address || !cell[1] || !cell[1].s) throw new Error(`Invalid SymRe tx: ${tx}`);
    (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, "SYMRE", {
        url: cell[1].s
    });
};
const $49d2b3729450186e$export$33455cbcda538c68 = {
    name: "SYMRE",
    address: $49d2b3729450186e$var$address,
    opReturnSchema: $49d2b3729450186e$var$opReturnSchema,
    handler: $49d2b3729450186e$var$handler
};



// Names of enabled protocols
const $0bef5cd148f6f4f7$var$enabledProtocols = new Map([]);
// Protocol Handlers
const $0bef5cd148f6f4f7$var$protocolHandlers = new Map([]);
// Script checkers are intentionally minimalistic detection functions for identifying matching scripts for a given protocol. Only if a checker returns true is a handler called for processing.
const $0bef5cd148f6f4f7$var$protocolScriptCheckers = new Map([]);
const $0bef5cd148f6f4f7$var$protocolOpReturnSchemas = new Map();
const $0bef5cd148f6f4f7$export$6b22fa9a84a4797f = [
    (0, $9d2ad5acc773d924$export$474d593e43f12abd),
    (0, $c5a475aecaa24150$export$ef35774e6d314e91),
    (0, $2519a10c9a0ebef2$export$5935ea4bf04c4453),
    (0, $f735e67f61f64b89$export$ce970371e0e850bc),
    (0, $23bc52f6d80ffa0b$export$7830a85a59ca4593),
    (0, $370fc9f1fb64c5cc$export$85479a00ad164ad6),
    (0, $44221962b60306bc$export$c19e3a57d69468ea),
    (0, $d53bca867b0d5879$export$6a60f6b74bbaccb8),
    (0, $7d567cbd150e6a61$export$bbef9cc099c72f9d),
    (0, $969c5b61dd3c02f1$export$12815d889fe90b8),
    (0, $6c2cab82920c5ead$export$2839d627b6f3bcfe),
    (0, $49d2b3729450186e$export$33455cbcda538c68),
    (0, $cf02eb2496a3bc72$export$a3deb2ff0da16a68)
];
const $0bef5cd148f6f4f7$export$63e9417ed8d8533a = $0bef5cd148f6f4f7$export$6b22fa9a84a4797f.map((p)=>p.name);
const $0bef5cd148f6f4f7$export$4f34a1c822988d11 = [
    (0, $9d2ad5acc773d924$export$474d593e43f12abd),
    (0, $c5a475aecaa24150$export$ef35774e6d314e91),
    (0, $2519a10c9a0ebef2$export$5935ea4bf04c4453),
    (0, $f735e67f61f64b89$export$ce970371e0e850bc),
    (0, $23bc52f6d80ffa0b$export$7830a85a59ca4593),
    (0, $cf02eb2496a3bc72$export$a3deb2ff0da16a68)
];
// prepare protocol map, handlers and schemas
for (const protocol of $0bef5cd148f6f4f7$export$4f34a1c822988d11){
    if (protocol.address) $0bef5cd148f6f4f7$var$enabledProtocols.set(protocol.address, protocol.name);
    $0bef5cd148f6f4f7$var$protocolHandlers.set(protocol.name, protocol.handler);
    if (protocol.opReturnSchema) $0bef5cd148f6f4f7$var$protocolOpReturnSchemas.set(protocol.name, protocol.opReturnSchema);
    if (protocol.scriptChecker) $0bef5cd148f6f4f7$var$protocolScriptCheckers.set(protocol.name, protocol.scriptChecker);
}
class $0bef5cd148f6f4f7$export$894a720e71f90b3c {
    constructor(){
        this.transformTx = async (tx)=>{
            if (!tx || !tx.in || !tx.out) throw new Error("Cannot process tx");
            // This will become our nicely formatted response object
            let dataObj = {};
            for (const [key, val] of Object.entries(tx)){
                if (key === "out") // loop over the outputs
                for (const out of tx.out){
                    const { tape: tape } = out;
                    // Process opReturn data
                    if (tape?.some((cc)=>(0, $caee5781971edf71$export$429a4e8902c23802)(cc))) dataObj = await this.processDataProtocols(tape, out, tx, dataObj);
                    // No OP_FALSE OP_RETURN in this tape
                    const _21e8Checker = this.protocolScriptCheckers.get((0, $370fc9f1fb64c5cc$export$85479a00ad164ad6).name);
                    const ordChecker = this.protocolScriptCheckers.get((0, $cf02eb2496a3bc72$export$a3deb2ff0da16a68).name);
                    // Check for 21e8 and ords
                    if (tape?.some((cc)=>{
                        const { cell: cell } = cc;
                        if (_21e8Checker?.(cell)) // 'found 21e8'
                        return true;
                        if (ordChecker?.(cell)) // 'found 1sat ordinal'
                        return true;
                    })) // find the cell array
                    // loop over tape
                    for (const cellContainer of tape){
                        const { cell: cell } = cellContainer;
                        // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                        if (!cell) throw new Error("empty cell while parsing");
                        let protocolName = "";
                        if (_21e8Checker?.(cell)) protocolName = (0, $370fc9f1fb64c5cc$export$85479a00ad164ad6).name;
                        else if (ordChecker?.(cell)) protocolName = (0, $cf02eb2496a3bc72$export$a3deb2ff0da16a68).name;
                        else continue;
                        this.process(protocolName, {
                            tx: tx,
                            cell: cell,
                            dataObj: dataObj,
                            tape: tape,
                            out: out
                        });
                    }
                }
                else if (key === "in") dataObj[key] = val.map((v)=>{
                    const r = {
                        ...v
                    };
                    delete r.tape;
                    return r;
                });
                else // known key, just write it retaining original type
                dataObj[key] = val;
            }
            // If this is a MOM planaria it will have metanet keys available
            if (dataObj.METANET && tx.parent) {
                const meta = {
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
            return dataObj;
        };
        this.processUnknown = (key, dataObj, out)=>{
            // no known non-OP_RETURN scripts
            if (key && !dataObj[key]) dataObj[key] = [];
            dataObj[key].push({
                i: out.i,
                e: out.e,
                tape: []
            });
        };
        this.process = async (protocolName, { cell: cell, dataObj: dataObj, tape: tape, out: out, tx: tx })=>{
            if (this.protocolHandlers.has(protocolName) && typeof this.protocolHandlers.get(protocolName) === "function") {
                const handler = this.protocolHandlers.get(protocolName);
                if (handler) /* eslint-disable no-await-in-loop */ await handler({
                    dataObj: dataObj,
                    cell: cell,
                    tape: tape,
                    out: out,
                    tx: tx
                });
            } else (0, $caee5781971edf71$export$23dbc584560299c3)(dataObj, protocolName, cell);
        };
        this.processDataProtocols = async (tape, out, tx, dataObj)=>{
            // loop over tape
            for (const cellContainer of tape){
                const { cell: cell } = cellContainer;
                if (!cell) throw new Error("empty cell while parsing");
                // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                if ((0, $caee5781971edf71$export$238b4e54af8fe886)(cellContainer)) continue;
                const prefix = cell[0].s;
                if (prefix) {
                    const bitcomProtocol = this.enabledProtocols.get(prefix) || $0bef5cd148f6f4f7$export$4f34a1c822988d11.filter((p)=>p.name === prefix)[0]?.name;
                    if (bitcomProtocol) await this.process(bitcomProtocol, {
                        cell: cell,
                        dataObj: dataObj,
                        tape: tape,
                        out: out,
                        tx: tx
                    });
                    else this.processUnknown(prefix, dataObj, out);
                }
            }
            return dataObj;
        };
        // initial default protocol handlers in this instantiation
        this.enabledProtocols = $0bef5cd148f6f4f7$var$enabledProtocols;
        this.protocolHandlers = $0bef5cd148f6f4f7$var$protocolHandlers;
        this.protocolScriptCheckers = $0bef5cd148f6f4f7$var$protocolScriptCheckers;
        this.protocolOpReturnSchemas = $0bef5cd148f6f4f7$var$protocolOpReturnSchemas;
    }
    addProtocolHandler({ name: name, address: address, opReturnSchema: opReturnSchema, handler: handler, scriptChecker: scriptChecker }) {
        if (address) this.enabledProtocols.set(address, name);
        this.protocolHandlers.set(name, handler);
        if (opReturnSchema) this.protocolOpReturnSchemas.set(name, opReturnSchema);
        if (scriptChecker) this.protocolScriptCheckers.set(name, scriptChecker);
    }
}
const $0bef5cd148f6f4f7$export$54850c299f4a06d8 = async (txid)=>{
    const url = `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`;
    console.log("hitting", url);
    const res = await fetch(url);
    return await res.text();
};
const $0bef5cd148f6f4f7$export$2905b0423a229d9 = async (rawTx)=>{
    const bpuTx = await (0, $71XCL$bputs.parse)({
        tx: {
            r: rawTx
        },
        split: [
            {
                token: {
                    op: 106
                },
                include: "l"
            },
            {
                token: {
                    s: "|"
                }
            }
        ]
    });
    return bpuTx;
};
const $0bef5cd148f6f4f7$export$b2a90e318402f6bc = async (tx, protocols)=>{
    if (typeof tx === "string") {
        let rawTx;
        // if it a txid or  complete transaction hex?
        if (tx.length === 64) // txid - fetch raw tx
        rawTx = await $0bef5cd148f6f4f7$export$54850c299f4a06d8(tx);
        if (Buffer.from(tx).byteLength <= 146) throw new Error("Invalid rawTx");
        if (!rawTx) rawTx = tx;
        // TODO: Double check 146 is intended to be minimum possible byte length for a tx
        const bobTx = await $0bef5cd148f6f4f7$export$2905b0423a229d9(rawTx);
        if (bobTx) tx = bobTx;
        else throw new Error("Invalid txid");
    }
    const b = new $0bef5cd148f6f4f7$export$894a720e71f90b3c();
    // if protocols are specified
    if (protocols) {
        // wipe out defaults
        b.enabledProtocols.clear();
        if ((0, $caee5781971edf71$export$f6e922e536d8305c)(protocols)) {
            // set enabled protocols
            for (const protocol of $0bef5cd148f6f4f7$export$6b22fa9a84a4797f)if (protocols?.includes(protocol.name)) b.addProtocolHandler(protocol);
        } else if ((0, $caee5781971edf71$export$37b8d83213de0f5f)(protocols)) for (const p of protocols){
            const protocol = p;
            if (protocol) b.addProtocolHandler(protocol);
        }
        else throw new Error("Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).");
    }
    return b.transformTx(tx);
};


//# sourceMappingURL=bmap.js.map
