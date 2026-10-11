// Tests for the Sonnet Loom engine. Run with: node --test claims-reader/test/
// No dependencies. Every poem quoted here is in the public domain.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../sonnet-loom.js');

const S18 = `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date;
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.`;

const FREE = `Not the sea itself but the idea of it,
salt on the handrail, the bridge that lifts
twice an hour for a boat nobody is on.
I came down to count the pelicans
and lost the count at nine.
A man with a radio sells ice from a cooler to no one.
The light goes the color of a peeled orange
and the water takes it, keeps it, gives back less.`;

const words = t => t.split(/\s+/).filter(Boolean).join(' ');
const laidOut = r => r.lines.map(l => l.text).join(' ');

test('never adds, drops, changes, or reorders a word (whole-word mode)', () => {
  for (const text of [S18, FREE, 'Not the sea itself but the idea of it,', 'one', S18.replace(/\n/g, ' ')]) {
    const r = L.weave(text, { whole: true });
    assert.ok(r.ok, r.note);
    assert.equal(words(laidOut(r)), words(text));
    for (const ln of r.lines) for (const p of ln.pieces) assert.equal(p.from === 0 && p.to === p.tok.syl, true, 'a word was split');
  }
});

test('strict mode keeps every word in order, splitting only at a hyphen', () => {
  const r = L.weave(FREE, { whole: false, stretch: 'all' });
  assert.ok(r.ok);
  const rebuilt = laidOut(r).replace(/-\s+/g, '');
  assert.equal(words(rebuilt), words(FREE));
});

test('Sonnet 18 poured into one line comes back with all fourteen of its breaks', () => {
  const r = L.weave(S18.replace(/\n/g, ' '), { whole: true });
  assert.equal(r.lines.length, 14);
  assert.deepEqual(r.lines.map(l => l.text), S18.split('\n'));
  assert.equal(r.sonnets[0].lines.map(l => l.letter).join(''), 'ABABCDCDEFEFGG');
  assert.equal(r.sonnets[0].fullRhymes, 7);
});

test('one line stays one line when it cannot make two near ten', () => {
  const r = L.weave('Not the sea itself but the idea of it,', { whole: true });
  assert.equal(r.lines.length, 1);
  const g = L.grade(r);
  assert.equal(g.lines, 1);
  assert.equal(g.conceptual.score, null, 'the conceptual grade waits for a quatrain');
  assert.ok(g.formal.rows.find(x => x.name === 'Rhyme').na);
  const m = L.margin(r);
  assert.match(m[0].text, /one line of fourteen/);
  assert.match(m[0].text, /Next comes line 2/);
});

test('eight lines lay out as an octave and are graded on what is there', () => {
  const r = L.weave(S18.split('\n').slice(0, 8).join('\n'), { whole: true });
  assert.equal(r.lines.length, 8);
  const g = L.grade(r);
  assert.equal(g.formal.rows.find(x => x.name === 'Rhyme').na, undefined);
  assert.ok(g.conceptual.rows.find(x => x.name === 'The turn').na);
  assert.ok(g.formal.score >= 90, `formal ${g.formal.score}`);
  assert.match(L.margin(r)[0].text, /line 9 is the turn/);
});

test('a long line of prose is broken into pentameter-length lines', () => {
  const r = L.weave(FREE.replace(/\n/g, ' '), { whole: true });
  assert.ok(r.lines.length >= 7 && r.lines.length <= 10, String(r.lines.length));
  for (const ln of r.lines) assert.ok(ln.syl >= 8 && ln.syl <= 13, `${ln.syl}: ${ln.text}`);
  for (const ln of r.lines) assert.ok(!/^(the|a|an)$/i.test(ln.end.core), `line ends on an article: ${ln.text}`);
});

test('syllable counts for common and poetic words', () => {
  const cases = { day: 1, compare: 2, temperate: 3, every: 2, heaven: 2, complexion: 3, eternal: 3, possession: 3, fire: 1, poem: 2, idea: 3, quiet: 2, beautiful: 3, loved: 1, wanted: 2, horses: 2, places: 2, being: 2, everything: 3 };
  for (const [w, n] of Object.entries(cases)) assert.equal(L.sylWord(w), n, w);
});

test('rhymes: true, slant, and none', () => {
  const tok = w => L.tokenize(w)[0];
  assert.equal(L.rhymeKind(tok('day'), tok('May')).kind, 'full');
  assert.equal(L.rhymeKind(tok('shines'), tok('declines')).kind, 'full');
  assert.equal(L.rhymeKind(tok('rough'), tok('stuff')).kind, 'full');
  assert.equal(L.rhymeKind(tok('day'), tok('bridge')).kind, 'none');
});

test('meter: names the pulse of iambic, trochaic, and anapestic verse', () => {
  const read = text => {
    const toks = L.tokenize(text);
    const byLine = new Map();
    toks.forEach(t => { if (!byLine.has(t.line)) byLine.set(t.line, []); byLine.get(t.line).push(t); });
    return L.rhythm([...byLine.values()].map((ts, i) => ({ n: i + 1, stress: ts.flatMap(t => t.stress) })));
  };
  const s18 = read(S18);
  assert.equal(s18.dominant, 'iambic');
  assert.equal(s18.commonLabel, 'iambic pentameter');
  assert.equal(s18.commonCount, 14);
  const tyger = read('Tyger Tyger, burning bright,\nIn the forests of the night;\nWhat immortal hand or eye,');
  assert.equal(tyger.dominant, 'trochaic');
  assert.equal(tyger.lines[0].kind, 'catalectic');
  const byron = read('The Assyrian came down like the wolf on the fold,\nAnd his cohorts were gleaming in purple and gold;');
  assert.equal(byron.dominant, 'anapestic');
});

test('scansion of a single line names its feet and departures', () => {
  const toks = L.tokenize('Rough winds do shake the darling buds of May,');
  const sc = L.scanMeter(toks.flatMap(t => t.stress), 'iambic');
  assert.equal(sc.label, 'iambic pentameter');
  assert.equal(sc.spans.length, 5);
  assert.equal(sc.subs[0].kind, 'spondee');
  assert.equal(sc.dadum, 'DUM-DUM da-DUM da-DUM da-DUM da-DUM');
});

test('rhyme families gather words anywhere in the poem that share a sound', () => {
  const r = L.weave(S18, { whole: true });
  const fam = L.rhymeFamilies(r.tokens);
  const sets = fam.families.map(f => f.words.join('/'));
  assert.ok(sets.includes('day/may'), sets.join(' '));
  assert.ok(fam.families.some(f => f.words.includes('shines') && f.words.includes('declines')));
});
