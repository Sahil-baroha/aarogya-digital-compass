
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Bell, Clock, Lock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuthContext } from '@/components/AuthProvider'
import { useToast } from '@/hooks/use-toast'

interface SecuritySettings {
  id: string
  two_factor_enabled: boolean
  login_notifications: boolean
  data_access_notifications: boolean
  session_timeout_minutes: number
  require_reauth_for_sensitive: boolean
}

export const SecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuthContext()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchSecuritySettings()
    }
  }, [user])

  const fetchSecuritySettings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings(data)
      } else {
        // Create default settings if none exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_security_settings')
          .insert({
            user_id: user.id,
            two_factor_enabled: false,
            login_notifications: true,
            data_access_notifications: true,
            session_timeout_minutes: 480,
            require_reauth_for_sensitive: true
          })
          .select()
          .single()

        if (createError) throw createError
        setSettings(newSettings)
      }
    } catch (error: any) {
      console.error('Error fetching security settings:', error)
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<SecuritySettings>) => {
    if (!user || !settings) return

    try {
      setSaving(true)

      const { data, error } = await supabase
        .from('user_security_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setSettings(data)
      toast({
        title: "Settings Updated",
        description: "Your security settings have been updated successfully"
      })
    } catch (error: any) {
      console.error('Error updating security settings:', error)
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const sessionTimeoutOptions = [
    { value: 60, label: '1 hour' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' }
  ]

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading security settings...</p>
        </CardContent>
      </Card>
    )
  }

  if (!settings) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security Settings</span>
        </CardTitle>
        <CardDescription>
          Manage your account security preferences and authentication settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-base font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Switch
            checked={settings.two_factor_enabled}
            onCheckedChange={(checked) => 
              updateSettings({ two_factor_enabled: checked })
            }
            disabled={saving}
          />
        </div>

        {/* Login Notifications */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-base font-medium">Login Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when someone logs into your account
              </p>
            </div>
          </div>
          <Switch
            checked={settings.login_notifications}
            onCheckedChange={(checked) => 
              updateSettings({ login_notifications: checked })
            }
            disabled={saving}
          />
        </div>

        {/* Data Access Notifications */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-base font-medium">Data Access Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when your medical data is accessed
              </p>
            </div>
          </div>
          <Switch
            checked={settings.data_access_notifications}
            onCheckedChange={(checked) => 
              updateSettings({ data_access_notifications: checked })
            }
            disabled={saving}
          />
        </div>

        {/* Session Timeout */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-base font-medium">Session Timeout</Label>
              <p className="text-sm text-gray-500">
                Automatically log out after a period of inactivity
              </p>
            </div>
          </div>
          <Select
            value={settings.session_timeout_minutes.toString()}
            onValueChange={(value) => 
              updateSettings({ session_timeout_minutes: parseInt(value) })
            }
            disabled={saving}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessionTimeoutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Require Re-authentication */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <Label className="text-base font-medium">Require Re-authentication</Label>
              <p className="text-sm text-gray-500">
                Require password confirmation for sensitive actions
              </p>
            </div>
          </div>
          <Switch
            checked={settings.require_reauth_for_sensitive}
            onCheckedChange={(checked) => 
              updateSettings({ require_reauth_for_sensitive: checked })
            }
            disabled={saving}
          />
        </div>

        {saving && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-500">Saving...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
