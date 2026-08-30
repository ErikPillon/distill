# Distil

A digital second brain: a Zettelkasten of atomic notes from everything I read, wired together with typed links, and rendered as swipeable idea decks. Built with [Astro](https://astro.build). Content is plain Markdown, so the whole library is greppable, diffable, and portable to whatever reads it next.

**The library only contains what I actually captured while reading.** Nothing is filled in from summaries elsewhere — a gap in a book's notes is real information about what landed.

---

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## The data model: sources and notes

Two collections, two kinds of thing:

- **`summaries/`** — a **source** you consumed: a book, article, or video (`kind:`). Carries provenance and your long-form take.
- **`notes/`** — one **atomic idea**, one file. Carries meaning. This is what the graph draws.

The split is the whole design. A graph whose nodes are books gives you five fat nodes and vague edges; a graph whose nodes are single claims is a thinking tool. Sources differ only in how you *cite* them — page number, section, timestamp — never in the shape of a note, which is what lets a note from a video and a note from a book connect as equals.

Note links are **typed and directed**, from a deliberately small vocabulary (`src/lib/relations.ts`):

| relation | meaning |
| --- | --- |
| `extends` | takes the other idea further |
| `supports` | is evidence for it |
| `contradicts` | can't both be right |
| `example-of` | is a concrete case of it |
| `prerequisite-of` | the other doesn't work until this holds |

Untyped links are the one real weakness of Obsidian's graph — they decay into "vaguely related." `contradicts` is the highest-value verb here: unresolved tension between two sources is where your own thinking has to show up.

Declare each link **once**, on whichever note it reads more naturally from. The reverse direction is derived at build time, so there's never a pair of frontmatter blocks to keep in sync.

## The deck

A source's summary is not an essay — it's an ordered **deck of cards**, and every card *is* one atomic note. The `cards:` array in the source frontmatter is the reading order:

```yaml
cards:
  - behaviour-beats-technique   # the thesis
  - nobody-is-crazy             # why it varies
  - duration-beats-rate         # the engine
```

Write once, get three things: a node in the graph, a card in the deck, and a row on the topic page. The deck is a *curated path* (8–14 cards), not everything — the rest of a book's notes still live in the graph and render under "Also from this book".

Two prose bookends wrap it: `summary:` above the deck, and a body of **My verdict** / **Where it gets thin** / **The distilled principle** below it.

This is also what makes the future iOS app cheap: it's a renderer over the same Markdown, not a second content system.

## The ritual

1. **Capture** while reading, into `capture/<slug>.md`. Fragments and typos are fine — speed over structure. Add a locator (`p. 84`, `ch. 3`, `18:42`) to anything you'll want to find again.
2. **Distil** — run `/distill capture/<slug>.md` in Claude Code. It splits the capture into atomic claims, drafts each note in your voice, dedupes against the existing graph, proposes typed links, and sequences the deck. The full process is written out in [`.claude/skills/distill/SKILL.md`](.claude/skills/distill/SKILL.md) if you'd rather do it by hand.
3. **Edit the voice.** The draft is a draft. The bodies are your takes and have to sound like you.
4. **Link deliberately.** Step 4 is the one that compounds — 1 and 2 are transcription, this is thinking. Pointing at a note that doesn't exist yet is fine: `/graph` lists those under **Loose ends** as your to-write queue.

### Graph health

After a pass, check: no orphan notes, `supports` under half of all edges (it's the lazy default — reach for `prerequisite-of` or `example-of` first), and **at least one `contradicts` per source**. A graph you've only ever agreed with isn't thinking, it's filing.

## Project structure

```
capture/                ← raw reading notes, unstructured (the inbox)
archive/                ← superseded content, outside the content collections
src/
  content/
    summaries/          ← sources: books, articles, videos
    notes/              ← atomic ideas, one per file (the graph nodes)
  content.config.ts     ← frontmatter contract for both collections
  lib/
    relations.ts        ← the link vocabulary + colors
    graph.ts            ← resolves nodes, edges, backlinks at build time
  layouts/BaseLayout.astro
  components/SummaryCard.astro
  pages/
    index.astro         ← library + "Idea of the day"
    graph.astro         ← the force-directed idea graph
    notes/[id].astro    ← a single note + its typed links and backlinks
    summaries/[...slug].astro   ← the reading view
    topics/             ← auto-generated topic pages
  styles/global.css     ← the whole design system (CSS variables, light/dark)
summary-template.md     ← copy this to add a source
note-template.md        ← copy this to add an atomic note
.claude/skills/distill/ ← the capture → notes → graph process, as a skill
```

`archive/` holds the seeded corpus this repo started from — 21 sources and 90 notes that were generated rather than read. It sits outside `src/content/`, so it doesn't build and doesn't pollute the graph, but it's still there to mine when a book gets read for real.

The graph is a hand-rolled force simulation on `<canvas>` — no dependencies. Node color is inherited from its first source, node size is its link count, and the layout is seeded deterministically so it looks the same on every reload and you can build spatial memory of where your ideas live.

To re-skin the site, edit the CSS variables at the top of `src/styles/global.css`.

---

## Deploy to GitHub + Vercel

Create the repo (empty, no README) on GitHub, then from this folder:

```bash
git remote add origin https://github.com/<you>/distil.git
git branch -M main
git push -u origin main
```

Then connect Vercel:

1. Go to [vercel.com/new](https://vercel.com/new) and **Import** the `distil` repo.
2. Vercel auto-detects Astro — no config needed. Framework: *Astro*, Build: `astro build`, Output: `dist`.
3. Click **Deploy**. Every future `git push` redeploys automatically.

Once live, set your real domain in `astro.config.mjs` (`site:`) so the sitemap and social tags are correct.

---

## Roadmap

**Phase 1 — the second brain (this repo).** Capture, atomise, link, publish. Static, fast, free.

**Phase 2 — the reader app.** A native iOS app over the same content. The build already emits everything it needs: `cards:` is the swipe order, `title` + `claim` + body is a card, and `links` is the "related ideas" tray. The work is a build step that writes `dist/api/library.json` and a SwiftUI app that renders it — no second CMS, no server.

**Phase 3 — spaced repetition.** Resurface individual notes over time. Notes are already atomic, dated, and typed, which is the hard prerequisite; the rest is a scheduling table.

The decision that makes all three share one source of truth: **the note is the unit, not the summary.** A summary is a query over notes. That's why the app is a renderer rather than a rewrite.
