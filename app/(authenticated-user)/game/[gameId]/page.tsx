"use client";

import { authClient } from "@/lib/auth-client";
import GameJoinConfirmation from "@/screens/game-join-confirmation";
import GameScreen from "@/screens/game-screen";
import SignInScreen from "@/screens/sign-in-screen";
import WaitingRoom from "@/screens/waiting-room";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
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
  const session = authClient.useSession();
  const user = session.data?.user;

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

  // Create and manage pusher object for live updates
  useEffect(() => {
    const channel = pusher.subscribe(gameId);

    const handleNewPusherEvent = function (data: any) {
      if (data.success) {
        refetchGame();
        refetchTransactionHistory();
      }
    };

    channel.bind("refetch-game", handleNewPusherEvent);
    channel.bind("new-transaction", handleNewPusherEvent);

    return () => {
      channel.unbind("refetch-game", handleNewPusherEvent);
      channel.unbind("new-transaction", handleNewPusherEvent);
      pusher.unsubscribe(gameId);
    };
  }, [gameId]);

  if (session.isPending) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  } else if (!user) {
    return <SignInScreen redirectGameId={gameId} />;
  } else if (isGameLoading)
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
    if (game.status === "waiting") {
      if (game.isUserInGame) return <WaitingRoom {...game} />;
      else return <GameJoinConfirmation game={game} />;
    } else if (game.status === "ongoing") {
      return (
        <GameScreen
          game={game}
          transactionHistory={transactionHistory}
          isTransactionHistoryLoading={isTransactionHistoryLoading}
        />
      );
    }
  }
}
