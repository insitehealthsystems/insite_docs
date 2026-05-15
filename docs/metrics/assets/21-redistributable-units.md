# Redistributable Equipment Units

> **In plain English:** The exact number of individual items that could be moved from departments where they sit unused to departments that need them.

## What is this?
Redistributable Equipment Units is the count of individual asset records currently classified as either "low" or "idle" utilization. Unlike the Over-Purchased Types metric (which looks at categories), this metric counts actual physical items — each one representing a piece of equipment that could, in theory, be physically moved to a department where it would get more use. This is the most actionable asset metric because it translates directly into a work queue for your operations team.

## Formula
```
Redistributable Units = COUNT(*) WHERE status IN ('low', 'idle') FROM assets
```

**Example:** If 48 assets are 'low' and 19 are 'idle', Redistributable Units = 67. Each of these 67 items is a candidate for physical relocation.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `id`, `status` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any value | ✅ Good | Informational — each unit is a potential avoided purchase |
| Growing month-over-month | ⚠️ Review | Redistribution actions are not being completed — follow up with operations |
| Declining month-over-month | ✅ Good | Redistribution program is working |

## Notes for non-technical users
Work with department heads to physically move these items to departments that need them. iLocate will automatically detect and record the new location once the asset starts registering movement in its new zone. You do not need to update the system manually.
