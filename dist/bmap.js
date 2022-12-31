var $iP6iL$tsbitcoincore = require("@ts-bitcoin/core");
var $iP6iL$buffer = require("buffer");
var $iP6iL$nodefetch = require("node-fetch");
var $iP6iL$crypto = require("crypto");
var $iP6iL$boostpow = require("boostpow");
var $iP6iL$msgpackmsgpack = require("@msgpack/msgpack");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "BMAP", () => $d4689e6be4abd8e2$export$894a720e71f90b3c);
$parcel$export(module.exports, "TransformTx", () => $d4689e6be4abd8e2$export$b2a90e318402f6bc);
// import default protocols





const $ad115897f795de9e$export$b691916706e0e9cc = (pushData, schemaEncoding)=>{
    if (!pushData) throw new Error(`cannot get cell value of: ${pushData}`);
    else if (schemaEncoding === "string") return pushData["s"] ? pushData.s : pushData.ls || "";
    else if (schemaEncoding === "hex") return pushData["h"] ? pushData.h : pushData.lh || "";
    else if (schemaEncoding === "number") return parseInt(pushData["h"] ? pushData.h : pushData.lh || "0", 16);
    else if (schemaEncoding === "file") return `bitfs://${pushData["f"] ? pushData.f : pushData.lf}`;
    return (pushData["b"] ? pushData.b : pushData.lb) || "";
};
const $ad115897f795de9e$export$238b4e54af8fe886 = function(cc) {
    return cc.cell[0] && cc.cell[1] && cc.cell[0].op === 0 && cc.cell[1].op && cc.cell[1].op === 106 || cc.cell[0].op === 106;
};
const $ad115897f795de9e$export$23dbc584560299c3 = (dataObj, protocolName, data)=>{
    if (!dataObj[protocolName]) dataObj[protocolName] = [
        data
    ];
    else {
        if (!Array.isArray(dataObj[protocolName])) {
            const prevData = dataObj[protocolName];
            dataObj[protocolName] = [];
            dataObj[protocolName][0] = prevData;
        }
        dataObj[protocolName][dataObj[protocolName].length] = data;
    }
};
const $ad115897f795de9e$export$9c363cd18b34077b = function(protocolName, querySchema, dataObj, cell, tx) {
    // loop over the schema
    const obj = {};
    // Does not have the required number of fields
    const length = querySchema.length + 1;
    if (cell.length < length) throw new Error(`${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`);
    for (const [idx, schemaField] of Object.entries(querySchema)){
        const x = parseInt(idx, 10);
        const [field] = Object.keys(schemaField);
        const [schemaEncoding] = Object.values(schemaField);
        obj[field] = $ad115897f795de9e$export$b691916706e0e9cc(cell[x + 1], schemaEncoding);
    }
    $ad115897f795de9e$export$23dbc584560299c3(dataObj, protocolName, obj);
};
const $ad115897f795de9e$export$ca4d6504ca148ae4 = function(data) {
    const regex = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
    return new RegExp(`^${regex}$`, "gi").test(data);
};
const $ad115897f795de9e$export$bced8d2aada2d1c9 = async (msgBuffer)=>{
    const hash = await (window ? window.crypto : (0, $iP6iL$crypto.webcrypto)).subtle.digest(// const hash = await (webcrypto || window.crypto).subtle.digest(
    "SHA-256", msgBuffer);
    return (0, $iP6iL$buffer.Buffer).from(hash);
};


const $69628e315d1a24a5$var$address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
const $69628e315d1a24a5$var$querySchema = [
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
const $69628e315d1a24a5$var$getFileBuffer = async function(bitfsRef) {
    let fileBuffer = (0, $iP6iL$buffer.Buffer).from("");
    try {
        const result = await (0, ($parcel$interopDefault($iP6iL$nodefetch)))(`https://x.bitfs.network/${bitfsRef}`, {});
        fileBuffer = await result.buffer();
    } catch (e) {
        console.error(e);
    }
    return fileBuffer;
};
const $69628e315d1a24a5$var$validateSignature = async function(aipObj, cell, tape) {
    if (!Array.isArray(tape) || tape.length < 3) throw new Error("AIP requires at least 3 cells including the prefix");
    let cellIndex = -1;
    tape.forEach((cc, index)=>{
        if (cc.cell === cell) cellIndex = index;
    });
    if (cellIndex === -1) throw new Error("AIP could not find cell in tape");
    let usingIndexes = aipObj.index || [];
    const signatureValues = [
        "6a"
    ] // OP_RETURN - is included in AIP
    ;
    for(let i = 0; i < cellIndex; i++){
        const cellContainer = tape[i];
        if (!(0, $ad115897f795de9e$export$238b4e54af8fe886)(cellContainer)) {
            for(let nc = 0; nc < cellContainer.cell.length; nc++){
                const statement = cellContainer.cell[nc];
                // add the value as hex
                if (statement.h) signatureValues.push(statement.h);
                else if (statement.f) {
                    // file reference - we need to get the file from bitfs
                    const fileBuffer = await $69628e315d1a24a5$var$getFileBuffer(statement.f);
                    signatureValues.push(fileBuffer.toString("hex"));
                } else if (statement.b) // no hex? try base64
                signatureValues.push((0, $iP6iL$buffer.Buffer).from(statement.b, "base64").toString("hex"));
                else if (statement.s) signatureValues.push((0, $iP6iL$buffer.Buffer).from(statement.s).toString("hex"));
            }
            signatureValues.push("7c") // | hex
            ;
        }
    }
    if (aipObj.hashing_algorithm) // when using HAIP, we need to parse the indexes in a non standard way
    // indexLength is byte size of the indexes being described
    {
        if (aipObj.index_unit_size) {
            const indexLength = aipObj.index_unit_size * 2;
            usingIndexes = [];
            const indexes = cell[6].h;
            for(let i1 = 0; i1 < indexes.length; i1 += indexLength)usingIndexes.push(parseInt(indexes.substr(i1, indexLength), 16));
            aipObj.index = usingIndexes;
        }
    }
    const signatureBufferStatements = [];
    // check whether we need to only sign some indexes
    if (usingIndexes.length > 0) usingIndexes.forEach((index)=>{
        signatureBufferStatements.push((0, $iP6iL$buffer.Buffer).from(signatureValues[index], "hex"));
    });
    else // add all the values to the signature buffer
    signatureValues.forEach((statement)=>{
        signatureBufferStatements.push((0, $iP6iL$buffer.Buffer).from(statement, "hex"));
    });
    let messageBuffer;
    if (aipObj.hashing_algorithm) {
        // this is actually Hashed-AIP (HAIP) and works a bit differently
        if (!aipObj.index_unit_size) // remove OP_RETURN - will be added by Script.buildDataOut
        signatureBufferStatements.shift();
        const dataScript = (0, $iP6iL$tsbitcoincore.Script).fromSafeDataArray(signatureBufferStatements);
        let dataBuffer = (0, $iP6iL$buffer.Buffer).from(dataScript.toHex(), "hex");
        if (aipObj.index_unit_size) // the indexed buffer should not contain the OP_RETURN opcode, but this
        // is added by the buildDataOut function automatically. Remove it.
        dataBuffer = dataBuffer.slice(1);
        messageBuffer = await (0, $ad115897f795de9e$export$bced8d2aada2d1c9)((0, $iP6iL$buffer.Buffer).from(dataBuffer.toString("hex")));
    } else // regular AIP
    messageBuffer = (0, $iP6iL$buffer.Buffer).concat([
        ...signatureBufferStatements
    ]);
    // AIOP uses address, HAIP uses signing_address field names
    const adressString = aipObj.address || aipObj.signing_address;
    // verify aip signature
    try {
        aipObj.verified = (0, $iP6iL$tsbitcoincore.Bsm).verify(messageBuffer, aipObj.signature || "", (0, $iP6iL$tsbitcoincore.Address).fromString(adressString));
    } catch (e) {
        aipObj.verified = false;
    }
    // Try if this is a Twetch compatible AIP signature
    if (!aipObj.verified) {
        // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
        // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")
        messageBuffer = (0, $iP6iL$buffer.Buffer).concat([
            ...signatureBufferStatements.slice(1, signatureBufferStatements.length - 1)
        ]);
        const buff = await (0, $ad115897f795de9e$export$bced8d2aada2d1c9)(messageBuffer);
        messageBuffer = (0, $iP6iL$buffer.Buffer).from(buff.toString("hex"));
        try {
            aipObj.verified = (0, $iP6iL$tsbitcoincore.Bsm).verify(messageBuffer, aipObj.signature || "", (0, $iP6iL$tsbitcoincore.Address).fromString(adressString));
        } catch (e1) {
            aipObj.verified = false;
        }
    }
    return aipObj.verified || false;
};
let $69628e315d1a24a5$export$6c117c038f18b127;
(function(SIGPROTO) {
    SIGPROTO["HAIP"] = "HAIP";
    SIGPROTO["AIP"] = "AIP";
    SIGPROTO["BITCOM_HASHED"] = "BITCOM_HASHED";
})($69628e315d1a24a5$export$6c117c038f18b127 || ($69628e315d1a24a5$export$6c117c038f18b127 = {}));
const $69628e315d1a24a5$export$f0079d0908cdbf96 = async function(useQuerySchema, protocol, dataObj, cell, tape, tx) {
    // loop over the schema
    const aipObj = {};
    // Does not have the required number of fields
    if (cell.length < 4) throw new Error("AIP requires at least 4 fields including the prefix " + tx);
    for (const [idx, schemaField] of Object.entries(useQuerySchema)){
        const x = parseInt(idx, 10);
        let schemaEncoding;
        let aipField;
        if (schemaField instanceof Array) {
            // signature indexes are specified
            schemaEncoding = schemaField[0].index;
            [aipField] = Object.keys(schemaField[0]);
            // run through the rest of the fields in this cell, should be de indexes
            const fieldData = [];
            for(let i = x + 1; i < cell.length; i++)if (cell[i].h && Array.isArray(fieldData)) fieldData.push(parseInt(cell[i].h || "", 16));
            aipObj[aipField] = fieldData;
            continue;
        } else {
            [aipField] = Object.keys(schemaField);
            [schemaEncoding] = Object.values(schemaField);
        }
        aipObj[aipField] = (0, $ad115897f795de9e$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding) || "";
    }
    // There is an issue where some services add the signature as binary to the transaction
    // whereas others add the signature as base64. This will confuse bob and the parser and
    // the signature will not be verified. When the signature is added in binary cell[3].s is
    // binary, otherwise cell[3].s contains the base64 signature and should be used.
    if (cell[0].s === $69628e315d1a24a5$var$address && cell[3].s && (0, $ad115897f795de9e$export$ca4d6504ca148ae4)(cell[3].s)) aipObj.signature = cell[3].s;
    if (!aipObj.signature) throw new Error("AIP requires a signature " + tx);
    await $69628e315d1a24a5$var$validateSignature(aipObj, cell, tape);
    (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, protocol, aipObj);
};
const $69628e315d1a24a5$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    if (!tape) throw new Error("Invalid AIP transaction. tape is required");
    if (!tx) throw new Error("Invalid AIP transaction. tx is required");
    return await $69628e315d1a24a5$export$f0079d0908cdbf96($69628e315d1a24a5$var$querySchema, "AIP", dataObj, cell, tape, tx);
};
const $69628e315d1a24a5$export$474d593e43f12abd = {
    name: "AIP",
    address: $69628e315d1a24a5$var$address,
    querySchema: $69628e315d1a24a5$var$querySchema,
    handler: $69628e315d1a24a5$var$handler
};



const $ba0e169d28d08495$var$address = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
const $ba0e169d28d08495$var$querySchema = [
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
const $ba0e169d28d08495$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    const encodingMap = new Map();
    encodingMap.set("utf8", "string");
    encodingMap.set("text", "string") // invalid but people use it :(
    ;
    encodingMap.set("gzip", "binary") // invalid but people use it :(
    ;
    encodingMap.set("text/plain", "string");
    encodingMap.set("image/png", "binary");
    encodingMap.set("image/jpeg", "binary");
    if (!cell[1] || !cell[2]) throw new Error(`Invalid B tx: ${tx}`);
    // Check pushdata length + 1 for protocol prefix
    if (cell.length > $ba0e169d28d08495$var$querySchema.length + 1) throw new Error("Invalid B tx. Too many fields.");
    // Make sure there are not more fields than possible
    const bObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($ba0e169d28d08495$var$querySchema)){
        const x = parseInt(idx, 10);
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
            } else schemaEncoding = cell[3] && cell[3].s ? encodingMap.get(cell[3].s.replace("-", "").toLowerCase()) : null;
        }
        // encoding is not required
        if (bField === "encoding" && !cell[x + 1]) continue;
        // filename is not required
        if (bField === "filename" && !cell[x + 1]) continue;
        // check for malformed syntax
        if (!cell || !cell[x + 1]) throw new Error("malformed B syntax " + cell);
        // set field value from either s, b, ls, or lb depending on encoding and availability
        const data = cell[x + 1];
        bObj[bField] = (0, $ad115897f795de9e$export$b691916706e0e9cc)(data, schemaEncoding);
    }
    (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, "B", bObj);
};
const $ba0e169d28d08495$export$ef35774e6d314e91 = {
    name: "B",
    address: $ba0e169d28d08495$var$address,
    querySchema: $ba0e169d28d08495$var$querySchema,
    handler: $ba0e169d28d08495$var$handler
};



const $a657c906f7aff940$var$address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";
const $a657c906f7aff940$var$querySchema = [
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
const $a657c906f7aff940$export$c3c52e219617878 = ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!tx) throw new Error(`Invalid BAP tx, tx required`);
    (0, $ad115897f795de9e$export$9c363cd18b34077b)("BAP", $a657c906f7aff940$var$querySchema, dataObj, cell, tx);
};
const $a657c906f7aff940$export$5935ea4bf04c4453 = {
    name: "BAP",
    address: $a657c906f7aff940$var$address,
    querySchema: $a657c906f7aff940$var$querySchema,
    handler: $a657c906f7aff940$export$c3c52e219617878
};





const $cc0bec57c0a70920$var$protocolIdentifier = "boostpow";
const $cc0bec57c0a70920$export$a52badcaecf73796 = (cell)=>{
    // protocol identifier always in first pushdata
    return cell[0].s === $cc0bec57c0a70920$var$protocolIdentifier;
};
const $cc0bec57c0a70920$var$handler = ({ dataObj: dataObj , cell: cell , out: out , tx: tx  })=>{
    if (!tx || !cell[0] || !out) throw new Error(`Invalid BOOST tx. dataObj, cell, out and tx are required.`);
    console.log({
        Buffer: $iP6iL$buffer.Buffer
    });
    // build ASM from either op codes and script chunks
    const asm = cell.map((c)=>c.ops ? c.ops : c.h || "").join(" ");
    if (asm) {
        const boostJob = (0, $iP6iL$boostpow.BoostPowJob).fromASM(asm, tx.tx.h, out.i, out.e.v).toObject();
        (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, "BOOST", boostJob);
    }
};
const $cc0bec57c0a70920$export$13c3c8ee12090ebc = {
    name: "BOOST",
    handler: $cc0bec57c0a70920$var$handler,
    address: $cc0bec57c0a70920$var$protocolIdentifier
};





const $6e436a2e9e168a78$var$address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const $6e436a2e9e168a78$var$querySchema = [
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
const $6e436a2e9e168a78$var$processADD = function(cell, mapObj) {
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
const $6e436a2e9e168a78$var$proccessDELETE = function(cell, mapObj) {
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
const $6e436a2e9e168a78$var$processSELECT = function(cell, mapObj) {
    // TODO
    // console.log('MAP SELECT');
    for (const pushdataContainer of cell)// ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
        mapObj.SELECT = "TODO";
        continue;
    }
};
const $6e436a2e9e168a78$var$processMSGPACK = function(cell, mapObj) {
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            if (!(0, $iP6iL$msgpackmsgpack.decode)) throw new Error("Msgpack is required but not loaded");
            const buff = (0, $iP6iL$buffer.Buffer).from(pushdataContainer.b, "base64");
            mapObj = (0, $iP6iL$msgpackmsgpack.decode)(buff);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
const $6e436a2e9e168a78$var$processJSON = function(cell, mapObj) {
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
const $6e436a2e9e168a78$var$processSET = function(cell, mapObj) {
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
const $6e436a2e9e168a78$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    // Validate
    if (cell[0].s !== $6e436a2e9e168a78$var$address || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) throw new Error(`Invalid MAP record: ${tx}`);
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
    const mapCmdKey = Object.keys($6e436a2e9e168a78$var$querySchema[0])[0];
    // Add the firt MAP command in the response object
    mapObj[mapCmdKey] = commands[0][0].s;
    commands.forEach((cc)=>{
        // re-add the MAP address
        cc.unshift({
            s: $6e436a2e9e168a78$var$address,
            i: 0
        });
        const command = cc[1].s;
        // Individual parsing rules for each MAP command
        switch(command){
            // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
            case "ADD":
                $6e436a2e9e168a78$var$processADD(cc, mapObj);
                break;
            case "REMOVE":
                mapObj.key = cc[2].s;
                break;
            case "DELETE":
                $6e436a2e9e168a78$var$proccessDELETE(cc, mapObj);
                break;
            case "CLEAR":
                break;
            case "SELECT":
                $6e436a2e9e168a78$var$processSELECT(cc, mapObj);
                break;
            case "MSGPACK":
                mapObj = $6e436a2e9e168a78$var$processMSGPACK(cc, mapObj);
                break;
            case "JSON":
                mapObj = $6e436a2e9e168a78$var$processJSON(cc, mapObj);
                break;
            case "SET":
                $6e436a2e9e168a78$var$processSET(cc, mapObj);
                break;
            default:
        }
    });
    (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, "MAP", mapObj);
};
const $6e436a2e9e168a78$export$ce970371e0e850bc = {
    name: "MAP",
    address: $6e436a2e9e168a78$var$address,
    querySchema: $6e436a2e9e168a78$var$querySchema,
    handler: $6e436a2e9e168a78$var$handler
};




const $0ca33a82c6135f7e$var$address = "meta";
const $0ca33a82c6135f7e$var$querySchema = [
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
const $0ca33a82c6135f7e$export$3eb18141230d6532 = async function(a, tx) {
    // Calculate the node ID
    const buf = (0, $iP6iL$buffer.Buffer).from(a + tx);
    const hashBuf = await (0, $ad115897f795de9e$export$bced8d2aada2d1c9)(buf);
    return hashBuf.toString("hex");
};
const $0ca33a82c6135f7e$var$handler = async ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!cell.length || cell[0].s !== "meta" || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s || !tx) throw new Error("Invalid Metanet tx " + tx);
    // For now, we just copy from MOM keys later if available, or keep BOB format
    const nodeId = await $0ca33a82c6135f7e$export$3eb18141230d6532(cell[1].s, tx.tx.h);
    // Described this node
    const node = {
        a: cell[1].s,
        tx: tx.tx.h,
        id: nodeId
    };
    let parent = {};
    if (tx.in) {
        const parentId = await $0ca33a82c6135f7e$export$3eb18141230d6532(tx.in[0].e.a, cell[2].s);
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
const $0ca33a82c6135f7e$export$7830a85a59ca4593 = {
    name: "METANET",
    address: $0ca33a82c6135f7e$var$address,
    querySchema: $0ca33a82c6135f7e$var$querySchema,
    handler: $0ca33a82c6135f7e$var$handler
};



// 21e8 does not use the first pushdata for id
// in fact there is no id since the 21e8 is designed for difficulty and can be changed
// instead we use the static part of the script to indentfy the transaction
// TODO - the OP_X_PLACEHOLDER is the number of bytes to push onto the stack and must match difficulty size
const $24d0e6454775ab7d$var$_21e8Script = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" ");
const $24d0e6454775ab7d$export$35263eb1836849b4 = (cell)=>{
    if (cell.length !== 12) // wrong length
    return false;
    // match exact script
    const ops = [
        ...cell
    ].map((c)=>c.ops).splice(2, cell.length);
    // calculate target byte length
    const target = (0, $ad115897f795de9e$export$b691916706e0e9cc)(cell[1], "hex");
    const targetOpSize = Buffer.from(target).byteLength;
    // replace the placeholder opcode with actual
    ops[1] = `OP_${targetOpSize}`;
    $24d0e6454775ab7d$var$_21e8Script[1] = `OP_${targetOpSize}`;
    // protocol identifier always in first pushdata
    return ops.join() === $24d0e6454775ab7d$var$_21e8Script.join();
};
const $24d0e6454775ab7d$var$handler = ({ dataObj: dataObj , cell: cell , out: out  })=>{
    if (!cell[0] || !out) throw new Error(`Invalid 21e8 tx. dataObj, cell, out and tx are required.`);
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    const txid = (0, $ad115897f795de9e$export$b691916706e0e9cc)(cell[0], "hex");
    const target = (0, $ad115897f795de9e$export$b691916706e0e9cc)(cell[1], "hex");
    if (!target) throw new Error(`Invalid 21e8 target.` + JSON.stringify(cell[0], null, 2));
    const difficulty = Buffer.from(target, "hex").byteLength;
    const _21e8Obj = {
        target: target,
        difficulty: difficulty,
        value: out.e.v,
        txid: txid
    };
    (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, "21E8", _21e8Obj);
};
const $24d0e6454775ab7d$export$85479a00ad164ad6 = {
    name: "21E8",
    handler: $24d0e6454775ab7d$var$handler
};



const $d4689e6be4abd8e2$var$protocolMap = new Map([]);
const $d4689e6be4abd8e2$var$protocolHandlers = new Map();
const $d4689e6be4abd8e2$var$protocolQuerySchemas = new Map();
const $d4689e6be4abd8e2$var$defaultProtocols = [
    (0, $69628e315d1a24a5$export$474d593e43f12abd),
    (0, $ba0e169d28d08495$export$ef35774e6d314e91),
    (0, $a657c906f7aff940$export$5935ea4bf04c4453),
    (0, $6e436a2e9e168a78$export$ce970371e0e850bc),
    (0, $0ca33a82c6135f7e$export$7830a85a59ca4593)
];
// prepare protocol map, handlers and schemas
$d4689e6be4abd8e2$var$defaultProtocols.forEach((protocol)=>{
    if (protocol.address) $d4689e6be4abd8e2$var$protocolMap.set(protocol.address, protocol.name);
    $d4689e6be4abd8e2$var$protocolHandlers.set(protocol.name, protocol.handler);
    if (protocol.querySchema) $d4689e6be4abd8e2$var$protocolQuerySchemas.set(protocol.name, protocol.querySchema);
});
class $d4689e6be4abd8e2$export$894a720e71f90b3c {
    constructor(){
        // initial default protocol handlers in this instantiation
        this.protocolMap = $d4689e6be4abd8e2$var$protocolMap;
        this.protocolHandlers = $d4689e6be4abd8e2$var$protocolHandlers;
        this.protocolQuerySchemas = $d4689e6be4abd8e2$var$protocolQuerySchemas;
    }
    addProtocolHandler({ name: name , address: address , querySchema: querySchema , handler: handler  }) {
        if (address) this.protocolMap.set(address, name);
        this.protocolHandlers.set(name, handler);
        if (querySchema) this.protocolQuerySchemas.set(name, querySchema);
    }
    transformTx = async (tx)=>{
        if (!tx || !tx["in"] || !tx["out"]) throw new Error("Cannot process tx");
        // This will become our nicely formatted response object
        const dataObj = {};
        for (const [key, val] of Object.entries(tx)){
            if (key === "out") // loop over the outputs
            for (const out of tx.out){
                const { tape: tape  } = out;
                if (tape === null || tape === void 0 ? void 0 : tape.some((cc)=>(0, $ad115897f795de9e$export$238b4e54af8fe886)(cc))) // loop over tape
                for (const cellContainer of tape){
                    // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                    if ((0, $ad115897f795de9e$export$238b4e54af8fe886)(cellContainer)) continue;
                    const { cell: cell  } = cellContainer;
                    if (!cell) throw new Error("empty cell while parsing");
                    const prefix = cell[0].s;
                    await this.process(this.protocolMap.get(prefix || "") || "", {
                        cell: cell,
                        dataObj: dataObj,
                        tape: tape,
                        out: out,
                        tx: tx
                    });
                }
                else {
                    // No OP_RETURN in this tape
                    // Check for boostpow and 21e8
                    if (tape === null || tape === void 0 ? void 0 : tape.some((cc)=>{
                        const { cell: cell  } = cc;
                        if (this.protocolHandlers.has((0, $cc0bec57c0a70920$export$13c3c8ee12090ebc).name) && (0, $cc0bec57c0a70920$export$a52badcaecf73796)(cell)) // 'found boost'
                        return true;
                        if (this.protocolHandlers.has((0, $24d0e6454775ab7d$export$85479a00ad164ad6).name) && (0, $24d0e6454775ab7d$export$35263eb1836849b4)(cell)) // 'found 21e8'
                        return true;
                    })) // find the cell array
                    // loop over tape
                    for (const cellContainer1 of tape){
                        const { cell: cell1  } = cellContainer1;
                        // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                        if (!cell1) throw new Error("empty cell while parsing");
                        let protocolName = "";
                        if ((0, $cc0bec57c0a70920$export$a52badcaecf73796)(cell1)) protocolName = (0, $cc0bec57c0a70920$export$13c3c8ee12090ebc).name;
                        else if ((0, $24d0e6454775ab7d$export$35263eb1836849b4)(cell1)) protocolName = (0, $24d0e6454775ab7d$export$85479a00ad164ad6).name;
                        else continue;
                        this.process(protocolName, {
                            tx: tx,
                            cell: cell1,
                            dataObj: dataObj,
                            tape: tape,
                            out: out
                        });
                    }
                    else this.processUnknown(key, dataObj, out);
                }
            }
            else if (key === "in") // TODO: Boost check inputs to see if this is a tx solving a puzzle
            // TODO: 21e8 check inputs to see if this is a tx solving a puzzle
            dataObj[key] = val.map((v)=>{
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
        if (dataObj["METANET"] && tx.parent) {
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
    processUnknown = (key, dataObj, out)=>{
        // no known non-OP_RETURN scripts
        if (key && !dataObj[key]) dataObj[key] = [];
        dataObj[key].push({
            i: out.i,
            e: out.e
        });
    };
    process = async (protocolName, { cell: cell , dataObj: dataObj , tape: tape , out: out , tx: tx  })=>{
        if (this.protocolHandlers.has(protocolName) && typeof this.protocolHandlers.get(protocolName) === "function") {
            const handler = this.protocolHandlers.get(protocolName);
            if (handler) /* eslint-disable no-await-in-loop */ await handler({
                dataObj: dataObj,
                cell: cell,
                tape: tape,
                out: out,
                tx: tx
            });
        } else (0, $ad115897f795de9e$export$23dbc584560299c3)(dataObj, protocolName, cell);
    };
}
const $d4689e6be4abd8e2$export$b2a90e318402f6bc = async (tx)=>{
    const b = new $d4689e6be4abd8e2$export$894a720e71f90b3c();
    return b.transformTx(tx);
};


//# sourceMappingURL=bmap.js.map
