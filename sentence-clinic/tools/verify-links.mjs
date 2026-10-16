#!/usr/bin/env node
/* HEAD every College Board link in library.js and report status and content type. Needs network access to
   apcentral.collegeboard.org and secure-media.collegeboard.org.  node sentence-clinic/tools/verify-links.mjs */
import { readFileSync } from 'node:fs';
const sandbox = {};
new Function('self', readFileSync(new URL('../library.js', import.meta.url), 'utf8'))(sandbox);
const lib = sandbox.APLibrary;
const links = [];
for (const [year, qs] of Object.entries(lib.years)) for (const q of ['q1', 'q2', 'q3']) for (const u of (qs[q] || {}).urls || []) links.push({ year, q, ...u });
let ok = 0, bad = 0;
for (const l of links) {
  try {
    const res = await fetch(l.url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (Sentence Clinic link check)' } });
    const type = res.headers.get('content-type') || '';
    const good = res.ok && /pdf|html/.test(type);
    good ? ok++ : bad++;
    console.log(`${good ? 'ok  ' : 'BAD '} ${res.status} ${type.split(';')[0].padEnd(16)} ${l.year} ${l.q} ${l.label}  ${l.url}`);
  } catch (e) { bad++; console.log(`ERR  ${l.year} ${l.q} ${l.label}  ${l.url}  ${e.message}`); }
}
console.log(`\n${ok} ok, ${bad} bad of ${links.length}`);
process.exit(bad ? 1 : 0);
