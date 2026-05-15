# Distribution Efficiency

> **In plain English:** How evenly equipment is spread across departments relative to demand.

## What is this?
Distribution Efficiency measures how balanced equipment allocation is across the hospital. It uses the ratio of variability to the average — if all departments have similar utilization rates, efficiency is high. If one department has far more equipment than it is using while another is starved of resources, the standard deviation rises and efficiency falls. This metric is the primary signal for whether the hospital's equipment is flowing where it is actually needed.

## Formula
```
Distribution Efficiency = (1 − (Standard Deviation of Department Utilization
                           / Mean Department Utilization)) × 100
```

**Example:** If department utilization rates are 82%, 78%, 85%, and 80%, the mean is 81.25% and the standard deviation is low, yielding a high efficiency score near 90%+. If one department is at 20% while others are at 80%, the score drops sharply.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'kpi_distribution_eff'` AND `metric_key = 'health_distribution'` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥85% | ✅ Good | Equipment is well-distributed across departments |
| 70–84% | ⚠️ Review | Some imbalance exists — identify and address outlier departments |
| <70% | 🚨 Critical | Hoarding is likely — check Operations tab for HOARDING badges |

## Notes for non-technical users
If this score is low, check the Operations tab — departments with the HOARDING badge are pulling the score down. Addressing even one hoarding department can significantly improve this score and free up equipment for the rest of the hospital.
