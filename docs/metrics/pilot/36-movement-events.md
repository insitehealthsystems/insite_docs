# Movement Events Captured

> **In plain English:** Total number of times a sensor detected an asset moving during the pilot period. Higher numbers mean better data quality.

## What is this?
Movement Events Captured is the raw count of motion detection events logged by all iLocate sensors during the pilot period. Each time a sensor records an asset moving — changing location, being picked up, or transitioning between zones — it generates a movement event. The total volume of these events is the foundation of all utilization and location calculations. A high event count indicates healthy sensor infrastructure and active asset use. A sudden drop in events is an early warning sign of sensor or network issues.

## Formula
```
Movement Events = SUM of all motion events logged across all sensors
                  during the pilot window

Stored in: metrics table
WHERE metric_key = 'pilot_movement_events'
```

**Example:** 48,247 movement events in the first pilot period means sensors are recording approximately 1,600 movement detections per day — a healthy volume for accurate utilization modeling across 8 zones.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'pilot_movement_events'` |
| Computed by | Aggregated and stored by backend from raw sensor event stream |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Growing or stable | ✅ Good | Sensors are active and recording adequately |
| Sudden significant drop | 🚨 Critical | Potential sensor or network failure — alert IT immediately |
| Sustained low volume per zone | ⚠️ Review | May indicate sensors in that zone need recalibration or replacement |

## Notes for non-technical users
48,000+ events in the first pilot period is an excellent data volume for accurate utilization modeling. If this number drops sharply from one period to the next without a corresponding drop in facility activity, it is a sensor health alert that your IT team should investigate promptly.
