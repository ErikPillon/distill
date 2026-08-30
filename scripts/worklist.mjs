#!/usr/bin/env node
/**
 * Turns a raw capture into a numbered worklist so no line gets silently
 * dropped, and shows how far through it you are.
 *
 *   npm run worklist -- capture/psychology-of-money.md          # regenerate
 *   npm run worklist                                            # show progress
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { c } from './lib.mjs';

const src = process.argv[2];

function listPath(p) {
  return p.replace(/\.md$/, '.worklist.md');
}

if (src) {
  const bullets = readFileSync(src, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- ') && l.length > 4)
    .map((l) => l.slice(2).trim());

  const out = [
    `# Worklist — ${src}`,
    '',
    `${bullets.length} captured lines. Tick a line when it has become one or`,
    'more notes — or when you decide it becomes none, which is also a decision.',
    '',
    'Mark `- [x]` and add `→ note-slug, other-note-slug` after it.',
    '',
    ...bullets.map((b, i) => `- [ ] **${String(i + 1).padStart(2, '0')}.** ${b}`),
    '',
  ].join('\n');

  const dest = listPath(src);
  if (existsSync(dest) && !process.argv.includes('--force')) {
    console.error(`${dest} exists — pass --force to regenerate (you'd lose ticks)`);
    process.exit(1);
  }
  writeFileSync(dest, out);
  console.log(`\n  ${c.green('✓')} ${c.bold(dest)} — ${bullets.length} lines\n`);
} else {
  // Progress across every worklist that exists.
  const { readdirSync } = await import('node:fs');
  const lists = readdirSync('capture').filter((f) => f.endsWith('.worklist.md'));
  if (!lists.length) {
    console.log(c.dim('\n  no worklists yet — pass a capture file to make one.\n'));
    process.exit(0);
  }
  console.log('');
  for (const f of lists) {
    const txt = readFileSync(`capture/${f}`, 'utf8');
    const done = (txt.match(/^- \[x\]/gim) ?? []).length;
    const total = (txt.match(/^- \[[ x]\]/gim) ?? []).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '·');
    console.log(`  ${c.cyan(bar)} ${String(pct).padStart(3)}%  ${done}/${total}  ${f}`);
  }
  console.log('');
}
