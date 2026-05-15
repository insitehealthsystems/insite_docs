# Utilization Rate

> **In plain English:** On average, what percentage of the time is your equipment actually being used?

## What is this?
Utilization Rate is the fleet-wide average percentage of time that tracked equipment is in active use, calculated from motion telemetry data collected by iLocate sensors. It answers the fundamental question: "Are we getting full value from our equipment?" A high utilization rate means the hospital is operating efficiently; a low rate means there is likely excess inventory, or equipment is being hoarded rather than shared.

## Formula
```
Utilization Rate = (Active Use Time / Total Available Time) × 100
```

**Example:** If a ventilator is in active use for 19.2 hours out of a 24-hour day, its utilization is 80%. The fleet-wide Utilization Rate averages this across all tracked assets.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_utilization_rate'` |
| Computed by | Calculated offline from motion telemetry data, result stored in metrics table |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥80% | ✅ Good | Fleet is being used efficiently |
| 60–79% | ⚠️ Review | Identify underutilized departments; consider redistribution |
| <60% | 🚨 Critical | Significant waste — review purchasing decisions and departmental hoarding |

## Notes for non-technical users
Low utilization often means the hospital owns more equipment than it needs, or that equipment is not being found and reused between patients. Share this number with your capital planning team — it directly informs whether new purchases are justified.
