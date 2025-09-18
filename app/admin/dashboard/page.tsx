"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, Ticket, Trophy, Clock, TrendingUp, AlertCircle, Settings } from "lucide-react"

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  // Mock admin data - in real app this would come from database
  const adminData = {
    totalParticipants: 24,
    totalSlots: 34,
    currentPrize: "iPhone 15 Pro Max",
    nextSpinCountdown: "2d 14h 32m",
    recentActivity: [
      { id: 1, action: "New participant joined", user: "Emma Wilson", time: "2 minutes ago" },
      { id: 2, action: "Merchandise purchase", user: "Atif Khan", time: "1 hour ago" },
      { id: 3, action: "Slots added manually", user: "Sarah Johnson", time: "3 hours ago" },
    ],
    topParticipants: [
      { name: "Atif Khan", slots: 10, country: "Pakistan" },
      { name: "Sarah Johnson", slots: 2, country: "USA" },
      { name: "Ahmed Ali", slots: 1, country: "UAE" },
    ],
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.fullName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold text-foreground">{adminData.totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Slots</p>
                  <p className="text-2xl font-bold text-foreground">{adminData.totalSlots}</p>
                </div>
                <Ticket className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Current Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div>
                <p className="font-medium text-foreground">Current Prize</p>
                <p className="text-sm text-muted-foreground">{adminData.currentPrize}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Next Spin</p>
                  <p className="text-sm text-muted-foreground">{adminData.nextSpinCountdown}</p>
                </div>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground">
                Spin Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Participants */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminData.topParticipants.map((participant, index) => (
                <div key={participant.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-black"
                          : index === 1
                            ? "bg-gray-400 text-black"
                            : "bg-amber-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.country}</p>
                    </div>
                  </div>
                  <Badge variant={participant.slots > 1 ? "default" : "secondary"}>
                    {participant.slots} slot{participant.slots > 1 ? "s" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/admin/participants")}
            className="h-16 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage Participants
          </Button>
          <Button
            onClick={() => router.push("/admin/game-control")}
            variant="outline"
            className="h-16 border-border hover:bg-muted"
          >
            <Settings className="h-5 w-5 mr-2" />
            Game Settings
          </Button>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNav />
    </div>
  )
}
