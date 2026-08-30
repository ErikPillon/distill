---
title: The Pragmatic Programmer
author: Andrew Hunt & David Thomas
oneLine: "Software is not built, it is grown — so optimize for the cost of changing your mind, not for the elegance of the first version."
summary: "The craft book that named DRY, orthogonality, tracer bullets and broken windows: a set of habits for keeping software cheap to change, written by two people who clearly repaired a lot of other people's systems."
kind: book
cover: "🛠️"
accent: "#334155"
topics: ["craft", "systems", "decision-making", "learning"]
readingTime: 8
rating: 5
publishDate: 2026-08-24
readDate: 2026-06-28
connections:
  - slug: principles
    note: "DRY and 'write your principles down' are the same instinct in different domains: one authoritative representation of a decision, so it can be improved in one place instead of drifting across copies."
  - slug: antifragile
    note: "Orthogonality is antifragility for codebases. Decoupled components mean a shock stays local; tightly coupled ones propagate it. Tracer bullets are Taleb's optionality with a compiler."
---

## The one idea

The dominant cost in software is not writing it — it's changing it after the world has moved. Every practice in the book follows from that: treat the code as something that will be modified by tired people under deadline pressure, including you, and design accordingly. Elegance that resists change is a liability; awkwardness that localizes change is an asset.

## The engine

**DRY — one authoritative representation.** Widely misread as "don't type the same thing twice." The real principle is about *knowledge*: every piece of it should have a single unambiguous home in the system. Duplicated code is only a symptom; the disease is two places that must be kept in agreement by human diligence, which is a bet that always eventually loses.

**Orthogonality.** Components should be independent enough that changing one doesn't force changes in others. This is the property that actually determines whether a system is cheap or ruinous to modify, and it's usually sacrificed early for a small convenience that looks free at the time.

**Tracer bullets.** Build a thin, working, end-to-end path through the whole system first — ugly but real — then aim from actual feedback. Distinct from a prototype, which you throw away; the tracer stays and gets fleshed out. It's a bet that your understanding of the target is wrong and that the fastest way to find out is to fire.

**Broken windows.** Tolerated small decay signals that decay is tolerated, and quality collapses faster than anyone expects. One bad module that everyone routes around teaches the team what the standard actually is. Fix it now or watch the standard move.

Around these: know your tools deeply, learn a language a year, keep a plain-text home for knowledge, and treat "good enough" as a requirement you negotiate rather than a compromise you're ashamed of.

## My take

The best craft book I know, and the only one on this shelf whose advice I use daily. What makes it hold up after twenty-five years is that it's almost entirely about *judgment under constraint* rather than technology — the specific tools have all been replaced, and none of the reasoning has.

Broken windows is the one I've seen play out most reliably, and always faster than expected. A codebase's real standard is whatever the worst tolerated module says it is, and everyone reads that signal correctly within about a week of joining.

## Where it gets thin

DRY is the most over-applied principle in software, and the book bears some responsibility. Chasing it aggressively produces premature abstraction — two things that merely *look* alike get unified, and then diverge, and you end up with a parameterized monster that's worse than the duplication. The later formulation ("a little duplication is far cheaper than the wrong abstraction") is a correction the original text doesn't anticipate.

The book also predates the problems that now dominate: distributed systems, dependency supply chains, and the question of what "craft" means when a model writes the first draft. It's a book about a single skilled person and their codebase, and a lot of modern difficulty lives in the coordination between many of them.

## The distilled principle

> Write for the person who has to change this under pressure at 2am, because that person is you, and they will not remember why any of it was clever.
