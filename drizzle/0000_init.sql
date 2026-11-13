CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "admins_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer,
	"action" text NOT NULL,
	"details" jsonb,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"login" text NOT NULL,
	"success" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"section" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"volumes" jsonb,
	"photo" text,
	"adults_only" boolean DEFAULT false NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"prices" jsonb NOT NULL,
	"note" text,
	"photo" text,
	"available" boolean DEFAULT true NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promos" (
	"venue_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"badge" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"prizes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"counter_value" text NOT NULL,
	"counter_label" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"position" integer NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"href" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venues" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"hours" text NOT NULL,
	"booking_url" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promos" ADD CONSTRAINT "promos_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_log_created_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_ip_idx" ON "login_attempts" USING btree ("ip","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "login_attempts_login_idx" ON "login_attempts" USING btree ("login","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "menu_categories_venue_slug" ON "menu_categories" USING btree ("venue_id","slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "menu_items_category_idx" ON "menu_items" USING btree ("category_id","position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_venue_idx" ON "services" USING btree ("venue_id","position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_admin_idx" ON "sessions" USING btree ("admin_id");