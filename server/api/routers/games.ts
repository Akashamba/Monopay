import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { games, players, transactions } from "../../db/game-schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Helper function to generate 6-digit game code
function generateGameCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const gameRouter = createTRPCRouter({
  // Create new game
  create: protectedProcedure
    .input(
      z.object({
        startingBalance: z.number().min(1).default(1500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(
          "Creating game with starting balance:",
          input.startingBalance
        );
        console.log("User context:", ctx.user);

        const code = generateGameCode();
        console.log("Generated game code:", code);

        const startingBalanceStr = input.startingBalance.toFixed(2);
        console.log("Formatted starting balance:", startingBalanceStr);

        console.log("Inserting game into database with values:", {
          code,
          creatorId: ctx.user.id,
          startingBalance: startingBalanceStr,
        });

        const [game] = await ctx.db
          .insert(games)
          .values({
            code,
            creatorId: ctx.user.id,
            startingBalance: startingBalanceStr,
          })
          .returning();

        console.log("Game created:", game);

        if (!game) {
          console.error("Game creation failed - no game returned");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create game - database insert failed",
          });
        }

        console.log("Adding creator as first player...");
        try {
          const playerInsert = {
            gameId: game.id,
            userId: ctx.user.id,
            balance: startingBalanceStr,
            isCreator: true,
          };
          console.log("Player insert values:", playerInsert);

          await ctx.db.insert(players).values(playerInsert);
          console.log("Player added successfully");
        } catch (playerError) {
          console.error("Failed to add player:", playerError);
          // Clean up the game since player creation failed
          console.log("Cleaning up game...");
          await ctx.db.delete(games).where(eq(games.id, game.id));
          console.log("Game cleaned up");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to add player to game",
          });
        }

        return { gameCode: code, gameId: game.id };
      } catch (error) {
        console.error("Error in game creation:", error);
        if (error instanceof Error) {
          console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
        if (error instanceof TRPCError) {
          throw error;
        }
        // Include more error details in development
        const errorMessage =
          process.env.NODE_ENV === "development"
            ? `Failed to create game: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            : "Failed to create game";

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: errorMessage,
          cause: error,
        });
      }
    }),

  // Join game by code
  join: protectedProcedure
    .input(z.object({ code: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.query.games.findFirst({
        where: eq(games.code, input.code),
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      if (game.status !== "waiting") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Game already started",
        });
      }

      // Check if user already joined
      const existingPlayer = await ctx.db.query.players.findFirst({
        where: and(
          eq(players.gameId, game.id),
          eq(players.userId, ctx.user.id)
        ),
      });

      if (existingPlayer) {
        return { gameId: game.id, alreadyJoined: true };
      }

      // Add player to game
      await ctx.db.insert(players).values({
        gameId: game.id,
        userId: ctx.user.id,
        balance: game.startingBalance,
        isCreator: false,
      });

      return { gameId: game.id, alreadyJoined: false };
    }),

  // Get game details with players
  getGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("Fetching game with ID:", input.gameId);

      const game = await ctx.db.query.games.findFirst({
        where: eq(games.id, input.gameId),
        with: {
          players: {
            with: {
              user: true, // Include user information
            },
          },
        },
      });

      console.log("Game found:", game);

      if (!game) {
        console.error("Game not found with ID:", input.gameId);
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      return game;
    }),

  // Start game (creator only)
  startGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.query.games.findFirst({
        where: eq(games.id, input.gameId),
      });

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" });
      }

      if (game.creatorId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only creator can start game",
        });
      }

      await ctx.db
        .update(games)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(games.id, input.gameId));

      return { success: true };
    }),

  // Transfer money between players
  transfer: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        toPlayerId: z.string(),
        amount: z.number().positive(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fromPlayer = await ctx.db.query.players.findFirst({
        where: and(
          eq(players.gameId, input.gameId),
          eq(players.userId, ctx.user.id)
        ),
      });

      if (!fromPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found in game",
        });
      }

      const toPlayer = await ctx.db.query.players.findFirst({
        where: eq(players.id, input.toPlayerId),
      });

      if (!toPlayer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipient not found",
        });
      }

      if (parseFloat(fromPlayer.balance) < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient balance",
        });
      }

      // Update balances
      await ctx.db
        .update(players)
        .set({
          balance: (parseFloat(fromPlayer.balance) - input.amount).toString(),
        })
        .where(eq(players.id, fromPlayer.id));

      await ctx.db
        .update(players)
        .set({
          balance: (parseFloat(toPlayer.balance) + input.amount).toString(),
        })
        .where(eq(players.id, toPlayer.id));

      // Record transaction
      const [transaction] = await ctx.db
        .insert(transactions)
        .values({
          gameId: input.gameId,
          fromPlayerId: fromPlayer.id,
          toPlayerId: input.toPlayerId,
          amount: input.amount.toString(),
          type: "transfer",
          description:
            input.description ||
            `Transfer from ${ctx.user.name} to ${toPlayer.id}`,
        })
        .returning();

      // Emit real-time updates
      // ctx.io?.to(input.gameId).emit("balance-updated", {
      //   gameId: input.gameId,
      //   playerId: fromPlayer.id,
      //   newBalance: (parseFloat(fromPlayer.balance) - input.amount).toString(),
      // });

      // ctx.io?.to(input.gameId).emit("balance-updated", {
      //   gameId: input.gameId,
      //   playerId: input.toPlayerId,
      //   newBalance: (parseFloat(toPlayer.balance) + input.amount).toString(),
      // });

      // ctx.io?.to(input.gameId).emit("transaction-created", {
      //   gameId: input.gameId,
      //   transaction: {
      //     ...transaction,
      //     fromPlayer: { id: fromPlayer.id, user: { name: ctx.user.name } },
      //     toPlayer: { id: toPlayer.id, user: { name: toPlayer.userId } }, // You'll need to fetch user name
      //   },
      // });

      return { success: true };
    }),

  // Request money from bank
  requestFromBank: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        amount: z.number().positive(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const player = await ctx.db.query.players.findFirst({
        where: and(
          eq(players.gameId, input.gameId),
          eq(players.userId, ctx.user.id)
        ),
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found in game",
        });
      }

      // Update player balance
      await ctx.db
        .update(players)
        .set({
          balance: (parseFloat(player.balance) + input.amount).toString(),
        })
        .where(eq(players.id, player.id));

      // Record transaction
      await ctx.db.insert(transactions).values({
        gameId: input.gameId,
        fromPlayerId: null, // null = from bank
        toPlayerId: player.id,
        amount: input.amount.toString(),
        type: "bank_request",
        description: input.description || `Bank request by ${ctx.user.name}`,
      });

      return { success: true };
    }),

  // Get leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const playersWithBalances = await ctx.db.query.players.findMany({
        where: eq(players.gameId, input.gameId),
        // with: {
        //   user: true,
        // },
        orderBy: desc(players.balance),
      });

      const totalMoney = playersWithBalances.reduce(
        (sum, player) => sum + parseFloat(player.balance),
        0
      );

      return {
        players: playersWithBalances,
        totalMoney,
      };
    }),

  // Get transaction history
  getTransactions: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const txs = await ctx.db.query.transactions.findMany({
        where: eq(transactions.gameId, input.gameId),
        with: {
          fromPlayer: {
            /* with: { user: true } */
          },
          toPlayer: {
            /* with: { user: true } */
          },
        },
        orderBy: desc(transactions.createdAt),
      });

      return txs;
    }),
});
