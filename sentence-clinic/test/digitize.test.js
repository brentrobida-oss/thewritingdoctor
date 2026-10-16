const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../digitize.js');

test('OCR lines of one paragraph are joined into one line', () => {
  const raw = 'Thatcher opens with a claim about Reagan\nthat the rest of the eulogy will have to\nearn.';
  assert.equal(D.cleanOcr(raw), 'Thatcher opens with a claim about Reagan that the rest of the eulogy will have to earn.');
});

test('a blank line or an indented line starts a new paragraph', () => {
  const raw = 'First paragraph line one\nline two.\n\nSecond paragraph.\n   Third, indented.';
  assert.deepEqual(D.cleanOcr(raw).split('\n'), ['First paragraph line one line two.', 'Second paragraph.', 'Third, indented.']);
});

test('a word hyphenated across a line break is rejoined', () => {
  assert.equal(D.cleanOcr('the eulogy is a careful construc-\ntion of memory'), 'the eulogy is a careful construction of memory');
  assert.equal(D.cleanOcr('a well-\nKnown figure'), 'a well- Known figure');
});

test('a short sentence-ending line before a capital starts a new paragraph', () => {
  const raw = 'He begins with grief.\nThen the argument turns to policy and the\nlong record.';
  assert.deepEqual(D.cleanOcr(raw).split('\n'), ['He begins with grief.', 'Then the argument turns to policy and the long record.']);
});

test('stray bars and extra spaces are dropped; empty input is empty', () => {
  assert.equal(D.cleanOcr('| the  margin |  mark'), 'the margin mark');
  assert.equal(D.cleanOcr(''), '');
  assert.equal(D.cleanOcr(null), '');
});

test('summary names pages and warns on low confidence', () => {
  assert.match(D.summary({ pages: [{}], confidence: 91, low: false }), /one page at 91%/);
  assert.match(D.summary({ pages: [{}, {}], confidence: 55, low: true }), /2 pages at 55%.*handwriting/);
  assert.match(D.summary({ pages: [], confidence: 0, low: false }), /Nothing readable/);
});
