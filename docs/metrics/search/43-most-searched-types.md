# Most Searched Asset Types

> **In plain English:** A ranked list of which types of equipment nurses search for most often — tells you which equipment is hardest to find or most in demand.

## What is this?
Most Searched Asset Types ranks equipment categories by how frequently staff searched for them within the selected time window. High search frequency for a particular type can mean either that the equipment is in very high clinical demand, or that it is consistently hard to locate and staff keep trying repeatedly. Combining this metric with per-type success rate reveals which types need the most attention.

## Formula
```
COUNT(*) GROUP BY search_text
WHERE search_timestamp >= NOW() − window
  AND search_text IS NOT NULL
ORDER BY COUNT(*) DESC
LIMIT 10
```

**Example:** Crash Cart (39 searches), Ventilator (39), Portable X-Ray (36) — top three most searched types in the monthly window.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_text`, `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| High-volume type with high success rate | ✅ Good | System is working well for that asset type; no action needed |
| High-volume type with low success rate | ⚠️ Review | Investigate tagging coverage and sensor reach for that type |
| High-volume type with very low success rate | 🚨 Critical | That asset type is in high demand but effectively untracked; prioritise for immediate tagging |

## Notes for non-technical users
If a particular equipment type is searched for very frequently and also has a low success rate, that type should be prioritised for additional BLE tagging or better distribution across floors — your biomedical or IT team can action this once you identify the specific equipment name from this list.
