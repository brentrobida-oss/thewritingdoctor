# thewritingdoctor

Teaching tools for rhetorical analysis and poetry: the Claims Reader and the Sonnet Loom. The repo holds the Loom engine and its tests; the published apps are built outside the repo. No package.json and no dependencies.

## Layout
- `index.html`: site entry page.
- `claims-reader/`: `sonnet-loom.js` (engine, pure functions, no DOM), `SONNET-LOOM.md` (accuracy notes), `test/` (engine tests), `screenshots/`.

## Commands
- Test: `node --test claims-reader/test/sonnet-loom.test.js`

## Rules
- The Loom never adds, drops, or changes a word of a poem. The tests cover this; keep them passing.
- Prosody stays rule-based (no dictionary lookups).
- App copy uses no em dashes. Use parentheses or a new sentence.
- No school names in app copy.
- Build scratch (page sources, splice scripts) stays in the session scratchpad. Do not commit it.
