const bmap = {};

Map.prototype.getKey = function (searchValue) {
  for (let [key, value] of this.entries()) {
    if (value === searchValue) return key;
  }
  return null;
};

// Takes a BOB formatted op_return transaction
bmap.TransformTx = async (tx) => {
  if (!tx || !tx.hasOwnProperty("in") || !tx.hasOwnProperty("out")) {
    throw new Error("Cant process tx", tx);
  }

  let protocolMap = new Map();
  protocolMap.set("B", "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut");
  protocolMap.set("BITPIC", "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p");
  protocolMap.set("MAP", "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5");
  protocolMap.set("METANET", "meta");
  protocolMap.set("AIP", "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva");
  protocolMap.set("HAIP", "1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3");
  protocolMap.set("BITCOM", "$");
  protocolMap.set("BITKEY", "13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC");
  protocolMap.set("SYMRE", "1SymRe7erxM46GByucUWnB9fEEMgo7spd");
  protocolMap.set("RON", "1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1");
  protocolMap.set("PSP", "1signyCizp1VyBsJ5Ss2tEAgw7zCYNJu4");

  let encodingMap = new Map();
  encodingMap.set("utf8", "string");
  encodingMap.set("text", "string"); // invalid but people use it :(
  encodingMap.set("gzip", "binary"); // invalid but people use it :(
  encodingMap.set("image/png", "binary");
  encodingMap.set("image/jpeg", "binary");

  let querySchema = {
    B: [
      { content: ["string", "binary"] },
      { "content-type": "string" },
      { encoding: "string" }, // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
      { filename: "string" },
    ],
    MAP: [
      {
        cmd: {
          SET: [{ key: "string" }, { val: "string" }],
          SELECT: [{ tx: "string" }],
          ADD: [{ key: "string" }, [{ val: "string" }]],
          DELETE: [{ key: "string" }, [{ val: "string" }]],
          JSON: "string",
          REMOVE: [[{ key: "string" }]],
          CLEAR: [[{ txid: "string" }]],
        },
      },
    ],
    METANET: [{ address: "string" }, { parent: "string" }, { name: "string" }],
    AIP: [
      { algorithm: "string" },
      { address: "string" },
      { signature: "binary" },
      [{ index: "binary" }],
    ],
    HAIP: [
      { hashing_algorithm: "string" },
      { signing_algorithm: "string" },
      { signing_address: "string" },
      { signature: "binary" },
      { index_unit_size: "binary" },
      [{ field_index: "binary" }],
    ],
    BITPIC: [{ paymail: "string" }, { signature: "string" }],
    BITKEY: [
      { bitkey_signature: "binary" },
      { user_signature: "binary" },
      { paymail: "string" },
      { pubkey: "string" },
    ],
    BITCOM: [
      {
        su: [
          { pubkey: "string" },
          { sign_position: "string" },
          { signature: "string" },
        ],
        echo: [{ data: "string" }, { to: "string" }, { filename: "string" }],
        route: [
          [
            {
              add: [
                { bitcom_address: "string" },
                { route_matcher: "string" },
                { endpoint_template: "string" },
              ],
            },
            {
              enable: [{ path: "string" }],
            },
          ],
        ],
        useradd: [{ address: "string" }],
      },
    ],
    PSP: [
      { signature: "binary" },
      { public_key: "string" },
      { paymail: "string" },
    ],
    RON: [{ pair: "json" }, { address: "string" }, { timestamp: "string" }],
    SYMRE: [{ url: "string" }],
    default: [[{ pushdata: "string" }]],
  };

  // This will become our nicely formatted response object
  let dataObj = {};
  let instances = {};

  const saveProtocolData = (protocolName, data) => {
    console.log("save data", instances);
    if (!instances.hasOwnProperty(protocolName)) {
      dataObj[protocolName] = data;
      instances[protocolName] = 0;
    } else {
      if (instances[protocolName] === 0) {
        let prevData = dataObj[protocolName];
        dataObj[protocolName] = [];
        dataObj[protocolName][0] = prevData;
      }
      instances[protocolName]++;
      dataObj[protocolName][instances[protocolName]] = data;
    }
  };

  for (let [key, val] of Object.entries(tx)) {
    if (key === "out") {
      // loop over the outputs
      for (let out of tx.out) {
        let tape = out.tape;

        if (
          tape.some((cc) => {
            return checkOpFalseOpReturn(cc);
          })
        ) {
          for (let cell_container of tape) {
            // Skip the OP_RETURN / OP_FALSE OP_RETURN cell
            if (checkOpFalseOpReturn(cell_container)) {
              continue;
            }

            let cell = cell_container.cell;

            if (!cell) {
              console.error("empty cell while parcing");
              return;
            }

            // Get protocol name from prefix
            let protocolName = protocolMap.getKey(cell[0].s) || cell[0].s;

            switch (protocolName) {
              case "BITKEY":
                let bitkeyObj = {};
                // loop over the schema
                for (let [idx, schemaField] of Object.entries(
                  querySchema.BITKEY
                )) {
                  let x = parseInt(idx);
                  let bitkeyField = Object.keys(schemaField)[0];
                  let schemaEncoding = Object.values(schemaField)[0];
                  bitkeyObj[bitkeyField] = cellValue(
                    cell[x + 1],
                    schemaEncoding
                  );
                }
                saveProtocolData(protocolName, bitkeyObj);
                break;
              case "PSP": // Paymail Signature Protocol
                // Validation
                if (
                  !cell[1] ||
                  !cell[2] ||
                  !cell[3] ||
                  !cell[1].b ||
                  !cell[2].s ||
                  !cell[3].s
                ) {
                  console.warn("Invalid Paymail Signature Protocol record");
                  return;
                }

                saveProtocolData(protocolName, {
                  paymail: cell[3].s,
                  pubkey: cell[2].s,
                  sig: cell[1].b,
                });

                break;
              case "BITPIC":
                // Validation
                if (
                  !cell[1] ||
                  !cell[2] ||
                  !cell[3] ||
                  !cell[1].s ||
                  !cell[2].b ||
                  !cell[3].b
                ) {
                  console.warn("Invalid BITPIC record");
                  return;
                }

                saveProtocolData(protocolName, {
                  paymail: cell[1].s,
                  pubkey: cell[2].b,
                  sig: cell[3].b,
                });

                break;
              case "HAIP":
              // USE AIP - Fallthrough
              case "AIP":
                // loop over the schema
                let aipObj = {};

                // Does not have the required number of fields
                if (cell.length < 4) {
                  console.warn(
                    "AIP requires at least 4 fields including the prefix."
                  );
                  delete dataObj[protocolName];
                  break;
                }

                for (let [idx, schemaField] of Object.entries(
                  querySchema[protocolName]
                )) {
                  let x = parseInt(idx);

                  let schemaEncoding;
                  let aipField;
                  if (schemaField instanceof Array) {
                    // signature indexes are specified
                    schemaEncoding = schemaField[0]["index"];
                    aipField = Object.keys(schemaField[0])[0];
                    continue;
                  } else {
                    aipField = Object.keys(schemaField)[0];
                    schemaEncoding = Object.values(schemaField)[0];
                  }

                  aipObj[aipField] = cellValue(cell[x + 1], schemaEncoding);
                }

                saveProtocolData(protocolName, aipObj);

                break;
              case "B":
                if (!cell[1] || !cell[2]) {
                  console.error("Invalid B tx");
                  return;
                }
                let bObj = {};
                // loop over the schema
                for (let [idx, schemaField] of Object.entries(querySchema.B)) {
                  let x = parseInt(idx);
                  let bField = Object.keys(schemaField)[0];
                  let schemaEncoding = Object.values(schemaField)[0];
                  if (bField === "content") {
                    // If the encoding is ommitted, try to infer from content-type instead of breaking
                    if (!cell[3]) {
                      schemaEncoding = encodingMap.get(cell[2].s);
                      if (!schemaEncoding) {
                        console.warn(
                          "Problem inferring encoding. Malformed B data.",
                          cell
                        );
                        break;
                      } else {
                        // add the missing encoding field
                        cell.push({
                          s: schemaEncoding === "string" ? "utf8" : "binary",
                        });
                      }
                    } else {
                      schemaEncoding =
                        cell[3] && cell[3].s
                          ? encodingMap.get(
                              cell[3].s.replace("-", "").toLowerCase()
                            )
                          : null;
                    }
                  }

                  // Sometimes filename is not used
                  if (bField === "filename" && !cell[x + 1]) {
                    // filename ommitted
                    continue;
                  }

                  // check for malformed syntax
                  if (!cell || !cell.hasOwnProperty(x + 1)) {
                    console.error("malformed B syntax", cell);
                    continue;
                  }

                  // set field value from either s, b, ls, or lb depending on encoding and availability
                  let data = cell[x + 1];
                  let correctValue = cellValue(data, schemaEncoding);
                  bObj[bField] = correctValue;
                }
                saveProtocolData(protocolName, bObj);
                break;
              case "MAP":
                // Validate
                if (!cell[1] || !cell[1].s || !cell[2] || !cell[2].s) {
                  console.error("Invalid MAP record");
                  break;
                }

                let mapObj = {};

                let command = cell[1].s;

                // Get the MAP command key name from the query schema
                let mapCmdKey = Object.keys(querySchema[protocolName][0])[0];

                // Add the MAP command in the response object
                mapObj[mapCmdKey] = command;

                // Individual parsing rules for each MAP command
                switch (command) {
                  // ToDo - MAP v2: Check for protocol separator and run commands in a loop
                  // Also check for SELECT commands and strip off the <SELECT> <TXID> part and run it through
                  case "ADD":
                    let last = null;
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }
                      let pushdata = pushdata_container.s;
                      if (pushdata_container.i === 2) {
                        // Key name
                        mapObj[pushdata] = [];
                        last = pushdata;
                      } else {
                        mapObj[last].push(pushdata);
                      }
                    }
                    break;
                  case "REMOVE":
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }
                      mapObj.push(pushdata_container.s);
                    }
                    break;
                  case "DELETE":
                    let last = null;
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }
                      let pushdata = pushdata_container.s;
                      if (pushdata_container.i === 2) {
                        // Key name
                        mapObj[pushdata] = [];
                        last = pushdata;
                      } else {
                        mapObj[last].push(pushdata);
                      }
                    }
                    break;
                  case "CLEAR":
                    console.log("MAP CLEAR");
                    break;
                  case "SELECT":
                    console.log("MAP SELECT");
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }

                      // TODO
                    }
                    break;
                  case "MSGPACK":
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }
                      if (pushdata_container.i === 2) {
                        try {
                          if (!decode) {
                            console.warn("Msgpack is required but not loaded");
                            continue;
                          }
                          try {
                            let buff = MessagePack.Buffer.from(
                              pushdata_container.b,
                              "base64"
                            );
                            let decoded = decode(buff);
                            mapObj = decoded;
                          } catch (e) {
                            console.error("faile to parse", e);
                            continue;
                          }
                        } catch (e) {
                          console.warn("failed to parse MAP MSGPACK");
                          continue;
                        }
                      }
                    }
                    break;
                  case "JSON":
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }
                      if (pushdata_container.i === 2) {
                        try {
                          mapObj = JSON.parse(pushdata_container.s);
                        } catch (e) {
                          console.warn("failed to parse MAP JSON");
                          continue;
                        }
                      }
                    }
                    break;
                  case "SET":
                    let last = null;
                    for (let pushdata_container of cell) {
                      // ignore MAP command
                      if (
                        !pushdata_container.s ||
                        pushdata_container.i === 0 ||
                        pushdata_container.i === 1
                      ) {
                        continue;
                      }

                      let pushdata = pushdata_container.s;
                      if (pushdata_container.i % 2 === 0) {
                        // key
                        mapObj[pushdata] = "";
                        last = pushdata;
                      } else {
                        // value
                        if (!last) {
                          console.warn(
                            "malformed MAP syntax. Cannot parse.",
                            last
                          );
                          continue;
                        }
                        mapObj[last] = pushdata;
                      }
                    }
                    break;
                }
                saveProtocolData(protocolName, mapObj);
                break;
              case "METANET":
                if (!cell[1] || !cell[1].s) {
                  console.error("Invalid Metanet tx");
                  break;
                }
                // For now, we just copy from MOM keys later if available, or keep BOB format

                // Described this node
                // Calculate the node ID
                let id;
                try {
                  id = getEnvSafeMetanetID(tx.in[0].e.a, tx.in[0].e.h);
                } catch (e) {
                  console.warn("error", e);
                }

                let node = {
                  a: cell[1].s,
                  tx: tx.tx.h,
                  id: id,
                };

                // Parent node
                let parent = {
                  a: cell[1] && cell[1].s ? cell[1].s : "",
                  tx: tx.in[0].e.h,
                  id: cell[2] && cell[2].s ? cell[2].s : "",
                };

                dataObj[protocolName] = {};
                dataObj[protocolName] = {
                  node: node,
                  parent: parent,
                };
                break;
              case "BITCOM":
                let bitcomObj = cell.map((c) => {
                  return c && c.s ? c.s : "";
                });
                saveProtocolData(protocolName, bitcomObj);
                break;
              case "RON":
                dataObj[protocolName].pair =
                  cell[1] && cell[1].s ? JSON.parse(cell[1].s) : {};
                dataObj[protocolName].address =
                  cell[2] && cell[2].s ? cell[2].s : "";
                dataObj[protocolName].timestamp =
                  cell[3] && cell[3].s ? cell[3].s : "";
                break;
              case "SYMRE":
                if (!cell[1] || !cell[1].s) {
                  console.error("Invalid SymRe tx");
                  break;
                }
                saveProtocolData(protocolName, { url: cell[1].s });

                break;
              default:
                // Unknown protocol prefix. Keep BOB's cell format

                saveProtocolData(protocolName, cell);
                break;
            }
          }
        } else {
          // No OP_RETURN in this outputs
          if (!dataObj[key]) {
            dataObj[key] = [];
          }
          dataObj[key].push({ i: out.i, e: out.e });
        }
      }
    } else if (key === "in") {
      dataObj[key] = val.map((v) => {
        let r = Object.assign({}, v);
        delete r.tape;
        return r;
      });
    } else {
      dataObj[key] = val;
    }
  }

  // If this is a MOM planaria it will have metanet keys available
  if (dataObj.hasOwnProperty("METANET") && tx.hasOwnProperty("parent")) {
    dataObj.METANET["ancestor"] = tx.ancestor;
    delete dataObj.ancestor;
    dataObj.METANET["child"] = tx.child;
    delete dataObj.child;

    // remove parent and node from root level for (MOM data)
    delete dataObj.parent;
    delete dataObj.node;

    dataObj.METANET["head"] = tx.head;
    delete dataObj.head;
  }
  return dataObj;
};

// Check a cell starts with OP_FALSE OP_RETURN -or- OP_RETURN
function checkOpFalseOpReturn(cc) {
  return (
    (cc.cell[0] &&
      cc.cell[1] &&
      cc.cell[0].op === 0 &&
      cc.cell[1].hasOwnProperty("op") &&
      cc.cell[1].op === 106) ||
    cc.cell[0].op === 106
  );
}

// ArrayBuffer to hex string
function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

// returns the BOB cell value for a given encoding
function cellValue(pushdata, schemaEncoding) {
  if (!pushdata) {
    console.error("cannot get cell value of", pushdata);
    return;
  }
  return schemaEncoding === "string"
    ? pushdata.hasOwnProperty("s")
      ? pushdata.s
      : pushdata.ls
    : pushdata.hasOwnProperty("b")
    ? pushdata.b
    : pushdata.lb;
}

// Different methods for node vs browser
async function getEnvSafeMetanetID(a, tx) {
  // Calculate the node ID
  if (isBrowser()) {
    // browser
    let buf = new ArrayBuffer(a + tx);
    let digest = await crypto.subtle.digest("SHA-256", buf);
    return buf2hex(digest);
  } else {
    // node
    let buf = Buffer.from(a + tx);
    return crypto.createHash("sha256").update(buf).digest("hex");
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export default bmap;
