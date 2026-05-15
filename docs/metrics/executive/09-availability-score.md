# Availability Score

> **In plain English:** How reliably the right equipment is available in the right place when staff need it.

## What is this?
The Availability Score measures the percentage of equipment requests that result in staff successfully locating a ready-to-use asset. It is smoothed over a 30-day rolling window to reduce daily fluctuation and give a stable trend signal. A high score means that when a nurse needs a piece of equipment, iLocate can direct them to an available unit reliably. A low score typically indicates that equipment is being concentrated in one department, leaving others without access.

## Formula
```
Availability Score = (Successfully Located Requests / Total Requests) × 100
                     [smoothed over 30-day rolling window]
```

**Example:** If 927 of 1,030 equipment requests in the past 30 days resulted in the nurse finding a ready asset, the Availability Score = 90%.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_availability_score'` AND `metric_key = 'health_availability'` |
| Computed by | Backend / Database query (30-day rolling computation) |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥90% | ✅ Good | Equipment is reliably available across the facility |
| 75–89% | ⚠️ Review | Identify departments with low local availability; consider redistribution |
| <75% | 🚨 Critical | Serious availability problem — hoarding or sensor failures likely |

## Notes for non-technical users
A low score usually means equipment is being hoarded in one department and unavailable to others. Check the Operations tab to see which departments have the HOARDING badge and start redistribution conversations with those unit managers.
