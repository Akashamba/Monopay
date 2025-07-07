CREATE TABLE "monopoly_banking_app_game" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"creator_id" text NOT NULL,
	"starting_balance" numeric(10, 2) DEFAULT '1500.00' NOT NULL,
	"status" text DEFAULT 'waiting' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monopoly_banking_app_game_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "monopoly_banking_app_player" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"user_id" text NOT NULL,
	"balance" numeric(10, 2) NOT NULL,
	"is_creator" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monopoly_banking_app_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"from_player_id" text,
	"to_player_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "monopoly_banking_app_player" ADD CONSTRAINT "monopoly_banking_app_player_game_id_monopoly_banking_app_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."monopoly_banking_app_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monopoly_banking_app_transaction" ADD CONSTRAINT "monopoly_banking_app_transaction_game_id_monopoly_banking_app_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."monopoly_banking_app_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monopoly_banking_app_transaction" ADD CONSTRAINT "monopoly_banking_app_transaction_from_player_id_monopoly_banking_app_player_id_fk" FOREIGN KEY ("from_player_id") REFERENCES "public"."monopoly_banking_app_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monopoly_banking_app_transaction" ADD CONSTRAINT "monopoly_banking_app_transaction_to_player_id_monopoly_banking_app_player_id_fk" FOREIGN KEY ("to_player_id") REFERENCES "public"."monopoly_banking_app_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "game_code_idx" ON "monopoly_banking_app_game" USING btree ("code");--> statement-breakpoint
CREATE INDEX "game_creator_idx" ON "monopoly_banking_app_game" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "game_status_idx" ON "monopoly_banking_app_game" USING btree ("status");--> statement-breakpoint
CREATE INDEX "player_game_idx" ON "monopoly_banking_app_player" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "player_user_idx" ON "monopoly_banking_app_player" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "player_game_user_idx" ON "monopoly_banking_app_player" USING btree ("game_id","user_id");--> statement-breakpoint
CREATE INDEX "transaction_game_idx" ON "monopoly_banking_app_transaction" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "transaction_from_idx" ON "monopoly_banking_app_transaction" USING btree ("from_player_id");--> statement-breakpoint
CREATE INDEX "transaction_to_idx" ON "monopoly_banking_app_transaction" USING btree ("to_player_id");--> statement-breakpoint
CREATE INDEX "transaction_type_idx" ON "monopoly_banking_app_transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transaction_created_idx" ON "monopoly_banking_app_transaction" USING btree ("created_at");