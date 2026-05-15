# Estimated Avoided Purchase Value

> **In plain English:** The total dollar value of equipment the hospital did not need to buy this fiscal year because redistribution identified available items.

## What is this?
Avoided Purchase Value is the cumulative dollar amount of capital expenditure avoided during the current fiscal year as a result of redistribution actions recommended by iLocate. Each time a department's request for new equipment is fulfilled by relocating an existing underutilized asset instead of purchasing new, the cost of that new purchase is added to this total. The value is maintained manually by the iLocate administrator as redistribution events are confirmed and logged.

## Formula
```
Avoided Purchase Value = SUM of (redistribution events × average unit cost per asset type)

Maintained manually in: metrics table
```

**Example:** If 3 portable monitors ($8,000 each) and 2 IV pumps ($4,500 each) were redistributed instead of purchased, Avoided Purchase Value = (3 × $8,000) + (2 × $4,500) = $33,000.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_avoided_purchases'` |
| Computed by | Manually updated by iLocate administrator |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any positive value | ✅ Good | Capital savings are being realized |
| Growing | ✅ Good | Redistribution program is active and effective |
| Stagnant | ⚠️ Review | Confirm redistribution recommendations are being actioned |

## Notes for non-technical users
This value is updated manually by your iLocate administrator as redistribution actions are confirmed with department heads. Present this figure at board meetings alongside Annual Labor Savings to show the full picture of iLocate's return on investment. Every dollar listed here is a direct return on the iLocate investment.
