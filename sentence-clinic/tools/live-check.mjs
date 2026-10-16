#!/usr/bin/env node
/* Drive the Sentence Clinic in a real browser and report what a student would see. Needs playwright
   (npm i playwright && npx playwright install chromium) and network access to the page and, for the
   Digitize step, to the CDNs that serve Tesseract.js.
     node sentence-clinic/tools/live-check.mjs [url] [--no-digitize] [--timeout=120000]
   The default url is the live page. The script prints one JSON object per check and exits 1 if any
   check fails. The Digitize check paints two typed paragraphs on a canvas, feeds the PNG to the
   file input, and waits for the status line to say "Digitized" or "Could not". */
import { createRequire } from 'node:module';
/* require() so a global install (NODE_PATH) works as well as a local one */
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--')) || 'https://splendorous-druid-db6a7a.netlify.app/sentence-clinic/';
const digitize = !args.includes('--no-digitize');
const timeout = Number((args.find(a => a.startsWith('--timeout=')) || '--timeout=120000').split('=')[1]);
const exe = process.env.CHROMIUM_PATH || undefined;

const SAMPLE = [
  'Thatcher opens her eulogy with a claim that the rest of the speech will have to earn: that Reagan was a great man.',
  'She supports it through anecdote and through repetition of the word "freedom", so that the audience hears the word as his.'
];

const results = [];
const record = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(JSON.stringify({ check: name, ok, ...detail })); };

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', r => consoleErrors.push('requestfailed: ' + r.url() + ' ' + (r.failure() || {}).errorText));

try {
  const res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  record('load', !!res && res.ok() && consoleErrors.length === 0, { status: res && res.status(), consoleErrors: consoleErrors.slice() });

  await page.click('.qcard[data-q="2"]');
  await page.selectOption('#lib-year', '2019');
  await page.waitForTimeout(300);
  const promptText = (await page.locator('#prompt-card').innerText()).trim();
  const links = await page.locator('#prompt-card .links a').evaluateAll(as => as.map(a => ({ text: a.textContent.trim(), href: a.href })));
  const cbLinks = links.filter(l => /collegeboard\.org/.test(l.href));
  record('q2-2019-prompt', promptText.length > 100 && cbLinks.length > 0, { promptChars: promptText.length, firstLine: promptText.split('\n')[0], collegeBoardLinks: cbLinks.length, links });

  const passage = (await page.locator('#passage-pane').innerText().catch(() => '')).trim();
  record('q2-2019-passage-pane', passage.length > 0, { chars: passage.length, head: passage.slice(0, 160) });

  await page.click('#sample-strong');
  await page.waitForTimeout(800);
  const readingOn = await page.locator('#reading').evaluate(el => el.classList.contains('on'));
  const boardText = (await page.locator('#board').innerText()).trim();
  record('strong-sample-read', readingOn && /Quotation integration/.test(boardText), { readingOn, boardHasQuotationIntegration: /Quotation integration/.test(boardText), boardHead: boardText.slice(0, 120) });

  if (digitize) {
    const png = await page.evaluate(([a, b]) => {
      const c = document.createElement('canvas'); c.width = 1000; c.height = 600;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#000'; ctx.font = '24px sans-serif'; ctx.textBaseline = 'top';
      const wrap = (text, y) => { const words = text.split(' '); let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > 920) { ctx.fillText(line, 40, y); y += 34; line = w; } else line = t; } ctx.fillText(line, 40, y); return y + 34; };
      let y = 40; y = wrap(a, y); y += 40; wrap(b, y);
      return c.toDataURL('image/png');
    }, SAMPLE);
    const buffer = Buffer.from(png.split(',')[1], 'base64');
    const before = consoleErrors.length;
    await page.setInputFiles('#digitize', { name: 'typed-sample.png', mimeType: 'image/png', buffer });
    const t0 = Date.now();
    let status = '';
    try {
      await page.waitForFunction(() => /Digitized|Could not/.test((document.getElementById('digitize-status') || {}).textContent || ''), null, { timeout });
    } catch (e) { /* timed out: report whatever the line says */ }
    status = (await page.locator('#digitize-status').innerText()).trim();
    const src = await page.locator('#src').inputValue();
    const ok = /^Digitized/.test(status) && /Thatcher/.test(src);
    record('digitize', ok, { status, seconds: Math.round((Date.now() - t0) / 10) / 100, srcHead: src.slice(0, 200), consoleErrors: consoleErrors.slice(before) });
  }
} catch (e) {
  record('script', false, { error: e.message, consoleErrors });
} finally {
  await browser.close();
}
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length} of ${results.length} checks passed${failed.length ? ': ' + failed.map(f => f.name).join(', ') + ' failed' : ''}`);
process.exit(failed.length ? 1 : 0);
