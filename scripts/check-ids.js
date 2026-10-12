const fs=require('fs');
const txt=fs.readFileSync('src/content/site-content.ts','utf8');
const eng=[...txt.matchAll(/id: "eng-\d+"/g)].map(m=>m[0]);
const dec=[...txt.matchAll(/id: "dec-\d+"/g)].map(m=>m[0]);
console.log('eng',eng);
console.log('dec',dec);
const sys=[...txt.matchAll(/id: "sys-\d+"/g)].map(m=>m[0]);
console.log('sys',sys);
