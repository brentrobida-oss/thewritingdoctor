# The Sonnet Loom

The Sonnet Loom is the bring-your-own-poem view of the Claims Reader. A student pastes a poem of any length, from one line to many, and the loom:

1. **Makes the line breaks** without adding, dropping, changing, or reordering a word. By default it cuts only between words and keeps lines as near ten syllables as the words allow. With "Never split a word" turned off, it cuts at exactly every tenth syllable and hyphenates a word that straddles the cut.
2. **Reads the syllables, rhythm, and rime.** Every word carries its syllable count. Every line is scanned foot by foot against the meter most lines walk in, with inversions, spondees, light feet, feminine endings, and headless or clipped lines named. End rhymes are lettered on the Shakespearean frame (ABAB CDCD EFEF GG), the poet's own line ends get their own scheme, and rhyme families tint every word that shares a sound.
3. **Grades and annotates what is there.** One line, eight lines, or fourteen are graded on the lines written. A row the frame cannot judge yet (the turn before line 9 exists, the couplet before line 13) is marked "not yet" and left out of the score, and the margin says what comes next.

The engine is `sonnet-loom.js`: plain rules, no dictionary, no network, no AI. It loads as a browser global (`window.SonnetLoom`) or a CommonJS module. Its spelling rules are backed by small tables of syllable counts and stresses, checked word by word against Merriam-Webster on a corpus of public-domain sonnets and on the vocabulary South Florida students actually write with.

## How precise it is

These figures come from runs against public-domain poems, using the engine in this folder:

| Check | Result |
| --- | --- |
| Line breaks recovered when 20 regular poems are poured into one line | 240 of 249 (96.4%) |
| Lines kept exactly when those poems are pasted with their own breaks | 247 of 269 |
| Line breaks recovered in 23 more pentameter poems the engine was never tuned on | 298 of 299 |
| Dominant meter named correctly across 37 poems in five meters | 36 of 37 |
| Verified syllable, stress, and rhyme corrections the engine now gets right | 1,006 of 1,071 |
| Random poems laid out with any word changed, dropped, or moved (2,000 runs, all modes) | 0 |

The misses that remain are mostly words whose sound depends on use (the noun or verb "record", "aged"), Spanish names with stress the spelling does not show, and dactylic hexameter, which the meter reader does not model.

The live page is the Claims Reader artifact on claude.ai (the class edition and the open edition), which embeds this same engine.

## Tests

```
node --test claims-reader/test/sonnet-loom.test.js
```

The tests check that no word is ever changed (including words joined by a dash, and words cut at the edge of a cut-at-ten frame), that Shakespeare's Sonnet 18 poured into a single line comes back with all fourteen of its line breaks, that one line and eight lines are handled and graded on what they hold, that true rhymes the spelling hides (sea/me, go/low, eyes/skies) are found, along with -ing rhymes such as showing/going and sighing/lying, and false ones (trees/birds, summer/water, material/vial) are not, and that the meter reader names iambic, trochaic, and anapestic verse and their common variations correctly.
