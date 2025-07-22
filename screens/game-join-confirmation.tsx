import React from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { GameWithPlayers } from "@/server/api/routers/games";
import { Loader2 } from "lucide-react";

const GameJoinConfirmation = ({ game }: { game: GameWithPlayers }) => {
  const router = useRouter();
  const creator = game.players.find((player) => player.isCreator);
  const otherPlayersCount = game.players.length - 1;

  const joinGameMutation = api.games.join.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <p className="text-xl text-center px-4">
        {`Do you want to join this game with ${creator?.user.name}${
          otherPlayersCount > 0
            ? ` and ${otherPlayersCount} more ${
                otherPlayersCount === 1 ? "player" : "players"
              }`
            : ""
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
};

export default GameJoinConfirmation;
