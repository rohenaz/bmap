"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const we=require("bpu-ts"),u=require("@bsv/sdk"),N=require("@msgpack/msgpack"),Se=t=>t.length>0&&t.every(e=>typeof e=="string"),Ee=t=>t.length>0&&t.every(e=>e==="object"),w=(t,e)=>{if(t){if(e==="string")return t.s?t.s:t.ls||"";if(e==="hex")return t.h?t.h:t.lh||(t.b?Buffer.from(t.b,"base64").toString("hex"):t.lb&&Buffer.from(t.lb,"base64").toString("hex"))||"";if(e==="number")return Number.parseInt(t.h?t.h:t.lh||"0",16);if(e==="file")return`bitfs://${t.f?t.f:t.lf}`}else throw new Error(`cannot get cell value of: ${t}`);return(t.b?t.b:t.lb)||""},Pe=t=>t.cell.some(e=>e.op===106),Q=t=>{var r;if(t.cell.length!==2)return!1;const e=t.cell.findIndex(n=>n.op===106);return e!==-1?((r=t.cell[e-1])==null?void 0:r.op)===0:!1},m=(t,e,r)=>{t[e]?t[e].push(r):t[e]=[r]},xe=(t,e,r,n,s)=>{const o={},a=e.length+1;if(n.length<a)throw new Error(`${t} requires at least ${a} fields including the prefix: ${s.tx.h}`);for(const[i,d]of Object.entries(e)){const c=Number.parseInt(i,10),[f]=Object.keys(d),[l]=Object.values(d);o[f]=w(n[c+1],l)}m(r,t,o)},Ae=t=>{const e="(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";return new RegExp(`^${e}$`,"gi").test(t)},L="OP_SIZE <OP_X_PLACEHOLDER> OP_PICK OP_SHA256 OP_SWAP OP_SPLIT OP_DROP OP_EQUALVERIFY OP_DROP OP_CHECKSIG".split(" "),Ie=t=>{if(t.length!==12)return!1;const e=[...t].map(s=>s.ops).splice(2,t.length),r=w(t[1],"hex"),n=Buffer.from(r).byteLength;return e[1]=`OP_${n}`,L[1]=`OP_${n}`,e.join()===L.join()},ve=({dataObj:t,cell:e,out:r})=>{if(!e[0]||!r)throw new Error("Invalid 21e8 tx. dataObj, cell, out and tx are required.");const n=w(e[0],"hex"),s=w(e[1],"hex");if(!s)throw new Error(`Invalid 21e8 target. ${JSON.stringify(e[0],null,2)}`);const o=Buffer.from(s,"hex").byteLength,a={target:s,difficulty:o,value:r.e.v,txid:n};m(t,"21E8",a)},$={name:"21E8",handler:ve,scriptChecker:Ie},{toArray:A,toHex:I,fromBase58Check:K,toBase58Check:F}=u.Utils,Y="15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva",Z=[{algorithm:"string"},{address:"string"},{signature:"binary"},[{index:"binary"}]];function Be(t,e,r){if(!Array.isArray(r)||r.length<3)throw new Error("AIP requires at least 3 cells including the prefix");let n=-1;for(let h=0;h<r.length;h++)if(r[h].cell===e){n=h;break}if(n===-1)throw new Error("AIP could not find cell in tape");let s=t.index||[];const o=["6a"];for(let h=0;h<n;h++){const p=r[h];if(!Q(p)){for(const g of p.cell)g.h?o.push(g.h):g.b?o.push(I(A(g.b,"base64"))):g.s&&o.push(I(A(g.s)));o.push("7c")}}if(t.hashing_algorithm&&t.index_unit_size){const h=t.index_unit_size*2;s=[];const p=e[6].h;for(let g=0;g<p.length;g+=h)s.push(Number.parseInt(p.substr(g,h),16));t.index=s}const a=[];if(s.length>0)for(const h of s){if(h>=o.length)return console.log("[validateSignature] Index out of bounds:",h),!1;a.push(A(o[h],"hex"))}else for(const h of o)a.push(A(h,"hex"));let i;if(t.hashing_algorithm){t.index_unit_size||a.shift();const h=u.Script.fromHex(I(a.flat()));let p=A(h.toHex(),"hex");t.index_unit_size&&(p=p.slice(1)),i=u.Hash.sha256(p)}else i=a.flat();const d=t.address||t.signing_address;if(!d||!t.signature)return!1;let c;try{c=u.Signature.fromCompact(t.signature,"base64")}catch(h){return console.log("[validateSignature] Failed to parse signature:",h),!1}const f=()=>{try{const h=u.BSM.magicHash(i),p=q(h);for(let g=0;g<4;g++)try{const y=c.RecoverPublicKey(g,p),S=y.toHash(),{prefix:E}=K(d);if(F(S,E)===d)return u.BSM.verify(i,c,y)}catch(y){console.log("[tryNormalLogic] Recovery error:",y)}}catch(h){console.log("[tryNormalLogic] error:",h)}return!1},l=()=>{if(a.length<=2)return!1;try{const h=a.slice(1,-1),p=u.Hash.sha256(h.flat()),g=I(p),y=A(g,"utf8"),S=u.BSM.magicHash(y),E=q(S);for(let P=0;P<4;P++)try{const x=c.RecoverPublicKey(P,E),H=x.toHash(),{prefix:M}=K(d);if(F(H,M)===d)return u.BSM.verify(y,c,x)}catch(x){console.log("[tryTwetchLogic] Recovery error:",x)}}catch(h){console.log("[tryTwetchLogic] error:",h)}return!1};let b=f();return b||(b=l()),t.verified=b,b}function q(t){const e=I(t);return new u.BigNumber(e,16)}var J=(t=>(t.HAIP="HAIP",t.AIP="AIP",t.BITCOM_HASHED="BITCOM_HASHED",t.PSP="PSP",t))(J||{});const D=async(t,e,r,n,s)=>{const o={};if(n.length<4)throw new Error("AIP requires at least 4 fields including the prefix");for(const[a,i]of Object.entries(t)){const d=Number.parseInt(a,10);if(Array.isArray(i)){const[c]=Object.keys(i[0]),f=[];for(let l=d+1;l<n.length;l++)n[l].h&&Array.isArray(f)&&f.push(Number.parseInt(n[l].h||"",16));o[c]=f}else{const[c]=Object.keys(i),[f]=Object.values(i);o[c]=w(n[d+1],f)||""}}if(n[0].s===Y&&n[3].s&&Ae(n[3].s)&&(o.signature=n[3].s),!o.signature)throw new Error("AIP requires a signature");return Be(o,n,s),m(r,e,o),{dataObj:r,cell:n,tape:s}},He=async({dataObj:t,cell:e,tape:r})=>{if(!r)throw new Error("Invalid AIP transaction. tape is required");return D(Z,"AIP",t,e,r)},W={name:"AIP",address:Y,opReturnSchema:Z,handler:He},Me="19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",k=[{content:["string","binary","file"]},{"content-type":"string"},{encoding:"string"},{filename:"string"}],Te=({dataObj:t,cell:e,tx:r})=>{var o;const n=new Map;if(n.set("utf8","string"),n.set("text","string"),n.set("gzip","binary"),n.set("text/plain","string"),n.set("image/png","binary"),n.set("image/jpeg","binary"),!e[1]||!e[2])throw new Error(`Invalid B tx: ${r}`);if(e.length>k.length+1)throw new Error("Invalid B tx. Too many fields.");const s={};for(const[a,i]of Object.entries(k)){const d=Number.parseInt(a,10),c=Object.keys(i)[0];let f=Object.values(i)[0];if(c==="content")if(e[1].f)f="file";else if((!e[3]||!e[3].s)&&e[2].s){if(f=n.get(e[2].s),!f){console.warn("Problem inferring encoding. Malformed B data.",e);return}e[3]||(e[3]={h:"",b:"",s:"",i:0,ii:0}),e[3].s=f==="string"?"utf-8":"binary"}else f=(o=e[3])!=null&&o.s?n.get(e[3].s.replace("-","").toLowerCase()):null;if(c==="encoding"&&!e[d+1]||c==="filename"&&!e[d+1])continue;if(!e||!e[d+1])throw new Error(`malformed B syntax ${e}`);const l=e[d+1];s[c]=w(l,f)}m(t,"B",s)},j={name:"B",address:Me,opReturnSchema:k,handler:Te},Re="1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT",G=[{type:"string"},{hash:"string"},{sequence:"string"}],$e=async({dataObj:t,cell:e,tx:r})=>{if(!r)throw new Error("Invalid BAP tx, tx required");xe("BAP",G,t,e,r)},X={name:"BAP",address:Re,opReturnSchema:G,handler:$e},ke="$",Oe=[{su:[{pubkey:"string"},{sign_position:"string"},{signature:"string"}],echo:[{data:"string"},{to:"string"},{filename:"string"}],route:[[{add:[{bitcom_address:"string"},{route_matcher:"string"},{endpoint_template:"string"}]},{enable:[{path:"string"}]}]],useradd:[{address:"string"}]}],Ce=({dataObj:t,cell:e})=>{if(!e.length||!e.every(n=>n.s))throw new Error("Invalid Bitcom tx");const r=e.map(n=>n!=null&&n.s?n.s:"");m(t,"BITCOM",r)},_e={name:"BITCOM",address:ke,opReturnSchema:Oe,handler:Ce},{toArray:U,toBase58Check:R,toHex:Ne}=u.Utils,{magicHash:Le}=u.BSM,ee="13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC",te=[{bitkey_signature:"string"},{user_signature:"string"},{paymail:"string"},{pubkey:"string"}];function Ke(t){const e=Ne(t);return new u.BigNumber(e,16)}function V(t,e){const r=Le(t),n=Ke(r);for(let s=0;s<4;s++)try{const o=e.RecoverPublicKey(s,n);if(u.BSM.verify(t,e,o))return o}catch{}throw new Error("Failed to recover public key from BSM signature")}const Fe=async({dataObj:t,cell:e})=>{if(e.length<5)throw new Error("Invalid Bitkey tx");const r={};for(const[M,T]of Object.entries(te)){const me=Number.parseInt(M,10),ye=Object.keys(T)[0],be=Object.values(T)[0];r[ye]=w(e[me+1],be)}const n=r.pubkey,o=u.PublicKey.fromString(n).toHash(),a=R(o),d=Buffer.from(r.paymail).toString("hex")+n,c=Buffer.from(d,"hex"),f=u.Hash.sha256(U(c)),l=u.Signature.fromCompact(r.bitkey_signature,"base64"),b=V(f,l),h=b.toHash(),p=R(h),g=u.BSM.verify(f,l,b)&&p===ee,y=U(Buffer.from(n,"utf8")),S=u.Signature.fromCompact(r.user_signature,"base64"),E=V(y,S),P=E.toHash(),x=R(P),H=u.BSM.verify(y,S,E)&&x===a;r.verified=g&&H,m(t,"BITKEY",r)},qe={name:"BITKEY",address:ee,opReturnSchema:te,handler:Fe},{magicHash:Ue}=u.BSM,{toArray:Ve}=u.Utils,re="18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p",ze=[{paymail:"string"},{pubkey:"binary"},{signature:"string"}],Qe=async({dataObj:t,cell:e,tape:r,tx:n})=>{if(e[0].s!==re||!e[1]||!e[2]||!e[3]||!e[1].s||!e[2].b||!e[3].s||!r)throw new Error(`Invalid BITPIC record: ${n}`);const s={paymail:e[1].s,pubkey:Buffer.from(e[2].b,"base64").toString("hex"),signature:e[3].s||"",verified:!1};if(r[1].cell[0].s==="19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut")try{const a=e[1].lb||e[1].b,i=u.Hash.sha256(Ve(a,"base64")),d=u.Signature.fromCompact(s.signature,"base64"),c=u.PublicKey.fromString(s.pubkey),f=Ue(i);s.verified=u.BSM.verify(f,d,c)}catch{s.verified=!1}m(t,"BITPIC",s)},Ye={name:"BITPIC",address:re,opReturnSchema:ze,handler:Qe},Ze="1HA1P2exomAwCUycZHr8WeyFoy5vuQASE3",ne=[{algorithm:"string"},{algorithm:"string"},{address:"string"},{signature:"string"},{algorithm:"string"},[{index:"binary"}]],Je=async({dataObj:t,cell:e,tape:r,tx:n})=>{if(!r)throw new Error("Invalid HAIP tx. Bad tape");if(!n)throw new Error("Invalid HAIP tx.");return await D(ne,J.HAIP,t,e,r)},De={name:"HAIP",address:Ze,opReturnSchema:ne,handler:Je},O="1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5",se=[{SET:"string"},{SELECT:"string"},{ADD:"string"},{DELETE:"string"},{JSON:"string"},{REMOVE:"string"},{CLEAR:"string"}],We=(t,e)=>{let r=null;for(const n of t){if(n.i===0||n.i===1)continue;const s=n.s;n.i===2?(e[s]=[],r=s):r&&Array.isArray(e[r])&&e[r].push(s)}},je=(t,e)=>{let r=null;for(const n of t){if(n.i===0||n.i===1)continue;const s=n.s;n.i===2?(e[s]=[],r=s):r&&e[r].push(s)}},Ge=(t,e)=>{for(const r of t)if(r.i===0||r.i===1){e.SELECT="TODO";continue}},Xe=(t,e)=>{for(const r of t)if(!(r.i===0||r.i===1)&&r.i===2)try{if(!N.decode)throw new Error("Msgpack is required but not loaded");const n=Buffer.from(r.b,"base64");e=N.decode(n)}catch{e={}}return e},et=(t,e)=>{for(const r of t)if(!(r.i===0||r.i===1)&&r.i===2)try{e=JSON.parse(r.s)}catch{e={}}return e},tt=(t,e)=>{let r=null;for(const n of t){if(!n.s||n.i===0||n.i===1)return;const s=n.s;if(n.i%2===0)s==="collection"?(e.collection="",r="collection"):(e[s]="",r=s);else{if(!r)throw new Error(`malformed MAP syntax. Cannot parse.${r}`);e[r]=s}}},rt=async({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==O||!e[1]||!e[1].s||!e[2]||!e[2].s)throw new Error(`Invalid MAP record: ${r}`);let n={};const s=[];let o=0;for(let i=1;i<e.length;i++)e[i].s===":::"?o++:(s[o]||(s[o]=[]),e[i].i=s[o].length+1,s[o].push(e[i]));const a=Object.keys(se[0])[0];n[a]=s[0][0].s;for(const i of s)switch(i.unshift({s:O,i:0}),i[1].s){case"ADD":{We(i,n);break}case"REMOVE":{n.key=i[2].s;break}case"DELETE":{je(i,n);break}case"CLEAR":break;case"SELECT":{Ge(i,n);break}case"MSGPACK":{n=Xe(i,n);break}case"JSON":{n=et(i,n);break}case"SET":{tt(i,n);break}}m(t,"MAP",n)},oe={name:"MAP",address:O,opReturnSchema:se,handler:rt},{toArray:nt,toHex:st}=u.Utils,ot="meta",it=[{address:"string"},{parent:"string"},{name:"string"}],z=async(t,e)=>{const r=Buffer.from(t+e),n=u.Hash.sha256(nt(r));return st(n)},at=async({dataObj:t,cell:e,tx:r})=>{if(!e.length||e[0].s!=="meta"||!e[1]||!e[1].s||!e[2]||!e[2].s||!r)throw new Error(`Invalid Metanet tx ${r}`);const n=await z(e[1].s,r.tx.h),s={a:e[1].s,tx:r.tx.h,id:n};let o={a:"",tx:"",id:""};if(r.in){const a=await z(r.in[0].e.a,e[2].s);o={a:r.in[0].e.a,tx:e[2].s,id:a}}t.METANET||(t.METANET=[]),t.METANET.push({node:s,parent:o})},ie={name:"METANET",address:ot,opReturnSchema:it,handler:at},ct=t=>{if(t.length<13)return!1;const e=B(t,o=>o.ops==="OP_IF"),r=B(t,(o,a)=>a>e&&o.ops==="OP_ENDIF"),n=t.slice(e,r),s=t[e-1];return(s==null?void 0:s.op)===0&&!!n[0]&&!!n[1]&&n[1].s==="ord"},ft=({dataObj:t,cell:e,out:r})=>{if(!e[0]||!r)throw new Error("Invalid Ord tx. dataObj, cell, out and tx are required.");const n=B(e,c=>c.ops==="OP_IF"),s=B(e,(c,f)=>f>n&&c.ops==="OP_ENDIF")+1,o=e.slice(n,s);if(!o[0]||!o[1]||o[1].s!=="ord")throw new Error("Invalid Ord tx. Prefix not found.");let a,i;if(o.forEach((c,f,l)=>{c.ops==="OP_1"&&(i=l[f+1].s),c.ops==="OP_0"&&(a=l[f+1].b)}),!a)throw new Error("Invalid Ord data.");if(!i)throw new Error("Invalid Ord content type.");m(t,"ORD",{data:a,contentType:i})},v={name:"ORD",handler:ft,scriptChecker:ct};function B(t,e){return dt(t,e)}function dt(t,e,r){const n=t==null?0:t.length;if(!n)return-1;let s=n-1;return ht(t,e,s)}function ht(t,e,r,n){let s=r+1;for(;s--;)if(e(t[s],s,t))return s;return-1}const ae="1GvFYzwtFix3qSAZhESQVTz9DeudHZNoh1",ut=[{pair:"json"},{address:"string"},{timestamp:"string"}],lt=({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==ae||!e[1]||!e[2]||!e[3]||!e[1].s||!e[2].s||!e[3].s)throw new Error(`Invalid RON record ${r==null?void 0:r.tx.h}`);const n=JSON.parse(e[1].s),s=Number(e[3].s);m(t,"RON",{pair:n,address:e[2].s,timestamp:s})},gt={name:"RON",address:ae,opReturnSchema:ut,handler:lt},ce="1SymRe7erxM46GByucUWnB9fEEMgo7spd",pt=[{url:"string"}],mt=({dataObj:t,cell:e,tx:r})=>{if(e[0].s!==ce||!e[1]||!e[1].s)throw new Error(`Invalid SymRe tx: ${r}`);m(t,"SYMRE",{url:e[1].s})},yt={name:"SYMRE",address:ce,opReturnSchema:pt,handler:mt},fe=new Map([]),de=new Map([]),he=new Map([]),ue=new Map,C=[W,j,X,oe,ie,$,_e,qe,Ye,De,gt,yt,v],bt=C.map(t=>t.name),_=[W,j,X,oe,ie,v];for(const t of _)t.address&&fe.set(t.address,t.name),de.set(t.name,t.handler),t.opReturnSchema&&ue.set(t.name,t.opReturnSchema),t.scriptChecker&&he.set(t.name,t.scriptChecker);class le{enabledProtocols;protocolHandlers;protocolScriptCheckers;protocolOpReturnSchemas;constructor(){this.enabledProtocols=fe,this.protocolHandlers=de,this.protocolScriptCheckers=he,this.protocolOpReturnSchemas=ue}addProtocolHandler({name:e,address:r,opReturnSchema:n,handler:s,scriptChecker:o}){r&&this.enabledProtocols.set(r,e),this.protocolHandlers.set(e,s),n&&this.protocolOpReturnSchemas.set(e,n),o&&this.protocolScriptCheckers.set(e,o)}transformTx=async e=>{if(!e||!e.in||!e.out)throw new Error("Cannot process tx");let r={};for(const[n,s]of Object.entries(e))if(n==="out")for(const o of e.out){const{tape:a}=o;a!=null&&a.some(c=>Pe(c))&&(r=await this.processDataProtocols(a,o,e,r));const i=this.protocolScriptCheckers.get($.name),d=this.protocolScriptCheckers.get(v.name);if(a!=null&&a.some(c=>{const{cell:f}=c;if(i!=null&&i(f)||d!=null&&d(f))return!0}))for(const c of a){const{cell:f}=c;if(!f)throw new Error("empty cell while parsing");let l="";if(i!=null&&i(f))l=$.name;else if(d!=null&&d(f))l=v.name;else continue;this.process(l,{tx:e,cell:f,dataObj:r,tape:a,out:o})}}else n==="in"?r[n]=s.map(o=>{const a={...o};return delete a.tape,a}):r[n]=s;if(r.METANET&&e.parent){const n={ancestor:e.ancestor,parent:e.parent,child:e.child,head:e.head};r.METANET.push(n),delete r.ancestor,delete r.child,delete r.parent,delete r.head,delete r.node}return r};processUnknown=(e,r,n)=>{e&&!r[e]&&(r[e]=[]),r[e].push({i:n.i,e:n.e,tape:[]})};process=async(e,{cell:r,dataObj:n,tape:s,out:o,tx:a})=>{if(this.protocolHandlers.has(e)&&typeof this.protocolHandlers.get(e)=="function"){const i=this.protocolHandlers.get(e);i&&await i({dataObj:n,cell:r,tape:s,out:o,tx:a})}else m(n,e,r)};processDataProtocols=async(e,r,n,s)=>{var o;for(const a of e){const{cell:i}=a;if(!i)throw new Error("empty cell while parsing");if(Q(a))continue;const d=i[0].s;if(d){const c=this.enabledProtocols.get(d)||((o=_.filter(f=>f.name===d)[0])==null?void 0:o.name);c?await this.process(c,{cell:i,dataObj:s,tape:e,out:r,tx:n}):this.processUnknown(d,s,r)}}return s}}const ge=async t=>{const e=`https://api.whatsonchain.com/v1/bsv/main/tx/${t}/hex`;return console.log("hitting",e),await(await fetch(e)).text()},pe=async t=>await we.parse({tx:{r:t},split:[{token:{op:106},include:"l"},{token:{s:"|"}}]}),wt=async(t,e)=>{if(typeof t=="string"){let n;if(t.length===64&&(n=await ge(t)),Buffer.from(t).byteLength<=146)throw new Error("Invalid rawTx");n||(n=t);const s=await pe(n);if(s)t=s;else throw new Error("Invalid txid")}const r=new le;if(e)if(r.enabledProtocols.clear(),Se(e))for(const n of C)e!=null&&e.includes(n.name)&&r.addProtocolHandler(n);else if(Ee(e))for(const n of e){const s=n;s&&r.addProtocolHandler(s)}else throw new Error("Invalid protocol array. Must be either an array of protocol names (string[]), or Protocol objects (Protocol[]).");return r.transformTx(t)};exports.BMAP=le;exports.TransformTx=wt;exports.allProtocols=C;exports.bobFromRawTx=pe;exports.defaultProtocols=_;exports.fetchRawTx=ge;exports.supportedProtocols=bt;
//# sourceMappingURL=bmap.cjs.js.map
