# Vercel deployment verification

Date: 9 September 2026
Production commit: `4cfb5c7`
Production branch: `main`
Production URL: <https://pikul-codenection-2026.vercel.app>

## Deployment record

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

## Public smoke check

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

## Automation record

- Git repository connection: active
- Production source: pushes to `main`
- Pull-request comments: enabled
- Commit status reporting: enabled
- Stable alias: assigned to the ready `main` deployment

## Remaining checks

- Verify the alias from a signed-out physical phone using mobile data.
- Run a real screen-reader pass, including Android TalkBack where available.
- Verify external Open Graph/Twitter link previews after crawler caches refresh.
