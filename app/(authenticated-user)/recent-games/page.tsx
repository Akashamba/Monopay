"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RecentGamesPage() {
  const user = authClient.useSession().data?.user;
  const isUserLoading = authClient.useSession().isPending;
  const router = useRouter();

  const { data: userGames, isLoading: isGamesLoading } =
    api.games.getUserGames.useQuery(undefined, {
      enabled: !!user,
    });

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          {/* Header */}
          <div className="flex items-center p-4 bg-white dark:bg-slate-950 shadow-sm">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Games
            </h1>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Games List */}
            <div className="space-y-4">
              {isGamesLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userGames && userGames.length > 0 ? (
                <div className="space-y-3">
                  {userGames.map((game) => (
                    <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50">
                      <CardContent className="p-4">
                        <Link href={`/game/${game.id}`} key={game.id}>
                          <div className="flex">
                            <div className="flex justify-between items-center w-[90%]">
                              {/* Left side: Game info */}
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  Game #{game.code}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {new Date(game.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  • {game.players.length}{" "}
                                  {game.players.length === 1
                                    ? "player"
                                    : "players"}{" "}
                                </p>
                              </div>
                              {/* Right side: Badge */}
                              <Badge variant="secondary" status={game.status}>
                                {game.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-end w-[10%] text-slate-600 dark:text-slate-400">
                              <ChevronRight />
                            </div>
                          </div>
                        </Link>
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
        </div>
      );
    }
  }
}
