import {parse as $jv79A$parse} from "bpu-ts";
import {Script as $jv79A$Script, Bsm as $jv79A$Bsm, Address as $jv79A$Address, PubKey as $jv79A$PubKey} from "@ts-bitcoin/core";
import {Buffer as $jv79A$Buffer} from "buffer";
import $jv79A$nodefetch from "node-fetch";
import $jv79A$crypto from "crypto";
import {PaymailClient as $jv79A$PaymailClient} from "@moneybutton/paymail-client";
import $jv79A$dns from "dns";
import {BoostPowJob as $jv79A$BoostPowJob} from "boostpow";
import {decode as $jv79A$decode} from "@msgpack/msgpack";
import {findIndex as $jv79A$findIndex} from "lodash";







const $77262b005a06c166$export$f6e922e536d8305c = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return typeof value === "string";
    });
};
const $77262b005a06c166$export$37b8d83213de0f5f = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return value === "object";
    });
};
const $77262b005a06c166$export$b691916706e0e9cc = (pushData, schemaEncoding)=>{
    if (!pushData) throw new Error(`cannot get cell value of: ${pushData}`);
    else if (schemaEncoding === "string") return pushData["s"] ? pushData.s : pushData.ls || "";
    else if (schemaEncoding === "hex") return pushData["h"] ? pushData.h : pushData.lh || (pushData["b"] ? (0, $jv79A$Buffer).from(pushData.b, "base64").toString("hex") : pushData.lb && (0, $jv79A$Buffer).from(pushData.lb, "base64").toString("hex")) || "";
    else if (schemaEncoding === "number") return parseInt(pushData["h"] ? pushData.h : pushData.lh || "0", 16);
    else if (schemaEncoding === "file") return `bitfs://${pushData["f"] ? pushData.f : pushData.lf}`;
    return (pushData["b"] ? pushData.b : pushData.lb) || "";
};
const $77262b005a06c166$export$238b4e54af8fe886 = function(cc) {
    return cc.cell[0] && cc.cell[1] && cc.cell[0].op === 0 && cc.cell[1].op && cc.cell[1].op === 106 || cc.cell[0].op === 106;
};
const $77262b005a06c166$export$23dbc584560299c3 = (dataObj, protocolName, data)=>{
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
const $77262b005a06c166$export$ee2a8bbe689a8ef5 = function(protocolName, opReturnSchema, dataObj, cell, tx) {
    // loop over the schema
    const obj = {};
    // Does not have the required number of fields
    const length = opReturnSchema.length + 1;
    if (cell.length < length) throw new Error(`${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`);
    for (const [idx, schemaField] of Object.entries(opReturnSchema)){
        const x = parseInt(idx, 10);
        const [field] = Object.keys(schemaField);
        const [schemaEncoding] = Object.values(schemaField);
        obj[field] = $77262b005a06c166$export$b691916706e0e9cc(cell[x + 1], schemaEncoding);
    }
    $77262b005a06c166$export$23dbc584560299c3(dataObj, protocolName, obj);
};
const $77262b005a06c166$export$ca4d6504ca148ae4 = function(data) {
    const regex = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
    return new RegExp(`^${regex}$`, "gi").test(data);
};
const $77262b005a06c166$export$bced8d2aada2d1c9 = async (msgBuffer)=>{
    let hash;
    if ((0, $jv79A$crypto).subtle) {
        hash = await (0, $jv79A$crypto).subtle.digest("SHA-256", msgBuffer);
        return (0, $jv79A$Buffer).from(hash);
    }
    // }
    return (0, $jv79A$Buffer).from(new ArrayBuffer(0));
};


const $61ba31d33606de34$var$address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
const $61ba31d33606de34$var$opReturnSchema = [
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
const $61ba31d33606de34$var$getFileBuffer = async function(bitfsRef) {
    let fileBuffer = (0, $jv79A$Buffer).from("");
    try {
        const result = await (0, $jv79A$nodefetch)(`https://x.bitfs.network/${bitfsRef}`, {});
        fileBuffer = await result.buffer();
    } catch (e) {
        console.error(e);
    }
    return fileBuffer;
};
const $61ba31d33606de34$var$validateSignature = async function(aipObj, cell, tape) {
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
        if (!(0, $77262b005a06c166$export$238b4e54af8fe886)(cellContainer)) {
            for(let nc = 0; nc < cellContainer.cell.length; nc++){
                const statement = cellContainer.cell[nc];
                // add the value as hex
                if (statement.h) signatureValues.push(statement.h);
                else if (statement.f) {
                    // file reference - we need to get the file from bitfs
                    const fileBuffer = await $61ba31d33606de34$var$getFileBuffer(statement.f);
                    signatureValues.push(fileBuffer.toString("hex"));
                } else if (statement.b) // no hex? try base64
                signatureValues.push((0, $jv79A$Buffer).from(statement.b, "base64").toString("hex"));
                else if (statement.s) signatureValues.push((0, $jv79A$Buffer).from(statement.s).toString("hex"));
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
            for(let i = 0; i < indexes.length; i += indexLength)usingIndexes.push(parseInt(indexes.substr(i, indexLength), 16));
            aipObj.index = usingIndexes;
        }
    }
    const signatureBufferStatements = [];
    // check whether we need to only sign some indexes
    if (usingIndexes.length > 0) usingIndexes.forEach((index)=>{
        signatureBufferStatements.push((0, $jv79A$Buffer).from(signatureValues[index], "hex"));
    });
    else // add all the values to the signature buffer
    signatureValues.forEach((statement)=>{
        signatureBufferStatements.push((0, $jv79A$Buffer).from(statement, "hex"));
    });
    let messageBuffer;
    if (aipObj.hashing_algorithm) {
        // this is actually Hashed-AIP (HAIP) and works a bit differently
        if (!aipObj.index_unit_size) // remove OP_RETURN - will be added by Script.buildDataOut
        signatureBufferStatements.shift();
        const dataScript = (0, $jv79A$Script).fromSafeDataArray(signatureBufferStatements);
        let dataBuffer = (0, $jv79A$Buffer).from(dataScript.toHex(), "hex");
        if (aipObj.index_unit_size) // the indexed buffer should not contain the OP_RETURN opcode, but this
        // is added by the buildDataOut function automatically. Remove it.
        dataBuffer = dataBuffer.slice(1);
        messageBuffer = await (0, $77262b005a06c166$export$bced8d2aada2d1c9)((0, $jv79A$Buffer).from(dataBuffer.toString("hex")));
    } else // regular AIP
    messageBuffer = (0, $jv79A$Buffer).concat([
        ...signatureBufferStatements
    ]);
    // AIOP uses address, HAIP uses signing_address field names
    const adressString = aipObj.address || aipObj.signing_address;
    // verify aip signature
    try {
        aipObj.verified = (0, $jv79A$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $jv79A$Address).fromString(adressString));
    } catch (e) {
        aipObj.verified = false;
    }
    // Try if this is a Twetch compatible AIP signature
    if (!aipObj.verified) {
        // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
        // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")
        messageBuffer = (0, $jv79A$Buffer).concat([
            ...signatureBufferStatements.slice(1, signatureBufferStatements.length - 1)
        ]);
        const buff = await (0, $77262b005a06c166$export$bced8d2aada2d1c9)(messageBuffer);
        messageBuffer = (0, $jv79A$Buffer).from(buff.toString("hex"));
        try {
            aipObj.verified = (0, $jv79A$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $jv79A$Address).fromString(adressString));
        } catch (e) {
            aipObj.verified = false;
        }
    }
    return aipObj.verified || false;
};
let $61ba31d33606de34$export$6c117c038f18b127;
(function(SIGPROTO) {
    SIGPROTO["HAIP"] = "HAIP";
    SIGPROTO["AIP"] = "AIP";
    SIGPROTO["BITCOM_HASHED"] = "BITCOM_HASHED";
    SIGPROTO["PSP"] = "PSP";
})($61ba31d33606de34$export$6c117c038f18b127 || ($61ba31d33606de34$export$6c117c038f18b127 = {}));
const $61ba31d33606de34$export$f0079d0908cdbf96 = async function(useOpReturnSchema, protocol, dataObj, cell, tape, tx) {
    // loop over the schema
    const aipObj = {};
    // Does not have the required number of fields
    if (cell.length < 4) throw new Error("AIP requires at least 4 fields including the prefix " + tx);
    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)){
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
        aipObj[aipField] = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding) || "";
    }
    // There is an issue where some services add the signature as binary to the transaction
    // whereas others add the signature as base64. This will confuse bob and the parser and
    // the signature will not be verified. When the signature is added in binary cell[3].s is
    // binary, otherwise cell[3].s contains the base64 signature and should be used.
    if (cell[0].s === $61ba31d33606de34$var$address && cell[3].s && (0, $77262b005a06c166$export$ca4d6504ca148ae4)(cell[3].s)) aipObj.signature = cell[3].s;
    if (!aipObj.signature) throw new Error("AIP requires a signature " + tx);
    await $61ba31d33606de34$var$validateSignature(aipObj, cell, tape);
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, protocol, aipObj);
};
const $61ba31d33606de34$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    if (!tape) throw new Error("Invalid AIP transaction. tape is required");
    if (!tx) throw new Error("Invalid AIP transaction. tx is required");
    return await $61ba31d33606de34$export$f0079d0908cdbf96($61ba31d33606de34$var$opReturnSchema, "AIP", dataObj, cell, tape, tx);
};
const $61ba31d33606de34$export$474d593e43f12abd = {
    name: "AIP",
    address: $61ba31d33606de34$var$address,
    opReturnSchema: $61ba31d33606de34$var$opReturnSchema,
    handler: $61ba31d33606de34$var$handler
};



const $b60c7490dd9e63ed$var$address = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
const $b60c7490dd9e63ed$var$opReturnSchema = [
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
const $b60c7490dd9e63ed$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
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
    if (cell.length > $b60c7490dd9e63ed$var$opReturnSchema.length + 1) throw new Error("Invalid B tx. Too many fields.");
    // Make sure there are not more fields than possible
    const bObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($b60c7490dd9e63ed$var$opReturnSchema)){
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
        bObj[bField] = (0, $77262b005a06c166$export$b691916706e0e9cc)(data, schemaEncoding);
    }
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "B", bObj);
};
const $b60c7490dd9e63ed$export$ef35774e6d314e91 = {
    name: "B",
    address: $b60c7490dd9e63ed$var$address,
    opReturnSchema: $b60c7490dd9e63ed$var$opReturnSchema,
    handler: $b60c7490dd9e63ed$var$handler
};



const $e42beb934f07c56b$var$address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";
const $e42beb934f07c56b$var$opReturnSchema = [
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
const $e42beb934f07c56b$export$c3c52e219617878 = ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!tx) throw new Error(`Invalid BAP tx, tx required`);
    (0, $77262b005a06c166$export$ee2a8bbe689a8ef5)("BAP", $e42beb934f07c56b$var$opReturnSchema, dataObj, cell, tx);
};
const $e42beb934f07c56b$export$5935ea4bf04c4453 = {
    name: "BAP",
    address: $e42beb934f07c56b$var$address,
    opReturnSchema: $e42beb934f07c56b$var$opReturnSchema,
    handler: $e42beb934f07c56b$export$c3c52e219617878
};



const $a829b28489202b4c$var$protocolAddress = "$";
const $a829b28489202b4c$var$opReturnSchema = [
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
const $a829b28489202b4c$var$handler = ({ dataObj: dataObj , cell: cell  })=>{
    if (!cell.length || !cell.every((c)=>c.s)) throw new Error("Invalid Bitcom tx");
    // gather up the string values
    const bitcomObj = cell.map((c)=>c && c.s ? c.s : "");
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "BITCOM", bitcomObj);
};
const $a829b28489202b4c$export$c19e3a57d69468ea = {
    name: "BITCOM",
    address: $a829b28489202b4c$var$protocolAddress,
    opReturnSchema: $a829b28489202b4c$var$opReturnSchema,
    handler: $a829b28489202b4c$var$handler
};





/// <reference path="../types/paymail-client/index.d.ts"/>




const $c449dd2c82f24e2c$export$fe8725667d42151 = async function(paymail, publicKey) {
    if (typeof window !== "undefined") {
        // Paymail client will use BrowserDns if dns is null here
        // and isomorphic-fetch if fetch is null
        const client = new (0, $jv79A$PaymailClient)();
        return client.verifyPubkeyOwner(publicKey, paymail);
    } else {
        const client = new (0, $jv79A$PaymailClient)((0, $jv79A$dns), (0, $jv79A$nodefetch));
        return client.verifyPubkeyOwner(publicKey, paymail);
    }
};




const $04d70d7a9e677064$var$address = "1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4";
const $04d70d7a9e677064$var$opReturnSchema = [
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
const $04d70d7a9e677064$var$validateSignature = (pspObj, cell, tape)=>{
    if (!Array.isArray(tape) || tape.length < 3) throw new Error("PSP requires at least 3 cells including the prefix");
    let cellIndex = -1;
    tape.forEach((cc, index)=>{
        if (cc.cell === cell) cellIndex = index;
    });
    if (cellIndex === -1) throw new Error("PSP could not find cell in tape");
    const signatureBufferStatements = [];
    for(let i = 0; i < cellIndex; i++){
        const cellContainer = tape[i];
        if (!(0, $77262b005a06c166$export$238b4e54af8fe886)(cellContainer)) {
            cellContainer.cell.forEach((statement)=>{
                // add the value as hex
                let value = statement.h;
                if (!value) value = (0, $jv79A$Buffer).from(statement.b, "base64").toString("hex");
                if (!value) value = (0, $jv79A$Buffer).from(statement.s).toString("hex");
                signatureBufferStatements.push((0, $jv79A$Buffer).from(value, "hex"));
            });
            signatureBufferStatements.push((0, $jv79A$Buffer).from("7c", "hex")) // | hex ????
            ;
        }
    }
    const dataScript = (0, $jv79A$Script).fromSafeDataArray(signatureBufferStatements);
    const messageBuffer = (0, $jv79A$Buffer).from(dataScript.toHex(), "hex");
    // verify psp signature
    const publicKey = (0, $jv79A$PubKey).fromString(pspObj.pubkey);
    const signingAddress = (0, $jv79A$Address).fromPubKey(publicKey);
    try {
        pspObj.verified = (0, $jv79A$Bsm).verify(messageBuffer, pspObj.signature, signingAddress);
    } catch (e) {
        pspObj.verified = false;
    }
    return pspObj.verified;
};
const $04d70d7a9e677064$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape  })=>{
    // Paymail Signature Protocol
    // Validation
    if (!cell.length || cell[0].s !== $04d70d7a9e677064$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].b || !cell[2].s || !cell[3].s || !tape) throw new Error(`Invalid Paymail Signature Protocol record`);
    return await $04d70d7a9e677064$export$c3c3eee1546d651a($04d70d7a9e677064$var$opReturnSchema, (0, $61ba31d33606de34$export$6c117c038f18b127).PSP, dataObj, cell, tape);
};
const $04d70d7a9e677064$export$c3c3eee1546d651a = async (useOpReturnSchema, protocol, dataObj, cell, tape)=>{
    // loop over the schema
    const pspObj = {
        verified: false
    };
    // Does not have the required number of fields
    if (cell.length < 4) throw new Error("PSP requires at least 4 fields including the prefix " + cell);
    for (const [idx, schemaField] of Object.entries(useOpReturnSchema)){
        const x = parseInt(idx, 10);
        const [pspField] = Object.keys(schemaField);
        const [schemaEncoding] = Object.values(schemaField);
        pspObj[pspField] = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding);
    }
    if (!pspObj.signature) throw new Error("PSP requires a signature " + cell);
    //  TODO: we can only check on PSP until we figure out the BITCOM_HASHED fields
    //  verify signature
    if (protocol === (0, $61ba31d33606de34$export$6c117c038f18b127).PSP && !$04d70d7a9e677064$var$validateSignature(pspObj, cell, tape)) throw new Error("PSP requires a valid signature " + pspObj);
    // check the paymail public key
    if (pspObj.pubkey && pspObj.paymail) {
        const paymailPublicKeyVerified = await (0, $c449dd2c82f24e2c$export$fe8725667d42151)(pspObj.paymail, pspObj.pubkey);
        pspObj.verified = pspObj.verified && paymailPublicKeyVerified;
    }
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, protocol, pspObj);
};
const $04d70d7a9e677064$export$bd49ff9d0c7fbe97 = {
    name: "PSP",
    address: $04d70d7a9e677064$var$address,
    opReturnSchema: $04d70d7a9e677064$var$opReturnSchema,
    handler: $04d70d7a9e677064$var$handler
};


const $dc81d937d32ef633$var$address = "15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA";
// should be very similar to PSP
// see https://bsvalias.org/05-verify-public-key-owner.html
// TODO: Really need some documentation ro to verify what these fields are
const $dc81d937d32ef633$var$opReturnSchema = [
    {
        hash: "string"
    },
    {
        signature: "string"
    },
    {
        pubkey: "binary"
    },
    {
        paymail: "string"
    }
];
const $dc81d937d32ef633$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape  })=>{
    if (!tape) throw new Error(`Invalid BITCOM_HASHED tx. Bad tape`);
    return await (0, $04d70d7a9e677064$export$c3c3eee1546d651a)($dc81d937d32ef633$var$opReturnSchema, (0, $61ba31d33606de34$export$6c117c038f18b127).BITCOM_HASHED, dataObj, cell, tape);
};
const $dc81d937d32ef633$export$f069e857381ef4b9 = {
    name: "BITCOM_HASHED",
    address: $dc81d937d32ef633$var$address,
    opReturnSchema: $dc81d937d32ef633$var$opReturnSchema,
    handler: $dc81d937d32ef633$var$handler
};





const $31a8acfac275cb7c$var$address = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC";
const $31a8acfac275cb7c$var$opReturnSchema = [
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
// const handler = function (dataObj, cell, tape, tx) {
// https://bitkey.network/how
const $31a8acfac275cb7c$var$handler = async ({ dataObj: dataObj , cell: cell  })=>{
    if (!cell.length) throw new Error("Invalid Bitkey tx");
    const bitkeyObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($31a8acfac275cb7c$var$opReturnSchema)){
        const x = parseInt(idx, 10);
        const bitkeyField = Object.keys(schemaField)[0];
        const schemaEncoding = Object.values(schemaField)[0];
        bitkeyObj[bitkeyField] = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding);
    }
    const userAddress = (0, $jv79A$Address).fromPubKey((0, $jv79A$PubKey).fromString(bitkeyObj.pubkey)).toString();
    // sha256( hex(paymail(USER)) | hex(pubkey(USER)) )
    const paymailHex = (0, $jv79A$Buffer).from(bitkeyObj.paymail).toString("hex");
    const pubkeyHex = (0, $jv79A$Buffer).from(bitkeyObj.pubkey).toString("hex");
    const concatenated = paymailHex + pubkeyHex;
    const bitkeySignatureBuffer = await (0, $77262b005a06c166$export$bced8d2aada2d1c9)((0, $jv79A$Buffer).from(concatenated, "hex"));
    const bitkeySignatureVerified = (0, $jv79A$Bsm).verify(bitkeySignatureBuffer, bitkeyObj.bitkey_signature, (0, $jv79A$Address).fromString("13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC"));
    const userSignatureVerified = (0, $jv79A$Bsm).verify((0, $jv79A$Buffer).from(bitkeyObj.pubkey), bitkeyObj.user_signature, (0, $jv79A$Address).fromString(userAddress));
    bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified;
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "BITKEY", bitkeyObj);
};
const $31a8acfac275cb7c$export$6a60f6b74bbaccb8 = {
    name: "BITKEY",
    address: $31a8acfac275cb7c$var$address,
    opReturnSchema: $31a8acfac275cb7c$var$opReturnSchema,
    handler: $31a8acfac275cb7c$var$handler
};





const $a8a0c70a37a60034$var$protocolAddress = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p";
const $a8a0c70a37a60034$var$opReturnSchema = [
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
const $a8a0c70a37a60034$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    // Validation
    if (cell[0].s !== $a8a0c70a37a60034$var$protocolAddress || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].b || !cell[3].s || !tape) throw new Error(`Invalid BITPIC record: ${tx}`);
    const bitpicObj = {
        paymail: cell[1].s,
        pubkey: (0, $jv79A$Buffer).from(cell[2].b, "base64").toString("hex"),
        signature: cell[3].s || "",
        verified: false
    };
    const b = tape[1].cell;
    if (b[0].s === "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut") // verify bitpic signature
    // TODO: Verification
    // const pubkey = Buffer.from(cell[2].b, 'base64').toString('hex')
    // const address = Address.fromPubKey(PubKey.fromString(pubkey)).toString()
    // const hex = Buffer.from(hash, 'hex')
    // const verified = Message.verify(hex, address, expected)
    // return verified
    // const expected = res.cell[3].s
    // const paymail = res.cell[1].s
    // const pubkey = Buffer.from(res.cell[2].b, "base64").toString("hex")
    // const address = new bsv.PublicKey(pubkey).toAddress().toString()
    // const hex = Buffer.from(res.hash, "hex")
    // const verified = Message.verify(hex, address, expected)
    // return verified
    try {
        // TODO: bob transactions are missing this binary part, cannot verify signature
        const bin = cell[1].lb || cell[1].b;
        const buf = (0, $jv79A$Buffer).from(bin, "base64");
        const hashBuff = await (0, $77262b005a06c166$export$bced8d2aada2d1c9)(buf);
        const address = (0, $jv79A$Address).fromPubKey((0, $jv79A$PubKey).fromString(bitpicObj.pubkey));
        bitpicObj.verified = (0, $jv79A$Bsm).verify(hashBuff, bitpicObj.signature, address);
    } catch (e) {
        // failed verification
        bitpicObj.verified = false;
    }
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "BITPIC", bitpicObj);
};
const $a8a0c70a37a60034$export$bbef9cc099c72f9d = {
    name: "BITPIC",
    address: $a8a0c70a37a60034$var$protocolAddress,
    opReturnSchema: $a8a0c70a37a60034$var$opReturnSchema,
    handler: $a8a0c70a37a60034$var$handler
};




const $0b0f3c626f422955$var$protocolIdentifier = "boostpow";
/*
{
    hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
    content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
    bits: 486604799,
    difficulty: 1,
    metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
    time: 1305200806,
    nonce: 3698479534,
    category: 1,
}
*/ const $0b0f3c626f422955$var$scriptChecker = (cell)=>{
    // protocol identifier always in first pushdata
    return cell[0].s === $0b0f3c626f422955$var$protocolIdentifier;
};
const $0b0f3c626f422955$var$handler = ({ dataObj: dataObj , cell: cell , out: out , tx: tx  })=>{
    if (!tx || !cell[0] || !out) throw new Error(`Invalid BOOST tx. dataObj, cell, out and tx are required.`);
    // build ASM from either op codes and script chunks
    const asm = cell.map((c)=>c.ops ? c.ops : (0, $77262b005a06c166$export$b691916706e0e9cc)(c, "hex") || "").join(" ");
    if (asm) {
        const boostJob = (0, $jv79A$BoostPowJob).fromASM(asm, tx.tx.h, out.i, out.e.v).toObject();
        (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "BOOST", boostJob);
    }
};
const $0b0f3c626f422955$export$13c3c8ee12090ebc = {
    name: "BOOST",
    handler: $0b0f3c626f422955$var$handler,
    address: $0b0f3c626f422955$var$protocolIdentifier,
    scriptChecker: $0b0f3c626f422955$var$scriptChecker
};



const $dce0a6fd98da3462$var$address = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3";
const $dce0a6fd98da3462$var$opReturnSchema = [
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
const $dce0a6fd98da3462$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    if (!tape) throw new Error(`Invalid HAIP tx. Bad tape`);
    if (!tx) throw new Error(`Invalid HAIP tx.`);
    return await (0, $61ba31d33606de34$export$f0079d0908cdbf96)($dce0a6fd98da3462$var$opReturnSchema, (0, $61ba31d33606de34$export$6c117c038f18b127).HAIP, dataObj, cell, tape, tx);
};
const $dce0a6fd98da3462$export$12815d889fe90b8 = {
    name: "HAIP",
    address: $dce0a6fd98da3462$var$address,
    opReturnSchema: $dce0a6fd98da3462$var$opReturnSchema,
    handler: $dce0a6fd98da3462$var$handler
};





const $8a20cae9265ae409$var$address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const $8a20cae9265ae409$var$opReturnSchema = [
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
const $8a20cae9265ae409$var$processADD = function(cell, mapObj) {
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
const $8a20cae9265ae409$var$proccessDELETE = function(cell, mapObj) {
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
const $8a20cae9265ae409$var$processSELECT = function(cell, mapObj) {
    // TODO
    // console.log('MAP SELECT');
    for (const pushdataContainer of cell)// ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
        mapObj.SELECT = "TODO";
        continue;
    }
};
const $8a20cae9265ae409$var$processMSGPACK = function(cell, mapObj) {
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            if (!(0, $jv79A$decode)) throw new Error("Msgpack is required but not loaded");
            const buff = (0, $jv79A$Buffer).from(pushdataContainer.b, "base64");
            mapObj = (0, $jv79A$decode)(buff);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
const $8a20cae9265ae409$var$processJSON = function(cell, mapObj) {
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
const $8a20cae9265ae409$var$processSET = function(cell, mapObj) {
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
const $8a20cae9265ae409$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    // Validate
    if (cell[0].s !== $8a20cae9265ae409$var$address || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) throw new Error(`Invalid MAP record: ${tx}`);
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
    const mapCmdKey = Object.keys($8a20cae9265ae409$var$opReturnSchema[0])[0];
    // Add the firt MAP command in the response object
    mapObj[mapCmdKey] = commands[0][0].s;
    commands.forEach((cc)=>{
        // re-add the MAP address
        cc.unshift({
            s: $8a20cae9265ae409$var$address,
            i: 0
        });
        const command = cc[1].s;
        // Individual parsing rules for each MAP command
        switch(command){
            // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
            case "ADD":
                $8a20cae9265ae409$var$processADD(cc, mapObj);
                break;
            case "REMOVE":
                mapObj.key = cc[2].s;
                break;
            case "DELETE":
                $8a20cae9265ae409$var$proccessDELETE(cc, mapObj);
                break;
            case "CLEAR":
                break;
            case "SELECT":
                $8a20cae9265ae409$var$processSELECT(cc, mapObj);
                break;
            case "MSGPACK":
                mapObj = $8a20cae9265ae409$var$processMSGPACK(cc, mapObj);
                break;
            case "JSON":
                mapObj = $8a20cae9265ae409$var$processJSON(cc, mapObj);
                break;
            case "SET":
                $8a20cae9265ae409$var$processSET(cc, mapObj);
                break;
            default:
        }
    });
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "MAP", mapObj);
};
const $8a20cae9265ae409$export$ce970371e0e850bc = {
    name: "MAP",
    address: $8a20cae9265ae409$var$address,
    opReturnSchema: $8a20cae9265ae409$var$opReturnSchema,
    handler: $8a20cae9265ae409$var$handler
};




const $7eb85189d07ccd6d$var$address = "meta";
const $7eb85189d07ccd6d$var$opReturnSchema = [
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
const $7eb85189d07ccd6d$export$3eb18141230d6532 = async function(a, tx) {
    // Calculate the node ID
    const buf = (0, $jv79A$Buffer).from(a + tx);
    const hashBuf = await (0, $77262b005a06c166$export$bced8d2aada2d1c9)(buf);
    return hashBuf.toString("hex");
};
const $7eb85189d07ccd6d$var$handler = async ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!cell.length || cell[0].s !== "meta" || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s || !tx) throw new Error("Invalid Metanet tx " + tx);
    // For now, we just copy from MOM keys later if available, or keep BOB format
    const nodeId = await $7eb85189d07ccd6d$export$3eb18141230d6532(cell[1].s, tx.tx.h);
    // Described this node
    const node = {
        a: cell[1].s,
        tx: tx.tx.h,
        id: nodeId
    };
    let parent = {};
    if (tx.in) {
        const parentId = await $7eb85189d07ccd6d$export$3eb18141230d6532(tx.in[0].e.a, cell[2].s);
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
const $7eb85189d07ccd6d$export$7830a85a59ca4593 = {
    name: "METANET",
    address: $7eb85189d07ccd6d$var$address,
    opReturnSchema: $7eb85189d07ccd6d$var$opReturnSchema,
    handler: $7eb85189d07ccd6d$var$handler
};




// const OrdScript =
//     'OP_FALSE OP_IF 6F7264 OP_1 <CONTENT_TYPE_PLACEHOLDER> OP_0 <DATA_PLACEHOLDER> OP_ENDIF'.split(
//         ' '
//     )
const $f38986b3415560cd$var$scriptChecker = (cell)=>{
    // TODO: What is the actual minimum length?
    if (cell.length < 11) // wrong length
    return false;
    // Find OP_IF wrapper
    const startIdx = (0, $jv79A$findIndex)(cell, (c)=>c.ops === "OP_IF");
    const endIdx = (0, $jv79A$findIndex)(cell, (c, i)=>i > startIdx && c.ops === "OP_ENDIF");
    const ordScript = cell.slice(startIdx, endIdx);
    const prevCell = cell[startIdx - 1];
    return prevCell?.ops === "OP_FALSE" && !!ordScript[0] && !!ordScript[1] && ordScript[1].s == "ord";
};
const $f38986b3415560cd$var$handler = ({ dataObj: dataObj , cell: cell , out: out  })=>{
    if (!cell[0] || !out) throw new Error(`Invalid Ord tx. dataObj, cell, out and tx are required.`);
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    // Find OP_IF wrapper
    const startIdx = (0, $jv79A$findIndex)(cell, (c)=>c.ops === "OP_IF");
    const endIdx = (0, $jv79A$findIndex)(cell, (c, i)=>i > startIdx && c.ops === "OP_ENDIF");
    const ordScript = cell.slice(startIdx, endIdx);
    if (!ordScript[0] || !ordScript[1] || ordScript[1].s != "ord") throw new Error(`Invalid Ord tx. Prefix not found.`);
    console.log({
        ordScript: ordScript
    });
    let data;
    let contentType;
    ordScript.forEach((push, idx, all)=>{
        // content-type
        if (push.ops === "OP_1") contentType = (0, $77262b005a06c166$export$b691916706e0e9cc)(all[idx + 1], "string");
        // data
        if (push.ops === "OP_0") data = (0, $77262b005a06c166$export$b691916706e0e9cc)(all[idx + 1]);
    });
    if (!data) throw new Error(`Invalid Ord data.`);
    if (!contentType) throw new Error(`Invalid Ord content type.`);
    const OrdObj = {
        data: data,
        contentType: contentType
    };
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "Ord", OrdObj);
};
const $f38986b3415560cd$export$ee8aa95bfab51c5 = {
    name: "Ord",
    handler: $f38986b3415560cd$var$handler,
    scriptChecker: $f38986b3415560cd$var$scriptChecker
};




const $4aa1b4adda120025$var$address = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1";
const $4aa1b4adda120025$var$opReturnSchema = [
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
const $4aa1b4adda120025$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    if (cell[0].s !== $4aa1b4adda120025$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].s || !cell[3].s) throw new Error(`Invalid RON record ${tx?.tx.h}`);
    const pair = JSON.parse(cell[1].s);
    const timestamp = Number(cell[3].s);
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "RON", {
        pair: pair,
        address: cell[2].s,
        timestamp: timestamp
    });
};
const $4aa1b4adda120025$export$2839d627b6f3bcfe = {
    name: "RON",
    address: $4aa1b4adda120025$var$address,
    opReturnSchema: $4aa1b4adda120025$var$opReturnSchema,
    handler: $4aa1b4adda120025$var$handler
};



const $1a7c59a3fed0ea3a$var$address = "1SymRe7erxM46GByucUWnB9fEEMgo7spd";
const $1a7c59a3fed0ea3a$var$opReturnSchema = [
    {
        url: "string"
    }
];
const $1a7c59a3fed0ea3a$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    if (cell[0].s !== $1a7c59a3fed0ea3a$var$address || !cell[1] || !cell[1].s) throw new Error(`Invalid SymRe tx: ${tx}`);
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "SYMRE", {
        url: cell[1].s
    });
};
const $1a7c59a3fed0ea3a$export$33455cbcda538c68 = {
    name: "SYMRE",
    address: $1a7c59a3fed0ea3a$var$address,
    opReturnSchema: $1a7c59a3fed0ea3a$var$opReturnSchema,
    handler: $1a7c59a3fed0ea3a$var$handler
};



// 21e8 does not use the first pushdata for id
// in fact there is no id since the 21e8 is designed for difficulty and can be changed
// instead we use the static part of the script to indentfy the transaction
// TODO - the OP_X_PLACEHOLDER is the number of bytes to push onto the stack and must match difficulty size
const $332ed5fa361e0a5d$var$_21e8Script = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" ");
const $332ed5fa361e0a5d$var$scriptChecker = (cell)=>{
    if (cell.length !== 12) // wrong length
    return false;
    // match exact script
    const ops = [
        ...cell
    ].map((c)=>c.ops).splice(2, cell.length);
    // calculate target byte length
    const target = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[1], "hex");
    const targetOpSize = Buffer.from(target).byteLength;
    // replace the placeholder opcode with actual
    ops[1] = `OP_${targetOpSize}`;
    $332ed5fa361e0a5d$var$_21e8Script[1] = `OP_${targetOpSize}`;
    // protocol identifier always in first pushdata
    return ops.join() === $332ed5fa361e0a5d$var$_21e8Script.join();
};
const $332ed5fa361e0a5d$var$handler = ({ dataObj: dataObj , cell: cell , out: out  })=>{
    if (!cell[0] || !out) throw new Error(`Invalid 21e8 tx. dataObj, cell, out and tx are required.`);
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    const txid = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[0], "hex");
    const target = (0, $77262b005a06c166$export$b691916706e0e9cc)(cell[1], "hex");
    if (!target) throw new Error(`Invalid 21e8 target.` + JSON.stringify(cell[0], null, 2));
    const difficulty = Buffer.from(target, "hex").byteLength;
    const _21e8Obj = {
        target: target,
        difficulty: difficulty,
        value: out.e.v,
        txid: txid
    };
    (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, "21E8", _21e8Obj);
};
const $332ed5fa361e0a5d$export$85479a00ad164ad6 = {
    name: "21E8",
    handler: $332ed5fa361e0a5d$var$handler,
    scriptChecker: $332ed5fa361e0a5d$var$scriptChecker
};



// Names of enabled protocols
const $1f08ee9f2ca932eb$var$enabledProtocols = new Map([]);
// Protocol Handlers
const $1f08ee9f2ca932eb$var$protocolHandlers = new Map([]);
// Script checkers are intentionally minimalistic detection functions for identifying matching scripts for a given protocol. Only if a checker returns true is a handler called for processing.
const $1f08ee9f2ca932eb$var$protocolScriptCheckers = new Map([]);
const $1f08ee9f2ca932eb$var$protocolOpReturnSchemas = new Map();
const $1f08ee9f2ca932eb$export$6b22fa9a84a4797f = [
    (0, $61ba31d33606de34$export$474d593e43f12abd),
    (0, $b60c7490dd9e63ed$export$ef35774e6d314e91),
    (0, $e42beb934f07c56b$export$5935ea4bf04c4453),
    (0, $8a20cae9265ae409$export$ce970371e0e850bc),
    (0, $7eb85189d07ccd6d$export$7830a85a59ca4593),
    (0, $0b0f3c626f422955$export$13c3c8ee12090ebc),
    (0, $332ed5fa361e0a5d$export$85479a00ad164ad6),
    (0, $a829b28489202b4c$export$c19e3a57d69468ea),
    (0, $31a8acfac275cb7c$export$6a60f6b74bbaccb8),
    (0, $a8a0c70a37a60034$export$bbef9cc099c72f9d),
    (0, $dce0a6fd98da3462$export$12815d889fe90b8),
    (0, $dc81d937d32ef633$export$f069e857381ef4b9),
    (0, $04d70d7a9e677064$export$bd49ff9d0c7fbe97),
    (0, $4aa1b4adda120025$export$2839d627b6f3bcfe),
    (0, $1a7c59a3fed0ea3a$export$33455cbcda538c68),
    (0, $f38986b3415560cd$export$ee8aa95bfab51c5)
];
const $1f08ee9f2ca932eb$export$63e9417ed8d8533a = $1f08ee9f2ca932eb$export$6b22fa9a84a4797f.map((p)=>p.name);
const $1f08ee9f2ca932eb$export$4f34a1c822988d11 = [
    (0, $61ba31d33606de34$export$474d593e43f12abd),
    (0, $b60c7490dd9e63ed$export$ef35774e6d314e91),
    (0, $e42beb934f07c56b$export$5935ea4bf04c4453),
    (0, $8a20cae9265ae409$export$ce970371e0e850bc),
    (0, $7eb85189d07ccd6d$export$7830a85a59ca4593),
    (0, $f38986b3415560cd$export$ee8aa95bfab51c5)
];
// prepare protocol map, handlers and schemas
$1f08ee9f2ca932eb$export$4f34a1c822988d11.forEach((protocol)=>{
    if (protocol.address) $1f08ee9f2ca932eb$var$enabledProtocols.set(protocol.address, protocol.name);
    $1f08ee9f2ca932eb$var$protocolHandlers.set(protocol.name, protocol.handler);
    if (protocol.opReturnSchema) $1f08ee9f2ca932eb$var$protocolOpReturnSchemas.set(protocol.name, protocol.opReturnSchema);
    if (protocol.scriptChecker) $1f08ee9f2ca932eb$var$protocolScriptCheckers.set(protocol.name, protocol.scriptChecker);
});
class $1f08ee9f2ca932eb$export$894a720e71f90b3c {
    constructor(){
        // initial default protocol handlers in this instantiation
        this.enabledProtocols = $1f08ee9f2ca932eb$var$enabledProtocols;
        this.protocolHandlers = $1f08ee9f2ca932eb$var$protocolHandlers;
        this.protocolScriptCheckers = $1f08ee9f2ca932eb$var$protocolScriptCheckers;
        this.protocolOpReturnSchemas = $1f08ee9f2ca932eb$var$protocolOpReturnSchemas;
    }
    addProtocolHandler({ name: name , address: address , opReturnSchema: opReturnSchema , handler: handler , scriptChecker: scriptChecker  }) {
        if (address) this.enabledProtocols.set(address, name);
        this.protocolHandlers.set(name, handler);
        if (opReturnSchema) this.protocolOpReturnSchemas.set(name, opReturnSchema);
        if (scriptChecker) this.protocolScriptCheckers.set(name, scriptChecker);
    }
    transformTx = async (tx)=>{
        if (!tx || !tx["in"] || !tx["out"]) throw new Error("Cannot process tx");
        // This will become our nicely formatted response object
        const dataObj = {};
        for (const [key, val] of Object.entries(tx)){
            if (key === "out") // loop over the outputs
            for (const out of tx.out){
                const { tape: tape  } = out;
                if (tape?.some((cc)=>(0, $77262b005a06c166$export$238b4e54af8fe886)(cc))) // loop over tape
                for (const cellContainer of tape){
                    // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                    if ((0, $77262b005a06c166$export$238b4e54af8fe886)(cellContainer)) continue;
                    const { cell: cell  } = cellContainer;
                    if (!cell) throw new Error("empty cell while parsing");
                    const prefix = cell[0].s;
                    await this.process(this.enabledProtocols.get(prefix || "") || prefix || "", {
                        cell: cell,
                        dataObj: dataObj,
                        tape: tape,
                        out: out,
                        tx: tx
                    });
                }
                else {
                    // No OP_FALSE OP_RETURN in this tape
                    const boostChecker = this.protocolScriptCheckers.get((0, $0b0f3c626f422955$export$13c3c8ee12090ebc).name);
                    const _21e8Checker = this.protocolScriptCheckers.get((0, $332ed5fa361e0a5d$export$85479a00ad164ad6).name);
                    const ordChecker = this.protocolScriptCheckers.get((0, $f38986b3415560cd$export$ee8aa95bfab51c5).name);
                    // Check for boostpow and 21e8
                    if (tape?.some((cc)=>{
                        const { cell: cell  } = cc;
                        if (boostChecker && boostChecker(cell)) // 'found boost'
                        return true;
                        if (_21e8Checker && _21e8Checker(cell)) // 'found 21e8'
                        return true;
                        if (ordChecker && ordChecker(cell)) // 'found 1sat ordinal'
                        return true;
                    })) // find the cell array
                    // loop over tape
                    for (const cellContainer of tape){
                        const { cell: cell  } = cellContainer;
                        // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                        if (!cell) throw new Error("empty cell while parsing");
                        let protocolName = "";
                        if (boostChecker && boostChecker(cell)) protocolName = (0, $0b0f3c626f422955$export$13c3c8ee12090ebc).name;
                        else if (_21e8Checker && _21e8Checker(cell)) protocolName = (0, $332ed5fa361e0a5d$export$85479a00ad164ad6).name;
                        else if (ordChecker && ordChecker(cell)) protocolName = (0, $f38986b3415560cd$export$ee8aa95bfab51c5).name;
                        else continue;
                        this.process(protocolName, {
                            tx: tx,
                            cell: cell,
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
            e: out.e,
            tape: []
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
        } else (0, $77262b005a06c166$export$23dbc584560299c3)(dataObj, protocolName, cell);
    };
}
const $1f08ee9f2ca932eb$export$54850c299f4a06d8 = async (txid)=>{
    const url = "https://api.whatsonchain.com/v1/bsv/main/tx/" + txid + "/hex";
    console.log("hitting", url);
    const res = await fetch(url);
    return await res.text();
};
const $1f08ee9f2ca932eb$export$2905b0423a229d9 = async (rawTx)=>{
    const bpuTx = await (0, $jv79A$parse)({
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
                    op: 0
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
const $1f08ee9f2ca932eb$export$b2a90e318402f6bc = async (tx, protocols)=>{
    if (typeof tx === "string") {
        let rawTx;
        // if it a txid or  complete transaction hex?
        if (tx.length === 64) // txid - fetch raw tx
        rawTx = await $1f08ee9f2ca932eb$export$54850c299f4a06d8(tx);
        if (Buffer.from(tx).byteLength <= 146) throw new Error("Invalid rawTx");
        if (!rawTx) rawTx = tx;
        // TODO: Double check 146 is intended to be minimum possible byte length for a tx
        const bobTx = await $1f08ee9f2ca932eb$export$2905b0423a229d9(rawTx);
        if (bobTx) tx = bobTx;
        else throw new Error(`Invalid txid`);
    }
    const b = new $1f08ee9f2ca932eb$export$894a720e71f90b3c();
    // if protocols are specified
    if (protocols) {
        // wipe out defaults
        b.enabledProtocols.clear();
        if ((0, $77262b005a06c166$export$f6e922e536d8305c)(protocols)) {
            // set enabled protocols
            for (const protocol of $1f08ee9f2ca932eb$export$6b22fa9a84a4797f)if (protocols?.includes(protocol.name)) b.addProtocolHandler(protocol);
        } else if ((0, $77262b005a06c166$export$37b8d83213de0f5f)(protocols)) for (const p of protocols){
            const protocol = p;
            if (protocol) b.addProtocolHandler(protocol);
        }
        else throw new Error(`Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).`);
    }
    return b.transformTx(tx);
};


export {$1f08ee9f2ca932eb$export$6b22fa9a84a4797f as allProtocols, $1f08ee9f2ca932eb$export$63e9417ed8d8533a as supportedProtocols, $1f08ee9f2ca932eb$export$4f34a1c822988d11 as defaultProtocols, $1f08ee9f2ca932eb$export$894a720e71f90b3c as BMAP, $1f08ee9f2ca932eb$export$54850c299f4a06d8 as fetchRawTx, $1f08ee9f2ca932eb$export$2905b0423a229d9 as bobFromRawTx, $1f08ee9f2ca932eb$export$b2a90e318402f6bc as TransformTx};
//# sourceMappingURL=bmap.module.js.map
