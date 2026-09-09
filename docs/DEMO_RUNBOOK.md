# Pikul demo runbook

## Public deployment

- Production: <https://pikul-codenection-2026.vercel.app>
- Vercel project: `pikul-codenection-2026`
- First verified release commit: `5124274`

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

From the project root, with Vercel authentication available:

```powershell
npx --yes vercel@latest deploy --prod --yes --project pikul-codenection-2026 --logs
```

Run `npm run verify` before deploying. After deployment, check every route from a signed-out browser and repeat the short operator path. Connect automatic Git deployments only after the team merges the release candidate to its agreed production branch; connecting it now could replace this branch's preview with the older `main` branch.
