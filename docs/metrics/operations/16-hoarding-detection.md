# Hoarding Detection Flag

> **In plain English:** A red "HOARDING" badge automatically appears on departments that are holding onto equipment they are not fully using — preventing other departments from accessing it.

## What is this?
The Hoarding Detection Flag is an automated alert that triggers when a department meets two conditions simultaneously: their average equipment utilization is below 75% (meaning assets are often idle) AND they have more than 25 assets attributed to them (meaning the low utilization is not just a small-sample anomaly). When both conditions are true, the department receives a visible HOARDING badge in the Operations tab, prompting an operational conversation about redistribution.

## Formula
```
Hoarding = TRUE when:
  AVG(utilization_percentage) < 75%
  AND COUNT(assets) > 25

Evaluated from: assets table, grouped by department_id
                joined to departments table
```

**Example:** If Radiology has 38 assets with an average utilization of 61%, it meets both conditions and receives the HOARDING badge. If a small clinic has 8 assets at 55% utilization, it does not trigger the flag because the count is too low to be significant.

## Data Source
| | |
|---|---|
| Table(s) | `assets`, `departments` |
| Column(s) | `assets.utilization_percentage`, `assets.department_id`, `departments.name` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| No departments flagged | ✅ Good | Equipment is well-distributed across the facility |
| 1–2 departments flagged | ⚠️ Review | Initiate redistribution conversation with flagged unit managers |
| Any department flagged | 🚨 Critical | Action required — contact department head to arrange asset reallocation |

## Notes for non-technical users
Hoarding is not always intentional — staff may not realize that equipment they have accumulated should be returned to a shared pool. Use the HOARDING badge as the starting point for a conversation, not an accusation. In most cases, a simple agreement to return a few items resolves the issue quickly.
