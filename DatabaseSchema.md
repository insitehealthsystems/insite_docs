-- PostgreSQL Schema for iLocate Dashboard
-- Base tables + addition tables for full dashboard coverage.
-- Run in order: base tables first, then additions at the bottom.

DROP TABLE IF EXISTS equipment_search_audit CASCADE;
DROP TABLE IF EXISTS pilot_phases CASCADE;
DROP TABLE IF EXISTS labor_calc_params CASCADE;
DROP TABLE IF EXISTS workflow_metrics CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS asset_types CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS roi_history CASCADE;
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#00d9a6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Zones
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    traffic_volume VARCHAR(20), -- 'High', 'Medium', 'Low'
    avg_dwell_time VARCHAR(50),
    efficiency_score INTEGER CHECK (efficiency_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset Categories / Types
CREATE TABLE asset_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assets
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    asset_type_id INTEGER REFERENCES asset_types(id),
    department_id INTEGER REFERENCES departments(id),
    utilization_percentage INTEGER CHECK (utilization_percentage BETWEEN 0 AND 100),
    status VARCHAR(20), -- 'high', 'normal', 'low', 'idle'
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50), -- 'lost', 'hoard', 'offline', 'congestion'
    message TEXT NOT NULL,
    zone_id INTEGER REFERENCES zones(id),
    severity VARCHAR(20), -- 'high', 'medium', 'low'
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROI History
CREATE TABLE roi_history (
    id SERIAL PRIMARY KEY,
    month_name VARCHAR(10) NOT NULL, -- 'Jan', 'Feb', etc.
    savings DECIMAL(12, 2) NOT NULL,
    purchases DECIMAL(12, 2) NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Metrics (Search Efficiency, Pilot Metrics, etc.)
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    metric_key VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'search_avg_duration', 'pilot_asset_count'
    metric_value VARCHAR(100) NOT NULL,
    metric_label VARCHAR(100),
    category VARCHAR(50), -- 'search', 'pilot', 'kpi'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'author', -- 'admin', 'editor', 'author'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── Addition tables ───────────────────────────────────────────
-- These cover dashboard data that cannot be derived from the base
-- tables above: nursing workflow impact, labor calc inputs, and
-- the pilot expansion roadmap.

-- Nursing workflow impact: measured before vs. after iLocate
CREATE TABLE workflow_metrics (
    id              SERIAL PRIMARY KEY,
    metric_name     VARCHAR(150)  NOT NULL,
    before_value    VARCHAR(50)   NOT NULL,  -- pre-iLocate measurement
    after_value     VARCHAR(50)   NOT NULL,  -- post-iLocate measurement
    improvement_pct INTEGER       CHECK (improvement_pct BETWEEN 0 AND 100),
    unit            VARCHAR(50),             -- 'per_shift' | 'per_day' | 'minutes' | 'percent'
    display_order   INTEGER        DEFAULT 0,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Labor ROI calculation inputs (admin-editable without code deploys)
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
    phase_label  VARCHAR(30)  NOT NULL,
    description  TEXT         NOT NULL,
    impact       VARCHAR(20)  DEFAULT 'Medium' CHECK (impact IN ('High', 'Medium', 'Low')),
    status       VARCHAR(20)  DEFAULT 'Backlog'
                              CHECK (status IN ('Ready', 'Planned', 'Backlog', 'Future', 'Complete')),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset search audit log (production table from iLocate mobile/web)
CREATE TABLE IF NOT EXISTS equipment_search_audit
(
    search_audit_id          UUID NOT NULL DEFAULT uuid_generate_v4(),
    site_id                  UUID NOT NULL,
    user_id                  UUID,
    session_id               UUID,
    search_timestamp         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    asset_type_id            UUID,
    search_text              VARCHAR(255),
    search_source            VARCHAR(50) NOT NULL DEFAULT 'mobile',
    selected_current_location VARCHAR(150),
    location_zone_id         UUID,
    last_seen_filter         VARCHAR(50),
    exclude_patient_rooms    BOOLEAN NOT NULL DEFAULT true,
    only_reliable_results    BOOLEAN NOT NULL DEFAULT true,
    search_success_flag      BOOLEAN,
    no_results_flag          BOOLEAN NOT NULL DEFAULT false,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT equipment_search_audit_pkey PRIMARY KEY (search_audit_id)
);

-- Real-time asset status (one row per tracked asset)
CREATE TABLE IF NOT EXISTS asset_status_current
(
    asset_id              UUID NOT NULL,
    site_id               UUID NOT NULL,
    tag_id                UUID NOT NULL,
    current_gateway_id    UUID,
    current_location_id   UUID,
    status                VARCHAR(40) NOT NULL DEFAULT 'UNKNOWN',
    last_seen_at          TIMESTAMP WITH TIME ZONE,
    last_motion_at        TIMESTAMP WITH TIME ZONE,
    last_stationary_at    TIMESTAMP WITH TIME ZONE,
    battery_pct           INTEGER,
    confidence_score      INTEGER DEFAULT 0,
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active             BOOLEAN,
    location_id           UUID,
    asset_name            VARCHAR,
    location_name         VARCHAR,
    location_type         UUID,
    receiver_gateway_id   UUID,
    motion_score          INTEGER,
    motion_detected       BOOLEAN,
    CONSTRAINT asset_current_status_pkey PRIMARY KEY (asset_id)
);

-- IoT tag signal events
CREATE TABLE IF NOT EXISTS asset_tag_signal_events
(
    event_id              UUID NOT NULL DEFAULT uuid_generate_v4(),
    site_id               UUID NOT NULL,
    tag_id                UUID NOT NULL,
    asset_gateway_id      UUID NOT NULL,
    rssi                  INTEGER,
    motion_detected       BOOLEAN NOT NULL DEFAULT false,
    motion_score          INTEGER,
    battery_level         INTEGER,
    temperature_c         NUMERIC(5,2),
    received_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    device_name           VARCHAR,
    receiver_gateway_id   UUID,
    CONSTRAINT asset_tag_signal_events_pkey PRIMARY KEY (event_id)
);

-- Facility layout / location registry
CREATE TABLE IF NOT EXISTS site_configuration_facility_layout
(
    facility_idx  INTEGER NOT NULL DEFAULT nextval('site_facility_layout_facility_layout_idx_seq'::regclass),
    hospital_id   INTEGER NOT NULL,
    site_id       INTEGER NOT NULL,
    building      VARCHAR(100) NOT NULL,
    floor_sort    INTEGER NOT NULL,
    assigned_to   VARCHAR(255),
    created_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active     BIT(1) NOT NULL,
    site          VARCHAR,
    zone          VARCHAR,
    site_name     VARCHAR,
    CONSTRAINT site_facility_layout_pkey PRIMARY KEY (facility_idx)
);

-- Sample Data
INSERT INTO departments (name, color) VALUES 
('ICU', '#00d9a6'), 
('ER', '#0ab8ff'), 
('Radiology', '#ff5e3a'), 
('Surgery', '#00d9a6');

INSERT INTO zones (name, traffic_volume, avg_dwell_time, efficiency_score) VALUES 
('ICU', 'High', '3.2h', 96), 
('Emergency Room', 'High', '1.1h', 98), 
('Surgery Suite', 'Medium', '4.8h', 87);

INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@insitehealth.com', '$2b$10$YourSimulatedBcryptHashHere', 'System Administrator', 'admin');


None selected 

Skip to content
Using Gmail with screen readers
I.B 
4 of many
table
Inbox

I.B. Israel
Tue, May 12, 12:23 PM (3 days ago)
to me

-- Table: public.intake_facility_layout

-- DROP TABLE IF EXISTS public.intake_facility_layout;

CREATE TABLE IF NOT EXISTS public.intake_facility_layout
(
    location_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    location_name text COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    site_id "char"[],
    floor bigint,
    building "char"[],
    wing "char"[],
    status bigint,
    location_code "char"[],
    workorder_id character varying COLLATE pg_catalog."default",
    location_type character varying COLLATE pg_catalog."default",
    proximity character varying COLLATE pg_catalog."default",
    assigned_receiver_signature_id uuid
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.intake_facility_layout
    OWNER to postgres;

COMMENT ON COLUMN public.intake_facility_layout.floor
    IS 'the floor level';

COMMENT ON COLUMN public.intake_facility_layout.building
    IS 'name of building where device is located';

COMMENT ON COLUMN public.intake_facility_layout.wing
    IS 'wing where device is located';

-- Trigger: trg_locations_updated_at

-- DROP TRIGGER IF EXISTS trg_locations_updated_at ON public.intake_facility_layout;

CREATE OR REPLACE TRIGGER trg_locations_updated_at
    BEFORE UPDATE 
    ON public.intake_facility_layout
    FOR EACH ROW
    EXECUTE FUNCTION public.set_locations_updated_at();







