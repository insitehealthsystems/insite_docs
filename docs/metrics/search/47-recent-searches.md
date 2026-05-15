# Recent Searches Feed

> **In plain English:** A live table showing the last 25 individual searches — who searched, what they looked for, whether they found it, and where they were looking.

## What is this?
Recent Searches Feed surfaces the 25 most recent rows from the search history table with no aggregation — every row is a real, individual search event. It is the most granular view in the Search Analytics tab and is primarily used for real-time monitoring and spot-checking. Patterns visible in the raw feed — such as multiple consecutive failed searches for the same asset type — can signal emerging problems before they are visible in aggregate metrics.

## Formula
```
SELECT search_text, search_source, search_success_flag, no_results_flag,
       selected_current_location, last_seen_filter, search_timestamp
FROM asset_search_history
ORDER BY search_timestamp DESC
LIMIT 25
```

No aggregation — these are raw event rows.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_text`, `search_source`, `search_success_flag`, `no_results_flag`, `selected_current_location`, `last_seen_filter`, `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Mix of successful and failed searches across asset types | ✅ Good | Normal operational pattern; continue monitoring |
| Multiple consecutive rows showing "No Results" for the same asset type | ⚠️ Review | That asset type may have gone dark; check sensor and tag status |
| All recent rows showing failures or no results across multiple asset types | 🚨 Critical | Possible system-wide outage; escalate to IT immediately |

## Notes for non-technical users
The "Last Seen Filter" column shows what time window the nurse filtered by when conducting their search — for example, "4h" means they only wanted assets seen in the last four hours. A nurse repeatedly filtering by "1h" suggests urgency, meaning they need the asset right now and cannot accept a stale location result. This is a useful signal for operations managers assessing the criticality of unresolved search failures.
