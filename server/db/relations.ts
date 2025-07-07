import { relations } from "drizzle-orm";
import { games, players, transactions } from "./game-schema";
import { user } from "./auth-schema";

export const userRelations = relations(user, ({ many }) => ({
  players: many(players),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  players: many(players),
}));

export const playersRelations = relations(players, ({ one }) => ({
  game: one(games, {
    fields: [players.gameId],
    references: [games.id],
  }),
  user: one(user, {
    fields: [players.userId],
    references: [user.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  game: one(games, {
    fields: [transactions.gameId],
    references: [games.id],
  }),
  fromPlayer: one(players, {
    fields: [transactions.fromPlayerId],
    references: [players.id],
  }),
  toPlayer: one(players, {
    fields: [transactions.toPlayerId],
    references: [players.id],
  }),
}));
