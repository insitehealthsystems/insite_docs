# Availability Confidence

> **In plain English:** How confident iLocate is that the equipment it says is "available" is actually there and ready to use (not already taken by someone else, broken, or moved).

## What is this?
Availability Confidence measures what percentage of the time that iLocate reports an asset as "available," it is genuinely available for use when a nurse arrives to retrieve it. The system can report an asset as available based on its last known state, but if sensor updates are delayed, the asset may have already been taken. A high confidence score means the system's availability data is current and trustworthy. A low score usually means sensors are not sending updates frequently enough due to network issues or low batteries.

## Formula
```
Availability Confidence = (Confirmed Availability Checks / Total Availability Queries) × 100

Stored in: metrics table
```

**Example:** If a nurse queries availability 500 times and 472 times the asset is actually available when they arrive, Availability Confidence = 94.4%.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'search_confidence'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥90% | ✅ Good | System availability data is highly reliable |
| 75–89% | ⚠️ Review | Some lag in sensor updates — monitor network and battery health |
| <75% | 🚨 Critical | Sensor update lag is significant — check network connectivity and sensor batteries |

## Notes for non-technical users
Confidence drops when sensors have not sent updates recently. This is usually caused by a network issue in part of the hospital or by sensor tags with low batteries — not by assets actually being missing. Report low confidence areas to your IT team for a network and battery health check.
