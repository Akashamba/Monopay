import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Users,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { GameWithPlayers } from "@/server/api/routers/games";
import { AvatarImage } from "@radix-ui/react-avatar";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";

function GameScreen(game: GameWithPlayers) {
  const [amount, setAmount] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [transferType, setTransferType] = useState("player");
  const user = authClient.useSession().data?.user;

  const transferToPlayer = api.games.transfer.useMutation({
    onSuccess: () => {
      // Invalidate and refetch games query
      // utils.games.getUserGames.invalidate().catch((error: Error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Transfer completed successfully!");
    },
    onError: (error) => {
      console.log(`Failed to transfer: ${error.message}`);
    },
  });

  async function handlePlayerTransfer() {
    try {
      const result = await transferToPlayer.mutateAsync({
        gameId: game.id,
        amount: Number(amount),
        toPlayerId: selectedPlayer,
      });

      if (result.success) {
        setSelectedPlayer("");
        setAmount("");
      } else {
        console.error("Transfer complete but error");
      }
    } catch (error) {
      console.error("Failed to transfer:", error);
      if (error instanceof Error) {
        alert(`Failed to transfer: ${error.message}`);
      } else {
        alert("Failed to transfer. Please try again.");
      }
    }
  }

  const requestFromBank = api.games.requestFromBank.useMutation({
    onSuccess: () => {
      // Invalidate and refetch games query
      // utils.games.getUserGames.invalidate().catch((error: Error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Received from bank successfully!");
    },
    onError: (error) => {
      console.log(`Failed to receive from bank: ${error.message}`);
    },
  });

  async function handleRequestFromBank() {
    try {
      const result = await requestFromBank.mutateAsync({
        gameId: game.id,
        amount: Number(amount),
      });

      if (result.success) {
        setSelectedPlayer("");
        setAmount("");
      } else {
        console.error("Received from bank but error");
      }
    } catch (error) {
      console.error("Failed to receive from bank:", error);
      if (error instanceof Error) {
        alert(`Failed to receive from bank: ${error.message}`);
      } else {
        alert("Failed to receive from bank. Please try again.");
      }
    }
  }

  const payToBank = api.games.payToBank.useMutation({
    onSuccess: () => {
      // Invalidate and refetch games query
      // utils.games.getUserGames.invalidate().catch((error: Error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Paid bank successfully!");
    },
    onError: (error) => {
      console.log(`Failed to pay bank: ${error.message}`);
    },
  });

  async function handlePayToBank() {
    try {
      const result = await payToBank.mutateAsync({
        gameId: game.id,
        amount: Number(amount),
      });

      if (result.success) {
        setSelectedPlayer("");
        setAmount("");
      } else {
        console.error("Paid bank but error");
      }
    } catch (error) {
      console.error("Failed to pay bank:", error);
      if (error instanceof Error) {
        alert(`Failed to pay bank: ${error.message}`);
      } else {
        alert("Failed to pay bank. Please try again.");
      }
    }
  }

  const currentBalance = game.players.find(
    (player) => player.userId === user?.id
  )?.balance;

  const { players } = game;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 shadow-sm">
        {/* <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            Game Code: #{game.code}
          </span>
        </div>
        <Button variant="ghost" size="sm">
          <Menu className="w-5 h-5" />
        </Button> */}
      </div>

      {/* Balance Display */}
      <Card className="mx-4 mt-4 border-0 shadow-lg bg-gradient-to-r from-red-600 to-red-700">
        <CardContent className="p-6 text-center">
          <p className="text-red-100 text-sm mb-1">Your Balance</p>
          <p className="text-white text-4xl font-bold">
            ₩{currentBalance?.toLocaleString()}
          </p>
          <p className="text-red-100 text-sm mt-2">Monopoly Dollars</p>
        </CardContent>
      </Card>

      {/* Transfer Section */}
      <div className="p-4 space-y-4">
        <Tabs
          value={transferType}
          onValueChange={setTransferType}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="player" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Players</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Bank</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-4 mt-4">
            <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Select Player
                  </label>
                  <Select
                    value={selectedPlayer}
                    onValueChange={setSelectedPlayer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a player" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem
                          key={player.id}
                          value={player.id}
                          disabled={player.userId === user?.id}
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={player.user.image ?? ""} />
                              <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                                {player.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {player.user.name.length > 11
                                ? `${player.user.name.slice(0, 11)}...`
                                : player.user.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="ml-auto dark:border-slate-700 dark:text-slate-300"
                            >
                              ₩{player.balance.toLocaleString()}
                            </Badge>

                            {player.userId === user?.id && (
                              <Badge
                                variant="outline"
                                className="ml-auto dark:border-slate-700 dark:text-slate-300"
                              >
                                You
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Amount (₩)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    className="h-12 bg-green-600 hover:bg-green-700 text-white"
                    disabled={
                      !selectedPlayer || !amount || transferToPlayer.isPending
                    }
                    onClick={handlePlayerTransfer}
                  >
                    {transferToPlayer.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="h-12 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                    disabled={!selectedPlayer || !amount}
                  >
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Request
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-4">
            <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50">
              <CardContent className="p-6 space-y-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Building2 className="w-8 h-8 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <p className="font-medium text-slate-900 dark:text-white">
                    Monopoly Bank
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Unlimited funds
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Amount (₩)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-12 bg-green-600 hover:bg-green-700 text-white"
                    disabled={!amount || requestFromBank.isPending}
                    onClick={handleRequestFromBank}
                  >
                    {requestFromBank.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-4 h-4 mr-2" />
                        Collect
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                    disabled={!amount || payToBank.isPending}
                    onClick={handlePayToBank}
                  >
                    {payToBank.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Pay
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Quick Actions
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount("200")}
                className="dark:border-slate-700 dark:text-slate-300"
              >
                ₩200
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount("100")}
                className="dark:border-slate-700 dark:text-slate-300"
              >
                ₩100
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount("50")}
                className="dark:border-slate-700 dark:text-slate-300"
              >
                ₩50
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GameScreen;
