import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-semibold text-slate-900">MonopolyPay</span>
        </div>
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" />
          <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
        </Avatar>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
          <p className="text-slate-600">Ready to start a new game?</p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <Link href="/create-game">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Create Game</h3>
                    <p className="text-sm text-slate-600">Start a new Monopoly banking session</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/join-game">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Join Game</h3>
                    <p className="text-sm text-slate-600">Enter a game code to join</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Games */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Games</h2>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">Family Game Night</p>
                  <p className="text-sm text-slate-600">2 hours ago • 4 players</p>
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
  )
}
