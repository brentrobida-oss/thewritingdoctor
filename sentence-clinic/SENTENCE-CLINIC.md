# The Sentence Clinic

A reader for student analytical essays, built for 11th-grade honors, CP, and AP writers. Paste an essay; every sentence gets a job and a color, and every sentence that falls short gets three things: a question to answer, a rewrite with the blanks left for the student, and one recommendation.

Live at `/sentence-clinic/`. The engine is `clinic.js`; the page is `index.html`; the tests are in `test/`. No dictionary, no network, no model: every judgment is a pattern, written down, so it can be read, argued with, and corrected.

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
node --test sentence-clinic/test/clinic.test.js
```

The tests cover the sentence splitter, paragraphing from single newlines, four essays (a strong literary analysis that passes all ten checks, a weak one that fails all ten and triggers every habit flag, a rhetorical analysis whose How is devices, and a philosophy essay whose How is reasons), a conclusion that copies its thesis, a two-paragraph essay, thesis overrides, the rewrite functions, name-aware vagueness, and defined versus undefined abstractions.

## Limits

This is a pattern reader. It cannot tell a true claim from a false one, a good reading from a bad one, or irony from earnest. It reads the shape of a sentence and asks the question the shape invites. A strong essay can trip a flag; a weak essay can slip past one. The questions are the product; the colors only point to where to ask them.
