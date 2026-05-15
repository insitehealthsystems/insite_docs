# Expansion Phase Status

> **In plain English:** The roadmap of what comes next after the pilot — from expanding to more floors, to integrating with your electronic health records.

## What is this?
Expansion Phase Status displays the structured roadmap of planned iLocate enhancements and expansion steps following the initial pilot. Each phase has a label, a description of what it entails, a projected impact rating (High or Medium), and a current status (Ready or Backlog). The impact rating is derived from pilot data — phases that will generate the most measurable ROI are rated High. This view helps hospital leadership and the iLocate project team prioritize which expansions to fund and schedule first.

## Formula
```
No calculation — status is manually updated by iLocate project manager

Stored in: pilot_phases table
Columns: phase_label, description, impact, status
```

**Example:** "Expand to Floor 4 West" with impact = High and status = Ready means the pilot data supports this expansion and it is cleared for scheduling. A status of Backlog means it is planned but not yet resourced.

## Data Source
| | |
|---|---|
| Table(s) | `pilot_phases` |
| Column(s) | `phase_label`, `description`, `impact`, `status` |
| Computed by | Manually updated by iLocate project manager |

## Thresholds
| Value | Status | Action |
|---|---|---|
| Multiple phases at "Ready" | ✅ Good | Expansion pipeline is healthy — prioritize High impact phases |
| All phases in "Backlog" | ⚠️ Review | Expansion may be stalling — schedule planning meeting with iLocate PM |
| High-impact phases not moving to "Ready" | 🚨 Critical | Escalate to leadership — budget or resource allocation may be blocking progress |

## Notes for non-technical users
The "Impact" badge (High or Medium) is based on projected ROI from the pilot data. High-impact phases should be prioritized in budget planning conversations. Work with your iLocate project manager to move High-impact phases from Backlog to Ready status as quickly as your organization's planning cycle allows.
