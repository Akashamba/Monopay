import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Building2, Filter } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  const transactions = [
    {
      id: 1,
      type: "send",
      from: "You",
      to: "Sarah Smith",
      amount: 200,
      timestamp: "2 minutes ago",
      reason: "Rent payment",
    },
    {
      id: 2,
      type: "receive",
      from: "Mike Johnson",
      to: "You",
      amount: 150,
      timestamp: "5 minutes ago",
      reason: "Property sale",
    },
    {
      id: 3,
      type: "bank_collect",
      from: "Bank",
      to: "You",
      amount: 200,
      timestamp: "8 minutes ago",
      reason: "Pass GO",
    },
    {
      id: 4,
      type: "bank_pay",
      from: "You",
      to: "Bank",
      amount: 100,
      timestamp: "12 minutes ago",
      reason: "Income tax",
    },
    {
      id: 5,
      type: "send",
      from: "You",
      to: "Emma Wilson",
      amount: 300,
      timestamp: "15 minutes ago",
      reason: "Property purchase",
    },
    {
      id: 6,
      type: "receive",
      from: "Sarah Smith",
      to: "You",
      amount: 50,
      timestamp: "18 minutes ago",
      reason: "Utility payment",
    },
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "bank_collect":
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />
      case "bank_pay":
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />
      default:
        return <ArrowUpRight className="w-4 h-4 text-slate-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "send":
      case "bank_pay":
        return "text-red-600"
      case "receive":
      case "bank_collect":
        return "text-green-600"
      default:
        return "text-slate-600"
    }
  }

  const getTransactionSign = (type: string) => {
    return type === "send" || type === "bank_pay" ? "-" : "+"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <Link href="/game">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Transaction Log</h1>
        </div>
        <Button variant="ghost" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="bank">Bank Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction List */}
      <div className="p-4 space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {/* Transaction Icon */}
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  {transaction.from === "Bank" || transaction.to === "Bank" ? (
                    <Building2 className="w-4 h-4 text-slate-600" />
                  ) : (
                    getTransactionIcon(transaction.type)
                  )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-slate-900">
                      {transaction.from === "You" ? `To ${transaction.to}` : `From ${transaction.from}`}
                    </p>
                    {transaction.from === "Bank" || transaction.to === "Bank" ? (
                      <Badge variant="outline" className="text-xs">
                        Bank
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-600">{transaction.reason}</p>
                  <p className="text-xs text-slate-500">{transaction.timestamp}</p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}₩{transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="mx-4 mb-4 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-slate-600">Total Sent</p>
              <p className="text-lg font-bold text-red-600">-₩600</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Received</p>
              <p className="text-lg font-bold text-green-600">+₩400</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
