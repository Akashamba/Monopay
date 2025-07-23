"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { Loader2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const user = authClient.useSession().data?.user;
  const isUserLoading = authClient.useSession().isPending;
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: userGames, isLoading: isGamesLoading } =
    api.games.getUserGames.useQuery(undefined, {
      enabled: !!user,
    });

  const createGame = api.games.create.useMutation({
    onSuccess: (result) => {
      // Invalidate and refetch games query
      // utils.games.getUserGames.invalidate().catch((error: Error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Game created successfully!");
      setIsRedirecting(true);
      router.push(`/game/${result.gameId}`);
    },
    onError: (error) => {
      console.log(`Failed to create game: ${error.message}`);
    },
  });

  async function handleCreateGame() {
    try {
      await createGame.mutateAsync({
        startingBalance: 1500, // providing explicit starting balance
      });
    } catch (error) {
      console.error("Failed to create game:", error);
      if (error instanceof Error) {
        alert(`Failed to create game: ${error.message}`);
      } else {
        alert("Failed to create game. Please try again.");
      }
    }
  }

  if (isUserLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  } else {
    if (!user) {
      router.push("/sign-in");
    } else {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          {/* Main Content */}
          <div className="flex-1 p-6 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome Back!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Ready to start a new game?
              </p>
            </div>

            {/* Action Cards */}
            <div className="space-y-4">
              <div
                onClick={createGame.isPending ? undefined : handleCreateGame}
                className={`cursor-pointer ${
                  createGame.isPending ? "opacity-70" : ""
                }`}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow mb-2 dark:bg-slate-900 dark:shadow-slate-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                        {createGame.isPending || isRedirecting ? (
                          <Loader2 className="w-6 h-6 text-red-600 dark:text-red-400 animate-spin" />
                        ) : (
                          <Plus className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {createGame.isPending
                            ? "Creating Game..."
                            : "Create Game"}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Start a new Monopoly banking session
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Link href="/join-game">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer dark:bg-slate-900 dark:shadow-slate-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Join Game
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Enter a game code to join
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Games */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Games
                </h2>
                {userGames && userGames.length > 3 && (
                  <Link href="/recent-games">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                )}
              </div>
              {isGamesLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userGames && userGames.length > 0 ? (
                <div className="space-y-3">
                  {userGames.slice(0, 3).map((game) => (
                    <Card
                      key={game.id}
                      className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              Game #{game.code}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(game.createdAt).toLocaleDateString()} •{" "}
                              {game.players.length} players • {game.status}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/game/${game.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      No games yet. Create or join a game to get started!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer with Disclaimer */}
          <footer className="mt-auto py-4 px-6 border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-screen-xl mx-auto text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Disclaimer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Legal Disclaimer</DialogTitle>
                    <DialogDescription className="text-left pt-4">
                      This app is an unofficial companion tool intended to be
                      used while playing the board game Monopoly. It is not
                      affiliated with, authorized, or endorsed by Hasbro, Inc.
                      "Monopoly" is a registered trademark of Hasbro, Inc.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </footer>
        </div>
      );
    }
  }
}
