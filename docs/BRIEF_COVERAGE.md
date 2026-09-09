# What the brief asked for, and what we actually built

Ku, 9 September 2026. Checked against `docs/Problem Statements.pdf`, page 4,
Lifestyle Track: Beating the Burnout.

The delivery plan asks me to do this before submission and to record anything
we did not meet honestly. So this is not a list of things we got right. Where
we went a different way from the brief I have said so and given the reason,
and where we simply did not build something I have said that too.

## What the brief actually says

Three sentences do the work:

> Build an app that gives students a clear picture of their load across
> different areas (mental, time, physical, social, errands) and actually helps
> them do something about it before burnout hits.

> It shouldn't just track and report. Instead, it should help students
> rebalance what they're carrying and push them toward recovery, like rest or
> getting out of the house.

> Make sure it's usable, accessible, and something students would actually keep
> open on their phone.

Then four example features, which the brief introduces with "for example" and
closes with "teams are free to build any features with any tech that fits" — so
I have treated them as illustrations rather than a checklist, and said which we
took and which we deliberately did not.

## The requirements

**A clear picture of load across different areas — partly, and not on the axes
the brief names.**

We do break the week down and we do show it on the main screen. But the brief's
five areas are *mental, time, physical, social, errands*, and ours are
*coursework, work, getting there, family and friends, everything else*
(`lib/engine/areas.ts`). Those are not the same kind of category. The brief's
list mixes the kind of toll a thing takes with the kind of thing it is; ours is
purely the second.

The toll does exist in our model, but as a multiplier rather than as an axis.
Every commitment carries an intensity from one to five — the question we ask is
"how much does this take out of you?" — and that scales its hours before
anything is added up. So a two-hour group project can outweigh a four-hour
lecture. What we cannot do is answer "how much of this week was mental versus
physical", because we never separate those. We chose activity categories because
a student can classify their own week into them in about a second, and cannot
reliably split a shift into a mental and a physical portion. That is a real
deviation from the wording and it is a judgement call, not an oversight.

**Helps them do something about it before burnout hits — yes.**

This is the part I would defend hardest. Every other tool in this space is
retrospective: it shows you the damage after you have already agreed to it. The
request sheet prices a commitment *at the moment somebody asks*, against the
specific week it would land in, and shows the before figure next to the after
one. `/week` runs the same arithmetic across the four weeks ahead using
commitments already on the calendar. Nothing is predicted — it is your own
calendar put through the same maths.

**Shouldn't just track and report; should help rebalance — yes, in two places.**

Declining is supported with a drafted reply in three tones, because the hard
part of saying no was never the wording. Handing something back is a separate
action with a preview that names the hours freed and the day that actually opens
up, and it can be cancelled with nothing saved.

**Push them toward recovery — yes.**

`/recover` finds the quietest day in the next ten and asks what you would do
with it. It records nothing and checks nothing afterwards, which is the point.

**Usable, accessible, keep open on their phone — mostly, with a gap I cannot
close by myself.**

The app is responsive from 320px up, is deployed with no account, no backend and
no API key, and works offline once loaded. `npm run check:release` verifies seven
routes at seven widths for overflow and 44px touch targets, plus the keyboard
path through the request sheet.

What is not done: a real screen-reader pass, Android TalkBack, and a physical
phone on mobile data. Those cannot be automated and we should not claim them.

**Deployable — yes.** General stipulation 6 asks that the solution not rely on a
local dev environment. It is live on Vercel; the URL and the redeploy command
are in `docs/DEMO_RUNBOOK.md`.

## The example features

**Workload visualiser by category — built.** The bars on Today are weight and
the figures beside them are plain hours, and those two deliberately disagree,
with a footnote saying so.

**"You're at 90% capacity this week" — deliberately not built.**

This is the clearest place we went against the brief, so it deserves the fullest
answer. A capacity percentage needs a denominator, and nobody has established
what one hundred percent of a student is. Any number we picked would be invented
and would then be read as a grade — which is exactly the register this product
is trying to avoid, for people who already feel behind.

What we show instead is always relative to the person's own previous four weeks,
never to a target and never to another student. On the main screen it is not a
number at all, it is a marker against a shaded band, because you can read that in
half a second without being scored. The one place a percentage appears is inside
the request sheet, where "week 11 is at 128% of a usual week already, saying yes
makes it 132%" is answering a specific question at the moment it is asked. We
enforce this with a build-time check (`npm run gate`) that fails if clinical or
scoring vocabulary reaches any user-facing string.

I think this is the right call, but a judge could reasonably read it as not
following the brief, and we should be ready to make the argument rather than
hope it does not come up.

**A stress tracker to log how you're feeling over time — not built.**

This is the real gap and the one I want written down plainly. We have no
self-report anywhere in the product. Pikul infers load from commitments; it
never asks how you feel and has no idea. The optional "how did it feel?" check-in
was scoped, then deferred to keep the decision flow finished properly, and that
was a scope decision rather than a judgement that it is a bad feature — it is the
obvious next thing to build, and it is what would let the intensity weights
become personal rather than fixed.

**The one thing we must not do in the README, the slides or the video is
describe the workload heuristic as stress tracking.** It is not. It measures
committed hours weighted by a fixed dial we chose. If someone asks whether Pikul
tracks stress, the answer is no, it tracks load, and here is the difference.

**A load balancer that groups tasks and pushes back lower-priority ones —
partly.**

We suggest exactly one thing worth putting down, and only ever a shift, a social
plan, a club commitment or an errand — classes, coursework, commuting and family
are never offered, because they are not the student's to negotiate away. If the
best candidate would free less than three hours we say nothing at all, since
handing back ninety minutes of errands is busywork dressed up as advice.

What we do not do is group tasks or reschedule them. The brief's phrasing implies
moving work around; ours only supports handing one thing back. Being able to say
"move this study session instead of dropping the shift" is a genuine next step
and it is not in this build.

**Recovery nudge — built**, as described above.

## Where we stand, honestly

The strongest claim we can make is the one about timing: this helps at the
moment of the decision rather than afterwards, and it measures a person against
themselves rather than against a norm. `/compare` demonstrates that in about
fifteen seconds — the student carrying thirty-one fewer hours is the one in
trouble.

The weakest points, in the order I would expect them to be challenged:

1. No self-report, so we cannot claim to know how anyone feels.
2. The intensity dial is ours. Nobody has established that a draining hour
   weighs exactly 1.7 ordinary ones, and we do not pretend otherwise.
3. The method is borrowed from sports science and has never been tested on
   coursework, shifts or family duty. That is our design decision and it is
   unvalidated.
4. The method is argued about within its own field, including whether comparing
   a recent window against a longer one that contains it is sound at all.
5. Areas are activity-shaped, not the five the brief names.
6. Accessibility is verified by tooling; the human passes are outstanding.

Points 2, 3 and 4 are already written into `/method` in the product itself,
which I would rather a judge found there than in a README appendix.
