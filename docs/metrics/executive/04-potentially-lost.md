# Assets Potentially Lost

> **In plain English:** Equipment that hasn't been seen by any sensor for more than 72 hours — it may be misplaced, stolen, or broken.

## What is this?
Assets Potentially Lost flags every item whose last recorded sensor contact is older than 72 hours AND whose status is not classified as actively in use. These assets have effectively gone dark — the system cannot locate them. They may be in a sensor-blind area, powered off, physically removed from the facility, or broken. This count should be as close to zero as possible at all times.

## Formula
```
Assets Potentially Lost = COUNT(*) WHERE last_seen < NOW() - 72 hours
                          AND status NOT IN ('high', 'normal')
```

**Example:** If 4 assets have not been detected since Tuesday and it is now Friday, all 4 appear in this count. Each one warrants a manual physical search.

## Data Source
| | |
|---|---|
| Table(s) | `assets` |
| Column(s) | `last_seen`, `status` |
| Computed by | Backend / Database query |

## Thresholds
| Value | Status | Action |
|---|---|---|
| 0 | ✅ Good | All assets are visible to sensors |
| 1–3 | ⚠️ Review | Investigate last known locations; conduct physical search |
| >3 | 🚨 Critical | Escalate to biomedical and security; assess for theft or sensor failure |

## Notes for non-technical users
Click "View All" in the alerts panel to see which specific items are missing and where they were last seen. Start your physical search in the last known zone before expanding the search to adjacent areas.
