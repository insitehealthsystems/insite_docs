# Nursing Interruptions Reduced

> **In plain English:** Before iLocate, nurses were interrupted an average of 6.2 times per shift to help locate equipment. After iLocate, that dropped to 2.1 times per shift.

## What is this?
Nursing Interruptions Reduced tracks how often a nurse is pulled away from a task or patient to assist a colleague in locating equipment. Each interruption breaks concentration, extends task completion times, and reduces time at the bedside. iLocate reduces these peer-to-peer location requests because staff can self-serve through the app rather than asking a colleague who might know where a piece of equipment was last seen. The improvement percentage compares pre- and post-implementation rates.

## Formula
```
Interruption Improvement % = ((Before − After) / Before) × 100
                            = ((6.2 − 2.1) / 6.2) × 100 = 66%

Stored in: workflow_metrics WHERE metric_name = 'Reduced Nursing Interruptions'
```

**Example:** A 12-hour shift that previously had 6 equipment-related interruptions now averages 2, freeing up approximately 20–30 minutes of focused care time per nurse per shift.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Reduced Nursing Interruptions'` |
| Computed by | Stored before/after values; improvement % computed by backend |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <3 interruptions/shift | ✅ Good | Excellent — staff are using iLocate effectively |
| 3–6 interruptions/shift | ⚠️ Review | Investigate whether staff are consistently using the app |
| >6 interruptions/shift | 🚨 Critical | System adoption may have declined — consider refresher training |

## Notes for non-technical users
Fewer interruptions mean more time at the bedside and better concentration during complex patient care tasks. This directly improves patient care quality and reduces the risk of care errors caused by distraction.
