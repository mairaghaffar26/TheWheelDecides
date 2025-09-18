"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LogOut, Edit, Save, X, User, Mail, Instagram, MapPin, Calendar, Ticket } from "lucide-react"
import { useToast } from "@/components/ui/use-toast" // Import useToast

export default function Profile() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast() // Declare useToast
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    instagramHandle: "",
    country: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
      return
    }
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        instagramHandle: user.instagramHandle || "",
        country: user.country || "",
      })
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

  const handleSave = async () => {
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name and email are required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Saving user data:", editForm)

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (
      JSON.stringify(editForm) !==
      JSON.stringify({
        fullName: user.fullName || "",
        email: user.email || "",
        instagramHandle: user.instagramHandle || "",
        country: user.country || "",
      })
    ) {
      if (confirm("Are you sure you want to discard your changes?")) {
        setEditForm({
          fullName: user.fullName || "",
          email: user.email || "",
          instagramHandle: user.instagramHandle || "",
          country: user.country || "",
        })
        setIsEditing(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Unknown"
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateObj)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account information</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-card-foreground truncate">{user.fullName}</h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="ml-2 flex-shrink-0"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground truncate">{user.email}</p>
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="mt-1">
                  {user.role === "admin" ? "Admin" : "Player"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{user.slots || 1}</div>
                <div className="text-xs text-muted-foreground">Slots</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{(((user.slots || 1) / 17) * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Win Chance</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-foreground">
                  {formatDate(user.createdAt).split(" ").slice(0, 2).join(" ")}
                </div>
                <div className="text-xs text-muted-foreground">Joined</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-card-foreground">Personal Information</CardTitle>
            {isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary text-primary-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              ) : (
                <p className="text-foreground bg-muted/50 p-3 rounded-md">{user.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-input border-border text-foreground"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Email changes require verification</p>
                </div>
              ) : (
                <p className="text-foreground bg-muted/50 p-3 rounded-md">{user.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-card-foreground flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram Handle
              </Label>
              {isEditing ? (
                <Input
                  id="instagram"
                  value={editForm.instagramHandle}
                  onChange={(e) => setEditForm({ ...editForm, instagramHandle: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              ) : (
                <p className="text-foreground bg-muted/50 p-3 rounded-md">{user.instagramHandle}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Country
              </Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              ) : (
                <p className="text-foreground bg-muted/50 p-3 rounded-md">{user.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="text-foreground bg-muted/50 p-3 rounded-md">{formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Game Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div>
                  <p className="font-medium text-foreground">Initial Entry</p>
                  <p className="text-sm text-muted-foreground">Joined the giveaway</p>
                </div>
                <Badge variant="secondary">+1 slot</Badge>
              </div>
              {(user.slots || 1) > 1 && (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md border border-primary/20">
                  <div>
                    <p className="font-medium text-foreground">Merchandise Purchase</p>
                    <p className="text-sm text-muted-foreground">Bought T-shirt for bonus slots</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">+{(user.slots || 1) - 1} slots</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileNav />
    </div>
  )
}
