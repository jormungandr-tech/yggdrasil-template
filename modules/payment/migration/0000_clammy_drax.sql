DO $$ BEGIN
 CREATE TYPE "public"."ygg_payment__invoice_status" AS ENUM('unpaid', 'paid', 'cancelled', 'fraud', 'refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ygg_payment__order_status" AS ENUM('pending', 'paid', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_balance_change_type" AS ENUM('deposit', 'withdraw', 'refund', 'chargeback', 'lock', 'unlock');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ygg_payment__invoice" (
	"invoice_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"external_product_name" text NOT NULL,
	"payment_method" text,
	"status" "ygg_payment__invoice_status" DEFAULT 'unpaid' NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ygg_payment__orders" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" text NOT NULL,
	"content" json NOT NULL,
	"status" "ygg_payment__order_status" DEFAULT 'pending' NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	"completed_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ygg_payment__payment_method_provider" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_type" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"account" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ygg_payment__user_balance" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"available_balance" numeric DEFAULT '0' NOT NULL,
	"reserved_balance" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ygg_payment__user_balance_change" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"type" "user_balance_change_type" NOT NULL,
	"reason" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_id_index" ON "ygg_payment__invoice" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "ygg_payment__orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_index" ON "ygg_payment__user_balance_change" USING btree ("user_id");