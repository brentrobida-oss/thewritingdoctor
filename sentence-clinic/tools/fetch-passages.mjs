#!/usr/bin/env node
/* Fetch the public-domain Q2 passages named in library.js from their sources and write the text into a
   JSON file for review, then (with --apply) into library.js. Needs network access to the source hosts:
   founders.archives.gov, mkgandhi.org, 1997-2001.state.gov, reaganlibrary.gov, obamawhitehouse.archives.gov.
   Run from the repository root:  node sentence-clinic/tools/fetch-passages.mjs [--apply]
   Review the JSON before applying: trim each text to the portion the exam printed (see the exam_excerpt notes). */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { htmlToParagraphs, between } = require('./html-text.js');

const LIB_PATH = new URL('../library.js', import.meta.url);
const OUT = new URL('./passages.fetched.json', import.meta.url);
const sandbox = {};
new Function('self', readFileSync(LIB_PATH, 'utf8'))(sandbox);
const lib = sandbox.APLibrary;

/* Anchors: the first words and last words of the exam's excerpt where known, so the cut lands near it. Adjust by hand after reading. */
const ANCHORS = {
  2014: ['My dear Son', 'Your ever affectionate Mother'],
  2018: [null, null],
  2019: ['Dear Friend', 'Your sincere friend'],
  2021: ['Thank you', null]
};

const apply = process.argv.includes('--apply');
const results = [];
for (const p of lib.passages) {
  if (p.pd !== true || !p.text_source) continue;
  const entry = { year: p.year, author: p.author, source: p.text_source, ok: false, text: null, note: '' };
  try {
    const res = await fetch(p.text_source, { headers: { 'user-agent': 'Mozilla/5.0 (Sentence Clinic passage fetch)' } });
    entry.status = res.status;
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    const paras = htmlToParagraphs(html);
    const [a, b] = ANCHORS[p.year] || [null, null];
    const kept = between(paras, a, b).filter(x => x.split(/\s+/).length >= 3);
    entry.text = kept.join('\n\n');
    entry.words = entry.text.split(/\s+/).length;
    entry.ok = entry.words > 80;
    entry.note = entry.ok ? 'Review and trim to the exam excerpt.' : 'Too little text extracted; open the source and paste by hand.';
  } catch (e) { entry.note = 'Fetch failed: ' + e.message; }
  results.push(entry);
  console.log(`${entry.ok ? 'ok  ' : 'FAIL'} ${p.year} ${p.author}: ${entry.words || 0} words ${entry.note}`);
}
writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log('wrote', OUT.pathname);

if (apply) {
  let src = readFileSync(LIB_PATH, 'utf8');
  let n = 0;
  for (const r of results) {
    if (!r.ok) continue;
    // Replace `text: null` on the matching passage line (same year and author).
    const re = new RegExp(`(\\{ year: ${r.year}, author: ${JSON.stringify(r.author).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}[^\\n]*?text: )null`);
    if (re.test(src)) { src = src.replace(re, `$1${JSON.stringify(r.text)}`); n++; }
  }
  writeFileSync(LIB_PATH, src);
  console.log(`applied ${n} passage text${n === 1 ? '' : 's'} to library.js`);
}
