"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Building2, Users, Menu } from "lucide-react"
import { useState } from "react"

export default function GamePage() {
  const [amount, setAmount] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState("")
  const [transferType, setTransferType] = useState("player")

  const currentBalance = 1500
  const players = [
    { id: "1", name: "Sarah Smith", balance: 1200 },
    { id: "2", name: "Mike Johnson", balance: 800 },
    { id: "3", name: "Emma Wilson", balance: 2100 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-semibold text-slate-900">Game #ABC123</span>
        </div>
        <Button variant="ghost" size="sm">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Balance Display */}
      <Card className="mx-4 mt-4 border-0 shadow-lg bg-gradient-to-r from-red-600 to-red-700">
        <CardContent className="p-6 text-center">
          <p className="text-red-100 text-sm mb-1">Your Balance</p>
          <p className="text-white text-4xl font-bold">₩{currentBalance.toLocaleString()}</p>
          <p className="text-red-100 text-sm mt-2">Monopoly Dollars</p>
        </CardContent>
      </Card>

      {/* Transfer Section */}
      <div className="p-4 space-y-4">
        <Tabs value={transferType} onValueChange={setTransferType} className="w-full">
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
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Select Player</label>
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a player" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                {player.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{player.name}</span>
                            <Badge variant="outline" className="ml-auto">
                              ₩{player.balance.toLocaleString()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Amount (₩)</label>
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
                    disabled={!selectedPlayer || !amount}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                    disabled={!selectedPlayer || !amount}
                  >
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-medium text-slate-900">Monopoly Bank</p>
                  <p className="text-sm text-slate-600">Unlimited funds</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Amount (₩)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-12 bg-green-600 hover:bg-green-700 text-white" disabled={!amount}>
                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                    Collect
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    disabled={!amount}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setAmount("200")}>
                ₩200
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
                ₩100
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAmount("50")}>
                ₩50
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
