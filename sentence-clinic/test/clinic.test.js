// Tests for the Sentence Clinic engine. Run with: node --test sentence-clinic/test/
// No dependencies. The sample essays are written for these tests; the quoted lines from The Great Gatsby are public domain in the United States.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../clinic.js');

const STRONG = `In the closing scene of The Great Gatsby, Nick Carraway stands on the lawn where Gatsby once reached toward a green light. Fitzgerald's final page insists that the American dream is a form of nostalgia rather than a form of hope, exposing this reversal through the novel's shifting tenses and its recurring image of the receding light. The novel does so in order to warn that a nation which looks forward only by looking back cannot see the people it tramples in the present.

Fitzgerald's tenses carry the reversal before any character names it, since the narration slides from the past of Gatsby's death into a future that is grammatically already gone. Nick describes a dream "already behind him, somewhere back in that vast obscurity beyond the city" (180). The word "already" does the work: the future Gatsby strains toward has been placed in the past before he can reach it. Hope that is already behind a man is memory wearing hope's clothes, and the sentence makes the reader feel the substitution in its grammar. Nostalgia, in this novel, is not a mood but a tense.

The green light exposes the same reversal through its steady retreat from the man who watches it. When Nick first sees Gatsby, the light is a destination; by the final page it is "the orgastic future that year by year recedes before us" (180). The pronoun "us" widens Gatsby's private longing into a national one, and the verb "recedes" denies the pursuit any end. A light that moves away as fast as one approaches is not a goal but a horizon, and Fitzgerald's syntax, which postpones the verb to the end of the clause, enacts the delay it describes. The dream's receding is the novel's final word on the American promise.

What the novel finally asks is whether a nation can afford a dream that faces backward. Gatsby's longing trampled Myrtle, used Daisy, and erased his own father, and the final page implies that a country which worships a receding light will keep producing such wreckage. Nostalgia dressed as hope is dangerous precisely because it feels like virtue. If the American dream is memory rather than promise, then the people in the present are the cost, and Fitzgerald's reversed tenses are the warning we are still too hopeful to hear.`;

const WEAK = `Since the dawn of time, people have always wanted things they can't have. In today's society this is very relatable. The Great Gatsby by F. Scott Fitzgerald is about a man named Gatsby who wants Daisy. In this essay I will discuss how the book shows that the American dream is bad.

Gatsby throws huge parties. He bought a big house across from Daisy and then he waited for her to show up. One day he finally meets her again through Nick. "He stretched out his arms toward the dark water in a curious way" (20). This shows that he really wants something. I think this proves that the American dream is unattainable because people can't attain it.

Society tells us that money brings happiness. Gatsby is seen as a successful man. He has a lot of money and stuff but he is not happy. Myrtle dies and then Gatsby dies. Isn't it ironic that he had everything? This leads to his downfall.

In conclusion, the book shows that the American dream is bad. People should be happy with what they have. Fitzgerald clearly shows that wanting things is bad and everyone should learn from Gatsby.`;

const LANG = `When Frederick Douglass addressed the Rochester Ladies' Anti-Slavery Society on July 5, 1852, he spoke to an audience that had come to celebrate. Douglass indicts the hypocrisy of a national holiday celebrated beside slavery by turning the audience's own pronouns against them, shifting from "your" to "we" only when he reaches the future. He does so in order to force his listeners to feel the gap between the nation they praise and the nation they permit, a gap that matters because a celebration which excludes the enslaved is not a celebration of freedom at all.

Douglass's pronouns indict his audience before any argument does, through the relentless repetition of "your" across the speech's first movement. "This Fourth of July is yours, not mine," he tells them, insisting that "you may rejoice, I must mourn." The possessive "yours" hands the holiday back to the people who own it and refuses the fiction that the day belongs to everyone. The repetition is the argument: each "your" is a small eviction, and the audience, hearing itself addressed as the owners of the nation's freedom, is made to hear who has been left outside it.

The speech exposes the audience's complacency through its contrast between the Founders' revolutionary courage and the audience's inherited comfort. Douglass praises the men of 1776 as "brave" and "great," and the praise is a trap, since the listeners who applaud it must then ask what they have risked. The contrast positions the audience as heirs who have spent an inheritance they did not earn. By honoring the Founders more lavishly than the audience would, Douglass makes their descendants' silence on slavery read as betrayal rather than neutrality.

Douglass's turn to "we" in the final pages insists that the nation can still be shared, and the shift is where the speech's stakes become visible. The gap between the praised nation and the permitted one is not a rhetorical flourish but the moral condition of his listeners, who have been made to feel it in their own pronouns. A celebration of freedom that leaves the enslaved outside the room is, the speech has shown, a celebration of ownership. Douglass's pronouns force the Rochester audience, and every audience since, to decide which of the two they are willing to be.`;

const PHIL = `Most people assume that a promise binds because the promiser intends to be bound. Promising generates an obligation not because of any inner intention but because the practice of promising exists, since an utterance counts as a promise only against a background of shared rules that others rely upon. This matters because, if obligation comes from the practice rather than the will, then a person cannot escape a promise by discovering that they never meant it, and the stakes of our everyday reliance on one another are placed beyond the reach of private sincerity.

The practice view explains why insincere promises still bind, because the hearer's reliance, not the speaker's state of mind, is what the promise creates. Suppose a man promises to repay a loan while privately resolving never to do so. On the intention view, no obligation arises, since he never intended to be bound. Yet we hold him to the debt and call him a liar rather than a non-promiser, which suggests that the obligation was created by the act of promising within a practice the hearer trusted.

The practice view also exposes why promises made outside any practice fail to bind, since the words alone do nothing. A child who says "I promise" to a stuffed animal has made no promise, because no one relies and no rule is invoked. The absence of obligation here is not a defect in the child's sincerity but the absence of the social form that makes promising possible. Obligation, on this account, is a feature of the form rather than of the feeling behind it.

If obligation lives in the practice rather than the will, then the sincerity we prize in promisers is a virtue of character, not the source of their duty. The stakes are practical: a society that locates promissory obligation in intention hands every promiser a private exit, while one that locates it in the practice keeps the exit closed. Our reliance on one another is safer in the second society, and the practice view, by placing obligation beyond the reach of private sincerity, is the account that protects it.`;

test('sentence splitting respects abbreviations, quotations, decimals and initials', () => {
  const s = C.splitSentences('Mr. Darcy left. He said "Go." Then J. K. Rowling wrote 3.5 pages. Dr. Smith (p. 12) agreed! Really?', 0).map(x => x.text);
  assert.deepEqual(s, ['Mr. Darcy left.', 'He said "Go."', 'Then J. K. Rowling wrote 3.5 pages.', 'Dr. Smith (p. 12) agreed!', 'Really?']);
});
test('sentence offsets point into the source', () => {
  const src = 'First one.  Second "one." Third?';
  C.splitSentences(src, 0).forEach(x => assert.equal(src.slice(x.start, x.end).trim(), x.text));
});
test('paragraphs break on single newlines unless a line is hard-wrapped', () => {
  const p = C.splitParagraphs('Para one is here.\nPara two is here.\n\nPara three starts\nand wraps here.\nPara four.');
  assert.deepEqual(p.map(x => x.text), ['Para one is here.', 'Para two is here.', 'Para three starts and wraps here.', 'Para four.']);
});
test('empty input reads without error', () => {
  const r = C.read('');
  assert.equal(r.sentences.length, 0);
  assert.equal(r.thesis, null);
  assert.equal(r.passed, 0);
});

test('the strong literary essay passes the spine', () => {
  const r = C.read(STRONG);
  assert.equal(r.passed, 10, r.checklist.filter(c => !c.ok).map(c => c.label).join('; '));
  assert.deepEqual(r.thesis.indexes, [1, 2]);
  assert.equal(r.thesis.what.strong, true);
  assert.equal(r.thesis.how.ok, true);
  assert.equal(r.thesis.why.ok, true);
  assert.equal(r.thesis.why.marker.toLowerCase(), 'in order to');
  const topics = r.paragraphs.filter(p => p.kind === 'body').map(p => p.topic);
  assert.equal(topics.length, 2);
  topics.forEach(t => { assert.equal(t.what.ok, true); assert.equal(t.how.ok, true); assert.ok(t.link.length > 0); });
  assert.equal(r.conclusion.returns, true);
  assert.ok(r.conclusion.bestEcho.includes('warn') || r.conclusion.bestEcho.includes('present'));
  assert.equal(r.totals.rigor, 0, JSON.stringify(r.sentences.flatMap(s => s.flags.filter(f => f.severity === 'rigor').map(f => [s.index, f.code]))));
  assert.equal(r.totals.summary, 0);
});

test('the weak essay fails the spine and is flagged for its habits', () => {
  const r = C.read(WEAK);
  assert.equal(r.passed, 0);
  assert.equal(r.thesis.twoSentence, false);
  assert.equal(r.thesis.indexes[0], 3, 'the announced claim is the thesis, not the dawn-of-time opener');
  assert.equal(r.thesis.what.strong, false);
  assert.equal(r.thesis.how.ok, false);
  assert.equal(r.thesis.why.ok, false);
  const codes = new Set(r.sentences.flatMap(s => s.flags.map(f => f.code)));
  ['hedge', 'overclaim', 'announce', 'summary', 'quote-dump', 'unread-quote', 'this-shows', 'passive', 'agentless', 'question', 'causal', 'conc-opener', 'vague', 'topic-what', 'topic-how', 'topic-link', 'para-close'].forEach(c => assert.ok(codes.has(c), 'missing flag ' + c));
  assert.equal(r.conclusion.returns, false);
  assert.ok(r.totals.summary >= 3);
  assert.ok(r.totals.flags > 25);
});

test('the rhetorical-analysis essay reads devices as the How and returns to the Why', () => {
  const r = C.read(LANG);
  assert.deepEqual(r.thesis.indexes, [1, 2]);
  assert.equal(r.thesis.what.strong, true);
  assert.equal(r.thesis.how.ok, true);
  assert.equal(r.thesis.why.ok, true);
  assert.ok(r.passed >= 9, r.checklist.filter(c => !c.ok).map(c => c.label).join('; '));
  assert.equal(r.conclusion.returns, true);
});

test('the philosophy essay reads reasons as the How', () => {
  const r = C.read(PHIL);
  assert.deepEqual(r.thesis.indexes, [1, 2]);
  assert.equal(r.thesis.how.ok, true);
  assert.equal(r.thesis.how.byReason, true);
  assert.equal(r.thesis.why.ok, true);
  assert.ok(r.passed >= 8, r.checklist.filter(c => !c.ok).map(c => c.label).join('; '));
  assert.equal(r.conclusion.returns, true);
});

test('a conclusion that copies the thesis is caught', () => {
  const t = 'Shakespeare\'s sonnet exposes the vanity of poetic immortality through its boast that verse outlives marble. He does so in order to warn that a poem which promises eternity promises it only to itself.';
  const essay = `${t}\n\nThe boast exposes the vanity through the sonnet's catalogue of monuments. The speaker lists "marble" and "gilded monuments" (1-2) only to dismiss them, because the dismissal flatters the verse that replaces them. The catalogue is a trophy case for the poem.\n\nThe couplet exposes the same vanity through its sudden turn to "you." The speaker insists "you live in this" (14), yet "this" is the poem, so the beloved survives only as the poem's occasion. The promise of eternity is kept by the verse for the verse.\n\n${t}`;
  const r = C.read(essay);
  assert.equal(r.conclusion.copied, true);
  assert.ok(r.conclusion.flags.some(f => f.code === 'conc-copied'));
  assert.equal(r.checklist.find(c => c.key === 'conc-return').ok, false);
});

test('a two-paragraph essay is told it has no conclusion', () => {
  const r = C.read('Milton\'s Satan exposes the seduction of eloquence through his first speech. He does so in order to warn the reader against trusting beauty of phrase.\n\nThe speech seduces through its rhythm. Satan insists "the mind is its own place" (254), and the line\'s balance makes the claim feel earned.');
  assert.ok(r.conclusion.flags.some(f => f.code === 'conc-missing'));
});

test('thesis can be overridden by index and length', () => {
  const r1 = C.read(WEAK, { thesisIndex: 2, thesisLength: 1 });
  assert.deepEqual(r1.thesis.indexes, [2]);
  const r2 = C.read(STRONG, { thesisIndex: 1, thesisLength: 1 });
  assert.deepEqual(r2.thesis.indexes, [1]);
  assert.equal(r2.thesis.twoSentence, false);
});

test('rewrites remove hedges, announcements, and overclaims without touching the claim', () => {
  assert.equal(C.stripHedges('I think that Gatsby is lonely.'), 'Gatsby is lonely.');
  assert.equal(C.stripHedges('In my opinion, the poem kind of mourns the city.'), 'The poem mourns the city.');
  assert.equal(C.stripAnnouncement('In this essay I will argue that Hamlet delays because he thinks.'), 'Hamlet delays because he thinks.');
  assert.equal(C.stripOverclaims('This clearly proves that Daisy is shallow.'), 'This suggests that Daisy is shallow.');
  assert.match(C.stripOverclaims('Everyone always wants more.'), /which people, exactly/);
});

test('sentence-level rewrites keep names capitalized and put the agent back', () => {
  const r = C.read(WEAK);
  const passive = r.sentences.find(s => /is seen as/.test(s.text)).flags.find(f => f.code === 'passive');
  assert.equal(passive.rewrite, '[Who?] sees Gatsby as a successful man.');
  const summary = r.sentences.find(s => /Myrtle dies/.test(s.text)).flags.find(f => f.code === 'summary');
  assert.match(summary.rewrite, /^The moment when Myrtle dies/);
  const q = r.sentences.find(s => /ironic/.test(s.text)).flags.find(f => f.code === 'question');
  assert.match(q.rewrite, /^\[Your answer to/);
  r.sentences.forEach(s => s.flags.forEach(f => { if (f.rewrite) assert.notEqual(f.rewrite.trim(), s.text.trim(), 'rewrite identical to source for ' + f.code); }));
});

test('every flag carries a question and a recommendation', () => {
  [STRONG, WEAK, LANG, PHIL].forEach(e => {
    const r = C.read(e);
    const all = r.sentences.flatMap(s => s.flags).concat(r.thesis ? r.thesis.flags : [], r.conclusion.flags);
    all.forEach(f => { assert.ok(f.question && f.question.length > 10, f.code + ' lacks a question'); assert.ok(f.recommend && f.recommend.length > 10, f.code + ' lacks a recommendation'); assert.ok(C.SEVERITIES[f.severity], f.code + ' has unknown severity'); });
  });
});

test('names and titles are not read as vague words', () => {
  const r = C.read('The Great Gatsby opens on a lawn. Fitzgerald exposes the hollowness of the party through its guest list. He does so in order to warn that spectacle replaces society.\n\nThe guest list exposes hollowness through its sheer length. Nick records "the Leeches" and "the Blackbucks" (61), names that read as a bestiary.\n\nThe list, then, is the novel\'s warning in miniature: a society that can be catalogued is a society that has stopped being a people.');
  const first = r.sentences[0];
  assert.ok(!first.flags.some(f => f.code === 'vague'), JSON.stringify(first.flags));
});

test('abstractions are flagged only where they carry the claim and are undefined', () => {
  const r = C.read('Orwell indicts the comfort of political cliché by making its users sound like machines. He does so in order to insist that freedom, understood here as the capacity to notice one\'s own words, is a habit before it is a right.\n\nThe cliché user is a machine through the essay\'s own metaphors of prefabrication. Orwell writes of phrases "tacked together like the sections of a prefabricated hen-house" (4), and the simile turns writing into assembly.\n\nFreedom as a habit of noticing is the essay\'s stake, and its own plain style enacts the habit it recommends.');
  const thesis2 = r.sentences[1];
  assert.ok(!thesis2.flags.some(f => f.code === 'abstraction'), 'defined abstraction should pass: ' + JSON.stringify(thesis2.flags.map(f => f.code)));
  const w = C.read('Society always wants freedom. The novel shows that freedom is good.\n\nFreedom appears in chapter one. The hero wants to be free.\n\nIn conclusion freedom is good.');
  assert.ok(w.sentences.some(s => s.flags.some(f => f.code === 'abstraction')));
});
