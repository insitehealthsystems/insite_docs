# Shift Efficiency Score

> **In plain English:** An overall grade for how smoothly a nursing shift runs in terms of equipment availability. Before iLocate: 61%. After: 94%.

## What is this?
The Shift Efficiency Score is a composite index that combines multiple equipment-related workflow metrics into a single operational health score for a nursing shift. It aggregates search time, escalation call frequency, peer interruptions, and equipment turnaround time into one number that gives unit managers and nursing leadership an at-a-glance measure of how effectively equipment is supporting patient care operations during each shift. The dramatic improvement from 61% to 94% represents the combined effect of all iLocate's workflow benefits.

## Formula
```
Shift Efficiency Score = composite of:
  - Equipment search time (per shift)
  - Escalation call frequency
  - Peer interruption count
  - Equipment turnaround time

Stored as before/after values in: workflow_metrics
WHERE metric_name = 'Shift Efficiency Score'
```

**Example:** A shift with <6 min search time, <1 escalation call, <3 interruptions, and <15 min turnaround scores in the "Excellent" range.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Shift Efficiency Score'` |
| Computed by | Composite backend calculation; stored before/after values |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥90% | ✅ Good | Excellent operational efficiency |
| 75–89% | ⚠️ Review | Some friction points remain — identify which sub-metrics are dragging the score |
| <75% | 🚨 Critical | Operational review needed — multiple workflow metrics are underperforming |

## Notes for non-technical users
Share this score with unit managers during monthly reviews to demonstrate operational improvement over time. A score above 90% means that from an equipment perspective, the shift is running as smoothly as it possibly can — nurses are spending their time on patients, not equipment searches.
