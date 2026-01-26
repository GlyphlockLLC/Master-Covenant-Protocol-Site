import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, Lock, Bell, Volume2, Trash2, Save, 
  Shield, Key, Mail, Phone, MapPin, Download
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile settings
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  
  // Voice preferences
  const [defaultVoice, setDefaultVoice] = useState('aurora');
  const [voiceSpeed, setVoiceSpeed] = useState([1.0]);
  const [voicePitch, setVoicePitch] = useState([1.0]);
  
  // Saved voice profiles
  const [voiceProfiles, setVoiceProfiles] = useState([]);

  useEffect(() => {
    loadUserData();
    loadVoiceProfiles();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFullName(userData.full_name || '');
      setEmail(userData.email || '');
      
      // Load preferences from UserPreferences entity
      const prefs = await base44.entities.UserPreferences.filter({ 
        created_by: userData.email 
      });
      
      if (prefs.length > 0) {
        const pref = prefs[0];
        setEmailNotifications(pref.emailNotifications ?? true);
        setSecurityAlerts(pref.securityAlerts ?? true);
        setProductUpdates(pref.productUpdates ?? false);
        setDefaultVoice(pref.defaultVoice || 'aurora');
        setVoiceSpeed([pref.voiceSpeed || 1.0]);
        setVoicePitch([pref.voicePitch || 1.0]);
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const loadVoiceProfiles = async () => {
    try {
      const profiles = await base44.entities.VoiceProfile.list();
      setVoiceProfiles(profiles);
    } catch (e) {
      console.error('Failed to load voice profiles:', e);
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName?.trim()) {
      toast.error('Full name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: fullName.trim()
      });
      setUser(prev => ({ ...prev, full_name: fullName.trim() }));
      toast.success('✅ Profile saved to database');
    } catch (e) {
      console.error('Failed to update profile:', e);
      toast.error(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setSaving(true);
    try {
      const data = {
        emailNotifications,
        securityAlerts,
        productUpdates,
        defaultVoice,
        voiceSpeed: voiceSpeed[0],
        voicePitch: voicePitch[0],
        chatSettings: {
          autoPlayVoice: false,
          theme: 'dark'
        }
      };
      
      // Try to get existing preferences
      const prefs = await base44.entities.UserPreferences.filter({ 
        created_by: user.email 
      });
      
      if (prefs.length > 0) {
        // Update existing
        await base44.entities.UserPreferences.update(prefs[0].id, data);
        toast.success('✅ Preferences saved to database');
      } else {
        // Create new
        await base44.entities.UserPreferences.create(data);
        toast.success('✅ Preferences saved to database');
      }
      
      // Reload to verify
      await loadUserData();
    } catch (e) {
      console.error('Failed to save preferences:', e);
      toast.error(e.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVoiceProfile = async (profileId) => {
    try {
      await base44.entities.VoiceProfile.delete(profileId);
      setVoiceProfiles(prev => prev.filter(p => p.id !== profileId));
      toast.success('Voice profile deleted');
    } catch (e) {
      console.error('Failed to delete voice profile:', e);
      toast.error('Failed to delete voice profile');
    }
  };

  const handleExportData = () => {
    const data = {
      user: { full_name: fullName, email },
      preferences: {
        emailNotifications,
        securityAlerts,
        productUpdates,
        defaultVoice,
        voiceSpeed: voiceSpeed[0],
        voicePitch: voicePitch[0]
      },
      voiceProfiles
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glyphlock-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="User Settings - GlyphLock"
        description="Manage your GlyphLock account settings, preferences, and voice profiles"
      />
      
      <div className="min-h-screen text-white pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Settings
            </h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900/60 border border-purple-500/30">
              <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="voice" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <Volume2 className="w-4 h-4 mr-2" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="bg-slate-800/30 border-slate-700 opacity-60"
                    />
                    <p className="text-xs text-slate-400">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="px-3 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-sm">
                      {user?.role === 'admin' ? '👑 Administrator' : '👤 User'}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Data Export</CardTitle>
                  <CardDescription>Download your settings and data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-slate-400">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Security Alerts</Label>
                      <p className="text-xs text-slate-400">Get notified about security events</p>
                    </div>
                    <Switch
                      checked={securityAlerts}
                      onCheckedChange={setSecurityAlerts}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Product Updates</Label>
                      <p className="text-xs text-slate-400">Learn about new features</p>
                    </div>
                    <Switch
                      checked={productUpdates}
                      onCheckedChange={setProductUpdates}
                    />
                  </div>

                  <Button 
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voice Tab */}
            <TabsContent value="voice" className="space-y-4">
              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Voice Settings</CardTitle>
                  <CardDescription>Configure default voice preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Default Voice</Label>
                    <Select value={defaultVoice} onValueChange={setDefaultVoice}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aurora">Aurora (Neural Premium)</SelectItem>
                        <SelectItem value="nova">Nova (Clear & Articulate)</SelectItem>
                        <SelectItem value="sage">Sage (Wise & Calm)</SelectItem>
                        <SelectItem value="echo">Echo (Dynamic & Bold)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Speed: {voiceSpeed[0]}x</Label>
                    <Slider
                      value={voiceSpeed}
                      onValueChange={setVoiceSpeed}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pitch: {voicePitch[0]}x</Label>
                    <Slider
                      value={voicePitch}
                      onValueChange={setVoicePitch}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Voice Settings'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Saved Voice Profiles</CardTitle>
                  <CardDescription>Manage your custom voice configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  {voiceProfiles.length === 0 ? (
                    <p className="text-slate-400 text-sm">No saved voice profiles yet</p>
                  ) : (
                    <div className="space-y-2">
                      {voiceProfiles.map((profile) => (
                        <div 
                          key={profile.id}
                          className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-cyan-300">{profile.profile_name}</div>
                            <div className="text-xs text-slate-400">
                              {profile.voice_id} • Speed: {profile.speed}x • Pitch: {profile.pitch}x
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVoiceProfile(profile.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card className="bg-slate-900/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold text-cyan-300">Password</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      Password management is handled by Base44 authentication
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Key className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-semibold text-cyan-300">API Keys</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Manage API access in the Developer Console
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold text-green-300">Account Status</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Your account is secure and active
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}