# Top Source

> **In plain English:** Which device or app are nurses using the most to search for equipment — mobile phone, a wall-mounted kiosk, or the web browser?

## What is this?
Top Source identifies the single search channel (mobile, kiosk, or web) that generated the most searches within the selected time window. It tells operations managers where staff naturally gravitate when they need to find equipment, which in turn reveals where workflow optimisations and technology investments will have the most impact.

## Formula
```
search_source WITH MAX(COUNT(*)) GROUP BY search_source
WHERE search_timestamp >= NOW() − window
```

**Example:** mobile = 192 searches (55% of total), kiosk = 84 searches (24%), web = 74 searches (21%) — Top Source: **mobile**.

## Data Source
| | |
|---|---|
| Table | `asset_search_history` |
| Column(s) | `search_source` |
| Filtered by | `search_timestamp >= NOW() − make_interval(hours => X)` where X = 24/168/720/2160 based on time range |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Any single source dominant | ✅ Good | Informational — use to prioritise which channel to optimise first |
| High kiosk share (> 60%) | ⚠️ Review | Nurses may lack mobile devices; consider device provisioning for that floor |
| High web share with low mobile | ⚠️ Review | Mobile app may need usability improvements; gather staff feedback |

## Notes for non-technical users
High kiosk usage may mean nurses don't have mobile devices readily available on that floor. High web usage may mean the mobile app needs improvement. These insights guide where to invest in better tooling — this metric is informational and does not require immediate action on its own.
