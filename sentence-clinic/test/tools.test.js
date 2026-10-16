// Offline tests for the passage-fetch helpers. Run with: node --test sentence-clinic/test/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { htmlToParagraphs, between } = require('../tools/html-text.js');

test('html becomes clean paragraphs with entities decoded and scripts dropped', () => {
  const html = '<html><head><style>p{}</style><script>var x=1;</script></head><body><h1>Letter</h1><p>My dear Son,</p><p>I hope you have had no occasion &amp; no cause to repent.<br>Second line&rsquo;s text.</p><div>Your ever affectionate Mother</div></body></html>';
  const p = htmlToParagraphs(html);
  assert.deepEqual(p, ['Letter', 'My dear Son,', 'I hope you have had no occasion & no cause to repent. Second line’s text.', 'Your ever affectionate Mother']);
});
test('between keeps the run from the first anchor to the last, inclusive, case-insensitive', () => {
  const paras = ['Site menu', 'My dear Son,', 'Body one.', 'Body two.', 'Your ever affectionate Mother', 'Footer links'];
  assert.deepEqual(between(paras, 'my dear son', 'affectionate mother'), paras.slice(1, 5));
  assert.deepEqual(between(paras, null, null), paras);
  assert.deepEqual(between(paras, 'not present', 'also absent'), paras);
});
test('script and style blocks are dropped even with spaces in the closing tag', () => {
  const p = htmlToParagraphs('<p>Keep this.</p><script type="x">drop();</script\t\n bar><style >p{}</style >  <p>And this.</p>');
  assert.deepEqual(p, ['Keep this.', 'And this.']);
});
