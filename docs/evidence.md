# Implementation evidence

Dated records of what was decided, built and checked. These were six separate
files under `docs/evidence/` plus `docs/ExtraInstructions.txt` until 11
September, when we folded them into one. Nothing was rewritten — only the
headings were demoted. The originals are recoverable from git history.


---

## Shared app shell implementation evidence

Date: 9 September 2026

### Decision

Keep the landing route outside the product workspace and mount one shared `AppShell` interface around each existing product page. Routes remain in their current folders, avoiding a risky route relocation during the sprint.

The shell owns navigation, active state, the mobile More sheet, safe-area placement and demo query handling. Pages supply only their content.

### Implemented

- Persistent desktop navigation for Today, Week, Recover, Asks, Compare and Method.
- Mobile bottom navigation for Today, Week, Recover, Asks and More.
- Mobile More sheet containing Compare and Method.
- Active-page text, colour and `aria-current` state.
- Skip link and labelled navigation regions.
- More-sheet focus entry, Tab containment, Escape dismissal and focus return.
- Shared handling for `?persona=nurul` and `?reset=1`.

### Checks performed

- Visually inspected Today at desktop and mobile widths.
- Opened and dismissed More with Escape; focus returned to the More trigger.
- Navigated from More to Compare and confirmed the More active state.
- Loaded every product route directly and confirmed five mobile navigation controls and the expected active destination.
- Confirmed no document-level horizontal overflow at the required mobile width.
- Confirmed the Nurul deep link changed the sample persona.
- Confirmed the reset deep link restored Aisyah's opening state.
- Ran `npm run verify`: voice gate, lint, 74 tests and production build passed.

### Remaining validation

- Inspect on a physical Android phone.
- Repeat the checks on the deployed release candidate.
- Test at 200% browser zoom with the integrated work from all three owners.

---

## Living week verification

Date: 9 September 2026  
Route: `/week`

### Implemented

- Four week panels use one shared vertical load scale.
- Every displayed day is a native button with a spoken date, committed hours and past-day status.
- The heaviest upcoming day is selected on first load.
- Selecting a day updates one shared detail panel with the commitments already present in the demo data.
- The existing collision card remains the single heavy-cluster explanation.
- Empty days and an empty horizon have explicit fallback copy.

### Local verification

- Direct-loaded `/week` in the in-app browser.
- Confirmed Friday 18 September, the heaviest upcoming day in the current Aisyah seed, opens by default.
- Selected Thursday 10 September with a pointer and confirmed its three commitments replaced the detail list.
- Selected Wednesday 9 September with the Enter key and confirmed its five commitments replaced the detail list.
- Inspected the compact layout: seven day controls remain visible in each panel and the mobile navigation remains usable.
- Ran `npm run verify`: voice gate passed, ESLint passed, all 74 Vitest tests passed and the Next.js production build completed.

### Remaining limit

This is local browser evidence only. The view has not yet been checked on a deployed URL or a physical Android device.

---

## Supporting-route consistency verification

Date: 9 September 2026  
Routes: `/recover`, `/asks`, `/method`

### Implemented

- Recover, Asks and Method now share one responsive page frame and intro hierarchy.
- Recover uses a two-panel composition when a quiet day exists and retains an honest no-room state when one does not.
- Recovery choices are native toggle buttons and announce the resulting plan without saving it.
- Asks separates totals from decision history on wider screens and stacks them on compact screens.
- Declined requests are described as hours “kept free,” not hours “handed back.”
- Method retains a comfortable reading width, exposes numbered steps visually and uses valid ordered-list structure.

### Local verification

- Checked Recover with Aisyah and Nurul for no-room variants.
- Checked Recover with Wei Jian for the quiet-day variant and selected “sleep in” using the Enter key.
- Checked the empty Ask history.
- Completed one temporary sample decline and confirmed the populated history showed 5h kept free, then reset the demo state.
- Checked Method’s heading hierarchy and ordered content in the accessibility tree.
- Inspected all three routes in the compact in-app browser layout with mobile navigation present.
- Ran `npm run verify`: voice gate passed, ESLint passed, all 74 Vitest tests passed and the Next.js production build completed.

### Remaining limit

This is local browser evidence only. The routes still need the planned release-width sweep, deployed-URL check and physical Android pass.

---

## The decision contract, and what rendering the pages turned up

Date: 9 September 2026
Branch: `Xiang-decision-contract`, merged to `main` in PR #12

### What I set out to do

My lane in the plan is the decision experience: the request flow, the forecast
behind it, the put-down, the Today and Compare compositions, and the
accessibility of the two sheets. Most of that was written before Thong's shell
landed, so the last piece of work was a merge rather than a feature.

### The request sheet

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

### Three things it now refuses to do

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

### Correctness fixes worth recording

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

### Three defects I only found by rendering the pages

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

### Composition

Today is four blocks placed explicitly by a grid rather than two stacked
columns. The reading and its explanation keep the wide column, everything that
can change the week sits beside it, and neither side ends in a long stretch of
nothing. The page went from 2148px to 1392px at 1440 with no content removed.

"Still ahead of you" was twenty-five chips, half of them the word Commute, with
the one that matters buried in the middle — the backlog this product exists not
to be. It is five day rows now, each named by the heaviest thing on it, with the
full run left where it belongs on `/week`.

### A release gate that runs

`npm run check:release` covers seven routes at seven widths for overflow and
44px targets, the request sheet opened and crossed and left from the keyboard
with focus asserted at every step, five run-throughs in one browser with nothing
cleared between them, and the accept, decline, undo and preview semantics read
**from localStorage rather than off the screen** — so a screen that says the
right thing over a store holding the wrong thing still fails.

It uses `puppeteer-core`, which drives an installed Chrome or Edge and downloads
no browser. It is not part of `verify` because it needs a server running.

### Integration with the shell

Verified after the merge, against the five things the plan asks Thong and me to
check together: direct loading of all six app routes, clicking through the shell
navigation, `?persona=`, state surviving ordinary navigation, `?reset=1`,
reload rehydration, and no runtime errors. All passing.

Worth knowing: the deep-link handling now lives only in `AppShell`. Today's own
copy is gone, so anything that stops mounting the shell loses `?reset=1` and
`?persona=` silently.

### Two things left for Thong

`components/app/shell/useModalDialog.ts` has no callers after the merge — its
only two consumers were the sheets, which use `lib/useFocusTrap.ts`. And
`AppShell`'s More sheet carries a third inline copy of the same focus logic,
which is the copy without `inert`, so background controls stay in the tab order
while it is open. Pointing that sheet at one shared hook would close both.

Separately, `app/(app)/layout.tsx` mounts `AppShell` but the `(app)` group has
no pages, so it is currently dead. A page moved into it while still
self-mounting the shell would render two.

### Still outstanding in my lane

A screen reader, Android TalkBack and a physical device. I have automated
everything around them and none of them can be automated.

### Tests

135, up from 74. New: `store.test.ts` (13, pinning the decision contract),
`validate.test.ts` (18), `horizon.test.ts` (10), `decisionDemo.test.ts` (10),
plus additions to the parser and forecast suites.

---

## Full route QA and bounded fixes

Date: 9 September 2026  
Branch: `Shuheng`

### Release matrix

- Checked `/`, `/today`, `/week`, `/recover`, `/asks`, `/compare` and `/method` at compact 360/390-equivalent, tablet 768/1024-equivalent and desktop 1440-equivalent viewports.
- All routes hydrated with the expected primary heading and showed no horizontal overflow.
- Mobile navigation appeared on app routes below the desktop breakpoint; desktop navigation appeared at 1024-equivalent and above.
- The 200%-zoom stress equivalent at a 720px layout width also remained within the viewport.
- Week day selectors are at least 45px wide and 106px tall at the compact viewport.

### Bounded fixes made

- Added shared focus entry, focus trapping, Escape dismissal and focus return to the request and add-commitment sheets.
- Made copy feedback depend on the clipboard promise and left the reply selectable when copying fails.
- Made request decisions one-time and atomic: declining records only the decision; accepting records the decision and commitment together.
- Added blocking validation for invalid or unsupported add-commitment dates, hours, categories and intensity values.
- Added an explicit put-down confirmation with a cancel path that leaves state unchanged.
- Added a spoken CarryBar text alternative using the same workload band copy.
- Enlarged the mobile Pikul home-link hit area and preserved 44px day-selector targets.

### Interaction checks

- Request sheet: focus entered the first choice, Escape returned focus to the trigger, and a double-clicked decline produced one history entry.
- Accepted request: one decision entry appeared and the accepted commitment appeared in the Week view.
- Add sheet: an invalid `-1` hour value showed an error and did not close or add an event; Tab from the last control wrapped to the first field.
- Put-down: preview appeared, cancel preserved the offer, and confirmation showed the reclaimed-hours state.
- CarryBar: accessibility tree exposed `Your week is heavier than usual. The shaded area marks your usual.`

### Automated checks

- `npm run verify` passed: voice gate, ESLint, 74 Vitest tests and the Next.js production build.

### Deployment

- QA release commit `775d516` is live at <https://pikul-codenection-2026.vercel.app>.
- The public alias returned HTTP 200 for all seven routes plus reset and persona deep links after redeployment.

### Remaining release limits

- Physical Android/mobile-data validation remains outstanding.

---

## Vercel deployment verification

Date: 9 September 2026
Production commit: `4cfb5c7`
Production branch: `main`
Production URL: <https://pikul-codenection-2026.vercel.app>

### Deployment record

- Vercel project: `pikul-codenection-2026`
- Production deployment ID: `dpl_4CQxD5AqqQz3Tdj1tCQgKQ1HGwFx`
- Generated deployment: <https://pikul-codenection-2026-qpovym11n-shu-hengs-projects-71f9b2e7.vercel.app>
- Connected Git repository: <https://github.com/shuheng0330/Pikul>
- Production branch: `main`
- Framework preset: Next.js
- Node.js: 22.x
- Environment variables: none
- Vercel cloned `main` at `4cfb5c7`, compiled successfully, generated all 12
  static outputs, and reported the production deployment ready.

The first upload used the project default of “Other” and produced no application
output. The framework was corrected to Next.js, output detection was restored,
and the QA release was deployed successfully. After the team merged its work,
the Vercel project was connected to `shuheng0330/Pikul` with `main` as the
production branch. The first Git-backed production deployment was then created
from the integrated commit.

### Public smoke check

The stable alias returned HTTP 200 for:

- `/`
- `/today`
- `/week`
- `/recover`
- `/asks`
- `/compare`
- `/method`
- `/today?reset=1`
- `/today?persona=nurul`
- `/favicon.ico`
- `/apple-icon.png`
- `/opengraph-image.png`

The public app was also opened in a fresh in-app browser surface during the
earlier QA release. The landing action reached Today, Today showed Aisyah's
default sample state, the Week navigation link worked, and the heaviest upcoming
day opened automatically. The final Git-backed deployment received HTTP 200 for
all routes, demo deep links, and brand-image assets listed above.

### Automation record

- Git repository connection: active
- Production source: pushes to `main`
- Pull-request comments: enabled
- Commit status reporting: enabled
- Stable alias: assigned to the ready `main` deployment

### Remaining checks

- Verify the alias from a signed-out physical phone using mobile data.
- Run a real screen-reader pass, including Android TalkBack where available.
- Verify external Open Graph/Twitter link previews after crawler caches refresh.

---

## Organiser guidance

Received on Discord during the kick-off, and the authority behind the
README-only rule in `docs/README_PLAN.md` §1. Kept verbatim.

> Hi, I just saw the team post the template, but does that mean we don't need a docs file and just need a GitHub README.md for the documentation part? And except for the ideation section, how about other sections like Creativity and Novelty, Feasibility, and Impact? Will these also be judged only from the README.md or from both the video and README.md?
> Nickleirsch — 12:22 AM
> Yes, you do not have to submit a docs file, everything should be in the README.md
> The other sections will be judged from both the README.md and the video
>
> You can, you are not required to use Figma, you can code and deploy your frontend prototype on Netlify/Vercel for example. You can also design it in Canva. There are no restrictions on what software you use for the design.
