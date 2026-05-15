# Department Utilization

> **In plain English:** What percentage of equipment assigned to a department is actually being actively used.

## What is this?
Department Utilization calculates the average utilization percentage across all assets attributed to each department, grouped and displayed side by side. It lets operations managers compare departments at a glance and quickly identify which units are using their equipment efficiently and which are accumulating assets they are not fully using. This metric is the foundation of the hoarding detection logic and redistribution recommendations.

## Formula
```
Department Utilization = ROUND(AVG(utilization_percentage))
                         GROUP BY department_id

Joined from: assets (utilization_percentage, department_id)
             departments (name, color)
```

**Example:** If the ICU has 40 assets and their average `utilization_percentage` is 84%, the ICU shows 84% on the department bar chart. If General Surgery has 55 assets averaging 48%, that department is a redistribution candidate.

## Data Source
| | |
|---|---|
| Table(s) | `assets`, `departments` |
| Column(s) | `assets.utilization_percentage`, `assets.department_id`, `departments.name`, `departments.color` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥80% | ✅ Good | Department is using its equipment optimally |
| 60–79% | ⚠️ Review | Some idle assets — consider whether count is appropriate for patient load |
| <60% | 🚨 Critical | Potential hoarding — cross-reference with asset count and patient volume |

## Notes for non-technical users
A department can have high utilization AND be hoarding — if they have far more assets than peer departments with similar patient loads. Always compare both utilization percentage and total asset count together before drawing conclusions.
