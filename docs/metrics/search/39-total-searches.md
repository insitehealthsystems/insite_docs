# Total Searches

> **In plain English:** The total number of times staff used iLocate to look for equipment during the selected period.

## What is this?
Total Searches counts every search request submitted through iLocate within the selected time window. It is the foundational adoption metric for the Search Analytics tab — it tells you whether staff are actively using the system, and at what volume. Tracking this number over time reveals whether iLocate usage is growing, stable, or declining.

## Formula
```
COUNT(*) WHERE search_timestamp >= NOW() − window
```

**Example:** 350 searches recorded in the monthly window (720 hours).

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_audit_id` (counted), `search_timestamp` (for filtering) |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Consistent or growing volume | ✅ Good | Continue monitoring; celebrate adoption milestones with staff |
| Sharp drop from prior period | ⚠️ Review | Check whether the app or API is unavailable; confirm with IT |
| Zero searches in a 24-hour window | 🚨 Critical | Treat as a potential system outage; escalate to IT immediately |

## Notes for non-technical users
Growing search volume means staff are trusting iLocate to help them find equipment. A sudden drop usually means the app is unavailable, not that there are fewer searches happening — so any unexpected dip should be investigated as a potential outage rather than a behaviour change.
