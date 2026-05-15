# Time Away from Patients (Equipment Search)

> **In plain English:** Before iLocate, nurses spent 18 minutes per shift walking around looking for equipment. After iLocate, this dropped to 5.8 minutes.

## What is this?
Time Away from Patients measures how many minutes per shift a nurse spends away from the bedside specifically because they are searching for equipment. This time is entirely non-productive from a patient care perspective — it does not include transport, documentation, or other necessary away-from-patient activities. Reducing this number is one of the most direct ways iLocate improves patient safety and nurse satisfaction. The improvement percentage benchmarks the current average against the pre-implementation baseline.

## Formula
```
Time Away Improvement % = ((Before − After) / Before) × 100
                        = ((18 − 5.8) / 18) × 100 = 68%

Stored in: workflow_metrics WHERE metric_name = 'Time Away from Patients (search)'
```

**Example:** A floor with 12 nurses each saving 12.2 minutes per shift recovers over 2.4 hours of patient-facing care time per shift, per floor.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Time Away from Patients (search)'` |
| Computed by | Stored before/after values; improvement % computed by backend |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <6 min/shift | ✅ Good | Excellent — minimal time lost to equipment searches |
| 6–10 min/shift | ⚠️ Review | Coverage gaps or adoption issues in specific units |
| >10 min/shift | 🚨 Critical | Systematic problem — conduct unit-level investigation |

## Notes for non-technical users
Every minute saved on equipment search is a minute nurses can spend with patients. Track this metric by unit and share it with unit managers as evidence of operational improvement — it is a compelling number for nursing leadership and Joint Commission reviews.
