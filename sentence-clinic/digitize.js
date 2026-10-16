/* Digitize: turn photographed or scanned student writing into text, on the device.
   Images go through Tesseract.js (open-source OCR compiled to WebAssembly, loaded on first use);
   PDF pages are drawn to a canvas with pdf.js and then read the same way. Nothing is uploaded:
   the engine downloads once from a CDN and runs in the browser. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Digitize = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const TESSERACT = [
    'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js',
    'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'
  ];
  const PDFJS = [
    { lib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs', worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs' },
    { lib: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs', worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs' }
  ];

  /* OCR output arrives one line per visual line. Rebuild paragraphs: a blank line, an indented line,
     or a line that ends a sentence and is followed by a short-started line begins a new paragraph;
     a word split by a hyphen at a line end is rejoined; stray marks the engine invents are dropped. */
  function cleanOcr(raw) {
    if (!raw) return '';
    const lines = String(raw).replace(/\r/g, '').split('\n');
    const paras = [];
    let cur = '';
    const push = () => { const t = cur.replace(/\s+/g, ' ').trim(); if (t) paras.push(t); cur = ''; };
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].replace(/[|¦]+/g, ' ').replace(/[ \t]+/g, ' ').replace(/\s+$/, '');
      const stripped = line.trim();
      if (!stripped) { push(); continue; }
      const indented = /^\s{2,}/.test(line) && cur;
      if (indented) push();
      if (cur && /-$/.test(cur) && /^[a-z]/.test(stripped)) cur = cur.replace(/-$/, '') + stripped;
      else cur = cur ? cur + ' ' + stripped : stripped;
      const next = (lines[i + 1] || '').trim();
      const shortLine = stripped.length < 40;
      if (shortLine && /[.!?]["'”’)]?$/.test(stripped) && next && /^[A-Z"“]/.test(next)) push();
    }
    push();
    return paras.join('\n').replace(/ /g, ' ');
  }

  function scriptLoaded(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => resolve(src);
      s.onerror = () => { s.remove(); reject(new Error('could not load ' + src)); };
      document.head.appendChild(s);
    });
  }
  async function firstThatLoads(urls) {
    let err;
    for (const u of urls) { try { return await scriptLoaded(u); } catch (e) { err = e; } }
    throw err || new Error('no source reachable');
  }

  let tesseractReady = null;
  function tesseract() {
    if (root_().Tesseract) return Promise.resolve(root_().Tesseract);
    if (!tesseractReady) tesseractReady = firstThatLoads(TESSERACT).then(() => root_().Tesseract);
    return tesseractReady;
  }
  function root_() { return typeof self !== 'undefined' ? self : globalThis; }

  let pdfReady = null;
  function pdfjs() {
    if (root_().pdfjsLib) return Promise.resolve(root_().pdfjsLib);
    if (!pdfReady) {
      pdfReady = (async () => {
        let err;
        for (const c of PDFJS) {
          try {
            const mod = await import(/* webpackIgnore: true */ c.lib);
            const lib = mod.default && mod.default.getDocument ? mod.default : mod;
            lib.GlobalWorkerOptions.workerSrc = c.worker;
            return lib;
          } catch (e) { err = e; }
        }
        throw err || new Error('pdf.js unreachable');
      })();
    }
    return pdfReady;
  }

  async function pdfToImages(file, onProgress) {
    const lib = await pdfjs();
    const data = new Uint8Array(await file.arrayBuffer());
    const doc = await lib.getDocument({ data }).promise;
    const out = [];
    for (let n = 1; n <= doc.numPages; n++) {
      if (onProgress) onProgress({ stage: 'render', page: n, pages: doc.numPages });
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      out.push({ blob, name: `${file.name} p.${n}` });
    }
    return out;
  }

  async function recognizeAll(items, onProgress) {
    const T = await tesseract();
    const worker = await T.createWorker('eng', 1, {
      logger: m => { if (onProgress && m.status === 'recognizing text') onProgress({ stage: 'read', progress: m.progress }); }
    });
    const pages = [];
    try {
      for (let i = 0; i < items.length; i++) {
        if (onProgress) onProgress({ stage: 'page', page: i + 1, pages: items.length, name: items[i].name });
        const r = await worker.recognize(items[i].blob);
        pages.push({ name: items[i].name, text: cleanOcr(r.data.text), confidence: Math.round(r.data.confidence || 0) });
      }
    } finally { await worker.terminate(); }
    return pages;
  }

  /* files: FileList or array of File. Returns { text, pages, confidence, low }. */
  async function digitizeFiles(files, onProgress) {
    const items = [];
    for (const f of Array.from(files)) {
      if (/pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)) items.push(...await pdfToImages(f, onProgress));
      else items.push({ blob: f, name: f.name });
    }
    if (!items.length) return { text: '', pages: [], confidence: 0, low: false };
    const pages = await recognizeAll(items, onProgress);
    const text = pages.map(p => p.text).filter(Boolean).join('\n');
    const confidence = Math.round(pages.reduce((a, p) => a + p.confidence, 0) / pages.length);
    return { text, pages, confidence, low: confidence < 70 };
  }

  function summary(result) {
    const n = result.pages.length;
    if (!n) return 'Nothing readable in that file.';
    const where = n === 1 ? 'one page' : `${n} pages`;
    const conf = `${result.confidence}% confidence`;
    return result.low
      ? `Digitized ${where} at ${conf}: handwriting is hard for the engine, so read it against the page before scoring.`
      : `Digitized ${where} at ${conf}. Check names and quotations, then read.`;
  }

  return { cleanOcr, digitizeFiles, summary, TESSERACT, PDFJS };
});
