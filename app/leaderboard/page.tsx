import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  const players = [
    {
      id: 1,
      name: "Emma Wilson",
      balance: 2100,
      position: 1,
      change: "up",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "John Doe",
      balance: 1500,
      position: 2,
      change: "same",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Sarah Smith",
      balance: 1200,
      position: 3,
      change: "down",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Mike Johnson",
      balance: 800,
      position: 4,
      change: "down",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const totalMoney = players.reduce((sum, player) => sum + player.balance, 0)

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-600">#{position}</span>
    )
  }

  const getChangeIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change === "down") return <TrendingDown className="w-4 h-4 text-red-500" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-sm">
        <Link href="/game">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Leaderboard</h1>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Game Stats */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">Total Money in Circulation</p>
              <p className="text-3xl font-bold text-slate-900">₩{totalMoney.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Across {players.length} players</p>
            </div>
          </CardContent>
        </Card>

        {/* Player Rankings */}
        <div className="space-y-3">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={`border-0 shadow-lg ${
                player.position === 1 ? "ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-white" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Position */}
                  <div className="flex items-center justify-center w-10 h-10">{getPositionIcon(player.position)}</div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-slate-900">{player.name}</p>
                      {getChangeIcon(player.change)}
                    </div>
                    <p className="text-sm text-slate-600">
                      {((player.balance / totalMoney) * 100).toFixed(1)}% of total wealth
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">₩{player.balance.toLocaleString()}</p>
                    {player.position === 1 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Leading</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Progress */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Game Duration</span>
              <span className="font-medium text-slate-900">1h 23m</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-slate-600">Total Transactions</span>
              <span className="font-medium text-slate-900">47</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
