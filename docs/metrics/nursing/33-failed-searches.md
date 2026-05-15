# Failed Equipment Searches

> **In plain English:** How many times per day a nurse searched for equipment and gave up or couldn't find it. Before iLocate: 11.3/day. After: 1.2/day.

## What is this?
Failed Equipment Searches counts the number of search sessions per day that end without the nurse locating the asset they needed. A failed search has immediate consequences: the nurse must either borrow from another department (disrupting that department's inventory), delay a procedure, or in urgent cases, compromise care timing. The near-90% reduction from 11.3 to 1.2 failures per day is one of the most impactful outcomes of iLocate and represents a direct patient safety improvement.

## Formula
```
Failed Search Improvement % = ((Before − After) / Before) × 100
                            = ((11.3 − 1.2) / 11.3) × 100 = 89%

Stored in: workflow_metrics WHERE metric_name = 'Failed Equipment Searches'
```

**Example:** At 1.2 failures per day, there is roughly 1 failed search per day across the entire facility — compared to more than 11 per day before implementation.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Failed Equipment Searches'` |
| Computed by | Stored before/after values; improvement % computed by backend |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <2 per day | ✅ Good | Excellent system performance |
| 2–5 per day | ⚠️ Review | Investigate which zones or asset types are failing most often |
| >5 per day | 🚨 Critical | Sensor coverage issue — report to IT for coverage assessment |

## Notes for non-technical users
A failed search means a nurse either had to borrow from another department or, in the worst case, delayed patient care. This is the highest-impact metric to watch on a daily basis. If you see this number creeping up, it is worth investigating before it affects patient outcomes.
