"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, Crown, Loader2, Users } from "lucide-react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

export default function WaitingRoomPage() {
  const players = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      isCreator: true,
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      isCreator: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      isCreator: false,
    },
  ];

  const params = useParams();
  const gameId = params?.gameId as string;

  const {
    data: game,
    isLoading,
    isError,
    error,
  } = api.games.getGame.useQuery({ gameId: gameId });

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  } else if (isError) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="p-4 bg-white shadow-sm">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-900">Game Lobby</h1>
            <p className="text-sm text-slate-600">
              Waiting for players to join
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Game Code */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Game Code</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-red-600 tracking-wider">
                      {game?.code}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Share this code with other players
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Players List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Players ({players.length}/8)
              </h2>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <Card key={player.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={player.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {player.name}
                        </p>
                        {player.isCreator && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Crown className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-slate-600">
                              Game Creator
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700"
                      >
                        Ready
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Loading Animation */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="ml-3 text-slate-600">
                  Waiting for more players...
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Start Game Button */}
          <Button
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
            disabled={players.length < 2}
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }
}
