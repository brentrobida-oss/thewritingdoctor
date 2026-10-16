const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const sandbox = {};
new Function('self', fs.readFileSync(path.join(__dirname, '..', 'library.js'), 'utf8'))(sandbox);
const LIB = sandbox.APLibrary;

test('every year offers all three questions with a task and an intro', () => {
  for (const [year, Y] of Object.entries(LIB.years)) {
    for (const q of ['q1', 'q2', 'q3']) {
      if (!Y[q]) continue;
      assert.ok(Y[q].task && Y[q].task.length > 20, `${year} ${q} task`);
      assert.ok(Y[q].intro && Y[q].intro.length > 10, `${year} ${q} intro`);
    }
  }
});

test('links are https College Board URLs, unique within a question, and carry a boolean verified flag', () => {
  for (const [year, Y] of Object.entries(LIB.years)) {
    for (const q of ['q1', 'q2', 'q3']) {
      const urls = (Y[q] || {}).urls || [];
      const seen = new Set();
      for (const u of urls) {
        assert.match(u.url, /^https:\/\/[a-z.-]*collegeboard\.org\//, `${year} ${q} ${u.url}`);
        assert.equal(typeof u.verified, 'boolean');
        assert.ok(!seen.has(u.url), `${year} ${q} repeats ${u.url}`);
        seen.add(u.url);
      }
    }
  }
});

test('every public-domain passage carries its text, with paragraphs and no stray markup', () => {
  const pd = LIB.passages.filter(p => p.pd === true);
  assert.ok(pd.length >= 6);
  for (const p of pd) {
    assert.ok(typeof p.text === 'string' && p.text.split(/\s+/).length >= 250, `${p.year} ${p.author} text`);
    assert.ok(p.text.includes('\n'), `${p.year} ${p.author} paragraphs`);
    assert.ok(!/<[a-z]+[^>]*>/i.test(p.text), `${p.year} ${p.author} markup`);
    assert.ok(!/\u2014/.test(p.excerpt + p.title), `${p.year} ${p.author} em dash in our own words`);
    assert.match(p.text_source, /^https:\/\//);
  }
});

test('passages not in the public domain carry no text', () => {
  for (const p of LIB.passages.filter(p => p.pd !== true)) assert.equal(p.text, undefined, `${p.year} ${p.author}`);
});
