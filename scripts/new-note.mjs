#!/usr/bin/env node
/**
 * Scaffolds one note file from YOUR words. It does no writing of its own —
 * every string it emits came in on the command line.
 *
 *   npm run note -- \
 *     --title "Duration beats rate" \
 *     --claim "Compounding rewards how long you leave it alone more than the rate." \
 *     --source psychology-money --locator "ch. 4" \
 *     --topics wealth,investing \
 *     --take "What changed for me: I stopped optimising the rate."
 *
 * --slug is derived from --title unless you pass it.
 */
import { writeFileSync, existsSync } from 'node:fs';
import { collection, NOTES, c } from './lib.mjs';

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const key = argv[i].slice(2);
  const val = argv[i + 1]?.startsWith('--') ? true : argv[++i];
  args[key] = val;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const { title, claim, take } = args;
if (!title || !claim) {
  console.error('need at least --title and --claim');
  process.exit(1);
}

const slug = args.slug ?? slugify(title);
const path = `${NOTES}/${slug}.md`;
if (existsSync(path) && !args.force) {
  console.error(`${path} already exists (pass --force to overwrite)`);
  process.exit(1);
}

const q = (s) => `"${String(s).replace(/"/g, "'")}"`;
const list = (s) =>
  '[' +
  String(s ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map(q)
    .join(', ') +
  ']';

const fm = [
  '---',
  `title: ${q(title)}`,
  `claim: ${q(claim)}`,
  `sources: ${list(args.source ?? args.sources)}`,
  args.locator ? `locator: ${q(args.locator)}` : null,
  `topics: ${list(args.topics)}`,
  '---',
  '',
  take ? String(take) : '<!-- your take: the pressure test, the counter-example, or what you changed -->',
  '',
].filter((l) => l !== null);

writeFileSync(path, fm.join('\n'));

// Show which existing notes share a topic — the candidate pool for linking,
// picked mechanically. Choosing among them is your job, not the script's.
const topics = new Set(list(args.topics).match(/"([^"]+)"/g)?.map((s) => s.slice(1, -1)) ?? []);
const neighbours = collection(NOTES)
  .filter((n) => n.id !== slug && (n.data.topics ?? []).some((t) => topics.has(t)))
  .map((n) => `    ${n.id.padEnd(34)} ${c.dim(n.data.title)}`);

console.log(`\n  ${c.green('✓')} ${c.bold(path)}\n`);
if (neighbours.length) {
  console.log(c.dim(`  shares a topic with ${neighbours.length} existing note(s):`));
  console.log(neighbours.join('\n'));
  console.log(c.dim('\n  candidates only — the relation is yours to argue for.\n'));
} else {
  console.log(c.dim('  no topic overlap yet — first note in this territory.\n'));
}
