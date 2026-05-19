/**
 * Drizzle ORM schema for the iLocate PostgreSQL database.
 *
 * Usage in Next.js (App Router):
 *   npm install drizzle-orm postgres
 *   npm install -D drizzle-kit
 *
 * In lib/db.ts:
 *   import { drizzle } from 'drizzle-orm/postgres-js'
 *   import postgres from 'postgres'
 *   const client = postgres(process.env.DATABASE_URL!)
 *   export const db = drizzle(client)
 *
 * Then in a Server Component or Route Handler:
 *   import { db } from '@/lib/db'
 *   import { assets } from '@/schema/drizzle.schema'
 *   const rows = await db.select().from(assets)
 *
 * Why Drizzle over raw SQL for Next.js?
 *   - Full TypeScript inference — query results are typed automatically
 *   - Looks like SQL — no magic, easy to reason about
 *   - Works in Node.js Edge runtime (unlike pg)
 *   - drizzle-kit generates and runs migrations from the schema below
 */

import {
  pgTable, serial, varchar, integer, boolean,
  decimal, text, timestamp, check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ── Base tables (from DatabaseSchema.md) ─────────────────────

export const departments = pgTable('departments', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  color:     varchar('color', { length: 20 }).default('#00d9a6'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const zones = pgTable('zones', {
  id:              serial('id').primaryKey(),
  name:            varchar('name', { length: 100 }).notNull(),
  trafficVolume:   varchar('traffic_volume', { length: 20 }),  // 'High' | 'Medium' | 'Low'
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
  status:                varchar('status', { length: 20 }), // 'high' | 'normal' | 'low' | 'idle'
  lastSeen:              timestamp('last_seen', { withTimezone: true }),
  createdAt:             timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const alerts = pgTable('alerts', {
  id:        serial('id').primaryKey(),
  type:      varchar('type', { length: 50 }),   // 'lost' | 'hoard' | 'offline' | 'congestion'
  message:   text('message').notNull(),
  zoneId:    integer('zone_id').references(() => zones.id),
  severity:  varchar('severity', { length: 20 }), // 'high' | 'medium' | 'low'
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
  category:    varchar('category', { length: 50 }), // 'kpi' | 'search' | 'pilot' | 'health'
  updatedAt:   timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const users = pgTable('users', {
  id:           serial('id').primaryKey(),
  email:        varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName:     varchar('full_name', { length: 100 }),
  role:         varchar('role', { length: 20 }).default('author'), // 'admin' | 'editor' | 'author'
  createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ── Addition tables (from schema/additions.sql) ───────────────

export const workflowMetrics = pgTable('workflow_metrics', {
  id:             serial('id').primaryKey(),
  metricName:     varchar('metric_name', { length: 150 }).notNull(),
  beforeValue:    varchar('before_value', { length: 50 }).notNull(),
  afterValue:     varchar('after_value', { length: 50 }).notNull(),
  improvementPct: integer('improvement_pct'),
  unit:           varchar('unit', { length: 50 }),  // 'per_shift' | 'per_day' | 'minutes' | 'percent'
  displayOrder:   integer('display_order').default(0),
  updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const laborCalcParams = pgTable('labor_calc_params', {
  id:         serial('id').primaryKey(),
  paramKey:   varchar('param_key', { length: 100 }).unique().notNull(),
  paramValue: decimal('param_value', { precision: 10, scale: 2 }).notNull(),
  paramLabel: varchar('param_label', { length: 100 }).notNull(),
  unit:       varchar('unit', { length: 50 }),  // 'minutes' | 'count_per_day' | 'usd_per_hour'
  updatedAt:  timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const pilotPhases = pgTable('pilot_phases', {
  id:          serial('id').primaryKey(),
  phaseNumber: integer('phase_number').notNull(),
  phaseLabel:  varchar('phase_label', { length: 30 }).notNull(),
  description: text('description').notNull(),
  impact:      varchar('impact', { length: 20 }).default('Medium'), // 'High' | 'Medium' | 'Low'
  status:      varchar('status', { length: 20 }).default('Backlog'), // 'Ready' | 'Planned' | 'Backlog' | 'Future' | 'Complete'
  createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// ── Type exports (useful in Server Components) ────────────────

export type Department    = typeof departments.$inferSelect
export type Zone          = typeof zones.$inferSelect
export type AssetType     = typeof assetTypes.$inferSelect
export type Asset         = typeof assets.$inferSelect
export type Alert         = typeof alerts.$inferSelect
export type RoiHistory    = typeof roiHistory.$inferSelect
export type Metric        = typeof metrics.$inferSelect
export type WorkflowMetric   = typeof workflowMetrics.$inferSelect
export type LaborCalcParam   = typeof laborCalcParams.$inferSelect
export type PilotPhase       = typeof pilotPhases.$inferSelect
