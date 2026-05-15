# Success Rate

> **In plain English:** Out of every 100 searches, how many times did the nurse actually find the equipment they were looking for?

## What is this?
Success Rate is the percentage of searches that returned a confirmed location for the requested asset. A search is counted as successful when iLocate was able to identify where the equipment is currently located. This metric directly reflects how reliably the system helps staff find what they need, and is the single most important indicator of iLocate's day-to-day value.

## Formula
```
COUNT(*) FILTER (WHERE search_success_flag = true) / COUNT(*) * 100
```

**Example:** 269 successful searches out of 350 total = **77%** success rate.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_success_flag`, `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥ 85% | ✅ Good | System is performing well; maintain current sensor coverage |
| 70–84% | ⚠️ Review | Check sensor coverage; look for zones with low efficiency in the Operations tab |
| < 70% | 🚨 Critical | Many assets are not locatable; escalate to IT and biomedical teams immediately |

## Notes for non-technical users
If this rate drops, it often means sensors in a specific area have gone offline rather than a problem with the whole system. Check the Operations tab zone efficiency scores for clues about which zone is causing failures, then report that zone to your IT or facilities team.
