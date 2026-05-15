# Per-Type Success Rate

> **In plain English:** For each type of equipment, what percentage of the time do nurses actually find what they're looking for when they search for it?

## What is this?
Per-Type Success Rate breaks the overall success rate down by individual equipment category, showing exactly which asset types iLocate is reliably locating and which are slipping through the cracks. This metric is essential for prioritising remediation work — a low overall success rate is much more actionable when you can pinpoint that it is being dragged down by one or two specific asset types.

## Formula
```
ROUND(AVG(CASE WHEN search_success_flag THEN 1 ELSE 0 END) * 100)
GROUP BY search_text
WHERE search_timestamp >= NOW() − window
```

**Example:** Crash Cart = 82%, Ventilator = 74%, Portable X-Ray = 78%.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_text`, `search_success_flag` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥ 80% per type | ✅ Good | That asset type is well-tracked; no action needed |
| 60–79% per type | ⚠️ Review | Check tagging density and sensor coverage for that specific asset type |
| < 60% per type | 🚨 Critical | That asset type is effectively untracked; escalate to biomedical and IT teams |

## Notes for non-technical users
Share any asset types with a low success rate with your biomedical team — the fix is usually adding more BLE tags to that equipment category, or ensuring those assets are properly checked out and returned to designated storage areas so the system can maintain an accurate record of their location.
