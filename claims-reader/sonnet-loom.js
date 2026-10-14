/* The Sonnet Loom: rule-based English prosody for re-lining a poem into Shakespearean sonnets.
   No dictionary and no network. Every count here is a spelling rule, so every count can be corrected by hand. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SonnetLoom = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

/* ------------------------------------------------------------------ syllable exceptions (word -> count) */
const EXC_RAW = `
ion:2 lion:2 lions:2 iron:2 irons:2 ions:2 zion:2 scion:2 orion:3 champion:3 champions:3 scorpion:3 scorpions:3 dandelion:4 senior:2 seniors:2 junior:2 juniors:2 behavior:3 behaviour:3 savior:2 saviour:2 savor:2 anxious:2 anxiously:3 ohio:3
poem:2 poems:2 poet:2 poets:2 poetry:3 poetic:3 poesy:3 quiet:2 quietly:3 quieter:3 quietest:3 quietude:3 diet:2 diets:2 client:2 clients:2 science:2 sciences:3 scientist:3 scientists:3 scientific:4 conscience:2 conscious:2 unconscious:3 subconscious:3
fire:1 fires:1 fired:1 hire:1 hour:1 hours:1 our:1 ours:1 sour:1 flour:1 flower:2 flowers:2 power:2 powers:2 tower:2 towers:2 shower:2 showers:2 bower:2 bowers:2 lower:2 slower:2 mower:2 blower:2 glower:2 grower:2 rower:2 thrower:2 knower:2 goer:2 doer:2
every:2 everything:3 everyone:3 everywhere:3 everybody:4 evening:2 evenings:2 interesting:3 interested:3 different:3 difference:3 family:3 families:3 memory:3 memories:3 history:3 beautiful:3 business:2 businesses:3 chocolate:2 camera:3 favorite:3 favourite:3 vegetable:3 temperature:3 literature:3 miserable:3 comfortable:3 reasonable:3 preferable:3 separate:3 separately:3 desperate:3 generally:3 general:3 several:3 naturally:3 natural:3 average:2 coverage:2 beverage:2 marriage:2 carriage:2 vineyard:2
idea:3 ideas:3 ideal:3 ideals:3 ideally:3 area:3 areas:3 real:1 reality:4 realize:3 realise:3 realized:3 realised:3 realizes:3 realizing:3 theater:3 theatre:3 theaters:3 theatres:3 cereal:3 ethereal:4 create:2 creates:2 created:3 creating:3 creation:3 creations:3 creator:3 creators:3 creative:3 recreate:3 react:2 reacts:2 reacted:3 reacting:3 reaction:3 preamble:3 reassure:3 reappear:3 korea:3 leah:2 museum:3 museums:3 reunion:3 reunite:3 chaos:2 cacao:3 aeon:2 aeons:2 coexist:3 coerce:2 noel:2 chloe:2 zoe:2
giant:2 giants:2 liar:2 liars:2 liable:3 reliable:4 alliance:3 appliance:3 compliance:3 reliance:3 suicide:3 intuition:4 tuition:3 persuade:2 persuaded:3 persuades:2 persuasion:3 suave:1 fluorescent:3 frontier:2 cashier:2 soldier:2 soldiers:2 glacier:2 chandelier:3 cavalier:3 brigadier:3 righteous:2 courteous:3 hideous:3 piteous:3 plenteous:3 bounteous:3 beauteous:3 people:2 peoples:2 leopard:2 jeopardy:3 yeoman:2 neon:2 peony:3 thereof:2 whereof:2 hereof:2
element:3 elements:3 elementary:4 complement:3 complements:3 supplement:3 supplements:3 implement:3 implements:3 clement:2 inclement:3 vehement:3 cement:2 excrement:3 increment:3 decrement:3 regiment:3 regiments:3 sediment:3 sentiment:3 sentiments:3 compliment:3 compliments:3 experiment:4 experiments:4 tenement:3 condiment:3 rudiment:3 rudiments:3 cooperate:4 cooperates:4 cooperated:5 cooperating:5 cooperation:5 cooperative:5 coordinate:4 coordinates:4 coordinated:5 coordinating:5 coordination:5 anyone:3 maybe:2 poetical:4 poetically:5 foliage:3 oneness:2 nicety:3 surety:3 nineties:3
rhythm:2 rhythms:2 isle:1 isles:1 aisle:1 aisles:1 lisle:1 friend:1 friends:1 friendly:2 friendship:2 befriend:2 boyfriend:2 girlfriend:2 unfriend:2 fiend:1 fiends:1
naked:2 wicked:2 wretched:2 crooked:2 rugged:2 ragged:2 jagged:2 dogged:2 legged:2 beloved:3 learned:1 blessed:1 cursed:1 aged:1 accursed:2 sacred:2 hatred:2 kindred:2 hundred:2 hundreds:2 kindreds:2
tongue:1 tongues:1 argue:2 argued:2 argues:2 arguing:3 league:1 plague:1 vague:1 rogue:1 vogue:1 fatigue:2 queue:1 value:2 values:2 valued:2 valuable:4 statue:2 virtue:2 rescue:2 tissue:2 issue:2 avenue:3 revenue:3 continue:3 continued:3 continues:3 pursue:2 pursued:2 subdue:2 ensue:2
cruel:2 cruelly:3 fuel:2 duel:2 gruel:2 fluent:2 fluid:2 druid:2 ruin:2 ruins:2 ruined:2 genuine:3 truant:2 nuance:2 duet:2 minuet:3 cruet:2 duo:2 lion:2
being:2 beings:2 seeing:2 going:2 doing:2 fleeing:2 freeing:2 knowing:2 flowing:2 growing:2 showing:2 blowing:2 glowing:2 throwing:2 rowing:2 sowing:2 towing:2 owing:2 snowing:2 crowing:2 mowing:2 stowing:2 bowing:2 vowing:2 cowing:2 allowing:3 following:3 swallowing:3 hollowing:3 borrowing:3 sorrowing:3 wallowing:3
toward:2 towards:2 untoward:3 forward:2 upward:2 inward:2 outward:2 downward:2 homeward:2 heavenward:3 skyward:2 seaward:2 wayward:2 afterward:3 afterwards:3 backward:2
prayer:1 prayers:1 layer:2 player:2 mayor:2 heaven:2 heavens:2 heavenly:3 seven:2 eleven:3 even:2 evens:2 given:2 driven:2 risen:2 open:2 opens:2 opened:2 opening:3 happen:2 happens:2 happened:2 often:2 listen:2 listens:2 listened:2 glisten:2 soften:2 hasten:2 fasten:2 chasten:2 christen:2 moisten:2
little:2 middle:2 able:2 table:2 noble:2 simple:2 people:2 double:2 trouble:2 couple:2 circle:2 purple:2 castle:2 whistle:2 gentle:2 battle:2 settle:2 subtle:2 title:2 bible:2 idle:2 needle:2 cradle:2 candle:2 handle:2 bundle:2 kindle:2 angle:2 single:2 tangle:2 eagle:2 beagle:2 bugle:2 struggle:2 rifle:2 trifle:2 stifle:2 sparkle:2 twinkle:2 ankle:2 uncle:2 pickle:2 buckle:2 humble:2 tumble:2 crumble:2 rumble:2 stumble:2 marble:2 feeble:2 bubble:2 pebble:2 apple:2 ripple:2 temple:2 ample:2 example:3 cattle:2 rattle:2 kettle:2 bottle:2 throttle:2 shuttle:2 turtle:2 myrtle:2 mantle:2 dwindle:2 spindle:2 swindle:2 mingle:2 tingle:2 jingle:2 dangle:2 jungle:2 bungle:2 gargle:2 gurgle:2 haggle:2 toggle:2 ogle:2 muffle:2 ruffle:2 shuffle:2 baffle:2 raffle:2 waffle:2 wrestle:2 nestle:2 jostle:2 bustle:2 rustle:2 hustle:2 thistle:2 bristle:2 gristle:2 trestle:2 apostle:3 epistle:3 ladle:2 saddle:2 paddle:2 riddle:2 fiddle:2 huddle:2 puddle:2 muddle:2 cuddle:2 meddle:2 peddle:2 hurdle:2 girdle:2 curdle:2 startle:2 tattle:2 prattle:2 dazzle:2 muzzle:2 puzzle:2 nozzle:2 drizzle:2 sizzle:2 fizzle:2 frizzle:2 nuzzle:2 guzzle:2 chuckle:2 knuckle:2 freckle:2 speckle:2 tickle:2 fickle:2 trickle:2 prickle:2 sickle:2 tackle:2 cackle:2 crackle:2 shackle:2 wrinkle:2 crinkle:2 sprinkle:2 tinkle:2 tremble:2 nimble:2 thimble:2 symbol:2 gamble:2 ramble:2 scramble:2 bramble:2 amble:2 shamble:2 crumple:2 rumple:2 dimple:2 pimple:2 sample:2 trample:2 wimple:2 steeple:2 maple:2 staple:2 triple:2 stipple:2 tipple:2 cripple:2 grapple:2 topple:2 supple:2 scruple:2
every:2 everything:3 evil:2 devil:2 civil:2 pupil:2 pencil:2 April:2 april:2 basil:2 fossil:2 lentil:2 nostril:2 peril:2 tonsil:2 until:2 fulfil:2 fulfill:2
ocean:2 oceans:2 oceanic:4 luncheon:2 pigeon:2 surgeon:2 dungeon:2 bludgeon:2 truncheon:2 someone:2 gorgeous:2 outrageous:3 courageous:3 advantageous:4
mischief:2 handkerchief:3 kerchief:2 chief:1 thief:1 brief:1 grief:1 relief:2 belief:2 believe:2 believes:2 believed:2 believer:3 believing:3 achieve:2 achieved:2 retrieve:2 reprieve:2 grieve:1 grieved:1 niece:1 piece:1 pieces:2 fierce:1 pierce:1 pierced:1 tier:1 pier:1 bier:1 priest:1 priests:1 shriek:1 siege:1 liege:1 lien:1 shield:1 yield:1 wield:1 field:1 fields:1 afield:2 view:1 views:1 viewed:1 review:2 preview:2 interview:3
extraordinary:5 february:4 january:4 library:3 necessary:4 secretary:4 military:4 ordinary:4 literary:4 temporary:4 solitary:4 voluntary:4 dictionary:4 missionary:4 visionary:4 legendary:4 momentary:4 sanctuary:4 cemetery:4 category:4 territory:4 inventory:4 dormitory:4 allegory:4 purgatory:4 mandatory:4 imaginary:5 contemporary:5 vocabulary:5 preliminary:5 hereditary:5
colonel:2 colonels:2 lieutenant:3 sergeant:2 wednesday:2 forecastle:3 boatswain:2 victuals:2 yacht:1 yachts:1 choir:1 choirs:1 quire:1 squire:1 acquire:2 require:2 inquire:2 desire:2 entire:2 empire:2 umpire:2 vampire:2 sapphire:2 satire:2 attire:2 retire:2 admire:2 inspire:2 expire:2 aspire:2 conspire:2 transpire:2 perspire:2 respire:2 quagmire:2 bonfire:2 wildfire:2 hellfire:2 spitfire:2 campfire:2 backfire:2 crossfire:2 misfire:2
hyperbole:4 epitome:4 apostrophe:4 catastrophe:4 anemone:4 simile:3 recipe:3 psyche:2 finale:3 sesame:3 acne:2 karate:3 adobe:3 calliope:4 penelope:4 antigone:4 persephone:4 hermione:4 nike:2 chile:2 guacamole:4 cafe:2 resume:2 naive:2 forte:2 coyote:3 agape:3 tempe:2 abalone:4 machete:3
`;
const EXC_MORE = `forehead:2 foreheads:2 unfed:2 abed:2 therefore:2 wherefore:2 thereby:2 whereby:2 hereby:2 therewith:2 herewith:2 therein:2 wherein:2 thereon:2 whereon:2 nevertheless:4 viceroy:2 farewell:2 bridegroom:2 aren't:1 weren't:1 naive:2 noel:2`;
const EXC = {};
EXC_MORE.split(/\s+/).forEach(pair => { const i = pair.lastIndexOf(':'); if (i > 0 && EXC[pair.slice(0, i)] == null) EXC[pair.slice(0, i)] = Number(pair.slice(i + 1)); });
EXC_RAW.trim().split(/\s+/).forEach(pair => { const i = pair.lastIndexOf(':'); if (i > 0) EXC[pair.slice(0, i)] = Number(pair.slice(i + 1)); });
EXC["aren't"] = 1; EXC["weren't"] = 1;
// Counts checked word by word against Merriam-Webster on a corpus of public-domain sonnets and student vocabulary.
const EXC_SWEEP = `pioneer:3 could've:2 noah:2 santiago:4 nevaeh:3 abuela's:3 pistachio:4 quinceañera:5 dulce:2 padre:2 madre:2 noche:2 felipe:3 mercedes:3 guadalupe:4 notebook:2 tamale:3 triumph:2 foretold:2 foresee:2 ambiguity:5 continuity:5 gratuity:4 perpetuity:5 ingenuity:5 deity:3 spontaneity:5 theatrical:4 recreation:4 procreation:4 coalition:4 fruition:3 accordion:4 criterion:4 centurion:4 clarion:3 carrion:3 nauseous:2 ambiguous:4 contiguous:4 zoology:4 coincidence:4 convenience:3 foregone:2 centre:2 agues:2 tangere:3 proteus:3 heroic:3 certes:2 subtly:3 hyades:3 algorithm:4 bluetooth:2 abuela:3 leche:2 verde:2 hialeah:4 venezuelan:4 homestead:2 pinecrest:2 gymnasium:4 auditorium:5 stadium:3 sophomore:2 imagery:3 literature:4 shoreline:2 forecast:2 oblivion:4 should've:2 i'd've:2 patio:3 reinvent:3 reuse:2 ingenious:3 initiative:4 intuitive:4 persuasive:3 procreate:3 permeate:3 stoic:2 medium:3 radium:3 premium:3 tedium:3 podium:3 opium:3 helium:3 delirium:4 millennium:4 geranium:4 aquarium:4 symposium:4 equilibrium:5 calcium:3 sodium:3 mausoleum:4 petroleum:4 linoleum:4 lyceum:3 european:4 cerulean:4 mediterranean:6 subterranean:5 linear:3 nuclear:3 nausea:3 panacea:4 lineage:3 lineament:4 pancreas:3 unquiet:3 rearrange:3 reawaken:4 reinforce:3 reaffirm:3 whatsoever:4 graveyard:2 lifeboat:2 firelight:2 lovelorn:2 statesman:2 spokesman:2 heretofore:3 bloodshed:2 seabed:2 deathbed:2 hotbed:2 watershed:3 whalebone:2 baseball:2 mien:1 truest:2 hyacinth:3 diurnal:3 foreshadow:3 corporeal:4 funereal:4 empyrean:4 triumphant:3 heroism:4 enthusiasm:5 requiem:3 embryo:3 dryad:2 oasis:3 coincide:3 acre:2 ogre:2 massacre:3 sepulchre:3 spectre:2 sceptre:2 lustre:2 meagre:2 lucre:2 sabre:2 mitre:2 hyperion:4 endymion:4 prometheus:4 odysseus:4 medea:3 assuage:2 dissuade:2 alias:3 cordial:2 convenient:3 resilient:3 premier:2 gondolier:3 financier:3 peon:2 pantheon:3 galleon:3 boa:2 proprietary:5 eon:2 howled:1 growled:1 prowled:1 scowled:1 crawled:1 sprawled:1 drawled:1 bowled:1 embed:2 biped:2 unwed:2 aches:1 headaches:2 heartaches:2 toothaches:2 diabetes:4 socrates:3 hercules:3`;
EXC_SWEEP.split(/\s+/).forEach(pair => { const i = pair.lastIndexOf(':'); if (i > 0) EXC[pair.slice(0, i)] = Number(pair.slice(i + 1)); });

/* "ea" that says short e, "oo" that says short oo, "ow" that says long o: used by the rhyme key. */
const SHORT_EA = new Set('breast breasts bread dead head thread spread dread tread instead stead death breath meant dreamt sweat threat wealth health stealth realm deaf heaven heavy weapon leather feather weather ready steady already pleasant peasant measure pleasure treasure jealous zealous breakfast heather leaven endeavor endeavour bedspread forehead ahead behead redhead widespread homestead breadth cleanse cleanly meadow meadows sweater'.split(' '));
const SHORT_OO = new Set('book look took cook hook brook crook nook rook shook foot good hood stood wood wool soot understood withstood childhood neighborhood neighbourhood likelihood livelihood boyhood manhood womanhood brotherhood sisterhood falsehood footstool cookbook notebook textbook handbook overlook outlook forsook mistook crooked wooden woolen woollen goody goodness'.split(' '));
const LONG_OW = new Set('snow flow flown glow grow grown show shown blow blown know known throw thrown slow low below bellow row bow bowl own sown stow tow mow crow arrow sorrow tomorrow borrow morrow follow hollow swallow shallow fellow yellow mellow billow pillow willow window widow shadow meadow elbow rainbow narrow marrow harrow sparrow furrow burrow borough thorough owe owed owes flowed glowed showed blowed snowed stowed towed mowed crowed rowed sowed bestow bestowed overflow overthrow undertow bungalow buffalo tallow callow sallow wallow gallows minnow winnow hallow hallowed hallows allow ahem yellows pillows willows windows shadows meadows arrows sorrows borrows follows fellows hollows swallows elbows rainbows crows rows bows shows blows knows flows glows grows throws snows slows lows mows stows tows owns'.split(' '));
LONG_OW.delete('allow'); LONG_OW.delete('ahem');
const UV_O = new Set('love dove above glove shove some come become done none one won ton son month front among tongue monk money honey wonder mother brother other another cover color colour comfort company compass onion oven govern dozen cousin double trouble couple touch young tough rough enough blood flood of nothing something somewhat somehow somewhere someone comes loves gloves doves shoves wonders mothers brothers others covers colors colours comforts onions ovens governs dozens cousins doubles troubles couples touches youngs bloods floods lovely loved coming becoming undone outdone discover recover uncover beloved loving unloved'.split(' '));
const U_O = new Set('move prove lose whose tomb womb do to two who shoe lose move approve improve remove prove moves proves loses tombs wombs shoes moved proved lost'.split(' '));
U_O.delete('lost');

/* ------------------------------------------------------------------ syllables */
function core(tok) {
  const m = String(tok || '').match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*[\p{L}\p{N}]|[\p{L}\p{N}]/u);
  return m ? m[0] : '';
}
function foldAccents(w) {
  // a sounded final é (café, José, résumé) keeps its vowel; every other accent folds to its plain letter (naïve, Zoë)
  return w.replace(/é$/, 'ay').normalize('NFD').replace(/\p{M}/gu, '');
}
function sylWord(raw) {
  let w = String(raw || '').toLowerCase().replace(/[’‘`´]/g, "'");
  if (!w) return 0;
  if (w === '&') return 1;
  w = w.replace(/èd$/, 'id');
  if (/(s|x|z|ch|sh|ce|ge|se|ze)'s$/.test(w)) return sylWord(w.slice(0, -2)) + 1;   // church's, horse's, James's                    // a grave accent sounds the -ed: belovèd, wreathèd
  if (/[^\x00-\x7f]/.test(w)) w = foldAccents(w);
  if (w.includes('-')) return w.split('-').filter(Boolean).reduce((a, b) => a + sylWord(b), 0) || 1;
  if (EXC[w] != null) return EXC[w];
  if (/^\d+$/.test(w)) return numberSyllables(w);
  let s = w.replace(/[^a-z']/g, '');
  if (!s) {
    // Letters outside ASCII (café, naïve): count vowel groups and be done.
    return Math.max(1, (w.match(/[aeiouyàáâäãåèéêëìíîïòóôöõùúûüýÿœæ]+/g) || []).length);
  }
  s = s.replace(/([^aeiou])n't$/, '$1en').replace(/n't$/, 'n').replace(/'(s|ll|re|ve|d|m|t)$/, '').replace(/'/g, '');   // didn't = did-n't, can't = can't
  if (EXC[s] != null) return EXC[s];
  if (s.length <= 2) return 1;
  let c = 0;
  s = s.replace(/([aeiou])y([aeiou])/g, '$1j$2');    // y between vowels is a consonant (beyond, player, royal)
  s = s.replace(/qu/g, 'q').replace(/gue$/, 'g').replace(/que$/, 'k').replace(/gues$/, 'gs').replace(/ques$/, 'ks');
  if (/[aeiouy]sm$/.test(s)) c += 1;                   // prism, chasm, criticism
  if (/[aeiou]ing$/.test(s) || /ying$/.test(s)) c += 1; // being, flying
  if (/[aeiouy][^aeiouy]+i(er|est)$/.test(s)) c += 1;  // happier, easiest
  if (/iety$/.test(s)) c += 1;                         // society, anxiety
  if (/[ctl]iat/.test(s)) c += 1;                      // appreciate, negotiate, affiliation
  s = s.replace(/^some(?=[bdhstw])/, 'som');            // something, somewhere, sometimes
  s = s.replace(/([aeiouy][^aeiouy]+)e(?=(l[iy](ness|er|est)?|ness|less(ly|ness)?|ful(ly|ness)?|ment|some|ward|wise|work|wood|where|what|way|thing|time|times|day|how|body|land|ship|side|sick|yard|house|hold|keep|like|teen|ty|ly|fore|by|with|groom|stone|sale|place|guard|made|long|fly|well|roy)$)/, (m, stem) => /[^aeiouy]l$/.test(stem) ? m : stem);  // lovely, statement, homework, ninety (not settlement)
  if (/(?<!f)[bdlmnprvz]ien/.test(s)) c += 1;          // audience, obedient, alien, experience
  if (/[^cstgxh]io(?!n)/.test(s)) c += 1;              // violet, radio, curious, prior
  if (/[^cstgxl]ia/.test(s)) c += 1;                   // radiant, diamond, trial, material
  if (/[^aeiou]eo(?![nu])/.test(s)) c += 1;            // video, theory, geology
  if (/[^aeiouqg]ua/.test(s)) c += 1;                  // usual, graduate, January, valuable
  if (/[^aeiouqg]uo/.test(s)) c += 1;                  // duo, virtuoso
  if (/[^aeiouqg]ui(d|n(?!g$))/.test(s)) c += 1;       // ruin, fluid, genuine (not the -ing of suing, pursuing)
  if (/[^aeiouqg]ue[lnt]/.test(s)) c += 1;             // cruel, fluent, duet
  if (/[^cg]eous$/.test(s)) c += 1;                    // spontaneous, hideous
  // -ed: silent unless after t or d, or after a consonant cluster that could not end a word (hundred, settled)
  if (/[^aeiouytd]ed$/.test(s) && !/[^aeiouylr][rl]ed$/.test(s)) s = s.slice(0, -2) + 'x';
  // -es: a syllable after s, x, z, ch, sh, soft c and g, or after a syllabic -le; otherwise silent
  if (/[^aeiouy]es$/.test(s) && !/(s|x|z|ch|sh|[cg]|[^aeiouy]l)es$/.test(s)) s = s.slice(0, -2) + 'x';
  // final silent e, except after consonant + l (table) and in short words
  if (/[^aeiouy]e$/.test(s) && !/[^aeiouy]le$/.test(s) && s.length > 2) s = s.slice(0, -1);
  c += (s.match(/[aeiouy]+/g) || []).length;
  return Math.max(1, c);
}
// Numerals as they are said: 4:30 four thirty, 7:05 seven oh five, $5 five dollars, 50% fifty percent, 1990s, 21st.
function numeralSyllables(text) {
  const t = String(text || '').replace(/^[^\d$]+/, '');
  const num = s => numberSyllables(s.replace(/,/g, ''));
  let m;
  if ((m = t.match(/^\$(\d[\d,]*)(?:\.(\d\d))?/))) return num(m[1]) + 2 + (m[2] && m[2] !== '00' ? 1 + numberSyllables(String(+m[2])) + 2 : 0);
  if ((m = t.match(/^(\d{1,2}):(\d\d)/))) return num(m[1]) + (m[2] === '00' ? 2 : m[2][0] === '0' ? 1 + numberSyllables(m[2][1]) : numberSyllables(m[2]));
  if ((m = t.match(/^(\d[\d,]*)%/))) return num(m[1]) + 2;
  if ((m = t.match(/^(\d[\d,]*)/))) return num(m[1]);
  return 0;
}
function numberSyllables(d) {
  const n = Number(d);
  if (!isFinite(n)) return d.length;
  if (n === 0) return 2;
  // years are read in halves: 1999 is nineteen ninety-nine, 1905 nineteen oh five, 1900 nineteen hundred
  if ((n >= 1100 && n <= 1999) || (n >= 2010 && n <= 2099)) { const hi = Math.floor(n / 100), lo = n % 100; return numberSyllables(String(hi)) + (lo === 0 ? 2 : lo < 10 ? 1 + numberSyllables(String(lo)) : numberSyllables(String(lo))); }
  if (n < 20) return [1,1,1,1,1,1,1,2,1,1,1,3,1,2,2,2,2,3,2,2][n] || 1;
  if (n < 100) { const tens = [0,0,2,2,2,2,2,3,2,2][Math.floor(n / 10)]; return tens + (n % 10 ? numberSyllables(String(n % 10)) : 0); }
  if (n < 1000) return numberSyllables(String(Math.floor(n / 100))) + 2 + (n % 100 ? numberSyllables(String(n % 100)) : 0);
  if (n < 10000) return numberSyllables(String(Math.floor(n / 1000))) + 2 + (n % 1000 ? numberSyllables(String(n % 1000)) : 0);
  return d.length * 2;
}

/* ------------------------------------------------------------------ stress */
const FUNCTION_WORDS = new Set(`a an the and but or nor so yet for of to in on at by with from as than that this these those it its he she we they you i me him her us them my your his our their be am is are was were been do does did has have had will would shall should can could may might must if then when where while who whom whose which what up out off down into onto upon over under through till until unless since because though although nor either neither both each every any some no not o oh ah ye thee thou thy thine mine own just too very there here how why also ere oft 'tis tis twas 'twas yes & th t art hath doth dost hast wilt shalt canst couldst wouldst shouldst didst more most such 'gainst 'mid 'mongst whilst`.split(/\s+/));
const IAMBIC = new Set(`ago although became begat altern provoc evoc endow avow about above abroad absorb absurd abuse accept accord account accuse achieve acquire across adapt address adjust admire admit adopt adore adorn advance advice advise afar affair afford afraid again against agree ahead alarm alas alight alike alive allow allure alone along aloof aloud amaze amen amid among amount amuse anew annoy apart appeal appear applause apply approach approve arise arose around arouse array arrest arrive ascend ashamed aside asleep assail assault assent assert assign assist assume assure astray attach attack attain attempt attend attire attract avail avoid await awake aware away awoke awry baptize because become befall before began begin begot begun behave behead behind behold belief believe belong beloved below beneath bequeath beseech beset beside bestow betide betray between beware beyond bizarre canal career caress cement cigar collapse collect combine command commence commit compare compel complain complete comply compose comprise conceal conceit conceive concern conclude condemn confess confide confine confirm conform confuse connect consent conserve consign consist console construct consult consume contain contempt contend content control convey convince correct corrupt create debate decay deceit deceive decide declare decline decree deduce defeat defend defer define defy degree delay delete delight demand deny depart depend depict deplore deprive derive descend describe deserve design desire despair despise despite destroy detach detain detect deter devise devoid devote devour direct discern discuss disdain disease disgrace disguise dismay dismiss display dispose dispute distinct distress disturb divide divine divorce domain elapse elect elite elope elude embark embrace emerge employ enclose endure enforce engage enjoy enough enrage enrich ensue ensure entire entreat erase erect escape estate esteem event evoke exact exalt exceed except excess exchange excite exclaim exclude excuse exert exhale exhaust exist expand expect expel expense expire explain explode explore expose express extend extent extreme forbear forbid forgave forget forgive forgo forgot forlorn forsake forsook fulfil fulfill giraffe guitar hello hotel humane ignore immense impart impose impress improve incline include indeed induce infer inform inhale inquire inside insist inspire instead instill insure intend intense invade invent invite involve itself lament machine maintain mature mistake mistook misuse misled mislead misjudge misplace mistrust myself obey oblige obscure observe obtain occur offend omit oppose oppress ordain outdo outgrow outlast outlive outrun outshine outweigh parade patrol perceive perform perhaps permit persist persuade pertain perverse police polite possess postpone precede precise prefer prepare preserve presume pretend prevail prevent proceed proclaim profane profound prolong promote propose protect provide provoke pursue rebuke recall receive recite record recur redeem reduce refer refine reflect refrain refuse regain regard regret rejoice relate relax release relent relief relieve rely remain remark remind remote remove renew renown repair repay repeat repent replace reply report repose repress request require rescind resent reserve reside resign resist resolve resort respect respond restore restrain result resume retain retire retreat return reveal revere reverse review revive revolt reward romance secure seduce select serene severe sincere subdue submit subside succeed success suffice suggest supply support suppose suppress supreme surpass surprise surround survive sustain today tonight toward transcend transform translate transport unbound unborn unclean undone unfit unfold unheard unite unjust unkind unknown unless unlike unseen untie until unveil unwind upon upset uphold uplift upstairs withdraw withhold within without withstand yourself herself himself abide ado ajar aloft amiss anon askew athwart awhile enorm tremend stupend horrend intact adrift adept abrupt august austere baroque benign bereft bereave bizarre brunette canoe cascade cliche crusade decoy decrease delude demure deploy depose depress despond detest dethrone devout diffuse digest dilute discard discharge disclose discreet discrete disgust dislike dismount disown displace displease dispel disrobe distract distrust disuse divest divulge eclipse edict elate embalm embed emit enact encase enchant encroach endorse enfold engulf enlist enrol enroll enslave enthrall entice entomb entrust entwine enwrap equip erode erupt evade evict evince evolve excel exempt exhort exhume expound expunge extol extort extract exude exult forsworn forswear immerse immune impair impeach impede impel implore imply import impute incense incite incur indict induct indulge infect infest inflame inflate inflict infuse ingest inhere inhume inject insane insert inspect install instruct insult intrude inure invoke lampoon marine mature misdeed mishap misread mistime misname morose obsess obtrude obtuse occult outcast outdo outface outgo outpace outpour outreach outright outstrip outwit perchance perforce permit perplex pervade pollute portray prelude premise prescribe presage pretense profuse prorogue protrude purvey rebuild rebut recant recede recess recoil recount redress refit reform refute regale rehearse reject relapse relay remiss remit renounce repast repel repine reprieve reprove repulse repute rescue resound restrict retort retrace retract revile revise revoke robust rotund sedate seclude secrete sublime subsist subtract subvert suspect suspend taboo technique tirade traverse umbrella unarm unbend unclasp uncurl undo unfurl unlace unlock unmask unmoved unpack unreal unrest unsaid unsung untold untrue unwell unwise unworn vacate espouse accurse bemoan belove beweep bewail beguile belie belied betroth betrothed usurp usurped imprison colossal primeval surmise demesne brigade whereon`.split(/\s+/));
IAMBIC.delete('outcast');
const TROCHAIC_FORCE = new Set('under uncle unto union unit units unity universe uniform unison unicorn unify misty mister mistress missile missing mission misery miser disc dish dismal distance distant district outcast outlaw outline outward outcome output outfit outrage upright upper upward upshot overt overly record present content contest object subject rebel permit protest produce conduct contract convict desert digest escort export import increase insult perfume progress project rebel refuse survey suspect transfer transport'.split(/\s+/));
const LAST_STRESS = new Set('indistinct understand understood overcome disappear introduce represent recommend entertain interfere intervene overthrow undertake overlook underneath reappear disagree disallow disobey disbelieve misunderstand nonetheless nevertheless afternoon engineer volunteer pioneer guarantee refugee magazine tambourine submarine japanese picturesque silhouette cigarette serenade lemonade masquerade promenade kangaroo incomplete indiscreet inexact unaware unafraid overflow overhead overheard overjoyed overrun overseas overwhelm overwrought overgrown overnight undergo underline undergrad underpay undersea undersold underworn underfoot evermore furthermore heretofore nevermore anymore inasmuch insomuch whatsoever whosoever howsoever wheresoever'.split(/\s+/));
const PENULT3 = new Set('already altogether idea ideas ideal ideals another together forever whatever whenever wherever whoever however remember deliver consider continue discover tomorrow important eternal immortal internal external maternal paternal infernal nocturnal supernal according forgotten begotten companion religion familiar peculiar horizon museum umbrella vanilla banana piano potato tomato volcano tobacco mosquito agenda dilemma aroma diploma arena hyena sonata apparent transparent arrival survival revival approval removal disposal proposal refusal recital appearance assurance endurance resistance insistence existence acceptance allowance compliance defiance reliance alliance adventure departure procedure agreement commandment commitment enjoyment employment excitement arrangement engagement discernment adornment atonement fulfillment acquaintance attendance abundance remembrance abandon abolish accomplish accustom admonish astonish develop envelop establish embarrass embellish encounter endeavor endeavour examine imagine determine illumine inhabit inherit exhibit prohibit inhibit deposit disorder disaster disciple discourage disfigure dishonor dishonour dismantle distinguish diminish replenish relinquish demolish bewilder bedevil beginner believer betrayer conductor consumer container commander committee confetti consensus contentment creator decipher decorum defector demeanor denial dependent designer detective detergent dictator director disclosure discomfort discredit disgraceful disgusting dishonest dismissal displeasure distraction distressing disturbance effective elusive embargo employer enchantment enormous enrichment entitle equipment exceeding excessive exhausted expansion expensive extensive forbidden forgiveness forsaken gorilla guerrilla impressive incentive incumbent indulgence inertia informal injustice insistent inspector instructor investor jamaica madonna manila manhattan miranda momentous november december september october offensive opponent opposing pajamas pervasive portentous precaution pretentious professor projector reluctant remainder reminder repentant replacement reporter resemblance resentment retirement sahara semester sincerely spectator stupendous supporter surrender surrounding survivor tremendous triumphant uncertain uncommon unfaithful unhappy unwilling veranda whatever whichever elsewhere wherever assembly consider courageous outrageous advantage disadvantage percentage exhausting astounding abounding confounding resounding surrounding attendant attendance pretender defender offender contender perfecter'.split(/\s+/));
// The words a sonnet turns on, as the app tells students: but, yet, though, still, so, and their kin. Not "and" or "when".
const TURN_WORDS = new Set('but yet though although still however so thus therefore hence then now nor whereas alas'.split(/\s+/));
const DANGLERS = new Set('the a an of to and or but nor in on at by for with from as than that which who whose my your his her its our their this these those some any no not very such each every into upon within without through toward towards until unless if when while because although though whether'.split(/\s+/));

// Words the suffix rules would get wrong, stressed by hand: 1 primary, 0 weak.
const STRESS_OVERRIDE = { thyself: '01', ourself: '01', ourselves: '01', themselves: '01', alack: '01', defence: '01', defense: '01', offence: '01', offense: '01', offences: '010', descry: '01', descries: '01', unbred: '01', unbent: '01', almighty: '010', assorted: '010', caprice: '01', casualty: '1000', catechism: '1020', compacted: '010', disdaineth: '010', diverged: '01', engenders: '010', fatigue: '01', methinks: '01', obstructs: '01', outbraves: '01', superhuman: '2010', transposing: '010', agamemnon: '2010', admirably: '1000', intent: '01', descent: '01', suspense: '01', askance: '01', aback: '01', increase: '01', decease: '01', creature: '10', creatures: '10', mariner: '100', mariners: '100', beautifully: '1000', pierian: '0100', galilee: '100', everything: '100', everyone: '100', anyone: '100', nobody: '100', somebody: '100' };
// Stresses checked word by word against Merriam-Webster on the same corpus (1 primary, 2 secondary, 0 weak).
const STRESS_SWEEP = `emoji:010 eleven:010 percent:01 iguana:010 computer:010 restart:01 remembers:010 empanadas:2010 avocado:2010 tortilla:010 croissant:01 pastelitos:2010 guayaba:010 croquetas:010 ventanita:2010 maduros:010 guacamole:2010 spaghetti:010 papaya:010 burritos:010 jalapeño:2010 biscayne:01 alligators:1020 palmetto:010 miami:010 expressway:012 aventura:2010 escalators:1020 arepas:010 tequeños:010 havana:010 doral:01 graffiti:010 nicaraguan:2010 tamiami:2010 announcement:010 tornadoes:010 sargassum:010 barracuda:2010 garage:01 nostalgia:010 okay:21 self-driving:210 violin:201 naive:01 reunion:010 hawaiian:010 casino:010 maria:010 sylvester:010 soprano:010 cafe:01 salami:010 sophia:010 aaliyah:010 sebastian:010 mateo:010 camila:010 daniela:010 tattoo:01 quesadilla:2010 enchilada:2010 piñata:010 australian:010 brazilian:010 calculator:1020 elevator:1020 radiator:1020 colada:010 estefan:010 cortadito:2010 rescue:10 premise:10 prelude:12 edict:12 mishap:12 overt:01 july:01 canteen:01 routine:01 grenade:01 charade:01 arcade:01 bazaar:01 quartet:01 bouquet:01 duet:01 shampoo:01 bamboo:01 regime:01 terrain:01 campaign:01 champagne:01 cocaine:01 arcane:01 urbane:01 inane:01 obscene:01 ornate:01 innate:01 malign:01 alert:01 inert:01 akin:01 afoot:01 ablaze:01 aghast:01 aglow:01 afloat:01 ashore:01 aboard:01 abode:01 aflame:01 apace:01 ascent:01 conspire:01 transpire:01 perspire:01 bewitch:01 beget:01 behest:01 bemoan:01 bewail:01 betwixt:01 behalf:01 belie:01 bedew:01 begone:01 beheld:01 forbade:01 foretold:01 foresee:01 beguile:01 bedeck:01 benumb:01 bequest:01 berate:01 compute:01 concur:01 condone:01 confer:01 contrive:01 constrain:01 construe:01 contort:01 commend:01 compile:01 concede:01 condense:01 confront:01 congeal:01 connive:01 debase:01 decease:01 decry:01 deduct:01 defame:01 defile:01 deform:01 defraud:01 degrade:01 demean:01 demise:01 demur:01 denote:01 denounce:01 deride:01 desist:01 recline:01 refresh:01 remorse:01 reproach:01 revenge:01 predict:01 preside:01 profess:01 propel:01 procure:01 pronounce:01 imbue:01 impale:01 impure:01 inept:01 infirm:01 inscribe:01 intone:01 invest:01 adjourn:01 adhere:01 allay:01 allot:01 allude:01 amass:01 amend:01 appall:01 applaud:01 appoint:01 ascribe:01 atone:01 attest:01 avert:01 succumb:01 suffuse:01 supplant:01 surmount:01 perturb:01 transgress:01 expend:01 extinct:01 eject:01 ambiguity:20100 continuity:20100 gratuity:0100 perpetuity:20100 ingenuity:20100 spontaneity:20100 theatrical:0100 civilian:010 egyptian:010 elysian:010 dominion:010 rebellion:010 communion:010 opinion:010 battalion:010 pavilion:010 vermilion:010 medallion:010 oblivion:0100 accordion:0100 criterion:0100 centurion:0100 contagion:010 ambiguous:0100 contiguous:0100 zoology:0100 ignorance:100 allegiance:010 coincidence:0100 independence:2010 destructive:010 progressive:010 objective:010 subjective:010 beweep:01 outcast:12 afresh:01 fore-bemoanèd:2010 restored:01 besmeared:01 overturn:201 all-oblivious:20100 confound:01 transfix:01 defaced:01 outworn:21 down-razed:21 confounded:010 compounded:010 whereon:01 consumed:01 perceivest:01 ever-fixed:201 pursuit:01 proposed:01 belied:01 false-speaking:210 delivery:0100 o'erthrow:01 usurped:01 betrothed:01 imprison:010 abound:01 therewith:01 methought:01 espousèd:010 alcestis:010 rescued:10 restraint:01 avenge:01 piemontese:201 redoubled:010 italian:010 assay:01 eternize:012 whenas:01 hélas:01 travail:01 afore:01 up-gathered:210 beautifully:1000 heroic:010 ourselves:01 creature:10 apollo:010 expanse:01 demesne:01 surmise:01 cortez:01 traveller:100 colossal:010 unrepealed:201 transparence:010 beguiled:01 imprest:01 themselves:01 thereby:01 belovèd:010 astride:01 imprisoned:010 autumnal:010 accursèd:010 constrained:01 outnumbered:010 demented:010 goodbyes:01 aspire:01 brigade:01 lenore:01 ojibways:012 dacotahs:010 nawadaha:2010 surmised:01 interposed:201 abash:01 unequal:010 enamel:010 avalanching:1020 representative:20100 initiative:0100 affirmative:0100 intuitive:0100 defective:010 decisive:010 exclusive:010 explosive:010 defensive:010 aggressive:010 submissive:010 attentive:010 productive:010 deceptive:010 receptive:010 evasive:010 conclusive:010 seductive:010 appreciate:0102 associate:0102 negotiate:0102 initiate:0102 substantiate:0102 enunciate:0102 differentiate:20102 irate:01 manure:01 immature:201 canary:010 anniversary:20100 documentary:20100 complimentary:20100 elementary:2010 auxiliary:0100 discovery:0100 recovery:0100 artillery:0100 machinery:0100 embroidery:0100 debauchery:0100 periphery:0100 illusory:0100 lunatic:102 politic:102 heretic:102 rhetoric:100 choleric:100 arabic:100 arsenic:100 politics:102 etiquette:100 delirium:0100 millennium:0100 geranium:0100 aquarium:0100 gymnasium:0100 symposium:0100 auditorium:20100 equilibrium:20100 militia:010 acacia:010 magnolia:010 amnesia:010 anesthesia:2010 mausoleum:2010 petroleum:0100 linoleum:0100 lyceum:010 european:2010 cerulean:0100 mediterranean:200100 subterranean:20100 panacea:2010 behavior:010 optimism:1020 mechanism:1020 patriotism:10020 unable:010 unfathomable:01000 recover:010 rewrite:01 retell:01 revisit:010 remorseless:010 remorseful:010 resemble:010 rearrange:201 reawaken:2010 reinforce:201 reaffirm:201 reopen:010 disarm:01 disband:01 dismember:010 dishearten:010 discolor:010 disparage:010 misfortune:010 misspell:01 misgiving:010 mischance:01 misgovern:010 misshapen:010 mismanage:010 overtake:201 overshadow:2010 overpower:2010 overreach:201 overrule:201 overweening:2010 underworld:102 undergrowth:102 underground:102 undercurrent:1020 understate:201 undermine:201 undertaker:1020 underling:100 underwear:102 undercover:2010 understudy:1020 underlie:201 undergrad:102 interrupt:201 interact:201 intercept:201 interpret:010 interstellar:2010 intertwine:201 interweave:201 intercede:201 interpose:201 intermingle:2010 furthermore:102 honeymoon:102 everlasting:2010 forevermore:0201 hereafter:010 notwithstanding:2010 whatsoever:2010 farewell:01 goodbye:01 wherein:01 therein:01 whereas:01 melancholy:1020 alabaster:1020 paradise:102 fraternal:010 abysmal:010 betrothal:010 abundant:010 redundant:010 resplendent:010 indignant:010 malignant:010 defiant:010 enigma:010 memento:010 tornado:010 bravado:010 armada:010 aurora:010 extinguish:010 encourage:010 entangle:010 embitter:010 embody:010 embolden:010 emblazon:010 encircle:010 encompass:010 endanger:010 enlighten:010 enliven:010 ennoble:010 enthrone:01 ensnare:01 engrave:01 endear:01 entail:01 foreshadow:010 corporeal:0100 funereal:0100 empyrean:2010 triumphant:010 oasis:010 coincide:201 diana:010 adonis:010 narcissus:010 olympus:010 parnassus:010 hyperion:0100 endymion:0100 prometheus:0100 odysseus:0100 medea:010 assuage:01 dissuade:01 premier:01 gondolier:201 financier:201 proprietary:01020 contested:010 unrequited:2010 disappointed:2010 affected:010 neglected:010 perfected:010 construed:01 imbued:01 endeared:01 persevered:201 awakened:010 enlightened:010 endangered:010 enamored:010 bewitched:01 benighted:010 besieged:01 bedecked:01 becalmed:01 rescues:10 diabetes:2010 achilles:010 ulysses:010`;
STRESS_SWEEP.split(/\s+/).forEach(pair => { const i = pair.lastIndexOf(':'); if (i > 0 && !STRESS_OVERRIDE[pair.slice(0, i)]) STRESS_OVERRIDE[pair.slice(0, i)] = pair.slice(i + 1); });
function stripNeutral(s) {
  // Returns [stem, suffixSyllables] for an inflectional or neutral suffix, or null.
  const rules = [
    [/ically$/, 'ic', 2], [/ally$/, 'al', 1], [/ingly$/, '', 2], [/edly$/, '', 1],
    [/ness$/, '', 1], [/less$/, '', 1], [/ful$/, '', 1], [/ment$/, '', 1], [/ships?$/, '', 1], [/hood$/, '', 1], [/dom$/, '', 1],
    [/ingness$/, '', 2], [/ing$/, '', 1], [/ings$/, '', 1], [/ed$/, '', 1], [/ers$/, '', 1], [/er$/, '', 1], [/est$/, '', 1], [/ly$/, '', 1],
    [/ism$/, '', 2], [/isms$/, '', 2], [/ist$/, '', 1], [/ists$/, '', 1], [/izes?$/, '', 1], [/ises?$/, '', 1], [/ized$/, '', 1], [/ised$/, '', 1], [/izing$/, '', 2],
    [/able$/, '', 2], [/ably$/, '', 2], [/ous$/, '', 1], [/al$/, '', 1], [/ous$/, '', 1], [/ive$/, '', 1], [/ance$/, '', 1], [/ence$/, '', 1], [/ant$/, '', 1], [/ent$/, '', 1], [/ure$/, '', 1], [/ure$/, '', 1], [/es$/, '', 0], [/s$/, '', 0]
  ];
  for (const [re, rep, n] of rules) {
    if (re.test(s)) { const stem = s.replace(re, rep); if (stem.length >= 2 && /[aeiouy]/.test(stem)) return [stem, n]; }
  }
  return null;
}
function baseStress(w, n) {
  // Primary stress index for a word of n syllables; -1 if unknown.
  if (n === 1) return 0;
  if (LAST_STRESS.has(w)) return n - 1;
  if (n >= 3 && IAMBIC.has(w)) return 1;
  if (n === 2) { if (IAMBIC.has(w)) return 1; if (TROCHAIC_FORCE.has(w)) return 0; }
  if (n === 3 && PENULT3.has(w)) return 1;
  if (n >= 3 && PENULT3.has(w)) return n - 2;
  if (/(tion|sion|cian|xion|cial|tial|sial|cious|tious|xious|gious|geous|cient|tient|cience|tience|tiate|ciate)s?$/.test(w)) return Math.max(0, n - 2);
  if (/(ic|ics|ique|esque|ette|eer|oon|aire|elle)$/.test(w)) return /(ique|esque|ette|eer|oon|aire|elle)$/.test(w) ? n - 1 : Math.max(0, n - 2);
  if (/(ity|ety|ify|ified|ifies|logy|graphy|metry|nomy|pathy|cracy|ical|ious|eous|uous|ial|ian|ium|ia|io|ient|ience|ual|uate|iate|iant|iance|ier|iest|ible|ibly)$/.test(w)) return Math.max(0, n - 3);
  if (/ically$/.test(w)) return Math.max(0, n - 4);
  if (n >= 4 && /(ary|ery|ory)$/.test(w)) return Math.max(0, n - 4);
  if (n >= 3 && /ate$/.test(w)) return n - 3;
  if (n === 3 && /(ative|itive)s?$/.test(w)) return w === 'creative' ? 1 : 0;
  if (n >= 4 && /itives?$/.test(w)) return n - 3;
  if (n >= 4 && /atives?$/.test(w)) {
    const stem = w.replace(/atives?$/, '');
    if (IAMBIC.has(stem) || IAMBIC.has(stem + 'e')) return n - 3;
    const b = baseStress(stem + 'ate', n - 1);
    return b >= 0 ? b : n - 4;
  }
  return -1;
}
function stressWord(raw, n) {
  // Returns an array of stress values per syllable: 1 primary, 0.5 secondary, 0 weak; or 'F' for a function monosyllable.
  let w = String(raw || '').toLowerCase().replace(/[’‘`´]/g, "'");
  if (n >= 2 && /[^e]é$/.test(w)) { const out = new Array(n).fill(0); out[n - 1] = 1; return out; }
  if (n >= 2 && /èd$/.test(w)) { const stem = w.replace(/èd$/, 'e'); const head = stressWord(stem, n - 1).map(v => (v === 'F' ? 1 : v)); if (head.length === n - 1) return head.concat([0]); }
  if (/[^\x00-\x7f]/.test(w)) w = foldAccents(w);
  w = w.replace(/'d$/, 'ed').replace(/'st$/, 'est');   // consum'd is consumed, perceiv'st is perceivest
  if (STRESS_OVERRIDE[w] && STRESS_OVERRIDE[w].length === n) return STRESS_OVERRIDE[w].split('').map(d => (d === '2' ? 0.5 : Number(d)));
  if (n <= 1) return FUNCTION_WORDS.has(w) || FUNCTION_WORDS.has(w.replace(/'/g, '')) ? ['F'] : [1];
  if (w.includes('-')) {
    const parts = w.split('-').filter(Boolean);
    const out = [];
    for (const p of parts) { const k = sylWord(p); const st = stressWord(p, k).map(v => v === 'F' ? 0.5 : v); out.push(...st); }
    if (out.length === n) { for (let i = 1; i < out.length; i++) if (out[i] === 1) out[i] = 0.5; return out; }
  }
  w = w.replace(/n't$/, 'n').replace(/'(s|ll|re|ve|d|m|t)$/, '').replace(/'/g, '').replace(/[^a-z]/g, '');
  const pat = new Array(n).fill(0);
  let idx = baseStress(w, n);
  if (idx < 0) {
    // derived from a shorter word with a neutral suffix
    const st = stripNeutral(w);
    if (st) {
      const [stem, extra] = st;
      const cands = [stem, stem + 'e', stem.replace(/([^aeiou])\1$/, '$1'), stem.replace(/i$/, 'y')].map(c => [c, sylWord(c)]).filter(([c, k]) => k >= 1 && k <= n);
      const verbal = /(ed|ing|s)$/.test(w);
      for (const [cand, k] of cands) { if (IAMBIC.has(cand) || PENULT3.has(cand) || LAST_STRESS.has(cand) || (verbal && k === 2 && TROCHAIC_FORCE.has(cand) && /^(record|present|object|subject|rebel|permit|protest|produce|conduct|contract|convict|desert|digest|escort|export|import|increase|insult|perfume|progress|project|refuse|survey|suspect|transfer|transport)$/.test(cand))) { const b = (verbal && k === 2 && TROCHAIC_FORCE.has(cand)) ? 1 : baseStress(cand, k); if (b >= 0) { idx = b; break; } } }
      if (idx < 0) for (const [cand, k] of cands) { if (TROCHAIC_FORCE.has(cand) || EXC[cand] === k) { const b = baseStress(cand, k); if (b >= 0) { idx = b; break; } } }
      if (idx < 0 && cands.length && cands[0][1] === 1 && n <= 3 && !/^(un|de|be|dis|mis|re|en|em|ob|trans|out|ex|a[bcdfglmnprstv])/.test(w)) idx = 0;
      if (idx < 0) { for (const [cand, k] of cands) { const b = baseStress(cand, k); if (b >= 0 && k >= 2) { idx = b; break; } } }
      // stress retracts to the front in preference, confidence, president, excellent, maintenance
      if (idx === 1 && n === 3 && /(ence|ent|ance|ant|ency|ancy)$/.test(w) && cands.some(([c]) => /(fer|fide|vide|side|cede|vere|pete|tain|cel|cell)$/.test(c))) idx = 0;
    }
  }
  if (idx < 0 && n >= 2) {
    // un-, over-, under-, every-, any-, some-: prefix plus a word
    const pre = [['oer', 1], ['un', 1], ['over', 2], ['under', 2], ['every', 2], ['any', 2], ['some', 1], ['dis', 1], ['mis', 1], ['re', 1]];
    for (const [p, ps] of pre) {
      if (w.startsWith(p) && w.length - p.length >= 3 && !TROCHAIC_FORCE.has(w)) {
        const rest = w.slice(p.length);
        if ((p === 're' || p === 'dis' || p === 'mis') && !(IAMBIC.has(rest) || LAST_STRESS.has(rest) || PENULT3.has(rest))) continue;
        if (p === 'oer' && !/^o'?er/.test(String(raw).toLowerCase())) continue;
        if (p === 'un' && !/^[bcdfghjklmnpqrstvwxz]/.test(rest) && rest.length < 4) continue;
        const k = n - ps;
        if (k < 1) continue;
        const sub = stressWord(rest, k);
        if (sub.length !== k) continue;
        const head = p === 'un' || p === 'dis' || p === 'mis' || p === 're' || p === 'oer' ? [0] : ps === 2 ? [1, 0] : [1];
        const tail = sub.map(v => v === 'F' ? 1 : v);
        const out = head.concat(tail);
        if (head[0] === 1) { for (let i = head.length; i < out.length; i++) if (out[i] === 1) out[i] = 0.5; }
        return out.slice(0, n);
      }
    }
  }
  if (idx < 0) idx = n === 2 ? 0 : Math.max(0, n - 3);
  pat[idx] = 1;
  if (n >= 3 && idx === n - 1) pat[0] = 0.5;
  // a light secondary stress two syllables away in long words
  if (n >= 4) { if (idx - 2 >= 0) pat[idx - 2] = 0.5; if (idx + 2 <= n - 1 && idx + 2 !== n - 1) pat[idx + 2] = 0.5; else if (idx + 3 <= n - 1) pat[idx + 3] = 0.5; }
  return pat;
}

/* ------------------------------------------------------------------ rhyme keys (spelling made quasi-phonetic) */
function phon(raw, lastStressed) {
  let s = foldAccents(String(raw || '').toLowerCase()).replace(/[’‘`´]/g, "'").replace(/'/g, '').replace(/[^a-z]/g, '');   // a possessive s is sounded: day's rhymes with praise
  if (!s) return '';
  const w = s;
  const sub = (re, rep) => { s = s.replace(re, rep); };
  if (RESPELL[w]) s = RESPELL[w];
  sub(/gui(?=[^aeiou])/, 'gi');                             // guide, disguise, guile: the u is silent
  sub(/^([bg])uy(?=(s|er|ers|ing)$)/, '$1I');               // buys, buyer, buying, guys: said like buy
  sub(/ew(?=(ed|s|n|ly|ing|er|est)$)/, 'U');               // brewed, news, strewn, renewing, newer
  // words whose spelling hides their sound, said as a reader says them (and compounds that end in them: anywhere, o'erthrow)
  if (SAID[w]) return SAID[w];
  const tailWord = SAID_TAILS.find(k => w.length > k.length + 1 && w.endsWith(k));
  if (tailWord) return w.slice(0, -tailWord.length) + SAID[tailWord];
  // an open monosyllable keeps its vowel: me, be, she, we rhyme with sea; go, so, no rhyme with low
  if (/^[^aeiouy]+e$/.test(w)) return w.slice(0, -1).replace(/^wh/, 'w') + 'E';
  if (/^[^aeiouy]+o$/.test(w) && !U_O.has(w)) return w.slice(0, -1).replace(/^wh/, 'w') + 'O';
  sub(/ongue$/, 'ung'); sub(/gue(s?)$/, 'g$1'); sub(/que(s?)$/, 'k$1');
  sub(/ign(?=(ed|s|ing)?$)/, 'In');                        // sign, designed: the g is silent and the i is long
  sub(/ie(?=[^aeiou][aeiou])/g, 'E');                       // believing, achieving
  if (/^(give|gives|forgive|forgives|have)$/.test(w)) return w.replace(/e(s?)$/, '$1').replace(/^h/, 'h');   // give and have keep a short vowel
  sub(/([aeou])yed$/, '$1yd');   // played, obeyed, enjoyed: the -ed adds no vowel
  if (/^(heart|hearts|hearth|hearths|sweetheart|sweethearts)$/.test(w)) sub(/ear/, 'ar');
  // the "er" sound of heard, bird, word, fur and verse is one sound however it is spelled
  sub(/ear(?=[dlnc]|th|s(?!$))/, 'er');                     // earth, learn, heard, rehearse (not years)
  sub(/^wor(?=(d|ld|k|m|se|st|th|ship))/, 'wer');
  sub(/(?<![aeiouy])[iuy]r(?=[^aeiouy]|$)/g, 'er');
  sub(/^(s?w)ar(?=[mnd]?s?$)/, '$1or');                    // warm rhymes with storm, war with door
  sub(/^wa(?=t)/, 'wQ'); sub(/augh(?=t)/, 'Q');             // water rhymes with daughter
  sub(/our(?=[^aeiouy])/, 'or');                            // mourn, course, court say "or"
  sub(/([^aeiouy])ind(s?)$/, '$1Ind$2');                   // mind, kind, find, behind
  sub(/(ch|w|m)ild(s?)$/, '$1Ild$2');                      // child, wild, mild
  sub(/aste(s?)$/, 'Ast$1'); sub(/aight(s?)$/, 'At$1');    // waste, haste; straight
  // a vowel pair before a consonant keeps its sound when a silent e follows: praise, leave, grieve, cheese, house
  sub(/([aeiou]{2}[^aeiouycg]+)e$/, '$1');
  // whole-word vowel classes
  if (UV_O.has(w)) sub(/ough$/, 'uf'), sub(/o([^aeiou]*)e?([sd]?)$/, 'u$1$2'), sub(/ou/, 'u');
  if (U_O.has(w)) sub(/o([^aeiou]*)e([sd]?)$/, 'U$1$2'), sub(/^do$|^to$|^two$|^who$/, m => m[0] + 'U'), sub(/oe$/, 'U');
  else sub(/oe(s?)$/, 'O$1');                              // woe, foe, throes
  // endings
  sub(/tion$/, 'shun'); sub(/sion$/, 'zhun'); sub(/cian$/, 'shun'); sub(/tious$/, 'shus'); sub(/cious$/, 'shus'); sub(/xious$/, 'kshus'); sub(/gious$/, 'jus'); sub(/geous$/, 'jus');
  sub(/cial$/, 'shul'); sub(/tial$/, 'shul'); sub(/tient$/, 'shunt'); sub(/cient$/, 'shunt'); sub(/ture$/, 'chur'); sub(/sure$/, 'zhur'); sub(/ious$/, 'Eus'); sub(/eous$/, 'Eus'); sub(/uous$/, 'Uus'); sub(/ous$/, 'us');
  sub(/eight$/, 'At'); sub(/eigh$/, 'A'); sub(/ight(s?)$/, 'It$1'); sub(/igh(s?)$/, 'I$1'); sub(/igh(?=(ing|er|est)$)/, 'I'); sub(/[ae]y(?=ing$)/, 'A'); sub(/ought$/, 'Qt'); sub(/aught$/, 'Qt'); sub(/augh$/, 'af');
  if (/ough$/.test(s)) { if (/^(r|t|en|sl)ough$/.test(w)) sub(/ough$/, 'uf'); else if (/^(c|tr)ough$/.test(w)) sub(/ough$/, 'Qf'); else if (/through$/.test(w)) sub(/ough$/, 'U'); else if (/^(b|pl|sl)ough$/.test(w)) sub(/ough$/, 'W'); else sub(/ough$/, 'O'); }
  sub(/ould$/, 'Vd'); sub(/alk$/, 'Qk'); sub(/all$/, 'Ql'); sub(/alt$/, 'Qlt'); sub(/alf$/, 'af'); sub(/alm$/, 'am');
  sub(/stle$/, 'sul'); sub(/sten$/, 'sun'); sub(/ften$/, 'fun'); sub(/mb$/, 'm'); sub(/mn$/, 'm'); sub(/bt$/, 't'); sub(/gn$/, 'n'); sub(/^kn/, 'n'); sub(/^wr/, 'r'); sub(/^gn/, 'n'); sub(/^wh/, 'w'); sub(/^ps/, 's');
  // vowel digraphs
  sub(/iew/, 'U');                                          // view
  sub(/ee/g, 'E'); sub(/oa/g, 'O'); sub(/oi/g, 'Y'); sub(/oy/g, 'Y'); sub(/au/g, 'Q'); sub(/aw/g, 'Q'); sub(/ew(?=[^aeiou]*$)/, 'U'); sub(/ue$/, 'U'); sub(/ui(?=[^aeiou]+$)/, 'U'); sub(/oo/g, SHORT_OO.has(w) ? 'V' : 'U');
  const shortEa = SHORT_EA.has(w) || /(head|bread|dread|spread|thread|stead|breath|death|weather|feather|leather|heather|measure|pleasure|treasure|weapon|heaven)s?$/.test(w);
  if (shortEa) sub(/ea/, 'e');
  sub(/ea(?=[^aeiou]*$)/, /^(great|break|steak|yea)$/.test(w) ? 'A' : 'E'); sub(/ea/g, 'E');
  sub(/ie$/, 'I'); sub(/ied$/, 'Id'); sub(/ies$/, lastStressed ? 'Iz' : 'Ez'); sub(/ie(?=[^aeiou]+$)/, 'E');
  sub(/ei(?=[^aeiou]*$)/, /c|seiz|either|neither|leisure|weird|weir|sheik/.test(w) ? 'E' : 'A'); sub(/ey(?=[sd]?$)/, lastStressed ? 'A' : 'E'); sub(/ay(?=[^aeiouy]*$)/, 'A'); sub(/ai(?=[^aeiou]+$)/, 'A');
  sub(/uy$/, 'I'); sub(/eye$/, 'I'); sub(/ye$/, 'I');
  if (/ow/.test(s)) { const base = w.replace(/(ed|s|n|ing)$/, ''); sub(/ow/g, LONG_OW.has(w) || LONG_OW.has(base) || LONG_OW_TAILS.some(k => base.endsWith(k)) ? 'O' : 'W'); }
  sub(/ou(?=l)/, 'O'); sub(/ou(?=r$)/, 'W'); sub(/ou/g, /you|youth|group|soup|wound|route|tour|your|through|coupe|troupe|roup/.test(w) ? 'U' : 'W');
  // a silent e before -s or -d still lengthens its vowel (takes, named), and a silent -es or -ed adds no vowel
  sub(/([aeiouy])([^aeiouy])e([sd])$/, (m, v, c, x) => ((x === 'd' ? /[td]/.test(c) : /[sxzcg]/.test(c)) ? m : ({ a: 'A', e: 'E', i: 'I', o: 'O', u: 'U', y: 'I' })[v] + c + x));
  if (/[aeiouyAEIOUWQYV]/.test(s.slice(0, -2))) {          // red, bed, fled keep their vowel; only a real suffix -ed is trimmed
    sub(/(sh|ch|ss|[pkfx])ed$/, '$1t');
    sub(/([^aeiouyAEIOUWQYtd])ed$/, '$1d');
  }
  sub(/(sh|ch|ss|[pkfx])d$/, '$1t');                       // possess'd, kiss'd: a voiceless -'d says t
  sub(/([AEIOUWQYV])ed$/, '$1d');                          // brewed, renewed: the -ed after a vowel adds no vowel
  sub(/([^aeiouyAEIOUWQYsxzhcg])es$/, '$1s');
  // magic e: long vowel before consonant + e
  sub(/([aeiouy])([^aeiouy])e$/, (m, v, c) => ({ a: 'A', e: 'E', i: 'I', o: 'O', u: 'U', y: 'I' })[v] + (c === 'c' ? 's' : c === 'g' ? 'j' : c));   // grace keeps its soft c, page its soft g
  sub(/([aeiouy])re$/, (m, v) => ({ a: 'Ar', e: 'Er', i: 'Ir', o: 'or', u: 'Ur', y: 'Ir' })[v]);
  sub(/O(?=r[sz]?$)/, 'o');                               // bore, for, more and door share one vowel before r
  sub(/([^aeiouy])y$/, lastStressed ? '$1I' : '$1E');
  sub(/y(?=[^aeiouyAEIOUWQY])/g, 'i');
  // consonant tidying
  sub(/ck/g, 'k'); sub(/ph/g, 'f'); sub(/dge/g, 'j'); sub(/ge$/, 'j'); sub(/tch/g, 'ch'); sub(/c(?=[eiyE])/g, 's'); sub(/c/g, 'k'); sub(/x/g, 'ks'); sub(/qu/g, 'kw'); sub(/q/g, 'k');
  sub(/([bcdfghjklmnpqrstvwxz])\1/g, '$1');
  sub(/e$/, '');
  return s;
}
const VOWEL_RE = /[aeiouAEIOUWQYV]+/g;
const SAID = { height: 'hIt', heights: 'hIts', sleight: 'slIt', gone: 'gQn', foregone: 'forgQn', friend: 'frend', friends: 'frendz', again: 'agen', against: 'agenst', said: 'sed', says: 'sez',
  truth: 'trUth', build: 'bild', builds: 'bildz', built: 'bilt', choir: 'kwIr', choirs: 'kwIrz', i: 'I', are: 'ar', were: 'wer', there: 'thAr', where: 'wAr', ere: 'Ar',
  bear: 'bAr', bears: 'bArz', wear: 'wAr', wears: 'wArz', pear: 'pAr', pears: 'pArz', swear: 'swAr', forswear: 'forswAr', prayer: 'prAr', prayers: 'prArz',
  naive: 'nIEv', chloe: 'klOE', zoe: 'zOE', door: 'dor', doors: 'dorz', floor: 'flor', floors: 'florz', poor: 'pUr', moor: 'mor', oer: 'or',
  hour: 'Wr', hours: 'Wrz', our: 'Wr', ours: 'Wrz', flower: 'flWr', flowers: 'flWrz', power: 'pWr', powers: 'pWrz', tower: 'tWr', towers: 'tWrz', shower: 'shWr', showers: 'shWrz', bower: 'bWr', bowers: 'bWrz',
  eyed: 'Id', view: 'vU', views: 'vUz', viewed: 'vUd', review: 'revU', fire: 'fIr', fires: 'fIrz', higher: 'hIr', liar: 'lIr', sow: 'sO', sows: 'sOz', strown: 'strOn', key: 'kE', keys: 'kEz', eyes: 'Iz', eye: 'I' };
const RESPELL = { pretty: 'pritty', women: 'wimmen', busy: 'bizzy', business: 'bizness', sugar: 'shugar', beauty: 'byuty', eyed: 'Id' };
const SAID_TAILS = ['where', 'there', 'fire', 'flower', 'power', 'tower', 'friend', 'friends', 'hour', 'hours', 'choir'];
const LONG_OW_TAILS = ['throw', 'grow', 'flow', 'blow', 'glow', 'know', 'show', 'stow', 'low', 'bow'].filter(k => k !== 'bow' && k !== 'low');
// The coda without an inflection, when the spelling shows one: days -> day, played -> play (but not grace, rose, red).
function inflectionless(raw, coda) {
  const w = String(raw || '').toLowerCase().replace(/[’']/g, '');
  if (w.length >= 3 && /s$/.test(w) && !/(ss|us|is|as|os)$/.test(w) && /s$/.test(coda)) return coda.slice(0, -1);
  if (w.length >= 5 && /[^e]ed$/.test(w) && /d$/.test(coda)) return coda.slice(0, -1);
  return coda;
}
function saidOf(raw) {
  const w = foldAccents(String(raw || '').toLowerCase()).replace(/[’‘`´']/g, '').replace(/[^a-z]/g, '');
  return SAID[w] || (SAID_TAILS.find(k => w.length > k.length + 1 && w.endsWith(k)) ? w : null);
}
function rimeOf(raw, stress) {
  if (saidOf(raw)) stress = [1];                              // flower, hour, fire: said as one rhyming syllable
  const n = stress ? stress.length : 1;
  const lastStressed = n === 1 || stress[n - 1] === 1 || stress[n - 1] === 'F';
  const p = phon(raw, lastStressed);
  if (!p) return { key: '', vowel: '', coda: '', feminine: false, bare: '' };
  let groups = []; let m; VOWEL_RE.lastIndex = 0;
  while ((m = VOWEL_RE.exec(p))) groups.push({ i: m.index, v: m[0] });
  if (!groups.length) return { key: p, vowel: '', coda: p, feminine: false, bare: p };
  if (n >= 2 && groups.length < n) {
    // the spelling fused two syllables (i-de-a, po-em): sound each syllable chunk on its own
    const chunks = syllabify(String(raw || '').replace(/[^\p{L}]/gu, ''), n);
    if (chunks.length === n) {
      const fem = stress[n - 1] !== 1 && stress[n - 1] !== 0.5;
      let si = n - 1; while (si > 0 && stress[si] !== 1 && stress[si] !== 0.5) si--;   // the rhyme runs from the last stressed syllable: ma-TE-ri-al, not ma-te-RI-al
      const take = fem ? chunks.slice(Math.max(si, n - 3, 0)) : chunks.slice(-1);
      for (let j = 1; j < take.length; j++) {                  // a glide or a doubled vowel the split pushed forward belongs to the vowel before it: sho-wing is show-ing, si-ghing is sigh-ing, se-eing is see-ing
        const prev = take[j - 1], cur = take[j];
        if (!/[aeiouy]$/i.test(prev)) continue;
        const g = cur.match(/^([wy]|gh)(?=[aeiou])/i) || (cur[0] && cur[0].toLowerCase() === prev.slice(-1).toLowerCase() && /^[aeiou][^aeiouy]*[aeiouy]/i.test(cur) ? [cur[0]] : null);
        if (g) { take[j - 1] = prev + g[0]; take[j] = cur.slice(g[0].length); }
      }
      const parts = take.map((c, j) => phon(c, !fem || j === 0));
      if (/ow$/i.test(take[0]) && /W/.test(p) && /O$/.test(parts[0])) parts[0] = parts[0].replace(/O$/, 'W');   // the whole word knows allow from low
      const firstV = parts[0].search(/[aeiouAEIOUWQYV]/);
      if (firstV > 0) parts[0] = parts[0].slice(firstV);       // a rhyme starts at its vowel: kn-OWING, sh-OWING
      const key = parts.join('');
      const lastP = parts[parts.length - 1];
      const lm = lastP.match(/[aeiouAEIOUWQYV]+/g);
      const vowel = lm ? lm[lm.length - 1] : '';
      const coda = vowel ? lastP.slice(lastP.lastIndexOf(vowel) + vowel.length) : lastP;
      return { key, vowel, coda, feminine: fem, dactylic: fem && n >= 3 && stress[n - 2] !== 1 && stress[n - 2] !== 0.5, bare: coda };
    }
  }
  let feminine = false, start;
  const dact = n >= 3 && stress[n - 1] !== 1 && stress[n - 2] !== 1 && stress[n - 2] !== 0.5;
  if (n >= 2 && stress && stress[n - 1] !== 1 && stress[n - 1] !== 0.5 && groups.length >= 2) { feminine = true; start = groups[groups.length - (dact && groups.length >= 3 ? 3 : 2)].i; }
  else start = groups[groups.length - 1].i;
  const key = p.slice(start);
  const last = groups[groups.length - 1];
  const coda = p.slice(last.i + last.v.length);
  const dactylic = feminine && dact;
  return { key, vowel: last.v, coda, feminine, dactylic, bare: inflectionless(raw, coda) };
}
// Consonant classes for near rhyme: codas that end in sounds made the same way chime (time/mine, cat/bad, sing/thin).
const CODA_CLASS = c => { const x = c.replace(/ng$/, 'N').slice(-1); return /[mnN]/.test(x) ? 'nasal' : /[td]/.test(x) ? 'td' : /[pb]/.test(x) ? 'pb' : /[kg]/.test(x) ? 'kg' : /[sz]/.test(x) ? 'sz' : /[fv]/.test(x) ? 'fv' : x; };
const bareCoda = c => (c.length > 1 ? c.replace(/[sdz]$/, '') : c);   // an inflection (-s, -ed) does not make a rhyme
function rhymeKind(a, b) {
  // a, b: token records with .core and .rime
  if (!a || !b || !a.rime.key || !b.rime.key) return { kind: 'none', score: 0 };
  if (a.partial || b.partial) return { kind: 'none', score: 0 };   // the front of a word cut at a seam cannot rhyme
  const sa = a.core.toLowerCase().replace(/[’']/g, ''), sb = b.core.toLowerCase().replace(/[’']/g, '');
  if (sa === sb) return { kind: 'same', score: 0.3 };
  if (a.rime.key === b.rime.key) return { kind: 'full', score: 1 };
  if (a.rime.feminine || b.rime.feminine) {
    // a feminine rhyme (SUM-mer, WA-ter) is judged from its stressed vowel on: the stressed vowel and everything after it
    // must agree, the slack vowels heard as one neutral sound
    const split = r => { const m = r.key.match(/^[aeiouAEIOUWQYV]+/); return m ? { sv: m[0], rest: r.key.slice(m[0].length).replace(/[aeiou]/g, 'e').replace(/z/g, 's') } : { sv: '', rest: r.key }; };
    if (a.rime.feminine && b.rime.feminine) {
      const A = split(a.rime), B = split(b.rime);
      if (A.sv && A.sv === B.sv && A.rest === B.rest) return { kind: 'full', score: 0.95 };
      if ((A.sv && A.sv === B.sv && !a.rime.dactylic === !b.rime.dactylic) || (A.rest === B.rest && A.rest.length >= 2)) return { kind: 'slant', score: 0.5 };   // the same stressed vowel chimes only across rhymes of the same length
      return { kind: 'none', score: 0 };
    }
    // a word ending in two slack syllables can lift its last onto the beat and rhyme there: TEM-per-ATE with date
    const fem = a.rime.feminine ? a : b, mas = a.rime.feminine ? b : a;
    if (fem.rime.dactylic && fem.rime.vowel === mas.rime.vowel && fem.rime.coda.replace(/z/g, 's') === mas.rime.coda.replace(/z/g, 's')) return { kind: 'full', score: 0.8 };
    return { kind: 'none', score: 0 };
  }
  const va = a.rime.vowel, vb = b.rime.vowel;
  const ca = a.rime.coda.replace(/z/g, 's'), cb = b.rime.coda.replace(/z/g, 's');
  if (va && va === vb) {
    if (ca === cb) return { kind: 'full', score: 0.95 };
    if ((a.rime.bare || '').replace(/z/g, 's') === (b.rime.bare || '').replace(/z/g, 's')) return { kind: 'full', score: 0.85 };   // day/days, play/played
    if (ca && cb && CODA_CLASS(ca) === CODA_CLASS(cb)) return { kind: 'slant', score: 0.5 };            // time/mine: the same vowel, kindred endings
    return { kind: 'none', score: 0 };
  }
  if (ca && ca === cb && ca.length >= 2) return { kind: 'slant', score: 0.45 };                          // consonance on a cluster: band/bend
  const ba = bareCoda(ca), bb = bareCoda(cb);
  // consonance: the same ending after a different vowel. A cluster (band/bend, last/lost) chimes; a single consonant chimes
  // only as an eye rhyme, the same vowel letter sounded two ways (love/prove, come/home), as poets have always paired them.
  if (ba && ba === bb && !/^[sd]$/.test(ba) && (ba.length >= 2 || va.toLowerCase() === vb.toLowerCase())) return { kind: 'slant', score: 0.45 };
  // the eye rhymes poets have always used, spelled alike and said apart: come/home, gone/stone, mow/brow
  const ea = sa.slice(-2), eb = sb.slice(-2);
  if (sa.length >= 3 && sb.length >= 3 && ea === eb && /[aeiouy]/.test(ea) && !/^(es|ed|ly)$/.test(ea)) return { kind: 'slant', score: 0.4 };
  return { kind: 'none', score: 0 };
}

/* ------------------------------------------------------------------ tokens */
function tokenize(text, overrides) {
  overrides = overrides || {};
  const toks = [];
  let lead = '';   // marks before the first word of the poem ride with that word
  String(text || '').replace(/\r\n?/g, '\n').split('\n').forEach((line, li) => {
    // Words joined by a dash, a slash, or an ellipsis with no space (Hope\u2014is, and/or, waited\u2026and) are separate words.
    // "glue" remembers that no space stood between them, so the text always comes back exactly as it was typed.
    const raw = [];
    line.split(/\s+/).filter(Boolean).forEach(t => t.split(/(?<=[\u2014\u2013\/\u2026]|\.\.)(?=[\p{L}\p{N}])/u).forEach((piece, k) => raw.push({ t: piece, glue: k > 0 })));
    const hasWord = raw.some(x => core(x.t) || /^&/.test(x.t));
    let pending = '';
    raw.forEach(({ t, glue }, j) => {
      let c = core(t);
      if (!c && /^&[^\p{L}\p{N}]*$/u.test(t)) c = '&';
      const last = j === raw.length - 1;
      if (!c) {
        if (!toks.length) { lead = lead ? lead + ' ' + t : t; return; }
        if (j === 0 && li > 0 && hasWord) { pending = t; return; }   // a line that opens on a dash keeps its dash
        if (pending) { pending += ' ' + t; return; }
        const prev = toks[toks.length - 1];
        prev.text += (glue ? '' : ' ') + t;                            // a lone dash or mark rides with the word before it
        if (last) prev.origEnd = true;
        return;
      }
      const pre = [lead, pending].filter(Boolean).join(' ');
      toks.push({ text: pre ? pre + (glue ? '' : ' ') + t : t, core: c, origEnd: last, line: li, glue: glue && !pre });   // "\u2014and" stays "\u2014and"
      lead = ''; pending = '';
    });
    if (pending && toks.length) { toks[toks.length - 1].text += ' ' + pending; toks[toks.length - 1].origEnd = true; }
  });
  toks.forEach((tk, i) => {
    tk.i = i;
    const ov = overrides[i] || {};
    const numeral = /^[^\p{L}\p{N}$]*\$?\d/u.test(tk.text);
    tk.syl = ov.syl != null ? ov.syl : numeral ? Math.max(1, numeralSyllables(tk.text)) : (tk.core ? sylWord(tk.core) : 0);
    const auto = tk.core ? stressWord(tk.core, tk.syl) : [];
    tk.autoSyl = numeral ? Math.max(1, numeralSyllables(tk.text)) : tk.core ? sylWord(tk.core) : 0;
    tk.stress = ov.stress && ov.stress.length === tk.syl ? ov.stress.slice() : (auto.length === tk.syl ? auto : fitPattern(auto, tk.syl));
    tk.autoStress = auto.length === tk.syl ? auto : fitPattern(auto, tk.syl);
    tk.overridden = !!(ov.syl != null || ov.stress);
    tk.rime = rimeOf(tk.core, tk.stress);
    tk.lower = tk.core.toLowerCase().replace(/[’']/g, "'");
    tk.endPunct = /[.!?]["'”’)]*$/.test(tk.text) ? 'stop' : /[,;:]["'”’)]*$/.test(tk.text) ? 'pause' : /[—–\-]+["'”’)]*$/.test(tk.text) ? 'dash' : '';
  });
  return toks;
}
// The words as the poet typed them: a space between words, none where they were joined by a dash or slash.
function joinTokens(toks) { return (toks || []).map((t, i) => (i && !t.glue ? ' ' : '') + t.text).join(''); }
function fitPattern(auto, n) {
  if (!n) return [];
  if (!auto || !auto.length) return n === 1 ? [1] : Array.from({ length: n }, (_, i) => i === 0 ? 1 : 0);
  if (auto.length === 1 && auto[0] === 'F') return ['F'];
  const out = Array.from({ length: n }, () => 0);
  let idx = auto.indexOf(1); if (idx < 0) idx = 0;
  out[Math.min(idx, n - 1)] = 1;
  return out;
}

/* ------------------------------------------------------------------ line costs */
function lineStress(toks, a, b) {
  const s = [];
  for (let i = a; i < b; i++) for (const v of toks[i].stress) s.push(v);
  return s;
}
function meterCost(s) {
  // s: stress values in order; iambic expects weak, strong, weak, strong...
  let cost = 0;
  const n = s.length;
  for (let p = 0; p < n; p++) {
    const strong = p % 2 === 1, v = s[p];
    if (v === 'F') { cost += strong ? 0.12 : 0; continue; }
    if (strong) cost += v === 1 ? 0 : v === 0.5 ? 0.1 : 0.55;
    else cost += v === 1 ? 1 : v === 0.5 ? 0.35 : 0;
  }
  // a trochaic first foot is a licence, not a fault
  if (n >= 2 && s[0] === 1 && (s[1] === 0 || s[1] === 'F')) cost -= 1 + (s[1] === 0 ? 0.55 : 0.12) - 0.25;
  // a weak eleventh syllable (feminine ending) is free
  if (n === 11 && (s[10] === 0 || s[10] === 'F')) cost -= s[10] === 'F' ? 0 : 0.55;
  return Math.max(0, cost);
}
function sylCost(n, target, s) {
  const d = n - target;
  if (Math.abs(target - 10) < 0.01) {
    if (d === 0) return 0;
    if (d === 1) return (s[10] === 0 || s[10] === 'F') ? 0.5 : 2.2;
    if (d === -1) return 2.6;
    if (d === 2) return 4.5;
    if (d === -2) return 5.5;
    return 3 * d * d;
  }
  const ad = Math.abs(d);
  return ad <= 0.5 ? 0 : 2.2 * ad * ad;
}

/* ------------------------------------------------------------------ splitting a word at a syllable seam */
function syllabify(core, n) {
  // n chunks of core, split at approximate syllable boundaries (for display, and for a word that straddles the tenth syllable)
  const w = String(core || '');
  if (n <= 1 || w.length < 2) return [w];
  if (/^\d/.test(w)) return [w].concat(Array.from({ length: n - 1 }, () => ''));   // a numeral is never cut between its digits
  if (/-/.test(w.slice(1, -1))) {
    // a hyphenated compound splits at its hyphens first; each part keeps the count its own word would have
    const parts = w.split(/(?<=-)/);
    const counts = parts.map(p => Math.max(1, sylWord(p.replace(/-$/, ''))));
    let tot = counts.reduce((x, y) => x + y, 0), guard = 0;
    while (tot !== n && guard++ < 40) {
      if (tot > n) { const i = counts.indexOf(Math.max(...counts)); if (counts[i] <= 1) break; counts[i]--; tot--; }
      else { const i = counts.indexOf(Math.max(...counts)); counts[i]++; tot++; }
    }
    if (tot === n) return parts.flatMap((p, i) => { const bare = p.replace(/-$/, ''); const ch = syllabify(bare, counts[i]); if (p.endsWith('-')) ch[ch.length - 1] += '-'; return ch; });
  }
  const lower = w.toLowerCase().replace(/qu/g, 'qv').replace(/([aeiou])y([aeiou])/g, '$1j$2');
  const vg = []; const re = /[aeiouy]+/g; let m;
  while ((m = re.exec(lower))) vg.push([m.index, m.index + m[0].length]);
  const isDigraph = (a, b) => /^(th|ch|sh|ph|wh|gh|ck|qv|wr|kn)$/.test(a + b);
  const onset2 = c => /^([bcdfgkpt][lr]|s[ptkcmnlw]|th|ch|sh|ph|wh|qv)$/.test(c) && !/^(tl|dl)$/.test(c);
  let bounds = [];
  for (let i = 0; i + 1 < vg.length; i++) {
    const c0 = vg[i][1], c1 = vg[i + 1][0];
    const cluster = lower.slice(c0, c1);
    if (cluster.length === 0) bounds.push(c1);
    else if (cluster.length === 1) bounds.push(c0);
    else if (isDigraph(cluster[0], cluster[1])) bounds.push(cluster.length === 2 ? c0 : c0 + 2);
    else if (cluster.length === 2 && /^[bcdfgpt][lr]$/.test(cluster) && !/^(tl|dl)$/.test(cluster)) bounds.push(c0);   // a stop and a liquid open the next syllable: de-clines, re-prove
    else if (cluster.length >= 3) bounds.push(onset2(cluster.slice(-2)) ? c1 - 2 : c1 - 1);                        // dark-ness, chil-dren, mon-ster
    else bounds.push(c0 + 1);
  }
  // a silent final e (also in -es, -ed, and before a possessive 's) makes one vowel group too many
  const bare = lower.replace(/['\u2019]s$/, '');
  const silentE = /[^aeiouy]e[sd]?$/.test(bare) && !/[^aeiouy]le$/.test(bare) && !/(t|d)ed$/.test(bare) && !/(s|x|z|ch|sh|c|g)es$/.test(bare);
  if (bounds.length && silentE && /^[^aeiouy]+e[sd]?(['\u2019]s)?$/.test(lower.slice(bounds[bounds.length - 1]))) bounds.pop();   // sci-ence, not scien-ce
  while (bounds.length > n - 1) {
    // merge the pair of chunks that would be smallest
    let best = -1, bestLen = Infinity;
    for (let i = 0; i < bounds.length; i++) { const a = i ? bounds[i - 1] : 0, b = i + 1 < bounds.length ? bounds[i + 1] : w.length; if (b - a < bestLen) { bestLen = b - a; best = i; } }
    bounds.splice(best, 1);
  }
  // a vowel pair the count says is two syllables splits between its vowels: go-ing, be-ing, sci-ence, cre-ate, po-em
  for (let i = vg.length - 1; i >= 0 && bounds.length < n - 1; i--) {
    const [s0, s1] = vg[i], grp = lower.slice(s0, s1);
    if (grp.length < 2 || /^(ee|oo|ou|ai|ay|oa|ey|oy|au|aw|ew|ow|ui)$/.test(grp) && !/^(oi|ei)$/.test(grp)) continue;
    const at = /ing/.test(lower.slice(s0 + 1, s0 + 4)) && grp.length >= 2 ? s0 + 1 : s0 + 1;
    if (!bounds.includes(at) && at > 0 && at < w.length) { bounds.push(at); bounds.sort((x, y) => x - y); }
  }
  while (bounds.length < n - 1) {
    // split the longest chunk in half
    let best = 0, bestLen = -1, start = 0;
    const pts = [0, ...bounds, w.length];
    for (let i = 0; i + 1 < pts.length; i++) if (pts[i + 1] - pts[i] > bestLen) { bestLen = pts[i + 1] - pts[i]; best = i; start = pts[i]; }
    if (bestLen < 2) break;
    bounds.push(start + Math.ceil(bestLen / 2)); bounds.sort((a, b) => a - b);
  }
  const out = []; let prev = 0;
  for (const b of bounds) { out.push(w.slice(prev, b)); prev = b; }
  out.push(w.slice(prev));
  return out.filter(Boolean);
}

/* ------------------------------------------------------------------ line pieces and scoring (shared) */
function pieceEnd(piece) {
  // the sound and spelling at the end of a line piece (a whole word, or the front of a split word)
  const t = piece.tok;
  if (!piece.split) return { core: t.core, rime: t.rime, lower: t.lower, endPunct: t.endPunct, dangler: DANGLERS.has(t.lower), tok: t };
  const chunks = syllabify(t.core, t.syl);
  const front = chunks.slice(0, piece.to).join('');
  const st = t.stress.slice(piece.from, piece.to);
  return { core: front, rime: rimeOf(front, st), lower: front.toLowerCase(), endPunct: '', dangler: false, tok: t, partial: true };
}
function lineFromPieces(pieces) {
  const stress = []; pieces.forEach(p => { for (let k = p.from; k < p.to; k++) stress.push(p.tok.stress[k]); });
  const end = pieceEnd(pieces[pieces.length - 1]);
  const first = pieces[0];
  const text = pieces.map((p, i) => (i && !(p.tok.glue && p.from === 0) ? ' ' : '') + pieceText(p, i === 0)).join('');
  return { pieces, syl: stress.length, stress, end, start: first, text, meter: meterCost(stress), startLower: first.from === 0 ? first.tok.lower : '' };
}
function pieceText(p, atStart) {
  const t = p.tok;
  if (p.from === 0 && p.to === t.syl) return t.text;
  const chunks = syllabify(t.core, t.syl);
  const ci = t.text.indexOf(t.core);
  const pre = ci > 0 ? t.text.slice(0, ci) : '', post = ci >= 0 ? t.text.slice(ci + t.core.length) : '';
  const part = chunks.slice(p.from, p.to).join('');
  if (p.from === 0) return pre + part + '-';
  if (p.to === t.syl) return part + post;
  return part + '-';
}
function scoreFrame(lines, chase) {
  // how well fourteen lines fill the frame: rhymes at the scheme's pairs, meter, closure, the turn, and split words
  const pairs = [[0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 13]];
  let s = 0;
  for (const [x, y] of pairs) { if (!lines[x] || !lines[y]) continue; const rk = rhymeKind(lines[x].end, lines[y].end); s += 6 * chase * (rk.kind === 'same' ? 0.15 : rk.score); }
  lines.forEach((ln, i) => {
    s -= ln.meter * 0.6;
    if (ln.end.endPunct === 'stop') s += 1.2; else if (ln.end.endPunct === 'pause') s += 0.6;
    if (ln.end.dangler) s -= 1.5;
    if (ln.end.partial) s -= 2.2;
    if ((i === 8 || i === 12) && TURN_WORDS.has(ln.startLower)) s += i === 12 ? 2.5 : 2;
    if (i === 13 && ln.end.endPunct === 'stop') s += 2;
  });
  return s;
}
function letterLines(lines) {
  const scheme = 'ABABCDCDEFEFGG';
  const pairs = [[0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 13]];
  lines.forEach((ln, m) => { ln.m = m + 1; ln.letter = scheme[m] || ''; ln.turn = (m === 8 || m === 12) && TURN_WORDS.has(ln.startLower); ln.rhyme = null; });
  let hits = 0, full = 0;
  for (const [x, y] of pairs) {
    if (!lines[x] || !lines[y]) continue;
    const rk = rhymeKind(lines[x].end, lines[y].end);
    lines[x].rhyme = { with: lines[y].n, kind: rk.kind }; lines[y].rhyme = { with: lines[x].n, kind: rk.kind };
    if (rk.kind === 'full') { hits++; full++; } else if (rk.kind === 'slant' || rk.kind === 'same') hits++;
  }
  const tens = lines.filter(l => Math.abs(l.syl - 10) <= 1).length;
  const exact = lines.filter(l => l.syl === 10).length;
  const meterOk = lines.filter(l => l.meter <= 1.2).length;
  return { lines, rhymes: hits, fullRhymes: full, tens, exact, meterOk, syllables: lines.reduce((x, l) => x + l.syl, 0), splits: lines.filter(l => l.end.partial).length };
}

/* ------------------------------------------------------------------ the strict loom: a cut at every tenth syllable */
// The note for a poem with nothing the loom can count.
function emptyNote(text) { return String(text || '').trim() ? 'There are no words to count here: the loom reads letters and numbers.' : 'Paste a poem first.'; }
function weaveStrict(text, opts) {
  const toks = tokenize(text, opts.overrides);
  const N = toks.length;
  const totalSyl = toks.reduce((a, t) => a + t.syl, 0);
  const chase = opts.chase == null ? 1 : opts.chase;
  const result = { mode: 'strict', tokens: toks, words: N, syllables: totalSyl, sonnets: [], ok: true, note: '', stretch: opts.stretch || 'best', head: [], tail: [] };
  if (!N || !totalSyl) { result.ok = false; result.note = emptyNote(text); return result; }
  // the syllable stream
  const stream = [];
  toks.forEach(t => { for (let k = 0; k < t.syl; k++) stream.push({ tok: t, k }); });
  // A numeral, or a word too short to show each of its syllables, is never cut: the line that reaches it takes it whole.
  const uncuttable = t => /^\d/.test(t.core) || syllabify(t.core, t.syl).filter(Boolean).length < t.syl;
  // From syllable `start`, lay up to `count` lines of ten, cutting at every tenth syllable.
  const linesFrom = (start, count) => {
    const lines = [];
    let a = start;
    for (let i = 0; i < count && a < stream.length; i++) {
      let b = Math.min(stream.length, a + 10);
      if (b < stream.length && stream[b].k > 0 && uncuttable(stream[b].tok)) while (b < stream.length && stream[b].k > 0) b++;
      const pieces = [];
      for (let j = a; j < b; j++) {
        const sy = stream[j];
        const last = pieces[pieces.length - 1];
        if (last && last.tok === sy.tok) last.to = sy.k + 1; else pieces.push({ tok: sy.tok, from: sy.k, to: sy.k + 1 });
      }
      pieces.forEach(p => { p.split = p.to < p.tok.syl; p.cont = p.from > 0; });
      const ln = lineFromPieces(pieces);
      ln.a = a; ln.b = b;
      lines.push(ln);
      a = b;
    }
    return lines;
  };
  const full = Math.floor(stream.length / 140);
  let start = 0, note = '';
  if (opts.stretch === 'all' || stream.length <= 140) {
    start = 0;
    if (opts.stretch !== 'all' && stream.length < 140) note = `This poem carries ${stream.length} syllables; a sonnet wants 140. ${140 - stream.length} more of your own would fill the frame.`;
  } else if (opts.stretch === 'first') { start = 0; }
  else if (opts.stretch === 'last') { start = stream.length - 140; while (start > 0 && stream[start].k > 0) start--; }   // the frame opens on a whole word
  else {
    // best: every start that opens on a whole word, scored on the frame; a frame that also closes on a whole word scores higher
    let best = -Infinity, bestStart = 0;
    for (let s = 0; s + 140 <= stream.length; s++) {
      if (stream[s].k !== 0) continue;
      const ls = linesFrom(s, 14);
      let sc = scoreFrame(ls, chase);
      const end = ls.length ? ls[ls.length - 1].b : s;
      const before = s > 0 ? stream[s - 1].tok : null;
      if (!before || before.endPunct === 'stop') sc += 1.5;                 // opens on a sentence
      if (end === stream.length) sc += 0.5;
      if (end < stream.length && stream[end].k > 0) sc -= 2.5;             // closes inside a word
      if (sc > best) { best = sc; bestStart = s; }
    }
    start = bestStart;
  }
  const lines = linesFrom(start, opts.stretch === 'all' ? Infinity : 14);
  lines.forEach((ln, i) => { ln.n = i + 1; });
  // mark tokens
  toks.forEach(t => { t.cut = 0; t.cuts = []; t.sonnetLine = 0; t.outside = true; });
  lines.forEach(ln => {
    ln.pieces.forEach((p, j) => {
      const t = p.tok; t.outside = false; if (!t.sonnetLine) t.sonnetLine = ln.n;
      if (j === ln.pieces.length - 1) { if (p.split) t.cuts.push({ at: p.to, line: ln.n }); else t.cut = ln.n; }
    });
  });
  // frames
  for (let f = 0; f < Math.ceil(lines.length / 14); f++) {
    const ls = lines.slice(f * 14, f * 14 + 14);
    const sn = letterLines(ls);
    sn.n = f + 1; sn.complete = ls.length === 14 && ls[13].syl >= 10;
    result.sonnets.push(sn);
  }
  // Words before and after the frame, as pieces, so a word cut at the frame's edge keeps its other half in view.
  const firstP = lines[0].pieces[0], lastP = lines[lines.length - 1].pieces.slice(-1)[0];
  result.head = toks.filter(t => t.i < firstP.tok.i).map(t => ({ tok: t, from: 0, to: t.syl }));
  if (firstP.from > 0) result.head.push({ tok: firstP.tok, from: 0, to: firstP.from });
  result.tail = toks.filter(t => t.i > lastP.tok.i).map(t => ({ tok: t, from: 0, to: t.syl }));
  if (lastP.to < lastP.tok.syl) result.tail.unshift({ tok: lastP.tok, from: lastP.to, to: lastP.tok.syl });
  result.lines = lines;
  result.start = start;
  result.note = note;
  result.score = scoreFrame(lines.slice(0, 14), chase);
  result.splits = lines.filter(l => l.end.partial).length;
  result.fullFrames = full;
  return result;
}

/* ------------------------------------------------------------------ the whole-word loom (cuts only between words, lines as near ten as the words allow) */
// The best cuts for exactly L lines: a dynamic program over word ends. Each line pays for its distance from ten syllables
// and for its meter; rhyme partners follow the frame (ABAB CDCD EFEF GG); a stop or pause at a line end, a turn word at
// lines 9 and 13, and a cut where the poet already broke a line all earn a little. Words are never split.
function wholeLines(toks, L, opts) {
  const N = toks.length;
  if (L < 1 || L > N) return null;
  const target = 10;
  const chase = opts.chase == null ? 1 : opts.chase;
  const honor = opts.honor == null ? 1.5 : opts.honor;
  const R = 5.5 * chase;
  const pre = new Float64Array(N + 1);
  for (let i = 0; i < N; i++) pre[i + 1] = pre[i] + toks[i].syl;
  const avg = pre[N] / L;
  const W = L === 1 ? N : Math.max(14, Math.ceil(N / L) + 6);
  const slack = Math.max(13, 1.3 * avg);
  const memo = new Map();
  const lineCost = (a, b) => {
    const key = a * 65536 + b;
    let v = memo.get(key);
    if (v != null) return v;
    const s = lineStress(toks, a, b);
    const n = s.length, d = n - target;
    const last = toks[b - 1];
    // an eleventh syllable is a feminine ending only when it closes a longer word (a-RIS-ing), not a stray little word
    const feminine = d === 1 && (s[10] === 0 || s[10] === 'F') && last.syl >= 2;
    // a pentameter is five beats, not always ten syllables: a line that fits five iambic feet with one extra light
    // syllable (an anapest inside, or a feminine ending) pays little for its eleventh syllable
    const fit = Math.abs(d) === 1 ? bestFit(s, 'iambic') : null;
    const five = fit && fit.t.feet === 5 && (fit.t.kind === 'anapest' || fit.t.kind === 'feminine') && fit.c < 1.2;
    let c = (d === 0 ? 0 : feminine ? 1.2 : five ? 1.6 : Math.abs(d) === 1 ? 3 : Math.abs(d) === 2 ? 6 : 9 * d * d) + (five ? Math.min(meterCost(s), fit.c) : meterCost(s));
    if (last.endPunct === 'stop') c -= 1.6; else if (last.endPunct === 'pause') c -= 0.9; else if (last.endPunct === 'dash') c -= 0.7;
    if (/^(the|a|an)$/.test(last.lower)) c += 5; else if (DANGLERS.has(last.lower)) c += 2.8;   // never leave an article hanging
    // a word carried across a stop belongs to the next line ("delivery. Thou"), and a line that opens on a word ending
    // a sentence belongs to the line before ("land, Who said")
    if (b - a >= 2 && !last.endPunct && toks[b - 2].endPunct) c += toks[b - 2].endPunct === 'stop' ? 2.5 : 1.5;
    else if (b - a >= 2 && last.endPunct && last.endPunct !== 'stop' && toks[b - 2].endPunct === 'stop') c += 2.5 + (last.endPunct === 'pause' ? 0.9 : 0.7);   // "a face! What," belongs to the next line
    if (b - a >= 2 && toks[a].endPunct) c += toks[a].endPunct === 'stop' ? 2.5 : 1.5;
    // the poet's own break counts, and counts most where the poet also ended a sentence
    if (b < N && last.origEnd) c -= last.endPunct === 'stop' ? honor * 5 : honor;
    memo.set(key, c);
    return c;
  };
  const partnerFor = j => { const m = ((j - 1) % 14) + 1; if ([3, 4, 7, 8, 11, 12].includes(m)) return 2; if (m === 14) return 1; return 0; };
  const turnBonus = (j, a) => { const m = ((j - 1) % 14) + 1; if ((m === 9 || m === 13) && TURN_WORDS.has(toks[a].lower)) return m === 13 ? -2.6 : -2; return 0; };
  const closeBonus = (j, b) => { const m = ((j - 1) % 14) + 1; if (m === 14 && toks[b - 1].endPunct === 'stop') return -1.2; if (m === 14 && toks[b - 1].endPunct === '') return 0.6; return 0; };
  const cands = [];
  for (let i = 1; i <= L; i++) {
    const lo = Math.max(i, N - (L - i) * W), hi = Math.min(N - (L - i), i * W);
    const arr = [];
    for (let e = lo; e <= hi; e++) { if (i === L && e !== N) continue; if (Math.abs(pre[e] - i * avg) <= slack || i === L) arr.push(e); }
    if (!arr.length) { for (let e = lo; e <= hi; e++) arr.push(e); }
    cands.push(arr);
  }
  let prev = new Map(); prev.set(0, { c: 0, back: null, e: 0, p: 0 });
  for (let i = 1; i <= L; i++) {
    const cur = new Map();
    const needP = partnerFor(i + 1) === 2;
    const pf = partnerFor(i);
    for (const st of prev.values()) {
      const a = st.e;
      for (const e of cands[i - 1]) {
        if (e <= a || e - a > W) continue;
        let c = st.c + lineCost(a, e) + turnBonus(i, a) + closeBonus(i, e);
        if (pf && R > 0) {
          const partnerEnd = pf === 1 ? a : a - st.p;
          if (partnerEnd > 0) { const rk = rhymeKind(toks[partnerEnd - 1], toks[e - 1]); c -= R * rk.score; }
        }
        const p = needP ? e - a : 0;
        const key = e * (W + 1) + p;
        const old = cur.get(key);
        if (!old || c < old.c) cur.set(key, { c, back: st, e, p });
      }
    }
    if (!cur.size) return null;
    prev = cur;
  }
  let best = null;
  for (const st of prev.values()) if (st.e === N && (!best || st.c < best.c)) best = st;
  if (!best) return null;
  const ends = [];
  for (let st = best; st && st.back; st = st.back) ends.unshift(st.e);
  return { ends, cost: best.c, L };
}
// Lays the whole poem, every word in its order, into lines as near ten syllables as the words allow. Any length works:
// one line stays one line when it cannot make two, eight lines become the octave, a long poem runs frame after frame.
function weaveWhole(text, opts) {
  opts = opts || {};
  const toks = tokenize(text, opts.overrides);
  const N = toks.length;
  const totalSyl = toks.reduce((a, t) => a + t.syl, 0);
  const result = { mode: 'whole', tokens: toks, words: N, syllables: totalSyl, sonnets: [], ok: true, note: '', head: [], tail: [], stretch: 'all', target: 10 };
  if (!N || !totalSyl) { result.ok = false; result.note = emptyNote(text); return result; }
  const base = Math.max(1, Math.round(totalSyl / 10));
  // one line more and one fewer than ten-syllable lines would need, a count for loose pentameter of eleven-syllable lines,
  // and the poet's own count when the poem came with lines of near pentameter length
  const own = new Set(toks.map(t => t.line)).size;
  const ownFits = own >= 2 && totalSyl / own >= 8 && totalSyl / own <= 13;
  const tries = [...new Set((opts.lines ? [opts.lines] : [base - 1, base, base + 1, Math.round(totalSyl / 11), ownFits ? own : base]).map(x => Math.max(1, Math.min(N, Math.round(x)))))];
  let best = null;
  for (const L of tries) { const r = wholeLines(toks, L, opts); if (r && (!best || r.cost < best.cost)) best = r; }
  if (!best) { result.ok = false; result.note = 'The loom could not lay these words on the frame. Try cutting at exactly ten instead.'; return result; }
  toks.forEach(t => { t.cut = 0; t.cuts = []; t.sonnetLine = 0; t.outside = false; });
  const lines = [];
  let a = 0;
  best.ends.forEach((e, idx) => {
    const pieces = toks.slice(a, e).map(t => ({ tok: t, from: 0, to: t.syl, split: false, cont: false }));
    const ln = lineFromPieces(pieces);
    ln.n = idx + 1;
    pieces.forEach(p => { p.tok.sonnetLine = p.tok.sonnetLine || ln.n; });
    toks[e - 1].cut = idx + 1;
    lines.push(ln);
    a = e;
  });
  const k = Math.ceil(lines.length / 14);
  for (let si = 0; si < k; si++) {
    const ls = lines.slice(si * 14, si * 14 + 14);
    const sn = letterLines(ls);
    sn.n = si + 1; sn.complete = ls.length === 14;
    result.sonnets.push(sn);
  }
  result.k = k;
  result.L = lines.length;
  result.lines = lines;
  result.cost = best.cost;
  result.splits = 0;
  result.start = 0;
  return result;
}
function weave(text, opts) {
  opts = opts || {};
  return opts.whole ? weaveWhole(text, opts) : weaveStrict(text, opts);
}

/* ------------------------------------------------------------------ the margin: what an editor would mark, line by line */
/* What a frame of n lines already holds, in the sonnet's own terms. */
function framePart(n) {
  if (n <= 0) return 'nothing yet';
  if (n < 4) return n === 1 ? 'the first line of the first quatrain' : `the first ${n} lines of the first quatrain`;
  if (n === 4) return 'the first quatrain';
  if (n < 8) return 'the first quatrain and part of the second';
  if (n === 8) return 'the octave (two quatrains, ABAB CDCD)';
  if (n < 12) return 'the octave and the start of the third quatrain, past the turn';
  if (n === 12) return 'three quatrains, everything but the couplet';
  if (n === 13) return 'three quatrains and half the couplet';
  return 'the whole frame';
}
/* Where line m sits, and which earlier line it must answer in rhyme. */
const SCHEME = 'ABABCDCDEFEFGG';
function rhymePartnerOf(m) { return [3, 4, 7, 8, 11, 12].includes(m) ? m - 2 : m === 14 ? 13 : 0; }
function lineRole(m, shown) {
  const L = shown || m;
  if (m === 1) return `line ${L} opens the first quatrain and sets the A rhyme`;
  if (m === 5) return `line ${L} opens the second quatrain with a new rhyme, C`;
  if (m === 9) return `line ${L} is the turn: the place the argument changes direction, often on a but, yet, or so`;
  if (m === 13) return `lines ${L} and ${L + 1} are the couplet: the snap, a rhyming pair that sums up or overturns`;
  return `comes line ${L}, which carries rhyme ${SCHEME[m - 1]}`;
}
// What line m of this frame should do next; offset turns frame positions into the poem's own line numbers.
function nextNote(lines, offset) {
  const n = lines.length, m = n + 1, off = offset || 0;
  if (m > 14) return '';
  const p = rhymePartnerOf(m);
  const pe = p && lines[p - 1] ? lines[p - 1].end : null;
  const partner = pe ? ` It should chime with line ${p + off}, which ends on ${pe.partial ? `\u201C${pe.core}-\u201D (the start of \u201C${pe.tok.core}\u201D)` : `\u201C${pe.core}\u201D`}.` : '';
  const role = lineRole(m, m + off);
  return `${/^comes /.test(role) ? 'Next ' : 'Next, '}${role}.${partner}`;
}
function margin(result) {
  const notes = [];
  if (!result.ok || !result.lines) return notes;
  const pl = (n, w) => `${n} ${n === 1 ? w : w + 's'}`;
  const endWord = end => (end.partial ? `“${end.core}-” (the start of “${end.tok.core}”)` : `“${end.core}”`);
  const frames = result.sonnets.length ? result.sonnets.map(s => s.lines) : [result.lines.slice(0, 14)];
  const multi = frames.length > 1;
  frames.forEach((lines, fi) => {
    if (!lines.length) return;
    const tag = multi ? `Frame ${fi + 1}: ` : '';
    const at = lines[0].n;
    // the frame note: what this frame holds and what comes next (only the last frame can be unfinished)
    const shortLast = lines[lines.length - 1].syl < (result.mode === 'strict' ? 10 : 9) ? lines[lines.length - 1] : null;
    if (fi === frames.length - 1 && (lines.length < 14 || shortLast)) {
      const n = lines.length;
      if (n === 14) {
        const s = shortLast.syl;
        notes.push({ line: 0, at: at - 0.5, kind: 'frame', text: `${tag}All fourteen lines are here, but line ${shortLast.n} has ${pl(s, 'syllable')}; ${pl(10 - s, 'more syllable')} would bring it to ten and close the frame.` });
      } else {
        const left = 14 - n;
        const m = ((shortLast ? shortLast.n : 0) - at) + 1;   // the short line's place in this frame
        const parts = [
          `${tag}You have ${n === 1 ? 'one line' : n + ' lines'} of fourteen: ${framePart(n)}.`,
          shortLast ? `Line ${shortLast.n} has ${pl(shortLast.syl, 'syllable')}${result.mode === 'strict' ? ', because the words run out there' : ''}; finish it with ${pl(10 - shortLast.syl, 'more syllable')}${m === 1 ? ', and its last word sets the A rhyme' : rhymePartnerOf(m) && lines[rhymePartnerOf(m) - 1] ? `, ending on a word that chimes with line ${lines[rhymePartnerOf(m) - 1].n}` : ''}.` : nextNote(lines, at - 1),
          left > 0 ? `${left} more ${left === 1 ? 'line' : 'lines'} of about ten syllables would close the frame.` : '',
          multi ? '' : 'Everything below reads what is here and leaves the rest for you.'
        ];
        notes.push({ line: 0, at: at - 0.5, kind: 'frame', text: parts.filter(Boolean).join(' ') });
      }
    }
    const pairs = [[0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 13]];
    for (const [x, y] of pairs) {
      const A = lines[x], B = lines[y]; if (!A || !B) continue;
      const rk = rhymeKind(A.end, B.end);
      if (rk.kind === 'none') notes.push({ line: B.n, kind: 'rhyme', text: `Lines ${A.n} and ${B.n} should rhyme (${A.letter}); they end on ${endWord(A.end)} and ${endWord(B.end)}. One of those two line ends wants a word that chimes with the other.`, ex: 'Sonnet 73, lines 1 and 3: behold / cold.' });
      else if (rk.kind === 'slant') notes.push({ line: B.n, kind: 'slant', text: `Lines ${A.n} and ${B.n} slant-rhyme (${endWord(A.end)}, ${endWord(B.end)}). Slant rhyme is a choice in a modern sonnet; make sure it reads as one.` });
      else if (rk.kind === 'same') notes.push({ line: B.n, kind: 'rhyme', text: `Lines ${A.n} and ${B.n} end on the same word, ${endWord(A.end)}. Identical rhyme reads as a lapse unless the repetition is the point.` });
    }
    lines.forEach(ln => {
      if (ln.end.partial) notes.push({ line: ln.n, kind: 'split', text: `Line ${ln.n} breaks inside “${ln.end.tok.core}” (“${ln.end.core}-”). The tenth syllable fell mid-word; a syllable gained or spent earlier in the line moves the seam.` });
      if (ln.end.dangler) notes.push({ line: ln.n, kind: 'end', text: `Line ${ln.n} ends on “${ln.end.core}”, a little word. A line end wants weight: a noun, a verb, a word a reader can lean on.`, ex: 'Sonnet 73 ends its lines on behold, hang, cold, sang.' });
      // the same scansion the rhythm panel shows, with its allowances (an inverted first foot, an anapest, a feminine ending)
      const sc = ln.syl >= 8 ? scanMeter(ln.stress, 'iambic') : null;
      if (sc && sc.feet && sc.regularity < 0.75) {
        const bad = [];
        let p = 0;
        for (const piece of ln.pieces) for (let k = piece.from; k < piece.to; k++, p++) {
          const sub = (sc.subs || []).find(x => x.foot === (sc.spans.findIndex(sp => p >= sp.a && p < sp.b) + 1));
          if (sc.realized[p] === '/' && sc.positions[p] === 0 && !(sub && (sub.kind === 'inversion' || sub.kind === 'spondee')) && !bad.includes(piece.tok.core)) bad.push(piece.tok.core);
        }
        const on = Math.round(sc.regularity * ln.syl);
        // a five-foot line whose only departures are licensed (inversions, spondees, an anapest) is not marked
        if (bad.length || sc.feet !== 5) notes.push({ line: ln.n, kind: 'meter', text: `Line ${ln.n} keeps ${on} of ${ln.syl} syllables on the iambic pattern${bad.length ? `; ${bad.map(w => '\u201C' + w + '\u201D').join(', ')} ${bad.length === 1 ? 'pulls' : 'pull'} a stress onto a slack beat` : ''}. Read it aloud: da-DUM five times, or near it.`, ex: 'Sonnet 18, line 4: “And SUMmer’s LEASE hath ALL too SHORT a DATE.”' });
      }
    });
    if (lines[8] && !TURN_WORDS.has(lines[8].startLower)) notes.push({ line: lines[8].n, kind: 'turn', text: `Line ${lines[8].n} opens on “${lines[8].pieces[0].tok.core}”. The sonnet turns here; a but, yet, though, still, or so at the head of this line tells the reader the argument has changed direction.`, ex: 'Sonnet 18, line 9: “But thy eternal summer shall not fade.”' });
    if (lines[12] && !TURN_WORDS.has(lines[12].startLower) && !(lines[11] && lines[11].end.endPunct === 'stop')) notes.push({ line: lines[12].n, kind: 'turn', text: `The couplet (lines ${lines[12].n} and ${lines[12].n + 1}) runs on from line ${lines[11].n} without a stop. A full stop at the end of line ${lines[11].n}, or a turn word opening line ${lines[12].n}, lets the couplet snap shut.`, ex: 'Sonnet 73 stops at line 12 (“nourish’d by.”) and opens the couplet “This thou perceiv’st”.' });
    if (lines[13] && lines[13].syl >= 10 && lines[13].end.endPunct !== 'stop') notes.push({ line: lines[13].n, kind: 'close', text: `Line ${lines[13].n} ends on ${endWord(lines[13].end)} without a full stop. A sonnet closes; the last word should sound like the last word.`, ex: 'Sonnet 18 closes: “and this gives life to thee.”' });
  });
  notes.sort((a, b) => (a.at != null ? a.at : a.line) - (b.at != null ? b.at : b.line));
  if (!notes.length) notes.push({ line: 0, kind: 'frame', text: `Nothing to mark: ten syllables a line, the rhymes in their places, a turn at nine, a close at fourteen${multi ? ', in every frame' : ''}. Read it aloud once more and send it.` });
  return notes;
}

/* ------------------------------------------------------------------ sophistication, graded by rule */
const ABSTRACT_RE = /(ness|tion|sion|ity|ism|ment|ance|ence|hood|ship|ology|ality|ivity)e?s?$/;
const FIRST_PERSON = new Set(['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours']);
const SECOND_PERSON = new Set(['you', 'your', 'yours', 'yourself', 'thou', 'thee', 'thy', 'thine', 'ye', 'o']);
function contentStems(lines) {
  const out = [];
  lines.forEach(ln => ln.pieces.forEach(p => { if (p.from !== 0) return; const w = p.tok.lower.replace(/[^a-z']/g, ''); if (w.length >= 3 && !FUNCTION_WORDS.has(w) && !DANGLERS.has(w)) out.push(w); }));
  return out;
}
const stemOf = w => w.replace(/(ing|ed|es|s|ly|er|est)$/, '').slice(0, 5);
const jaccard = (A, B) => { const a = new Set(A.map(stemOf)), b = new Set(B.map(stemOf)); if (!a.size || !b.size) return 0; let i = 0; a.forEach(x => { if (b.has(x)) i++; }); return i / (a.size + b.size - i); };
const endsStop = ln => ln && ln.end.endPunct === 'stop';
const endsPause = ln => ln && (ln.end.endPunct === 'pause' || ln.end.endPunct === 'dash');
function grade(result) {
  if (!result.ok || !result.lines || !result.lines.length) return null;
  const lines = result.lines.slice(0, 14);
  const n = lines.length;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const F = [], C = [];
  // A row the frame cannot judge yet (the turn before line 9 exists) is marked "not yet" and left out of the score,
  // so one line or eight lines are graded on what they hold, not on what is still to be written.
  const notYet = (rows, name, max, note) => rows.push({ name, got: 0, max, note, na: true });
  // ---- formal
  const exact = lines.filter(l => l.syl === 10).length;
  const isFem = l => l.syl === 11 && (l.stress[10] === 0 || l.stress[10] === 'F');
  const fem = lines.filter(isFem).length;
  // each line earns its share by how near ten it sits: nine or eleven earn most of it, a two-word fragment none
  const near = lines.reduce((a, l) => a + Math.max(0, 1 - Math.abs((isFem(l) ? 10 : l.syl) - 10) / 5), 0);
  F.push({ fix: 'Add or spend a syllable until the line sits at ten; a feminine eleventh is allowed.', ex: 'Sonnet 18: “Shall I compare thee to a summer’s day?” (ten).', name: 'Measure', got: Math.round(20 * near / n), max: 20, note: `${exact} of ${n} ${n === 1 ? 'line' : 'lines'} at ten syllables${fem ? `, ${fem} at eleven with a feminine ending` : ''}${n < 14 ? `; graded on the ${n === 1 ? 'line' : n + ' lines'} written` : ''}` });
  const keptRatio = lines.reduce((a, l) => a + scan(l).filter(Boolean).length / Math.max(1, l.syl), 0) / n;
  const lenFactor = Math.min(1, lines.reduce((a, l) => a + l.syl, 0) / (10 * n));
  F.push({ fix: 'Read the line aloud, da-DUM five times; where a stress lands on a slack beat, swap the word or its order.', ex: 'Sonnet 18: “And SUMmer’s LEASE hath ALL too SHORT a DATE.”', name: 'Meter', got: Math.round(25 * clamp((keptRatio - 0.5) / 0.5, 0, 1) * lenFactor), max: 25, note: `${Math.round(keptRatio * 100)}% of syllables keep strict da-DUM alternation (this row allows no inversions or extra syllables; the rhythm panel below does)${lenFactor < 1 ? `; scaled by length, since the ${n === 1 ? 'line has' : 'lines have'} ${lines.reduce((a, l) => a + l.syl, 0)} of ${10 * n} syllables` : ''}` });
  const pairs = [[0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 13]].filter(([x, y]) => lines[x] && lines[y]);
  if (pairs.length) {
    let rh = 0, full = 0, slant = 0;
    for (const [x, y] of pairs) { const rk = rhymeKind(lines[x].end, lines[y].end); if (rk.kind === 'full') { rh += 1; full++; } else if (rk.kind === 'slant') { rh += 0.5; slant++; } else if (rk.kind === 'same') rh += 0.3; }
    F.push({ fix: 'Change one line end of the pair so the two chime; a slant rhyme counts half.', ex: 'Sonnet 73: behold / cold, hang / sang; and the slant Shakespeare allowed in 18, temperate / date.', name: 'Rhyme', got: Math.round(25 * rh / pairs.length), max: 25, note: `${full} true and ${slant} slant of the ${pairs.length === 7 ? '7 pairs the scheme asks for' : pairs.length === 1 ? 'one pair written so far' : pairs.length + ' pairs written so far'}` });
  } else notYet(F, 'Rhyme', 25, 'not yet: the first rhyme pair is lines 1 and 3');
  const danglers = lines.filter(l => l.end.dangler).length, splits = lines.filter(l => l.end.partial).length;
  F.push({ fix: 'End each line on a noun or a verb, a word a reader can lean on.', ex: 'Sonnet 73 ends its first quatrain on behold, hang, cold, sang.', name: 'Line ends', got: clamp(12 - 2 * danglers - 3 * splits, 0, 12), max: 12, note: `${danglers} ${danglers === 1 ? 'line ends' : 'lines end'} on a little word; ${splits} ${splits === 1 ? 'word is' : 'words are'} cut at a seam` });
  let arch = 0, archMax = 0; const archNotes = [];
  if (n >= 4) { archMax += 1.5; if (endsStop(lines[3]) || endsPause(lines[3])) { arch += 1.5; archNotes.push('the first quatrain closes on a stop or pause'); } else archNotes.push('the first quatrain runs on'); }
  if (n >= 8) { archMax += 1.5; if (endsStop(lines[7]) || endsPause(lines[7])) { arch += 1.5; archNotes.push('the octave closes on a stop or pause'); } else archNotes.push('the octave runs on'); }
  if (n >= 9) { archMax += 5; if (lines[8].turn) { arch += 5; archNotes.push('a turn word opens line 9'); } else if (endsStop(lines[7])) { arch += 2; archNotes.push('line 8 closes a sentence'); } else archNotes.push('no turn at 9'); }
  if (n >= 13) { archMax += 5; if (lines[12].turn || endsStop(lines[11])) { arch += 5; archNotes.push('the couplet is set off'); } else archNotes.push('the couplet runs on'); }
  if (n >= 14) { archMax += 5; if (lines[13].syl >= 10 && endsStop(lines[13])) { arch += 5; archNotes.push('line 14 closes on a stop'); } else archNotes.push('line 14 does not close'); }
  if (archMax) F.push({ fix: 'Close a sentence where a quatrain closes, open line 9 on a turn word, and set the couplet off with a stop at line 12.', ex: 'Sonnet 73 closes sentences at lines 4, 8, and 12, and the couplet opens “This thou perceiv’st”.', name: 'Architecture', got: Math.round(18 * arch / archMax), max: 18, note: archNotes.join('; ') + (n < 14 ? '; the rest is not written yet' : '') });
  else notYet(F, 'Architecture', 18, 'not yet: the first quatrain ends at line 4');
  // ---- conceptual
  const Q = [lines.slice(0, 4), lines.slice(4, 8), lines.slice(8, 12), lines.slice(12, 14)].map(contentStems);
  if (n >= 9) {
    let turn = 0, turnNote;
    if (lines[8].turn) { turn = 20; turnNote = `line 9 opens on “${lines[8].pieces[0].tok.core}”: the argument announces its turn`; }
    else if (endsStop(lines[7])) { turn = 12; turnNote = 'line 9 begins a new sentence: a turn by syntax, not by signal'; }
    else if (lines.slice(8, 12).some(l => l.pieces.some(p => p.from === 0 && TURN_WORDS.has(p.tok.lower)))) { turn = 5; turnNote = 'a turn word appears somewhere in the third quatrain, not at its head'; }
    else turnNote = 'no turn: the sestet continues the octave without a pivot';
    C.push({ fix: 'Open line 9 on but, yet, though, still, or so, and let the thought change direction there.', ex: 'Sonnet 18, line 9: “But thy eternal summer shall not fade.”', name: 'The turn', got: turn, max: 20, note: turnNote });
  } else notYet(C, 'The turn', 20, `not yet: the turn comes at line 9, and the frame has ${n === 1 ? 'one line' : n + ' lines'}`);
  if (n >= 14 && Q[3].length >= 2) {
    const coup = Q[3], before = new Set([...Q[0], ...Q[1], ...Q[2]].map(stemOf)), q1 = new Set(Q[0].map(stemOf));
    let cp = 0; const cpNotes = [];
    const returns = coup.filter(w => q1.has(stemOf(w)));
    const fresh = coup.filter(w => !before.has(stemOf(w)));
    if (returns.length) { cp += 10; cpNotes.push(`returns to the opening (${returns.slice(0, 2).map(w => '“' + w + '”').join(', ')})`); } else cpNotes.push('no word of the first quatrain comes back');
    if (fresh.length >= 2) { cp += 10; cpNotes.push(`adds new matter (${fresh.slice(0, 2).map(w => '“' + w + '”').join(', ')})`); } else cpNotes.push('adds little the quatrains had not said');
    C.push({ fix: 'Bring one word back from the first quatrain and add one thing the quatrains never said.', ex: 'Sonnet 18: “So long as men can breathe or eyes can see, / So long lives this, and this gives life to thee”: “this” returns, “life” is new.', name: 'The couplet', got: cp, max: 20, note: cpNotes.join('; ') });
  } else notYet(C, 'The couplet', 20, n === 13 ? 'not yet: the couplet needs line 14' : 'not yet: the couplet is lines 13 and 14');
  const devPairs = [[0, 1, '1 to 2'], [1, 2, '2 to 3']].filter(([a, b]) => Q[a].length && Q[b].length);
  if (devPairs.length) {
    let dev = 0; const devNotes = [];
    for (const [a, b, label] of devPairs) {
      const j = jaccard(Q[a], Q[b]);
      const sb = new Set(Q[b].map(stemOf));
      const shared = [...new Set(Q[a].filter(w => sb.has(stemOf(w))))];
      if (!shared.length) { dev += 6; devNotes.push(`quatrains ${label} share no words; the thread, if there is one, runs under the diction`); }
      else if (j <= 0.4) { dev += 10; devNotes.push(`quatrains ${label} share ${shared.slice(0, 2).map(w => '\u201C' + w + '\u201D').join(' and ')} and move on`); }
      else { dev += 4; devNotes.push(`quatrains ${label} circle the same words (${Math.round(j * 100)}% shared)`); }
    }
    C.push({ fix: 'Let each quatrain move the thought on: a new image that shares a word or two with the last and leaves the rest behind.', ex: 'Sonnet 73: a year (leaves, boughs), then a day (twilight, sunset), then a fire (ashes, death-bed).', name: 'Development', got: Math.round(20 * dev / (10 * devPairs.length)), max: 20, note: devNotes.join('; ') });
  } else notYet(C, 'Development', 20, 'not yet: development is measured from one quatrain to the next, starting at line 5');
  if (n >= 4) {
    const text = lines.map(l => l.text).join(' ');
    const sentences = (text.match(/[.!?]+(?=\s|$)/g) || []).length || 1;
    let sa = sentences >= 2 && sentences <= 6 ? 9 : sentences === 1 ? 4 : 5;
    const saNotes = [`${sentences} ${sentences === 1 ? 'sentence' : 'sentences'} across the frame`];
    const qEnds = [3, 7, 11].filter(i => i < n);
    const closes = qEnds.filter(i => endsStop(lines[i])).length, pauses = qEnds.filter(i => endsPause(lines[i])).length;
    if (closes) { sa += 6; saNotes.push(closes === 1 ? 'a sentence ends with a quatrain' : `sentences end with ${closes} quatrains`); } else if (pauses) { sa += 3; saNotes.push('a quatrain ends on a pause'); } else saNotes.push('no sentence ends where a quatrain ends');
    C.push({ fix: 'Two to six sentences across the frame, and let at least one end where a quatrain ends.', ex: 'Sonnet 73 is four sentences: one per quatrain and one for the couplet.', name: 'Sentence architecture', got: sa, max: 15, note: saNotes.join('; ') });
  } else notYet(C, 'Sentence architecture', 15, 'not yet: read once there is a quatrain');
  // Toward the Why: when you look up from a book you should see the world and yourself differently.
  // Proxies: the poem's orientation shifts between octave and sestet (world to self, or self to world), and the couplet lifts its eyes.
  if (n >= 9) {
    const wordsOf = ls => ls.flatMap(l => l.pieces.filter(p => p.from === 0).map(p => p.tok.lower.replace(/[^a-z']/g, '')));
    const octave = wordsOf(lines.slice(0, 8)), sestet = wordsOf(lines.slice(8, 14)), coupletWords = wordsOf(lines.slice(12, 14));
    const selfShare = ws => ws.length ? ws.filter(w => FIRST_PERSON.has(w) || SECOND_PERSON.has(w)).length / ws.length : 0;
    const so = selfShare(octave), ss = selfShare(sestet);
    let why = 0; const whyNotes = [];
    if ((so === 0 && ss > 0) || (ss === 0 && so > 0) || Math.abs(ss - so) >= 0.04) { why += 8; whyNotes.push(ss > so ? 'the octave looks at the world, the sestet turns to the self' : 'the octave speaks from the self, the sestet turns to the world'); }
    else whyNotes.push('octave and sestet face the same way');
    const WORLD = new Set(['world', 'life', 'lives', 'time', 'death', 'love', 'all', 'every', 'everything', 'nothing', 'always', 'never', 'anyone', 'everyone', 'we', 'us', 'our', 'ourselves', 'men', 'women', 'earth', 'god', 'truth', 'years', 'age', 'ages', 'forever']);
    if (coupletWords.length && coupletWords.some(w => WORLD.has(w))) { why += 7; whyNotes.push(`the couplet lifts its eyes (${[...new Set(coupletWords.filter(w => WORLD.has(w)))].slice(0, 2).map(w => '\u201C' + w + '\u201D').join(', ')})`); }
    else if (coupletWords.length) whyNotes.push('the couplet stays inside the poem’s own scene');
    // the couplet's 7 points wait for the couplet: before line 13 the row is out of 8
    C.push({ fix: 'Let the sestet face the other way from the octave (the world, then the self, or the self, then the world), and let the couplet say what the poem means past its own scene. Begin that claim as the essay does: “Perhaps…”', ex: 'Sonnet 73: three quatrains of “in me”, then the couplet turns to “thou” and to love: “To love that well which thou must leave ere long.”', name: 'Toward the Why', got: why, max: n >= 13 ? 15 : 8, note: whyNotes.join('; ') + (n < 13 ? '; the couplet part waits for lines 13 and 14' : '') });
  } else notYet(C, 'Toward the Why', 15, 'not yet: the poem looks up in its sestet, lines 9 to 14');
  const content = contentStems(lines), abstract = content.filter(w => ABSTRACT_RE.test(w)).length;
  const ratio = content.length ? abstract / content.length : 0;
  C.push({ fix: 'Trade an abstraction for a thing a reader can see.', ex: 'Sonnet 18 says “the darling buds of May”, not “beauty”.', name: 'Concreteness', got: Math.round(10 * (1 - clamp(ratio / 0.25, 0, 1))), max: 10, note: `${abstract} of ${content.length} content ${content.length === 1 ? 'word' : 'words'} ${abstract === 1 ? 'is an abstraction' : 'are abstractions'} (${Math.round(ratio * 100)}%)` });
  const live = rows => rows.filter(r => !r.na);
  const scoreOf = rows => { const max = live(rows).reduce((a, r) => a + r.max, 0); return max ? Math.round(100 * live(rows).reduce((a, r) => a + r.got, 0) / max) : null; };
  // a partial frame is judged as work in progress: "publishable" waits for all fourteen lines
  const partial = n < 14 || lines[13].syl < 10;
  const band = x => x == null ? 'not yet' : partial ? (n < 14 ? (x >= 85 ? `on pace, ${n} of 14 lines` : x >= 50 ? `working, ${n} of 14 lines` : `early, ${n} of 14 lines`) : 'nearly there: line 14 is short') : x >= 85 ? 'publishable by the numbers' : x >= 70 ? 'nearly there' : x >= 50 ? 'working' : 'early';
  // The argument needs room to show: with fewer than a quatrain's worth of rows the conceptual grade waits.
  const cMax = live(C).reduce((a, r) => a + r.max, 0);
  const formal = scoreOf(F), conceptual = cMax >= 30 ? scoreOf(C) : null;
  return { lines: n, formal: { score: formal, rows: F, band: band(formal) }, conceptual: { score: conceptual, rows: C, band: band(conceptual) } };
}

/* ------------------------------------------------------------------ meter: the pattern a line walks in, foot by foot */
const METERS = {
  iambic:    { foot: [0, 1],    unit: 'iamb',    rising: true },
  trochaic:  { foot: [1, 0],    unit: 'trochee', rising: false },
  anapestic: { foot: [0, 0, 1], unit: 'anapest', rising: true },
  dactylic:  { foot: [1, 0, 0], unit: 'dactyl',  rising: false }
};
const LENGTH_NAMES = ['', 'monometer', 'dimeter', 'trimeter', 'tetrameter', 'pentameter', 'hexameter', 'heptameter', 'octameter'];
const FOOT_NAMES = { '˘/': 'iamb', '/˘': 'trochee', '//': 'spondee', '˘˘': 'pyrrhic', '˘˘/': 'anapest', '/˘˘': 'dactyl', '˘/˘': 'amphibrach', '//˘': 'spondee and a weak syllable', '˘//': 'bacchius', '/': 'a lone stress', '˘': 'a lone weak syllable', '˘˘˘': 'tribrach', '///': 'molossus', '/˘/': 'cretic' };
// The same feet as a reader would say them: with an article and the sound, never a bare Greek name.
const FOOT_SAID = { '˘/': 'an iamb (da-DUM)', '/˘': 'a trochee (DUM-da)', '//': 'a spondee (DUM-DUM)', '˘˘': 'a light foot (da-da)', '˘˘/': 'an anapest (da-da-DUM)', '/˘˘': 'a dactyl (DUM-da-da)', '˘/˘': 'da-DUM-da', '//˘': 'DUM-DUM-da', '˘//': 'da-DUM-DUM', '/': 'a lone beat (DUM)', '˘': 'a lone slack syllable (da)', '˘˘˘': 'three slack syllables (da-da-da)', '///': 'three beats (DUM-DUM-DUM)', '/˘/': 'DUM-da-DUM' };
function slotCost(v, strong) {
  if (v === 'F') return strong ? 0.12 : 0;
  if (strong) return v === 1 ? 0 : v === 0.5 ? 0.1 : 0.55;
  return v === 1 ? 1 : v === 0.5 ? 0.35 : 0;
}
// Every way a line of n syllables can be laid on a meter: whole feet, a missing first weak syllable (headless),
// a missing last weak syllable (catalectic), or one or two extra weak syllables at the end (a feminine ending).
const TEMPLATE_CACHE = new Map();
function templates(meter, n) {
  const ck = meter + n;
  if (TEMPLATE_CACHE.has(ck)) return TEMPLATE_CACHE.get(ck);
  const out = makeTemplates(meter, n);
  TEMPLATE_CACHE.set(ck, out);
  return out;
}
function makeTemplates(meter, n) {
  const M = METERS[meter], k = M.foot.length, out = [];
  for (let feet = 1; feet <= 8; feet++) {
    const base = [];
    for (let f = 0; f < feet; f++) M.foot.forEach(v => base.push({ s: v, f }));
    const add = (pos, kind, penalty) => { if (pos.length === n) out.push({ meter, feet, pos, kind, penalty }); };
    add(base, '', 0);
    for (let d = 1; d < k; d++) {
      if (base.slice(0, d).every(x => !x.s)) add(base.slice(d), 'headless', meter === 'iambic' ? 0.35 : 0.1);
      if (base.slice(base.length - d).every(x => !x.s)) add(base.slice(0, base.length - d), 'catalectic', M.rising ? 0.6 : 0);
    }
    for (let x = 1; x <= 2; x++) { if (x === 2 && k === 2) continue; add(base.concat(Array.from({ length: x }, () => ({ s: 0, f: feet - 1, extra: true }))), 'feminine', x === 1 ? 0.15 : 0.45); }
    // an iambic line often takes one extra light syllable inside a foot: an anapest (da-da-DUM) in place of an iamb
    if (meter === 'iambic') for (let f = 0; f < feet; f++) {
      const pos = [];
      base.forEach(x => { if (x.f === f && x.s) pos.push({ s: 0, f, extra: true, inner: true }); pos.push(x); });
      add(pos, 'anapest', 0.5);
      // the same, closed by a feminine ending
      add(pos.concat([{ s: 0, f: feet - 1, extra: true }]), 'anapest', 0.65);
      // two extra light syllables in two different feet (Frost's loose four-beat lines)
      for (let g = f + 1; g < feet; g++) {
        const pos2 = [];
        base.forEach(x => { if ((x.f === f || x.f === g) && x.s) pos2.push({ s: 0, f: x.f, extra: true, inner: true }); pos2.push(x); });
        add(pos2, 'anapest', 1.0);
      }
    }
  }
  return out;
}
function fitCost(stress, t) {
  let c = t.penalty;
  stress.forEach((v, i) => {
    const strong = !!t.pos[i].s;
    // a weak syllable with no stress on either side can be lifted onto the beat: a smaller fault than a buried stress
    if (strong && v === 0 && stress[i - 1] !== 1 && stress[i + 1] !== 1) c += 0.3;
    else c += slotCost(v, strong);
  });
  // a "feminine" ending on a fully stressed syllable is no feminine ending
  if (t.kind === 'feminine' || t.kind === 'anapest') stress.forEach((v, i) => { if (t.pos[i].extra && !t.pos[i].inner && v === 1) c += 2; });
  // an inverted first foot is a licence in rising meters, not a fault
  if (t.meter === 'iambic' && t.kind !== 'headless' && stress.length >= 2 && stress[0] === 1 && (stress[1] === 0 || stress[1] === 'F')) c -= 1 + (stress[1] === 0 ? 0.55 : 0.12) - 0.25;
  return Math.max(0, c);
}
function bestFit(stress, meter) {
  let best = null;
  for (const t of templates(meter, stress.length)) { const c = fitCost(stress, t); if (!best || c < best.c - 1e-9) best = { t, c }; }
  return best;
}
// Reads one line against one meter: where the beats fall, what each foot really does, and what departs from the pattern.
function scanMeter(stress, meter) {
  const n = stress.length;
  if (!n) return null;
  const fit = bestFit(stress, meter);
  if (!fit) return { meter, feet: 0, label: n === 1 ? 'a single syllable' : `${n} syllables, too many to scan as one line`, realized: stress.map(v => (v === 1 ? '/' : '˘')), positions: [], spans: [], kinds: [], subs: [], regularity: 0, cost: Infinity, dadum: '' };
  const { t, c } = fit;
  // A beat falls on a strong slot when the syllable can carry it: a stressed syllable, a little word, or a weak syllable
  // with no stress on either side (the "-ate" of TEM-per-ATE, the "-try" of SYM-me-TRY), which a reader lifts to keep time.
  const realized = stress.map((v, i) => {
    const strong = !!t.pos[i].s;
    if (strong) {
      // a little word right after a stressed syllable in the same foot stays slack: LIKE to the LARK is an inversion, not a spondee
      if (v === 'F' && i > 0 && i < n - 1 && stress[i - 1] === 1 && !t.pos[i - 1].s && t.pos[i - 1].f === t.pos[i].f) return '˘';
      if (v === 'F' || v >= 0.5) return '/';
      return stress[i - 1] !== 1 && stress[i + 1] !== 1 ? '/' : '˘';
    }
    return v === 1 ? '/' : '˘';
  });
  const spans = [];
  t.pos.forEach((p, i) => { const last = spans[spans.length - 1]; if (last && last.f === p.f) last.b = i + 1; else spans.push({ f: p.f, a: i, b: i + 1 }); });
  const unit = METERS[meter].unit;
  const kinds = spans.map(sp => { const m = realized.slice(sp.a, sp.b).join(''); return FOOT_NAMES[m] || m; });
  const subs = [];
  const ideal = METERS[meter].foot.map(v => (v ? '/' : '˘')).join('');
  spans.forEach((sp, j) => {
    const want = t.pos.slice(sp.a, sp.b).map(p => (p.s ? '/' : '˘')).join('');
    const got = realized.slice(sp.a, sp.b).join('');
    if (got === want) return;
    const name = FOOT_NAMES[got] || got;
    const where = `foot ${j + 1}`;
    if (sp.b - sp.a === 3 && t.kind === 'anapest' && t.pos[sp.a].inner && got === '˘˘/') return;
    if (meter === 'iambic' && got === '/˘' && want === '˘/') subs.push({ foot: j + 1, kind: 'inversion', text: `${where} turns over: a trochee (DUM-da) where an iamb would go` });
    else if (meter === 'trochaic' && got === '˘/' && want === '/˘') subs.push({ foot: j + 1, kind: 'inversion', text: `${where} turns over: an iamb (da-DUM) where a trochee would go` });
    else if (got.length === want.length && /^\/+$/.test(got)) subs.push({ foot: j + 1, kind: 'spondee', text: `${where} is a spondee: two strong beats, DUM-DUM` });
    else if (got.length === want.length && /^˘+$/.test(got)) subs.push({ foot: j + 1, kind: 'pyrrhic', text: `${where} is light: ${got.length === 2 ? 'a pyrrhic' : 'a tribrach'}, no strong beat` });
    else if (want.endsWith('˘') && sp.b === n && t.kind === 'feminine' && got.slice(0, -1) === ideal) return;
    else subs.push({ foot: j + 1, kind: 'other', text: `${where} reads as ${FOOT_SAID[got] || name}` });
  });
  if (t.kind === 'anapest') {
    [...new Set(t.pos.filter(p => p.inner).map(p => p.f))].forEach(f => {
      if (!subs.some(x => x.foot === f + 1)) subs.push({ foot: f + 1, kind: 'anapest', text: `foot ${f + 1} takes an extra light syllable: an anapest (da-da-DUM) in place of an iamb` });
    });
  }
  const femSlots = t.pos.some(p => p.extra && !p.inner);
  if ((t.kind === 'feminine' || (t.kind === 'anapest' && femSlots)) && t.pos.every((p, i) => !p.extra || p.inner || realized[i] === '˘')) subs.push({ foot: t.feet, kind: 'feminine', text: `a feminine ending: ${t.pos.filter(p => p.extra && !p.inner).length === 1 ? 'one extra slack syllable' : 'two extra slack syllables'} after the last beat` });
  if (t.kind === 'headless') subs.push({ foot: 1, kind: 'headless', text: t.pos[0].s ? 'headless: the line drops its first slack syllable and starts on the beat' : 'the first foot drops one slack syllable, so the line opens da-DUM' });
  if (t.kind === 'catalectic') subs.push({ foot: t.feet, kind: 'catalectic', text: 'catalectic: the last foot drops its weak syllable and the line ends on the beat' });
  const kept = realized.filter((m, i) => (m === '/') === !!t.pos[i].s).length;
  const lengthName = LENGTH_NAMES[t.feet] || `${t.feet}-foot`;
  const dadum = spans.map(sp => realized.slice(sp.a, sp.b).map(m => (m === '/' ? 'DUM' : 'da')).join('-')).join(' ');
  const said = spans.map(sp => { const m = realized.slice(sp.a, sp.b).join(''); return FOOT_SAID[m] || m.replace(/\//g, 'DUM-').replace(/˘/g, 'da-').replace(/-$/, ''); });
  return { said, meter, unit, feet: t.feet, kind: t.kind, label: `${meter} ${lengthName}`, realized, positions: t.pos.map(p => (p.s ? 1 : 0)), spans, kinds, subs, regularity: kept / n, cost: c, perSyl: c / n, dadum };
}
// Reads every line of a laid-out poem: finds the meter most lines walk in, then scans each line against it.
// A line that walks clearly better in another meter says so.
function rhythm(lines, opts) {
  opts = opts || {};
  const ls = (lines || []).filter(l => l && l.stress && l.stress.length);
  if (!ls.length) return null;
  // The dominant meter is the one that fits the most lines best; total fit breaks a tie, and iambic wins a dead heat.
  const totals = {}, wins = {};
  Object.keys(METERS).forEach(m => { totals[m] = 0; wins[m] = 0; });
  ls.forEach(l => {
    let bestM = null, bestC = Infinity;
    Object.keys(METERS).forEach(m => { const f = bestFit(l.stress, m); const c = f ? f.c / l.stress.length : 3; totals[m] += c; if (c < bestC - 1e-9) { bestC = c; bestM = m; } });
    if (bestM) wins[bestM]++;
  });
  let dominant = 'iambic';
  Object.keys(METERS).forEach(m => { if (wins[m] > wins[dominant] || (wins[m] === wins[dominant] && totals[m] < totals[dominant] * (dominant === 'iambic' ? 0.75 : 0.92))) dominant = m; });
  // a single line near ten syllables that walks iambic well enough is read as the sonnet's own meter
  if (ls.length === 1 && ls[0].stress.length >= 9 && ls[0].stress.length <= 11 && totals.iambic <= 0.3) dominant = 'iambic';
  // the caller may know the poem's pulse better (read from the poet's own lines, before the loom re-cut them)
  if (opts.dominant && METERS[opts.dominant]) dominant = opts.dominant;
  const scans = ls.map(l => {
    const sc = scanMeter(l.stress, dominant);
    let other = null;
    Object.keys(METERS).forEach(m => {
      if (m === dominant) return;
      const s2 = scanMeter(l.stress, m);
      if (s2 && sc && s2.cost + 1.2 < sc.cost && s2.perSyl < 0.06 && sc.perSyl > 0.3 && (!other || s2.cost < other.cost)) other = s2;
    });
    // the line is shown in the meter it walks best; "against" names the poem's meter it departs from
    return other ? Object.assign(other, { line: l.n, against: dominant, home: sc }) : Object.assign(sc || {}, { line: l.n, against: null, home: sc });
  });
  const counts = {};
  scans.forEach(s => { if (s.label) counts[s.label] = (counts[s.label] || 0) + 1; });
  const common = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return { dominant, lines: scans, commonLabel: common ? common[0] : '', commonCount: common ? common[1] : 0, total: scans.length,
    regularity: scans.reduce((a, s) => a + (s.regularity || 0), 0) / scans.length };
}

/* ------------------------------------------------------------------ rime: the sounds your words share */
// Words anywhere in the poem that share a rhyme sound. Each family of two or more different words gets a number,
// in the order the family first sounds. Little words (the, of, and) stay out.
function rhymeFamilies(toks) {
  const groups = new Map();
  (toks || []).forEach(t => {
    if (!t.core || !t.rime || !t.rime.key) return;
    if ((FUNCTION_WORDS.has(t.lower) || DANGLERS.has(t.lower)) && !t.origEnd && !t.cut) return;   // a little word counts only at a line end
    if (!/[aeiouAEIOUWQYV]/.test(t.rime.key)) return;
    const k = t.rime.key.replace(/z/g, 's');
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(t);
  });
  const families = [];
  const byToken = new Map();
  [...groups.entries()].forEach(([key, ts]) => {
    const words = [...new Set(ts.map(t => t.lower.replace(/[^a-z']/g, '')))];
    if (words.length < 2) return;
    families.push({ key, tokens: ts, words, first: ts[0].i });
  });
  families.sort((a, b) => a.first - b.first);
  families.forEach((f, id) => { f.id = id; f.tokens.forEach(t => byToken.set(t.i, id)); });
  return { families, byToken };
}
// The rhyme scheme of the poet's own lines, before the loom touches them.
function ownScheme(toks) {
  const byLine = new Map();
  (toks || []).forEach(t => { if (!byLine.has(t.line)) byLine.set(t.line, []); byLine.get(t.line).push(t); });
  const rows = [...byLine.entries()].sort((a, b) => a[0] - b[0]);
  const ends = rows.map(([, ts]) => ts[ts.length - 1]);
  const letters = [], kinds = [], slants = [];
  let next = 0;
  ends.forEach((e, i) => {
    let found = '', kind = 'none';
    for (let j = 0; j < i && !found; j++) { if (rhymeKind(ends[j], e).kind === 'full') { found = letters[j]; kind = 'full'; } }
    // a slant chime is noted but does not pass its letter on, so slant links never chain a clean ABAB into AAAA
    let slantWith = 0;
    for (let j = 0; j < i && !found && !slantWith; j++) { if (rhymeKind(ends[j], e).kind === 'slant') { slantWith = j + 1; kind = 'slant'; } }
    letters.push(found || String.fromCharCode(65 + (next++ % 26)));
    kinds.push(kind);
    slants.push(slantWith);
  });
  return rows.map(([line, ts], i) => ({ line, end: ends[i], letter: letters[i], kind: kinds[i], slantWith: slants[i], syl: ts.reduce((a, t) => a + t.syl, 0) }));
}

function marks(stress) { return stress.map(v => v === 'F' ? '˘' : v === 1 ? '/' : v === 0.5 ? '\\' : '˘').join(''); }
function scan(line) {
  return line.stress.map((v, p) => { const strong = p % 2 === 1; if (v === 'F') return true; return strong ? v >= 0.5 : v < 1; });
}
function plain(result, opts) {
  opts = opts || {};
  const out = [];
  result.sonnets.forEach((s, i) => {
    s.lines.forEach((ln, m) => {
      let t = ln.text;
      if (opts.capitalize && ln.pieces[0].from === 0) t = t.replace(/^(["“‘(]*)(\p{L})/u, (x, q, ch) => q + ch.toUpperCase());
      out.push(t);
      if (m === 3 || m === 7 || m === 11) out.push('');
    });
    if (i < result.sonnets.length - 1) out.push('');
  });
  return out.join('\n');
}

return { weave, weaveStrict, weaveWhole, tokenize, joinTokens, sylWord, stressWord, syllabify, phon, rimeOf, rhymeKind, marks, scan, scanMeter, rhythm, rhymeFamilies, ownScheme, framePart, rhymePartnerOf, plain, margin, grade, meterCost, TURN_WORDS, FUNCTION_WORDS, EXC };
});
