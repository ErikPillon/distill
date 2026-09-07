#!/usr/bin/env node
/**
 * Graph health check. Structure only — it never judges whether a claim is
 * *good*, only whether it's shaped like something that can be linked.
 *
 *   npm run doctor
 */
import { collection, NOTES, SOURCES, c } from './lib.mjs';

const notes = collection(NOTES);
const sources = collection(SOURCES);
const ids = new Set(notes.map((n) => n.id));

const fail = [];
const warn = [];
const info = [];

const sourceIds = new Set(sources.map((s) => s.id));

// ── Per-note structure ────────────────────────────────────────────────────
const edges = [];
const dangleOnly = new Set();
for (const n of notes) {
  const d = n.data;
  if (!d.title) fail.push(`${n.id}: missing \`title\``);
  if (!d.claim) fail.push(`${n.id}: missing \`claim\``);

  if (d.title) {
    const words = String(d.title).trim().split(/\s+/).length;
    if (words > 6) warn.push(`${n.id}: title is ${words} words — aim for 3–5`);
  }

  if (d.claim) {
    const claim = String(d.claim);
    if (!/[.!?]$/.test(claim.trim()))
      warn.push(`${n.id}: claim doesn't end in a full stop — is it a sentence?`);
    // Atomicity smell. Not always wrong (a claim can legitimately join two
    // halves of one idea) but always worth a second look.
    if (/\b\w+ and \w+\b/.test(claim) && / and /.test(claim))
      info.push(`${n.id}: claim contains "and" — one claim or two?`);
  }

  if (!d.topics?.length) warn.push(`${n.id}: no topics`);

  // `sources` is just an array of strings to the schema, so a source that
  // doesn't exist is dropped silently when the page renders. Catch it here.
  for (const src of d.sources ?? [])
    if (!sourceIds.has(src))
      warn.push(
        `${n.id}: source "${src}" has no file in ${SOURCES} — it renders as ` +
          `nothing until that source exists`,
      );

  if (d.locator === '') info.push(`${n.id}: empty \`locator\` — drop the line`);

  // An unfilled scaffold renders as a blank card.
  if (!n.body || /^<!--[\s\S]*-->$/.test(n.body.trim()))
    warn.push(`${n.id}: body is still the placeholder — the card will be empty`);

  let resolved = 0;
  for (const l of d.links ?? []) {
    if (l.to === n.id) fail.push(`${n.id}: links to itself`);
    else if (!ids.has(l.to)) warn.push(`${n.id}: dangling link → ${l.to}`);
    else {
      resolved++;
      edges.push({ from: n.id, to: l.to, rel: l.rel });
    }
    if (!l.note) warn.push(`${n.id} → ${l.to}: no \`note:\` explaining the edge`);
  }
  if ((d.links ?? []).length && !resolved) dangleOnly.add(n.id);
}

// ── Orphans ───────────────────────────────────────────────────────────────
const touched = new Set(edges.flatMap((e) => [e.from, e.to]));
const orphans = notes.filter((n) => !touched.has(n.id));
for (const o of orphans)
  warn.push(
    dangleOnly.has(o.id)
      ? `${o.id}: every link dangles — nothing connects it to the graph yet`
      : `${o.id}: no links in or out — an idea you haven't finished`,
  );

// ── Relation mix ──────────────────────────────────────────────────────────
const mix = {};
for (const e of edges) mix[e.rel] = (mix[e.rel] ?? 0) + 1;
if (edges.length >= 8) {
  const supports = mix.supports ?? 0;
  if (supports / edges.length > 0.5)
    warn.push(
      `\`supports\` is ${supports}/${edges.length} of edges — it's the lazy ` +
        `default. Check whether prerequisite-of or example-of is truer.`,
    );
  if (!mix.contradicts)
    warn.push(
      `no \`contradicts\` anywhere — a graph you've only agreed with isn't ` +
        `thinking, it's filing.`,
    );
}

// ── Topics ────────────────────────────────────────────────────────────────
const topicCount = {};
for (const n of notes)
  for (const t of n.data.topics ?? []) topicCount[t] = (topicCount[t] ?? 0) + 1;
for (const [t, k] of Object.entries(topicCount))
  if (k === 1) info.push(`topic "${t}" has 1 note — a tag, not a topic`);

// ── Sources and decks ─────────────────────────────────────────────────────
const bySource = {};
for (const n of notes)
  for (const s of n.data.sources ?? []) (bySource[s] ??= []).push(n.id);

// A topic that lands on most of one source's notes isn't a topic, it's a
// source tag in disguise — `sources:` already does that job, and it can never
// narrow anything down.
for (const [src, owned] of Object.entries(bySource)) {
  if (owned.length < 6) continue;
  const here = {};
  for (const id of owned) {
    const n = notes.find((x) => x.id === id);
    for (const t of n.data.topics ?? []) here[t] = (here[t] ?? 0) + 1;
  }
  for (const [t, k] of Object.entries(here))
    if (k / owned.length > 0.5)
      warn.push(
        `topic "${t}" is on ${k}/${owned.length} of ${src}'s notes — that's a ` +
          `source tag, not a topic. It can't narrow anything.`,
      );
}

const inSomeDeck = new Set();
for (const s of sources) {
  const cards = s.data.cards ?? [];
  cards.forEach((id) => inSomeDeck.add(id));
  for (const id of cards) {
    if (!ids.has(id)) fail.push(`${s.id}: deck card "${id}" doesn't exist`);
    else if (!(notes.find((n) => n.id === id).data.sources ?? []).includes(s.id))
      warn.push(`${s.id}: deck card "${id}" doesn't cite this source`);
  }
  const owned = bySource[s.id] ?? [];
  if (owned.length && !cards.length)
    info.push(`${s.id}: ${owned.length} notes but no deck sequenced yet`);
  if (cards.length && (cards.length < 8 || cards.length > 14))
    info.push(`${s.id}: deck is ${cards.length} cards — 8–14 reads best`);

  // One `contradicts` per source is the target, not per graph.
  const owns = new Set(owned);
  const contra = edges.filter(
    (e) => e.rel === 'contradicts' && (owns.has(e.from) || owns.has(e.to)),
  ).length;
  if (owned.length >= 8 && !contra)
    warn.push(`${s.id}: no \`contradicts\` edge touches this source`);
}

const own = notes.filter((n) => !(n.data.sources ?? []).length);

// ── Report ────────────────────────────────────────────────────────────────
const line = (sym, color, msgs) =>
  msgs.forEach((m) => console.log(`  ${color(sym)} ${m}`));

console.log('');
console.log(c.bold('  Graph'));
console.log(
  c.dim(
    `  ${notes.length} notes · ${edges.length} edges · ` +
      `${Object.keys(topicCount).length} topics · ${sources.length} sources · ` +
      `${own.length} your own`,
  ),
);
if (edges.length)
  console.log(
    c.dim(
      '  ' +
        Object.entries(mix)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => `${k} ${v}`)
          .join(' · '),
    ),
  );
console.log('');

if (fail.length) {
  console.log(c.bold(c.red('  Broken')));
  line('✗', c.red, fail);
  console.log('');
}
if (warn.length) {
  console.log(c.bold(c.yellow('  Worth fixing')));
  line('!', c.yellow, warn);
  console.log('');
}
if (info.length) {
  console.log(c.bold(c.dim('  Worth a look')));
  line('·', c.dim, info);
  console.log('');
}
if (!fail.length && !warn.length)
  console.log(c.green('  ✓ nothing broken, nothing lazy.\n'));

process.exit(fail.length ? 1 : 0);
