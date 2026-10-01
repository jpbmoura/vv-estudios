CREATE TABLE "school_classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"weekdays" smallint[] NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"biweekly" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "school_classes_time_order" CHECK ("school_classes"."end_time" > "school_classes"."start_time"),
	CONSTRAINT "school_classes_weekdays" CHECK (cardinality("school_classes"."weekdays") > 0)
);
--> statement-breakpoint
-- Dados (escrito à mão): aulas semanais/diárias da agenda viram aulas da grade; as que já terminaram entram pausadas
INSERT INTO "school_classes" ("title", "weekdays", "start_time", "end_time", "biweekly", "active")
SELECT
	"title",
	CASE
		WHEN "freq" = 'daily' THEN '{0,1,2,3,4,5,6}'::smallint[]
		WHEN cardinality("weekdays") = 0 THEN ARRAY[extract(dow FROM "start_date")::smallint]
		ELSE "weekdays"
	END,
	"start_time",
	"end_time",
	"freq" = 'weekly' AND "repeat_every" = 2,
	"until_date" IS NULL OR "until_date" >= (now() AT TIME ZONE 'America/Sao_Paulo')::date
FROM "events"
WHERE "category" = 'aula' AND "freq" IN ('daily', 'weekly')
ORDER BY "start_time", "title";--> statement-breakpoint
-- As exceções dessas séries saem junto (cascade): a grade fixa não tem datas especiais
DELETE FROM "events" WHERE "category" = 'aula' AND "freq" IN ('daily', 'weekly');--> statement-breakpoint
-- A grade nasce no mesmo estado da agenda
INSERT INTO "settings" ("key", "value")
SELECT 'grade_enabled', "value" FROM "settings" WHERE "key" = 'agenda_enabled'
ON CONFLICT ("key") DO NOTHING;
