# Search Time Reduction

> **In plain English:** How much faster nurses find equipment compared to before iLocate was installed.

## What is this?
Search Time Reduction expresses as a percentage how much iLocate has shortened the time it takes a nurse to locate a piece of equipment. It compares the pre-implementation average search time (18 minutes) against the current post-implementation average (5.8 minutes), giving leadership a clear before-and-after efficiency signal. This is one of the most meaningful operational metrics because it directly reflects how much time is being returned to patient care.

## Formula
```
Search Time Reduction = ((Before Search Time − After Search Time) / Before Search Time) × 100
```

**Example:** ((18 min − 5.8 min) / 18 min) × 100 = 67.8%, rounded to 68%.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_search_time_reduction'` |
| Computed by | Backend / Database query using `labor_calc_params` inputs |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥50% | ✅ Good | Excellent — iLocate is delivering strong time savings |
| 30–49% | ⚠️ Review | Acceptable, but investigate staff adoption and sensor coverage |
| <30% | 🚨 Critical | System underperforming — check sensor coverage gaps and staff training |

## Notes for non-technical users
If this percentage drops over time, investigate whether new departments or floors have been added without adequate sensor coverage. A drop can also indicate that staff are not using the iLocate app as their first step when looking for equipment.
