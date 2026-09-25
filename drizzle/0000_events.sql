CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"location" text,
	"category" text NOT NULL,
	"link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");