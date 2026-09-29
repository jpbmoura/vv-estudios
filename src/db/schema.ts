import { sql } from "drizzle-orm";
import { boolean, check, date, index, pgTable, smallint, text, time, timestamp, unique, uuid } from "drizzle-orm/pg-core";

/**
 * Eventos da agenda: um evento único ou uma série que se repete.
 * Data e horas são de parede em Curitiba (sem fuso): a recorrência trabalha em dias de calendário.
 */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    detail: text("detail").notNull().default(""),
    location: text("location"),
    category: text("category").notNull(),
    link: text("link"),
    /** Primeira data da série */
    startDate: date("start_date", { mode: "string" }).notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    /** none | daily | weekly | monthly */
    freq: text("freq").notNull().default("none"),
    /** A cada N dias/semanas/meses (quinzenal = weekly + 2) */
    repeatEvery: smallint("repeat_every").notNull().default(1),
    /** 0 = domingo … 6 = sábado (semanal) */
    weekdays: smallint("weekdays").array().notNull().default(sql`'{}'::smallint[]`),
    /** day ("todo dia 14") | nth ("toda 2ª terça") | last ("toda última sexta"), derivados de startDate */
    monthlyMode: text("monthly_mode"),
    /** Última data possível, inclusiva */
    untilDate: date("until_date", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("events_start_date_idx").on(t.startDate),
    index("events_until_date_idx").on(t.untilDate),
    check("events_time_order", sql`${t.endTime} > ${t.startTime}`),
    check("events_freq", sql`${t.freq} in ('none', 'daily', 'weekly', 'monthly')`),
    check("events_repeat_every", sql`${t.repeatEvery} between 1 and 12`),
  ],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

/** Uma data de uma série cancelada ou alterada (campos nulos herdam da série) */
export const eventExceptions = pgTable(
  "event_exceptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    /** Data original da ocorrência */
    date: date("date", { mode: "string" }).notNull(),
    cancelled: boolean("cancelled").notNull().default(false),
    title: text("title"),
    detail: text("detail"),
    location: text("location"),
    startTime: time("start_time"),
    endTime: time("end_time"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("event_exceptions_event_date").on(t.eventId, t.date)],
);

export type EventException = typeof eventExceptions.$inferSelect;

/** Configurações do site editáveis pelo /adm (chave → valor em texto) */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
