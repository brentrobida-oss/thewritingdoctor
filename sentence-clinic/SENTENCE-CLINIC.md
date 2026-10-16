# The Sentence Clinic

A reader for student analytical essays, built for AP English Language (Synthesis, Rhetorical Analysis, Argument) and for 11th-grade honors and CP writers. Paste an essay; every sentence gets a job and a color, and every sentence that falls short gets three things: a question to answer, a rewrite with the blanks left for the student, and one recommendation.

Live at `/sentence-clinic/`. The engine is `clinic.js`; the page is `index.html`; the tests are in `test/`. No dictionary, no network, no model: every judgment is a pattern, written down, so it can be read, argued with, and corrected.

## The AP Language layer (`aplang.js`)

Choose the question (Q1 Synthesis, Q2 Rhetorical Analysis, Q3 Argument); the reading adapts. Optionally choose a year: the library (`library.js`) shows the prompt in one line and links to College Board's official question, scoring guidelines, sample responses, and scoring commentary. For Q2, a passage in the US public domain is shown beside the essay; otherwise the link is the passage.

The score board shows, in this order:

1. **Quotation integration, 1 to 6.** Each quotation is scored on five marks: framed (a speaker and a verb before or after it), embedded (inside the writer's own sentence), lean (20 words or fewer), attributed (a `(Source X)` tag for Q1; a name or line reference for Q2), and read (the next sentence, or the same one, names a word from it). Single-word quotations read in place ("the possessive 'yours'") earn full marks. For Q3 the meter reads examples instead: named, set up, and tied back; stock examples (the ones every essay reaches for) cost. The reasons appear as a plus and arrow list under the dial.
2. **Evidentiary support, 1 to 6.** Per body paragraph: evidence present, commentary at least half the evidence, topic sentence tied to the thesis, paragraph closing on the claim, summary kept down. Then by question: Q1 counts distinct sources (fewer than three caps the score, as the rubric does) and looks for a concession; Q2 looks for named rhetorical choices, sentences that say what a choice does, the audience in every paragraph, and the occasion in the introduction; Q3 looks for specific examples and a qualification.
3. **AP estimate, 0 to 6**, by the College Board rows: Thesis (0 or 1), Evidence and Commentary (0 to 4, derived from the support score and the Q1 source count), Sophistication (never awarded; shown as "possible" when three or more signals are present: held tension, the rhetorical situation kept in view, a qualified argument, consistent style, a conclusion that widens the Why). If the essay is a College Board sample, enter its official score and the estimate is compared beside it.

Then the **shape** (introduction, two body paragraphs, conclusion, as blocks), **what is working** (strengths first, as badges), and **next moves** (at most seven, ranked: shape, thesis, evidence, quotation, rigor, conclusion). The sentence-by-sentence reading follows.

The estimate is a reading of shape, not of meaning. A hollow essay in the right shape can score well here and poorly with a reader; a brilliant essay in an odd shape can do the reverse. The calibration field exists so that a class can see where the two diverge and ask why.

## What it reads

**The spine.** Ten checks, shown as a checklist and a score out of ten:

1. The thesis is two sentences.
2. Sentence one states the **What**: a subject and a committed claim verb (argues, exposes, complicates, insists), not "shows" or "is about".
3. Sentence one states the **How**: the means, as devices after "through" or "by" (diction, structure, juxtaposition, the shift at the volta), or as reasons after "because" in an argument essay.
4. Sentence two states the **Why**: the stakes ("in order to", "thereby", "ultimately", "what is at stake", "matters because").
5. Every topic sentence states a What.
6. Every topic sentence states a How.
7. Every topic sentence shares a key term with the thesis.
8. Every quotation is framed by a speaker and followed by a sentence that reads one of its words.
9. Analysis outweighs summary in the body.
10. The conclusion returns to the Why in new words: it shares the Why sentence's key terms without repeating the thesis word for word.

**Roles.** Each sentence is tinted by its job: thesis (gold), topic sentence (blue), evidence (green), analysis (violet), summary (brown), development (grey), conclusion (teal). A conclusion sentence that echoes the Why is underlined in gold.

**Flags.** Each is underlined by kind and carries a question, a rewrite where one can honestly be made, and a recommendation.

| Kind | Flags |
|---|---|
| Analytical rigor (red) | hedged claim, overclaim, floating "this shows", unframed quotation, quotation left unread, question in place of a claim, cause without mechanism, circular "because", summary in place of analysis |
| Philosophical precision (amber) | vague term, undefined abstraction carrying a claim, abstraction as agent ("Society tells us"), agentless passive ("is seen as"), binary framing, dictionary definition |
| Spine (blue) | thesis lacks What / How / Why or a second sentence, topic sentence lacks What / How / tie to thesis, paragraph does not close the loop, conclusion missing / drifts / copies the thesis / brings new evidence |
| Style (grey) | announcement ("In this essay I will"), signposted conclusion ("In conclusion"), reader-address hook, overlong sentence, fragment |

Rewrites never invent the student's content. Where the engine knows the move but not the matter, it leaves a bracketed slot: "[The specific word or image] shows that ... [because: what in the wording makes this reading necessary?]".

## How it decides

- A paragraph is a line (a paste from Google Docs gives single newlines), except a hard-wrapped line, which is joined to the one before it.
- Sentences split on `. ! ?` followed by a capital, a digit, or an opening quotation mark, with common abbreviations and initials kept whole.
- The first paragraph is the introduction; the last, when there are three or more, is the conclusion. Two paragraphs are read as an introduction and one body, and the missing conclusion is flagged.
- The thesis is the best-scoring sentence or adjacent pair in the introduction, scored by position, claim verb, means, stakes, and length. A pair is preferred when the first sentence makes a claim and the second gives a Why or continues it. The reader can override the thesis sentence and its length from the page.
- Terms are compared after stopwords are removed and a light stemmer is applied, so "warn", "warning", and "warned" count as one term.
- Words capitalized mid-sentence are treated as names and titles, so "The Great Gatsby" is not read as "great".

## Tests

```
node --test sentence-clinic/test/*.test.js
```

`aplang.test.js` covers the four questions on five essays (including a synthesis essay with four sources), the three-source cap, single-word quotation reading, rhetorical-choice and audience detection, Q3 examples and stock examples, the four-paragraph shape, the never-awarded sophistication point, and strengths-first output.

The tests cover the sentence splitter, paragraphing from single newlines, four essays (a strong literary analysis that passes all ten checks, a weak one that fails all ten and triggers every habit flag, a rhetorical analysis whose How is devices, and a philosophy essay whose How is reasons), a conclusion that copies its thesis, a two-paragraph essay, thesis overrides, the rewrite functions, name-aware vagueness, and defined versus undefined abstractions.

## Limits

This is a pattern reader. It cannot tell a true claim from a false one, a good reading from a bad one, or irony from earnest. It reads the shape of a sentence and asks the question the shape invites. A strong essay can trip a flag; a weak essay can slip past one. The questions are the product; the colors only point to where to ask them.
