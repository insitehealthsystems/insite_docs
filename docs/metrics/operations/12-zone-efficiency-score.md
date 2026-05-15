# Zone Efficiency Score

> **In plain English:** How well equipment is being used and returned in each hospital area — 100% means perfect flow, lower means equipment is getting stuck.

## What is this?
The Zone Efficiency Score rates each hospital zone (floor, wing, or department area) on how smoothly equipment moves through it. The score is a composite of three factors: how long equipment dwells in the zone compared to benchmark targets, what percentage of assets are returned within the expected timeframe, and overall traffic flow patterns. It gives operations managers a zone-by-zone heat map of equipment flow health.

## Formula
```
Zone Efficiency Score = composite of:
  - Dwell time vs. benchmark
  - % of assets returned within target time
  - Traffic flow patterns

Stored directly in: zones.efficiency_score
```

**Example:** The Emergency Room scores 92% because equipment moves in and out quickly. Radiology scores 54% because assets frequently remain there well beyond their expected dwell time.

## Data Source
| | |
|---|---|
| Table(s) | `zones` |
| Column(s) | `efficiency_score` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥80% | ✅ Good | Equipment flow in this zone is optimal |
| 60–79% | ⚠️ Review | Investigate dwell times and return rates in this zone |
| <60% | 🚨 Critical | Equipment is getting stuck — conduct zone audit |

## Notes for non-technical users
Storage areas always score low because equipment sits there by design — that is expected and not a problem. Focus your attention on clinical zones (patient care areas) that score below 70%. These zones may need process changes or staff reminders to return equipment after use.
