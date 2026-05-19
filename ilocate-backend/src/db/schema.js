import {
  pgTable, serial, varchar, integer, boolean,
  decimal, text, timestamp, uuid,
} from 'drizzle-orm/pg-core'

// ── Base tables (DatabaseSchema.md) ──────────────────────────

export const departments = pgTable('departments', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  color:     varchar('color', { length: 20 }).default('#00d9a6'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const zones = pgTable('zones', {
  id:              serial('id').primaryKey(),
  name:            varchar('name', { length: 100 }).notNull(),
  trafficVolume:   varchar('traffic_volume', { length: 20 }),
  avgDwellTime:    varchar('avg_dwell_time', { length: 50 }),
  efficiencyScore: integer('efficiency_score'),
  createdAt:       timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const assetTypes = pgTable('asset_types', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  icon:      varchar('icon', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const assets = pgTable('assets', {
  id:                    serial('id').primaryKey(),
  name:                  varchar('name', { length: 100 }).notNull(),
  assetTypeId:           integer('asset_type_id').references(() => assetTypes.id),
  departmentId:          integer('department_id').references(() => departments.id),
  utilizationPercentage: integer('utilization_percentage'),
  status:                varchar('status', { length: 20 }),
  lastSeen:              timestamp('last_seen', { withTimezone: true }),
  createdAt:             timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const alerts = pgTable('alerts', {
  id:        serial('id').primaryKey(),
  type:      varchar('type', { length: 50 }),
  message:   text('message').notNull(),
  zoneId:    integer('zone_id').references(() => zones.id),
  severity:  varchar('severity', { length: 20 }),
  resolved:  boolean('resolved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const roiHistory = pgTable('roi_history', {
  id:        serial('id').primaryKey(),
  monthName: varchar('month_name', { length: 10 }).notNull(),
  savings:   decimal('savings', { precision: 12, scale: 2 }).notNull(),
  purchases: decimal('purchases', { precision: 12, scale: 2 }).notNull(),
  year:      integer('year').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const metrics = pgTable('metrics', {
  id:          serial('id').primaryKey(),
  metricKey:   varchar('metric_key', { length: 100 }).unique().notNull(),
  metricValue: varchar('metric_value', { length: 100 }).notNull(),
  metricLabel: varchar('metric_label', { length: 100 }),
  category:    varchar('category', { length: 50 }),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const users = pgTable('users', {
  id:           serial('id').primaryKey(),
  email:        varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName:     varchar('full_name', { length: 100 }),
  role:         varchar('role', { length: 20 }).default('author'),
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ── Addition tables (schema/additions.sql) ────────────────────

export const workflowMetrics = pgTable('workflow_metrics', {
  id:             serial('id').primaryKey(),
  metricName:     varchar('metric_name', { length: 150 }).notNull(),
  beforeValue:    varchar('before_value', { length: 50 }).notNull(),
  afterValue:     varchar('after_value', { length: 50 }).notNull(),
  improvementPct: integer('improvement_pct'),
  unit:           varchar('unit', { length: 50 }),
  displayOrder:   integer('display_order').default(0),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const laborCalcParams = pgTable('labor_calc_params', {
  id:         serial('id').primaryKey(),
  paramKey:   varchar('param_key', { length: 100 }).unique().notNull(),
  paramValue: decimal('param_value', { precision: 10, scale: 2 }).notNull(),
  paramLabel: varchar('param_label', { length: 100 }).notNull(),
  unit:       varchar('unit', { length: 50 }),
  updatedAt:  timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const pilotPhases = pgTable('pilot_phases', {
  id:          serial('id').primaryKey(),
  phaseNumber: integer('phase_number').notNull(),
  phaseLabel:  varchar('phase_label', { length: 30 }).notNull(),
  description: text('description').notNull(),
  impact:      varchar('impact', { length: 20 }).default('Medium'),
  status:      varchar('status', { length: 20 }).default('Backlog'),
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ── Production tables (read from live DB) ─────────────────────

export const equipmentSearchAudit = pgTable('equipment_search_audit', {
  searchAuditId:            uuid('search_audit_id').primaryKey().defaultRandom(),
  siteId:                   uuid('site_id').notNull(),
  userId:                   uuid('user_id'),
  sessionId:                uuid('session_id'),
  searchTimestamp:          timestamp('search_timestamp', { withTimezone: true }).defaultNow().notNull(),
  assetTypeId:              uuid('asset_type_id'),
  searchText:               varchar('search_text', { length: 255 }),
  searchSource:             varchar('search_source', { length: 50 }).notNull().default('mobile'),
  selectedCurrentLocation:  varchar('selected_current_location', { length: 150 }),
  locationZoneId:           uuid('location_zone_id'),
  lastSeenFilter:           varchar('last_seen_filter', { length: 50 }),
  excludePatientRooms:      boolean('exclude_patient_rooms').notNull().default(true),
  onlyReliableResults:      boolean('only_reliable_results').notNull().default(true),
  searchSuccessFlag:        boolean('search_success_flag'),
  noResultsFlag:            boolean('no_results_flag').notNull().default(false),
  createdAt:                timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Possible values: UNKNOWN | MOVING | RECENTLY_MOVED | STATIONARY |
// PROBABLY_AVAILABLE | PROBABLY_IN_USE | LOST_SIGNAL | MAINTENANCE_HOLD |
// LOW_BATTERY | RESERVED | OUT_OF_SERVICE | NEEDS_CLEANING | MARKED_MISSING
// asset_id is the PK — one row per tracked asset
export const assetStatusCurrent = pgTable('asset_status_current', {
  assetId:           uuid('asset_id').primaryKey(),
  siteId:            uuid('site_id').notNull(),
  tagId:             uuid('tag_id').notNull(),
  currentGatewayId:  uuid('current_gateway_id'),
  currentLocationId: uuid('current_location_id'),
  status:            varchar('status', { length: 40 }).notNull().default('UNKNOWN'),
  lastSeenAt:        timestamp('last_seen_at', { withTimezone: true }),
  lastMotionAt:      timestamp('last_motion_at', { withTimezone: true }),
  lastStationaryAt:  timestamp('last_stationary_at', { withTimezone: true }),
  batteryPct:        integer('battery_pct'),
  confidenceScore:   integer('confidence_score').default(0),
  updatedAt:         timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  isActive:          boolean('is_active'),
  locationId:        uuid('location_id'),
  assetName:         varchar('asset_name'),
  locationName:      varchar('location_name'),
  locationType:      uuid('location_type'),
  receiverGatewayId: uuid('receiver_gateway_id'),
  motionScore:       integer('motion_score'),
  motionDetected:    boolean('motion_detected'),
})

export const siteConfigurationFacilityLayout = pgTable('site_configuration_facility_layout', {
  facilityIdx:  serial('facility_idx').primaryKey(),
  hospitalId:   integer('hospital_id').notNull(),
  siteId:       integer('site_id').notNull(),
  building:     varchar('building', { length: 100 }).notNull(),
  floorSort:    integer('floor_sort').notNull(),
  assignedTo:   varchar('assigned_to', { length: 255 }),
  createdDate:  timestamp('created_date').defaultNow().notNull(),
  isActive:     varchar('is_active', { length: 1 }).notNull(),  // bit(1): '1' | '0'
  site:         varchar('site'),
  zone:         varchar('zone'),
  siteName:     varchar('site_name'),
})

export const assetTagSignalEvents = pgTable('asset_tag_signal_events', {
  eventId:           uuid('event_id').primaryKey().defaultRandom(),
  siteId:            uuid('site_id').notNull(),
  tagId:             uuid('tag_id').notNull(),
  assetGatewayId:    uuid('asset_gateway_id').notNull(),
  rssi:              integer('rssi'),
  motionDetected:    boolean('motion_detected').notNull().default(false),
  motionScore:       integer('motion_score'),
  batteryLevel:      integer('battery_level'),
  temperatureC:      decimal('temperature_c', { precision: 5, scale: 2 }),
  receivedAt:        timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  deviceName:        varchar('device_name'),
  receiverGatewayId: uuid('receiver_gateway_id'),
})

export const assetSearchHistory = pgTable('asset_search_history', {
  searchAuditId:            uuid('search_audit_id').primaryKey().defaultRandom(),
  siteId:                   uuid('site_id').notNull(),
  userId:                   uuid('user_id'),
  sessionId:                uuid('session_id'),
  searchTimestamp:          timestamp('search_timestamp', { withTimezone: true }).defaultNow().notNull(),
  assetTypeId:              uuid('asset_type_id'),
  searchText:               varchar('search_text', { length: 255 }),
  searchSource:             varchar('search_source', { length: 50 }).notNull().default('mobile'),
  selectedCurrentLocation:  varchar('selected_current_location', { length: 150 }),
  locationZoneId:           uuid('location_zone_id'),
  lastSeenFilter:           varchar('last_seen_filter', { length: 50 }),
  excludePatientRooms:      boolean('exclude_patient_rooms').notNull().default(true),
  onlyReliableResults:      boolean('only_reliable_results').notNull().default(true),
  searchSuccessFlag:        boolean('search_success_flag'),
  noResultsFlag:            boolean('no_results_flag').notNull().default(false),
  createdAt:                timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// valid new_status_code values: AVAILABLE | IN_USE | NEEDS_CLEANING | UNDER_MAINTENANCE | MARKED_MISSING
export const assetManualStatusHistory = pgTable('asset_manual_status_history', {
  manualStatusHistoryId: uuid('manual_status_history_id').primaryKey().defaultRandom(),
  assetId:               uuid('asset_id').notNull(),
  siteId:                uuid('site_id'),
  nurseUserId:           uuid('nurse_user_id'),
  previousStatusCode:    varchar('previous_status_code', { length: 40 }),
  newStatusCode:         varchar('new_status_code', { length: 40 }).notNull(),
  statusReason:          text('status_reason'),
  notes:                 text('notes'),
  changedByName:         varchar('changed_by_name', { length: 150 }),
  changedByEmail:        varchar('changed_by_email', { length: 255 }),
  createdAt:             timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
