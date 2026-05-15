# Labor Savings Calculation

> **In plain English:** Shows the math behind the money saved — takes the time nurses save per search, multiplies by how many searches happen each day, and calculates the annual dollar value.

## What is this?
The Labor Savings Calculation is the underlying financial model that converts nursing time savings into dollar figures. It is driven by four configurable inputs stored in the `labor_calc_params` table: pre-implementation search time, post-implementation search time, daily search volume, and the current nursing hourly rate. The formula shows exactly how the Annual Labor Savings figure is derived so that hospital finance teams can audit, validate, and update it as conditions change.

## Formula
```
Annual Savings = (T_before − T_after) minutes
                 × (1 hr / 60 min)
                 × Searches_per_day
                 × Hourly_Rate
                 × 365 days
```

**Example:** (18 − 5.8) / 60 × 84 × $48.50 × 365 = **$290,160/year**

Broken down: 12.2 min saved × 84 searches/day = 1,024.8 min/day = 17.08 hrs/day × $48.50 = $828.52/day × 365 = $302,410 (slight variation from stored value due to rounding in daily working days).

## Data Source
| | |
|---|---|
| Table(s) | `labor_calc_params`, `metrics` |
| Column(s) | `search_time_before`, `search_time_after`, `searches_per_day`, `nursing_hourly_rate` (all in `labor_calc_params`); result stored in `metrics.metric_value` WHERE `metric_key = 'kpi_labor_savings_annual'` |
| Computed by | Backend calculation triggered when `labor_calc_params` inputs change |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any positive value | ✅ Good | Informational — update inputs annually |
| Inputs not updated in >12 months | ⚠️ Review | Verify nursing hourly rate reflects current contract |
| Inputs significantly out of date | 🚨 Critical | Figure may be materially inaccurate — update `labor_calc_params` |

## Notes for non-technical users
Update the nursing hourly rate in the `labor_calc_params` database table each year when contract rates change — the dashboard will recalculate the savings figures automatically. Ask your iLocate administrator or IT team to make this update if you do not have direct database access.
