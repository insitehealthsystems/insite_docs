# Equipment Escalation Calls

> **In plain English:** How many times per day nurses had to call a supervisor or charge nurse to help find critical equipment. Before iLocate: 4.4/day. After: 0.8/day.

## What is this?
Equipment Escalation Calls counts the number of times per day that a frontline nurse had to escalate to a supervisor, charge nurse, or biomedical staff to help locate a piece of equipment that could not be found through normal channels. Escalation calls represent a breakdown in equipment availability — they consume supervisor time, delay care, and signal that staff are not confident in the system. A dramatic reduction in this metric demonstrates both system effectiveness and growing staff trust.

## Formula
```
Escalation Improvement % = ((Before − After) / Before) × 100
                         = ((4.4 − 0.8) / 4.4) × 100 = 82%

Stored in: workflow_metrics WHERE metric_name = 'Equipment Escalation Calls'
```

**Example:** At 0.8 calls per day, the charge nurse spends an estimated 5–8 minutes per day on equipment-related escalations instead of the 35–45 minutes they spent before iLocate.

## Data Source
| | |
|---|---|
| Table(s) | `workflow_metrics` |
| Column(s) | `metric_name = 'Equipment Escalation Calls'` |
| Computed by | Stored before/after values; improvement % computed by backend |

## Thresholds
| Value | Status | Action |
|---|---|---|
| <1 per day | ✅ Good | System is effective and staff are self-sufficient |
| 1–2 per day | ⚠️ Review | Occasional gaps — monitor for patterns by time of day or department |
| >3 per day | 🚨 Critical | Systemic availability problem — review sensor coverage and staff training |

## Notes for non-technical users
High escalation call counts are a sign that staff don't yet fully trust the system to find what they need. Additional training sessions — especially for newer staff — can significantly reduce this number. When the system consistently delivers accurate results, staff stop escalating and start self-serving.
