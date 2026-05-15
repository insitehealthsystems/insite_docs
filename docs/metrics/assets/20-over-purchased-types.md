# Over-Purchased Asset Types

> **In plain English:** Categories of equipment where the hospital owns more than it needs — the average utilization of that type is below 40%.

## What is this?
Over-Purchased Asset Types identifies equipment categories (not individual items, but entire types — for example, "portable blood pressure monitors" or "IV pumps") where the fleet-wide average utilization is below 40%. When an entire category is underutilized on average, it signals that the hospital has bought more of that type than its patient volume justifies. This metric is a direct input for capital planning — it prevents the hospital from continuing to order more of something it already has in excess.

## Formula
```
Over-Purchased Types = COUNT of asset_type_id groups WHERE
                       AVG(utilization_percentage) < 40

Subquery: assets grouped by asset_type_id, filtered for avg < 40%
```

**Example:** If the hospital owns 45 portable suction units and their average utilization is 31%, that asset type is flagged as over-purchased. If there are 3 such categories in total, this metric displays 3.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `asset_type_id`, `utilization_percentage` |
| Computed by | Backend / Database query (subquery grouped by `asset_type_id`) |

## Thresholds
| Value | Status | Action |
|---|---|---|
| 0 | ✅ Good | No asset categories are significantly over-purchased |
| 1–2 | ⚠️ Review | Flag these types in capital planning discussions |
| >2 | 🚨 Critical | Capital planning review required before approving any new purchases in these categories |

## Notes for non-technical users
Share this number with your capital planning team before approving new equipment purchase requests. If a department requests more of a type that is already over-purchased, the correct response is to redistribute existing inventory rather than buy new items.
