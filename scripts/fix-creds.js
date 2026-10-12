const fs=require('fs');
let txt=fs.readFileSync('src/content/site-content.ts','utf8');
// Remove cred-003 and cred-004 blocks
txt = txt.replace(/,\s*\{\s*id: "cred-003"[\s\S]*?linkedin\.com\/in\/joshivan"[\s\S]*?},/,'');
let txt2 = txt.replace(/\{\s*id: "cred-003"[\s\S]*?linkedin\.com\/in\/joshivan"[\s\S]*?\},\s*\n\];/,'\n];');
if(txt2 !== txt) txt = txt2;
else {
  // alternative: just filter by removing those two objects via simple replace
  txt = txt.replace(/{\s*id: "cred-003"[^}]*}[^}]*},?\s*/g,'');
  txt = txt.replace(/{\s*id: "cred-004"[^}]*}[^}]*},?\s*/g,'');
  // clean double commas
  txt = txt.replace(/,\s*,/g,',');
  txt = txt.replace(/,\s*\n\];/,'\n];');
}
fs.writeFileSync('src/content/site-content.ts', txt);
console.log('done');
console.log(txt.includes('cred-003'), txt.includes('cred-004'));
