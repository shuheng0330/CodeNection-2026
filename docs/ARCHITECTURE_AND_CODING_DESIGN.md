# Architecture and coding design

## Product architecture

Pikul is a Next.js App Router frontend. Route components share decision surfaces that call a deterministic message parser and pure workload engine. Zustand stores generated-demo and user-decision state in browser `localStorage`; the prototype makes no runtime network call for application data.

## README publication design

The root `README.md` is the public evidence surface. It embeds visual assets from `docs/readme-assets/` using repository-relative paths, so GitHub renders them inline. `docs/` may retain source drafts and evidence records, but no scoring claim depends on opening them.

`scripts/capture-readme-assets.mjs` captures eight README evidence images from `PIKUL_URL` (defaulting to the public prototype) with a locally installed Chrome or Edge. It is intentionally repeatable so a later frozen build can replace the exact same assets.
