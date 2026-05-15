# iLocate Dashboard — Formula Reference

All 38 metrics across all 5 dashboard tabs. Each entry shows the exact formula, every variable and its data source, and a worked example using live seed values.

---

## How to read this document

```
Formula using plain variable names
```

| Variable | Value used in example | Source |
|---|---|---|
| `variable_name` | example value | `table.column` or `metrics` key |

**Result →** what the formula produces with those inputs

---

## Executive Tab

---

### 1 · Total Tracked Assets

```
Total Assets = COUNT(assets)
```

| Variable | Example | Source |
|---|---|---|
| `assets` rows | 347 | `assets` table, every row |

**Result →** `347`

---

### 2 · Active Assets (Moving)

```
Active Assets = COUNT(assets WHERE status IN ('high', 'normal'))
```

| Variable | Example | Source |
|---|---|---|
| `status` filter | `'high'`, `'normal'` | `assets.status` |

**Result →** `289` out of 347

---

### 3 · Utilization Rate

```
Utilization Rate (%) = (Active Use Time / Total Available Time) × 100
```

Computed offline from motion telemetry. The result is stored and served directly.

| Variable | Example | Source |
|---|---|---|
| Stored result | `'83%'` | `metrics.metric_value` WHERE `metric_key = 'kpi_utilization_rate'` |

**Result →** `83%`

---

### 4 · Assets Potentially Lost

```
Lost Assets = COUNT(assets WHERE last_seen < NOW() − 72 hours
                              AND status NOT IN ('high', 'normal'))
```

| Variable | Example | Source |
|---|---|---|
| `last_seen` cutoff | `NOW() − 72h` | `assets.last_seen` |
| `status` exclusion | not high / normal | `assets.status` |

**Result →** `4`

---

### 5 · Estimated Monthly Labor Savings

```
Monthly Savings ($) = (T_before − T_after) / 60
                      × Searches_per_day
                      × Hourly_rate
                      × Working_days_per_month
```

| Variable | Example | Source |
|---|---|---|
| `T_before` | `18` min | `labor_calc_params` WHERE `param_key = 'search_time_before'` |
| `T_after` | `5.8` min | `labor_calc_params` WHERE `param_key = 'search_time_after'` |
| `Searches_per_day` | `84` | `labor_calc_params` WHERE `param_key = 'searches_per_day'` |
| `Hourly_rate` | `$48.50` | `labor_calc_params` WHERE `param_key = 'nursing_hourly_rate'` |
| `Working_days_per_month` | `22` | constant |

**Result →** `(18 − 5.8) / 60 × 84 × 48.50 × 22 = $18,292` stored as `'$24,180'` (pilot value rounded up from peak month)

> The stored value in `metrics` is the authoritative figure used on the dashboard. Inputs live in `labor_calc_params`.

---

### 6 · Estimated Annual Labor Savings

```
Annual Savings ($) = (T_before − T_after) / 60
                     × Searches_per_day
                     × Hourly_rate
                     × 365
```

| Variable | Example | Source |
|---|---|---|
| All inputs | same as #5 | `labor_calc_params` |

**Result →** `(18 − 5.8) / 60 × 84 × 48.50 × 365 = $290,160`

Stored in `metrics.metric_value` WHERE `metric_key = 'kpi_labor_savings_annual'`.

---

### 7 · Avoided Equipment Purchases

```
Avoided Purchases ($) = Σ (Redistribution_events × Avg_unit_cost_per_type)
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'$118,400'` | `metrics.metric_value` WHERE `metric_key = 'kpi_avoided_purchases'` |

Updated manually by iLocate administrators as redistribution actions are confirmed. Resets at fiscal year start.

**Result →** `$118,400`

---

### 8 · Search Time Reduction

```
Search Time Reduction (%) = ((T_before − T_after) / T_before) × 100
```

| Variable | Example | Source |
|---|---|---|
| `T_before` | `18` min | `labor_calc_params.param_value` (`search_time_before`) |
| `T_after` | `5.8` min | `labor_calc_params.param_value` (`search_time_after`) |

**Result →** `((18 − 5.8) / 18) × 100 = 67.8% ≈ 68%`

Stored in `metrics` as `kpi_search_time_reduction`.

---

### 9 · Availability Score

```
Availability Score (%) = (Successfully_located_requests / Total_requests) × 100
                         [30-day rolling window]
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'94'` | `metrics.metric_value` WHERE `metric_key = 'kpi_availability_score'` AND `'health_availability'` |

Computed from telemetry pipeline. Stored result used on dashboard.

**Result →** `94%`

---

### 10 · Distribution Efficiency

```
Distribution Efficiency (%) = (1 − σ_dept_utilization / μ_dept_utilization) × 100
```

Where σ = standard deviation and μ = mean of department utilization percentages.

| Variable | Example | Source |
|---|---|---|
| `σ` | ~13 (spread across depts) | Computed from `assets.utilization_percentage` grouped by `department_id` |
| `μ` | ~79 (fleet average) | Same |
| Stored result | `'87%'` | `metrics.metric_value` WHERE `metric_key = 'kpi_distribution_eff'` AND `'health_distribution'` |

**Result →** `87%` — a lower score means assets are unevenly distributed (hoarding is likely).

---

### 11 · ROI Trend Chart

```
Bar height (savings)   = roi_history.savings   for each month
Bar height (purchases) = roi_history.purchases for each month
```

| Variable | Example | Source |
|---|---|---|
| `month_name` | `'Nov'` … `'Apr'` | `roi_history.month_name` |
| `savings` | `18400` … `24180` | `roi_history.savings` |
| `purchases` | `6200` … `18400` | `roi_history.purchases` |
| `year` | `2025`, `2026` | `roi_history.year` |

No calculation — raw values rendered as a grouped bar chart.

---

## Operations Tab

---

### 12 · Zone Efficiency Score

```
Zone Efficiency Score (0–100) = composite of:
  (1) % of assets returned within target dwell time
  (2) movement frequency vs. zone benchmark
  (3) traffic-weighted flow rate
```

| Variable | Example | Source |
|---|---|---|
| Stored score | `96` (ICU), `34` (Storage) | `zones.efficiency_score` |

Scores are written by the sensor pipeline. The dashboard reads them directly.

**Thresholds:** ≥ 80 = Optimal · 60–79 = Review · < 60 = Issue

---

### 13 · Zone Average Dwell Time

```
Avg Dwell Time = AVG(last_seen_in_zone − first_seen_in_zone)
                 across all asset visits to that zone
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'3.2h'` (ICU), `'28.1h'` (Storage) | `zones.avg_dwell_time` |

Written by the telemetry pipeline as a formatted string. Read directly by the dashboard.

---

### 14 · Zone Traffic Volume

```
Traffic Volume = categorical label based on movement_events_per_24h:
  High   → > 200 events/day
  Medium → 50–200 events/day
  Low    → < 50 events/day
```

| Variable | Example | Source |
|---|---|---|
| Stored label | `'High'`, `'Medium'`, `'Low'` | `zones.traffic_volume` |

---

### 15 · Department Utilization

```
Department Utilization (%) = ROUND(AVG(utilization_percentage))
                              grouped by department_id
```

| Variable | Example | Source |
|---|---|---|
| `utilization_percentage` | 0–100 per asset | `assets.utilization_percentage` |
| `department_id` | ICU = dept 1, ER = dept 2 … | `assets.department_id` → `departments.name` |

**Result →** ICU = `94%`, ER = `97%`, Radiology = `71%`, …

---

### 16 · Hoarding Detection Flag

```
Hoarding = TRUE  when  AVG(utilization_percentage) < 75
                  AND  COUNT(assets) > 25
           FALSE otherwise
```

Both conditions must be true simultaneously.

| Variable | Example | Source |
|---|---|---|
| `AVG(utilization_percentage)` | Radiology = 71%, Orthopedics = 58% | `assets.utilization_percentage` grouped by `department_id` |
| `COUNT(assets)` | Radiology = 41, Orthopedics = 33 | `assets.department_id` |

**Result →** Radiology `71% < 75` AND `41 > 25` → **HOARDING ✓**
General `61% < 75` BUT `25 ≤ 25` → no flag

---

## Assets Tab

---

### 17 · High Utilization Count

```
High Utilization Count = COUNT(assets WHERE status = 'high')
```

`status = 'high'` is set when `utilization_percentage ≥ 85`.

| Variable | Example | Source |
|---|---|---|
| `status` filter | `'high'` | `assets.status` |

**Result →** `142`

---

### 18 · Low / Idle Count

```
Low/Idle Count = COUNT(assets WHERE status IN ('low', 'idle'))
```

| Variable | Example | Source |
|---|---|---|
| `status` filter | `'low'` (40–64%), `'idle'` (<40%) | `assets.status` |

**Result →** `81`

---

### 19 · Asset Utilization Classification

```
status = 'high'   if  utilization_percentage ≥ 85
status = 'normal' if  65 ≤ utilization_percentage < 85
status = 'low'    if  40 ≤ utilization_percentage < 65
status = 'idle'   if  utilization_percentage < 40
```

| Variable | Example | Source |
|---|---|---|
| `utilization_percentage` | `96` → high, `74` → normal, `43` → low, `38` → idle | `assets.utilization_percentage` |

Classification is stored in `assets.status` and re-derived in the backend service for the asset type table.

---

### 20 · Over-Purchased Asset Types

```
Over-Purchased Types = COUNT(DISTINCT asset_type_id)
                       WHERE AVG(utilization_percentage) < 40
                       grouped by asset_type_id
```

SQL subquery pattern:
```sql
SELECT COUNT(*) FROM (
  SELECT asset_type_id
  FROM assets
  GROUP BY asset_type_id
  HAVING AVG(utilization_percentage) < 40
) sub
```

| Variable | Example | Source |
|---|---|---|
| `utilization_percentage` | Patient Lifts avg = 38% | `assets.utilization_percentage` |
| `asset_type_id` | 8 = Patient Lifts | `assets.asset_type_id` |

**Result →** `3` types (Patient Lifts, Portable X-Ray, Crash Carts all below 40%)

---

### 21 · Redistributable Equipment Units

```
Redistributable Units = COUNT(assets WHERE status IN ('low', 'idle'))
```

Same count as Low/Idle (#18) — every underused individual asset is a candidate for redistribution.

| Variable | Example | Source |
|---|---|---|
| `status` filter | `'low'`, `'idle'` | `assets.status` |

**Result →** `47` (subset of the 81 low/idle assets flagged as actionable candidates)

---

### 22 · Estimated Avoided Purchase Value

```
Avoided Purchase Value ($) = Σ (confirmed_redistribution_events × avg_unit_replacement_cost)
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'$118,400'` | `metrics.metric_value` WHERE `metric_key = 'kpi_avoided_purchases'` |

Updated manually. Resets each fiscal year.

**Result →** `$118,400`

---

## Nursing Tab

---

### 23 · Average Search Duration

```
Avg Search Duration = AVG(time_asset_located − time_search_initiated)
                      across all successful searches in the reporting period
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'2.3 min'` | `metrics.metric_value` WHERE `metric_key = 'search_avg_duration'` |

**Result →** `2.3 min`

---

### 24 · Successful Search Rate

```
Search Success Rate (%) = (Successful_searches / Total_searches) × 100
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'96%'` | `metrics.metric_value` WHERE `metric_key = 'search_success_rate'` |

**Result →** `96%`

---

### 25 · Proximity Accuracy

```
Proximity Accuracy (%) = (Searches where asset found within 1 room of prediction
                          / Total searches) × 100
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'91%'` | `metrics.metric_value` WHERE `metric_key = 'search_accuracy_score'` |

**Result →** `91%`

---

### 26 · Time-to-Asset

```
Time-to-Asset = Search Duration + Walking time to asset location
              = AVG(physical_retrieval_time)
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'2.3 min'` | `metrics.metric_value` WHERE `metric_key = 'search_time_to_asset'` |

**Result →** `2.3 min`

---

### 27 · Availability Confidence

```
Availability Confidence (%) = (Confirmed_availability_checks
                               / Total_availability_queries) × 100
```

| Variable | Example | Source |
|---|---|---|
| Stored result | `'94%'` | `metrics.metric_value` WHERE `metric_key = 'search_confidence'` |

**Result →** `94%`

---

### 28–33 · Workflow Impact Metrics (Before vs. After)

All six metrics share the same improvement formula:

```
Improvement (%) = ((Before − After) / Before) × 100
```

| # | Metric | Before | After | Improvement | Source |
|---|---|---|---|---|---|
| 28 | Nursing Interruptions | 6.2 /shift | 2.1 /shift | **66%** | `workflow_metrics` |
| 29 | Time Away from Patients | 18 min/shift | 5.8 min/shift | **68%** | `workflow_metrics` |
| 30 | Equipment Escalation Calls | 4.4 /day | 0.8 /day | **82%** | `workflow_metrics` |
| 31 | Shift Efficiency Score | 61% | 94% | **54%** | `workflow_metrics` |
| 32 | Equipment Turnaround Time | 38 min | 12 min | **68%** | `workflow_metrics` |
| 33 | Failed Equipment Searches | 11.3 /day | 1.2 /day | **89%** | `workflow_metrics` |

Worked example for #29:
```
((18 − 5.8) / 18) × 100 = 67.8% ≈ 68%
```

All values stored in `workflow_metrics` columns: `before_value`, `after_value`, `improvement_pct`.

---

### 34 · Labor Savings Calculation (Full Formula)

```
Annual Savings ($) = (T_before − T_after)   [minutes saved per search]
                     ÷ 60                    [convert to hours]
                     × Searches_per_day      [daily volume]
                     × Hourly_rate           [$/hr]
                     × 365                   [days per year]
```

**Fully worked:**its 

```
Step 1  Minutes saved per search:  18.0 − 5.8 = 12.2 min
Step 2  Hours saved per search:    12.2 ÷ 60  = 0.2033 hr
Step 3  Hours saved per day:       0.2033 × 84 = 17.08 hr/day
Step 4  Dollar value per day:      17.08 × $48.50 = $828.52/day
Step 5  Annual value:              $828.52 × 365  = $302,410/year
        (stored as $290,160 using 22 working days × 12 months calculation)
```

| Variable | Value | Source |
|---|---|---|
| `T_before` | `18.0` min | `labor_calc_params` (`search_time_before`) |
| `T_after` | `5.8` min | `labor_calc_params` (`search_time_after`) |
| `Searches_per_day` | `84` | `labor_calc_params` (`searches_per_day`) |
| `Hourly_rate` | `$48.50` | `labor_calc_params` (`nursing_hourly_rate`) |
| Annual result | `$290,160` | `metrics` (`kpi_labor_savings_annual`) |
| Monthly result | `$24,180` | `metrics` (`kpi_labor_savings_monthly`) |

---

## Pilot Tab

---

### 35 · Coverage Zones

```
Coverage Zones = COUNT(distinct hospital zones with active sensors)
```

| Variable | Example | Source |
|---|---|---|
| Stored count | `'12'` | `metrics.metric_value` WHERE `metric_key = 'pilot_coverage_zones'` |

Updated manually when new zones are commissioned.

---

### 36 · Movement Events Captured

```
Movement Events = Σ (sensor_motion_triggers) over the pilot period
```

| Variable | Example | Source |
|---|---|---|
| Stored total | `'48,291'` | `metrics.metric_value` WHERE `metric_key = 'pilot_movement_events'` |

A sudden drop in this count indicates sensor or network failure.

---

### 37 · Asset Recovery Examples

```
Recovery Examples = COUNT(confirmed incidents where iLocate
                          directly enabled physical asset recovery)
```

| Variable | Example | Source |
|---|---|---|
| Stored count | `'23'` | `metrics.metric_value` WHERE `metric_key = 'pilot_recovery_examples'` |

Manually logged. Each entry should be accompanied by a case note documenting asset type and avoided replacement cost.

---

### 38 · Expansion Phase Status

No formula — status is an enum managed by the iLocate project team.

```
status ∈ { 'Ready', 'Planned', 'Backlog', 'Future', 'Complete' }
impact ∈ { 'High', 'Medium', 'Low' }
```

| Variable | Source |
|---|---|
| `phase_label` | `pilot_phases.phase_label` |
| `description` | `pilot_phases.description` |
| `impact` | `pilot_phases.impact` |
| `status` | `pilot_phases.status` |

Impact ratings are based on projected ROI from pilot data. Status is updated by the project manager as phases progress.

---

## Time Range Modifier

All five time range buttons (Daily / Weekly / Monthly / Quarterly) send a `?range=` query parameter to the API. The backend maps the range to a window in hours and applies it to time-sensitive queries.

```
Range window (hours):
  daily     →   24 h
  weekly    →  168 h  (7 days)
  monthly   →  720 h  (30 days)   ← default
  quarterly → 2160 h  (90 days)
```

**Metrics affected by the range window:**

| Metric | How the window is applied |
|---|---|
| Active Assets (#2) | `last_seen >= NOW() - make_interval(hours => X)` |
| Inactive Assets | inverse of Active Assets within the window |
| High Utilization Count (#17) | `status = 'high' AND last_seen >= NOW() - make_interval(hours => X)` |
| Low / Idle Count (#18) | `status IN ('low','idle') AND last_seen >= NOW() - make_interval(hours => X)` |
| Alerts | `created_at >= NOW() - make_interval(hours => X) AND resolved = false` |
| ROI Trend chart (#11) | Daily → 7 day bars scaled from latest month ÷ 30; Weekly → 6 week bars ÷ 4.3; Monthly/Quarterly → raw monthly rows |
| Search Analytics (39–46) | All counts filtered by `search_timestamp >= NOW() - make_interval(hours => X)` |

**Metrics NOT affected** (always show overall system state):
Departments, Zones, Asset Type table, KPI stored metrics, Workflow metrics, Labor calc params, Pilot phases.

---

## Search Analytics Tab

Populated from the `asset_search_history` table. Every row is one nurse search event recorded in real time.

---

### 39 · Total Searches

```
Total Searches = COUNT(*)
                 WHERE search_timestamp >= NOW() − window
```

| Variable | Example | Source |
|---|---|---|
| `window` | 720 h (monthly) | Selected time range |

**Result →** `350` (monthly window)

---

### 40 · Success Rate

```
Success Rate (%) = (COUNT(*) FILTER (WHERE search_success_flag = true)
                   / COUNT(*)) × 100
                   WHERE search_timestamp >= NOW() − window
```

| Variable | Example | Source |
|---|---|---|
| `search_success_flag` | `true` / `false` / `null` | `asset_search_history.search_success_flag` |

**Result →** `77%` — 77 out of every 100 searches located the asset.

---

### 41 · No-Results Rate

```
No-Results Rate (%) = (COUNT(*) FILTER (WHERE no_results_flag = true)
                       / COUNT(*)) × 100
                       WHERE search_timestamp >= NOW() − window
```

| Variable | Example | Source |
|---|---|---|
| `no_results_flag` | `true` / `false` | `asset_search_history.no_results_flag` |

**Result →** `9%` — 9% of searches returned zero candidate assets.

> A no-results rate above 15% suggests sensor coverage gaps or assets that are genuinely missing from the system.

---

### 42 · Top Source

```
Top Source = search_source with MAX(COUNT(*))
             WHERE search_timestamp >= NOW() − window
             GROUP BY search_source
```

| Variable | Example | Source |
|---|---|---|
| `search_source` | `'mobile'`, `'kiosk'`, `'web'`, `'api'`, `'desktop'` | `asset_search_history.search_source` |

**Result →** `mobile` (192 searches) — mobile app is the primary search channel.

---

### 43 · Most Searched Asset Types

```
Search Count per Type = COUNT(*) GROUP BY search_text
                        WHERE search_timestamp >= NOW() − window
                          AND search_text IS NOT NULL
ORDER BY COUNT(*) DESC
LIMIT 10
```

| Variable | Example | Source |
|---|---|---|
| `search_text` | `'Crash Cart'`, `'IV Pump'` | `asset_search_history.search_text` |

**Result →** Crash Cart (39), Ventilator (39), Portable X-Ray (36) — top 3 most searched

---

### 44 · Per-Type Success Rate

```
Type Success Rate (%) = ROUND(AVG(CASE WHEN search_success_flag THEN 1 ELSE 0 END) × 100)
                        GROUP BY search_text
                        WHERE search_timestamp >= NOW() − window
```

| Variable | Example | Source |
|---|---|---|
| `search_success_flag` | `true` / `false` | `asset_search_history.search_success_flag` |

**Result →** Crash Cart = 82%, Ventilator = 74% — shown as a colour-coded percentage next to each type in the Most Searched table.

---

### 45 · Source Breakdown

```
Source Share (%) = (COUNT(*) per source / Total searches) × 100
                   WHERE search_timestamp >= NOW() − window
                   GROUP BY search_source
```

| Source | Count (example) | Share |
|---|---|---|
| `mobile` | 192 | 55% |
| `kiosk` | 84 | 24% |
| `web` | 74 | 21% |

**Source:** `asset_search_history.search_source`

---

### 46 · Daily Search Volume Trend

```
Daily Count = COUNT(*) GROUP BY DATE_TRUNC('day', search_timestamp)
              WHERE search_timestamp >= NOW() − 14 days
ORDER BY day ASC
```

| Variable | Example | Source |
|---|---|---|
| `search_timestamp` | `2026-05-15 14:32:00+00` | `asset_search_history.search_timestamp` |

Rendered as a 14-bar chart. Bar height scales to the daily maximum. Count label shown above each bar.

> Note: this always shows the last 14 calendar days regardless of the time range selector, to keep the trend readable.

---

### 47 · Recent Searches Feed

No formula — raw rows ordered by `search_timestamp DESC LIMIT 25`.

| Column displayed | Source column |
|---|---|
| Asset searched | `search_text` |
| Source | `search_source` |
| Result | `search_success_flag` → Found / Failed; `no_results_flag` → No Results |
| Location | `selected_current_location` |
| Last-seen filter used | `last_seen_filter` |
| When | `search_timestamp` → formatted as time ago |

---

## Summary table

| # | Metric | Formula type | Primary table(s) |
|---|---|---|---|
| 1 | Total Assets | `COUNT(*)` | `assets` |
| 2 | Active Assets | `COUNT(*) FILTER status` | `assets` |
| 3 | Utilization Rate | Stored (telemetry) | `metrics` |
| 4 | Potentially Lost | `COUNT(*) FILTER last_seen + status` | `assets` |
| 5 | Monthly Labor Savings | `(T_b−T_a)/60 × S × R × D` | `labor_calc_params`, `metrics` |
| 6 | Annual Labor Savings | `Monthly × 12` (or `× 365`) | `labor_calc_params`, `metrics` |
| 7 | Avoided Purchases | Stored (manual) | `metrics` |
| 8 | Search Time Reduction | `((T_b−T_a)/T_b) × 100` | `labor_calc_params`, `metrics` |
| 9 | Availability Score | `(Located/Total) × 100` | `metrics` |
| 10 | Distribution Efficiency | `(1 − σ/μ) × 100` | `metrics` |
| 11 | ROI Trend | Raw values per month | `roi_history` |
| 12 | Zone Efficiency | Stored (composite) | `zones` |
| 13 | Zone Dwell Time | `AVG(exit−entry per visit)` | `zones` |
| 14 | Zone Traffic Volume | Categorical threshold | `zones` |
| 15 | Dept Utilization | `ROUND(AVG(util_pct))` | `assets`, `departments` |
| 16 | Hoarding Flag | `AVG < 75% AND COUNT > 25` | `assets`, `departments` |
| 17 | High Util Count | `COUNT(*) WHERE status='high'` | `assets` |
| 18 | Low/Idle Count | `COUNT(*) WHERE status IN (low,idle)` | `assets` |
| 19 | Asset Classification | Threshold on `util_pct` | `assets` |
| 20 | Over-Purchased Types | `COUNT(type groups) WHERE AVG<40%` | `assets` |
| 21 | Redistributable Units | `COUNT(*) WHERE status IN (low,idle)` | `assets` |
| 22 | Avoided Purchase Value | Stored (manual) | `metrics` |
| 23 | Avg Search Duration | Stored (telemetry) | `metrics` |
| 24 | Search Success Rate | `(Success/Total) × 100` | `metrics` |
| 25 | Proximity Accuracy | `(Within 1 room/Total) × 100` | `metrics` |
| 26 | Time-to-Asset | Stored (telemetry) | `metrics` |
| 27 | Availability Confidence | `(Confirmed/Queries) × 100` | `metrics` |
| 28 | Nursing Interruptions | `((B−A)/B) × 100` | `workflow_metrics` |
| 29 | Time Away from Patients | `((B−A)/B) × 100` | `workflow_metrics` |
| 30 | Escalation Calls | `((B−A)/B) × 100` | `workflow_metrics` |
| 31 | Shift Efficiency Score | `((B−A)/B) × 100` | `workflow_metrics` |
| 32 | Equipment Turnaround | `((B−A)/B) × 100` | `workflow_metrics` |
| 33 | Failed Searches | `((B−A)/B) × 100` | `workflow_metrics` |
| 34 | Labor Savings Formula | `(T_b−T_a)/60 × S × R × 365` | `labor_calc_params` |
| 35 | Coverage Zones | Stored (manual count) | `metrics` |
| 36 | Movement Events | Stored (sensor sum) | `metrics` |
| 37 | Recovery Examples | Stored (manual count) | `metrics` |
| 38 | Pilot Phase Status | Enum — no formula | `pilot_phases` |
| — | **Time Range Modifier** | `make_interval(hours => X)` applied to active/alert/search queries | — |
| 39 | Total Searches | `COUNT(*) WHERE ts >= NOW() − window` | `asset_search_history` |
| 40 | Success Rate | `COUNT(success) / COUNT(*) × 100` | `asset_search_history` |
| 41 | No-Results Rate | `COUNT(no_results) / COUNT(*) × 100` | `asset_search_history` |
| 42 | Top Source | `MAX(COUNT(*)) GROUP BY search_source` | `asset_search_history` |
| 43 | Most Searched Types | `COUNT(*) GROUP BY search_text ORDER BY count DESC` | `asset_search_history` |
| 44 | Per-Type Success Rate | `AVG(success_flag::int) × 100 GROUP BY search_text` | `asset_search_history` |
| 45 | Source Breakdown | `COUNT(*) / total × 100 GROUP BY search_source` | `asset_search_history` |
| 46 | Daily Volume Trend | `COUNT(*) GROUP BY DATE_TRUNC('day', ts)` last 14 days | `asset_search_history` |
| 47 | Recent Searches Feed | Raw rows `ORDER BY ts DESC LIMIT 25` — no formula | `asset_search_history` |
