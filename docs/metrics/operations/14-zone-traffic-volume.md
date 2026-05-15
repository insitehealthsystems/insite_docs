# Zone Traffic Volume

> **In plain English:** How busy a zone is — how many different pieces of equipment move in and out during a day.

## What is this?
Zone Traffic Volume categorizes each zone by how frequently equipment moves through it within a 24-hour window. Zones are classified as High, Medium, or Low traffic based on movement event counts. This classification helps operations managers prioritize monitoring attention and sensor placement. High-traffic zones need the most reliable sensor coverage because errors in high-traffic areas affect the most assets. Low-traffic zones with unusually high asset counts are prime redistribution candidates.

## Formula
```
Zone Traffic Volume = categorical label (High / Medium / Low)
                      based on movement event count per 24h window

Stored directly in: zones.traffic_volume
```

**Example:** The ICU is classified as High traffic because dozens of assets move through it each day. A storage corridor is classified as Low traffic because assets enter and rarely leave.

## Data Source
| | |
|---|---|
| Table(s) | `zones` |
| Column(s) | `traffic_volume` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| High traffic zone, adequate asset flow | ✅ Good | Monitor sensor coverage; ensure sufficient equipment supply |
| Low traffic zone with high asset count | ⚠️ Review | Potential redistribution opportunity — assets sitting unused |
| High traffic zone with frequent sensor misreads | 🚨 Critical | Sensor calibration or additional sensor placement needed |

## Notes for non-technical users
High-traffic zones need the most sensor coverage to maintain location accuracy. If a zone is classified as High but your team frequently cannot find equipment there, that is a signal to request additional sensor installation from your IT team.
