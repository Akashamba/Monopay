"use client";

import { authClient } from "@/lib/auth-client";
import GameScreen from "@/screens/game-screen";
import WaitingRoom from "@/screens/waiting-room";
import { Game, transactions } from "@/server/db/game-schema";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect } from "react";

const pusher = new Pusher("9c2f00b66346bb146d20", {
  cluster: "us2",
});

// Fetch game based on Id
// Based on status, render waiting room or bank screen
export default function GamePage() {
  const params = useParams();
  const gameId = params?.gameId as string;

  const {
    data: game,
    isLoading: isGameLoading,
    isError: isGameError,
    error: gameError,
    refetch: refetchGame,
  } = api.games.getGame.useQuery({ gameId: gameId });

  const {
    data: transactionHistory,
    isLoading: isTransactionHistoryLoading,
    refetch: refetchTransactionHistory,
  } = api.games.getTransactions.useQuery({ gameId: gameId });

  const router = useRouter();

  useEffect(() => {
    const channel = pusher.subscribe(gameId);

    const handleNewPusherEvent = function (data: any) {
      console.log("NEW EVENT");
      if (data.success) {
        refetchGame();
        refetchTransactionHistory();
      }
    };

    const handleNewPusherTransaction = function (data: any) {
      console.log("NEW EVENT");
      if (data.success) {
        console.log(
          data.transaction.fromPlayerId,
          "->",
          data.transaction.toPlayerId,
          data.transaction.amount
        );
        refetchTransactionHistory();
        refetchGame();
      }
    };

    channel.bind("refetch-game", handleNewPusherEvent);
    channel.bind("new-transaction", handleNewPusherTransaction);

    return () => {
      channel.unbind("refetch-game", handleNewPusherEvent);
      pusher.unsubscribe(gameId);
    };
  }, [gameId]);

  const user = authClient.useSession().data?.user;

  const joinGameMutation = api.games.join.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  if (isGameLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  else if (isGameError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold mb-2">
          Failed to load game data.
        </p>
        <p className="text-slate-600">
          {gameError?.message || "An unknown error occurred."}
        </p>
      </div>
    );
  } else if (game) {
    if (game.players.find((p) => p.userId === user?.id)) {
      if (game.status === "waiting") {
        return <WaitingRoom {...game} />;
      } else if (game.status === "ongoing") {
        return (
          <GameScreen
            game={game}
            transactionHistory={transactionHistory}
            isTransactionHistoryLoading={isTransactionHistoryLoading}
          />
        );
      }
    } else {
      if (game.status === "waiting") {
        const creator = game.players.find((p) => p.isCreator)?.user;
        const otherPlayersCount = game.players.length - 1;

        return (
          <div className="w-full min-h-screen flex flex-col gap-4 justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
            <p className="text-xl text-center px-4">
              {`Do you want to join this game with ${creator?.name}${
                otherPlayersCount > 0 ? ` and ${otherPlayersCount} others` : ""
              }?`}
            </p>
            <button
              onClick={() => {
                joinGameMutation.mutate({ code: game.code });
              }}
              disabled={joinGameMutation.isPending}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joinGameMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </div>
              ) : (
                "Join Game"
              )}
            </button>
          </div>
        );
      } else if (game.status === "ongoing") {
        router.push("/404");
      }
    }
  }
}
