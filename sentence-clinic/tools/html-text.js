/* Turn a fetched HTML page into plain paragraphs. Used by fetch-passages.mjs; kept separate so it can be tested offline. */
'use strict';
function decode(s) {
  const map = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
  return s.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&([a-z]+);/gi, (m, k) => map[k.toLowerCase()] != null ? map[k.toLowerCase()] : m);
}
function htmlToParagraphs(html) {
  let s = String(html);
  s = s.replace(/<script\b[\s\S]*?<\/script\b[^>]*>/gi, ' ').replace(/<style\b[\s\S]*?<\/style\b[^>]*>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<(?:br|hr)\s*\/?>/gi, '\n').replace(/<\/(?:p|div|li|h[1-6]|blockquote|tr|section|article)>/gi, '\n\n').replace(/<[^>]+>/g, ' ');
  s = decode(s).replace(/\r/g, '').replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n');
  return s.split(/\n{2,}/).map(p => p.replace(/\n/g, ' ').trim()).filter(p => p.length > 0);
}
/* Keep the run of paragraphs between two anchor phrases (inclusive), case-insensitive; or the whole list when anchors are absent. */
function between(paragraphs, startPhrase, endPhrase) {
  const lc = paragraphs.map(p => p.toLowerCase());
  let a = startPhrase ? lc.findIndex(p => p.includes(startPhrase.toLowerCase())) : 0;
  if (a < 0) a = 0;
  let b = endPhrase ? lc.findIndex((p, i) => i >= a && p.includes(endPhrase.toLowerCase())) : paragraphs.length - 1;
  if (b < 0) b = paragraphs.length - 1;
  return paragraphs.slice(a, b + 1);
}
module.exports = { htmlToParagraphs, between, decode };
