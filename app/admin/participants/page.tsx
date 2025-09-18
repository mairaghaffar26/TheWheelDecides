"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, Plus, Minus, Search, Edit } from "lucide-react"

// Mock participants data
const mockParticipants = [
  { id: "1", name: "Atif Khan", email: "atif@example.com", country: "Pakistan", slots: 10, joinedAt: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", country: "USA", slots: 1, joinedAt: "2024-01-16" },
  { id: "3", name: "Ahmed Ali", email: "ahmed@example.com", country: "UAE", slots: 1, joinedAt: "2024-01-16" },
  { id: "4", name: "Maria Garcia", email: "maria@example.com", country: "Spain", slots: 1, joinedAt: "2024-01-17" },
  { id: "5", name: "John Smith", email: "john@example.com", country: "UK", slots: 1, joinedAt: "2024-01-17" },
]

export default function AdminParticipants() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [participants, setParticipants] = useState(mockParticipants)

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

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateSlots = (participantId: string, change: number) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, slots: Math.max(0, p.slots + change) } : p)),
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Participants</h1>
            <p className="text-sm text-muted-foreground">Manage all participants and their slots</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search and Stats */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{participants.length}</div>
                <div className="text-xs text-muted-foreground">Total Participants</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Plus className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {participants.reduce((sum, p) => sum + p.slots, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Slots</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Edit className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {participants.filter((p) => p.slots > 1).length}
                </div>
                <div className="text-xs text-muted-foreground">Boosted Users</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Participants List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Participants ({filteredParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredParticipants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-11">
                      <Badge variant="outline" className="text-xs">
                        {participant.country}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(participant.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSlots(participant.id, -1)}
                      disabled={participant.slots <= 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-foreground">{participant.slots}</div>
                      <div className="text-xs text-muted-foreground">slots</div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSlots(participant.id, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setParticipants((prev) => prev.map((p) => ({ ...p, slots: p.slots + 1 })))
                }}
                className="border-border hover:bg-muted"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add 1 Slot to All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setParticipants((prev) => prev.map((p) => ({ ...p, slots: Math.max(1, p.slots - 1) })))
                }}
                className="border-border hover:bg-muted"
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove 1 Slot from All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Navigation */}
      <AdminNav />
    </div>
  )
}
