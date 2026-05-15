# Asset Recovery Examples

> **In plain English:** The number of specific cases during the pilot where iLocate directly helped recover equipment that would otherwise have been written off as lost or required a replacement purchase.

## What is this?
Asset Recovery Examples is a manually maintained count of confirmed incidents during the pilot period where iLocate's location data led directly to the physical recovery of an asset that would otherwise have been written off as lost or required a replacement purchase. Each confirmed recovery represents a concrete, documented return on investment. Because medical equipment can range from a few hundred dollars to tens of thousands, even a single high-value recovery can justify the entire pilot program cost.

## Formula
```
Recovery Examples = manually logged count of confirmed recovery incidents

Stored in: metrics table
WHERE metric_key = 'pilot_recovery_examples'
```

**Example:** If iLocate identified a portable ventilator that had not been seen for 5 days as located in an unused procedure room, and the asset was physically retrieved, that is 1 confirmed recovery. At $22,000 replacement value, that single recovery may exceed the monthly cost of the iLocate subscription.

## Data Source
| | |
|---|---|
| Table(s) | `metrics` |
| Column(s) | `metric_value` WHERE `metric_key = 'pilot_recovery_examples'` |
| Computed by | Manually updated by iLocate administrator as recoveries are confirmed |

## Thresholds
| Value | Status | Action |
|---|---|---|
| ≥1 high-value recovery | ✅ Good | ROI case is made — document for board report |
| Any recovery | ✅ Good | Each recovery is an avoided cost worth documenting |
| 0 recoveries | ⚠️ Review | Verify the "Potentially Lost" alert list is being acted on |

## Notes for non-technical users
Document each recovery case with the asset type, last known location before recovery, and the estimated replacement cost. Even one recovery of a high-value item like a ventilator ($20,000+) can justify the entire pilot investment. This documentation is essential for your board report and contract renewal discussions.
