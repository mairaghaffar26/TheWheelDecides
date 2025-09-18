"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Timer, Trophy, Play, Pause, RotateCcw } from "lucide-react"

export default function AdminGameControl() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [gameSettings, setGameSettings] = useState({
    currentPrize: "iPhone 15 Pro Max",
    prizeDescription: "Latest iPhone with 256GB storage in Natural Titanium",
    spinCountdownDays: 2,
    spinCountdownHours: 14,
    spinCountdownMinutes: 32,
    isGameActive: true,
    autoSpinEnabled: true,
  })

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

  const handleSaveSettings = () => {
    // In real app, this would save to database
    console.log("Saving game settings:", gameSettings)
    alert("Game settings saved successfully!")
  }

  const handleSpinNow = () => {
    // In real app, this would trigger the wheel spin
    console.log("Spinning wheel now...")
    alert("Wheel is spinning! Winner will be announced shortly.")
  }

  const handleResetGame = () => {
    if (confirm("Are you sure you want to reset the game? This will clear all current progress.")) {
      console.log("Resetting game...")
      alert("Game has been reset successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Game Control</h1>
            <p className="text-sm text-muted-foreground">Manage game settings and controls</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Game Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Play className="h-5 w-5" />
              Game Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div>
                <p className="font-medium text-foreground">Current Status</p>
                <p className="text-sm text-muted-foreground">
                  Game is {gameSettings.isGameActive ? "Active" : "Paused"}
                </p>
              </div>
              <Button
                onClick={() => setGameSettings({ ...gameSettings, isGameActive: !gameSettings.isGameActive })}
                variant={gameSettings.isGameActive ? "destructive" : "default"}
                className={gameSettings.isGameActive ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}
              >
                {gameSettings.isGameActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Game
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Game
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleSpinNow}
                className="h-16 bg-primary text-primary-foreground hover:bg-primary/90 pulse-glow"
                disabled={!gameSettings.isGameActive}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Spin Wheel Now
              </Button>
              <Button
                onClick={handleResetGame}
                variant="destructive"
                className="h-16"
                disabled={!gameSettings.isGameActive}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset Game
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prize Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Prize Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prize" className="text-card-foreground">
                Current Prize
              </Label>
              <Input
                id="prize"
                value={gameSettings.currentPrize}
                onChange={(e) => setGameSettings({ ...gameSettings, currentPrize: e.target.value })}
                className="bg-input border-border text-foreground"
                placeholder="Enter prize name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizeDescription" className="text-card-foreground">
                Prize Description
              </Label>
              <Textarea
                id="prizeDescription"
                value={gameSettings.prizeDescription}
                onChange={(e) => setGameSettings({ ...gameSettings, prizeDescription: e.target.value })}
                className="bg-input border-border text-foreground"
                placeholder="Enter detailed prize description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Countdown Timer Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Next Spin Countdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="days" className="text-card-foreground">
                  Days
                </Label>
                <Input
                  id="days"
                  type="number"
                  min="0"
                  max="30"
                  value={gameSettings.spinCountdownDays}
                  onChange={(e) =>
                    setGameSettings({ ...gameSettings, spinCountdownDays: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-card-foreground">
                  Hours
                </Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={gameSettings.spinCountdownHours}
                  onChange={(e) =>
                    setGameSettings({ ...gameSettings, spinCountdownHours: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minutes" className="text-card-foreground">
                  Minutes
                </Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={gameSettings.spinCountdownMinutes}
                  onChange={(e) =>
                    setGameSettings({ ...gameSettings, spinCountdownMinutes: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Current countdown:{" "}
                <span className="font-medium text-foreground">
                  {gameSettings.spinCountdownDays}d {gameSettings.spinCountdownHours}h{" "}
                  {gameSettings.spinCountdownMinutes}m
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shopify Integration Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Shopify Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <p className="font-medium text-foreground">Integration Status</p>
                <p className="text-sm text-muted-foreground">Connected and monitoring purchases</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Automatic slot assignment is enabled. Users who purchase merchandise will receive +10 slots
                automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <Button
          onClick={handleSaveSettings}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 pulse-glow"
        >
          Save All Settings
        </Button>
      </div>

      {/* Admin Navigation */}
      <AdminNav />
    </div>
  )
}
