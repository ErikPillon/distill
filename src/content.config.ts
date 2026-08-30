import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { RELATIONS } from './lib/relations';

/**
 * Two collections, two node types:
 *
 *   sources — a book, article, or video you consumed. Carries provenance.
 *   notes   — one atomic idea. Carries meaning. This is what the graph draws.
 *
 * The split matters: a graph of sources gives you a handful of fat nodes and
 * vague edges. A graph of notes gives you a thinking tool. Sources only ever
 * differ in how you cite them (page / timestamp / URL) — never in note shape,
 * which is what lets a video note and a book note connect as equals.
 */

const summaries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/summaries' }),
  schema: z.object({
    // --- Core ---
    title: z.string(),
    author: z.string(),
    // One distilled sentence — the hook shown on cards and at the top.
    oneLine: z.string(),
    // Longer teaser used on the library cards.
    summary: z.string().optional(),

    // --- Provenance ---
    // The medium. Only affects how a note cites this source, never how the
    // note itself is modelled.
    kind: z.enum(['book', 'article', 'video']).default('book'),
    // Where to find the original (article permalink, video URL). Books usually
    // have none, which is fine.
    sourceUrl: z.string().url().optional(),

    // --- Presentation ---
    // An emoji or short glyph used as a lightweight "cover".
    cover: z.string().default('📘'),
    // Accent color (hex) used to tint the card + header for this book.
    accent: z.string().default('#4f46e5'),

    // --- Metadata / stats ---
    topics: z.array(z.string()).default([]),
    readingTime: z.coerce.number().default(6), // minutes to read the summary
    // Your personal 1–5 rating of the book (optional).
    rating: z.number().min(1).max(5).optional(),
    // When you published the summary (drives ordering + "new" badges).
    publishDate: z.coerce.date(),
    // When you actually consumed the source (optional, for your own records).
    readDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),

    // The deck. Ordered ids from the `notes` collection — this is the reading
    // sequence, and the only place order lives. A note can appear in more than
    // one source's deck; the note itself stays order-free, which is what lets
    // it belong to several books at once.
    //
    // Deliberately explicit rather than "every note citing this source": the
    // order IS the summary. Sequencing the cards is the editorial work.
    cards: z.array(z.string()).default([]),

    // Source-level narrative links. These are the essay-length "how do these
    // two books argue with each other" notes — deliberately kept separate from
    // note-level links, which are precise and typed.
    connections: z
      .array(
        z.object({
          slug: z.string(),
          note: z.string(),
        }),
      )
      .default([]),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    // Three-to-five word handle for the idea. It's the card headline and the
    // graph label, so it has to be recognisable at a glance and out of context.
    title: z.string(),

    // The whole note in one sentence, in your own words. If it needs an "and",
    // it's probably two notes.
    claim: z.string(),

    // Which sources this idea came from — ids in the `summaries` collection.
    // Empty means it's your own thought, which is the goal state for the best
    // notes and the reason this isn't a required field.
    sources: z.array(z.string()).default([]),
    // How to find it again in the original: "p. 84", "ch. 3", "18:42".
    locator: z.string().optional(),

    topics: z.array(z.string()).default([]),

    // Typed, directed edges. Declare each link once, on whichever side reads
    // more naturally — backlinks are computed at build time.
    links: z
      .array(
        z.object({
          to: z.string(), // id of another note
          rel: z.enum(RELATIONS),
          note: z.string().optional(), // why this edge exists
        }),
      )
      .default([]),

    draft: z.boolean().default(false),
  }),
});

export const collections = { summaries, notes };
