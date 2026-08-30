---
# ─────────────────────────────────────────────────────────────
# SOURCE TEMPLATE  (book · article · video)
# Copy into src/content/summaries/your-source-slug.md
# The filename (minus .md) becomes the URL and the id that notes
# reference. Keep it lowercase-with-dashes.
#
# This file is the SOURCE and its bookends. The ideas themselves are
# separate files in src/content/notes/ — see note-template.md.
# ─────────────────────────────────────────────────────────────

title: Source Title
author: Author Name
oneLine: "One distilled sentence — the hook."
summary: "1–2 sentences. Renders above the deck and on the library card."

kind: book            # book | article | video
# sourceUrl: https://...   # permalink for articles and videos

cover: "📘"          # any emoji — your lightweight cover
accent: "#4f46e5"    # tints this source's card, page, and its notes in
                     # the graph — pick something you'll recognise as a cluster

topics: ["topic-one", "topic-two"]
readingTime: 7        # minutes to read YOUR deck
rating: 4             # optional, your personal 1–5
publishDate: 2026-01-01
readDate: 2026-01-01      # optional; omit rather than guessing

# ── THE DECK ────────────────────────────────────────────────
# 8–14 note ids, in reading order. This is the guided path, not the
# whole book — every other note citing this source still lives in the
# graph and renders under "Also from this book".
#
# Sequencing is the editorial work. If the order doesn't matter,
# you haven't found the argument yet.
cards:
  - first-note-slug
  - second-note-slug

# Source-level narrative links: the essay-length "how do these two
# argue with each other" take. Precise note-to-note links live in the
# note files instead.
connections:
  - slug: some-other-source-slug
    note: "How this source agrees with / contradicts / completes that one."
---

## My verdict

What actually changed — concrete, first person, about your behaviour rather
than the book's quality. "I stopped X and started Y" beats "insightful and
well-written".

## Where it gets thin

The steelman of the critics. What does it overclaim, ignore, or get wrong?
Non-negotiable: a library with no criticism in it is a library of marketing copy.

## The distilled principle

> One quotable line someone could pin to their wall.
