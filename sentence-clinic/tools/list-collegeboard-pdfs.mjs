#!/usr/bin/env node
/* Walk College Board's past-exam-questions page for AP English Language and print every PDF it links
   to (directly or from the year pages it links to), one per line as "href<TAB>link text". Used to
   repair the URLs in library.js when a file moves. Needs network access to apcentral.collegeboard.org.
     node sentence-clinic/tools/list-collegeboard-pdfs.mjs */
const INDEX = 'https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam/past-exam-questions';
const UA = { 'user-agent': 'Mozilla/5.0 (Sentence Clinic link check)' };
const seen = new Set();
const pdfs = new Map();

function links(html, base) {
  const out = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    let href = m[1].replace(/&amp;/g, '&');
    try { href = new URL(href, base).href; } catch (e) { continue; }
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ href, text });
  }
  return out;
}
async function visit(url, depth) {
  if (seen.has(url) || depth > 2) return;
  seen.add(url);
  let html;
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow' });
    console.error(`${res.status} ${url}`);
    if (!res.ok) return;
    html = await res.text();
  } catch (e) { console.error(`ERR ${url} ${e.message}`); return; }
  for (const l of links(html, url)) {
    if (/\.pdf(\?|$)/i.test(l.href)) { if (!pdfs.has(l.href)) pdfs.set(l.href, l.text); continue; }
    if (depth < 2 && /collegeboard\.org/.test(l.href) && /english-language/.test(l.href) && /past-exam|exam|question|free-response/i.test(l.href + ' ' + l.text)) await visit(l.href.split('#')[0], depth + 1);
  }
}
await visit(INDEX, 0);
for (const [href, text] of [...pdfs.entries()].sort()) console.log(`${href}\t${text}`);
console.error(`${pdfs.size} PDF links from ${seen.size} pages`);
