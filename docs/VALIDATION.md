# Validation record

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

The public wayan.com page was not updated. Before publication, review a printed report and a saved file in the intended production browser.
