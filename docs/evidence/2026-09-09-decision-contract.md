# The decision contract, and what rendering the pages turned up

Date: 9 September 2026
Branch: `Xiang-decision-contract`, merged to `main` in PR #12

## What I set out to do

My lane in the plan is the decision experience: the request flow, the forecast
behind it, the put-down, the Today and Compare compositions, and the
accessibility of the two sheets. Most of that was written before Thong's shell
landed, so the last piece of work was a merge rather than a feature.

## The request sheet

It used to ask you to classify the ask yourself — pick one of four kinds, then
light, medium or heavy. Watching that back, it is a question about our data
model rather than about anyone's life, and it is two taps before you learn
anything.

It now opens on a message that has already arrived and already been parsed. What
we read of it is on screen field by field, each one labelled either *read from
"cover"* or *we guessed*, and every one of them editable. Nothing has to be
typed before the forecast appears, which is what the plan's thirty-second target
actually needs.

The sample message, the figures on the landing page and the forecast all come
out of one fixture that parses its own message, so they cannot drift apart. That
started as two separate derivations that happened to agree because the demo day
is always a Wednesday — true, but nothing depended on it deliberately.

## Three things it now refuses to do

A request beyond the four weeks we can see used to price as "This fits." It does
not fit; there is no week there containing it. `priceCommitment` returns
`beyond`, and the sheet explains instead of producing a number.

Clearing the duration box on the add sheet used to write a one-hour commitment,
because `Number("")` is `0` and the old code substituted `1`. The student never
typed that hour, never saw it, and their week moved because of it. Both input
paths now go through `checkRequest` and neither coerces.

The copy button reported success unconditionally. `navigator.clipboard` is
undefined over plain HTTP and rejects in several in-app browsers, so it could
say "Copied" with an empty buffer. It awaits the write now and, on failure, says
so and selects the text.

## Correctness fixes worth recording

- A decision was recorded against `price.worst` — the heaviest week in the
  horizon rather than the week the request lands in.
- Accepting double-counted. The commitment went into the store and the same
  event was still passed to `priceCommitment` as a candidate, so the landing
  week jumped a second time the instant you said yes. The reading is now
  snapshotted at the moment of the decision.
- `sabtu depan` means *next* Saturday and was reading as *this* one. The
  normaliser translated the weekday and left the qualifier behind as a Malay
  word chrono ignores, so it arrived as "saturday depan". Asked on a Wednesday
  that is a six-day error in the one date the whole forecast is built on, and
  nothing about the answer looks wrong. Every weekday had it.
- An explicit `jumaat lepas` was being pulled forward into a Friday nobody had
  been asked about, because forward-dating applies to the whole string.

## Three defects I only found by rendering the pages

These are the ones I want on the record, because none of them were visible in
the source and all three had been shipped for days.

**The four-week forecast chart had never drawn a bar.** Each bar's height is a
percentage of its column, and `items-end` sizes a column to its content, so the
percentage resolved against an indefinite height and collapsed to zero. The
centrepiece chart of the demo was an empty frame with four week labels
underneath it. It also offered a screen reader those four labels and nothing
else; it has a spoken equivalent now.

**An open sheet was being painted over by the page behind it.** This one was
mine: the sticky decision panel I had just added to Today starts a stacking
context, so the sheet's `z-50` only ranked it against its siblings inside that
panel, and the week's own content — later in the DOM — drew straight over the
top. Both sheets are portalled to the body now, which is also where the focus
trap's `inert` walk expects to finish.

**The carry bar's track vanished** into the highlighted card on `/compare`.
Both are warm neutrals within a few percent of each other, so the band and the
marker were floating on nothing. It carries a hairline now.

The lesson I would pass on: `npm run verify` proves the code compiles and the
tests pass and says nothing at all about whether anything is visible.

## Composition

Today is four blocks placed explicitly by a grid rather than two stacked
columns. The reading and its explanation keep the wide column, everything that
can change the week sits beside it, and neither side ends in a long stretch of
nothing. The page went from 2148px to 1392px at 1440 with no content removed.

"Still ahead of you" was twenty-five chips, half of them the word Commute, with
the one that matters buried in the middle — the backlog this product exists not
to be. It is five day rows now, each named by the heaviest thing on it, with the
full run left where it belongs on `/week`.

## A release gate that runs

`npm run check:release` covers seven routes at seven widths for overflow and
44px targets, the request sheet opened and crossed and left from the keyboard
with focus asserted at every step, five run-throughs in one browser with nothing
cleared between them, and the accept, decline, undo and preview semantics read
**from localStorage rather than off the screen** — so a screen that says the
right thing over a store holding the wrong thing still fails.

It uses `puppeteer-core`, which drives an installed Chrome or Edge and downloads
no browser. It is not part of `verify` because it needs a server running.

## Integration with the shell

Verified after the merge, against the five things the plan asks Thong and me to
check together: direct loading of all six app routes, clicking through the shell
navigation, `?persona=`, state surviving ordinary navigation, `?reset=1`,
reload rehydration, and no runtime errors. All passing.

Worth knowing: the deep-link handling now lives only in `AppShell`. Today's own
copy is gone, so anything that stops mounting the shell loses `?reset=1` and
`?persona=` silently.

## Two things left for Thong

`components/app/shell/useModalDialog.ts` has no callers after the merge — its
only two consumers were the sheets, which use `lib/useFocusTrap.ts`. And
`AppShell`'s More sheet carries a third inline copy of the same focus logic,
which is the copy without `inert`, so background controls stay in the tab order
while it is open. Pointing that sheet at one shared hook would close both.

Separately, `app/(app)/layout.tsx` mounts `AppShell` but the `(app)` group has
no pages, so it is currently dead. A page moved into it while still
self-mounting the shell would render two.

## Still outstanding in my lane

A screen reader, Android TalkBack and a physical device. I have automated
everything around them and none of them can be automated.

## Tests

135, up from 74. New: `store.test.ts` (13, pinning the decision contract),
`validate.test.ts` (18), `horizon.test.ts` (10), `decisionDemo.test.ts` (10),
plus additions to the parser and forecast suites.
