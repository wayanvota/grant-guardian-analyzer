# Grant Guardian Analyzer

An independent financial ratio explorer for nonprofits, built by Wayan Vota. Enter figures with source references, compare explicit assumptions, and prepare questions for a conversation with a funder.

This repository preserves the publicly served February-era implementation and documents the September 2026 reconstruction, accuracy fixes, and Intercom-inspired redesign. It does **not** claim to recover the missing original Cowork conversation or reproduce PJMF's proprietary assessment.

Published September 29, 2026: [Open Grant Guardian](https://wayan.com/grant-guardian-analyzer.html). See the [deployment record](docs/DEPLOYMENT.md) for verification.

## Run it

Requires Node.js 20 or later. No dependency installation, API key, account, or backend is needed.

```sh
npm test
npm run build
npm start
```

Open `http://127.0.0.1:4173`. The development server serves `src/` and binds only to the local computer.

To inspect the production build:

```sh
node scripts/serve.mjs --dist
```

The build produces **`dist/grant-guardian-analyzer.html`**, a standalone HTML file with its styles and application code included. This retains the original deployment shape and filename. It can be opened directly in a modern browser or uploaded to a static host after review. Building or pushing this repository does not update [the existing public website](https://wayan.com/grant-guardian-analyzer.html).

## What changed in v2

- Intercom-inspired cream canvas, black typography, orange brand accent, sharp controls, and responsive layouts. System fonts are used unless the named design fonts are already installed; no font assets are downloaded.
- Raw ratios and evidence status come first. The optional illustrative index has no risk grade or automatic funding recommendation.
- Unknown amounts remain unknown. Zero denominators, nonpositive net assets, invalid settings, and inconsistent totals have explicit explanations.
- Each amount has an editable reference and a user confirmation. Editing values or references clears confirmation. Changes to document, period, currency, or source guidance clear all confirmations.
- Corrected 2025 Form 990 guidance. Unsupported revenue-source mappings were removed, along with the unused organization-type control. Currency is explicitly a label, without conversion.
- Side-by-side scenarios, period-length adjustment, organization context, printable reports, and local JSON export/import.
- Bounded, monotone index formulas and strict weights. Source-derived facts are distinguished from simulator assumptions.

## Privacy and scope

All application calculations run in the browser. There are no API calls, document uploads, analytics, local-storage writes, or AI model calls. Refreshing clears unsaved work. Exported JSON contains the entered figures and notes, so store and share it deliberately. Visiting the reference links opens external websites under their own policies; a web host also receives ordinary page requests.

The tool accepts manual figures for one reporting period. It cannot verify a document, establish the correctness of a user's confirmation, identify a foundation's private settings, or make a grant decision. Multi-year comparison, automated document extraction, and currency conversion remain future work.

## Repository guide

| File | Purpose |
| --- | --- |
| `src/index.html`, `src/style.css` | Interface and responsive/print presentation |
| `src/model.js` | Definitions, validation, calculations, JSON format |
| `src/app.js` | Form workflow, safe report rendering, local save/open |
| `test/model.test.js` | Regression and boundary tests |
| `scripts/build.mjs` | Reproducible single-file production build |
| [Methods](docs/METHODS.md) | Formulas, assumptions, evidence requirements |
| [Build provenance](docs/PROVENANCE.md) | What survives, what remains unknown, how v2 was built |
| [Research](docs/research-2026-09-29.md) | Source review and prioritized recommendations |
| [Validation](docs/VALIDATION.md) | Checks performed and their limits |
| [Change history](CHANGELOG.md) | Changes from the archived baseline |

`archive/2026-09-29-live.html` is a historical snapshot with known accuracy and input-handling defects. It is excluded from the build and preview server. Do not deploy it as the current version.

## Research and public discussion

The [seven featured sources](docs/RESEARCH-CONTEXT.md) explain the documented research context, including which sources appear in the recovered February research and which were discovered later. The [ranked inventory](docs/PUBLIC-DISCUSSIONS.md) records 53 public pages, posts and comments with dates, a scoring rubric, evidence limits and links. It includes the five comments publicly visible on the original LinkedIn article; additional comments could not be checked.

[Later feedback and update priorities](docs/RESEARCH-CONTEXT.md#what-later-information-justifies-changing) favor better accounting context, evidence for scenario settings and nonprofit user testing. They do not establish a new PJMF scoring formula. These are documented recommendations, not additional application changes.

## Sources and independence

[PJMF's public documentation](https://www.mcgovern.org/our-work/data-solutions/grant-guardian/) names three example indicators and configurable thresholds and weights. [PJMF's product-development account](https://medium.com/patrick-j-mcgovern-foundation/social-responsibility-comes-first-product-development-lessons-from-grant-guardian-3c5fe6916019) describes source review and editing. Financial reference guidance was checked against the [2025 IRS Form 990](https://www.irs.gov/pub/irs-pdf/f990.pdf) on September 29, 2026; that IRS URL can subsequently serve a newer edition.

This project is not affiliated with, endorsed by, or an implementation of the Patrick J. McGovern Foundation's Grant Guardian. No open-source license has been selected for this repository.
