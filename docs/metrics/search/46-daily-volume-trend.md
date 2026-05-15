# Daily Search Volume Trend

> **In plain English:** A bar chart showing how many equipment searches happened each day over the past two weeks — useful for spotting unusually busy or quiet days.

## What is this?
Daily Search Volume Trend displays the count of searches per calendar day for the last 14 days, rendered as a bar chart. It provides a consistent, readable picture of usage rhythm — making it easy to spot outages (a day with zero or near-zero searches), demand spikes (an unusually high day that may warrant investigation), and weekly patterns such as lower weekend usage.

## Formula
```
COUNT(*) GROUP BY DATE_TRUNC('day', search_timestamp)
WHERE search_timestamp >= NOW() − INTERVAL '14 days'
ORDER BY day ASC
```

**Example:** 15 data points across the past two weeks, each bar showing between 18 and 32 searches per day.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Consistent daily volume with expected weekend dips | ✅ Good | System is in active, stable use; no action needed |
| A single day with zero or near-zero searches | ⚠️ Review | Possible outage on that day; cross-reference with IT incident logs |
| A spike significantly above the daily average | ⚠️ Review | Investigate whether a supply shortage or clinical emergency drove unusual demand |

## Notes for non-technical users
This chart always shows the last 14 calendar days regardless of the time range selector, to keep the trend readable at a consistent scale. A day with zero searches is a red flag — it almost always means the system was unavailable rather than that nobody needed to search for equipment.
