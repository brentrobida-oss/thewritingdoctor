#!/usr/bin/env node
/* Second network pass for the Sentence Clinic, meant for a machine that can reach College Board and
   the passage archives (the build sandbox cannot). It
     1. probes candidate College Board URLs for the 2014 to 2022 free-response files (the current
        past-exam index lists only 2023 onward), politely: one request at a time, a pause between
        them, and a long wait after a 429;
     2. downloads every real PDF it finds into ./pdfs for pdftotext;
     3. fetches the public-domain Q2 passages from archives that serve plain HTML or PDF, saving PDFs
        into ./pdfs and HTML as paragraphs;
     4. writes netcheck2.json and prints it once more as a single base64 line between markers, so the
        result survives a CI log that prefixes every line.
   Run from the repository root:  node sentence-clinic/tools/netcheck2.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { htmlToParagraphs } = require('./html-text.js');

const UA = { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) Sentence Clinic link check', accept: '*/*' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
mkdirSync('pdfs', { recursive: true });

async function get(url, attempt = 0) {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow' });
    if (res.status === 429 && attempt < 3) { await sleep([15000, 45000, 90000][attempt]); return get(url, attempt + 1); }
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, type: (res.headers.get('content-type') || '').split(';')[0], final: res.url, buf };
  } catch (e) { return { status: 0, type: '', final: url, buf: Buffer.alloc(0), error: e.message }; }
}
const isPdf = buf => buf.subarray(0, 5).toString('latin1') === '%PDF-';

/* ---- 1. College Board candidates */
const CB = 'https://apcentral.collegeboard.org/media/pdf/';
const candidates = [];
for (let y = 14; y <= 22; y++) {
  const yy = String(y);
  for (const f of [
    `ap${yy}-frq-english-language.pdf`,
    `ap${yy}-sg-english-language.pdf`,
    `ap${yy}-english-language-scoring-guidelines.pdf`,
    `ap${yy}-apc-english-language-q1.pdf`, `ap${yy}-apc-english-language-q2.pdf`, `ap${yy}-apc-english-language-q3.pdf`,
    `ap${yy}-english-language-q1.pdf`, `ap${yy}-english-language-q2.pdf`, `ap${yy}-english-language-q3.pdf`,
    `ap${yy}-chief-reader-report-english-language.pdf`, `ap${yy}-cr-report-english-language.pdf`,
    `ap${yy}-english-language-score-distributions.pdf`
  ]) candidates.push({ year: 2000 + y, url: CB + f });
}
for (const form of ['kennedy', 'obama', 'johnson']) {
  for (const f of [
    `ap20-english-language-and-composition-frq-${form}.pdf`,
    `ap20-english-language-and-composition-question-${form}.pdf`,
    `ap20-english-language-and-composition-student-samples-${form}.pdf`,
    `ap20-english-language-and-composition-scoring-commentary-${form}.pdf`
  ]) candidates.push({ year: 2020, url: CB + f });
}
for (const f of ['ap20-english-language-and-composition-scoring-guidelines-I1-kennedy.pdf', 'ap20-english-language-and-composition-scoring-guidelines-I2-obama.pdf', 'ap20-english-language-and-composition-scoring-guidelines-D2-johnson.pdf', 'ap-2020exam-sample-questions-english-language-and-composition.pdf']) candidates.push({ year: 2020, url: CB + f });
/* older hosts, for the record */
for (const u of [
  'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap14_frq_english_language.pdf',
  'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap15_frq_english_language.pdf',
  'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap16_frq_english_language.pdf',
  'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-english-language-and-composition-frq-2017.pdf',
  'https://apcentral.collegeboard.org/pdf/ap18-frq-english-language.pdf',
  'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf'
]) candidates.push({ year: Number('20' + (u.match(/ap(\d\d)[_-]/) || [, '00'])[1]) || (u.includes('2017') ? 2017 : 0), url: u });

const probe = [];
for (const c of candidates) {
  const r = await get(c.url);
  const pdf = isPdf(r.buf);
  const name = 'pdfs/' + c.url.split('/').pop().replace(/[^A-Za-z0-9._-]/g, '_');
  if (pdf) writeFileSync(name, r.buf);
  probe.push({ year: c.year, url: c.url, status: r.status, type: r.type, pdf, bytes: r.buf.length, final: r.final !== c.url ? r.final : undefined, file: pdf ? name : undefined });
  console.log(`${pdf ? 'PDF ' : '    '} ${String(r.status).padEnd(3)} ${r.type.padEnd(16)} ${c.year} ${c.url}`);
  await sleep(1500);
}

/* ---- 3. public-domain passage sources */
const SOURCES = [
  { year: 2014, author: 'Abigail Adams', url: 'https://www.masshist.org/publications/adams-papers/index.php/view/ADMS-04-03-02-0207' },
  { year: 2014, author: 'Abigail Adams', url: 'https://www.masshist.org/publications/adams-papers/view/AFC03p268' },
  { year: 2018, author: 'Madeleine Albright', url: 'https://1997-2001.state.gov/statements/970525.html' },
  { year: 2019, author: 'Mohandas K. Gandhi', url: 'https://k12.hillsdale.edu/k12/media/Resources/Documents/Upper%20School/History/04-Letter-to-Lord-Irwin-Gandhi.pdf' },
  { year: 2019, author: 'Mohandas K. Gandhi', url: 'https://leaf.bucknell.edu/node/3355' },
  { year: 2020, author: 'Ronald Reagan', url: 'https://www.presidency.ucsb.edu/node/259397' },
  { year: 2020, author: 'Ronald Reagan', url: 'https://www.jfklibrary.org/about-us/about-the-jfk-library/history/1985-tribute-by-president-reagan' },
  { year: 2020, author: 'Barack Obama', url: 'https://obamawhitehouse.archives.gov/node/4149' },
  { year: 2021, author: 'Barack Obama', url: 'https://obamawhitehouse.archives.gov/the-press-office/2013/02/27/remarks-president-dedication-statue-honoring-rosa-parks-us-capitol' }
];
const passages = [];
for (const s of SOURCES) {
  const r = await get(s.url);
  const entry = { ...s, status: r.status, type: r.type, final: r.final };
  if (isPdf(r.buf)) {
    entry.file = 'pdfs/passage-' + s.year + '-' + s.author.split(' ').pop().toLowerCase() + '.pdf';
    writeFileSync(entry.file, r.buf);
  } else if (r.status === 200) {
    const paras = htmlToParagraphs(r.buf.toString('utf8')).filter(p => p.split(/\s+/).length >= 3);
    entry.paragraphs = paras;
    entry.words = paras.join(' ').split(/\s+/).length;
  }
  passages.push(entry);
  console.log(`${String(r.status).padEnd(3)} ${r.type.padEnd(16)} ${s.year} ${s.author}: ${entry.file ? 'pdf saved ' + entry.file : (entry.words || 0) + ' words'} ${s.url}`);
  await sleep(1000);
}

const out = { probe, passages };
writeFileSync('netcheck2.json', JSON.stringify(out, null, 1));
console.log(`\n${probe.filter(p => p.pdf).length} real PDFs of ${probe.length} College Board candidates; ${passages.filter(p => p.file || p.words).length} of ${passages.length} passage sources readable`);
console.log('=====NETCHECK2-B64=====');
console.log(Buffer.from(JSON.stringify(out)).toString('base64'));
console.log('=====END-NETCHECK2-B64=====');
