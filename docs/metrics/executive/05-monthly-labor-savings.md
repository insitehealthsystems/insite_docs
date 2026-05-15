# Estimated Monthly Labor Savings

> **In plain English:** How much money the hospital saves every month because nurses spend less time searching for equipment.

## What is this?
This metric calculates the dollar value of nursing time recovered each month as a direct result of iLocate reducing equipment search time. Before iLocate, nurses averaged 18 minutes per equipment search. After implementation, that dropped to 5.8 minutes. Multiplied across all daily searches and the full nursing workforce, this translates into significant monthly cost avoidance. The figure is stored in the metrics table after being computed from configurable inputs.

## Formula
```
Monthly Labor Savings = (Search Time Before − Search Time After) × (1 hr / 60 min)
                        × Searches Per Day × Nursing Hourly Rate × Working Days Per Month
```

**Example:** (18 min − 5.8 min) / 60 × 84 searches × $48.50/hr × 22 days = approximately $18,292/month (annual result divided by 12 from stored value).

## Data Source
| | |
|---|---|
| Table(s) | `labor_calc_params`, `metrics` |
| Column(s) | `search_time_before` = 18 min, `search_time_after` = 5.8 min, `searches_per_day` = 84, `nursing_hourly_rate` = $48.50; result in `metrics.metric_value` WHERE `metric_key = 'kpi_labor_savings_monthly'` |
| Computed by | Backend calculation from `labor_calc_params` inputs, stored in `metrics` |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any positive value | ✅ Good | Savings are being generated |
| Trending upward month-over-month | ✅ Good | System adoption is improving |
| Flat or declining | ⚠️ Review | Check if search time inputs are current; audit system usage |

## Notes for non-technical users
This is an estimate based on average search times across all shifts. The actual savings at your facility may vary depending on nursing roster size and shift patterns. Use it directionally — as a trend indicator — rather than as an exact accounting figure.
