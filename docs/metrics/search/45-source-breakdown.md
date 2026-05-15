# Source Breakdown

> **In plain English:** A breakdown of all searches showing how many came from mobile phones, wall kiosks, and web browsers — plus how each channel performed.

## What is this?
Source Breakdown extends the Top Source metric by showing the full distribution of searches across all channels, along with the outcome (found, failed, or no results) for each channel. This makes it possible to detect whether a particular platform is delivering a worse search experience than others — for example, if kiosk searches have a significantly lower success rate, it may indicate a connectivity problem at those specific terminals.

## Formula
```
COUNT(*) GROUP BY search_source / total_searches * 100
WHERE search_timestamp >= NOW() − window
```

**Example:** mobile 55% (192 searches), kiosk 24% (84 searches), web 21% (74 searches).

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_source`, `search_success_flag`, `no_results_flag`, `search_timestamp` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Searches spread across channels with similar success rates | ✅ Good | All channels are functioning; continue monitoring |
| One channel with notably lower success rate | ⚠️ Review | Investigate connectivity or UX issues on that specific platform |
| Kiosk share exceeds 60% of total searches | ⚠️ Review | Consider provisioning more mobile devices on floors with high kiosk usage |

## Notes for non-technical users
The Found / Failed / No-Results summary below the channel bars shows the overall outcome split — use this to see if one channel has a notably worse success rate, which would indicate a UX or connectivity issue on that platform rather than a system-wide problem.
