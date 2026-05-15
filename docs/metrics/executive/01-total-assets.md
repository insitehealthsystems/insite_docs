# Total Tracked Assets

> **In plain English:** Total number of medical equipment items currently being tracked by iLocate sensors.

## What is this?
Total Tracked Assets is the count of every equipment item registered in the iLocate system with an active sensor tag. This is your baseline inventory figure — everything else (utilization, lost assets, distribution) is measured against it. A stable count confirms the system is healthy and all assets are accounted for.

## Formula
```
Total Tracked Assets = COUNT(*) FROM assets
```

**Example:** If 312 items appear in the assets table, the dashboard displays 312. If that number drops to 280 overnight, 32 assets have lost sensor contact or been deregistered.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `id` (row count) |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Stable day-over-day | ✅ Good | No action needed |
| Drop of 1–5% | ⚠️ Review | Verify sensors are online; check for deregistrations |
| Drop of >5% suddenly | 🚨 Critical | Alert IT immediately — sensors may be offline or network issue |

## Notes for non-technical users
This number should stay roughly the same from day to day — small changes are normal as equipment is added or retired. If this number drops suddenly, alert your IT team right away because sensors may have gone offline.
