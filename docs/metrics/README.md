# iLocate Dashboard Metrics Reference

Complete reference documentation for all metrics displayed in the iLocate hospital asset tracking dashboard. Metrics are organized by dashboard tab.

---

## Executive Tab
_High-level KPIs for hospital leadership, finance, and operations management._

| # | Metric | Description |
|---|--------|-------------|
| 01 | [Total Tracked Assets](./executive/01-total-assets.md) | Count of all medical equipment items currently tracked by iLocate sensors |
| 02 | [Active Assets (Moving)](./executive/02-active-assets.md) | Number of assets with recent movement — currently in use or used recently |
| 03 | [Utilization Rate](./executive/03-utilization-rate.md) | Fleet-wide average percentage of time equipment is actively in use |
| 04 | [Assets Potentially Lost](./executive/04-potentially-lost.md) | Equipment with no sensor contact for more than 72 hours |
| 05 | [Estimated Monthly Labor Savings](./executive/05-monthly-labor-savings.md) | Dollar value of nursing time saved each month through faster equipment searches |
| 06 | [Estimated Annual Labor Savings](./executive/06-annual-labor-savings.md) | Full-year projection of nursing labor savings for board and budget use |
| 07 | [Avoided Equipment Purchases](./executive/07-avoided-purchases.md) | Capital cost avoided by redistributing existing underutilized assets instead of buying new |
| 08 | [Search Time Reduction](./executive/08-search-time-reduction.md) | Percentage improvement in equipment search time since iLocate was installed |
| 09 | [Availability Score](./executive/09-availability-score.md) | How reliably equipment is available where and when staff need it (30-day rolling) |
| 10 | [Distribution Efficiency](./executive/10-distribution-efficiency.md) | How evenly equipment is spread across departments relative to patient demand |
| 11 | [ROI Trend Chart](./executive/11-roi-trend.md) | Month-by-month bar chart of labor savings and avoided equipment purchases |

---

## Operations Tab
_Zone-level and department-level metrics for facilities and operations managers._

| # | Metric | Description |
|---|--------|-------------|
| 12 | [Zone Efficiency Score](./operations/12-zone-efficiency-score.md) | Composite rating of how well equipment flows through each hospital zone |
| 13 | [Zone Average Dwell Time](./operations/13-zone-dwell-time.md) | How long equipment typically stays in a zone before moving — long dwell in clinical areas flags hoarding |
| 14 | [Zone Traffic Volume](./operations/14-zone-traffic-volume.md) | High / Medium / Low classification of how busy each zone is based on daily movement events |
| 15 | [Department Utilization](./operations/15-department-utilization.md) | Average utilization percentage of assets attributed to each department |
| 16 | [Hoarding Detection Flag](./operations/16-hoarding-detection.md) | Automated HOARDING badge triggered when a department has low utilization and a large asset count |

---

## Assets Tab
_Individual asset health, classification, and capital planning metrics._

| # | Metric | Description |
|---|--------|-------------|
| 17 | [High Utilization Count](./assets/17-high-utilization-count.md) | Number of assets classified as high utilization (≥85%) — the hardest-working items in the fleet |
| 18 | [Low / Idle Count](./assets/18-low-idle-count.md) | Number of assets barely or never used — primary candidates for redistribution |
| 19 | [Asset Utilization Classification](./assets/19-asset-classification.md) | Automatic High / Normal / Low / Idle label assigned to every asset based on utilization percentage |
| 20 | [Over-Purchased Asset Types](./assets/20-over-purchased-types.md) | Count of equipment categories where the entire type averages below 40% utilization |
| 21 | [Redistributable Equipment Units](./assets/21-redistributable-units.md) | Exact count of individual items that could be moved from idle departments to departments in need |
| 22 | [Estimated Avoided Purchase Value](./assets/22-avoided-purchase-value.md) | Total dollar value of equipment not purchased this fiscal year due to redistribution |

---

## Nursing Tab
_Frontline operational metrics measuring nurse experience and workflow efficiency._

| # | Metric | Description |
|---|--------|-------------|
| 23 | [Average Search Duration](./nursing/23-avg-search-duration.md) | Mean time from initiating an equipment search to the asset being located |
| 24 | [Successful Search Rate](./nursing/24-search-success-rate.md) | Percentage of equipment searches that end with the nurse finding what they needed |
| 25 | [Proximity Accuracy](./nursing/25-proximity-accuracy.md) | How often iLocate's predicted location is within one room of where the asset is found |
| 26 | [Time-to-Asset](./nursing/26-time-to-asset.md) | Total time from opening the iLocate app to having the equipment physically in hand |
| 27 | [Availability Confidence](./nursing/27-availability-confidence.md) | How reliably an asset reported as "available" is actually available when a nurse arrives |
| 28 | [Nursing Interruptions Reduced](./nursing/28-nursing-interruptions.md) | Reduction in per-shift interruptions caused by colleagues asking for help locating equipment |
| 29 | [Time Away from Patients (Equipment Search)](./nursing/29-time-away-patients.md) | Minutes per shift spent away from the bedside searching for equipment — before vs. after |
| 30 | [Equipment Escalation Calls](./nursing/30-equipment-escalation-calls.md) | Daily count of times nurses escalated to a supervisor to help locate critical equipment |
| 31 | [Shift Efficiency Score](./nursing/31-shift-efficiency-score.md) | Composite operational health score for nursing shifts based on equipment-related workflow metrics |
| 32 | [Equipment Turnaround Time](./nursing/32-equipment-turnaround-time.md) | Time from one patient finishing with equipment to it being available for the next patient |
| 33 | [Failed Equipment Searches](./nursing/33-failed-searches.md) | Number of searches per day that end without the nurse finding the needed asset |
| 34 | [Labor Savings Calculation](./nursing/34-labor-savings-formula.md) | The underlying formula converting search time savings into annual dollar figures |

---

## Pilot Tab
_Metrics and status tracking specific to the iLocate pilot program and expansion roadmap._

| # | Metric | Description |
|---|--------|-------------|
| 35 | [Coverage Zones](./pilot/35-coverage-zones.md) | Count of hospital areas with active iLocate sensors installed and transmitting |
| 36 | [Movement Events Captured](./pilot/36-movement-events.md) | Total sensor-detected asset movement events logged during the pilot period |
| 37 | [Asset Recovery Examples](./pilot/37-recovery-examples.md) | Confirmed cases where iLocate directly enabled recovery of a lost or missing asset |
| 38 | [Expansion Phase Status](./pilot/38-pilot-phases.md) | Roadmap of post-pilot expansion phases with impact ratings and current status |

---

## Search Analytics Tab
_Live search behaviour from the `asset_search_history` table — every row is one nurse search event._

| # | Metric | Description |
|---|--------|-------------|
| 39 | [Total Searches](./search/39-total-searches.md) | Count of all search events in the selected time window |
| 40 | [Success Rate](./search/40-success-rate.md) | Percentage of searches where the asset was successfully located |
| 41 | [No-Results Rate](./search/41-no-results-rate.md) | Percentage of searches that returned zero candidate assets |
| 42 | [Top Source](./search/42-top-source.md) | The channel (mobile / kiosk / web) generating the most searches |
| 43 | [Most Searched Asset Types](./search/43-most-searched-types.md) | Ranked list of search terms by volume with per-type success rate |
| 44 | [Per-Type Success Rate](./search/44-per-type-success-rate.md) | Found-rate per asset type — highlights which types are hard to locate |
| 45 | [Source Breakdown](./search/45-source-breakdown.md) | Share of searches by channel with Found / Failed / No-Results split |
| 46 | [Daily Search Volume Trend](./search/46-daily-volume-trend.md) | 14-day bar chart of search activity |
| 47 | [Recent Searches Feed](./search/47-recent-searches.md) | Last 25 raw search events — term, source, result, location, time |

---

## Time Range Modifier
_Applies to: Active Assets, Inactive, High/Low Util counts, Alerts, and all Search Analytics metrics._

| Selector | Window | Hours |
|---|---|---|
| Daily | Last 24 hours | 24 |
| Weekly | Last 7 days | 168 |
| Monthly _(default)_ | Last 30 days | 720 |
| Quarterly | Last 90 days | 2160 |

See [FORMULAS.md — Time Range Modifier](./FORMULAS.md#time-range-modifier) for the full SQL pattern.

---

## Quick Reference: Data Sources

| Table | Used By |
|-------|---------|
| `assets` | 01, 02, 04, 15, 16, 17, 18, 19, 20, 21 |
| `departments` | 15, 16 |
| `zones` | 12, 13, 14 |
| `metrics` | 03, 05, 06, 07, 08, 09, 10, 22, 23, 24, 25, 26, 27, 35, 36, 37 |
| `labor_calc_params` | 05, 06, 08, 34 |
| `roi_history` | 11 |
| `workflow_metrics` | 28, 29, 30, 31, 32, 33 |
| `pilot_phases` | 38 |
| `asset_search_history` | 39, 40, 41, 42, 43, 44, 45, 46, 47 |
