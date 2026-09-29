CREATE TABLE "event_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"date" date NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"title" text,
	"detail" text,
	"location" text,
	"start_time" time,
	"end_time" time,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_exceptions_event_date" UNIQUE("event_id","date")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_time" time;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_time" time;--> statement-breakpoint
-- Backfill (escrito à mão): data e hora de parede em Curitiba; término = início + 1h, sem passar da meia-noite
UPDATE "events" SET
	"start_date" = ("starts_at" AT TIME ZONE 'America/Sao_Paulo')::date,
	"start_time" = ("starts_at" AT TIME ZONE 'America/Sao_Paulo')::time(0),
	"end_time" = CASE
		WHEN ("starts_at" AT TIME ZONE 'America/Sao_Paulo')::time(0) >= '23:00' THEN '23:59:59'::time
		ELSE ("starts_at" AT TIME ZONE 'America/Sao_Paulo')::time(0) + interval '1 hour'
	END;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "freq" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "repeat_every" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "weekdays" smallint[] DEFAULT '{}'::smallint[] NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "monthly_mode" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "until_date" date;--> statement-breakpoint
ALTER TABLE "event_exceptions" ADD CONSTRAINT "event_exceptions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "events_until_date_idx" ON "events" USING btree ("until_date");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_time_order" CHECK ("events"."end_time" > "events"."start_time");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_freq" CHECK ("events"."freq" in ('none', 'daily', 'weekly', 'monthly'));--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_repeat_every" CHECK ("events"."repeat_every" between 1 and 12);