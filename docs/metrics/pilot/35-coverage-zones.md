# Coverage Zones

> **In plain English:** How many distinct hospital areas (floors, wings, departments) have iLocate sensors installed and active.

## What is this?
Coverage Zones is a count of the distinct hospital zones that have active iLocate sensor infrastructure — meaning sensors are installed, connected, and transmitting data. This metric defines the boundaries of what the system can see. Any asset that moves outside the coverage boundary becomes invisible to iLocate until it re-enters a covered zone. Expanding coverage is the single most effective way to improve search success rate, reduce failed searches, and increase data quality for all other metrics.

## Formula
```
Coverage Zones = direct count stored in metrics table

Stored in: metrics table
WHERE metric_key = 'pilot_coverage_zones'
```

**Example:** During the pilot phase, if 8 zones are active (3 floors, 2 nursing units, ICU, ED, and Central Supply), the dashboard displays 8. Adding a new wing adds 1 to this count.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'pilot_coverage_zones'` |
| Computed by | Manually updated by iLocate administrator as new zones are activated |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Growing | ✅ Good | Coverage expansion is on track |
| All clinical zones + storage + transport routes | ✅ Good | Full facility coverage achieved |
| Stagnant (no growth over 60+ days) | ⚠️ Review | Check expansion plan status with iLocate project manager |

## Notes for non-technical users
Each new zone added to coverage will directly improve search success rate and reduce failed searches in that area. If nurses in a specific area frequently report not being able to find equipment, that area may not yet have sensor coverage — contact your iLocate project manager to schedule installation.
