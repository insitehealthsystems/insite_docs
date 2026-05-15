# Equipment Turnaround Time

> **In plain English:** How long it takes from when one patient is done using equipment to when the next patient can get it. Before iLocate: 38 minutes. After: 12 minutes.

## What is this?
Equipment Turnaround Time measures the elapsed time between a piece of equipment being finished with one patient and it becoming available and ready for the next. This window includes the time the equipment sits in a used/dirty state, transport to cleaning, the cleaning or sterilization process, and the time back to a storage or staging area where iLocate can show it as available. Shortening this cycle directly increases effective equipment supply without purchasing any additional items.

## Formula
```
Turnaround Improvement % = ((Before − After) / Before) × 100
                         = ((38 − 12) / 38) × 100 = 68%

Stored as before/after values in: workflow_metrics
WHERE metric_name = 'Equipment Turnaround Time'
```

**Example:** A fleet of 50 IV pumps with a 38-minute turnaround has an effective capacity much lower than 50 units at any moment. Reducing to 12 minutes effectively increases available capacity by over 20%.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Equipment Turnaround Time'` |
| Computed by | Stored before/after values; improvement % computed by backend |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <15 minutes | ✅ Good | Excellent — equipment is cycling quickly between patients |
| 15–25 minutes | ⚠️ Review | Review cleaning and transport workflows for bottlenecks |
| >25 minutes | 🚨 Critical | Cleaning or transport workflow issue — investigate with EVS and transport teams |

## Notes for non-technical users
Slow turnaround often means equipment sits in a patient room in a used state waiting to be collected for cleaning. iLocate can alert staff when a piece of equipment has been stationary in a patient room for too long — use this feature to trigger timely collection and reduce turnaround delays.
