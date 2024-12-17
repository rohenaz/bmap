"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const ye=require("bpu-ts"),h=require("@bsv/sdk"),be=require("node-fetch"),O=require("@msgpack/msgpack"),we=t=>t.length>0&&t.every(e=>typeof e=="string"),Se=t=>t.length>0&&t.every(e=>e==="object"),v=(t,e)=>{if(t){if(e==="string")return t.s?t.s:t.ls||"";if(e==="hex")return t.h?t.h:t.lh||(t.b?Buffer.from(t.b,"base64").toString("hex"):t.lb&&Buffer.from(t.lb,"base64").toString("hex"))||"";if(e==="number")return parseInt(t.h?t.h:t.lh||"0",16);if(e==="file")return`bitfs://${t.f?t.f:t.lf}`}else throw new Error(`cannot get cell value of: ${t}`);return(t.b?t.b:t.lb)||""},Pe=t=>t.cell.some(e=>e.op===106),K=t=>{var r;if(t.cell.length!==2)return!1;const e=t.cell.findIndex(n=>n.op===106);return e!==-1?((r=t.cell[e-1])==null?void 0:r.op)===0:!1},b=(t,e,r)=>{t[e]?t[e].push(r):t[e]=[r]},ve=(t,e,r,n,s)=>{const i={},o=e.length+1;if(n.length<o)throw new Error(`${t} requires at least ${o} fields including the prefix: ${s.tx.h}`);for(const[a,f]of Object.entries(e)){const d=Number.parseInt(a,10),[c]=Object.keys(f),[l]=Object.values(f);i[c]=v(n[d+1],l)}b(r,t,i)},xe=t=>{const e="(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";return new RegExp(`^${e}$`,"gi").test(t)},C="OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" "),Ee=t=>{if(t.length!==12)return!1;const e=[...t].map(s=>s.ops).splice(2,t.length),r=v(t[1],"hex"),n=Buffer.from(r).byteLength;return e[1]=`OP_${n}`,C[1]=`OP_${n}`,e.join()===C.join()},Be=({dataObj:t,cell:e,out:r})=>{if(!e[0]||!r)throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");const n=v(e[0],"hex"),s=v(e[1],"hex");if(!s)throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0],null,2)}`);const i=Buffer.from(s,"hex").byteLength,o={target:s,difficulty:i,value:r.e.v,txid:n};b(t,"21E8",o)},k={name:"21E8",handler:Be,scriptChecker:Ee},{toArray:x,toHex:V,fromBase58Check:Ie,toBase58Check:Ae}=h.Utils,q="15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva",U=[{algorithm:"string"},{address:"string"},{signature:"binary"},[{index:"binary"}]],ke=async t=>{try{return await(await be(`https://x.bitfs.network/${t}`)).buffer()}catch{return Buffer.from("")}};function Me(t){const e=V(t);return new h.BigNumber(e,16)}function _(t,e,r){const n=h.BSM.magicHash(t),s=Me(n);for(let i=0;i<4;i++)try{const o=e.RecoverPublicKey(i,s),a=o.toHash(),{prefix:f}=Ie(r),d=Ae(a,f);if(d===r)return console.log("[recoverPublicKeyFromBSM] Successfully recovered matching public key"),o;console.log("[recoverPublicKeyFromBSM] Trying recovery=",i,"Recovered address=",d,"expected=",r)}catch(o){console.log("[recoverPublicKeyFromBSM] Recovery error:",o)}throw console.log("[recoverPublicKeyFromBSM] Failed to recover any matching address"),new Error("Failed to recover public key matching the expected address")}function Te(t){const e=new h.Script;e.chunks.push({op:0}),e.chunks.push({op:106});for(const r of t){const n=r.length;n<=75?e.chunks.push({op:n,data:Array.from(r)}):n<=255?e.chunks.push({op:76,data:Array.from(r)}):n<=65535?e.chunks.push({op:77,data:Array.from(r)}):e.chunks.push({op:78,data:Array.from(r)})}return e}async function He(t,e,r){var E;if(!Array.isArray(r)||r.length<3)throw new Error("AIP requires at least 3 cells including the prefix");let n=-1;if(r.forEach((u,g)=>{u.cell===e&&(n=g)}),n===-1)throw new Error("AIP could not find cell in tape");let s=t.index||[];const i=["6a"];for(let u=0;u<n;u++){const g=r[u];if(!K(g)){const m=[];for(const p of g.cell){let y;if(p.h)y=p.h;else if(p.f){const w=await ke(p.f);y=w.length>0?w.toString("hex"):void 0}else if(p.b){const w=Buffer.from(p.b,"base64");w.length>0&&(y=w.toString("hex"))}else p.s&&p.s.length>0&&(y=Buffer.from(p.s).toString("hex"));y&&y.length>0&&m.push(y)}m.length>0&&(i.push(...m),i.push("7c"))}}if(t.hashing_algorithm&&t.index_unit_size){const u=t.index_unit_size*2;s=[];const g=((E=e[6])==null?void 0:E.h)||"";for(let m=0;m<g.length;m+=u)s.push(Number.parseInt(g.substr(m,u),16));t.index=s}console.log("usingIndexes",s),console.log("signatureValues",i);const o=[];if(s.length>0)for(const u of s){if(typeof i[u]!="string"&&console.log("signatureValues[idx]",i[u],"idx",u),!i[u])return console.log("signatureValues is missing an index",u,"This means indexing is off"),!1;o.push(Buffer.from(i[u],"hex"))}else for(const u of i)o.push(Buffer.from(u,"hex"));console.log("signatureBufferStatements",o.map(u=>u.toString("hex")));let a;if(t.hashing_algorithm){t.index_unit_size||o.shift();const u=Te(o);let g=Buffer.from(u.toHex(),"hex");t.index_unit_size&&(g=g.slice(1));const m=h.Hash.sha256(x(g));a=Buffer.from(m)}else a=Buffer.concat(o);const f=t.address||t.signing_address,d=t.signature,c=h.Signature.fromCompact(d,"base64"),l=()=>{console.log("[validateSignature:tryNormalLogic] start");try{const u=x(a),g=_(u,c,f);console.log("[tryNormalLogic] recoveredPubkey ok, verifying with BSM.verify now");const m=h.BSM.verify(u,c,g);return console.log("[tryNormalLogic] BSM.verify result:",m),m}catch(u){return console.log("[tryNormalLogic] error:",u),!1}},S=()=>{if(console.log("[validateSignature:tryTwetchLogic] start"),o.length<=2)return!1;const u=o.slice(1,-1);console.log("[tryTwetchLogic] trimmedStatements count:",u.length);const g=h.Hash.sha256(x(Buffer.concat(u))),m=V(g),p=Buffer.from(m,"utf8");try{const y=_(x(p),c,f);console.log("[tryTwetchLogic] recoveredPubkey ok, verifying with BSM.verify now");const w=h.BSM.verify(x(p),c,y);return console.log("[tryTwetchLogic] BSM.verify result:",w),w}catch(y){return console.log("[tryTwetchLogic] error:",y),!1}};let P=l();return P||(P=S()),console.log("[validateSignature] final verified=",P),t.verified=P,P}var z=(t=>(t.HAIP="HAIP",t.AIP="AIP",t))(z||{});const Q=async(t,e,r,n,s,i)=>{const o={verified:!1};if(n.length<4)throw new Error("AIP requires at least 4 fields including the prefix");for(const[a,f]of Object.entries(t)){const d=Number.parseInt(a,10);if(Array.isArray(f)){const[c]=Object.keys(f[0]),l=[];for(let S=d+1;S<n.length;S++)n[S].h&&l.push(Number.parseInt(n[S].h,16));o[c]=l}else{const[c]=Object.keys(f),[l]=Object.values(f);o[c]=v(n[d+1],l)||""}}if(n[0].s===q&&n[3].s&&xe(n[3].s)&&(o.signature=n[3].s),console.log("[AIPhandler] AIP object before validate:",o),!o.signature)throw new Error("AIP requires a signature");await He(o,n,s),console.log("[AIPhandler] After validate, verified:",o.verified),b(r,e,o)},$e=async({dataObj:t,cell:e,tape:r,tx:n})=>{if(!r)throw new Error("Invalid AIP transaction");return await Q(U,"AIP",t,e,r)},Y={name:"AIP",address:q,opReturnSchema:U,handler:$e},Re="19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",M=[{content:["string","binary","file"]},{"content-type":"string"},{encoding:"string"},{filename:"string"}],Oe=({dataObj:t,cell:e,tx:r})=>{var i;const n=new Map;if(n.set("utf8","string"),n.set("text","string"),n.set("gzip","binary"),n.set("text/plain","string"),n.set("image/png","binary"),n.set("image/jpeg","binary"),!e[1]||!e[2])throw new Error(`Invalid B tx: ${r}`);if(e.length>M.length+1)throw new Error("Invalid B tx. Too many fields.");const s={};for(const[o,a]of Object.entries(M)){const f=Number.parseInt(o,10),d=Object.keys(a)[0];let c=Object.values(a)[0];if(d==="content")if(e[1].f)c="file";else if((!e[3]||!e[3].s)&&e[2].s){if(c=n.get(e[2].s),!c){console.warn("Problem inferring encoding. Malformed B data.",e);return}e[3]||(e[3]={h:"",b:"",s:"",i:0,ii:0}),e[3].s=c==="string"?"utf-8":"binary"}else c=(i=e[3])!=null&&i.s?n.get(e[3].s.replace("-","").toLowerCase()):null;if(d==="encoding"&&!e[f+1]||d==="filename"&&!e[f+1])continue;if(!e||!e[f+1])throw new Error(`malformed B syntax ${e}`);const l=e[f+1];s[d]=v(l,c)}b(t,"B",s)},j={name:"B",address:Re,opReturnSchema:M,handler:Oe},Ce="1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT",Z=[{type:"string"},{hash:"string"},{sequence:"string"}],_e=({dataObj:t,cell:e,tx:r})=>{if(!r)throw new Error("Invalid BAP tx, tx required");ve("BAP",Z,t,e,r)},G={name:"BAP",address:Ce,opReturnSchema:Z,handler:_e},Ne="$",Le=[{su:[{pubkey:"string"},{sign_position:"string"},{signature:"string"}],echo:[{data:"string"},{to:"string"},{filename:"string"}],route:[[{add:[{bitcom_address:"string"},{route_matcher:"string"},{endpoint_template:"string"}]},{enable:[{path:"string"}]}]],useradd:[{address:"string"}]}],Fe=({dataObj:t,cell:e})=>{if(!e.length||!e.every(n=>n.s))throw new Error("Invalid Bitcom tx");const r=e.map(n=>n!=null&&n.s?n.s:"");b(t,"BITCOM",r)},Ke={name:"BITCOM",address:Ne,opReturnSchema:Le,handler:Fe},{toArray:N,toBase58Check:A,toHex:Ve}=h.Utils,{magicHash:qe}=h.BSM,J="13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC",D=[{bitkey_signature:"string"},{user_signature:"string"},{paymail:"string"},{pubkey:"string"}];function Ue(t){const e=Ve(t);return new h.BigNumber(e,16)}function L(t,e){const r=qe(t),n=Ue(r);for(let s=0;s<4;s++)try{const i=e.RecoverPublicKey(s,n);if(h.BSM.verify(t,e,i))return i}catch{}throw new Error("Failed to recover public key from BSM signature")}const ze=async({dataObj:t,cell:e})=>{if(e.length<5)throw new Error("Invalid Bitkey tx");const r={};for(const[le,R]of Object.entries(D)){const ge=Number.parseInt(le,10),me=Object.keys(R)[0],pe=Object.values(R)[0];r[me]=v(e[ge+1],pe)}const n=r.pubkey,i=h.PublicKey.fromString(n).toHash(),o=A(i),f=Buffer.from(r.paymail).toString("hex")+n,d=Buffer.from(f,"hex"),c=h.Hash.sha256(N(d)),l=h.Signature.fromCompact(r.bitkey_signature,"base64"),S=L(c,l),P=S.toHash(),E=A(P),u=h.BSM.verify(c,l,S)&&E===J,g=N(Buffer.from(n,"utf8")),m=h.Signature.fromCompact(r.user_signature,"base64"),p=L(g,m),y=p.toHash(),w=A(y),he=h.BSM.verify(g,m,p)&&w===o;r.verified=u&&he,b(t,"BITKEY",r)},Qe={name:"BITKEY",address:J,opReturnSchema:D,handler:ze},{magicHash:Ye}=h.BSM,{toArray:je}=h.Utils,W="18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p",Ze=[{paymail:"string"},{pubkey:"binary"},{signature:"string"}],Ge=async({dataObj:t,cell:e,tape:r,tx:n})=>{if(e[0].s!==W||!e[1]||!e[2]||!e[3]||!e[1].s||!e[2].b||!e[3].s||!r)throw new Error(`Invalid BITPIC record: ${n}`);const s={paymail:e[1].s,pubkey:Buffer.from(e[2].b,"base64").toString("hex"),signature:e[3].s||"",verified:!1};if(r[1].cell[0].s==="19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")try{const o=e[1].lb||e[1].b,a=h.Hash.sha256(je(o,"base64")),f=h.Signature.fromCompact(s.signature,"base64"),d=h.PublicKey.fromString(s.pubkey),c=Ye(a);s.verified=h.BSM.verify(c,f,d)}catch{s.verified=!1}b(t,"BITPIC",s)},Je={name:"BITPIC",address:W,opReturnSchema:Ze,handler:Ge},De="1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3",X=[{hashing_algorithm:"string"},{signing_algorithm:"string"},{signing_address:"string"},{signature:"string"},{index_unit_size:"number"},[{index:"binary"}]],We=async({dataObj:t,cell:e,tape:r,tx:n})=>{if(!r)throw new Error("Invalid HAIP tx. Bad tape");if(!n)throw new Error("Invalid HAIP tx.");return await Q(X,z.HAIP,t,e,r)},Xe={name:"HAIP",address:De,opReturnSchema:X,handler:We},T="1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5",ee=[{cmd:{SET:[{key:"string"},{val:"string"}],SELECT:[{tx:"string"}],ADD:[{key:"string"},[{val:"string"}]],DELETE:[{key:"string"},[{val:"string"}]],JSON:"string",REMOVE:[[{key:"string"}]],CLEAR:[[{txid:"string"}]]}}],et=(t,e)=>{let r=null;for(const n of t){if(n.i===0||n.i===1)continue;const s=n.s;n.i===2?(e[s]=[],r=s):r&&Array.isArray(e[r])&&e[r].push(s)}},tt=(t,e)=>{let r=null;for(const n of t){if(n.i===0||n.i===1)continue;const s=n.s;n.i===2?(e[s]=[],r=s):r&&e[r].push(s)}},rt=(t,e)=>{for(const r of t)if(r.i===0||r.i===1){e.SELECT="TODO";continue}},nt=(t,e)=>{for(const r of t)if(!(r.i===0||r.i===1)&&r.i===2)try{if(!O.decode)throw new Error("Msgpack is required but not loaded");const n=Buffer.from(r.b,"base64");e=O.decode(n)}catch{e={}}return e},st=(t,e)=>{for(const r of t)if(!(r.i===0||r.i===1)&&r.i===2)try{e=JSON.parse(r.s)}catch{e={}}return e},ot=(t,e)=>{let r=null;for(const n of t){if(!n.s||n.i===0||n.i===1)continue;const s=n.s;if(n.i%2===0)e[s]="",r=s;else{if(!r)throw new Error(`malformed MAP syntax. Cannot parse.${r}`);e[r]=s}}},it=({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==T||!e[1]||!e[1].s||!e[2]||!e[2].s)throw new Error(`Invalid MAP record: ${r}`);let n={};const s=[];let i=0;for(let a=1;a<e.length;a++)e[a].s===":::"?i++:(s[i]||(s[i]=[]),e[a].i=s[i].length+1,s[i].push(e[a]));const o=Object.keys(ee[0])[0];n[o]=s[0][0].s;for(const a of s)switch(a.unshift({s:T,i:0}),a[1].s){case"ADD":{et(a,n);break}case"REMOVE":{n.key=a[2].s;break}case"DELETE":{tt(a,n);break}case"CLEAR":break;case"SELECT":{rt(a,n);break}case"MSGPACK":{n=nt(a,n);break}case"JSON":{n=st(a,n);break}case"SET":{ot(a,n);break}}b(t,"MAP",n)},te={name:"MAP",address:T,opReturnSchema:ee,handler:it},{toArray:at,toHex:ct}=h.Utils,ft="meta",dt=[{address:"string"},{parent:"string"},{name:"string"}],F=async(t,e)=>{const r=Buffer.from(t+e),n=h.Hash.sha256(at(r));return ct(n)},ut=async({dataObj:t,cell:e,tx:r})=>{if(!e.length||e[0].s!=="meta"||!e[1]||!e[1].s||!e[2]||!e[2].s||!r)throw new Error(`Invalid Metanet tx ${r}`);const n=await F(e[1].s,r.tx.h),s={a:e[1].s,tx:r.tx.h,id:n};let i={};if(r.in){const o=await F(r.in[0].e.a,e[2].s);i={a:r.in[0].e.a,tx:e[2].s,id:o}}t.METANET||(t.METANET=[]),t.METANET.push({node:s,parent:i})},re={name:"METANET",address:ft,opReturnSchema:dt,handler:ut},ht=t=>{if(t.length<13)return!1;const e=I(t,i=>i.ops==="OP_IF"),r=I(t,(i,o)=>o>e&&i.ops==="OP_ENDIF"),n=t.slice(e,r),s=t[e-1];return(s==null?void 0:s.op)===0&&!!n[0]&&!!n[1]&&n[1].s=="ord"},lt=({dataObj:t,cell:e,out:r})=>{if(!e[0]||!r)throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");const n=I(e,d=>d.ops==="OP_IF"),s=I(e,(d,c)=>c>n&&d.ops==="OP_ENDIF")+1,i=e.slice(n,s);if(!i[0]||!i[1]||i[1].s!=="ord")throw new Error("Invalid Ord tx. Prefix not found.");let o,a;if(i.forEach((d,c,l)=>{d.ops==="OP_1"&&(a=l[c+1].s),d.ops==="OP_0"&&(o=l[c+1].b)}),!o)throw new Error("Invalid Ord data.");if(!a)throw new Error("Invalid Ord content type.");b(t,"ORD",{data:o,contentType:a})},B={name:"ORD",handler:lt,scriptChecker:ht};function I(t,e){return gt(t,e)}function gt(t,e,r){const n=t==null?0:t.length;if(!n)return-1;let s=n-1;return mt(t,e,s)}function mt(t,e,r,n){let s=r+1;for(;s--;)if(e(t[s],s,t))return s;return-1}const ne="1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1",pt=[{pair:"json"},{address:"string"},{timestamp:"string"}],yt=({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==ne||!e[1]||!e[2]||!e[3]||!e[1].s||!e[2].s||!e[3].s)throw new Error(`Invalid RON record ${r==null?void 0:r.tx.h}`);const n=JSON.parse(e[1].s),s=Number(e[3].s);b(t,"RON",{pair:n,address:e[2].s,timestamp:s})},bt={name:"RON",address:ne,opReturnSchema:pt,handler:yt},se="1SymRe7erxM46GByucUWnB9fEEMgo7spd",wt=[{url:"string"}],St=({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==se||!e[1]||!e[1].s)throw new Error(`Invalid SymRe tx: ${r}`);b(t,"SYMRE",{url:e[1].s})},Pt={name:"SYMRE",address:se,opReturnSchema:wt,handler:St},oe=new Map([]),ie=new Map([]),ae=new Map([]),ce=new Map,H=[Y,j,G,te,re,k,Ke,Qe,Je,Xe,bt,Pt,B],vt=H.map(t=>t.name),$=[Y,j,G,te,re,B];for(const t of $)t.address&&oe.set(t.address,t.name),ie.set(t.name,t.handler),t.opReturnSchema&&ce.set(t.name,t.opReturnSchema),t.scriptChecker&&ae.set(t.name,t.scriptChecker);class fe{enabledProtocols;protocolHandlers;protocolScriptCheckers;protocolOpReturnSchemas;constructor(){this.enabledProtocols=oe,this.protocolHandlers=ie,this.protocolScriptCheckers=ae,this.protocolOpReturnSchemas=ce}addProtocolHandler({name:e,address:r,opReturnSchema:n,handler:s,scriptChecker:i}){r&&this.enabledProtocols.set(r,e),this.protocolHandlers.set(e,s),n&&this.protocolOpReturnSchemas.set(e,n),i&&this.protocolScriptCheckers.set(e,i)}transformTx=async e=>{if(!e||!e.in||!e.out)throw new Error("Cannot process tx");let r={};for(const[n,s]of Object.entries(e))if(n==="out")for(const i of e.out){const{tape:o}=i;o!=null&&o.some(d=>Pe(d))&&(r=await this.processDataProtocols(o,i,e,r));const a=this.protocolScriptCheckers.get(k.name),f=this.protocolScriptCheckers.get(B.name);if(o!=null&&o.some(d=>{const{cell:c}=d;if(a!=null&&a(c)||f!=null&&f(c))return!0}))for(const d of o){const{cell:c}=d;if(!c)throw new Error("empty cell while parsing");let l="";if(a!=null&&a(c))l=k.name;else if(f!=null&&f(c))l=B.name;else continue;this.process(l,{tx:e,cell:c,dataObj:r,tape:o,out:i})}}else n==="in"?r[n]=s.map(i=>{const o={...i};return delete o.tape,o}):r[n]=s;if(r.METANET&&e.parent){const n={ancestor:e.ancestor,parent:e.parent,child:e.child,head:e.head};r.METANET.push(n),delete r.ancestor,delete r.child,delete r.parent,delete r.head,delete r.node}return r};processUnknown=(e,r,n)=>{e&&!r[e]&&(r[e]=[]),r[e].push({i:n.i,e:n.e,tape:[]})};process=async(e,{cell:r,dataObj:n,tape:s,out:i,tx:o})=>{if(this.protocolHandlers.has(e)&&typeof this.protocolHandlers.get(e)=="function"){const a=this.protocolHandlers.get(e);a&&await a({dataObj:n,cell:r,tape:s,out:i,tx:o})}else b(n,e,r)};processDataProtocols=async(e,r,n,s)=>{var i;for(const o of e){const{cell:a}=o;if(!a)throw new Error("empty cell while parsing");if(K(o))continue;const f=a[0].s;if(f){const d=this.enabledProtocols.get(f)||((i=$.filter(c=>c.name===f)[0])==null?void 0:i.name);d?await this.process(d,{cell:a,dataObj:s,tape:e,out:r,tx:n}):this.processUnknown(f,s,r)}}return s}}const de=async t=>{const e=`https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;return console.log("hitting",e),await(await fetch(e)).text()},ue=async t=>await ye.parse({tx:{r:t},split:[{token:{op:106},include:"l"},{token:{s:"|"}}]}),xt=async(t,e)=>{if(typeof t=="string"){let n;if(t.length===64&&(n=await de(t)),Buffer.from(t).byteLength<=146)throw new Error("Invalid rawTx");n||(n=t);const s=await ue(n);if(s)t=s;else throw new Error("Invalid txid")}const r=new fe;if(e)if(r.enabledProtocols.clear(),we(e))for(const n of H)e!=null&&e.includes(n.name)&&r.addProtocolHandler(n);else if(Se(e))for(const n of e){const s=n;s&&r.addProtocolHandler(s)}else throw new Error("Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).");return r.transformTx(t)};exports.BMAP=fe;exports.TransformTx=xt;exports.allProtocols=H;exports.bobFromRawTx=ue;exports.defaultProtocols=$;exports.fetchRawTx=de;exports.supportedProtocols=vt;
//# sourceMappingURL=bmap.cjs.js.map