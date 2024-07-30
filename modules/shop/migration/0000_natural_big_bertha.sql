CREATE TABLE IF NOT EXISTS "ygg_shop__production" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(512) NOT NULL,
	"price" real NOT NULL,
	"stock" integer NOT NULL,
	"lockedStock" integer DEFAULT 0 NOT NULL,
	"production_type" varchar(256) NOT NULL,
	"infinity_stock" boolean DEFAULT false NOT NULL,
	"description" text NOT NULL,
	"content" json NOT NULL,
	"labels" varchar(256)[] DEFAULT array[]::varchar[] NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_index" ON "ygg_shop__production" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "labels_index" ON "ygg_shop__production" USING btree ("labels");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "production_type_index" ON "ygg_shop__production" USING btree ("production_type");