"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { SpinningWheel } from "@/components/spinning-wheel"
import { InfoCards } from "@/components/info-cards"
import { SalesEncouragement } from "@/components/sales-encouragement"
import { CountdownTimer } from "@/components/countdown-timer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.fullName}!</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Welcome, {user.fullName.split(" ")[0]}!</h2>
          <p className="text-primary font-medium">You're in the game! Good luck!</p>
        </div>

        <CountdownTimer />

        {/* Info Cards */}
        <InfoCards />

        {user.slots < 5 && <SalesEncouragement userSlots={user.slots} totalParticipants={24} />}

        {/* Spinning Wheel */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Live Wheel</h3>
          <SpinningWheel />
          <p className="text-sm text-muted-foreground">The wheel spins automatically every 10 seconds</p>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
