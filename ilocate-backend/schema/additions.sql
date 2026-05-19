-- iLocate schema additions
-- Run after the base DatabaseSchema.md tables are created.

-- Nursing workflow impact: before vs. after iLocate deployment
CREATE TABLE workflow_metrics (
    id              SERIAL PRIMARY KEY,
    metric_name     VARCHAR(150)  NOT NULL,
    before_value    VARCHAR(50)   NOT NULL,
    after_value     VARCHAR(50)   NOT NULL,
    improvement_pct INTEGER       CHECK (improvement_pct BETWEEN 0 AND 100),
    unit            VARCHAR(50),   -- 'per_shift' | 'per_day' | 'minutes' | 'percent'
    display_order   INTEGER        DEFAULT 0,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Labor ROI calculation inputs (editable by admins without code changes)
CREATE TABLE labor_calc_params (
    id          SERIAL PRIMARY KEY,
    param_key   VARCHAR(100) UNIQUE NOT NULL,
    param_value DECIMAL(10, 2)      NOT NULL,
    param_label VARCHAR(100)        NOT NULL,
    unit        VARCHAR(50),        -- 'minutes' | 'count_per_day' | 'usd_per_hour'
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pilot program expansion roadmap
CREATE TABLE pilot_phases (
    id           SERIAL PRIMARY KEY,
    phase_number INTEGER      NOT NULL,
    phase_label  VARCHAR(30)  NOT NULL,   -- 'Phase 1', 'Phase 2' …
    description  TEXT         NOT NULL,
    impact       VARCHAR(20)  DEFAULT 'Medium' CHECK (impact IN ('High', 'Medium', 'Low')),
    status       VARCHAR(20)  DEFAULT 'Backlog' CHECK (status IN ('Ready', 'Planned', 'Backlog', 'Future', 'Complete')),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed: workflow metrics
INSERT INTO workflow_metrics (metric_name, before_value, after_value, improvement_pct, unit, display_order) VALUES
('Reduced Nursing Interruptions',    'Avg 6.2/shift', 'Avg 2.1/shift', 66, 'per_shift',  1),
('Time Away from Patients (search)', '18 min/shift',  '5.8 min/shift', 68, 'minutes',    2),
('Equipment Escalation Calls',       '4.4/day',       '0.8/day',       82, 'per_day',    3),
('Shift Efficiency Score',           '61%',           '94%',           54, 'percent',    4),
('Equipment Turnaround Time',        '38 min avg',    '12 min avg',    68, 'minutes',    5),
('Failed Equipment Searches',        '11.3/day',      '1.2/day',       89, 'per_day',    6);

-- Seed: labor calc inputs
INSERT INTO labor_calc_params (param_key, param_value, param_label, unit) VALUES
('search_time_before',   18.0,  'Search Time Before iLocate', 'minutes'),
('search_time_after',     5.8,  'Search Time After iLocate',  'minutes'),
('searches_per_day',     84.0,  'Equipment Searches per Day',  'count_per_day'),
('nursing_hourly_rate',  48.50, 'Nursing Hourly Rate',         'usd_per_hour');

-- Seed: pilot phases
INSERT INTO pilot_phases (phase_number, phase_label, description, impact, status) VALUES
(1, 'Phase 1', 'Expand to all 6 remaining floors (Floors 4–9)',              'High',   'Ready'),
(2, 'Phase 2', 'Add real-time department-level redistribution alerts',        'High',   'Planned'),
(3, 'Phase 3', 'Integrate with EHR for equipment demand forecasting',         'Medium', 'Backlog'),
(4, 'Phase 4', 'Deploy predictive maintenance triggers via motion patterns',  'Medium', 'Backlog'),
(5, 'Phase 5', 'Extend to off-site clinics and satellite campuses',           'High',   'Future');

-- Seed: system health scores into existing metrics table
INSERT INTO metrics (metric_key, metric_value, metric_label, category) VALUES
('health_availability',  '94', 'System Availability Score',   'health'),
('health_distribution',  '87', 'Distribution Efficiency Score','health'),
('health_utilization',   '83', 'Utilization Score',           'health')
ON CONFLICT (metric_key) DO UPDATE
  SET metric_value = EXCLUDED.metric_value,
      metric_label = EXCLUDED.metric_label,
      updated_at   = CURRENT_TIMESTAMP;
