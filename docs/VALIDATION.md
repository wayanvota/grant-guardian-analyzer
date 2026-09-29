# Validation record

## Version 2.0.3 · September 29, 2026

The build, JavaScript syntax, and diff checks passed. Headless Chromium verified the exact new title and tagline, removed introductory eyebrow, navigation name, browser title, and report version locally and live. Desktop (1280px) and mobile (390px and 320px) checks found no page-level horizontal overflow; desktop and 390px screenshots were visually inspected. Live HTTPS bytes matched the build. Calculations and the saved-data format were unchanged.

## Version 2.0.2 · September 29, 2026

Naming and subtitle change only, with navigation wrapping for the longer name. The standalone build, JavaScript syntax, and diff checks passed. Headless Chromium verified the exact heading, subtitle immediately below it, browser title, navigation name, and report version locally and on the live URL. Desktop (1280px) and mobile (390px and 320px) checks found no page-level horizontal overflow; desktop and 390px screenshots were visually inspected. The public HTTPS response matched the build byte for byte. Calculation code was unchanged.

## Version 2.0.1 · September 29, 2026

- All 23 existing model tests passed. Standalone build, JavaScript syntax, and diff whitespace checks passed. Scoring arithmetic is unchanged.
- Headless Chromium checked both the production build locally and the live HTTPS page. The score remained absent by default and unavailable for unverified demo figures. Confirming the fictional figures produced 80.5 / 100, with contributions 35, 28, and 17.5. The lower-threshold scenario produced 94 / 100. Editing a confirmed input withheld the score again.
- Confirmed that the source record precedes the score and that the calculation table includes all three components. No browser page errors occurred.
- Inspected the desktop score and 390px mobile view. There was no page-level horizontal overflow; wide tables scroll within their containers.
- Generated a three-page A4 PDF and visually inspected the page containing the score. The score, all six calculation columns, and formulas were legible and stayed together. This replaces the earlier unverified-print limitation for this tested report; other report lengths and browsers were not exhaustively checked.
- Live HTTPS bytes matched the production build. See `DEPLOYMENT.md` for the hash and recovery copy.

Screenshot: [Score disclosure](screenshots/score-disclosure.png).

## Version 2.0.0 validation history

September 29, 2026. Version 2.0.0.

## Automated checks

`npm test`: **23 tests passed**. Coverage includes:

- Blank versus explicit zero, partial records, negative and invalid amounts.
- Known-answer ratios (2× current, 3 reserve months, 60% restrictions) and illustrative index (80.5).
- Required source references, confirmations, document title, and fiscal date.
- Zero denominators, nonpositive net assets, restriction ratios above 100%, and overflow.
- Monotone, bounded restriction scoring across integer thresholds 0–100 and ratios 0–1,000; current/reserve monotonicity and bounds.
- Exact weight totals, threshold limits, period length, and balance-sheet reconciliation.
- JSON round trips, incomplete valid exports, malformed/oversized imports, and untrusted text preservation as data.

`npm run build` and JavaScript syntax checks passed. The generated HTML contains all runtime code and styles; it requires no package installation or external runtime assets. The local preview serves only the source or build directory, not the archived implementation.

## Browser checks

Inspected the production build in the Codex in-app browser:

- Desktop layout at the default 1280px width and mobile layout at 390 × 844. Mobile document width matched the viewport, without page-level horizontal overflow. Comparison tables scroll within their containers.
- Fictional-data workflow, navigation to assumptions and report, and optional index toggle.
- Unverified sample data kept the index unavailable; confirming all required inputs produced the expected 80.5 result.
- Editing current assets cleared its confirmation and withheld the index again.
- An organization name containing an HTML image/event-handler string displayed literally, with no inserted image element.
- Local import of an exported-format fictional fixture populated the form and reported success.
- The save action reached its completion message. Automated download-event capture timed out, so a complete browser download-and-reimport cycle was not verified. The export/import data round trip passed the automated tests above.
- No browser console errors in the checked workflow.

Screenshot: [Desktop interface](screenshots/desktop.png).

## Limits

Print styling is implemented, but a rendered PDF and page breaks have not been visually verified. Browser coverage is limited to the in-app browser; a full screen-reader audit and separate Firefox/Safari checks were not performed. These checks establish application behavior for the tested cases, not financial validity of the illustrative index or correctness of user-entered records.

The release was subsequently published on September 29, 2026. The exact live page matched the build byte for byte, and Firefox passed the fictional-data report check. See `DEPLOYMENT.md`. PDF layout and a complete browser download-and-reimport cycle remain unverified.
