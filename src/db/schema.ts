import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    detail: text("detail").notNull().default(""),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    location: text("location"),
    category: text("category").notNull(),
    link: text("link"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_starts_at_idx").on(t.startsAt)],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

/** Configurações do site editáveis pelo /adm (chave → valor em texto) */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
