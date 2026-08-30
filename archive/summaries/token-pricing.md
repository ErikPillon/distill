---
title: Ways to Think About Token Pricing
author: Benedict Evans
oneLine: "Every dynamic we can currently see points toward foundation models becoming low-margin commodity infrastructure — and nobody can yet prove otherwise."
summary: "Evans on the AI supply crunch: why bottom-up modelling of token prices is hopeless, what the mobile-data and semiconductor analogies actually tell us, and why every path away from commoditisation requires something to change."
kind: article
cover: "🪙"
accent: "#475569"
topics: ["uncertainty", "systems", "leverage", "investing"]
readingTime: 7
rating: 4
publishDate: 2026-08-11
readDate: 2026-08-11
connections:
  - slug: leverage-field-manual
    note: "The risk section the leverage manual doesn't have. If models commoditise, code leverage doesn't disappear — it relocates, from owning the capability to owning the workflow, the data and the distribution. That changes which lever is worth pulling."
  - slug: the-black-swan
    note: "Evans's observation that all AI conversations end in a hunt for metaphors is the narrative fallacy caught in the act, and he does the rare thing of naming it about his own analogies: they show a range of outcomes, they don't have probative value."
  - slug: against-the-gods
    note: "A clean case of Knightian uncertainty rather than risk. Evans explicitly refuses to put a distribution on the outcome — not because the modelling is hard, but because the reference class doesn't exist yet."
---

## The one idea

Two things about token prices are certain: we're in a supply crunch, and it's unstable. Everything else is open. The question underneath the frantic analysis of chips and power is whether foundation models end up with sustainable pricing power and value capture, **or become low-margin commodity infrastructure** — and Evans's read is that every dynamic currently visible points at the second.

The discipline of the piece is its refusal to resolve that. "We don't know" appears repeatedly and deliberately.

## The engine

**Bottom-up modelling doesn't work here.** You can assume values for chips, fab output, data-centre buildout, power, price discipline and use cases, and you will get a number. Evans's analogy for what that number is worth: a five-year forecast of the broadband market built in 1998. The spreadsheet will be beautiful and possibly right about this year, and there are too many unknown variables for it to say anything useful about longer-term market structure. Token price is a function of supply and demand somewhere between the sellers' marginal cost and the buyers' ROI — and we don't know supply, demand, marginal cost, or ROI.

**So go top-down, and ask four questions.** How many people will pay to be at the frontier, given that many use cases already run fine on small cheap models? Does the frontier keep moving significantly? Is there meaningful differentiation between frontier models — currently everyone uses much the same science and data and gets much the same results, with no known network effect that would let one lab pull permanently ahead? And how much of the value at high-end use cases is captured by the *model* versus the tooling, proprietary data, go-to-market and support wrapped around it?

**The analogies, handled carefully.** Fiber is the popular comparison and Evans thinks it's wrong twice over — fiber was built far ahead of demand where AI compute is far behind it, and fiber was mostly fixed cost where compute is marginal. **Mobile data is the better parallel**: marginal cost for capacity, an enormous demand surge, pricing rebalanced around bundles. And the outcome there is the uncomfortable part — cellular data traffic rose orders of magnitude, the industry reached a trillion in annual revenue on $200bn of capex, *and the stocks went nowhere*, because all the value was captured further up the stack. Semiconductors offer the opposite shape: escalating cost and complexity collapsed the frontier to effectively one player, TSMC — which still doesn't capture much of the value, netting $53bn, less than half of Apple alone.

**And then the epistemics.** Evans notes that all AI conversations end in a hunt for metaphors, and refuses to let his own do the work: you can't prove whether AI is like mobile by arguing how much it's like mobile. The analogies establish a *range* of possible outcomes, not a probability over them.

## My take

The most valuable thing here isn't the conclusion — it's the demonstration of how to reason about a genuinely undetermined situation without either forecasting falsely or shrugging. Evans lays out the variables, shows why they can't be resolved bottom-up, uses analogies explicitly as range-finders rather than evidence, and then commits to a direction anyway.

The asymmetry in the closing argument is the sharpest move: every path to foundation models having durable pricing power **requires something to change** — network effects to emerge, competition to weaken, chatbots to become products that don't need wrapping. Commoditisation is the default; everything else needs a mechanism. That's a much stronger claim than a forecast, and it's structured so you can watch for the specific things that would falsify it.

The mobile-data precedent is the one to sit with if you're building anything on top of models: an industry can be enormous, essential, and capital-destroying all at once.

## Where it gets thin

It's an essay about not knowing, which means it can't be wrong in any way that would teach you something — the four questions are the right questions and none of them get answered. Evans names this himself, but naming a limitation doesn't remove it.

The mobile comparison also has a weak joint he moves past quickly: telcos sold a genuinely undifferentiated commodity, where model outputs currently do differ in quality in ways buyers can perceive and pay for. Whether that difference persists is precisely question two, and the analogy quietly assumes the answer it's meant to be probing.

And this is the most perishable item in the library. It's a snapshot of July 2026 written to be read in July 2026, and the specific claims — 40–50% inference gross margins, software development as the one use case with real product-market fit — have a half-life measured in months. The *method* will outlast the content by years.

## The distilled principle

> When the reference class doesn't exist yet, analogies give you the range of outcomes and nothing more — so ask instead which outcome is the default, and what would have to change to get any of the others.
