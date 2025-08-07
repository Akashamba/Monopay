import React from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { GameWithPlayers } from "@/server/api/routers/games";
import { Badge, Crown, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="w-full min-h-screen flex flex-col gap-4 items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6">
      <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50 w-full mt-10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Game Code
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-wider">
                  {game?.code}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50 w-full mt-3">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={creator?.user.image || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {creator?.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white">
                {creator?.user.name}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Crown className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Game Creator
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7">
            {game.status === "waiting" ? (
              <p>
                Would you like to join
                <span className="font-semibold p-1 text-red-600 dark:text-red-400 rounded-sm">
                  {creator?.user.name.split(" ")[0]}'s
                </span>
                game?
              </p>
            ) : (
              <p className="text-muted-foreground">
                Sorry, you can't join because the game has already started.
              </p>
            )}
            <button
              onClick={() => {
                joinGameMutation.mutate({ code: game.code });
              }}
              disabled={joinGameMutation.isPending || game.status != "waiting"}
              className="px-6 py-3 mt-5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              {joinGameMutation.isPending ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </div>
              ) : (
                "Join Game"
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50 w-full">
        <CardContent className="p-4">
          
        </CardContent>
      </Card> */}
    </div>
  );
};

export default GameJoinConfirmation;
