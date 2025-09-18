"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Save, Settings, Bell, Database, Palette } from "lucide-react"

export default function AdminSettings() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    siteName: "Wheel Decides",
    adminEmail: "admin@wheeldecides.com",
    shopifyWebhookUrl: "",
    emailNotifications: true,
    smsNotifications: false,
    autoSpinEnabled: true,
    maxSlotsPerUser: 50,
    welcomeMessage: "Welcome to Wheel Decides! Good luck in the giveaway!",
    promoMessage: "Buy a T-shirt to get +10 slots in the wheel!",
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

  const handleSave = () => {
    // In real app, this would save to database
    console.log("Saving admin settings:", settings)
    // Show success message
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-sm text-muted-foreground">Configure platform settings</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* General Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSlots">Max Slots Per User</Label>
              <Input
                id="maxSlots"
                type="number"
                value={settings.maxSlotsPerUser}
                onChange={(e) => setSettings({ ...settings, maxSlotsPerUser: Number.parseInt(e.target.value) })}
                className="bg-input border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for new participants</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive SMS alerts for purchases</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Spin</Label>
                <p className="text-sm text-muted-foreground">Enable automatic wheel spinning</p>
              </div>
              <Switch
                checked={settings.autoSpinEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, autoSpinEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopifyWebhook">Shopify Webhook URL</Label>
              <Input
                id="shopifyWebhook"
                value={settings.shopifyWebhookUrl}
                onChange={(e) => setSettings({ ...settings, shopifyWebhookUrl: e.target.value })}
                placeholder="https://your-shopify-store.com/webhook"
                className="bg-input border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground">Used to automatically add slots when purchases are made</p>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Custom Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                className="bg-input border-border text-foreground"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoMessage">Promotional Message</Label>
              <Textarea
                id="promoMessage"
                value={settings.promoMessage}
                onChange={(e) => setSettings({ ...settings, promoMessage: e.target.value })}
                className="bg-input border-border text-foreground"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Admin Navigation */}
      <AdminNav />
    </div>
  )
}
