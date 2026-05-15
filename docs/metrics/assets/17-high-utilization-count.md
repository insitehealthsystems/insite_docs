# High Utilization Count

> **In plain English:** The number of individual equipment items that are being used very frequently — these are your hardest-working assets.

## What is this?
High Utilization Count is a count of every asset whose status is classified as "high," meaning the item has a utilization percentage of 85% or above. These are the workhorses of your fleet — items that are almost always in use and rarely sit idle. Tracking this count helps biomedical and operations teams identify which assets are accumulating the most wear and should be prioritized for preventive maintenance scheduling.

## Formula
```
High Utilization Count = COUNT(*) WHERE status = 'high' FROM assets
                         (status = 'high' means utilization_percentage ≥ 85%)
```

**Example:** If 94 assets have a `status` of 'high', the dashboard displays 94. These are the 94 items that should appear first on the next maintenance review list.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `id`, `status` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Stable or growing | ✅ Good | Fleet is being put to productive use |
| Sudden drop in count | ⚠️ Review | Assets may have gone offline or been lost — cross-check with Total Tracked Assets |
| Sustained very high count | ⚠️ Review | High-demand assets may need maintenance — flag for biomedical review |

## Notes for non-technical users
High-utilization equipment wears out faster than equipment that sits idle. Flag items in this category for preventive maintenance on a shorter cycle than your standard schedule to avoid unexpected failures during patient care.
