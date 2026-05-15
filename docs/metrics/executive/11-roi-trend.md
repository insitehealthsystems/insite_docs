# ROI Trend Chart

> **In plain English:** A month-by-month bar chart showing how much money was saved on labor and avoided equipment purchases.

## What is this?
The ROI Trend Chart visualizes cumulative return on investment over time, broken into two components: nursing labor savings (green bars) and avoided equipment purchases (blue bars). Each bar represents one calendar month, allowing leadership to see how quickly value is accumulating, identify seasonal patterns, and demonstrate the growing payback from the iLocate investment. The data is sourced directly from the `roi_history` table, which is updated monthly.

## Formula
```
Monthly ROI Bar = Labor Savings (green) + Avoided Purchases (blue) for that month

Values sourced from: roi_history (month_name, savings, purchases, year)
```

**Example:** In March, if labor savings were $22,400 and avoided purchases were $9,000, the March bar totals $31,400 across both color segments.

## Data Source
| | |
|---|---|
| Table(s) | `roi_history` |
| Column(s) | `month_name`, `savings`, `purchases`, `year` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Both bars trending upward | ✅ Good | System is delivering growing returns |
| Flat after month 9 | ✅ Good | Normal plateau as the system reaches steady state |
| Declining bars | ⚠️ Review | Investigate drop in search volume, system usage, or redistribution activity |

## Notes for non-technical users
Savings typically grow in the first 6 months as staff adopt the system and sensor coverage expands. A plateau after month 9 is normal and expected — it means the system has reached a steady operational state. Use this chart in board presentations to show the trajectory of return on investment.
