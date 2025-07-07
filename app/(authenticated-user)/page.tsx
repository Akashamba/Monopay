"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { Loader2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const user = authClient.useSession().data?.user;
  const isUserLoading = authClient.useSession().isPending;
  const router = useRouter();
  const utils = api.useUtils();

  const createGame = api.games.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch articles query
      // utils.games.getGame.invalidate().catch((error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Game created successfully!");
    },
    onError: (error) => {
      console.log(`Failed to create game: ${error.message}`);
    },
  });

  async function handleCreateGame() {
    try {
      const result = await createGame.mutateAsync({
        startingBalance: 1500, // providing explicit starting balance
      });

      if (result.gameId) {
        router.push(`/waiting-room/${result.gameId}`);
      } else {
        console.error("Game created but no gameId returned");
      }
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
      <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  } else {
    if (!user) {
      router.push("/sign-in");
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Main Content */}
          <div className="p-6 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome Back!
              </h1>
              <p className="text-slate-600">Ready to start a new game?</p>
            </div>

            {/* Action Cards */}
            <div className="space-y-4">
              <Button onClick={handleCreateGame} variant="ghost">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <Plus className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          Create Game
                        </h3>
                        <p className="text-sm text-slate-600">
                          Start a new Monopoly banking session
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Button>

              <Link href="/join-game">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          Join Game
                        </h3>
                        <p className="text-sm text-slate-600">
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
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Games
              </h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">
                        Family Game Night
                      </p>
                      <p className="text-sm text-slate-600">
                        2 hours ago • 4 players
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
  }
}
