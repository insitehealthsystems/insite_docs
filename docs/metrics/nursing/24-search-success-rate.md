# Successful Search Rate

> **In plain English:** What percentage of the time does a nurse find the equipment they were looking for using iLocate?

## What is this?
Successful Search Rate measures the proportion of equipment searches that end with the nurse finding the asset they needed. A search is considered successful when the asset is located and confirmed within the session. Failed searches — where the nurse abandons the search or the system cannot produce a valid location — indicate either sensor coverage gaps, assets that have gone missing, or location data that is too stale to be useful. This is one of the most important trust indicators for the system.

## Formula
```
Successful Search Rate = (Successful Searches / Total Searches) × 100

Stored in: metrics table
```

**Example:** If 1,840 searches were initiated this month and 1,786 ended successfully, Successful Search Rate = 97%.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'search_success_rate'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥95% | ✅ Good | System is highly reliable for locating equipment |
| 85–94% | ⚠️ Review | Investigate which asset types or zones have the most failures |
| <85% | 🚨 Critical | Sensor coverage gaps likely — report to IT team for assessment |

## Notes for non-technical users
Failed searches usually happen in areas with poor sensor coverage — typically stairwells, loading docks, or recently renovated spaces where sensors were not reinstalled. Report patterns of failures in specific locations to your IT team so coverage can be extended.
