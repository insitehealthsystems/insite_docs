# Asset Utilization Classification

> **In plain English:** Each piece of equipment is automatically labeled based on how much it moves: High, Normal, Low, or Idle. This tells you at a glance which equipment is working hard and which is sitting unused.

## What is this?
Asset Utilization Classification assigns every tracked asset to one of four tiers based on its measured utilization percentage. These classifications are computed by the backend and stored in the `status` column of the assets table, refreshing every 30 seconds in live mode. The classification system makes it easy for any staff member — without needing to understand percentages — to immediately identify which assets need attention and which are performing as expected.

## Formula
```
Classification = based on utilization_percentage:
  ≥85%       → High
  65–84%     → Normal
  40–64%     → Low
  <40%       → Idle

Stored in: assets.status
Computed from: assets.utilization_percentage (backend classification logic)
```

**Example:** A pulse oximeter that has been in continuous use for most of the past 24 hours with a 91% utilization rate receives the "High" classification. A wheelchair with 22% utilization is "Idle."

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `utilization_percentage` (input), `status` (output classification) |
| Computed by | Backend classification logic; result stored in `status` column |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥70% of fleet in High or Normal | ✅ Good | Fleet is productive and well-utilized |
| 50–69% of fleet in High or Normal | ⚠️ Review | Redistribution may improve efficiency |
| >15% of fleet classified as Idle | 🚨 Critical | Investigate — idle assets should be redistributed or decommissioned |

## Notes for non-technical users
Classifications update with every data refresh, which happens every 30 seconds in live mode. If an asset's classification seems wrong (for example, an item you know is in use shows as "Idle"), the sensor tag may need a battery replacement or the item may be in a sensor-blind area.
