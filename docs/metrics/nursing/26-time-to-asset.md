# Time-to-Asset

> **In plain English:** From the moment a nurse opens the iLocate app to the moment they have the equipment in hand — the total elapsed time.

## What is this?
Time-to-Asset is the end-to-end measure of how long the complete equipment retrieval process takes, from initiating a search to physically having the item. It combines search duration (the time the system takes to locate the asset) with walking time (the time to physically travel to the asset's location). This metric captures the real-world experience of the nurse, not just system performance. If Time-to-Asset is high even when search duration is low, it suggests that equipment is being stored far from where it is most needed.

## Formula
```
Time-to-Asset = AVG(physical retrieval time)
              = search duration + walking time to location

Stored in: metrics table
```

**Example:** If the average search takes 2.4 minutes and the average walk to retrieve the asset takes 1.8 minutes, Time-to-Asset = 4.2 minutes.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'search_time_to_asset'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <3 minutes | ✅ Good | Equipment is near where it is needed — excellent flow |
| 3–6 minutes | ⚠️ Review | Acceptable but consider relocating high-demand equipment closer to point of use |
| >6 minutes | 🚨 Critical | Redistribution needed — equipment storage locations are too far from demand |

## Notes for non-technical users
If Time-to-Asset is consistently high for a specific unit or zone, consider working with your operations team to create a local equipment staging area closer to where the equipment is most frequently needed. iLocate will track it there automatically.
