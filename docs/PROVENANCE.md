# Build provenance

## Original application: evidence and gaps

Wayan recalls building the original application in Cowork around February 27, 2026, with an initial prompt developed in ChatGPT. Related February 27 research and February 28 article conversations were located during the September 29 investigation. The article conversation refers to an already existing application. Its separately generated React companion is not established as the source of the deployed HTML.

The original Cowork task, exact build prompt, February 27 ChatGPT conversation, and original deployment sequence were **not recovered**. Those gaps remain explicit. The repository contains no private chat transcripts, browser-history records, account configuration, or credentials.

The recoverable implementation is the public page at:

https://wayan.com/grant-guardian-analyzer.html

The September 29, 2026 response is preserved unchanged as `archive/2026-09-29-live.html`.

SHA-256:

```text
9c0bcdd369fa30cf40cd5d154037baf00fb44a6ffe00171c61a6468464f14c0d
```

This proves the identity of the saved September snapshot. It does not establish that the file is identical to the initial February release.

## Research context recovered on September 29

The [seven featured sources](RESEARCH-CONTEXT.md) and [ranked public-discussion inventory](PUBLIC-DISCUSSIONS.md) distinguish sources named in the February 27 research response, earlier public engagement, and later feedback. The response is AI-generated research context, not a recovered build specification.

PJMF’s [October 2024 technical article](https://medium.com/patrick-j-mcgovern-foundation/using-ai-for-data-extraction-an-exploration-of-two-techniques-4affd6681c5f) displays a November 22, 2024 response by Wayan about recreating its approach. This establishes an earlier experiment, not the date of the current application. Wayan’s [public analyzer article](https://www.linkedin.com/pulse/i-reverse-engineered-grant-guardian-ai-tool-foundations-wayan-vota-4jfse) was published March 4, 2026. Comments on that article cannot be original February build influences.

## September 2026 reconstruction

The user's instructions were to research current PJMF documentation, improve the tool, apply the supplied Intercom-inspired design system, and create a GitHub repository after the changes.

The work proceeded as follows:

1. Inspect the served HTML, reconstruct its input-to-report flow, and preserve it unchanged.
2. Compare its claims, ratio definitions, source references, and scoring behavior with current public primary sources. Record findings in `research-2026-09-29.md`.
3. Reproduce incomplete-data scoring and restriction-score monotonicity defects.
4. Separate deterministic financial logic from the interface, preserving a standalone HTML deployment through a small build script.
5. Replace the five-step blue/teal interface with the supplied Intercom-inspired design: cream, black, restrained orange brand accent, tight headings, editorial serif accent, and sharp controls. The desktop layout has a left workflow rail; the mobile layout moves navigation above the form.
6. Add editable evidence references, explicit confirmations, unknown-value handling, reconciliation checks, scenario comparisons, context notes, and local JSON save/open. Remove claims of AI extraction and generation.
7. Make the score optional, replace the faulty scoring curves with explicit bounded formulas, and remove unsupported financial-health labels. This is an intentional method change, not a recovery of PJMF's algorithm.
8. Add regression tests, inspect browser behavior and responsive rendering, and produce the standalone deployment artifact.

## How to reproduce the current build

Use the repository's versioned source, rather than trying to regenerate the application from a prompt:

```sh
npm test
npm run build
node scripts/serve.mjs --dist
```

The build uses Node's standard library and no network resources. The same source produces the same output bytes. Source comments, methods, tests, and version history codify the current implementation. The original conversation is not required to maintain it.

## Deliberate limits

- No automatic publication to wayan.com was performed.
- No private funder workflow was inspected or cloned.
- Historical source is evidence only and retains known defects.
- The design document is a style reference, not a claim of affiliation with Intercom. Font fallbacks and restrained button motion preserve readability and avoid layout disruption; reduced-motion preferences disable scaling.
- Multi-year entry, document extraction, and currency conversion were deferred to keep this release focused on trustworthy manual analysis.
