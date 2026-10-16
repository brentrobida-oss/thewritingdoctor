/* The Sentence Clinic: a rule-based reader for student analytical essays.
   It splits an essay into sentences, names the job each sentence is doing, checks the thesis for
   What / How / Why, checks every topic sentence for What / How, checks that the conclusion returns
   to the Why, and flags the habits that weaken analytical rigor and philosophical precision.
   Every flag carries a question, a rewrite (with [bracketed slots] the student must fill), and a
   recommendation. No dictionary and no network: every judgment here is a pattern, so every judgment
   can be read, argued with, and corrected. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SentenceClinic = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

/* ------------------------------------------------------------------ lexicons */
const words = s => s.trim().split(/\s+/);
const STOP = new Set(words(`a an the and or but nor so yet for of in on at to by with from as into onto upon about over under
  between among through during before after above below up down out off than then that this these those there here
  it its it's he she they we you i me him her them us his their our your my mine ours yours theirs himself herself itself
  themselves ourselves is are was were be been being am do does did done doing have has had having will would shall should
  can could may might must ought not no nor only also very just even still too quite rather really such own same other
  another each every either neither both all any some many much few more most less least several both which who whom whose
  what when where why how if because while although though unless until whether since once however therefore thus hence
  moreover furthermore nevertheless nonetheless instead indeed again further also well way ways thing things one ones
  kind sort get gets got getting go goes going went gone make makes made making say says said see sees seen seem seems
  seemed take takes taken took give gives given gave come comes came use uses used using like lot lots know knows knew
  think thinks thought show shows showed shown s t re ve ll d m essay paragraph author text reader readers`));
const CLAIM_VERBS = new Set(words(`argues argue suggests suggest reveals reveal critiques critique exposes expose portrays
  portray presents present demonstrates demonstrate illustrates illustrate conveys convey depicts depict challenges challenge
  complicates complicate undermines undermine dramatizes dramatize insists insist warns warn asserts assert contends contend
  implies imply frames frame positions position constructs construct interrogates interrogate satirizes satirize indicts
  indict celebrates celebrate mourns mourn questions question employs employ functions function serves serve embodies embody
  exemplifies exemplify enacts enact stages stage resists resist refuses refuse rejects reject redefines redefine transforms
  transform renders render casts cast figures figure locates locate traces trace maps map stakes stake treats treat reads read
  mocks mock parodies parody romanticizes romanticize naturalizes naturalize destabilizes destabilize subverts subvert
  carries carry slides slide builds build performs perform turns widens widen narrows narrow denies deny grants grant withholds withhold
  suspends suspend delays delay postpones postpone defers defer anticipates anticipate mirrors mirror echoes echo inverts invert reverses reverse
  substitutes substitute replaces replace displaces displace troubles trouble haunts haunt animates animate drains drain empties empty fractures
  fracture splits split binds bind severs sever exceeds exceed outruns outrun recasts recast rewrites rewrite reframes reframe reimagines reimagine
  literalizes literalize punctures puncture deflates deflate inflates inflate magnifies magnify diminishes diminish isolates isolate estranges
  estrange condemns condemn absolves absolve accuses accuse indicts convicts convict demands demand compels compel forbids forbid permits permit
  licenses license refuses offers offer promises promise threatens threaten teaches teach disciplines discipline punishes punish rewards reward
  seduces seduce repels repel lures lure traps trap frees free liberates liberate confines confine imprisons imprison releases release conceals
  conceal hides hide unveils unveil masks mask unmasks unmask mimics mimic imitates imitate erodes erode dissolves dissolve hardens harden
  softens soften sharpens sharpen blunts blunt relocates relocate transfers transfer translates translate measures measure weighs weigh tests test
  pits pit forces force invites invite dares dare risks risk
  reinforces reinforce legitimizes legitimize distinguishes distinguish equates equate reduces reduce elevates elevate
  juxtaposes juxtapose contrasts contrast aligns align links link ties tie turns turn converts convert exposes blurs blur
  collapses collapse insists becomes become emerges emerge marks mark signals signal registers register`));
const WEAK_VERBS = new Set(words(`shows show is are was were uses use has have talks talk discusses discuss mentions mention
  describes describe tells tell says say deals deal gives give includes include contains contain explains explain`));
const DEVICES = words(`imagery diction syntax metaphor metaphors simile similes irony juxtaposition structure tone symbolism
  symbol symbols repetition allusion allusions characterization perspective setting dialogue motif motifs parallelism
  anaphora ethos pathos logos evidence example examples anecdote anecdotes statistic statistics contrast paradox
  personification hyperbole understatement allegory foreshadowing flashback enjambment meter rhyme alliteration assonance
  caesura volta stanza stanzas form narration narrator voice pacing detail details description connotation connotations
  denotation punctuation shift shifts oxymoron antithesis analogy analogies appeal appeals framing exemplification
  concession refutation counterargument qualification plot pronouns verbs adjectives nouns tense sentence sentences
  fragments questions apostrophe epigraph epithet euphemism litotes metonymy synecdoche onomatopoeia polysyndeton
  asyndeton chiasmus zeugma inversion listing cataloguing catalog ambiguity understatement tension pattern patterns
  scene scenes image images phrase phrases word words line lines title ending opening comparison comparisons`);
const DEVICE_PHRASES = [/point of view/i, /rhetorical questions?/i, /figurative language/i, /word choice/i,
  /sentence structure/i, /selection of detail/i, /first[- ]person/i, /third[- ]person/i, /free indirect/i, /stream of consciousness/i,
  /the (?:word|phrase|image|line|scene|title|verb|noun|adjective|pronoun|repetition|contrast|comparison) ["“']?\w/i];
const DEVICE_SET = new Set(DEVICES);
const HOW_PREP = /\b(?:through|via|by\s+(?:way\s+of\s+|means\s+of\s+)?|using|employing|deploying|relying\s+on|in\s+(?:its|his|her|their)\s+(?:use\s+of\s+)?|with\s+(?:its|his|her|their|an?\s+)?)/i;
const REASON_HOW = /\b(?:because|given\s+that|for\s+three\s+reasons|for\s+two\s+reasons|first(?:ly)?,|insofar\s+as|in\s+that|on\s+the\s+grounds)\b/i;
const PURPOSE_VERBS = words(`reveal suggest argue show expose critique warn insist remind force invite challenge question celebrate
  mourn indict demonstrate illuminate complicate affirm resist dramatize interrogate unsettle redefine implicate teach
  persuade convince move provoke recover restore refuse resist name make lay`);
const WHY_RE = new RegExp(`\\b(?:in\\s+order\\s+to|so\\s+that|so\\s+as\\s+to|ultimately|thereby|at\\s+stake|the\\s+stakes?|matters?\\s+because|which\\s+matters|why\\s+(?:this|it)\\s+matters|consequence|consequences|in\\s+doing\\s+so|as\\s+a\\s+result|the\\s+result\\s+is|the\\s+effect\\s+is|to\\s+(?:${PURPOSE_VERBS.join('|')})\\b|(?:reveal|suggest|warn|insist|argu|remind|expos|indict|critiqu|illuminat|complicat|affirm|implicat|teach|celebrat|mourn|dramatiz|interrogat)(?:ing|es|s)?\\s+that|not\\s+(?:only|merely|simply)\\s+.*\\bbut\\s+(?:also\\s+)?|larger|broader|finally|in\\s+the\\s+end|what\\s+is\\s+at\\s+stake|the\\s+cost|the\\s+danger|the\\s+point|the\\s+lesson|the\\s+purpose)\\b`, 'i');
const WHY_CLAUSE = /\b(in\s+order\s+to\b.*|so\s+that\b.*|ultimately\b.*|thereby\b.*|which\s+matters\b.*|matters?\s+because\b.*|at\s+stake\b.*|in\s+doing\s+so\b.*|as\s+a\s+result\b.*|to\s+(?:reveal|suggest|argue|show|expose|critique|warn|insist|remind|force|invite|challenge|question|demonstrate|illuminate|complicate|affirm|dramatize|interrogate)\b.*)/i;
const HEDGES = [/\bI\s+(?:think|believe|feel|guess|suppose)\s+(?:that\s+)?/g, /\bin\s+my\s+(?:personal\s+)?opinion,?\s*/gi, /\bpersonally,?\s*/gi,
  /\bit\s+seems\s+(?:to\s+me\s+)?(?:that\s+|like\s+)?/gi, /\bkind\s+of\s+/gi, /\bsort\s+of\s+/gi, /\bsomewhat\s+/gi, /\bbasically,?\s*/gi,
  /\bto\s+some\s+extent,?\s*/gi, /\bin\s+a\s+way,?\s*/gi, /\bin\s+some\s+ways,?\s*/gi, /\bI\s+would\s+say\s+(?:that\s+)?/g, /\bmaybe\s+/gi, /\bperhaps\s+/gi];
const ANNOUNCE = [/^in\s+this\s+(?:essay|paper|analysis),?\s+(?:I\s+(?:will|am\s+going\s+to|shall)\s+(?:argue|show|discuss|prove|explain|explore|examine|analyze|demonstrate)\s+(?:that\s+|how\s+)?)?/i,
  /^this\s+(?:essay|paper|paragraph|analysis)\s+(?:will|is\s+going\s+to|aims\s+to|seeks\s+to)\s+(?:argue|show|discuss|prove|explain|explore|examine|analyze|demonstrate|focus\s+on)\s+(?:that\s+|how\s+)?/i,
  /^I\s+(?:will|am\s+going\s+to|shall)\s+(?:now\s+)?(?:argue|show|discuss|prove|explain|explore|examine|analyze|demonstrate|be\s+discussing|be\s+analyzing)\s+(?:that\s+|how\s+)?/i,
  /^(?:the\s+following|these)\s+paragraphs?\s+will\s+\w+\s+/i, /^as\s+I\s+will\s+(?:show|argue|demonstrate),?\s*/i, /^(?:first|second|third|next|lastly|finally),?\s+I\s+will\s+\w+\s+/i];
const CONCLUSION_OPENERS = /^(?:in\s+conclusion|to\s+conclude|in\s+summary|to\s+sum\s+up|in\s+closing|all\s+in\s+all|overall|in\s+the\s+end|as\s+(?:you|one|we)\s+can\s+see|as\s+shown\s+above|as\s+(?:I|this\s+essay)\s+(?:have|has)\s+(?:shown|argued|demonstrated)),?\s*/i;
const OVERCLAIM_RE = /\b(proves?|proved|proven|clearly|obviously|undeniably|undoubtedly|unquestionably|without\s+a\s+doubt|it\s+is\s+a\s+fact|everyone\s+knows|no\s+one\s+can\s+deny|always|never|all\s+people|every\s+person|everyone|everybody|no\s+one|nobody|the\s+only|completely|totally|perfectly|definitely|absolutely|in\s+every\s+way|throughout\s+(?:all\s+of\s+)?history|since\s+the\s+(?:dawn|beginning)\s+of\s+(?:time|history|man(?:kind)?|humanity))\b/gi;
const VAGUE_RE = /\b(things?(?!\s+(?:that|which|they|he|she|it|we|you|i)\b)|stuff|a\s+lot(?:\s+of)?|lots\s+of|very|really|extremely|incredibly|good|bad|great|interesting|important|big|huge|many\s+people|some\s+people|most\s+people|people(?!\s+(?:who|whom|whose|that|it|in|of|like|such|he|she|they|we|you|i)\b)|today'?s\s+society|in\s+today'?s\s+world|modern\s+society|society|relatable|relevant|impactful|unique|powerful|effective(?:ly)?|different|various|certain|numerous|countless|a\s+lot|in\s+many\s+ways|positive|negative|meaningful|deep(?:er)?\s+meaning|hidden\s+meaning|the\s+message|message|affects?\s+the\s+reader|grabs?\s+the\s+reader'?s?\s+attention|makes\s+the\s+reader\s+(?:think|feel|wonder)|paints\s+a\s+picture|vivid|flows?|creates?\s+a\s+(?:sense|feeling|mood|tone)\s+of|a\s+sense\s+of|huge|a\s+number\s+of)\b/gi;
const ABSTRACT = words(`freedom liberty justice truth identity power nature society humanity reality morality evil love death
  meaning happiness success beauty knowledge faith fate consciousness self individuality community culture tradition progress
  civilization innocence experience violence chaos authority desire memory loss hope fear home belonging otherness
  oppression equality democracy god religion art language silence voice agency wisdom virtue goodness greed ambition pride guilt
  shame honor duty loyalty betrayal corruption purity sin redemption salvation suffering trauma healing growth maturity childhood
  adulthood gender race class capitalism patriarchy colonialism modernity history destiny purpose existence being nothingness
  absurdity alienation isolation connection intimacy masculinity femininity sexuality normality madness sanity reason emotion
  passion logic science technology money wealth poverty privilege status fame beauty ugliness perfection imperfection`);
const ABSTRACT_PHRASES = [/human\s+nature/i, /the\s+human\s+condition/i, /free\s+will/i, /the\s+american\s+dream/i, /the\s+other/i, /the\s+self/i, /coming\s+of\s+age/i, /good\s+and\s+evil/i, /right\s+and\s+wrong/i];
const DEFINING = /\b(?:that\s+is|i\.e\.|meaning|defined\s+as|by\s+which\s+I\s+mean|in\s+the\s+sense\s+(?:of|that)|understood\s+(?:here\s+)?as|namely|specifically|not\s+\w+\s+but|the\s+kind\s+of|a\s+kind\s+of|the\s+sort\s+of|rather\s+than|is\s+(?:not\s+)?(?:a|an)\s+(?:form|kind|sort|species|mode|version)\s+of|is\s+not\s+\w+\s+but|less\s+\w+\s+than|what\s+\w+\s+calls?|in\s+\w+'?s?\s+sense|as\s+\w+\s+(?:defines?|uses?)\s+(?:it|the\s+term))\b|[:—]\s*\w|\(\s*\w/i;
const AGENTLESS_SUBJ = /^(?:society|the\s+world|people|the\s+government|the\s+media|history|humans|humanity|mankind|everyone|everybody|we\s+as\s+a\s+society|our\s+society|today'?s\s+society|the\s+system|life|the\s+universe|human\s+beings|humankind|culture|america|the\s+public|the\s+masses)\s+(?:\w+s|is|are|has|have|was|were|tells|teaches|wants|expects|makes|forces|believes|thinks|says|sees|views)\b/i;
const PASSIVE_RE = /\b(?:is|are|was|were|be|been|being)\s+(?:often\s+|widely\s+|generally\s+|commonly\s+|usually\s+)?(seen|considered|believed|viewed|regarded|known|thought|said|understood|portrayed|shown|described|presented|depicted|perceived|judged|deemed|labeled|labelled|defined|interpreted|read|taken|meant|expected|assumed|supposed)\b(\s+(?:as|to\s+be|to)\b)?(?![^.]*\bby\b)/i;
const PRESENT = { seen: 'sees', considered: 'considers', believed: 'believes', viewed: 'views', regarded: 'regards', known: 'knows', thought: 'thinks', said: 'says',
  understood: 'understands', portrayed: 'portrays', shown: 'shows', described: 'describes', presented: 'presents', depicted: 'depicts', perceived: 'perceives',
  judged: 'judges', deemed: 'deems', labeled: 'labels', labelled: 'labels', defined: 'defines', interpreted: 'interprets', read: 'reads', taken: 'takes',
  meant: 'means', expected: 'expects', assumed: 'assumes', supposed: 'supposes' };
const BINARY_RE = /\b(?:either\s+\w+[^.]*\bor\b|the\s+only\s+(?:way|reason|thing|option|choice)|there\s+is\s+no\s+other|no\s+choice\s+but|nothing\s+more\s+than|simply\s+a|just\s+a|merely\s+a|black\s+and\s+white|one\s+of\s+two|must\s+choose\s+between|is\s+either)\b/i;
const CAUSAL_RE = /\b(causes?|caused|leads?\s+to|led\s+to|results?\s+in|resulted\s+in|due\s+to|because\s+of\s+this|this\s+is\s+why|is\s+the\s+reason\s+(?:why|that|for)|brings?\s+about)\b/i;
const MECHANISM_RE = /\b(?:by\s+\w+ing|through|when|whenever|as\s+(?:soon\s+as|long\s+as)|since|via|so\s+that|which\s+(?:in\s+turn|then)|in\s+turn|step|first|then|once|each\s+time|every\s+time|the\s+moment|insofar|because\s+(?!of\s+this))\b/i;
const THIS_SHOWS = /^(?:this|that|it|these|those|which|here|the\s+quote|this\s+quote|the\s+quotation|this\s+quotation|this\s+passage|this\s+evidence|this\s+example|the\s+evidence)\s+(?:clearly\s+|really\s+|also\s+|further\s+)?(shows|proves|means|demonstrates|illustrates|indicates|suggests|reveals|represents|symbolizes|is\s+saying|is\s+showing|tells\s+(?:us|the\s+reader)|portrays|conveys|highlights|signifies|exemplifies|displays|emphasizes|is\s+important|is\s+significant|relates|connects|supports)\b/i;
const ANALYTIC_RE = /\b(?:because|not\s+(?:a|an|the)?\s*\w+\s+but|is\s+not\s+\w+|suggests?|reveals?|implies|implying|therefore|which\s+means|signals?|indicates?|so\s+that|in\s+order\s+to|as\s+a\s+result|consequently|thus|thereby|functions?|serves?\s+to|the\s+effect|connotes?|evokes?|underscores?|emphasizes?|complicates?|undercuts?|exposes?|positions?|the\s+reader|readers|audience|significance|significant|matters?|stakes?|insists?|registers?|marks?|refuses?|resists?|frames?|renders?|enacts?|stages?|the\s+word|the\s+phrase|the\s+image|the\s+verb|the\s+noun|the\s+adjective|the\s+pronoun|the\s+repetition|the\s+contrast|the\s+shift|the\s+comparison|rather\s+than|not\s+only|instead\s+of|even\s+as|precisely|paradoxically|ironically|tellingly|crucially|strikingly|notably|the\s+choice|the\s+decision\s+to|the\s+fact\s+that|what\s+(?:this|the)\s+\w+\s+(?:does|reveals|suggests|exposes))\b/i;
const EVIDENCE_RE = /(?:["“][^"”]{12,}["”]|\baccording\s+to\b|\b(?:writes|states|notes|observes|claims|declares|remarks|recounts|recalls|admits|concedes|laments|asks|wonders|exclaims|announces|confesses)\b\s*(?:,|that|:|["“])|\(\s*(?:p\.?|pp\.?|pg\.?|page|line|l\.|ll\.|lines|ch\.|chapter|act|scene|\d+)[^)]*\)|\b(?:in\s+(?:line|lines|chapter|act|scene|stanza|paragraph|the\s+passage|the\s+poem|the\s+novel|the\s+first|the\s+second|the\s+final|the\s+last)\b)|\bfor\s+(?:example|instance)\b|\d+\s*(?:%|percent)|\b(?:a\s+)?(?:study|survey|report|poll)\s+(?:by|from|found|shows)\b|\bthe\s+(?:text|author|poet|speaker|narrator|passage|poem|novel|essay|speech|play|story)\s+(?:says|reads|states|goes|describes|opens|begins|ends|closes)\b)/i;
const NARRATIVE_RE = /\b(?:then|after\s+that|afterwards|next|later|at\s+the\s+beginning|in\s+the\s+beginning|at\s+the\s+end|in\s+the\s+end|eventually|finally|goes\s+to|decides?\s+to|decided\s+to|went\s+to|in\s+(?:chapter|act|scene|part)\s+\w+|one\s+day|that\s+night|the\s+next\s+(?:day|morning)|meanwhile|during|while\s+(?:he|she|they)|when\s+(?:he|she|they|the)|after\s+(?:he|she|they|the)|before\s+(?:he|she|they|the)|happens|happened|takes\s+place|the\s+story\s+(?:begins|starts|follows|is\s+about)|is\s+about\s+a|tells\s+the\s+story)\b/i;
const PAST_IRREG = new Set(words(`went came said told took saw made got became began left found gave knew thought felt died killed met ran fell
  kept held brought stood sat lost won wrote read ate drank spoke broke chose drove fought forgot grew heard hid hit led lay paid
  put rose sent shot shut slept sold sang swam taught threw understood wore woke tried cried asked wanted started looked
  walked moved returned arrived married loved hated watched called turned learned realized decided followed waited`));
const TEXT_NOUNS = /\b(?:novel|poem|story|play|essay|speech|passage|text|memoir|narrative|chapter|scene|sonnet|book|film|article|letter|address|author|poet|speaker|narrator|writer|playwright|essayist|novelist|protagonist|character|persona|orator|rhetor)\b/i;
const SUMMARY_PATTERN_PRONOUN = /^(?:he|she|they|it|the\s+\w+)\s+(?:then\s+|also\s+|later\s+)?\w+(?:ed|s)?\b/i;
const QUESTION_WORD_RE = /^(?:what|why|how|who|where|when|is|are|do|does|did|can|could|should|would|have|has|will|isn't|aren't|don't|doesn't)\b/i;
const DICTIONARY_RE = /\b(?:webster'?s?|merriam|the\s+dictionary|oxford\s+(?:english\s+)?dictionary|dictionary\.com)\s+(?:defines|definition|says)|\bis\s+defined\s+as\b/i;
const FIRST_PERSON_HOOK = /^(?:have\s+you\s+ever|imagine|picture\s+this|what\s+if\s+you|think\s+about)/i;

/* ------------------------------------------------------------------ small helpers */
function stem(w) {
  w = w.toLowerCase().replace(/[^a-z']/g, '').replace(/'s$/, '').replace(/'$/, '');
  if (w.length <= 3) return w;
  const rules = [[/ization$/, 'ize'], [/isation$/, 'ise'], [/ousness$/, 'ous'], [/fulness$/, 'ful'], [/iveness$/, 'ive'], [/ations?$/, 'ate'],
    [/tions?$/, 't'], [/sions?$/, 's'], [/ments?$/, ''], [/ities$/, 'ity'], [/ies$/, 'y'], [/ingly$/, ''], [/edly$/, ''], [/ally$/, 'al'],
    [/fully$/, 'ful'], [/ously$/, 'ous'], [/ly$/, ''], [/ings?$/, ''], [/ied$/, 'y'], [/ied$/, 'y'], [/ed$/, ''], [/ers?$/, ''], [/ness$/, ''],
    [/ism$/, ''], [/ist$/, ''], [/ous$/, ''], [/ive$/, ''], [/able$/, ''], [/ible$/, ''], [/ful$/, ''], [/less$/, ''], [/es$/, ''], [/s$/, '']];
  for (const [re, rep] of rules) { if (re.test(w)) { const n = w.replace(re, rep); if (n.length >= 3) { w = n; break; } } }
  return w.replace(/(.)\1$/, '$1').replace(/e$/, '');
}
function matchesSkippingNames(text, re) {
  // Matches of a lexicon inside a sentence, skipping words that are capitalized mid-sentence (titles and names).
  const out = [];
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m;
  while ((m = g.exec(text))) {
    const first = m[0][0];
    const atStart = m.index === 0 || /^["“‘'(\s]*$/.test(text.slice(0, m.index));
    if (first === first.toUpperCase() && first !== first.toLowerCase() && !atStart) continue;
    out.push(m[0]);
  }
  return out.length ? out : null;
}
function tokens(text) { return (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []).map(t => t.replace(/’/g, "'")); }
function contentStems(text) {
  const out = new Set();
  tokens(text).forEach(t => { const l = t.toLowerCase(); if (!STOP.has(l) && l.length > 2) out.add(stem(l)); });
  return out;
}
function overlap(a, b) { const out = []; a.forEach(x => { if (b.has(x)) out.push(x); }); return out; }
function wordCount(text) { return tokens(text).length; }
function cap(s) { return s.replace(/^(["“‘'(\s]*)([a-z])/, (m, q, c) => q + c.toUpperCase()); }
const STARTERS = new Set(words(`the a an he she they it we you i this that these those in on at when while after before as if since because society people
  although though one once his her their its our my your there here what where why how who whom whose which but and or so yet for nor
  from with by through during until unless whether however therefore thus then there`));
function lowerFirst(s) {
  return s.replace(/^(["“‘'(\s]*)([A-Z])([a-z']*)(?=\b)/, (m, q, c, rest) => STARTERS.has((c + rest).toLowerCase()) ? q + c.toLowerCase() + rest : m);
}
function trimEnd(s) { return s.replace(/[.!?]+["”’']?\s*$/, ''); }
function endMark(s) { const m = s.match(/([.!?]+)(["”’']?)\s*$/); return m ? m[1] + m[2] : '.'; }
function isQuestion(s) { return /\?["”’']?\s*$/.test(s.trim()); }
function quotedSpans(s) { return (s.match(/["“][^"”]+["”]/g) || []); }
function quotedShare(s) { const q = quotedSpans(s).join(' '); return wordCount(s) ? wordCount(q) / wordCount(s) : 0; }
function properNouns(s) {
  const toks = s.replace(/^["“‘']+/, '').split(/\s+/);
  const out = [];
  toks.forEach((t, i) => {
    const w = t.replace(/^[("“‘']+|[)",.;:!?”’']+$/g, '');
    if (!/^[A-Z][a-z]+$/.test(w)) return;
    if (i === 0) return;
    if (STOP.has(w.toLowerCase()) || /^(?:The|This|That|These|Those|When|While|Because|Although|In|On|At|By|For|With|Through|As|If|Since|After|Before|Yet|But|And|Or|So|Thus|Here|There|However|Instead|Rather|Then|First|Second|Third|Finally|Ultimately|Indeed|Yes|No)$/.test(w)) return;
    out.push(w);
  });
  return out;
}
function devicesIn(s) {
  const found = new Set();
  tokens(s).forEach(t => { const l = t.toLowerCase(); if (DEVICE_SET.has(l)) found.add(l); });
  DEVICE_PHRASES.forEach(re => { const m = s.match(re); if (m) found.add(m[0].toLowerCase().replace(/\s+/g, ' ')); });
  return [...found];
}
function claimVerbs(s) { const out = []; tokens(s).forEach(t => { const l = t.toLowerCase(); if (CLAIM_VERBS.has(l)) out.push(l); }); return out; }
function weakVerbs(s) { const out = []; tokens(s).forEach(t => { const l = t.toLowerCase(); if (WEAK_VERBS.has(l)) out.push(l); }); return out; }
function abstractionsIn(s) {
  const found = [];
  tokens(s).forEach(t => { const l = t.toLowerCase(); if (ABSTRACT.includes(l)) found.push(l); });
  ABSTRACT_PHRASES.forEach(re => { const m = s.match(re); if (m) found.push(m[0].toLowerCase()); });
  return [...new Set(found)];
}
function pastTenseCount(s) {
  let n = 0;
  tokens(s).forEach(t => { const l = t.toLowerCase(); if (PAST_IRREG.has(l) || (/[a-z]{3,}ed$/.test(l) && !/(?:need|indeed|seed|feed|bleed|breed|speed|deed|creed|greed|freed|agreed|proceed|succeed|exceed|hundred|sacred|hatred|kindred|wicked|naked|rugged|ragged|jagged|crooked|wretched|learned|blessed|beloved|red|bed|shed|sled|fled|led|wed|bred|shred)$/.test(l))) n++; });
  return n;
}

/* ------------------------------------------------------------------ splitting */
const ABBR = new Set(words(`mr mrs ms dr prof sr jr st vs etc e.g i.e no vol ch pp p fig al ed eds trans approx cf esp viz gen rev hon
  col lt sgt capt mt ft ave inc ltd co u.s u.k a.m p.m b.c a.d ca c jan feb mar apr jun jul aug sep sept oct nov dec`));
function splitParagraphs(text) {
  // Every line break is a paragraph break (a paste from Google Docs gives single newlines), except
  // a hard-wrapped line: the previous line does not end a sentence, or this line starts in lowercase.
  const out = [];
  const norm = text.replace(/\r\n?/g, '\n');
  const re = /[^\n]+/g;
  let m;
  while ((m = re.exec(norm))) {
    const line = m[0];
    if (!line.trim()) continue;
    const prev = out[out.length - 1];
    const gapBlank = prev && /\n\s*\n/.test(norm.slice(prev.end, m.index));
    const prevOpen = prev && !/[.!?]["”’')\]]*\s*$/.test(prev.text);
    const startsLower = /^\s*[a-z]/.test(line);
    if (prev && !gapBlank && (prevOpen || startsLower)) { prev.text += ' ' + line.trim(); prev.end = m.index + line.length; continue; }
    out.push({ text: line.trim(), start: m.index + (line.length - line.trimStart().length), end: m.index + line.length });
  }
  return out;
}
function splitSentences(para, offset) {
  const out = [];
  const t = para;
  let start = 0;
  const n = t.length;
  for (let i = 0; i < n; i++) {
    const ch = t[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;
    let j = i;
    while (j + 1 < n && /[.!?]/.test(t[j + 1])) j++;
    let k = j + 1;
    while (k < n && /["”’')\]]/.test(t[k])) k++;
    if (k < n && !/\s/.test(t[k])) { i = j; continue; }
    let m = k;
    while (m < n && /\s/.test(t[m])) m++;
    if (m < n) {
      const next = t[m];
      if (!/[A-Z0-9"“‘'(\[]/.test(next)) { i = j; continue; }
      if (ch === '.' && j === i) {
        const before = t.slice(Math.max(0, i - 12), i).match(/([A-Za-z.]+)$/);
        if (before) {
          const w = before[1].toLowerCase().replace(/^\.+/, '');
          if (ABBR.has(w) || ABBR.has(w.replace(/\.$/, '')) || /^[a-z]$/.test(w)) { i = j; continue; }
          if (/^[A-Z]$/.test(before[1]) && /^[A-Z]/.test(next)) { i = j; continue; }
        }
      }
    }
    const raw = t.slice(start, k);
    if (raw.trim()) out.push({ text: raw.trim(), start: offset + start + (raw.length - raw.trimStart().length), end: offset + k });
    start = k;
    i = k - 1;
  }
  const rest = t.slice(start);
  if (rest.trim()) out.push({ text: rest.trim(), start: offset + start + (rest.length - rest.trimStart().length), end: offset + n });
  return out;
}

/* ------------------------------------------------------------------ flag builders */
function flag(code, severity, label, note, extra) {
  return Object.assign({ code, severity, label, note }, extra || {});
}
function stripHedges(s) {
  let out = s;
  HEDGES.forEach(re => { out = out.replace(re, ''); });
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
  return cap(out);
}
function stripAnnouncement(s) {
  let out = s;
  ANNOUNCE.forEach(re => { out = out.replace(re, ''); });
  return cap(out.trim());
}
function stripOverclaims(s) {
  return s.replace(/\b(?:clearly|obviously|undeniably|undoubtedly|unquestionably|definitely|absolutely|completely|totally|perfectly)\s+/gi, '')
    .replace(/\bwithout\s+a\s+doubt,?\s*/gi, '').replace(/\bit\s+is\s+a\s+fact\s+that\s+/gi, '').replace(/\beveryone\s+knows\s+(?:that\s+)?/gi, '')
    .replace(/\bno\s+one\s+can\s+deny\s+(?:that\s+)?/gi, '').replace(/\bproves\b/gi, 'suggests').replace(/\bproved\b/gi, 'suggested').replace(/\bproven\b/gi, 'suggested').replace(/\bprove\b/gi, 'suggest')
    .replace(/\balways\b/gi, '[always? name the cases you can show]').replace(/\bnever\b/gi, '[never? name the cases you can show]')
    .replace(/\b(?:everyone|everybody|all\s+people|every\s+person)\b/gi, '[which people, exactly?]').replace(/\b(?:no\s+one|nobody)\b/gi, '[who, exactly, does not?]')
    .replace(/\b(?:throughout\s+(?:all\s+of\s+)?history|since\s+the\s+(?:dawn|beginning)\s+of\s+(?:time|history|man(?:kind)?|humanity))\b,?\s*/gi, '')
    .replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}
function replaceVague(s) {
  return s.replace(/\b(?:a\s+lot\s+of|lots\s+of)\b/gi, '[how many? which?]').replace(/\bthings\b/gi, '[name them]').replace(/\bthing\b/gi, '[name it]').replace(/\bstuff\b/gi, '[name it]')
    .replace(/\b(?:very|really|extremely|incredibly)\s+/gi, '').replace(/\b(?:today'?s\s+society|modern\s+society|in\s+today'?s\s+world|society)\b/gi, '[which group, institution, or era?]')
    .replace(/\b(?:many|some|most)\s+people\b/gi, '[who, specifically?]').replace(/\bpeople\b/gi, '[which people?]')
    .replace(/\b(?:huge|big)\b/gi, '[how large? give the measure]').replace(/\b(?:creates?\s+)?a\s+(?:sense|feeling|mood|tone)\s+of\b/gi, '[name the exact effect, not "a sense of"]')
    .replace(/\b(good|bad|great|interesting|important|powerful|effective|unique|relatable|impactful|meaningful)\b/gi, (m) => `[${m.toLowerCase()} in what precise respect?]`)
    .replace(/\s{2,}/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

/* ------------------------------------------------------------------ sentence-level checks */
function checkSentence(s, ctx) {
  const flags = [];
  const text = s.text;
  const wc = wordCount(text);
  const role = s.role;
  const body = trimEnd(text);
  const mark = endMark(text);

  // hedging
  let hedgeHits = 0; HEDGES.forEach(re => { const m = text.match(re); if (m) hedgeHits += m.length; });
  if (hedgeHits) flags.push(flag('hedge', 'rigor', 'Hedged claim', `${hedgeHits === 1 ? 'A hedge' : hedgeHits + ' hedges'} ("I think", "kind of", "it seems") asks the reader to excuse the claim before it is made.`, {
    question: 'If you deleted the hedge, what would you have to prove? Can you prove it? Then delete it.',
    rewrite: stripHedges(text),
    recommend: 'State the claim bare. Qualify with evidence ("in the final stanza") rather than with doubt ("kind of").' }));

  // announcement
  if (ANNOUNCE.some(re => re.test(text))) flags.push(flag('announce', 'style', 'Announcement', 'The sentence tells the reader what the essay will do instead of doing it.', {
    question: 'What is the claim underneath the announcement?',
    rewrite: stripAnnouncement(text),
    recommend: 'Cut the frame and let the claim stand as the sentence.' }));

  // conclusion opener
  if (CONCLUSION_OPENERS.test(text) && (role === 'conclusion' || ctx.paraIndex === ctx.paraCount - 1)) flags.push(flag('conc-opener', 'style', 'Signposted conclusion', 'The reader knows this is the last paragraph. "In conclusion" spends the first words on a signpost.', {
    question: 'What is the first thing your conclusion actually says once the signpost is gone?',
    rewrite: cap(text.replace(CONCLUSION_OPENERS, '')),
    recommend: 'Open the conclusion by returning to the Why in new words.' }));

  // overclaim
  const over = matchesSkippingNames(text, OVERCLAIM_RE);
  if (over) flags.push(flag('overclaim', 'rigor', 'Overclaim', `"${[...new Set(over.map(x => x.toLowerCase()))].join('", "')}" claims more than any passage can prove.`, {
    question: 'Which exact lines license this certainty? If the answer is "none", what is the claim you can actually hold?',
    rewrite: stripOverclaims(text),
    recommend: '"Proves" becomes "suggests" or "insists"; "always" and "everyone" become the cases and the people you can name.' }));

  // vague
  const vague = matchesSkippingNames(text, VAGUE_RE);
  if (vague) {
    const uniq = [...new Set(vague.map(x => x.toLowerCase().replace(/\s+/g, ' ')))];
    flags.push(flag('vague', 'precision', 'Vague term', `"${uniq.join('", "')}": ${uniq.length === 1 ? 'a word' : 'words'} that could sit in any essay about any text.`, {
      question: `What is the exact word you are avoiding when you write "${uniq[0]}"?`,
      rewrite: replaceVague(text),
      recommend: 'Replace the placeholder with the specific noun, quality, or group. If no specific word exists, the thought is not finished yet.' }));
  }

  // this shows
  if (THIS_SHOWS.test(text)) {
    const m = text.match(THIS_SHOWS);
    const hasBecause = /\bbecause\b/i.test(text);
    flags.push(flag('this-shows', 'rigor', 'Floating "this"', `"${m[0]}" points at the evidence without naming the part of it that does the work${hasBecause ? '.' : ', and gives no mechanism (no "because").'}`, {
      question: 'Which word, image, or structural choice in the quotation carries the meaning you claim? Name it as the subject.',
      rewrite: cap(text.replace(THIS_SHOWS, (whole, verb) => `[The specific word or image] ${verb}`)) + (hasBecause ? '' : ' [because: what in the wording makes this reading necessary?]'),
      recommend: 'Make the detail the subject of the sentence, then give the mechanism after "because".' }));
  }

  // quote dump
  const qShare = quotedShare(text);
  const quotes = quotedSpans(text);
  const framed = quotes.length ? wordCount(text.slice(0, text.search(/["“]/))) >= 2 : true;
  if (quotes.length && !framed && (qShare >= 0.5 || /["”][^A-Za-z]*$/.test(text.trim()))) flags.push(flag('quote-dump', 'rigor', 'Unframed quotation', 'The quotation stands alone. Nobody introduces it and nobody reads it.', {
    question: 'Who says this, where, and which word in it are you about to read closely?',
    rewrite: `[Author or speaker] [writes / insists / admits] that ${quotes[0]} [(citation)], a phrase whose [word or image] [does what to the meaning?].`,
    recommend: 'Frame the quotation with its speaker and situation, then spend the next sentence on one of its words.' }));
  else if (quotes.length && qShare >= 0.6 && wordCount(text) > 30 && !ANALYTIC_RE.test(text)) flags.push(flag('quote-heavy', 'rigor', 'Quotation outweighs reading', 'More of this sentence is quoted than argued.', {
    question: 'Which four words of the quotation matter? Could you cut the rest?',
    recommend: 'Quote the phrase, not the passage. Keep what you will read and paraphrase the rest.' }));

  // rhetorical question in body
  if (isQuestion(text) && role !== 'intro') flags.push(flag('question', 'rigor', 'Question in place of a claim', 'A question hands the work to the reader. The essay owes an answer.', {
    question: `What is your answer to "${body}?" in one sentence?`,
    rewrite: `[Your answer to "${body}?"], because [the evidence that forces that answer].`,
    recommend: 'Convert the question into the claim it implies, then support it.' }));
  else if (isQuestion(text) && role === 'intro') flags.push(flag('hook-question', 'style', 'Question hook', 'The opening question is a common hook. It works only when the essay answers it with a thesis.', {
    question: 'Does your thesis answer this question? If not, why open with it?',
    recommend: 'Either answer the question in the thesis or replace the hook with a concrete observation about the text.' }));

  // dictionary opener / universal history
  if (DICTIONARY_RE.test(text)) flags.push(flag('dictionary', 'precision', 'Dictionary definition', 'A dictionary gives the general sense. Your argument needs the sense the text puts into play.', {
    question: 'How does the text itself define or complicate this word? Start there.',
    recommend: 'Replace the dictionary with the first moment the text uses or tests the term.' }));
  if (FIRST_PERSON_HOOK.test(text)) flags.push(flag('hook', 'style', 'Address-the-reader hook', 'The "Have you ever" opening speaks to the reader instead of about the text.', {
    question: 'What does the text do in its first lines that you could open with instead?',
    recommend: 'Open on an observed detail or a tension in the text.' }));

  // passive without agent
  const pm = text.match(PASSIVE_RE);
  if (pm) {
    const verb = pm[1].toLowerCase();
    const subj = text.slice(0, pm.index).trim();
    const rest = text.slice(pm.index + pm[0].length).trim();
    const prep = (pm[2] || '').trim();
    const simple = subj && wordCount(subj) <= 6;
    flags.push(flag('passive', 'precision', 'Agentless passive', `"${pm[0].trim()}" hides who is doing the seeing, considering, or portraying.`, {
      question: `Who ${PRESENT[verb] || verb} this? The author, a character, a culture, you?`,
      rewrite: simple ? cap(`[Who?] ${PRESENT[verb] || verb} ${lowerFirst(subj)}${prep ? ' ' + prep : ''} ${rest}`.replace(/\s+/g, ' ')) : cap(text.replace(PASSIVE_RE, `[who?] ${PRESENT[verb] || verb} [it]${prep ? ' ' + prep : ''}`)),
      recommend: 'Name the agent. Whose judgment is this, and does the text share it or expose it?' }));
  }

  // agentless abstraction as subject
  if (AGENTLESS_SUBJ.test(text)) {
    const m = text.match(AGENTLESS_SUBJ);
    const subj = m[0].split(/\s+/).slice(0, -1).join(' ');
    flags.push(flag('agentless', 'precision', 'Abstraction as agent', `"${subj}" is doing the acting. Abstractions do not act; institutions, speakers, and characters do.`, {
      question: `Which institution, speaker, or character stands behind "${subj}" in this text?`,
      rewrite: cap(text.replace(new RegExp('^' + subj.replace(/\s+/g, '\\s+'), 'i'), '[Which institution, speaker, or character?]')),
      recommend: 'Replace the abstraction with the agent the text actually shows.' }));
  }

  // binary framing
  if (BINARY_RE.test(text)) flags.push(flag('binary', 'precision', 'Binary framing', `"${text.match(BINARY_RE)[0]}" closes off the middle, where most texts live.`, {
    question: 'What third possibility does the text itself entertain? Why rule it out?',
    recommend: 'Replace "the only" and "either/or" with the range the text actually offers, then argue for the reading you prefer.' }));

  // causal claim without mechanism
  if (CAUSAL_RE.test(text) && !MECHANISM_RE.test(text) && role !== 'thesis') flags.push(flag('causal', 'rigor', 'Cause without mechanism', `"${text.match(CAUSAL_RE)[0]}" asserts a cause but shows no steps.`, {
    question: 'By what steps does the cause produce the effect? What happens in between?',
    rewrite: body + ' by [the mechanism: what happens, step by step, between the cause and the effect]' + mark,
    recommend: 'Add the "by" or "through" clause that shows the machinery.' }));

  // undefined abstraction (only where the sentence makes a claim about it)
  const abs = abstractionsIn(text);
  if (abs.length && !DEFINING.test(text) && (role === 'thesis' || role === 'topic')) {
    const prior = ctx.defined || new Set();
    const fresh = abs.filter(a => !prior.has(a));
    if (fresh.length) flags.push(flag('abstraction', 'precision', 'Undefined abstraction', `"${fresh.join('", "')}" carries the argument without being pinned to a sense.`, {
      question: `"${fresh[0]}" from what, for whom, in which scene? Which of its senses does this text put in play?`,
      rewrite: (() => { let o = text; const re = new RegExp(`\\b${fresh[0].replace(/\s+/g, '\\s+')}\\b`, 'i'); return o.replace(re, m => `${m} (${fresh[0]} understood here as [your specific sense])`); })(),
      recommend: 'Define the term in a clause the first time it carries weight, or narrow it to the form the text shows.' }));
  }

  // circularity: because-clause restates main clause
  const bm = text.match(/^(.*?)\bbecause\b(.*)$/i);
  if (bm && bm[1].trim() && bm[2].trim()) {
    const a = contentStems(bm[1]), b = contentStems(bm[2]);
    const ov = overlap(a, b);
    if (b.size >= 2 && a.size >= 2 && ov.length / Math.min(a.size, b.size) >= 0.6) flags.push(flag('circular', 'rigor', 'Circular reasoning', 'The "because" clause repeats the claim in other words instead of supplying a reason.', {
      question: 'What would someone who disagreed need to see? That is the reason; put it after "because".',
      recommend: 'After "because", give evidence or mechanism, never a restatement.' }));
  }

  // summary in the body
  if ((role === 'development' || role === 'topic' || role === 'analysis') && ctx.inBody) {
    const narrative = NARRATIVE_RE.test(text);
    const past = pastTenseCount(text);
    const analytic = ANALYTIC_RE.test(text);
    if (!analytic && !EVIDENCE_RE.test(text) && (narrative || (past >= 2 && SUMMARY_PATTERN_PRONOUN.test(text)))) {
      s.role = 'summary';
      flags.push(flag('summary', 'rigor', 'Summary, not analysis', 'The sentence retells what happens. The reader has the text; the reader lacks your reading of it.', {
        question: 'Why does this moment matter to your claim? What does its wording do that a plot summary cannot show?',
        rewrite: `The moment when ${lowerFirst(body)} matters because [what it reveals], a reading the text supports through [the specific word, image, or choice].`,
        recommend: 'Keep the detail but subordinate it: "When X, the author Y" turns plot into evidence.' }));
    }
  }

  // length and run-on
  if (wc > 45) flags.push(flag('long', 'style', 'Overlong sentence', `${wc} words. Two claims are probably sharing one sentence.`, {
    question: 'Which of the two claims here does this paragraph need? Give the other its own sentence.',
    rewrite: (() => { const i = text.search(/;\s|,\s+(?:and|but|yet|which|while)\s/); if (i > 20 && i < text.length - 20) { const a = text.slice(0, i).replace(/[,;]$/, ''); const b = text.slice(i).replace(/^[;,]\s*(?:and|but|yet|which|while)?\s*/, ''); return cap(trimEnd(a)) + '. ' + cap(b); } return null; })(),
    recommend: 'Split at the semicolon or the "and which". One claim per sentence, one sentence per claim.' }));
  if (wc < 5 && !/\b(?:is|are|was|were|be|has|have|do|does|did|[a-z]+s)\b/i.test(text) && role !== 'intro') flags.push(flag('fragment', 'style', 'Fragment', 'No verb carries the thought.', {
    question: 'What is this fragment doing? Attach it to the sentence it modifies.',
    recommend: 'Fold it into the neighboring sentence.' }));

  flags.forEach(f => { if (f.rewrite && f.rewrite.trim() === text.trim()) f.rewrite = null; });
  return flags;
}

/* ------------------------------------------------------------------ thesis and topic checks */
function whatHow(text, opts) {
  opts = opts || {};
  text = stripAnnouncement(text);
  const cv = claimVerbs(text);
  const wv = weakVerbs(text);
  const props = properNouns(text);
  const textNoun = TEXT_NOUNS.test(text);
  const devices = devicesIn(text);
  const hp = text.match(HOW_PREP);
  const howPrep = !!hp;
  const afterPrep = hp ? wordCount((text.slice(hp.index + hp[0].length).split(/[,;:.!?]/)[0] || '')) : 0;
  const reasonHow = REASON_HOW.test(text);
  const about = /\b(?:is|are)\s+about\b|\btalks?\s+about\b|\bdeals?\s+with\b|\bdiscuss(?:es)?\b|\bfocus(?:es)?\s+on\b/i.test(text);
  const claimSubject = props.length > 0 || textNoun || /^(?:the|this|in)\b/i.test(text);
  const what = {
    ok: !isQuestion(text) && !about && (cv.length > 0 || (claimSubject && wv.length > 0 && wordCount(text) >= 8) || (claimSubject && wordCount(text) >= 10 && /\b(?:not|rather|than|but|instead|only|less|more)\b/i.test(text))),
    strong: cv.length > 0,
    verbs: cv.length ? cv : wv,
    about,
    subject: textNoun ? 'The ' + (text.match(TEXT_NOUNS) || [''])[0].toLowerCase() : (props.filter(w => !/^(?:American|English|British|French|German|Spanish|Southern|Northern|Western|Eastern|Christian|Jewish|Victorian|Romantic|Modern|Greek|Roman)$/.test(w))[0] || null)
  };
  const means = hp ? (text.slice(hp.index).split(/[,;:.!?]/)[0] || '').trim() : null;
  const how = {
    means,
    ok: (devices.length > 0 && (howPrep || /\b(?:of|in|its|his|her|their)\b/i.test(text))) || (howPrep && afterPrep >= 3) || (opts.allowReason && reasonHow),
    devices,
    byDevice: devices.length > 0,
    byReason: reasonHow
  };
  if (!how.ok && howPrep) how.prepOnly = true;
  what.weakFirst = wv.length > 0 && cv.length === 0 && tokens(text).slice(0, 9).some(t => WEAK_VERBS.has(t.toLowerCase()));
  return { what, how };
}
function whyIn(text) {
  const m = text.match(WHY_RE);
  const clause = text.match(WHY_CLAUSE);
  return { ok: !!m, marker: m ? m[0] : null, clause: clause ? clause[1] : null };
}
function thesisRewrite(th) {
  const parts = [];
  const s1 = stripAnnouncement(th.sentences[0].text);
  const body = trimEnd(s1);
  const mark = endMark(s1);
  let first = body;
  if (!th.how.ok) first += th.how.prepOnly ? ' [name the device or pattern]' : ' through [the device or pattern: diction, structure, juxtaposition, the shift at the volta]';
  if (!th.what.ok) first = (th.what.about ? first.replace(/\b(?:is|are)\s+about\b|\btalks?\s+about\b|\bdeals?\s+with\b|\bdiscuss(?:es)?\b|\bfocus(?:es)?\s+on\b/i, '[argues / exposes / complicates]') : `[Author or text] [argues / exposes / complicates] that ${lowerFirst(first)}`);
  else if (!th.what.strong && th.what.weakFirst) first = first.replace(new RegExp(`\\b${th.what.verbs[0]}\\b`, 'i'), `[${th.what.verbs[0]} → argues / exposes / insists / complicates]`);
  parts.push(cap(first) + mark);
  if (th.sentences.length >= 2 && th.why.ok) parts.push(th.sentences[1].text);
  else if (th.sentences.length >= 2) parts.push(trimEnd(th.sentences[1].text) + ', in order to [reveal / warn / insist] that [the larger claim], a stake that matters because [who is implicated, and what changes if the claim holds].');
  else parts.push(`${cap(th.what.subject || '[Author]')} does so in order to [reveal / warn / insist] that [the larger claim beyond this text], a stake that matters because [who is implicated, and what changes if the claim holds].`);
  return parts.join(' ');
}
function analyzeThesis(sentences, intro, opts) {
  const cands = intro.filter(s => !isQuestion(s.text));
  if (!intro.length) return null;
  let best = null;
  const scoreOne = (s, i) => {
    const wh = whatHow(s.text, { allowReason: true });
    const why = whyIn(s.text);
    let sc = i / Math.max(1, intro.length - 1) * 2;
    if (wh.what.ok) sc += 3; if (wh.what.strong) sc += 1; if (wh.how.ok) sc += 2; if (why.ok) sc += 1.5;
    if (wordCount(s.text) >= 12) sc += 1; if (isQuestion(s.text)) sc -= 4; if (quotedShare(s.text) > 0.4) sc -= 3;
    if (ANNOUNCE.some(re => re.test(s.text))) sc -= 1; if (DICTIONARY_RE.test(s.text)) sc -= 3;
    return sc;
  };
  let forced = null;
  if (opts && Number.isInteger(opts.thesisIndex)) {
    const idx = intro.findIndex(s => s.index === opts.thesisIndex);
    if (idx >= 0) forced = idx;
  }
  const scores = intro.map(scoreOne);
  const isCont = t => /^(?:in\s+doing\s+so|this|such|that|by|thus|the\s+result|here|what|ultimately|more\s+than|beyond|if|only|yet|but|and|so|the\s+\w+\s+does\s+so|it\s+does\s+so)\b/i.test(t);
  const validPair = i => {
    const a = intro[i], b = intro[i + 1];
    if (!a || !b || isQuestion(a.text) || isQuestion(b.text)) return false;
    const wa = whatHow(a.text, { allowReason: true });
    if (!wa.what.ok) return false;
    return whyIn(b.text).ok || isCont(b.text) || whatHow(b.text).what.ok;
  };
  let pair;
  const len = opts && opts.thesisLength;
  if (forced != null) {
    if (len === 1) pair = [forced];
    else if (len === 2) pair = forced + 1 < intro.length ? [forced, forced + 1] : (forced > 0 ? [forced - 1, forced] : [forced]);
    else pair = validPair(forced) ? [forced, forced + 1] : (forced > 0 && validPair(forced - 1) && whyIn(intro[forced].text).ok ? [forced - 1, forced] : [forced]);
  } else {
    let best = { score: -Infinity, pair: [0] };
    scores.forEach((sc, i) => { if (sc > best.score) best = { score: sc, pair: [i] }; });
    for (let i = 0; i + 1 < intro.length; i++) {
      if (!validPair(i)) continue;
      const sc = scores[i] + scores[i + 1] + 2;
      if (sc > best.score) best = { score: sc, pair: [i, i + 1] };
    }
    pair = best.pair;
    if (len === 1) pair = [pair[pair.length - 1]];
  }
  const ths = pair.map(i => intro[i]);
  const s1 = ths[0], s2 = ths[1];
  const wh = whatHow(s1.text, { allowReason: true });
  const why1 = whyIn(s1.text);
  const why2 = s2 ? whyIn(s2.text) : { ok: false };
  const why = s2 ? (why2.ok ? why2 : (why1.ok ? Object.assign({}, why1, { inFirst: true }) : why2)) : (why1.ok ? Object.assign({}, why1, { inFirst: true }) : why1);
  const th = { sentences: ths, indexes: ths.map(s => s.index), what: wh.what, how: wh.how, why, twoSentence: ths.length === 2, flags: [] };
  if (!th.what.ok) th.flags.push(flag('thesis-what', 'structure', 'Thesis lacks a What', th.what.about ? 'The thesis says what the text is about. A topic is not a claim.' : 'No arguable claim with a subject and a claim verb.', {
    question: 'What do you say about the text that a careful reader could disagree with?',
    recommend: 'Subject + claim verb + the reading: "[Author] exposes / complicates / insists that ..."' }));
  else if (!th.what.strong && th.what.weakFirst) th.flags.push(flag('thesis-weak-verb', 'rigor', 'Weak claim verb', `"${th.what.verbs[0]}" states; it does not argue.`, {
    question: `What is the text doing to its subject: exposing it, mourning it, satirizing it, complicating it?`,
    recommend: 'Trade "shows" or "uses" for a verb that commits: argues, exposes, indicts, complicates, insists.' }));
  if (!th.how.ok) th.flags.push(flag('thesis-how', 'structure', 'Thesis lacks a How', th.how.prepOnly ? 'There is a "through" or "by" but no device or pattern after it.' : 'No means named: no device, pattern, structure, or line of reasoning by which the text does what you claim.', {
    question: 'By what means does the text accomplish this? Which choices (diction, structure, juxtaposition, the turn) will your paragraphs read?',
    recommend: 'Add the How as a "through" clause naming two or three devices, in the order your paragraphs will take them.' }));
  if (!th.twoSentence) th.flags.push(flag('thesis-two', 'structure', 'One-sentence thesis', 'The thesis is a single sentence. The second sentence is where the Why lives.', {
    question: 'Why does this reading matter beyond the text? Who is implicated if you are right?',
    recommend: 'Write a second sentence that states the stakes: what the reading reveals, warns, or insists, and for whom.' }));
  if (!th.why.ok) th.flags.push(flag('thesis-why', 'structure', 'Thesis lacks a Why', 'No stakes. The reader learns what you will argue and how, but not why it should matter to anyone.', {
    question: 'Finish this: "If I am right, then ___ , which matters because ___ ."',
    recommend: 'The second sentence names the consequence: "in order to", "thereby", "ultimately", "what is at stake".' }));
  else if (th.why.inFirst && th.twoSentence) th.flags.push(flag('thesis-why-placement', 'style', 'Why crowds the first sentence', 'The What, How, and Why are all in sentence one; sentence two has no job.', {
    question: 'What would sentence two say if sentence one kept only the What and How?',
    recommend: 'Move the Why clause into the second sentence and let it breathe.' }));
  th.rewrite = thesisRewrite(th);
  th.question = th.flags.length ? th.flags[0].question : 'Your thesis has a What, a How, and a Why. Does each body paragraph take one of the Hows in order?';
  th.recommend = th.flags.length ? th.flags[0].recommend : 'Keep the Why in view: every topic sentence should be able to point back at it.';
  return th;
}
function analyzeTopic(s, thesis) {
  const wh = whatHow(s.text, { allowReason: true });
  const tStems = thesis ? contentStems(thesis.sentences.map(x => x.text).join(' ')) : new Set();
  const ov = overlap(contentStems(s.text), tStems);
  const narrative = NARRATIVE_RE.test(s.text) && !ANALYTIC_RE.test(s.text);
  const t = { what: wh.what, how: wh.how, link: ov, flags: [] };
  if (isQuestion(s.text)) t.flags.push(flag('topic-question', 'structure', 'Topic sentence is a question', 'The paragraph opens by asking rather than claiming.', { question: 'What does this paragraph conclude? Open with that.', recommend: 'Lead with the paragraph\'s claim, not its question.' }));
  else if (quotedShare(s.text) > 0.4) t.flags.push(flag('topic-quote', 'structure', 'Topic sentence is a quotation', 'The paragraph opens in the author\'s voice instead of yours.', { question: 'What do you claim about this quotation? That claim is the topic sentence.', recommend: 'Your claim first; the quotation second.' }));
  else if (narrative) t.flags.push(flag('topic-plot', 'rigor', 'Topic sentence is plot', 'The paragraph opens by telling what happens rather than what it means.', { question: 'What does this moment prove about your thesis?', rewrite: `[What this paragraph claims], which the text builds through ${lowerFirst(trimEnd(s.text))}.`, recommend: 'Lead with the claim; let the plot detail follow as the How.' }));
  if (!t.what.ok && !isQuestion(s.text)) t.flags.push(flag('topic-what', 'structure', 'Topic sentence lacks a What', 'No arguable sub-claim. The paragraph has no job yet.', {
    question: 'What does this paragraph add to the thesis that the others do not?',
    rewrite: `[Author or text] [claim verb] that ${lowerFirst(trimEnd(s.text))} through [the device this paragraph reads].`,
    recommend: 'One sub-claim per paragraph, stated in the first sentence with a committed verb.' }));
  else if (!t.what.strong && t.what.weakFirst) t.flags.push(flag('topic-weak-verb', 'rigor', 'Weak verb in topic sentence', `"${t.what.verbs[0]}" states; it does not argue.`, { question: 'Exposing, complicating, insisting, mourning: which is the text doing here?', recommend: 'Trade the weak verb for one that commits.' }));
  if (!t.how.ok) t.flags.push(flag('topic-how', 'structure', 'Topic sentence lacks a How', t.how.prepOnly ? 'A "through" or "by" with no device after it.' : 'No device or pattern named. The reader cannot tell what this paragraph will read closely.', {
    question: 'Which choice in the text (a word, an image, a structure, a turn) will this paragraph read?',
    rewrite: trimEnd(s.text) + ' through [the device or pattern this paragraph reads]' + endMark(s.text),
    recommend: 'Name the How in the topic sentence so the paragraph has a method, not only a mood.' }));
  if (thesis && !ov.length && tStems.size) t.flags.push(flag('topic-link', 'structure', 'No tie to the thesis', 'The topic sentence shares no key term with the thesis. The paragraph may belong to a different essay.', {
    question: 'Which word from your thesis does this paragraph advance? Put it in the sentence.',
    recommend: 'Repeat one key term from the thesis (or its clear synonym) so the reader sees the thread.' }));
  return t;
}
function analyzeConclusion(concl, thesis, bodyStems) {
  const out = { sentences: concl.map(s => s.index), returns: false, echo: [], copied: false, newEvidence: false, flags: [] };
  if (!concl.length) {
    out.flags.push(flag('conc-missing', 'structure', 'No conclusion paragraph', 'The essay ends in a body paragraph. The Why never comes back.', { question: 'If the reader remembers one sentence, which do you want it to be? Write that paragraph.', recommend: 'Add a conclusion that returns to the Why in new words.' }));
    return out;
  }
  if (!thesis) return out;
  const whySrc = thesis.why.ok && thesis.why.clause ? thesis.why.clause : (thesis.sentences[1] ? thesis.sentences[1].text : thesis.sentences[0].text);
  const whyStems = contentStems(whySrc);
  const thesisStems = contentStems(thesis.sentences.map(s => s.text).join(' '));
  let bestOv = [];
  concl.forEach(s => {
    const ov = overlap(contentStems(s.text), whyStems);
    if (ov.length > bestOv.length) bestOv = ov;
    if (ov.length >= 2 || (ov.length >= 1 && whyStems.size <= 4)) { s.echoesWhy = true; out.echo.push(s.index); }
    const tw = tokens(thesis.sentences.map(x => x.text).join(' ')).map(x => x.toLowerCase());
    const cw = tokens(s.text).map(x => x.toLowerCase());
    if (longestCommonRun(tw, cw) >= 8) { out.copied = true; s.copiesThesis = true; }
    if (quotedSpans(s.text).some(q => wordCount(q) >= 6) || /\(\s*(?:p\.?|pp\.?|page|line|l\.)\s*\d/i.test(s.text)) out.newEvidence = true;
  });
  out.bestEcho = bestOv;
  out.returns = out.echo.length > 0 && !(out.copied && out.echo.length === concl.filter(s => s.copiesThesis).length);
  const conclStems = contentStems(concl.map(s => s.text).join(' '));
  const thesisOv = overlap(conclStems, thesisStems);
  if (!thesis.why.ok) out.flags.push(flag('conc-no-why', 'structure', 'Nothing to return to', 'The thesis has no Why, so the conclusion has nothing to come back to. Fix the thesis first.', { question: 'Once your thesis has a Why, which sentence here will answer it?', recommend: 'Write the Why into the thesis, then echo its key terms here.' }));
  else if (out.copied && out.echo.length) out.flags.push(flag('conc-copied', 'rigor', 'Restated, not returned', 'The conclusion repeats the thesis nearly word for word. A return says the same thing with what the essay has since earned.', { question: 'What do you know at the end of the essay that you did not know at the thesis? Say the Why in those terms.', recommend: 'Keep the key terms of the Why; change every other word.' }));
  else if (!out.returns) out.flags.push(flag('conc-no-return', 'structure', 'Conclusion does not return to the Why', `None of the conclusion's sentences shares the key terms of the Why (${[...whyStems].slice(0, 5).join(', ')}).`, {
    question: 'Where in this paragraph does the stake from your thesis reappear? If nowhere, which sentence will carry it?',
    rewrite: `${trimEnd(concl[0].text)}${endMark(concl[0].text)} [Return to the Why: ${whySrc.trim().replace(/[.!?]$/, '')}, which the essay has now shown through ___ .]`,
    recommend: 'Echo two or three key terms from the Why sentence and say what the body paragraphs have added to it.' }));
  if (out.newEvidence) out.flags.push(flag('conc-evidence', 'structure', 'New evidence in the conclusion', 'A fresh quotation or citation appears after the argument has closed.', { question: 'Which body paragraph does this evidence belong to?', recommend: 'Move the quotation into the body; the conclusion reads what has already been shown.' }));
  if (thesisOv.length === 0 && thesisStems.size) out.flags.push(flag('conc-drift', 'structure', 'Conclusion drifts', 'The conclusion shares no key term with the thesis at all.', { question: 'Is this conclusion for the essay you wrote?', recommend: 'Bring back the subject and the Why of the thesis.' }));
  return out;
}
function longestCommonRun(a, b) {
  let best = 0;
  const prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    for (let j = b.length; j >= 1; j--) { prev[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : 0; if (prev[j] > best) best = prev[j]; }
  }
  return best;
}

/* ------------------------------------------------------------------ the read */
function read(text, opts) {
  opts = opts || {};
  const paras = splitParagraphs(text || '');
  const sentences = [];
  paras.forEach((p, pi) => {
    splitSentences(p.text, p.start).forEach((s, si) => {
      sentences.push({ index: sentences.length, para: pi, inPara: si, text: s.text, start: s.start, end: s.end, role: 'development', flags: [] });
    });
  });
  const paraCount = paras.length;
  const hasIntro = paraCount >= 1;
  const hasConcl = paraCount >= 3;
  const introIdx = 0, conclIdx = hasConcl ? paraCount - 1 : -1;
  const intro = sentences.filter(s => s.para === introIdx);
  const concl = hasConcl ? sentences.filter(s => s.para === conclIdx) : [];
  intro.forEach(s => { s.role = 'intro'; });
  concl.forEach(s => { s.role = 'conclusion'; });
  const thesis = hasIntro ? analyzeThesis(sentences, intro, opts) : null;
  if (thesis) thesis.sentences.forEach(s => { s.role = 'thesis'; });
  const paragraphs = paras.map((p, pi) => ({ index: pi, kind: pi === introIdx ? 'intro' : (pi === conclIdx ? 'conclusion' : 'body'), sentences: sentences.filter(s => s.para === pi).map(s => s.index), topic: null, counts: { evidence: 0, analysis: 0, summary: 0, development: 0 } }));
  // body roles
  const defined = new Set();
  paragraphs.forEach(pg => {
    if (pg.kind !== 'body') return;
    const ss = pg.sentences.map(i => sentences[i]);
    ss.forEach((s, k) => {
      if (k === 0) { s.role = 'topic'; return; }
      if (EVIDENCE_RE.test(s.text)) s.role = 'evidence';
      else if (ANALYTIC_RE.test(s.text)) s.role = 'analysis';
      else s.role = 'development';
    });
  });
  // sentence checks
  sentences.forEach(s => {
    if (DEFINING.test(s.text)) abstractionsIn(s.text).forEach(a => defined.add(a));
    const pg = paragraphs[s.para];
    s.flags = checkSentence(s, { paraIndex: s.para, paraCount, inBody: pg.kind === 'body', defined });
  });
  // topic sentences and paragraph balance
  paragraphs.forEach(pg => {
    if (pg.kind !== 'body') return;
    const ss = pg.sentences.map(i => sentences[i]);
    const first = ss[0];
    if (first) { first.topic = analyzeTopic(first, thesis); pg.topic = first.topic; first.flags = first.topic.flags.concat(first.flags); }
    ss.forEach(s => { pg.counts[s.role === 'topic' ? 'development' : (pg.counts[s.role] != null ? s.role : 'development')]++; });
    pg.counts.total = ss.length;
    // a quotation with no reading after it
    ss.forEach((s, k) => {
      if (s.role === 'evidence' && quotedSpans(s.text).length) {
        const nxt = ss[k + 1];
        if (!nxt || !(ANALYTIC_RE.test(nxt.text) || nxt.role === 'analysis')) s.flags.push(flag('unread-quote', 'rigor', 'Quotation left unread', nxt ? 'The sentence after this quotation does not read it.' : 'The paragraph ends on a quotation. The last word belongs to you, not the author.', {
          question: 'Which word in the quotation does the work? Give it a sentence of its own.',
          recommend: 'Follow every quotation with a sentence that names a word in it and says what that word does.' }));
      }
    });
    const last = ss[ss.length - 1];
    if (last && ss.length >= 3 && thesis) {
      const ov = overlap(contentStems(last.text), contentStems(thesis.sentences.map(x => x.text).join(' ')));
      pg.closesLoop = ov.length > 0;
      if (!pg.closesLoop && last.role !== 'evidence') last.flags.push(flag('para-close', 'structure', 'Paragraph does not close the loop', 'The paragraph ends without returning to its claim or to the thesis.', { question: 'What has this paragraph proved? Say it in one sentence that uses a thesis term.', recommend: 'End each body paragraph by connecting its evidence back to the thesis.' }));
    }
    if (pg.counts.total >= 3 && pg.counts.summary / pg.counts.total > 0.4) pg.summaryHeavy = true;
    if (pg.counts.total >= 3 && pg.counts.evidence === 0) pg.noEvidence = true;
  });
  const conclusion = analyzeConclusion(concl, thesis);
  if (paraCount === 2) conclusion.flags.unshift(flag('conc-missing', 'structure', 'No conclusion paragraph', 'Two paragraphs: an introduction and one body. The Why never returns.', { question: 'What has the body paragraph earned that the thesis only promised?', recommend: 'Add a conclusion that returns to the Why in new words.' }));
  const bodySentences = sentences.filter(s => paragraphs[s.para].kind === 'body');
  const totals = { sentences: sentences.length, words: wordCount(text || ''), body: bodySentences.length,
    analysis: bodySentences.filter(s => s.role === 'analysis').length, evidence: bodySentences.filter(s => s.role === 'evidence').length,
    summary: bodySentences.filter(s => s.role === 'summary').length, flags: sentences.reduce((a, s) => a + s.flags.length, 0),
    rigor: sentences.reduce((a, s) => a + s.flags.filter(f => f.severity === 'rigor').length, 0),
    precision: sentences.reduce((a, s) => a + s.flags.filter(f => f.severity === 'precision').length, 0) };
  const topics = paragraphs.filter(p => p.kind === 'body' && p.topic);
  const checklist = [
    { key: 'thesis-two', label: 'Thesis is two sentences', ok: !!(thesis && thesis.twoSentence) },
    { key: 'thesis-what', label: 'Sentence one states the What (a claim with a committed verb)', ok: !!(thesis && thesis.what.ok && thesis.what.strong), partial: !!(thesis && thesis.what.ok && !thesis.what.strong) },
    { key: 'thesis-how', label: 'Sentence one states the How (the means)', ok: !!(thesis && thesis.how.ok) },
    { key: 'thesis-why', label: 'Sentence two states the Why (the stakes)', ok: !!(thesis && thesis.why.ok && !thesis.why.inFirst), partial: !!(thesis && thesis.why.ok && thesis.why.inFirst) },
    { key: 'topics-what', label: 'Every topic sentence states a What', ok: topics.length > 0 && topics.every(p => p.topic.what.ok), partial: topics.some(p => p.topic.what.ok) && !topics.every(p => p.topic.what.ok) },
    { key: 'topics-how', label: 'Every topic sentence states a How', ok: topics.length > 0 && topics.every(p => p.topic.how.ok), partial: topics.some(p => p.topic.how.ok) && !topics.every(p => p.topic.how.ok) },
    { key: 'topics-link', label: 'Every topic sentence ties to the thesis', ok: topics.length > 0 && topics.every(p => p.topic.link.length > 0), partial: topics.some(p => p.topic.link.length > 0) && !topics.every(p => p.topic.link.length > 0) },
    { key: 'quotes-read', label: 'Every quotation is framed and read', ok: !sentences.some(s => s.flags.some(f => f.code === 'quote-dump' || f.code === 'unread-quote')) && totals.evidence > 0 },
    { key: 'analysis-over-summary', label: 'Analysis outweighs summary in the body', ok: totals.body > 0 && totals.summary <= Math.max(1, Math.floor(totals.body * 0.2)) && totals.analysis >= totals.summary },
    { key: 'conc-return', label: 'Conclusion returns to the Why in new words', ok: conclusion.returns && !conclusion.copied },
  ];
  return { text, paragraphs, sentences, thesis, conclusion, totals, checklist, passed: checklist.filter(c => c.ok).length };
}

const ROLES = {
  intro: { label: 'Introduction', note: 'Sets up the text and the problem.' },
  thesis: { label: 'Thesis', note: 'Two sentences: What and How, then Why.' },
  topic: { label: 'Topic sentence', note: 'The paragraph\'s What and How.' },
  evidence: { label: 'Evidence', note: 'The text, quoted or cited.' },
  analysis: { label: 'Analysis', note: 'Your reading of the evidence.' },
  summary: { label: 'Summary', note: 'Retells the text. Keep to a minimum.' },
  development: { label: 'Development', note: 'Elaboration that is neither evidence nor explicit analysis.' },
  conclusion: { label: 'Conclusion', note: 'Returns to the Why.' }
};
const SEVERITIES = {
  rigor: { label: 'Analytical rigor', note: 'Claims without warrant, summary in place of reading, hedges and overclaims.' },
  precision: { label: 'Philosophical precision', note: 'Undefined abstractions, agentless subjects, vague terms, false binaries.' },
  structure: { label: 'Spine', note: 'What, How, Why in the thesis; What and How in topic sentences; the return in the conclusion.' },
  style: { label: 'Style', note: 'Announcements, signposts, length.' }
};

return { read, splitParagraphs, splitSentences, stem, contentStems, whatHow, whyIn, analyzeThesis, analyzeTopic, analyzeConclusion, checkSentence, stripHedges, stripAnnouncement, stripOverclaims, replaceVague, devicesIn, claimVerbs, abstractionsIn, longestCommonRun, ROLES, SEVERITIES };
});
