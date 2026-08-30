---
# ─────────────────────────────────────────────────────────────
# NOTE TEMPLATE — one atomic idea
# Copy into src/content/notes/your-note-slug.md
# The filename becomes the note's global id and the target other
# notes point at. Keep it short and lowercase.
#
# The test for "atomic": if the claim needs an "and", it's two notes.
# ─────────────────────────────────────────────────────────────

# 3–5 words. The card headline and the graph label, so it has to be
# recognisable out of context months from now. A handle on the specific
# claim ("Duration beats rate"), not a category ("Compounding").
title: "Short recognisable handle"

# One declarative sentence, in your own words. If you can't disagree
# with it, it isn't a claim and nothing can link to it.
claim: "The whole idea in one sentence."

# Which sources this came from — filenames in src/content/summaries/.
# Leave EMPTY for your own thought, even one you had while reading.
# Sourceless notes render grey in the graph, so at a glance you can see
# how much of the library is actually yours.
sources: ["some-source-slug"]

# How to find it again. The only field whose shape depends on the medium:
#   book → "p. 84" / "ch. 3"   article → "§ Tradeoffs"   video → "18:42"
# Omit it rather than guessing.
locator: "p. 1"

# Reuse existing topics — check /topics first. A topic with one note
# is a tag, not a topic.
topics: ["topic-one"]

# The synthesis layer. Declare each edge ONCE, on whichever note it
# reads more naturally from — the reverse direction is generated.
#
#   extends          takes the idea further
#   supports         is evidence for it
#   contradicts      can't both be operative (the valuable one)
#   example-of       a concrete case of it
#   prerequisite-of  that one collapses without this one
#
# `supports` is the lazy default — before using it, check whether
# `prerequisite-of` or `example-of` is actually true instead.
#
# Pointing at a note that doesn't exist yet is fine — the graph page
# lists those under "Loose ends" as a to-write queue.
links:
  - to: another-note-slug
    rel: extends
    note: "Why this edge exists. Write the reasoning, not just the fact."
---

Your take, in one to three sentences — this is what renders under "my take"
on the card. The pressure test you'd apply, the counter-example that worries
you, or where you've actually used it.

If it needs more than three sentences, the extra material is its own note.
