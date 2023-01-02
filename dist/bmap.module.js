import {Script as $lNmOP$Script, Bsm as $lNmOP$Bsm, Address as $lNmOP$Address, PubKey as $lNmOP$PubKey} from "@ts-bitcoin/core";
import {Buffer as $lNmOP$Buffer} from "buffer";
import $lNmOP$nodefetch from "node-fetch";
import $lNmOP$crypto from "crypto";
import {PaymailClient as $lNmOP$PaymailClient} from "@moneybutton/paymail-client";
import $lNmOP$dns from "dns";
import {BoostPowJob as $lNmOP$BoostPowJob} from "boostpow";
import {decode as $lNmOP$decode} from "@msgpack/msgpack";

// import default protocols





const $69f57829bdd71afa$export$f6e922e536d8305c = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return typeof value === "string";
    });
};
const $69f57829bdd71afa$export$37b8d83213de0f5f = (arr)=>{
    return arr.length > 0 && arr.every((value)=>{
        return value === "object";
    });
};
const $69f57829bdd71afa$export$b691916706e0e9cc = (pushData, schemaEncoding)=>{
    if (!pushData) throw new Error(`cannot get cell value of: ${pushData}`);
    else if (schemaEncoding === "string") return pushData["s"] ? pushData.s : pushData.ls || "";
    else if (schemaEncoding === "hex") return pushData["h"] ? pushData.h : pushData.lh || (pushData["b"] ? (0, $lNmOP$Buffer).from(pushData.b, "base64").toString("hex") : pushData.lb && (0, $lNmOP$Buffer).from(pushData.lb, "base64").toString("hex")) || "";
    else if (schemaEncoding === "number") return parseInt(pushData["h"] ? pushData.h : pushData.lh || "0", 16);
    else if (schemaEncoding === "file") return `bitfs://${pushData["f"] ? pushData.f : pushData.lf}`;
    return (pushData["b"] ? pushData.b : pushData.lb) || "";
};
const $69f57829bdd71afa$export$238b4e54af8fe886 = function(cc) {
    return cc.cell[0] && cc.cell[1] && cc.cell[0].op === 0 && cc.cell[1].op && cc.cell[1].op === 106 || cc.cell[0].op === 106;
};
const $69f57829bdd71afa$export$23dbc584560299c3 = (dataObj, protocolName, data)=>{
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
const $69f57829bdd71afa$export$ee2a8bbe689a8ef5 = function(protocolName, opReturnSchema, dataObj, cell, tx) {
    // loop over the schema
    const obj = {};
    // Does not have the required number of fields
    const length = opReturnSchema.length + 1;
    if (cell.length < length) throw new Error(`${protocolName} requires at least ${length} fields including the prefix: ${tx.tx.h}`);
    for (const [idx, schemaField] of Object.entries(opReturnSchema)){
        const x = parseInt(idx, 10);
        const [field] = Object.keys(schemaField);
        const [schemaEncoding] = Object.values(schemaField);
        obj[field] = $69f57829bdd71afa$export$b691916706e0e9cc(cell[x + 1], schemaEncoding);
    }
    $69f57829bdd71afa$export$23dbc584560299c3(dataObj, protocolName, obj);
};
const $69f57829bdd71afa$export$ca4d6504ca148ae4 = function(data) {
    const regex = "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
    return new RegExp(`^${regex}$`, "gi").test(data);
};
const $69f57829bdd71afa$export$bced8d2aada2d1c9 = async (msgBuffer)=>{
    let hash;
    if ((0, $lNmOP$crypto).subtle) {
        hash = await (0, $lNmOP$crypto).subtle.digest("SHA-256", msgBuffer);
        return (0, $lNmOP$Buffer).from(hash);
    }
    // }
    return (0, $lNmOP$Buffer).from(new ArrayBuffer(0));
};


const $2bd9d69ae9f49db2$var$address = "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva";
const $2bd9d69ae9f49db2$var$opReturnSchema = [
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
const $2bd9d69ae9f49db2$var$getFileBuffer = async function(bitfsRef) {
    let fileBuffer = (0, $lNmOP$Buffer).from("");
    try {
        const result = await (0, $lNmOP$nodefetch)(`https://x.bitfs.network/${bitfsRef}`, {});
        fileBuffer = await result.buffer();
    } catch (e) {
        console.error(e);
    }
    return fileBuffer;
};
const $2bd9d69ae9f49db2$var$validateSignature = async function(aipObj, cell, tape) {
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
        if (!(0, $69f57829bdd71afa$export$238b4e54af8fe886)(cellContainer)) {
            for(let nc = 0; nc < cellContainer.cell.length; nc++){
                const statement = cellContainer.cell[nc];
                // add the value as hex
                if (statement.h) signatureValues.push(statement.h);
                else if (statement.f) {
                    // file reference - we need to get the file from bitfs
                    const fileBuffer = await $2bd9d69ae9f49db2$var$getFileBuffer(statement.f);
                    signatureValues.push(fileBuffer.toString("hex"));
                } else if (statement.b) // no hex? try base64
                signatureValues.push((0, $lNmOP$Buffer).from(statement.b, "base64").toString("hex"));
                else if (statement.s) signatureValues.push((0, $lNmOP$Buffer).from(statement.s).toString("hex"));
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
        signatureBufferStatements.push((0, $lNmOP$Buffer).from(signatureValues[index], "hex"));
    });
    else // add all the values to the signature buffer
    signatureValues.forEach((statement)=>{
        signatureBufferStatements.push((0, $lNmOP$Buffer).from(statement, "hex"));
    });
    let messageBuffer;
    if (aipObj.hashing_algorithm) {
        // this is actually Hashed-AIP (HAIP) and works a bit differently
        if (!aipObj.index_unit_size) // remove OP_RETURN - will be added by Script.buildDataOut
        signatureBufferStatements.shift();
        const dataScript = (0, $lNmOP$Script).fromSafeDataArray(signatureBufferStatements);
        let dataBuffer = (0, $lNmOP$Buffer).from(dataScript.toHex(), "hex");
        if (aipObj.index_unit_size) // the indexed buffer should not contain the OP_RETURN opcode, but this
        // is added by the buildDataOut function automatically. Remove it.
        dataBuffer = dataBuffer.slice(1);
        messageBuffer = await (0, $69f57829bdd71afa$export$bced8d2aada2d1c9)((0, $lNmOP$Buffer).from(dataBuffer.toString("hex")));
    } else // regular AIP
    messageBuffer = (0, $lNmOP$Buffer).concat([
        ...signatureBufferStatements
    ]);
    // AIOP uses address, HAIP uses signing_address field names
    const adressString = aipObj.address || aipObj.signing_address;
    // verify aip signature
    try {
        aipObj.verified = (0, $lNmOP$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $lNmOP$Address).fromString(adressString));
    } catch (e) {
        aipObj.verified = false;
    }
    // Try if this is a Twetch compatible AIP signature
    if (!aipObj.verified) {
        // Twetch signs a UTF-8 buffer of the hex string of a sha256 hash of the message
        // Without 0x06 (OP_RETURN) and without 0x7c at the end, the trailing pipe ("|")
        messageBuffer = (0, $lNmOP$Buffer).concat([
            ...signatureBufferStatements.slice(1, signatureBufferStatements.length - 1)
        ]);
        const buff = await (0, $69f57829bdd71afa$export$bced8d2aada2d1c9)(messageBuffer);
        messageBuffer = (0, $lNmOP$Buffer).from(buff.toString("hex"));
        try {
            aipObj.verified = (0, $lNmOP$Bsm).verify(messageBuffer, aipObj.signature || "", (0, $lNmOP$Address).fromString(adressString));
        } catch (e1) {
            aipObj.verified = false;
        }
    }
    return aipObj.verified || false;
};
let $2bd9d69ae9f49db2$export$6c117c038f18b127;
(function(SIGPROTO) {
    SIGPROTO["HAIP"] = "HAIP";
    SIGPROTO["AIP"] = "AIP";
    SIGPROTO["BITCOM_HASHED"] = "BITCOM_HASHED";
    SIGPROTO["PSP"] = "PSP";
})($2bd9d69ae9f49db2$export$6c117c038f18b127 || ($2bd9d69ae9f49db2$export$6c117c038f18b127 = {}));
const $2bd9d69ae9f49db2$export$f0079d0908cdbf96 = async function(useOpReturnSchema, protocol, dataObj, cell, tape, tx) {
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
        aipObj[aipField] = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding) || "";
    }
    // There is an issue where some services add the signature as binary to the transaction
    // whereas others add the signature as base64. This will confuse bob and the parser and
    // the signature will not be verified. When the signature is added in binary cell[3].s is
    // binary, otherwise cell[3].s contains the base64 signature and should be used.
    if (cell[0].s === $2bd9d69ae9f49db2$var$address && cell[3].s && (0, $69f57829bdd71afa$export$ca4d6504ca148ae4)(cell[3].s)) aipObj.signature = cell[3].s;
    if (!aipObj.signature) throw new Error("AIP requires a signature " + tx);
    await $2bd9d69ae9f49db2$var$validateSignature(aipObj, cell, tape);
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, protocol, aipObj);
};
const $2bd9d69ae9f49db2$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    if (!tape) throw new Error("Invalid AIP transaction. tape is required");
    if (!tx) throw new Error("Invalid AIP transaction. tx is required");
    return await $2bd9d69ae9f49db2$export$f0079d0908cdbf96($2bd9d69ae9f49db2$var$opReturnSchema, "AIP", dataObj, cell, tape, tx);
};
const $2bd9d69ae9f49db2$export$474d593e43f12abd = {
    name: "AIP",
    address: $2bd9d69ae9f49db2$var$address,
    opReturnSchema: $2bd9d69ae9f49db2$var$opReturnSchema,
    handler: $2bd9d69ae9f49db2$var$handler
};



const $0de36bedfba54f35$var$address = "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut";
const $0de36bedfba54f35$var$opReturnSchema = [
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
const $0de36bedfba54f35$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
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
    if (cell.length > $0de36bedfba54f35$var$opReturnSchema.length + 1) throw new Error("Invalid B tx. Too many fields.");
    // Make sure there are not more fields than possible
    const bObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($0de36bedfba54f35$var$opReturnSchema)){
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
        bObj[bField] = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(data, schemaEncoding);
    }
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "B", bObj);
};
const $0de36bedfba54f35$export$ef35774e6d314e91 = {
    name: "B",
    address: $0de36bedfba54f35$var$address,
    opReturnSchema: $0de36bedfba54f35$var$opReturnSchema,
    handler: $0de36bedfba54f35$var$handler
};



const $e6b302b820f24efd$var$address = "1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT";
const $e6b302b820f24efd$var$opReturnSchema = [
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
const $e6b302b820f24efd$export$c3c52e219617878 = ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!tx) throw new Error(`Invalid BAP tx, tx required`);
    (0, $69f57829bdd71afa$export$ee2a8bbe689a8ef5)("BAP", $e6b302b820f24efd$var$opReturnSchema, dataObj, cell, tx);
};
const $e6b302b820f24efd$export$5935ea4bf04c4453 = {
    name: "BAP",
    address: $e6b302b820f24efd$var$address,
    opReturnSchema: $e6b302b820f24efd$var$opReturnSchema,
    handler: $e6b302b820f24efd$export$c3c52e219617878
};



const $16330e01fa0b0248$var$protocolAddress = "$";
const $16330e01fa0b0248$var$opReturnSchema = [
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
const $16330e01fa0b0248$var$handler = ({ dataObj: dataObj , cell: cell  })=>{
    if (!cell.length || !cell.every((c)=>c.s)) throw new Error("Invalid Bitcom tx");
    // gather up the string values
    const bitcomObj = cell.map((c)=>c && c.s ? c.s : "");
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "BITCOM", bitcomObj);
};
const $16330e01fa0b0248$export$c19e3a57d69468ea = {
    name: "BITCOM",
    address: $16330e01fa0b0248$var$protocolAddress,
    opReturnSchema: $16330e01fa0b0248$var$opReturnSchema,
    handler: $16330e01fa0b0248$var$handler
};








const $b7e65d97cc04cb07$export$fe8725667d42151 = async function(paymail, publicKey) {
    if (typeof window !== "undefined") {
        // Paymail client will use BrowserDns if dns is null here
        // and isomorphic-fetch if fetch is null
        const client = new (0, $lNmOP$PaymailClient)();
        return client.verifyPubkeyOwner(publicKey, paymail);
    } else {
        const client1 = new (0, $lNmOP$PaymailClient)((0, $lNmOP$dns), (0, $lNmOP$nodefetch));
        return client1.verifyPubkeyOwner(publicKey, paymail);
    }
};




const $7b115585d0ffd9d8$var$address = "1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4";
const $7b115585d0ffd9d8$var$opReturnSchema = [
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
const $7b115585d0ffd9d8$var$validateSignature = (pspObj, cell, tape)=>{
    if (!Array.isArray(tape) || tape.length < 3) throw new Error("PSP requires at least 3 cells including the prefix");
    let cellIndex = -1;
    tape.forEach((cc, index)=>{
        if (cc.cell === cell) cellIndex = index;
    });
    if (cellIndex === -1) throw new Error("PSP could not find cell in tape");
    const signatureBufferStatements = [];
    for(let i = 0; i < cellIndex; i++){
        const cellContainer = tape[i];
        if (!(0, $69f57829bdd71afa$export$238b4e54af8fe886)(cellContainer)) {
            cellContainer.cell.forEach((statement)=>{
                // add the value as hex
                let value = statement.h;
                if (!value) value = (0, $lNmOP$Buffer).from(statement.b, "base64").toString("hex");
                if (!value) value = (0, $lNmOP$Buffer).from(statement.s).toString("hex");
                signatureBufferStatements.push((0, $lNmOP$Buffer).from(value, "hex"));
            });
            signatureBufferStatements.push((0, $lNmOP$Buffer).from("7c", "hex")) // | hex ????
            ;
        }
    }
    const dataScript = (0, $lNmOP$Script).fromSafeDataArray(signatureBufferStatements);
    const messageBuffer = (0, $lNmOP$Buffer).from(dataScript.toHex(), "hex");
    // verify psp signature
    const publicKey = (0, $lNmOP$PubKey).fromString(pspObj.pubkey);
    const signingAddress = (0, $lNmOP$Address).fromPubKey(publicKey);
    try {
        pspObj.verified = (0, $lNmOP$Bsm).verify(messageBuffer, pspObj.signature, signingAddress);
    } catch (e) {
        pspObj.verified = false;
    }
    return pspObj.verified;
};
const $7b115585d0ffd9d8$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape  })=>{
    // Paymail Signature Protocol
    // Validation
    if (!cell.length || cell[0].s !== $7b115585d0ffd9d8$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].b || !cell[2].s || !cell[3].s || !tape) throw new Error(`Invalid Paymail Signature Protocol record`);
    return await $7b115585d0ffd9d8$export$c3c3eee1546d651a($7b115585d0ffd9d8$var$opReturnSchema, (0, $2bd9d69ae9f49db2$export$6c117c038f18b127).PSP, dataObj, cell, tape);
};
const $7b115585d0ffd9d8$export$c3c3eee1546d651a = async (useOpReturnSchema, protocol, dataObj, cell, tape)=>{
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
        pspObj[pspField] = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding);
    }
    if (!pspObj.signature) throw new Error("PSP requires a signature " + cell);
    //  TODO: we can only check on PSP until we figure out the BITCOM_HASHED fields
    //  verify signature
    if (protocol === (0, $2bd9d69ae9f49db2$export$6c117c038f18b127).PSP && !$7b115585d0ffd9d8$var$validateSignature(pspObj, cell, tape)) throw new Error("PSP requires a valid signature " + pspObj);
    // check the paymail public key
    if (pspObj.pubkey && pspObj.paymail) {
        const paymailPublicKeyVerified = await (0, $b7e65d97cc04cb07$export$fe8725667d42151)(pspObj.paymail, pspObj.pubkey);
        pspObj.verified = pspObj.verified && paymailPublicKeyVerified;
    }
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, protocol, pspObj);
};
const $7b115585d0ffd9d8$export$bd49ff9d0c7fbe97 = {
    name: "PSP",
    address: $7b115585d0ffd9d8$var$address,
    opReturnSchema: $7b115585d0ffd9d8$var$opReturnSchema,
    handler: $7b115585d0ffd9d8$var$handler
};


const $70da3cb5ab2146a0$var$address = "15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA";
// should be very similar to PSP
// see https://bsvalias.org/05-verify-public-key-owner.html
// TODO: Really need some documentation ro to verify what these fields are
const $70da3cb5ab2146a0$var$opReturnSchema = [
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
const $70da3cb5ab2146a0$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape  })=>{
    if (!tape) throw new Error(`Invalid BITCOM_HASHED tx. Bad tape`);
    return await (0, $7b115585d0ffd9d8$export$c3c3eee1546d651a)($70da3cb5ab2146a0$var$opReturnSchema, (0, $2bd9d69ae9f49db2$export$6c117c038f18b127).BITCOM_HASHED, dataObj, cell, tape);
};
const $70da3cb5ab2146a0$export$f069e857381ef4b9 = {
    name: "BITCOM_HASHED",
    address: $70da3cb5ab2146a0$var$address,
    opReturnSchema: $70da3cb5ab2146a0$var$opReturnSchema,
    handler: $70da3cb5ab2146a0$var$handler
};





const $5bad0dce333ed95b$var$address = "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC";
const $5bad0dce333ed95b$var$opReturnSchema = [
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
const $5bad0dce333ed95b$var$handler = async ({ dataObj: dataObj , cell: cell  })=>{
    if (!cell.length) throw new Error("Invalid Bitkey tx");
    const bitkeyObj = {};
    // loop over the schema
    for (const [idx, schemaField] of Object.entries($5bad0dce333ed95b$var$opReturnSchema)){
        const x = parseInt(idx, 10);
        const bitkeyField = Object.keys(schemaField)[0];
        const schemaEncoding = Object.values(schemaField)[0];
        bitkeyObj[bitkeyField] = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[x + 1], schemaEncoding);
    }
    const userAddress = (0, $lNmOP$Address).fromPubKey((0, $lNmOP$PubKey).fromString(bitkeyObj.pubkey)).toString();
    // sha256( hex(paymail(USER)) | hex(pubkey(USER)) )
    const paymailHex = (0, $lNmOP$Buffer).from(bitkeyObj.paymail).toString("hex");
    const pubkeyHex = (0, $lNmOP$Buffer).from(bitkeyObj.pubkey).toString("hex");
    const concatenated = paymailHex + pubkeyHex;
    const bitkeySignatureBuffer = await (0, $69f57829bdd71afa$export$bced8d2aada2d1c9)((0, $lNmOP$Buffer).from(concatenated, "hex"));
    const bitkeySignatureVerified = (0, $lNmOP$Bsm).verify(bitkeySignatureBuffer, bitkeyObj.bitkey_signature, (0, $lNmOP$Address).fromString("13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC"));
    const userSignatureVerified = (0, $lNmOP$Bsm).verify((0, $lNmOP$Buffer).from(bitkeyObj.pubkey), bitkeyObj.user_signature, (0, $lNmOP$Address).fromString(userAddress));
    bitkeyObj.verified = bitkeySignatureVerified && userSignatureVerified;
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "BITKEY", bitkeyObj);
};
const $5bad0dce333ed95b$export$6a60f6b74bbaccb8 = {
    name: "BITKEY",
    address: $5bad0dce333ed95b$var$address,
    opReturnSchema: $5bad0dce333ed95b$var$opReturnSchema,
    handler: $5bad0dce333ed95b$var$handler
};





const $f2db843663565876$var$protocolAddress = "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p";
const $f2db843663565876$var$opReturnSchema = [
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
const $f2db843663565876$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    // Validation
    if (cell[0].s !== $f2db843663565876$var$protocolAddress || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].b || !cell[3].s || !tape) throw new Error(`Invalid BITPIC record: ${tx}`);
    const bitpicObj = {
        paymail: cell[1].s,
        pubkey: (0, $lNmOP$Buffer).from(cell[2].b, "base64").toString("hex"),
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
        const buf = (0, $lNmOP$Buffer).from(bin, "base64");
        const hashBuff = await (0, $69f57829bdd71afa$export$bced8d2aada2d1c9)(buf);
        const address = (0, $lNmOP$Address).fromPubKey((0, $lNmOP$PubKey).fromString(bitpicObj.pubkey));
        bitpicObj.verified = (0, $lNmOP$Bsm).verify(hashBuff, bitpicObj.signature, address);
    } catch (e) {
        // failed verification
        bitpicObj.verified = false;
    }
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "BITPIC", bitpicObj);
};
const $f2db843663565876$export$bbef9cc099c72f9d = {
    name: "BITPIC",
    address: $f2db843663565876$var$protocolAddress,
    opReturnSchema: $f2db843663565876$var$opReturnSchema,
    handler: $f2db843663565876$var$handler
};




const $d821e4307ef5193f$var$protocolIdentifier = "boostpow";
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
*/ const $d821e4307ef5193f$var$scriptChecker = (cell)=>{
    // protocol identifier always in first pushdata
    return cell[0].s === $d821e4307ef5193f$var$protocolIdentifier;
};
const $d821e4307ef5193f$var$handler = ({ dataObj: dataObj , cell: cell , out: out , tx: tx  })=>{
    if (!tx || !cell[0] || !out) throw new Error(`Invalid BOOST tx. dataObj, cell, out and tx are required.`);
    // build ASM from either op codes and script chunks
    const asm = cell.map((c)=>c.ops ? c.ops : (0, $69f57829bdd71afa$export$b691916706e0e9cc)(c, "hex") || "").join(" ");
    if (asm) {
        const boostJob = (0, $lNmOP$BoostPowJob).fromASM(asm, tx.tx.h, out.i, out.e.v).toObject();
        (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "BOOST", boostJob);
    }
};
const $d821e4307ef5193f$export$13c3c8ee12090ebc = {
    name: "BOOST",
    handler: $d821e4307ef5193f$var$handler,
    address: $d821e4307ef5193f$var$protocolIdentifier,
    scriptChecker: $d821e4307ef5193f$var$scriptChecker
};



const $23ca191354b1491d$var$address = "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3";
const $23ca191354b1491d$var$opReturnSchema = [
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
const $23ca191354b1491d$var$handler = async ({ dataObj: dataObj , cell: cell , tape: tape , tx: tx  })=>{
    if (!tape) throw new Error(`Invalid HAIP tx. Bad tape`);
    if (!tx) throw new Error(`Invalid HAIP tx.`);
    return await (0, $2bd9d69ae9f49db2$export$f0079d0908cdbf96)($23ca191354b1491d$var$opReturnSchema, (0, $2bd9d69ae9f49db2$export$6c117c038f18b127).HAIP, dataObj, cell, tape, tx);
};
const $23ca191354b1491d$export$12815d889fe90b8 = {
    name: "HAIP",
    address: $23ca191354b1491d$var$address,
    opReturnSchema: $23ca191354b1491d$var$opReturnSchema,
    handler: $23ca191354b1491d$var$handler
};





const $714a456a73c34cc4$var$address = "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5";
const $714a456a73c34cc4$var$opReturnSchema = [
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
const $714a456a73c34cc4$var$processADD = function(cell, mapObj) {
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
const $714a456a73c34cc4$var$proccessDELETE = function(cell, mapObj) {
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
const $714a456a73c34cc4$var$processSELECT = function(cell, mapObj) {
    // TODO
    // console.log('MAP SELECT');
    for (const pushdataContainer of cell)// ignore MAP command
    if (pushdataContainer.i === 0 || pushdataContainer.i === 1) {
        mapObj.SELECT = "TODO";
        continue;
    }
};
const $714a456a73c34cc4$var$processMSGPACK = function(cell, mapObj) {
    for (const pushdataContainer of cell){
        // ignore MAP command
        if (pushdataContainer.i === 0 || pushdataContainer.i === 1) continue;
        if (pushdataContainer.i === 2) try {
            if (!(0, $lNmOP$decode)) throw new Error("Msgpack is required but not loaded");
            const buff = (0, $lNmOP$Buffer).from(pushdataContainer.b, "base64");
            mapObj = (0, $lNmOP$decode)(buff);
        } catch (e) {
            mapObj = {};
        }
    }
    return mapObj;
};
const $714a456a73c34cc4$var$processJSON = function(cell, mapObj) {
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
const $714a456a73c34cc4$var$processSET = function(cell, mapObj) {
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
const $714a456a73c34cc4$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    // Validate
    if (cell[0].s !== $714a456a73c34cc4$var$address || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s) throw new Error(`Invalid MAP record: ${tx}`);
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
    const mapCmdKey = Object.keys($714a456a73c34cc4$var$opReturnSchema[0])[0];
    // Add the firt MAP command in the response object
    mapObj[mapCmdKey] = commands[0][0].s;
    commands.forEach((cc)=>{
        // re-add the MAP address
        cc.unshift({
            s: $714a456a73c34cc4$var$address,
            i: 0
        });
        const command = cc[1].s;
        // Individual parsing rules for each MAP command
        switch(command){
            // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
            case "ADD":
                $714a456a73c34cc4$var$processADD(cc, mapObj);
                break;
            case "REMOVE":
                mapObj.key = cc[2].s;
                break;
            case "DELETE":
                $714a456a73c34cc4$var$proccessDELETE(cc, mapObj);
                break;
            case "CLEAR":
                break;
            case "SELECT":
                $714a456a73c34cc4$var$processSELECT(cc, mapObj);
                break;
            case "MSGPACK":
                mapObj = $714a456a73c34cc4$var$processMSGPACK(cc, mapObj);
                break;
            case "JSON":
                mapObj = $714a456a73c34cc4$var$processJSON(cc, mapObj);
                break;
            case "SET":
                $714a456a73c34cc4$var$processSET(cc, mapObj);
                break;
            default:
        }
    });
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "MAP", mapObj);
};
const $714a456a73c34cc4$export$ce970371e0e850bc = {
    name: "MAP",
    address: $714a456a73c34cc4$var$address,
    opReturnSchema: $714a456a73c34cc4$var$opReturnSchema,
    handler: $714a456a73c34cc4$var$handler
};




const $1e51425d10743037$var$address = "meta";
const $1e51425d10743037$var$opReturnSchema = [
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
const $1e51425d10743037$export$3eb18141230d6532 = async function(a, tx) {
    // Calculate the node ID
    const buf = (0, $lNmOP$Buffer).from(a + tx);
    const hashBuf = await (0, $69f57829bdd71afa$export$bced8d2aada2d1c9)(buf);
    return hashBuf.toString("hex");
};
const $1e51425d10743037$var$handler = async ({ dataObj: dataObj , cell: cell , tx: tx  })=>{
    if (!cell.length || cell[0].s !== "meta" || !cell[1] || !cell[1].s || !cell[2] || !cell[2].s || !tx) throw new Error("Invalid Metanet tx " + tx);
    // For now, we just copy from MOM keys later if available, or keep BOB format
    const nodeId = await $1e51425d10743037$export$3eb18141230d6532(cell[1].s, tx.tx.h);
    // Described this node
    const node = {
        a: cell[1].s,
        tx: tx.tx.h,
        id: nodeId
    };
    let parent = {};
    if (tx.in) {
        const parentId = await $1e51425d10743037$export$3eb18141230d6532(tx.in[0].e.a, cell[2].s);
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
const $1e51425d10743037$export$7830a85a59ca4593 = {
    name: "METANET",
    address: $1e51425d10743037$var$address,
    opReturnSchema: $1e51425d10743037$var$opReturnSchema,
    handler: $1e51425d10743037$var$handler
};




const $cd4df1b674368969$var$address = "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1";
const $cd4df1b674368969$var$opReturnSchema = [
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
const $cd4df1b674368969$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    if (cell[0].s !== $cd4df1b674368969$var$address || !cell[1] || !cell[2] || !cell[3] || !cell[1].s || !cell[2].s || !cell[3].s) throw new Error(`Invalid RON record ${tx?.tx.h}`);
    const pair = JSON.parse(cell[1].s);
    const timestamp = Number(cell[3].s);
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "RON", {
        pair: pair,
        address: cell[2].s,
        timestamp: timestamp
    });
};
const $cd4df1b674368969$export$2839d627b6f3bcfe = {
    name: "RON",
    address: $cd4df1b674368969$var$address,
    opReturnSchema: $cd4df1b674368969$var$opReturnSchema,
    handler: $cd4df1b674368969$var$handler
};



const $450f3e4213996aff$var$address = "1SymRe7erxM46GByucUWnB9fEEMgo7spd";
const $450f3e4213996aff$var$opReturnSchema = [
    {
        url: "string"
    }
];
const $450f3e4213996aff$var$handler = function({ dataObj: dataObj , cell: cell , tx: tx  }) {
    if (cell[0].s !== $450f3e4213996aff$var$address || !cell[1] || !cell[1].s) throw new Error(`Invalid SymRe tx: ${tx}`);
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "SYMRE", {
        url: cell[1].s
    });
};
const $450f3e4213996aff$export$33455cbcda538c68 = {
    name: "SYMRE",
    address: $450f3e4213996aff$var$address,
    opReturnSchema: $450f3e4213996aff$var$opReturnSchema,
    handler: $450f3e4213996aff$var$handler
};



// 21e8 does not use the first pushdata for id
// in fact there is no id since the 21e8 is designed for difficulty and can be changed
// instead we use the static part of the script to indentfy the transaction
// TODO - the OP_X_PLACEHOLDER is the number of bytes to push onto the stack and must match difficulty size
const $d660e5f1e72a727e$var$_21e8Script = "OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" ");
const $d660e5f1e72a727e$var$scriptChecker = (cell)=>{
    if (cell.length !== 12) // wrong length
    return false;
    // match exact script
    const ops = [
        ...cell
    ].map((c)=>c.ops).splice(2, cell.length);
    // calculate target byte length
    const target = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[1], "hex");
    const targetOpSize = Buffer.from(target).byteLength;
    // replace the placeholder opcode with actual
    ops[1] = `OP_${targetOpSize}`;
    $d660e5f1e72a727e$var$_21e8Script[1] = `OP_${targetOpSize}`;
    // protocol identifier always in first pushdata
    return ops.join() === $d660e5f1e72a727e$var$_21e8Script.join();
};
const $d660e5f1e72a727e$var$handler = ({ dataObj: dataObj , cell: cell , out: out  })=>{
    if (!cell[0] || !out) throw new Error(`Invalid 21e8 tx. dataObj, cell, out and tx are required.`);
    // assemble asm
    // make sure first piece matches a txid
    // 2nd piece matches any difficulty. set some resonable limit in bytes if there isnt one documented somewhere
    // next
    const txid = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[0], "hex");
    const target = (0, $69f57829bdd71afa$export$b691916706e0e9cc)(cell[1], "hex");
    if (!target) throw new Error(`Invalid 21e8 target.` + JSON.stringify(cell[0], null, 2));
    const difficulty = Buffer.from(target, "hex").byteLength;
    const _21e8Obj = {
        target: target,
        difficulty: difficulty,
        value: out.e.v,
        txid: txid
    };
    (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, "21E8", _21e8Obj);
};
const $d660e5f1e72a727e$export$85479a00ad164ad6 = {
    name: "21E8",
    handler: $d660e5f1e72a727e$var$handler,
    scriptChecker: $d660e5f1e72a727e$var$scriptChecker
};



// Names of enabled protocols
const $fe0e4fc54cef5adf$var$enabledProtocols = new Map([]);
// Protocol Handlers
const $fe0e4fc54cef5adf$var$protocolHandlers = new Map([]);
// Script checkers are intentionally minimalistic detection functions for identifying matching scripts for a given protocol. Only if a checker returns true is a handler called for processing.
const $fe0e4fc54cef5adf$var$protocolScriptCheckers = new Map([]);
const $fe0e4fc54cef5adf$var$protocolOpReturnSchemas = new Map();
const $fe0e4fc54cef5adf$export$6b22fa9a84a4797f = [
    (0, $2bd9d69ae9f49db2$export$474d593e43f12abd),
    (0, $0de36bedfba54f35$export$ef35774e6d314e91),
    (0, $e6b302b820f24efd$export$5935ea4bf04c4453),
    (0, $714a456a73c34cc4$export$ce970371e0e850bc),
    (0, $1e51425d10743037$export$7830a85a59ca4593),
    (0, $d821e4307ef5193f$export$13c3c8ee12090ebc),
    (0, $d660e5f1e72a727e$export$85479a00ad164ad6),
    (0, $16330e01fa0b0248$export$c19e3a57d69468ea),
    (0, $5bad0dce333ed95b$export$6a60f6b74bbaccb8),
    (0, $f2db843663565876$export$bbef9cc099c72f9d),
    (0, $23ca191354b1491d$export$12815d889fe90b8),
    (0, $70da3cb5ab2146a0$export$f069e857381ef4b9),
    (0, $7b115585d0ffd9d8$export$bd49ff9d0c7fbe97),
    (0, $cd4df1b674368969$export$2839d627b6f3bcfe),
    (0, $450f3e4213996aff$export$33455cbcda538c68)
];
const $fe0e4fc54cef5adf$export$63e9417ed8d8533a = $fe0e4fc54cef5adf$export$6b22fa9a84a4797f.map((p)=>p.name);
const $fe0e4fc54cef5adf$export$4f34a1c822988d11 = [
    (0, $2bd9d69ae9f49db2$export$474d593e43f12abd),
    (0, $0de36bedfba54f35$export$ef35774e6d314e91),
    (0, $e6b302b820f24efd$export$5935ea4bf04c4453),
    (0, $714a456a73c34cc4$export$ce970371e0e850bc),
    (0, $1e51425d10743037$export$7830a85a59ca4593)
];
// prepare protocol map, handlers and schemas
$fe0e4fc54cef5adf$export$4f34a1c822988d11.forEach((protocol)=>{
    if (protocol.address) $fe0e4fc54cef5adf$var$enabledProtocols.set(protocol.address, protocol.name);
    $fe0e4fc54cef5adf$var$protocolHandlers.set(protocol.name, protocol.handler);
    if (protocol.opReturnSchema) $fe0e4fc54cef5adf$var$protocolOpReturnSchemas.set(protocol.name, protocol.opReturnSchema);
    if (protocol.scriptChecker) $fe0e4fc54cef5adf$var$protocolScriptCheckers.set(protocol.name, protocol.scriptChecker);
});
class $fe0e4fc54cef5adf$export$894a720e71f90b3c {
    constructor(){
        // initial default protocol handlers in this instantiation
        this.enabledProtocols = $fe0e4fc54cef5adf$var$enabledProtocols;
        this.protocolHandlers = $fe0e4fc54cef5adf$var$protocolHandlers;
        this.protocolScriptCheckers = $fe0e4fc54cef5adf$var$protocolScriptCheckers;
        this.protocolOpReturnSchemas = $fe0e4fc54cef5adf$var$protocolOpReturnSchemas;
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
                if (tape?.some((cc)=>(0, $69f57829bdd71afa$export$238b4e54af8fe886)(cc))) // loop over tape
                for (const cellContainer of tape){
                    // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                    if ((0, $69f57829bdd71afa$export$238b4e54af8fe886)(cellContainer)) continue;
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
                    // No OP_RETURN in this tape
                    const boostChecker = this.protocolScriptCheckers.get((0, $d821e4307ef5193f$export$13c3c8ee12090ebc).name);
                    const _21e8Checker = this.protocolScriptCheckers.get((0, $d660e5f1e72a727e$export$85479a00ad164ad6).name);
                    // Check for boostpow and 21e8
                    if (tape?.some((cc)=>{
                        const { cell: cell  } = cc;
                        if (boostChecker && boostChecker(cell)) // 'found boost'
                        return true;
                        if (_21e8Checker && _21e8Checker(cell)) // 'found 21e8'
                        return true;
                    })) // find the cell array
                    // loop over tape
                    for (const cellContainer1 of tape){
                        const { cell: cell1  } = cellContainer1;
                        // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
                        if (!cell1) throw new Error("empty cell while parsing");
                        let protocolName = "";
                        if (boostChecker && boostChecker(cell1)) protocolName = (0, $d821e4307ef5193f$export$13c3c8ee12090ebc).name;
                        else if (_21e8Checker && _21e8Checker(cell1)) protocolName = (0, $d660e5f1e72a727e$export$85479a00ad164ad6).name;
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
        } else (0, $69f57829bdd71afa$export$23dbc584560299c3)(dataObj, protocolName, cell);
    };
}
const $fe0e4fc54cef5adf$export$b2a90e318402f6bc = async (tx, protocols)=>{
    const b = new $fe0e4fc54cef5adf$export$894a720e71f90b3c();
    // if protocols are specified
    if (protocols) {
        // wipe out defaults
        b.enabledProtocols.clear();
        if ((0, $69f57829bdd71afa$export$f6e922e536d8305c)(protocols)) {
            // set enabled protocols
            for (const protocol of $fe0e4fc54cef5adf$export$6b22fa9a84a4797f)if (protocols?.includes(protocol.name)) b.addProtocolHandler(protocol);
        } else if ((0, $69f57829bdd71afa$export$37b8d83213de0f5f)(protocols)) for (const p of protocols){
            const protocol1 = p;
            if (protocol1) b.addProtocolHandler(protocol1);
        }
        else throw new Error(`Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).`);
    }
    return b.transformTx(tx);
};


export {$fe0e4fc54cef5adf$export$6b22fa9a84a4797f as allProtocols, $fe0e4fc54cef5adf$export$63e9417ed8d8533a as supportedProtocols, $fe0e4fc54cef5adf$export$4f34a1c822988d11 as defaultProtocols, $fe0e4fc54cef5adf$export$894a720e71f90b3c as BMAP, $fe0e4fc54cef5adf$export$b2a90e318402f6bc as TransformTx};
//# sourceMappingURL=bmap.module.js.map