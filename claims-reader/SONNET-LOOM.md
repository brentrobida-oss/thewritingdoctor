# The Sonnet Loom

The Sonnet Loom is the bring-your-own-poem view of the Claims Reader. A student pastes a poem of any length, from one line to many, and the loom:

1. **Makes the line breaks** without adding, dropping, changing, or reordering a word. By default it cuts only between words and keeps lines as near ten syllables as the words allow. With "Never split a word" turned off, it cuts at exactly every tenth syllable and hyphenates a word that straddles the cut.
2. **Reads the syllables, rhythm, and rime.** Every word carries its syllable count. Every line is scanned foot by foot against the meter most lines walk in, with inversions, spondees, light feet, feminine endings, and headless or clipped lines named. End rhymes are lettered on the Shakespearean frame (ABAB CDCD EFEF GG), the poet's own line ends get their own scheme, and rhyme families tint every word that shares a sound.
3. **Grades and annotates what is there.** One line, eight lines, or fourteen are graded on the lines written. A row the frame cannot judge yet (the turn before line 9 exists, the couplet before line 13) is marked "not yet" and left out of the score, and the margin says what comes next.

The engine is `sonnet-loom.js`: plain rules, no dictionary, no network, no AI. It loads as a browser global (`window.SonnetLoom`) or a CommonJS module.

The live page is the Claims Reader artifact on claude.ai (the class edition and the open edition), which embeds this same engine.

## Tests

```
node --test claims-reader/test/sonnet-loom.test.js
```

The tests check that no word is ever changed, that Shakespeare's Sonnet 18 poured into a single line comes back with all fourteen of its line breaks, that one line and eight lines are handled and graded on what they hold, and that the meter reader names iambic, trochaic, and anapestic verse correctly.
