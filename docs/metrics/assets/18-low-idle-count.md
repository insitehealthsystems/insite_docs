# Low / Idle Count

> **In plain English:** Equipment that is barely being used or not used at all — these are candidates for redistribution to busier departments.

## What is this?
Low / Idle Count captures every asset whose utilization falls below the active threshold. "Low" status assets (40–64% utilization) are in occasional use but underperforming relative to their capacity. "Idle" assets (below 40% utilization) are rarely used and represent the clearest opportunities for redistribution or decommissioning. Together, these two categories form the actionable list for monthly asset review meetings.

## Formula
```
Low / Idle Count = COUNT(*) WHERE status IN ('low', 'idle') FROM assets

  Low  = utilization_percentage between 40% and 64%
  Idle = utilization_percentage below 40%
```

**Example:** If 48 assets are classified as 'low' and 19 are classified as 'idle', Low / Idle Count = 67. These 67 items are candidates for redistribution or decommissioning review.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `id`, `status` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <10% of total fleet | ✅ Good | Acceptable level of underutilized assets |
| 10–20% of total fleet | ⚠️ Review | Redistribution review recommended this month |
| >20% of total fleet | 🚨 Critical | Significant waste — initiate capital planning and redistribution program |

## Notes for non-technical users
Review this list monthly with your biomedical team. Some idle equipment may be broken or awaiting repair — make sure those items are captured in your maintenance system and not just sitting in a storeroom untracked.
