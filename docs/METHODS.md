# Definitions, assumptions, and evidence

Reviewed September 29, 2026. These are this application's methods, not a specification of PJMF's proprietary system.

## Ratios

| Indicator | Formula | Interpretation limit |
| --- | --- | --- |
| Current ratio | Current assets / current liabilities | Undefined for zero liabilities. Depends on timing and asset collectibility. |
| Reserve coverage | (Unrestricted cash + available liquid investments) / (period expenses / period months) | Expenses must be positive; period must be greater than 0 and at most 24 months. No future cash-flow projection. Avoid double-counting cash and investments. |
| Donor-restricted net assets | Restricted net assets / (total assets − total liabilities) × 100 | Requires positive total net assets and nonnegative restricted net assets. Above 100% can be meaningful when unrestricted net assets are negative. |

Each ratio can be shown with incomplete overall data when its own inputs permit calculation. Unconfirmed ratios are labeled unverified. Data inconsistencies prevent threshold judgments and any index, while entered figures remain visible for correction.

Source verification is a user assertion. It requires a value, a nonempty field reference, and a checked confirmation for each material input, plus document title and fiscal date. This application cannot inspect the document. Missing or invalid inputs never receive substitute component scores. Explicit zero values follow the same confirmation requirement.

Checks include current assets against total assets, current liabilities against total liabilities, available cash and investments against assets, and assets minus liabilities against the sum of both net-asset categories when both are entered. Reconciliation tolerance is one unit of the selected currency. All amounts must be entered in full currency units, not a mix of units and thousands. Revenue is optional period context; expenses above revenue produce a question, not a risk grade.

## Scenario defaults

| Scenario | Minimum current ratio | Minimum reserve months | Maximum restrictions | Weights: current / reserves / restrictions |
| --- | --- | --- | --- | --- |
| Reference | 1.0 | 3 | 60% | 35 / 40 / 25 |
| Lower liquidity | 0.5 | 1.5 | 75% | 30 / 45 / 25 |
| Middle | 0.75 | 2 | 70% | 35 / 40 / 25 |

[PJMF's FAQ](https://www.mcgovern.org/our-work/data-solutions/grant-guardian/) publishes 1.0 and 0.5 as current-ratio threshold examples. The other defaults originate in the preserved simulator and are retained only as explicit exploratory assumptions. They are not empirical sector benchmarks. The original nonprofit-category labels were removed because those associations were unsupported.

Users can change all settings and record their source or rationale. Current and reserve thresholds must be positive. The restriction threshold can range from 0 through 100. Each weight must be between 0 and 100 and their sum must be 100, with a floating-point tolerance of 0.000001 percentage points. Changing a threshold changes the comparison, not the raw ratio.

## Optional illustrative index

This is disabled by default. It is available only when all three ratios have verified inputs, settings are valid, and consistency checks pass. The index is not a risk model, financial-health rating, or prediction of a grant decision.

Define `clamp(x, 0, 100)` as restricting x to that range.

For current ratio and reserves:

```text
component = clamp(70 × value / threshold, 0, 100)
```

For restrictions when threshold > 0:

```text
component = clamp(100 − 30 × value / threshold, 0, 100)
```

At a zero restriction threshold, zero restrictions score 100 and any positive restriction ratio scores 0. The final index is the weighted arithmetic mean of the three components. At each positive threshold, that component is 70. The value 70 and both linear formulas are deliberate, unvalidated simulator assumptions. A higher restriction ratio cannot increase its component score, including ratios above 100%.

These formulas replace the historical curves and produce different indices. Version 1 and version 2 scores should not be presented as a financial trend.

## Form 990 references

Guidance is tied to the **2025 full Form 990**, not the 990-EZ or 990-PF. [Official IRS form](https://www.irs.gov/pub/irs-pdf/f990.pdf), inspected September 29, 2026. The link may change editions; verify the year before reuse.

- Total assets: Part X, line 16, end-of-year column.
- Total liabilities: Part X, line 26, end-of-year column.
- Net assets without/with donor restrictions: Part X, lines 27/28 where that reporting presentation applies.
- Total expenses: Part IX, line 25, column A.
- Total revenue: Part VIII, line 12, column A.
- Current assets and liabilities require a classified statement or supporting detail.
- Part X cash lines do not establish unrestricted availability. Investments require schedules and restriction/liquidity checks.

The old foundation-grant and individual-contribution mappings were unsupported and are removed. Government contributions are not inferred from all program-service revenue. The current release does not calculate a revenue-source concentration ratio.

## Local report format

JSON exports include schema and app versions, export time, metadata, entered amounts, references, confirmations, notes, and full scenario settings. They store inputs, not a signed audit record. Imports use an explicit allowlist, validate values and shape, and ignore unrecognized properties. Imported scenario names become “Imported settings”; thresholds and weights remain unchanged.

Reports are rebuilt from the saved inputs by the current application version. This release supports schema version 1. Future method changes need explicit migration/version handling, rather than silently claiming equivalence. Currency is a display label and there is no conversion. User text is escaped before HTML report rendering.
