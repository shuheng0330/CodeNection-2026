# README sections — Ku's draft

For Thong to integrate. Per `docs/README_PLAN.md` I lead four sections — §2
solution and core loop, §5 what makes Pikul different, §6 architecture and
feasibility, §7 method and limitations — and supply the interaction captions
for §4 and the setup lines in §9. Lim's problem/audience/design sections and
Thong's ideation/evidence/roadmap sections slot around these.

Everything below is checked against `main` at the time of writing. Every figure
comes out of the engine rather than being typed in by hand; where a number
appears I have said which function produces it, so it can be re-derived instead
of trusted.

**Two things still need a human before this ships.** The test count and the
commit here must be re-taken from the frozen build on Friday evening — they
have moved three times this week and a stale count is on the plan's guardrail
list. And the accessibility paragraph in **What it cannot do** must match
whatever manual testing has actually been completed by then, not what we
intended to run.

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

### The same Wednesday, with and without Pikul

Every figure below is what the deployed build produces on the demo date. None
of it is illustrative.

Aisyah is a student with a part-time café job. It is **Wednesday 9 September**,
and at 3pm a message arrives: *"can you cover next friday 3pm-11pm? kelly
called in sick"*.

**Without Pikul,** the question she can answer is "am I free on Friday the
18th?" Her calendar says yes — the shift is in the evening and nothing else is
booked in that slot. So she says yes, the way she has said yes to the last
four. She finds out what it cost her in the middle of the following week, by
which time the reply cannot be taken back and the assignment is already late.

**With Pikul,** the same message is read in place. It parses to *Cover Kelly's
shift, Friday 18 September, 8 hours*, the kind of thing that takes a lot out of
her — and every one of those four fields is labelled with where it came from and
can be corrected before anything is priced. One tap and she sees the week the
shift would land in:

> **Week 11 is already at 128% of a usual week for you. Saying yes makes it 132%.**

That sentence is the whole product. It is not "you are at 90% capacity", which
would need a denominator nobody has established. It is Aisyah against Aisyah's
own previous four weeks, and it comes with the *before* figure as well as the
after — because 132% sounds severe until you know the week was at 128% before
anyone asked, at which point the honest reading is that **this request is not
what made the week hard**. Pikul says so rather than letting the number imply
otherwise.

Now she has three answers instead of one, and none of them is a guess:

- **Say yes** knowing the price. The shift goes on her week and the decision is
  recorded, once, together.
- **Say no** with a reply already drafted in three tones to copy. The hard part
  of saying no was never the wording.
- **Make room first** — hand back the café shift she already has on Saturday,
  which frees about 9 hours and genuinely clears that day, previewed before
  anything is saved and cancellable with nothing left behind.

The change is not that Pikul decided for her. It is that the decision moved
from *after* the consequence to *before* it, with the arithmetic visible on the
way past.

## What makes it different

### The idea

Almost everything built for an overloaded student answers one of two
questions. *When is it?* — that is a calendar. *What is still outstanding?* —
that is a to-do list. Both are inventories. Both are answered by adding
another row, and neither one gets harder to answer as your week fills up.

Pikul answers a third question, and it only ever comes up at one moment:
**somebody is asking you for something right now — what will saying yes
actually cost you?**

Two ideas make that answerable, and it is the combination that is ours rather
than either half:

**A baseline that is yours.** Every figure Pikul shows compares you against
your own previous four weeks. Not against a target, not against a
recommended weekly maximum, not against another student. This matters more
than it sounds: a 53-hour week wrecks one student and is an ordinary Tuesday
for another, so any fixed threshold is wrong for nearly everybody it is
applied to. `/compare` exists to prove exactly this, and it is the fastest
argument in the product — two real generated students, and **the one carrying
31 fewer hours is the one in trouble**, because 53 hours against a 35-hour
normal is a bigger jump than 84 against a 64-hour one.

**Priced at the decision, not after it.** The measurement is attached to the
moment somebody asks. Pikul reads the message that arrived, prices it against
the specific week it would land in, and shows the before figure beside the
after one — while the answer is still yours to give.

Neither half is unprecedented on its own. Load ratios come from athlete
monitoring and we say so, at length, in the method. Message parsing is
ordinary. Putting them together so that the arithmetic runs *inside the
decision* — that is the part we have not seen anywhere else, and it is the
whole product.

### Three things it does that we have not seen elsewhere

**1. The price argues against itself.**

Every other tool that shows you a cost is trying to change your answer. Pikul
shows the before figure next to the after one specifically so the number
cannot mislead you:

> Week 11 is already at 128% of a usual week. Saying yes makes it 132%.

Four points. The honest reading is *this request is not what made your week
hard* — and Pikul says so rather than letting a scary-looking 132% imply the
opposite. A product that will talk you *out* of blaming the thing in front of
you is unusual, and it is the reason the figure can be trusted the next time
it is large.

**2. A recommender that refuses to recommend.**

The hand-back suggestion will never offer your classes, your coursework, your
commute or your family. Those are things you owe, not things you chose, and
telling a Malaysian student to skip a cousin's wedding is not advice, it is a
bug. Only shifts, social plans, club commitments and errands are ever on the
table.

And if the best available candidate would free less than three hours, Pikul
says nothing at all — it explains why the week is heavy instead. Handing back
ninety minutes of errands is busywork dressed up as advice, and a tool that
always has a suggestion ready is a tool whose suggestions mean nothing.

There is a second-order decision inside this one worth stating, because it
looks wrong until you check it. Candidates are ranked by **hours off your
week**, not by how far they move the ratio — even though moving the ratio
looks like the smarter measure. Dropping a commitment shrinks the baseline as
well as the week, so ranking by ratio floats a two-hour badminton game above a
nine-hour shift purely for falling nearer the measuring date, and dropping the
only social evening in a heavy week can push the ratio *up*. Hours are the
honest unit and the one the student actually feels.

**3. The build fails if the writing gets clinical.**

`npm run gate` scans every user-facing string and fails the build if clinical
or scoring vocabulary reaches something a student could read — the engine's
own vocabulary included. It is not a linter we added for tidiness. Pikul's
entire thesis is *show the arithmetic to a judge, never to the user*, and with
three people writing interface copy in parallel that promise survives about a
day on discipline alone. Making it a build step is how a tone becomes a
guarantee instead of an intention.

Three smaller ones, all in the build: the request sheet opens on a message
that has **already been parsed**, with every field labelled *read from "cover"*
or *we guessed* and all of them editable, so nothing has to be typed before you
see a price. The parser handles Malay and English in the same sentence,
including the difference between *sabtu ni* and *sabtu depan*. And the date
picker marks the days that already carry something, so choosing when to put a
new commitment is not done blind.

### Against what students actually use

Compared only on things Pikul can demonstrate in the build.

| | Google Calendar | Todoist | Reclaim.ai | Daylio | **Pikul** |
|---|---|---|---|---|---|
| What it is for | when things are | what is outstanding | arranging your time for you | how you felt | what a new yes will cost |
| Measures against your own past | no | no | no | mood over time | **yes — your last 4 weeks** |
| Weighs effort, not just hours | no | no | priority levels | no | **yes — a 1–5 dial** |
| Prices a *specific* new request before you answer | no | no | no | no | **yes** |
| Helps you say no | no | no | no | no | **yes — a drafted reply** |
| Suggests what to put down, with protections | no | no | reschedules automatically | no | **yes** |
| Works with no account and no connected calendar | no | no | no | yes | **yes** |

The honest reading of that table: **Reclaim.ai is the closest thing to us and
it is solving a different problem.** It auto-schedules tasks, habits and
breaks around what is already on your Google or Outlook calendar and reshuffles
when conflicts appear — it makes the work *fit*. It assumes the work is fixed
and the calendar is negotiable. Pikul assumes the opposite: the hours in a week
are fixed, the commitments are what you can still change, and the useful moment
is the one before you agree to another.

Daylio is the closest on privacy and on caring how a week felt — it keeps
everything on the device, as we do — but it is a record of what already
happened. It asks how yesterday went. Pikul asks what tomorrow will cost.

Neither of them, and no calendar or task list, will answer *"if I say yes to
this, what happens?"*

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

```mermaid
flowchart TD
    routes["<b>Routes</b> · app/<br/>today · week · compare · recover · asks · method"]
    surfaces["<b>Decision surfaces</b> · components/app/<br/>request sheet · add sheet · carry bar · areas · put-down"]
    parser["<b>Parser</b> · lib/parse/<br/>deterministic and offline · Malay + English<br/>message → date, category, hours"]
    engine["<b>Load engine</b> · lib/engine/<br/>pure functions, no React<br/>hours × intensity → EWMA 7 vs 28 → ratio → band"]
    store["<b>Store</b> · lib/store.ts<br/>zustand → localStorage<br/><i>no server, no account, never leaves the device</i>"]

    routes --> surfaces
    surfaces <== "1 · read it" ==> parser
    surfaces <== "2 · price it" ==> engine
    surfaces == "3 · only on a decision" ==> store
    store == "your existing week" ==> engine
```

*Described in words, for anyone reading this without the diagram:* a request
message goes from the decision surfaces to the parser and comes back as a draft
with every field marked as read or guessed **(1)**. That draft plus the week
already in the store goes to the load engine and comes back as a before
percentage, an after percentage and a verdict **(2)**. Only an actual decision
— accept, decline or hand back — writes anything, and it writes the commitment
and the decision together, once **(3)**.

Two properties of that picture are the point of it. **No arrow leaves the
device.** And the engine has no path to the interface except through a return
value, which is what lets 158 tests exercise the arithmetic with no browser in
sight.

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
and no knowledge of the screen. That is what makes 158 tests possible and it is
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

## Built, next, and not promised

The line between these three is the one we would most like a judge to hold us
to, because every column below is a claim of a different kind.

| Built and demonstrable today | Next, and what would have to be true first | Later, and deliberately not promised |
|---|---|---|
| Seven routes, working end to end with no account | **The "how did it feel?" check-in.** Scoped, then cut to finish the decision flow properly. It is the obvious next thing and the only way the intensity dial stops being ours and starts being yours. | Multi-device sync, which needs accounts, a backend and a privacy position we have not earned |
| A request priced against the specific week it lands in, before you answer | **Import a real timetable.** Everything today runs on generated weeks. Until a student's own semester goes in, the baseline is a demonstration rather than a measurement. | Notifications or anything that pings you — a tool for overloaded people should not add to the pile |
| Accept, decline with a drafted reply, or hand one thing back — all reversible | **Move a commitment instead of dropping it.** The brief's load balancer implies rescheduling; we only support handing back. | Predicting how you will feel. We total commitments; that is not the same thing and we will not blur it |
| Malay and English parsing, offline, deterministic | **Intensity learned per person** rather than a fixed five-point dial, which is what the check-in would unlock | Any clinical or diagnostic claim, at any point |
| Four-week horizon, put-down chooser, recovery prompt | **A campus pilot** — the smallest test that would tell us whether the ratio means anything for coursework | A marketplace, a social feed, or anything that turns a private week into a comparison with other people |

## What it cost to build, and what we chose not to do

Three final-year students, one week, alongside coursework — the repository's
first commit is 6 September and the deadline is the 13th. Nobody was full-time
on this.

That budget is the reason for the biggest technical decision in the project:
**no backend.** A week is not enough to build authentication, a database, a
hosting pipeline and calendar integrations *and* have any of them work under a
judge's hands. It is enough to build one thing that works completely. So we
spent the week on the decision flow and the arithmetic underneath it, and let
the absence of a server become a feature we can defend on its own terms —
nothing to breach, nothing to leak, nothing to pay for, and a student's week
that never leaves their phone.

What that costs us is stated plainly rather than hidden: your data does not
follow you to another device, and clearing your browser clears your history.
Those are real limitations of this build, not oversights, and the first column
of the table above is honest about which is which.

The three of us split by surface rather than by layer — decisions, landing,
and shell/navigation — with file ownership agreed up front, because three
people editing the same components for a week is how a hackathon repository
dies on the Friday. Where two lanes did build the same thing, the merge is
documented in `PROJECT_STATUS.md` with which version survived and why.

## Running it

Node 22. No environment variables and nothing to configure.

    npm install
    npm run dev          # http://localhost:3000

To check it the way we do before a release:

    npm run verify       # voice gate, lint, 158 tests, production build

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
