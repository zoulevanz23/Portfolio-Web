import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

function resolveWorkerSrc() {
  try {
    const require = createRequire(import.meta.url);
    return pathToFileURL(require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs")).href;
  } catch {
    return undefined;
  }
}

const workerSrc = resolveWorkerSrc();
if (workerSrc) {
  GlobalWorkerOptions.workerSrc = workerSrc;
}

const inputFile = process.argv[2];
const buffer = readFileSync(inputFile);
const data = new Uint8Array(buffer);

let doc;
  try {
  doc = await getDocument({ data, isEvalSupported: false, disableFontFace: true }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    let lastY;
    let line = "";
    for (const item of tc.items) {
      const y = item.transform ? item.transform[5] : undefined;
      if (line && y !== undefined && lastY !== undefined && y !== lastY) {
        text += line + "\n";
        line = "";
      }
      line += item.str;
      lastY = y;
    }
    if (line) text += line + "\n";
    text += "\n\n";
  }
  if (typeof doc.destroy === "function") {
    try { await doc.destroy(); } catch {}
  }
  console.log(JSON.stringify({ ok: true, numpages: doc.numPages, text }));
} catch (err) {
  console.log(JSON.stringify({ ok: false, error: (err && err.message) || String(err) }));
} finally {
  process.exit(0);
}
