"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { ArrowLeft, Clipboard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinGamePage() {
  const [gameCode, setGameCode] = useState("");

  const handleKeypadClick = (value: string) => {
    if (value === "⌫") {
      setGameCode((prev) => prev.slice(0, -1));
    } else if (gameCode.length < 6) {
      setGameCode((prev) => prev + value);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Filter only numbers and take first 6
      const numbers = text.replace(/[^0-9]/g, "").slice(0, 6);
      setGameCode(numbers);
    } catch (error) {
      console.error("Failed to paste:", error);
    }
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  const router = useRouter();

  const joinGame = api.games.join.useMutation({
    onSuccess: () => {
      console.log("Game joined successfully!");
    },
    onError: (error) => {
      console.log(`Failed to join game: ${error.message}`);
    },
  });

  async function handleJoinGame() {
    try {
      const result = await joinGame.mutateAsync({ code: gameCode });

      if (result.gameId) {
        router.push(`/game/${result.gameId}`);
      } else {
        console.error("Game joined but no gameId returned");
      }
    } catch (error) {
      console.error("Failed to join game:", error);
      if (error instanceof Error) {
        alert(`Failed to join game: ${error.message}`);
      } else {
        alert("Failed to join game. Please try again.");
      }
    }
  }

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
          Join Game
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Enter Game Code
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Ask the game creator for the 6-digit code
          </p>
        </div>

        {/* Game Code Display */}
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-11 h-11 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
                      gameCode[i]
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {gameCode[i] || ""}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                className="flex items-center space-x-2"
              >
                <Clipboard className="w-4 h-4" />
                <span>Paste Code</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* On-Screen Keypad */}
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {keypadNumbers.flat().map((num, i) => (
                <Button
                  key={i}
                  variant={num === "⌫" ? "outline" : "ghost"}
                  className={`h-12 text-lg font-semibold ${
                    num === "" ? "invisible" : ""
                  } ${
                    num === "⌫"
                      ? "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
                  }`}
                  onClick={() => num && handleKeypadClick(num)}
                  disabled={num === "" || joinGame.isPending}
                >
                  {num}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Join Button */}
        <Button
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
          disabled={gameCode.length !== 6 || joinGame.isPending}
          onClick={handleJoinGame}
        >
          {joinGame.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            "Join Game"
          )}
        </Button>
      </div>
    </div>
  );
}
