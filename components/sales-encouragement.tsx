"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface SalesEncouragementProps {
  userSlots: number
  totalParticipants: number
}

export function SalesEncouragement({ userSlots, totalParticipants }: SalesEncouragementProps) {
  const [showLiveActivity, setShowLiveActivity] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const winChance = ((userSlots / (totalParticipants * 1.5)) * 100).toFixed(1)
  const potentialWinChance = (((userSlots + 10) / (totalParticipants * 1.5)) * 100).toFixed(1)

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setShowLiveActivity(true)
      setTimeout(() => setShowLiveActivity(false), 8000)
    }, 30000)

    return () => clearInterval(activityInterval)
  }, [])

  if (isDismissed) return null

  return (
    <div className="space-y-4">
      {showLiveActivity && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-300">2 players just increased their slots in the last hour</span>
            <span className="text-red-500 font-medium">Live</span>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-black via-gray-900 to-yellow-900/40 border border-yellow-500/30 rounded-lg p-4 text-center backdrop-blur-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Boost Your Chances</h3>
            <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Recommended</Badge>
          </div>

          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400 font-medium">Current:</span>
              <span>{winChance}%</span>
              <span className="text-gray-500">→</span>
              <span className="text-green-400 font-medium">Potential:</span>
              <span>{potentialWinChance}%</span>
            </div>
            <div className="text-sm text-red-100">Win Chance</div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium animate-pulse hover:animate-none transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
              onClick={() => window.open("https://shop.wheeldecides.com", "_blank")}
            >
              Shop T-Shirts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
