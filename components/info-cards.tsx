"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Ticket, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function InfoCards() {
  const { user } = useAuth()

  // Mock data - in real app this would come from database
  const gameData = {
    totalParticipants: 24,
    currentPrize: "iPhone 15 Pro Max",
    nextSpinCountdown: "2d 14h 32m",
    userSlots: user?.slots || 1,
  }

  const winChance = ((gameData.userSlots / (gameData.totalParticipants * 1.5)) * 100).toFixed(1)

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Your Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-primary">{gameData.userSlots}</div>
          {gameData.userSlots > 1 && (
            <Badge variant="secondary" className="mt-1 text-xs">
              Boosted!
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{gameData.totalParticipants}</div>
          <div className="text-xs text-muted-foreground">Total players</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Prize
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm font-medium text-foreground">{gameData.currentPrize}</div>
          <div className="text-xs text-muted-foreground">Current prize</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Win Chance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg font-bold text-primary">{winChance}%</div>
          {gameData.userSlots === 1 && <div className="text-xs text-muted-foreground">Can be boosted!</div>}
        </CardContent>
      </Card>
    </div>
  )
}
