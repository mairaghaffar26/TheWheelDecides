"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogOut, Crown, Users, Ticket } from "lucide-react"

// Mock participants data - in real app this would come from database
const mockParticipants = [
  { id: "1", name: "Atif Khan", country: "Pakistan", slots: 10, joinedAt: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", country: "USA", slots: 1, joinedAt: "2024-01-16" },
  { id: "3", name: "Ahmed Ali", country: "UAE", slots: 1, joinedAt: "2024-01-16" },
  { id: "4", name: "Maria Garcia", country: "Spain", slots: 1, joinedAt: "2024-01-17" },
  { id: "5", name: "John Smith", country: "UK", slots: 1, joinedAt: "2024-01-17" },
  { id: "6", name: "Lisa Chen", country: "Singapore", slots: 1, joinedAt: "2024-01-18" },
  { id: "7", name: "Omar Hassan", country: "Egypt", slots: 1, joinedAt: "2024-01-18" },
  { id: "8", name: "Emma Wilson", country: "Australia", slots: 1, joinedAt: "2024-01-19" },
  { id: "9", name: "David Brown", country: "Canada", slots: 1, joinedAt: "2024-01-19" },
  { id: "10", name: "Anna Kowalski", country: "Poland", slots: 1, joinedAt: "2024-01-20" },
]

export default function GameStatus() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
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

  if (!user) {
    return null
  }

  const totalSlots = mockParticipants.reduce((sum, participant) => sum + participant.slots, 0)
  const userRank = mockParticipants.sort((a, b) => b.slots - a.slots).findIndex((p) => p.name === user.fullName) + 1

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Game Status</h1>
            <p className="text-sm text-muted-foreground">All participants and rankings</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Game Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{mockParticipants.length}</div>
              <div className="text-xs text-muted-foreground">Players</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Ticket className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{totalSlots}</div>
              <div className="text-xs text-muted-foreground">Total Slots</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Crown className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">#{userRank}</div>
              <div className="text-xs text-muted-foreground">Your Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Participants List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {mockParticipants
                .sort((a, b) => b.slots - a.slots)
                .map((participant, index) => {
                  const isCurrentUser = participant.name === user.fullName
                  const winningChance = ((participant.slots / totalSlots) * 100).toFixed(1)

                  return (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-4 border-b border-border last:border-b-0 ${
                        isCurrentUser ? "bg-primary/10 border-primary/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                                ? "bg-gray-400 text-black"
                                : index === 2
                                  ? "bg-amber-600 text-white"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                            {participant.name}
                            {isCurrentUser && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{participant.country}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={participant.slots > 1 ? "default" : "secondary"}
                            className={participant.slots > 1 ? "bg-primary text-primary-foreground" : ""}
                          >
                            {participant.slots} slot{participant.slots > 1 ? "s" : ""}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{winningChance}% chance</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-card-foreground mb-3">How it works:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Your entries are highlighted in yellow on the wheel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <span>Each slot gives you one entry in the wheel</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-3 h-3" />
                <span>Buy merchandise to get +10 bonus slots</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
