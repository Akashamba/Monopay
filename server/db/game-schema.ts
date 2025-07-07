// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  decimal,
  index,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth-schema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `monopoly_banking_app_${name}`
);

export const games = createTable(
  "game",
  () => ({
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    code: text("code").unique().notNull(),
    creatorId: text("creator_id").notNull(),
    startingBalance: decimal("starting_balance", { precision: 10, scale: 2 })
      .notNull()
      .default("1500.00"),
    status: text("status", { enum: ["waiting", "ongoing", "completed"] })
      .notNull()
      .default("waiting"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }),
  (t) => [
    index("game_code_idx").on(t.code),
    index("game_creator_idx").on(t.creatorId),
    index("game_status_idx").on(t.status),
  ]
);

export const players = createTable(
  "player",
  () => ({
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
    isCreator: boolean("is_creator").notNull().default(false),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  }),
  (t) => [
    index("player_game_idx").on(t.gameId),
    index("player_user_idx").on(t.userId),
    index("player_game_user_idx").on(t.gameId, t.userId),
  ]
);

export const transactions = createTable(
  "transaction",
  () => ({
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    fromPlayerId: text("from_player_id").references(() => players.id),
    toPlayerId: text("to_player_id").references(() => players.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    type: text("type").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }),
  (t) => [
    index("transaction_game_idx").on(t.gameId),
    index("transaction_from_idx").on(t.fromPlayerId),
    index("transaction_to_idx").on(t.toPlayerId),
    index("transaction_type_idx").on(t.type),
    index("transaction_created_idx").on(t.createdAt),
  ]
);

// Types for tRPC
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
