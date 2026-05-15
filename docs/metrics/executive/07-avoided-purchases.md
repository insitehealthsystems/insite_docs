# Avoided Equipment Purchases

> **In plain English:** Money the hospital did NOT have to spend on buying new equipment because iLocate showed that existing equipment is available and underutilized.

## What is this?
Avoided Equipment Purchases tracks the cumulative capital cost avoided when iLocate's redistribution recommendations prevent the hospital from ordering new equipment. When the system identifies idle or underutilized assets in one department that can be reassigned to meet demand elsewhere, each confirmed redistribution event avoids a purchase. The dollar value is calculated by multiplying confirmed redistribution events by the average unit cost of the relevant equipment type.

## Formula
```
Avoided Purchases = Number of redistribution events × Average unit cost of equipment type
```

**Example:** If 3 IV pumps ($4,500 each) were redistributed instead of purchased new, Avoided Purchases increases by $13,500.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_avoided_purchases'` |
| Computed by | Maintained by iLocate administrator; stored in `metrics` table |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any positive value | ✅ Good | Direct capital savings confirmed |
| Growing over time | ✅ Good | Redistribution program is active and working |
| Stagnant | ⚠️ Review | Confirm redistribution recommendations are being acted on |

## Notes for non-technical users
This value grows over time as redistribution recommendations are confirmed and acted on. It resets at the start of each fiscal year. Every dollar listed here is a real purchase that did not happen — money that stays in the hospital's capital budget for other priorities.
