# Proximity Accuracy

> **In plain English:** How accurately iLocate can tell you where equipment is — a high score means the system pinpoints the right room, a low score means it only narrows it to a floor or wing.

## What is this?
Proximity Accuracy measures how often iLocate's predicted asset location is within one room of where the asset is physically found. It is the precision measure of the location system — not just "did we find it eventually" (that is Search Success Rate), but "how close was the system's predicted location to the actual location." High proximity accuracy means nurses can walk directly to a room; low accuracy means they may need to check several nearby rooms before finding the asset.

## Formula
```
Proximity Accuracy = (Searches where asset found within 1 room of predicted location
                      / Total Searches) × 100

Stored in: metrics table
```

**Example:** If the system predicted the correct room or the room directly next door in 918 of 1,000 searches, Proximity Accuracy = 91.8%.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'search_accuracy_score'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥90% | ✅ Good | Sub-room or room-level accuracy — nurses can navigate directly |
| 70–89% | ⚠️ Review | Room-level accuracy — nearby rooms may need to be checked |
| <70% | 🚨 Critical | Sensor recalibration needed — contact iLocate technician |

## Notes for non-technical users
Accuracy improves after each sensor calibration cycle. Contact your iLocate technician if proximity accuracy drops below 80% — this is usually resolved by a calibration visit and does not indicate a fundamental system problem.
