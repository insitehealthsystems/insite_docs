# Average Search Duration

> **In plain English:** How long it takes a nurse to find a specific piece of equipment after starting to look for it.

## What is this?
Average Search Duration measures the mean elapsed time from when a nurse initiates an equipment search in iLocate to when the asset is successfully located. This is one of the most direct measures of system effectiveness from a frontline staff perspective. A decreasing trend confirms that sensor coverage is adequate and that staff are becoming more proficient with the system. A rising trend is an early warning that something is wrong — either sensor coverage has gaps or system adoption has declined.

## Formula
```
Avg Search Duration = AVG(time from search initiated to asset located)
                      across all successful searches in the period

Stored in: metrics table
```

**Example:** If 350 searches were completed this week and they took an average of 2.7 minutes each, Average Search Duration = 2.7 minutes.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'search_avg_duration'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <3 minutes | ✅ Good | System is guiding staff to equipment quickly |
| 3–7 minutes | ⚠️ Review | Investigate specific zones or asset types where searches take longer |
| >7 minutes | 🚨 Critical | Likely system or sensor coverage issue — escalate to IT |

## Notes for non-technical users
This number should decrease over time as staff learn to use the iLocate app and as sensor coverage expands to more areas of the hospital. If it starts rising again, that is a signal worth investigating before it affects patient care.
