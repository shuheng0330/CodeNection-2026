# Pikul demo runbook

## Public deployment

- Production: <https://pikul-codenection-2026.vercel.app>
- Vercel project: `pikul-codenection-2026`
- Production branch: `main`
- Frozen source for the submission: `8080a629` (11 Sep, 14:39 UTC)
- Production tracks `main`; the doc-only commits merged since the freeze do
  not change the app
- Connected repository: <https://github.com/shuheng0330/Pikul>

The app needs no account, backend, API key, or environment variable.

## Useful links

- Fresh Aisyah demo: <https://pikul-codenection-2026.vercel.app/today?reset=1>
- Aisyah: <https://pikul-codenection-2026.vercel.app/today?persona=aisyah>
- Wei Jian: <https://pikul-codenection-2026.vercel.app/today?persona=weijian>
- Nurul: <https://pikul-codenection-2026.vercel.app/today?persona=nurul>
- Four-week view: <https://pikul-codenection-2026.vercel.app/week>
- Personal-baseline comparison: <https://pikul-codenection-2026.vercel.app/compare>
- Method and limitations: <https://pikul-codenection-2026.vercel.app/method>

`?reset=1` clears locally saved demo changes before loading the default persona. Ordinary navigation does not reset the demo.

## Short operator path

1. Open the fresh Aisyah demo link.
2. Read the personal-baseline statement and the single thing worth putting down.
3. Open **Someone's asking me for something**.
4. Choose a request and weight, then show what saying yes costs.
5. Record a decline and open **Asks** to show the hours kept free.
6. Open **Week**, select the heavy cluster, and inspect another day.
7. Use **Reset demo** before the next rehearsal.

## Repeatable deployment

Vercel is connected to GitHub with `main` as the production branch. Normal
production releases use the reviewed Git workflow:

```powershell
git switch main
git pull origin main
# Merge a reviewed feature branch or pull request, then:
git push origin main
```

Run `npm run verify` before merging. A push to another branch creates a preview;
only `main` updates production. After deployment, confirm the source commit in
Vercel, check every route from a signed-out browser, and repeat the short
operator path. The Vercel CLI remains an emergency fallback, not the normal
release path.
