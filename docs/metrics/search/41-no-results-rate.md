# No-Results Rate

> **In plain English:** How often does a nurse search for something and get zero results back — meaning iLocate has no idea where that type of equipment is.

## What is this?
No-Results Rate is the percentage of searches where iLocate returned no location data at all — not just an inaccurate location, but a complete absence of any signal. This is distinct from a failed search (where an asset was detected but couldn't be precisely located). A high no-results rate typically indicates that an entire asset category has no BLE tags installed, or that all tags for that type have gone silent.

## Formula
```
COUNT(*) FILTER (WHERE no_results_flag = true) / COUNT(*) * 100
```

**Example:** 32 no-result searches out of 350 total = **9%** no-results rate.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `no_results_flag`, `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≤ 5% | ✅ Good | Asset coverage is comprehensive; continue monitoring |
| 6–15% | ⚠️ Review | One or more asset types may not be tagged; identify which types return no results |
| > 15% | 🚨 Critical | An entire asset category is likely missing from the system; escalate immediately |

## Notes for non-technical users
No results usually means that asset type has no BLE tags installed, or all tags for that type have lost signal. When you notice this pattern, note the specific asset type name that keeps returning no results and report it to your biomedical or IT team so they can investigate the tagging coverage for that equipment category.
