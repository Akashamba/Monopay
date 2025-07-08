"use client";

import GameScreen from "@/screens/game-screen";
import WaitingRoom from "@/screens/waiting-room";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

// Fetch game based on Id
// Based on status, render waiting room or bank screen
export default function GamePage() {
  const params = useParams();
  const gameId = params?.gameId as string;

  const {
    data: game,
    isLoading,
    isError,
    error,
  } = api.games.getGame.useQuery({ gameId: gameId });

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  else if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold mb-2">
          Failed to load game data.
        </p>
        <p className="text-slate-600">
          {error?.message || "An unknown error occurred."}
        </p>
      </div>
    );
  } else if (game) {
    if (game.status === "waiting") {
      return <WaitingRoom {...game} />;
    } else if (game.status === "ongoing") {
      return <GameScreen {...game} />;
    }
  }
}
