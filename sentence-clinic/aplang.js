/* AP Language layer for the Sentence Clinic: scores quotation integration (1-6) and evidentiary
   support (1-6) with justifications, estimates the College Board rubric rows (Thesis 0-1,
   Evidence and Commentary 0-4, Sophistication 0-1), checks the intro + two body + conclusion
   shape, and adapts its reading to Q1 Synthesis, Q2 Rhetorical Analysis, and Q3 Argument.
   Rule-based and offline, like clinic.js, which it requires. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./clinic.js'));
  else root.APLang = factory(root.SentenceClinic);
})(typeof self !== 'undefined' ? self : this, function (C) {
'use strict';

const words = s => s.trim().split(/\s+/);
const LEVELS = { 1: 'Beginning', 2: 'Emerging', 3: 'Developing', 4: 'Capable', 5: 'Strong', 6: 'Commanding' };
const QUESTIONS = {
  1: { key: 1, name: 'Synthesis', short: 'Q1', evidence: 'sources', verb: 'cite', need: 'at least three of the provided sources, each used to advance your position' },
  2: { key: 2, name: 'Rhetorical Analysis', short: 'Q2', evidence: 'the passage', verb: 'quote', need: 'rhetorical choices, quoted from the passage, each explained as a choice that serves a purpose for an audience' },
  3: { key: 3, name: 'Argument', short: 'Q3', evidence: 'examples', verb: 'name', need: 'specific, named evidence (events, texts, figures, your own observed cases) tied to your position' }
};
const SOURCE_RE = /\(\s*source\s+([A-H])\s*\)|\bsource\s+([A-H])\b/gi;
const CITE_RE = /\(\s*(?:lines?|l{1,2}\.|paragraphs?|para\.?|p\.|pp\.)?\s*\d+(?:\s*[-–]\s*\d+)?\s*\)|\b(?:in\s+)?(?:lines?|paragraphs?)\s+\d+/i;
const FRAME_VERB = /\b(?:writes?|states?|says?|argues?|claims?|insists?|notes?|observes?|declares?|asks?|warns?|admits?|concedes?|recalls?|describes?|explains?|contends?|asserts?|urges?|reminds?|tells?|calls?|laments?|celebrates?|begins?|opens?|closes?|ends?|repeats?|lists?|compares?|contrasts?|invokes?|appeals?|addresses?|refers?|quotes?|cites?|according\s+to|in\s+the\s+words\s+of|puts?\s+it)\b/i;
const CHOICE_WORDS = /\b(?:diction|syntax|imagery|metaphor|simile|analogy|allusion|anecdote|repetition|anaphora|parallelism|antithesis|juxtaposition|contrast|irony|hyperbole|understatement|rhetorical\s+question|tone|shift|appeal|ethos|pathos|logos|pronoun|personal\s+pronouns?|inclusive\s+language|first\s+person|second\s+person|direct\s+address|concession|refutation|counterargument|qualification|exemplification|definition|comparison|cause\s+and\s+effect|narrative|description|structure|organization|opening|closing|conclusion|evidence|statistic|detail|word\s+choice|figurative\s+language|sentence\s+structure|punctuation|catalog|list|humor|understatement|epistrophe|asyndeton|polysyndeton|chiasmus|alliteration|assonance|allusion|metonymy|synecdoche|apostrophe|personification|symbol|image|phrase|word|verb|noun|adjective|clause|fragment|dash|colon|question)\b/i;
const FUNCTION_RE = /\b(?:in\s+order\s+to|so\s+that|to\s+(?:persuade|convince|move|remind|reassure|unite|establish|build|create|evoke|appeal|position|invite|force|challenge|urge|shame|honor|elevate|humanize|align|distance|emphasize|underscore|signal|suggest|prepare|soften|sharpen|frame|cast|make|show|highlight|stress|prove|justify|legitimize|dramatize|personalize|universalize|celebrate|mourn|warn|call)|which\s+(?:allows|lets|makes|positions|invites|forces|prepares|signals|suggests|reminds|casts|frames|aligns)|allowing|positioning|inviting|forcing|preparing|signaling|reminding|casting|framing|aligning|the\s+effect|thereby|as\s+a\s+result|achieves?|accomplish(?:es)?|serves?\s+to|functions?\s+(?:to|as)|works?\s+to|helps?\s+(?:him|her|them|the\s+(?:speaker|writer|author))\s+to?)\b/i;
const COMMENTARY_RE = /\b(?:because|suggests?|reveals?|implies|means|matters?|so\s+that|therefore|thus|thereby|the\s+effect|positions?|invites?|forces?|reminds?|signals?|underscores?|emphasizes?|exposes?|complicates?|the\s+(?:word|phrase|verb|noun|image|pronoun|repetition|contrast|question|list|comparison)|rather\s+than|not\s+(?:only|merely|simply)|in\s+other\s+words|that\s+is|which\s+(?:is|means|shows|suggests|makes|lets|allows)|what\s+\w+\s+(?:does|shows|reveals|means)|the\s+(?:point|lesson|difference|stakes?|cost|danger|result))\b/i;
const AUDIENCE_RE = /\b(?:audience|listeners?|readers?|viewers?|the\s+public|his\s+audience|her\s+audience|those\s+(?:listening|gathered|present)|congress|the\s+nation|americans|citizens|students|graduates|the\s+crowd|the\s+assembled|mourners|voters|members|the\s+committee|the\s+court|the\s+jury|the\s+people\s+of|fellow)\b/i;
const CONTEXT_RE = /\b(?:1[6-9]\d\d|20\d\d|addressed|delivered|spoke|speech|address|letter|essay|column|op-ed|testimony|remarks|convention|rally|at\s+the\s+time|at\s+a\s+time\s+when|during\s+(?:the|a|an)\s+\w+|in\s+the\s+(?:wake|midst|aftermath|context)\s+of|amid|era|moment|occasion|historical|given\s+that|context|exigence|exigency|just\s+(?:days|weeks|months|years)\s+after|on\s+the\s+eve\s+of|following\s+the|before\s+a|the\s+year|decade|century|war|depression|movement|election|crisis|ceremony|dedication|commencement|eulogy|funeral|memorial|inauguration|anniversary)\b/i;
const POSITION_RE = /\b(?:should|must|ought|need\s+to|cannot|can\s+not|is\s+(?:not\s+)?(?:worth|right|wrong|necessary|essential|dangerous|misguided|justified|a\s+mistake)|I\s+(?:argue|contend|maintain|believe|hold)|the\s+(?:claim|idea|notion|view|argument)\s+(?:that\s+\w+\s+)?(?:is|holds|fails|collapses)|while\s+\w+[^.]*,\s*\w+|although|despite|rather\s+than|more\s+than|less\s+than|only\s+(?:when|if|insofar)|to\s+the\s+extent|not\s+because\s+\w+\s+but\s+because|both\s+\w+\s+and|yet|however|nevertheless|still,)\b/i;
const QUALIFY_RE = /\b(?:although|while|though|yet|however|nevertheless|granted|admittedly|to\s+be\s+sure|of\s+course|some\s+(?:argue|contend|claim|believe|say|might|would)|critics|skeptics|opponents|one\s+might\s+(?:object|argue|say)|it\s+is\s+true\s+that|even\s+(?:if|so|when|though)|in\s+some\s+cases|not\s+always|unless|except|but\s+only|insofar|to\s+the\s+extent|in\s+part|partly|complicat(?:es|ed|ing)|tension|paradox(?:ically)?|both\s+\w+\s+and\s+\w+|at\s+once|on\s+the\s+one\s+hand|on\s+the\s+other)\b/i;
const SPECIFIC_RE = /\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b|\b(?:1[5-9]\d\d|20\d\d)\b|\b\d+(?:\.\d+)?\s*(?:%|percent|million|billion|thousand|dollars|years|days|hours|miles|people|students|cases)\b|\$\d/;
const STOCK_EXAMPLES = /\b(?:martin\s+luther\s+king|mlk|rosa\s+parks|hitler|nazi|world\s+war\s+(?:ii|2|two)|the\s+holocaust|9\/11|september\s+11|steve\s+jobs|elon\s+musk|bill\s+gates|einstein|thomas\s+edison|abraham\s+lincoln|george\s+washington|the\s+titanic|covid|the\s+pandemic|social\s+media|instagram|tiktok|the\s+great\s+gatsby|to\s+kill\s+a\s+mockingbird|romeo\s+and\s+juliet|1984|fahrenheit\s+451|the\s+crucible|frankenstein|michael\s+jordan|lebron|kobe|harry\s+potter|the\s+hunger\s+games|the\s+odyssey|animal\s+farm|lord\s+of\s+the\s+flies|of\s+mice\s+and\s+men)\b/i;

function tokens(t) { return (t.match(/[A-Za-z][A-Za-z'’-]*/g) || []); }
function wc(t) { return tokens(t).length; }
function quotedSpans(t) { return (t.match(/["“][^"”]+["”]/g) || []); }
function level(n) { return LEVELS[Math.max(1, Math.min(6, Math.round(n)))]; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

/* ------------------------------------------------------------------ quotations */
function quotationRecords(r, q) {
  const recs = [];
  const bodyParas = r.paragraphs.filter(p => p.kind === 'body');
  const inBody = new Set(bodyParas.flatMap(p => p.sentences));
  r.sentences.forEach((s, i) => {
    const spans = quotedSpans(s.text).filter(x => wc(x) >= 1);
    const srcs = [...s.text.matchAll(SOURCE_RE)].map(m => (m[1] || m[2]).toUpperCase());
    if (!spans.length && !(q === 1 && srcs.length && !inBody.has(i) === false && /\b(?:argues?|notes?|claims?|reports?|found|explains?|suggests?|points?\s+out|according)\b/i.test(s.text))) return;
    const next = r.sentences[i + 1];
    const quoted = spans.join(' ');
    const first = s.text.search(/["“]/);
    const before = first >= 0 ? s.text.slice(0, first) : s.text;
    const after = first >= 0 ? s.text.slice(s.text.lastIndexOf(spans.length ? spans[spans.length - 1].slice(-1) : '"') + 1) : '';
    const afterClean = after.replace(/\([^)]*\)/g, '');
    const framedBefore = wc(before) >= 2 && (FRAME_VERB.test(before) || /[:,]\s*$/.test(before) || /\b(?:that|when|how|as|is|are|was|were|becomes?|reads?|called|of|the|a|an|his|her|their|its)\s*$/i.test(before));
    const framedAfter = /^\s*[,.]?\s*(?:he|she|they|it|[A-Z]\w+(?:\s+[A-Z]\w+)?|the\s+\w+)\s+(?:\w+\s+)?(?:writes?|states?|says?|argues?|claims?|insists?|notes?|observes?|declares?|asks?|warns?|admits?|concedes?|tells?|urges?|reminds?|explains?|adds?|continues?|begins?|concludes?|repeats?|answers?|replies|pleads?|promises?)\b/.test(afterClean);
    const single = spans.length > 0 && spans.every(x => wc(x) <= 2);
    const framed = framedBefore || framedAfter || (single && wc(before) >= 2);
    const embedded = spans.length > 0 && (wc(before) >= 3 || (framedAfter && wc(afterClean) >= 3) || single);
    const qw = wc(quoted);
    const lean = qw > 0 && qw <= 20;
    const veryLean = qw > 0 && qw <= 12;
    const attributed = q === 1 ? srcs.length > 0 : (q === 2 ? (CITE_RE.test(s.text) || /\b[A-Z][a-z]+\b/.test(before) && FRAME_VERB.test(before)) : true);
    const qStems = C.contentStems(quoted);
    const nextStems = next ? C.contentStems(next.text) : new Set();
    const afterStems = C.contentStems(after);
    const echoNext = next ? [...qStems].some(x => nextStems.has(x)) : false;
    const echoSame = [...qStems].some(x => afterStems.has(x));
    const readInPlace = single && (COMMENTARY_RE.test(s.text) || C.claimVerbs(s.text).length > 0);
    const read = readInPlace || echoNext || echoSame || (next && /\b(?:the\s+(?:word|phrase|verb|noun|image|repetition|pronoun|question|list|comparison|metaphor)|this\s+(?:word|phrase|choice|image|repetition|comparison)|here)\b/i.test(next.text));
    const dumped = s.flags.some(f => f.code === 'quote-dump');
    const share = wc(s.text) ? qw / wc(s.text) : 0;
    let pts = 0;
    if (framed) pts++; if (embedded) pts++; if (lean) pts++; if (veryLean) pts += .5; if (attributed) pts++; if (read) pts += 1.5; if (dumped) pts -= 1; if (share > .7) pts -= .5;
    recs.push({ index: i, para: s.para, inBody: inBody.has(i), quoted: spans, words: qw, framed, embedded, lean, attributed, read, dumped, sources: srcs, share, points: clamp(pts, 0, 6) });
  });
  return recs;
}
function integrationScore(r, q, recs) {
  const body = r.sentences.filter(s => r.paragraphs[s.para] && r.paragraphs[s.para].kind === 'body');
  const bodyWords = body.reduce((a, s) => a + wc(s.text), 0) || 1;
  const quotedWords = recs.reduce((a, x) => a + x.words, 0);
  const share = quotedWords / bodyWords;
  const just = [];
  const good = [];
  let score;
  if (q === 3) {
    // Argument: evidence is examples; quotation is optional. Score how examples are introduced and tied.
    const ex = exampleRecords(r);
    if (!ex.length) { score = 1; just.push('No specific example is named; the argument runs on general statements.'); }
    else {
      const intro = ex.filter(e => e.introduced).length, tied = ex.filter(e => e.tied).length, stock = ex.filter(e => e.stock).length;
      score = 1 + Math.min(2, ex.length * .7) + (intro / ex.length) * 1.5 + (tied / ex.length) * 1.5 - Math.min(1, stock * .5);
      good.push(`${ex.length} specific example${ex.length === 1 ? '' : 's'} named`);
      if (intro) good.push(`${intro} introduced with context before being used`);
      if (tied) good.push(`${tied} tied back to the claim in the next sentence`);
      if (intro < ex.length) just.push(`${ex.length - intro} example${ex.length - intro === 1 ? '' : 's'} appear${ex.length - intro === 1 ? 's' : ''} without a sentence of setup.`);
      if (tied < ex.length) just.push(`${ex.length - tied} example${ex.length - tied === 1 ? '' : 's'} ${ex.length - tied === 1 ? 'is' : 'are'} not followed by a sentence that says what it proves.`);
      if (stock) just.push(`${stock} stock example${stock === 1 ? '' : 's'} (the ones every essay reaches for). Trade one for something only you would know.`);
      if (recs.length) good.push(`${recs.length} quotation${recs.length === 1 ? '' : 's'} used as evidence`);
    }
    return { score: clamp(Math.round(score), 1, 6), level: level(score), good, just, share, records: recs, examples: ex };
  }
  if (!recs.length) {
    score = 1;
    just.push(q === 1 ? 'No source is quoted or cited. Synthesis needs at least three sources on the page.' : 'Nothing from the passage is quoted. Rhetorical analysis must show the reader the words it reads.');
    return { score, level: level(score), good, just, share, records: recs };
  }
  const avg = recs.reduce((a, x) => a + x.points, 0) / recs.length;
  score = 1 + avg * (5 / 6);
  const n = recs.length;
  const cnt = k => recs.filter(x => x[k]).length;
  if (cnt('framed') === n) good.push('every quotation is introduced by a speaker and a verb'); else just.push(`${n - cnt('framed')} of ${n} quotations arrive unframed (no speaker, no verb before them).`);
  if (cnt('embedded') >= Math.ceil(n / 2)) good.push(`${cnt('embedded')} of ${n} quotations are woven into your own sentence`); else just.push(`only ${cnt('embedded')} of ${n} quotations sit inside your own sentence; the rest stand alone.`);
  if (cnt('lean') === n) good.push('quotations are lean (20 words or fewer)'); else just.push(`${n - cnt('lean')} quotation${n - cnt('lean') === 1 ? '' : 's'} run${n - cnt('lean') === 1 ? 's' : ''} past 20 words; quote the phrase, paraphrase the rest.`);
  if (q === 1) { if (cnt('attributed') === n) good.push('every quotation names its source'); else just.push(`${n - cnt('attributed')} quotation${n - cnt('attributed') === 1 ? '' : 's'} lack a (Source X) tag.`); }
  if (cnt('read') === n) good.push('every quotation is followed by a reading of its words'); else just.push(`${n - cnt('read')} quotation${n - cnt('read') === 1 ? '' : 's'} ${n - cnt('read') === 1 ? 'is' : 'are'} not read afterward: name a word in it and say what the word does.`);
  if (cnt('dumped')) just.push(`${cnt('dumped')} quotation${cnt('dumped') === 1 ? '' : 's'} dropped in as a whole sentence.`);
  if (share > .35) { just.push(`Quoted words are ${Math.round(share * 100)}% of the body; above a third, the passage is writing the essay.`); score -= .5; }
  else good.push(`quotation is ${Math.round(share * 100)}% of the body: your voice leads`);
  if (n < 2 && q !== 3) { just.push('Only one quotation across the body. Each body paragraph should read at least one.'); score -= .5; }
  return { score: clamp(Math.round(score), 1, 6), level: level(score), good, just, share, records: recs };
}

/* ------------------------------------------------------------------ examples (Q3) */
function exampleRecords(r) {
  const out = [];
  const bodyParas = r.paragraphs.filter(p => p.kind === 'body');
  bodyParas.forEach(p => {
    p.sentences.forEach((i, k) => {
      const s = r.sentences[i];
      if (k === 0) return;
      const t = s.text;
      const names = C.contentStems(t);
      const props = (t.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}\b/g) || []).filter(w => !/^(?:The|This|That|These|Those|When|While|Because|Although|In|On|At|By|For|With|Through|As|If|Since|After|Before|Yet|But|And|Or|So|Thus|Here|There|However|Instead|Rather|Then|First|Second|Third|Finally|Ultimately|Indeed|Yes|No|I|It|He|She|They|We|You|My|Our|Their|His|Her|Its|One|Some|Many|Most|Every|Each|Even|Only|Just|Still|Such|Consider|Take|Imagine)$/.test(w));
      const nums = /\b(?:1[5-9]\d\d|20\d\d)\b|\b\d+(?:\.\d+)?\s*(?:%|percent|million|billion|thousand|dollars|years|days|hours|miles|people|students|cases)\b|\$\d/.test(t);
      const personal = /\b(?:my|I|me|our|we)\b/.test(t) && /\b(?:when|once|last|year|school|class|teacher|grandmother|grandfather|mother|father|brother|sister|friend|team|job|summer|night|morning)\b/i.test(t);
      const specific = props.length > 0 || nums || personal;
      if (!specific) return;
      if (s.role === 'topic') return;
      const prev = r.sentences[i - 1];
      const next = r.sentences[i + 1];
      const SETUP = /\b(?:consider|take|for\s+(?:example|instance)|one\s+(?:example|case|instance)|a\s+(?:case|story|moment)|in\s+\d{4}|when|history|recall|think\s+of|suppose|imagine|picture|say\s+that|a\s+(?:man|woman|child|student|teacher|worker|town|country)\s+who)\b/i;
      const introduced = (prev && prev.para === s.para && SETUP.test(prev.text)) || SETUP.test(t);
      const next2 = r.sentences[i + 2];
      const TIE = /\b(?:because|shows?|suggests?|reveals?|proves?|demonstrates?|matters?|this|here|such|that\s+is|in\s+other\s+words|the\s+(?:point|lesson|difference)|what\s+\w+\s+(?:shows|reveals|teaches))\b/i;
      const tied = (next && next.para === s.para && TIE.test(next.text)) || (next2 && next2.para === s.para && TIE.test(next2.text)) || /\b(?:because|which\s+(?:shows|suggests|reveals|means)|proving|showing|revealing|a\s+reminder\s+that|evidence\s+that)\b/i.test(t);
      out.push({ index: i, para: s.para, names: props.slice(0, 3), numbers: nums, personal, introduced: !!introduced, tied: !!tied, stock: STOCK_EXAMPLES.test(t) });
    });
  });
  return out;
}

/* ------------------------------------------------------------------ evidentiary support */
function supportScore(r, q, recs, ex) {
  const bodyParas = r.paragraphs.filter(p => p.kind === 'body');
  const thesisStems = r.thesis ? C.contentStems(r.thesis.sentences.map(s => s.text).join(' ')) : new Set();
  const paras = bodyParas.map(p => {
    const ss = p.sentences.map(i => r.sentences[i]);
    const quotes = recs.filter(x => x.para === p.index);
    const examples = (ex || []).filter(x => x.para === p.index);
    const evidence = quotes.length + (q === 3 ? examples.length : 0) + (q !== 3 ? ss.filter(s => s.role === 'evidence' && !quotes.some(x => x.index === s.index)).length : 0);
    const commentary = ss.filter(s => s.role !== 'topic' && s.role !== 'summary' && (s.role === 'analysis' || COMMENTARY_RE.test(s.text) || C.claimVerbs(s.text).length > 0)).length;
    const summary = ss.filter(s => s.role === 'summary').length;
    const functionVerbs = q === 2 ? ss.filter((s, k) => k > 0 && (FUNCTION_RE.test(s.text) || C.claimVerbs(s.text).length > 0)).length : null;
    const choices = q === 2 ? [...new Set(ss.flatMap(s => (s.text.match(new RegExp(CHOICE_WORDS.source, 'gi')) || []).map(x => x.toLowerCase())))] : [];
    const audience = q === 2 ? ss.some(s => AUDIENCE_RE.test(s.text)) : null;
    const sources = q === 1 ? [...new Set(ss.flatMap(s => [...s.text.matchAll(SOURCE_RE)].map(m => (m[1] || m[2]).toUpperCase())))] : [];
    const tied = p.topic ? p.topic.link.length > 0 : false;
    const closes = p.closesLoop !== false;
    const linkBack = ss.slice(1).filter(s => [...C.contentStems(s.text)].some(x => thesisStems.has(x))).length;
    const qualifies = ss.some(s => QUALIFY_RE.test(s.text));
    return { index: p.index, sentences: ss.length, evidence, quotes: quotes.length, commentary, summary, functionVerbs, choices, audience, sources, tied, closes, linkBack, qualifies, topicWhat: p.topic ? p.topic.what.ok : false, topicHow: p.topic ? p.topic.how.ok : false };
  });
  const good = [], just = [];
  if (!paras.length) return { score: 1, level: level(1), good, just: ['No body paragraphs found. Separate paragraphs with a line break.'], paras, sources: [] };
  const allSources = q === 1 ? [...new Set(paras.flatMap(p => p.sources))] : [];
  let score = 1;
  const withEv = paras.filter(p => p.evidence > 0).length;
  const withCom = paras.filter(p => p.commentary >= 1).length;
  const withBoth = paras.filter(p => p.evidence > 0 && p.commentary >= Math.max(1, Math.ceil(Math.min(p.evidence, p.quotes) / 2))).length;
  const tiedN = paras.filter(p => p.tied).length;
  const closesN = paras.filter(p => p.closes).length;
  const sumHeavy = paras.filter(p => p.summary >= 2 && p.summary >= p.commentary).length;
  if (withEv === paras.length) { score += 1.5; good.push('every body paragraph brings evidence'); } else if (withEv) { score += .7; just.push(`${paras.length - withEv} body paragraph${paras.length - withEv === 1 ? '' : 's'} ${paras.length - withEv === 1 ? 'has' : 'have'} no evidence at all.`); } else just.push('No body paragraph brings evidence; the essay asserts without showing.');
  if (withBoth === paras.length) { score += 1.5; good.push('commentary at least matches evidence in every paragraph'); } else if (withCom === paras.length) { score += 1; just.push('Commentary is present but thinner than the evidence it follows; give each piece of evidence at least one sentence of reading.'); } else if (withCom) { score += .5; just.push(`${paras.length - withCom} paragraph${paras.length - withCom === 1 ? '' : 's'} present${paras.length - withCom === 1 ? 's' : ''} evidence without commentary.`); } else just.push('Evidence stands without commentary. The rubric rewards the explaining, not the quoting.');
  if (tiedN === paras.length) { score += .8; good.push('each topic sentence carries a thesis term'); } else just.push(`${paras.length - tiedN} topic sentence${paras.length - tiedN === 1 ? '' : 's'} share${paras.length - tiedN === 1 ? 's' : ''} no term with the thesis; the line of reasoning breaks there.`);
  if (closesN === paras.length) { score += .5; good.push('each paragraph closes back on the claim'); } else just.push(`${paras.length - closesN} paragraph${paras.length - closesN === 1 ? '' : 's'} end${paras.length - closesN === 1 ? 's' : ''} on evidence or summary instead of on the claim.`);
  if (sumHeavy) { score -= .7; just.push(`${sumHeavy} paragraph${sumHeavy === 1 ? '' : 's'} lean${sumHeavy === 1 ? 's' : ''} on summary; retelling is not reading.`); }
  const avgLink = paras.reduce((a, p) => a + p.linkBack, 0) / paras.length;
  if (avgLink >= 2) { score += .4; good.push('thesis terms recur through the body, so the reasoning is traceable'); }
  if (q === 1) {
    if (allSources.length >= 3) { score += .5; good.push(`${allSources.length} sources cited (${allSources.join(', ')}); the rubric's three-source line is met`); }
    else if (allSources.length === 2) { score = Math.min(score, 3.4); just.push(`Only two sources cited (${allSources.join(', ')}). The rubric caps Evidence and Commentary at 1 point below three sources.`); }
    else if (allSources.length === 1) { score = Math.min(score, 2.4); just.push(`One source cited (${allSources[0]}). Three are needed.`); }
    else { score = Math.min(score, 1.6); just.push('No source is cited with a (Source X) tag.'); }
    const qual = paras.some(p => p.qualifies);
    if (qual) { score += .3; good.push('a counterposition is acknowledged'); } else just.push('No concession or counterposition appears; synthesis that engages a source it disagrees with reads as a conversation, not a list.');
  }
  if (q === 2) {
    const fv = paras.reduce((a, p) => a + p.functionVerbs, 0);
    const ch = [...new Set(paras.flatMap(p => p.choices))];
    const aud = paras.filter(p => p.audience).length;
    if (ch.length >= 2) { score += .3; good.push(`rhetorical choices named: ${ch.slice(0, 4).join(', ')}`); } else if (ch.length === 1) just.push(`Only one rhetorical choice is named (${ch[0]}); the second body paragraph needs its own.`); else { score -= .5; just.push('No rhetorical choice is named. Say what the speaker does (repeats, contrasts, addresses), not only what the speaker says.'); }
    if (fv >= paras.length) { score += .5; good.push(`${fv} sentence${fv === 1 ? '' : 's'} explain what a choice does`); } else if (ch.length) { score -= .3; just.push('Choices are named but their function is not explained: add "in order to", "which positions the audience to", "so that".'); }
    if (aud === paras.length) { score += .3; good.push('the audience is kept in view in every paragraph'); } else just.push('The audience disappears from at least one paragraph. Rhetoric is done to someone; name them.');
    const ctx = r.sentences.filter(s => s.para === 0).some(s => CONTEXT_RE.test(s.text));
    if (ctx) good.push('the introduction places the speech in its moment'); else just.push('The introduction does not name the occasion (who spoke, to whom, when, amid what).');
  }
  if (q === 3) {
    const exN = (ex || []).length;
    const bodyText = bodyParas.flatMap(p => p.sentences.map(i => r.sentences[i].text)).join(' ');
    const stock = [...new Set((bodyText.match(new RegExp(STOCK_EXAMPLES.source, 'gi')) || []).map(x => x.toLowerCase()))].length;
    if (exN >= 2) { score += .4; good.push(`${exN} specific examples carry the argument`); } else if (exN === 1) just.push('One specific example across two body paragraphs; each paragraph wants its own.'); else { score -= .8; just.push('No specific example is named. Argument needs cases: a named event, text, figure, or something you saw.'); }
    if (stock >= 2 || (stock >= 1 && stock * 2 >= Math.max(1, exN))) { score -= .4; just.push(`${stock} stock example${stock === 1 ? '' : 's'}. Readers see these in thousands of essays; one of your own would stand out.`); }
    const qual = paras.some(p => p.qualifies);
    if (qual) { score += .4; good.push('the position is qualified or a counterargument is met'); } else just.push('No qualification or counterargument. Conceding one thing makes the rest more believable.');
  }
  return { score: clamp(Math.round(score), 1, 6), level: level(score), good, just, paras, sources: allSources };
}

/* ------------------------------------------------------------------ rubric rows */
function rubric(r, q, integration, support) {
  const th = r.thesis;
  const thesisText = th ? th.sentences.map(s => s.text).join(' ') : '';
  const rowA = { points: 0, max: 1, why: [] };
  if (!th || !th.what.ok) rowA.why.push(th && th.what.about ? 'The thesis names a topic but takes no position.' : 'No defensible thesis found in the introduction.');
  else {
    let ok = true;
    if (q === 2 && !(CHOICE_WORDS.test(thesisText) || th.how.ok)) { ok = false; rowA.why.push('For Q2 the thesis must name rhetorical choices, or at least the means by which the speaker works.'); }
    if ((q === 1 || q === 3) && !(POSITION_RE.test(thesisText) || th.what.strong)) { ok = false; rowA.why.push('For Q1 and Q3 the thesis must take a position (should, must, is wrong, is justified, only when).'); }
    if (/\b(?:is\s+(?:good|bad|interesting|important|effective|powerful))\b/i.test(thesisText) && !th.how.ok) { ok = false; rowA.why.push('"Effective" or "important" is not a position; it is a mood. Say what the speaker does and what it serves.'); }
    if (ok) { rowA.points = 1; rowA.why.push(th.what.strong ? `Defensible claim with a committed verb ("${th.what.verbs[0]}").` : 'A defensible claim is present; a stronger verb would sharpen it.'); }
  }
  const rowB = { points: 0, max: 4, why: [] };
  const s = support.score;
  rowB.points = s >= 5 ? 4 : s === 4 ? 3 : s === 3 ? 2 : s === 2 ? 1 : 0;
  if (q === 1 && support.sources.length < 3) rowB.points = Math.min(rowB.points, support.sources.length >= 2 ? 1 : 0);
  if (!rowA.points && rowB.points > 3) rowB.points = 3;
  rowB.why.push(['No evidence beyond restating the prompt.', 'Evidence is present but mostly summarized or listed.', 'Evidence with some explanation, but the explanation does not always serve the thesis.', 'Specific evidence, explained; the line of reasoning is mostly consistent.', 'Specific evidence, consistently explained, in a clear line of reasoning.'][rowB.points]);
  if (q === 1) rowB.why.push(`${support.sources.length} source${support.sources.length === 1 ? '' : 's'} cited.`);
  const rowC = { points: 0, max: 1, possible: false, signals: [], why: [] };
  const all = r.sentences.map(x => x.text).join(' ');
  const complexity = (all.match(/\b(?:yet|although|while|paradox|tension|complicat\w+|at\s+once|both\s+\w+\s+and|not\s+only|even\s+as|precisely\s+because|irony|ironically|and\s+yet)\b/gi) || []).length;
  if (complexity >= 3) rowC.signals.push(`complexity markers (${complexity})`);
  if (q === 2 && r.sentences.some(x => CONTEXT_RE.test(x.text)) && r.sentences.filter(x => AUDIENCE_RE.test(x.text)).length >= 3) rowC.signals.push('the rhetorical situation is kept in view');
  if (q !== 2 && r.sentences.some(x => QUALIFY_RE.test(x.text)) && r.sentences.filter(x => QUALIFY_RE.test(x.text)).length >= 2) rowC.signals.push('the argument qualifies itself more than once');
  const stylistic = r.totals.flags - r.totals.rigor - r.totals.precision;
  if (r.totals.rigor === 0 && r.totals.precision <= 1 && r.totals.sentences >= 12) rowC.signals.push('style is consistent: no hedges, overclaims, or vague terms');
  if (r.conclusion.returns && !r.conclusion.copied && th && th.why.ok) rowC.signals.push('the conclusion widens the Why rather than repeating it');
  rowC.possible = rowC.signals.length >= 3 && rowA.points === 1 && rowB.points >= 3;
  rowC.why.push(rowC.possible ? 'Several sophistication signals are present. A reader could award this point; the Clinic does not award it, because sophistication is a judgment about meaning, not shape.' : (rowC.signals.length ? 'Some signals of sophistication are present, not yet enough to expect the point.' : 'No sophistication signals yet: no tension held, no situation explored, no widening in the conclusion.'));
  const total = rowA.points + rowB.points + rowC.points;
  return { rowA, rowB, rowC, total, max: 6, estimate: total, range: rowC.possible ? [total, total + 1] : [total, total] };
}

/* ------------------------------------------------------------------ shape */
function shape(r) {
  const body = r.paragraphs.filter(p => p.kind === 'body').length;
  const hasIntro = r.paragraphs.length >= 1, hasConcl = r.paragraphs.length >= 3;
  const ok = hasIntro && body === 2 && hasConcl;
  const note = !hasIntro ? 'No paragraphs found.' : r.paragraphs.length === 1 ? 'One paragraph. The model is an introduction, two body paragraphs, and a conclusion.' : r.paragraphs.length === 2 ? 'Two paragraphs: an introduction and one body. Add a second body paragraph and a conclusion.' : body === 2 ? 'Introduction, two body paragraphs, conclusion: the model shape.' : body === 1 ? 'One body paragraph. The model asks for two, each with its own evidence and reading.' : `${body} body paragraphs. The model is two; a third is welcome only if each still carries its own evidence and reading.`;
  return { ok, intro: hasIntro, body, conclusion: hasConcl, note };
}

/* ------------------------------------------------------------------ strengths (turning toward the good) */
function strengths(r, q, integration, support, rub) {
  const out = [];
  if (r.thesis && r.thesis.what.ok && r.thesis.what.strong) out.push({ icon: 'claim', text: `A committed claim: "${r.thesis.what.verbs[0]}"` });
  if (r.thesis && r.thesis.how.ok) out.push({ icon: 'how', text: 'The thesis names its means' });
  if (r.thesis && r.thesis.why.ok) out.push({ icon: 'why', text: 'The thesis says why it matters' });
  if (r.conclusion.returns && !r.conclusion.copied) out.push({ icon: 'return', text: 'The conclusion returns to the Why in new words' });
  if (r.totals.summary === 0 && r.totals.body >= 4) out.push({ icon: 'analysis', text: 'No sentence merely retells' });
  if (r.totals.analysis >= r.totals.evidence && r.totals.evidence > 0) out.push({ icon: 'analysis', text: 'Reading outweighs quoting' });
  integration.good.slice(0, 2).forEach(g => out.push({ icon: 'quote', text: g[0].toUpperCase() + g.slice(1) }));
  support.good.slice(0, 2).forEach(g => out.push({ icon: 'evidence', text: g[0].toUpperCase() + g.slice(1) }));
  if (r.totals.rigor === 0) out.push({ icon: 'rigor', text: 'No hedges, overclaims, or floating "this shows"' });
  const seen = new Set();
  return out.filter(x => { if (seen.has(x.text)) return false; seen.add(x.text); return true; }).slice(0, 7);
}

/* ------------------------------------------------------------------ next moves (ranked) */
function nextMoves(r, q, integration, support, rub, sh) {
  const moves = [];
  if (!sh.ok) moves.push({ area: 'shape', text: sh.note });
  if (rub.rowA.points === 0) moves.push({ area: 'thesis', text: rub.rowA.why[0] });
  else if (r.thesis && r.thesis.flags.length) moves.push({ area: 'thesis', text: r.thesis.flags[0].recommend });
  support.just.slice(0, 3).forEach(j => moves.push({ area: 'evidence', text: j }));
  integration.just.slice(0, 2).forEach(j => moves.push({ area: 'quotation', text: j }));
  const rigor = r.sentences.flatMap(s => s.flags.filter(f => f.severity === 'rigor').map(f => ({ s, f })));
  const byCode = {};
  rigor.forEach(x => { byCode[x.f.code] = (byCode[x.f.code] || 0) + 1; });
  Object.entries(byCode).sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([code, n]) => { const f = rigor.find(x => x.f.code === code).f; moves.push({ area: 'rigor', text: `${f.label}${n > 1 ? ` (${n} sentences)` : ''}: ${f.recommend}` }); });
  if (r.conclusion.flags.length) moves.push({ area: 'conclusion', text: r.conclusion.flags[0].recommend });
  return moves.slice(0, 7);
}

function score(text, opts) {
  opts = opts || {};
  const q = [1, 2, 3].includes(Number(opts.question)) ? Number(opts.question) : 2;
  const r = C.read(text, opts);
  const recs = quotationRecords(r, q);
  const ex = q === 3 ? exampleRecords(r) : [];
  const integration = integrationScore(r, q, recs);
  const support = supportScore(r, q, recs, ex);
  const rub = rubric(r, q, integration, support);
  const sh = shape(r);
  return { question: QUESTIONS[q], read: r, shape: sh, integration, support, rubric: rub, strengths: strengths(r, q, integration, support, rub), moves: nextMoves(r, q, integration, support, rub, sh) };
}

return { score, quotationRecords, exampleRecords, integrationScore, supportScore, rubric, shape, LEVELS, QUESTIONS };
});
