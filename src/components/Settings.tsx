import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext } from './AppContext';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  Database
} from 'lucide-react';

export function Settings() {
  const { state, dispatch } = useAppContext();
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    exercises: true,
    community: false
  });
  const [privacy, setPrivacy] = useState({
    anonymous: false,
    analytics: true,
    dataSharing: false
  });

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme based on system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  };

  const handleExportData = () => {
    const data = {
      moodEntries: state.moodEntries,
      exercises: state.exercises,
      chatHistory: state.chatHistory.map(msg => ({
        content: msg.content,
        isUser: msg.isUser,
        timestamp: msg.timestamp
      })),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindwell-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <SettingsIcon className="w-8 h-8 text-gray-500" />
          <span>Settings</span>
        </h1>
        <p className="text-muted-foreground">Customize your MindWell experience</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={state.user?.name}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={state.user?.email}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Security</span>
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Daily Check-ins</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind me to log my mood daily
                  </p>
                </div>
                <Switch
                  checked={notifications.daily}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, daily: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Weekly Summaries</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly insights about your mood trends
                  </p>
                </div>
                <Switch
                  checked={notifications.weekly}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weekly: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Exercise Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Remind me to practice CBT exercises
                  </p>
                </div>
                <Switch
                  checked={notifications.exercises}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, exercises: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Community Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify me about replies and community activity
                  </p>
                </div>
                <Switch
                  checked={notifications.community}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, community: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Anonymous Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Post anonymously in community groups by default
                  </p>
                </div>
                <Switch
                  checked={privacy.anonymous}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, anonymous: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share aggregated data for mental health research
                  </p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize how MindWell looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={state.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('light')}
                    className="flex items-center space-x-2"
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={state.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('dark')}
                    className="flex items-center space-x-2"
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={state.theme === 'auto' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('auto')}
                    className="flex items-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Auto</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </CardTitle>
                <CardDescription>Download your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export all your mood entries, exercise history, and chat data in JSON format.
                </p>
                <Button onClick={handleExportData} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Clear All Mood Data
                  </Button>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Clear Chat History
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Account deletion is permanent and cannot be undone. All your data will be lost.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}