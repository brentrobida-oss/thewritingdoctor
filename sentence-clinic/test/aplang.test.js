// Tests for the AP Language layer. Run with: node --test sentence-clinic/test/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const A = require('../aplang.js');
const src = fs.readFileSync(path.join(__dirname, 'clinic.test.js'), 'utf8');
const essay = n => src.match(new RegExp('const ' + n + ' = `([\\s\\S]*?)`;'))[1];
const STRONG = essay('STRONG'), WEAK = essay('WEAK'), LANG = essay('LANG'), PHIL = essay('PHIL');

const SYNTH = `Public libraries were built for a world of scarce books, and some argue that the internet has made them relics. Libraries should be funded as community infrastructure rather than as book warehouses, because the services their critics overlook (internet access, literacy programs, a free room to sit in) are precisely what the market does not supply. This matters because a town that defunds its library in the name of efficiency saves little and removes the one public space that asks nothing of the people who enter it.

Libraries supply access that the private market leaves out, which Source A documents in the numbers of patrons who have no other connection. Source A reports that "roughly a quarter of library computer users have no internet at home" (Source A), a figure that turns the library from a convenience into a utility. The word "utility" matters because utilities are funded as necessities, and Source C's argument that libraries are "a luxury in the age of the smartphone" (Source C) assumes a household with a phone plan, which Source A's quarter does not have. The critics measure the library against their own homes, not against the homes of the people who use it.

The library's second function is a room, and Source E's account of a branch that stayed open as a cooling center during a heat wave shows what the building does when the books are beside the point. Source E describes families who "came for the air conditioning and stayed for the story hour" (Source E), a sentence in which the second clause is the argument: the room draws people for one need and meets another. Admittedly, Source B is right that circulation is falling, but circulation counts books, not people, and a metric that cannot see the family in the cooling center is the wrong metric for a public good.

If a library is infrastructure rather than inventory, then the falling circulation that worries Source B is no more an argument for closing it than falling letter volume is an argument for closing the roads. The town that defunds its branch saves the cost of a few salaries and loses the only public room that asks nothing of the people who enter it. That room is what the funding buys, and it is worth the price.`;

test('scores the four questions without error and returns every section', () => {
  [[STRONG, 2], [WEAK, 2], [LANG, 2], [PHIL, 3], [SYNTH, 1]].forEach(([e, q]) => {
    const s = A.score(e, { question: q });
    ['question', 'read', 'shape', 'integration', 'support', 'rubric', 'strengths', 'moves'].forEach(k => assert.ok(s[k], k));
    assert.ok(s.integration.score >= 1 && s.integration.score <= 6);
    assert.ok(s.support.score >= 1 && s.support.score <= 6);
    assert.ok(s.rubric.total >= 0 && s.rubric.total <= 6);
    assert.ok(Array.isArray(s.integration.just) && Array.isArray(s.support.just));
  });
});

test('the strong essays score high and the weak essay low on both meters', () => {
  const strong = A.score(LANG, { question: 2 });
  const weak = A.score(WEAK, { question: 2 });
  assert.ok(strong.integration.score >= 4, 'LANG integration ' + strong.integration.score);
  assert.ok(strong.support.score >= 5, 'LANG support ' + strong.support.score);
  assert.equal(strong.rubric.rowA.points, 1);
  assert.equal(strong.rubric.rowB.points, 4);
  assert.ok(weak.integration.score <= 2, 'WEAK integration ' + weak.integration.score);
  assert.ok(weak.support.score <= 2, 'WEAK support ' + weak.support.score);
  assert.equal(weak.rubric.rowA.points, 0);
  assert.ok(weak.rubric.rowB.points <= 1);
});

test('single-word quotations read in place count as framed, embedded, and read', () => {
  const s = A.score(LANG, { question: 2 });
  const singles = s.integration.records.filter(r => r.quoted.every(x => x.split(/\s+/).length <= 2));
  assert.ok(singles.length >= 3);
  singles.forEach(r => { assert.equal(r.embedded, true); assert.equal(r.read, true, JSON.stringify(r)); });
});

test('synthesis counts sources and caps Evidence and Commentary below three', () => {
  const s = A.score(SYNTH, { question: 1 });
  assert.deepEqual(s.support.sources.sort(), ['A', 'B', 'C', 'E']);
  assert.ok(s.support.score >= 5, 'SYNTH support ' + s.support.score + ' ' + s.support.just.join(' | '));
  assert.ok(s.integration.records.every(r => r.attributed), 'every quotation tagged');
  assert.equal(s.rubric.rowA.points, 1);
  assert.ok(s.support.good.some(g => /counterposition/.test(g)));
  const two = SYNTH.replace(/\(Source E\)/g, '(Source A)').replace(/Source E/g, 'Source A').replace(/\(Source C\)/g, '(Source A)').replace(/Source C's/g, "Source A's").replace(/Source B/g, 'Source A');
  const s2 = A.score(two, { question: 1 });
  assert.equal(s2.support.sources.length, 1);
  assert.ok(s2.rubric.rowB.points <= 1, 'row B capped at ' + s2.rubric.rowB.points);
});

test('rhetorical analysis wants named choices, their function, and the audience', () => {
  const s = A.score(LANG, { question: 2 });
  assert.ok(s.support.good.some(g => /rhetorical choices named/.test(g)), s.support.good.join(' | '));
  assert.ok(s.support.good.some(g => /audience/.test(g)));
  const w = A.score(WEAK, { question: 2 });
  assert.ok(w.support.just.some(j => /No rhetorical choice/.test(j)));
  assert.ok(w.rubric.rowA.why.some(x => /rhetorical choices/.test(x)));
});

test('argument reads examples, setup, tie-back, and qualification', () => {
  const s = A.score(PHIL, { question: 3 });
  assert.ok(s.integration.examples.length >= 2);
  assert.ok(s.support.good.some(g => /qualified|counterargument/.test(g)));
  assert.ok(s.support.score >= 5);
  const stock = A.score('Hard work always pays off. Hard work is the only path to success, as the lives of famous people show. This matters because students need to hear it.\n\nMartin Luther King worked hard. Steve Jobs worked hard too and he built Apple. They succeeded.\n\nMichael Jordan was cut from his team. He kept working and became the best.\n\nIn conclusion, hard work pays off.', { question: 3 });
  assert.ok(stock.support.just.some(j => /stock example/.test(j)), stock.support.just.join(' | '));
  assert.ok(stock.integration.score <= 3);
});

test('shape wants an introduction, two body paragraphs, and a conclusion', () => {
  assert.equal(A.score(STRONG, { question: 2 }).shape.ok, true);
  const three = A.score(STRONG + '\n\nA third body paragraph here reads the lawn. Nick lies on it and the grass "is cut" (180). The grass matters because it is tended.', { question: 2 });
  assert.equal(three.shape.ok, false);
  assert.match(three.shape.note, /body paragraphs/);
});

test('the sophistication point is never awarded, only marked possible', () => {
  [STRONG, WEAK, LANG, PHIL, SYNTH].forEach((e, i) => { const s = A.score(e, { question: [2, 2, 2, 3, 1][i] }); assert.equal(s.rubric.rowC.points, 0); assert.equal(typeof s.rubric.rowC.possible, 'boolean'); });
});

test('strengths come first and are never empty for a competent essay', () => {
  const s = A.score(LANG, { question: 2 });
  assert.ok(s.strengths.length >= 4, JSON.stringify(s.strengths));
  assert.ok(s.moves.length >= 1);
  s.moves.forEach(m => assert.ok(m.text.length > 10));
});
