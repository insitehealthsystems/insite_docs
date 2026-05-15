# Zone Average Dwell Time

> **In plain English:** How long equipment typically stays in a zone before moving again. Long dwell times in clinical areas may mean equipment is being hoarded.

## What is this?
Zone Average Dwell Time measures how long a piece of equipment remains in a given zone from when it first arrives to when it next moves out. In clinical areas, short dwell times are desirable — equipment should flow between patients and departments efficiently. Unusually long dwell times in active clinical zones are a primary indicator of hoarding or inefficient return processes. The value is stored as a text field in the zones table.

## Formula
```
Zone Avg Dwell Time = AVG(time between first_seen and last_seen events
                          per asset per zone visit)

Stored as text in: zones.avg_dwell_time
```

**Example:** Emergency Room average dwell time = 1.1 hours (equipment turns over rapidly between patients). Radiology = 12.6 hours (equipment brought in is staying far longer than needed).

## Data Source
| | |
|---|---|
| Table(s) | `zones` |
| Column(s) | `avg_dwell_time` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Clinical zones: <4 hours | ✅ Good | Equipment is flowing normally |
| Clinical zones: 4–8 hours | ⚠️ Review | Watch for repeat patterns; speak with unit staff |
| Clinical zones: >8 hours | 🚨 Critical | Likely hoarding — initiate redistribution conversation |
| Storage zones: any value | ✅ Good | Expected behavior for storage areas |

## Notes for non-technical users
The Emergency Room's 1.1-hour dwell time is the ideal — equipment is used and returned quickly. Radiology at 12.6 hours suggests equipment is not being returned promptly after procedures. Start a conversation with the Radiology team about creating a return process for shared equipment.
