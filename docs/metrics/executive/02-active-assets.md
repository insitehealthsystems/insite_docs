# Active Assets (Moving)

> **In plain English:** Number of assets that have shown recent movement — meaning they are being used right now or were used recently.

## What is this?
Active Assets counts every piece of equipment whose sensor status is classified as either "high" or "normal" utilization, indicating recent movement or active use. This metric gives leadership a real-time snapshot of how much of the fleet is in productive circulation. A high active count means equipment is flowing through the hospital as intended; a low count signals that assets are sitting idle or are unreachable by sensors.

## Formula
```
Active Assets = COUNT(*) WHERE status IN ('high', 'normal') FROM assets
```

**Example:** If 265 of 312 total assets have status 'high' or 'normal', Active Assets = 265, which is 85% of the fleet — a healthy ratio.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `status` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| >80% of total assets | ✅ Good | Fleet is in active circulation |
| 60–80% of total assets | ⚠️ Review | Investigate departments with high idle counts |
| <60% of total assets | 🚨 Critical | Significant portion of fleet unused — check for hoarding or sensor failures |

## Notes for non-technical users
A low active asset count may mean equipment is being stored in one department instead of being shared. Check the Operations tab to see which zones have unusually high concentrations of equipment that is not being used.
