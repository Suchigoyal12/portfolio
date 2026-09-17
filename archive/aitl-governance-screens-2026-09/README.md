# AITL Section 04 — previous walkthrough screens

Removed from the AI Trust Layer page on 2026-09-17, when Section 04 (AI Governance)
got five new screens. Kept here, outside public/, so they are not deployed.

To restore: move both PNGs back to `public/site/assets/aitl/`, run
`node tools/gen-image-dims.mjs`, and put these items back in the
`WALKTHROUGH · AI GOVERNANCE` carousel in `src/site/page-project-aitl.jsx`:

```js
{
  label: "04a",
  ratio: "4098 / 2931",
  src: "/site/assets/aitl/gov-settings.png",
  note: "AI Trust Layer governance — manage Autopilot usage across organization, tenants and groups, choosing org- or tenant-level policy."
},
{
  label: "04b",
  ratio: "1548 / 2931",
  src: "/site/assets/aitl/gov-deployments.png",
  note: "Manage deployments — apply a policy across tenants, users and groups, with precedence rules made legible."
}
```
