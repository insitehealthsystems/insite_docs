# Estimated Annual Labor Savings

> **In plain English:** Total money saved in a full year because nurses spend less time looking for equipment.

## What is this?
Annual Labor Savings projects the full-year value of nursing time recovered through iLocate. It takes the monthly savings figure and scales it across a full calendar year, giving hospital leadership a single compelling number for budget justifications, board presentations, and ROI reporting. This figure is stored in the metrics table and updates automatically when the underlying inputs in `labor_calc_params` change.

## Formula
```
Annual Labor Savings = Monthly Labor Savings × 12
```

**Example:** If Monthly Labor Savings = $24,180, then Annual Labor Savings = $24,180 × 12 = $290,160 per year.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_labor_savings_annual'` |
| Computed by | Backend / Database query (derived from monthly savings × 12) |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any positive value | ✅ Good | Informational — higher is better |
| Growing year-over-year | ✅ Good | System is delivering increasing returns |
| Flat or declining | ⚠️ Review | Investigate if nursing hourly rates or search volume inputs need updating |

## Notes for non-technical users
Present this number to hospital leadership when justifying the ongoing cost of iLocate. Pair it with the Avoided Equipment Purchases metric to show the total annual return on investment. If nursing contract rates change, update the `nursing_hourly_rate` field in `labor_calc_params` so the figure stays accurate.
