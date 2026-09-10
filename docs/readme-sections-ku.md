# README sections — Ku's draft

For Thong to integrate. My assigned sections are product flow, method,
limitations, architecture, setup and dependencies. Lim's problem/audience/design
sections and Thong's ideation/evidence/roadmap sections slot around these.

Everything below is checked against the code as merged in PR #16, and the
citations in **The method** are now confirmed against PubMed rather than named
from memory. One thing still needs a human: the accessibility sentence in
**What it cannot do** must stay accurate to whatever manual testing we have
actually completed by the time this ships.

---

## How it works, in the order you would meet it

Open the app and the first thing Pikul does is tell you where you stand in one
sentence — *this week's heavier than usual for you* — with a marker sitting
against a shaded band that means "your usual". There is no score and no
percentage, because you can read a marker in half a second and a number invites
you to argue with it.

Underneath, the week is broken into five areas so you can see which part is
actually heavy. The bars are weight and the figures beside them are plain hours,
and those two disagree on purpose: an eight-hour shift and eight hours of
lectures are not the same week. Beside that sits the one thing worth putting
down, and the request button.

Then somebody asks you for something. That is the moment the whole product
exists for.

The request sheet opens on a message that has already arrived — *"can you cover
next friday 3pm-11pm? kelly called in sick"* — and has already been read.
Underneath it is what we made of that message: what it is, when, how long, and
how much it takes out of you, with each field labelled either *read from
"cover"* or *we guessed*. All of it is editable, and the price follows the boxes
rather than our guess. Nothing has to be typed.

One tap gives you the cost, against the specific week the request would land in:
*week 11 is at 128% of a usual week already. Saying yes makes it 132%.* You get
the before figure as well as the after, because 132% sounds severe until you know
the week was already at 128% before anyone asked, at which point the honest
reading is that this request is not what made the week hard.

Then you answer. Saying no gives you a drafted reply in three tones to copy —
the hard part of saying no was never the wording, it was knowing you were
allowed to. Saying yes puts the commitment on your week and records the decision
together, once. Both answers are kept, and `/asks` shows the hours you took on
next to the hours you kept free, with a line making clear it is a record and not
a report card. A tool that only ever congratulates you for declining is just
another voice telling a people-pleaser what to do.

Handing something back is a separate action, and it previews before it commits:
the hours it frees, the day that would actually open up, and — the line we were
tempted to leave out — that it will not change this week's reading, because that
week has already happened. What changes is what is still ahead of you.

`/week` puts the same arithmetic across the four weeks in front of you, so you
can see the heavy one before you are in it. `/recover` finds the quietest day you
have coming and asks what you would do with it, then records nothing and never
checks. `/compare` is the argument in fifteen seconds: two students, and the one
carrying thirty-one fewer hours is the one in trouble.

## The method

The engine is one idea borrowed from sports science and one arithmetic trick,
and it is small enough to read in full in `lib/engine/acwr.ts`.

**Everything becomes one number.** A commitment's load is its hours multiplied by
how much it takes out of you, on a one-to-five dial that maps to `0.6, 0.85,
1.0, 1.3, 1.7`. This is session-RPE — duration times intensity — which is a
published and widely used way of making unlike activities comparable. It is why
a two-hour group meeting can outweigh a four-hour lecture, and why a shift, an
assignment and a weekend at home can be compared at all.

**Your recent self against your settled self.** Daily loads are totalled across
84 days, then run through two exponentially weighted moving averages over the
same series: a fast one with the smoothing factor for a 7-day window, and a slow
one with the factor for 28 days, using the standard `λ = 2 / (N + 1)`. The fast
average divided by the slow one is the only figure the app cares about. Above one
means this stretch is heavier than you usually carry. Weighted averages rather
than flat rolling means, because a flat mean lets a hard Tuesday drop out of the
window and vanish, and real load decays rather than falling off a cliff.

**The bands are deliberately wide.** Below 0.8 is lighter than usual, up to 1.1
is about usual, then 1.3, then 1.5. Note where the first edge sits: a perfectly
steady life computes to exactly 1.0, so 1.0 has to land inside "about your
usual". Telling someone whose weeks have not changed that they are carrying more
than usual would be a lie the first time they opened the app. With no history at
all the ratio is reported as a neutral 1.0 — a cold start is "we don't know you
yet", not "you have no load".

**Nothing is predicted.** The weeks ahead use the identical function over
commitments already in the calendar. It is not a forecast of how you will feel.
It is what you have already agreed to, added up.

**Where it comes from, and who argues with it.** Session-RPE — duration times
intensity — is Foster's, set out in the overtraining-monitoring paper and then
validated as a method against heart rate. The acute-to-chronic ratio is the
tool athlete monitoring built on top of it, and Gabbett's 2016 paper is the one
that made it widely used; his suggested band, 0.8 to 1.3, is where our own first
two edges come from, which is not a coincidence and we would rather say so.

It is also genuinely contested in its own field. Lolli and colleagues showed
that the conventional calculation is mathematically coupled — the recent window
is part of the longer window it is divided by — which can manufacture
correlations that are not really there. Impellizzeri and colleagues went further
and questioned the idea itself, including whether the choice of 7 and 28 days has
any physiological justification. Both objections apply to us. We think this is
still the most honest simple signal available for a student's week, and we would
much rather a reader met the objection here than found it afterwards.

- Foster C. Monitoring training in athletes with reference to overtraining
  syndrome. *Med Sci Sports Exerc.* 1998;30(7):1164–8.
- Foster C, Florhaug JA, Franklin J, et al. A new approach to monitoring exercise
  training. *J Strength Cond Res.* 2001;15(1):109–15.
- Gabbett TJ. The training-injury prevention paradox: should athletes be training
  smarter and harder? *Br J Sports Med.* 2016;50(5):273–80.
- Lolli L, Batterham AM, Hawkins R, et al. Mathematical coupling causes spurious
  correlation within the conventional acute-to-chronic workload ratio
  calculations. *Br J Sports Med.* 2019;53(15):921–2.
- Impellizzeri FM, Tenan MS, Kempton T, Novak A, Coutts AJ. Acute:chronic
  workload ratio: conceptual issues and fundamental pitfalls. *Int J Sports
  Physiol Perform.* 2020;15(6):907–13.

## What it cannot do

This matters more to us than the feature list, and the same limitations are
written into `/method` inside the product rather than hidden in a README.

It is a way of noticing a change in your own pattern. It is not a diagnosis and
not a medical opinion, and it cannot tell you whether you are unwell.

**It does not track stress.** There is no self-report anywhere in Pikul. It never
asks how you feel and has no idea. It measures committed hours weighted by a dial
we chose, and calling that stress tracking would be a claim we cannot support.

The one-to-five dial is ours. Nobody has established that a draining hour weighs
exactly 1.7 ordinary ones.

The method has never been tested on coursework, shifts or family duty. Applying
an athlete-monitoring model to a student's life is our design decision and it is
unvalidated.

It only knows what it has been told. A month of history has to exist before the
comparison means much, which is why the demo ships with generated personas.

Commitments carry a date and a duration, not clock times, so Pikul will never
tell you that Thursday 3pm is free. It talks about days, not slots.

Accessibility is verified by tooling — seven routes at seven widths for overflow
and 44px targets, plus a keyboard path through the request sheet, all in
`npm run check:release`. A screen-reader pass, Android TalkBack and a physical
device are outstanding and we are not claiming them.

## Architecture

A single Next.js App Router frontend. No backend, no database, no account, no
API key, and no network call at runtime — verified, not asserted: there is no
`fetch`, no SDK and no `process.env` reference anywhere in `app/`, `components/`
or `lib/`. Your week lives in your own browser and nowhere else.

    app/                    seven routes: /, /today, /week, /compare,
                            /recover, /asks, /method
    components/app/shell/   navigation, the page frame, demo deep-links
    components/app/         the decision surfaces — request sheet, add sheet,
                            carry bar, area breakdown, put-down
    components/landing/     the hero
    lib/engine/             the maths. Pure functions, no React, fully tested
    lib/parse/              message to draft commitment. Deterministic, offline
    lib/seed/              generated personas and the shared demo fixture
    lib/copy.ts             every user-facing string in the app
    scripts/                the voice gate and the release check

Three decisions worth explaining:

**The engine is pure and separately tested.** `lib/engine` has no React import
and no knowledge of the screen. That is what makes 145 tests possible and it is
why the maths can be argued with independently of the interface.

**Every user-facing string lives in one file.** Not for translation — for
register. The engine thinks in acute-to-chronic ratios and the user must never
meet that vocabulary. `npm run gate` fails the build if clinical or scoring
words reach a string a user could read, which is the only thing that keeps the
voice intact with three people writing UI in parallel.

**Parsing is deterministic, not a model.** Pattern matching and a date library,
running offline and instantly, with no API key to leak and no chance of
generating something unhinged in front of a judge. It handles Malay and English,
including the difference between *sabtu ni* and *sabtu depan*. Because the whole
parser is one function, a language model could replace that step alone later
without touching how load is calculated — which is the sensible division of
labour: language understanding where it helps, deterministic arithmetic where
consistency matters.

## Running it

Node 22. No environment variables and nothing to configure.

    npm install
    npm run dev          # http://localhost:3000

To check it the way we do before a release:

    npm run verify       # voice gate, lint, 145 tests, production build

    npm run build && npm start
    npm run check:release   # in a second terminal

`check:release` drives an installed Chrome or Edge and downloads no browser; set
`PIKUL_CHROME` if yours is somewhere unusual. It checks seven routes at seven
widths for horizontal overflow and 44px touch targets, walks the request sheet
from the keyboard, runs the demo five times with nothing cleared between runs,
and reads the decision and preview outcomes out of localStorage rather than off
the screen — so a screen that says the right thing over a store holding the
wrong thing still fails.

Useful demo links: `/today?reset=1` for a clean start, and
`/today?persona=nurul` or `?persona=weijian` to switch student. Full operator
path in `docs/DEMO_RUNBOOK.md`.

## Dependencies

Nine runtime packages, all of them load-bearing.

| | |
|---|---|
| `next`, `react`, `react-dom` | App Router frontend, statically rendered |
| `zustand` | client state, persisted to localStorage |
| `date-fns` | every date operation; no hand-rolled arithmetic |
| `chrono-node` | natural-language dates in the message parser |
| `motion` | the transitions, all of which respect reduced motion |
| `d3-shape` | the curve on the landing hero |
| `lucide-react` | navigation icons |

Development adds TypeScript, ESLint, Tailwind CSS 4, Vitest, and
`puppeteer-core` for the release check. `puppeteer-core` deliberately rather than
`puppeteer`: it drives a browser you already have and downloads nothing.
