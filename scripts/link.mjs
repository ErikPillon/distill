#!/usr/bin/env node
/**
 * Adds one typed edge to a note. You supply the relation and the reasoning —
 * this only handles the YAML.
 *
 *   npm run link -- --from note-a --to note-b --rel extends \
 *     --note "Why this edge exists."
 *
 * Linking to a note that doesn't exist yet is legal and deliberate: it shows up
 * under "Loose ends" on /graph as a to-write queue.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parse, collection, NOTES, c } from './lib.mjs';

const RELATIONS = ['extends', 'supports', 'contradicts', 'example-of', 'prerequisite-of'];

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith('--')) continue;
  const key = argv[i].slice(2);
  args[key] = argv[i + 1]?.startsWith('--') ? true : argv[++i];
}

const { from, to, rel, note } = args;
if (!from || !to || !rel) {
  console.error('need --from, --to and --rel');
  process.exit(1);
}
if (!RELATIONS.includes(rel)) {
  console.error(`--rel must be one of: ${RELATIONS.join(', ')}`);
  process.exit(1);
}
if (from === to) {
  console.error('a note cannot link to itself');
  process.exit(1);
}

const path = `${NOTES}/${from}.md`;
if (!existsSync(path)) {
  console.error(`${path} doesn't exist`);
  process.exit(1);
}

const { data } = parse(path);
const already = (data.links ?? []).some((l) => l.to === to);
if (already && !args.force) {
  console.error(
    `${from} already links to ${to} — pass --force to replace that edge ` +
      `(use it to add reasoning you left off the first time)`,
  );
  process.exit(1);
}

// Declare each edge once, on whichever side reads better. The reverse is
// derived at build time, so warn rather than silently duplicating.
const reverse = collection(NOTES).find(
  (n) => n.id === to && (n.data.links ?? []).some((l) => l.to === from),
);

let raw = readFileSync(path, 'utf8');

// Replacing: drop the existing entry for this target first. An entry runs from
// its `- to:` line until the next one or the close of the frontmatter.
if (already) {
  const fmEnd = raw.indexOf('\n---', 3);
  const fm = raw.slice(0, fmEnd);
  const lines = fm.split('\n');
  const start = lines.findIndex((l) => l.trim() === `- to: ${to}`);
  let stop = start + 1;
  while (stop < lines.length && !/^\s*- to:/.test(lines[stop])) stop++;
  lines.splice(start, stop - start);
  raw = lines.join('\n') + raw.slice(fmEnd);
}
const end = raw.indexOf('\n---', 3); // close of frontmatter
if (end < 0) {
  console.error(`${path}: malformed frontmatter`);
  process.exit(1);
}

// `links:` is always the last key in our template and scaffolder output, so
// appending at the end of the frontmatter is safe.
const hasBlock = /^links:/m.test(raw.slice(0, end));
const entry =
  (hasBlock ? '' : '\nlinks:') +
  `\n  - to: ${to}` +
  `\n    rel: ${rel}` +
  (note ? `\n    note: "${String(note).replace(/"/g, "'")}"` : '');

writeFileSync(path, raw.slice(0, end) + entry + raw.slice(end));

const exists = existsSync(`${NOTES}/${to}.md`);
console.log(`\n  ${c.green('✓')} ${c.bold(from)} ${c.cyan(rel)} → ${c.bold(to)}`);
if (!exists)
  console.log(
    c.dim(`  ${to} doesn't exist yet — it'll show under "Loose ends" on /graph.\n`),
  );
else if (reverse)
  console.log(c.yellow(`  ! ${to} already links back to ${from} — declare edges once.\n`));
else console.log('');
if (!note) console.log(c.yellow('  ! no --note: an edge without reasoning is a line, not a thought.\n'));
