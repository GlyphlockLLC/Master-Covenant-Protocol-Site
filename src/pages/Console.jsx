import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import VioletLoader from "@/components/shared/VioletLoader";
import AdminGate, { AdminPageMeta } from "@/components/security/AdminGate";
import ConsoleLayout from "@/components/console/ConsoleLayout";
import DashboardHome from "@/components/console/DashboardHome";
import KeyManagement from "@/components/admin/KeyManagement";
import StatusReport from "@/components/admin/StatusReport";
import { useThreatDetection } from "@/components/commandcenter/ThreatDetectionEngine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Shield, Key, Activity, Zap, Settings, Users, FileText, 
  TrendingUp, Clock, AlertTriangle, CheckCircle, Lock,
  Copy, RefreshCw, Plus, Download, Code, Database, QrCode, 
  Image, Bot, Server, ShieldAlert, Radio, Loader2, ChevronRight,
  Globe, Home
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  ThreatAlert,
  ThreatConfigPanel,
  ThreatSummaryWidget,
  THREAT_TYPES
} from "@/components/commandcenter/ThreatDetectionEngine";

// Threat Detection Module
function ThreatDetectionModule({ user, threatDetection }) {
  const {
    threats,
    config,
    setConfig,
    isScanning,
    runAnalysis,
    dismissThreat,
    handleAction
  } = threatDetection;

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            AI Threat Detection
          </h2>
          <p className="text-sm text-slate-400">Real-time anomaly detection and threat analysis</p>
        </div>
        <div className="flex items-center gap-3">
          {isScanning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400">Scanning</span>
            </div>
          )}
          <Button onClick={runAnalysis} variant="outline" size="sm" className="border-slate-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan Now
          </Button>
          <Button onClick={() => setShowConfig(!showConfig)} variant="outline" size="sm" className="border-slate-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {showConfig && <ThreatConfigPanel config={config} onConfigChange={setConfig} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map((severity, idx) => {
          const count = threats.filter(t => THREAT_TYPES[t.type]?.severity === severity).length;
          const colors = {
            critical: 'bg-red-500/10 text-red-400',
            high: 'bg-orange-500/10 text-orange-400',
            medium: 'bg-yellow-500/10 text-yellow-400',
            low: 'bg-blue-500/10 text-blue-400'
          };
          return (
            <Card key={severity} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors[severity]}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-slate-400 capitalize">{severity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white">Active Threats ({threats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {threats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">No Active Threats</p>
              <p className="text-sm text-slate-500 mt-1">Your system is secure</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {threats.map((threat, idx) => (
                <ThreatAlert
                  key={`${threat.type}-${idx}`}
                  threat={threat}
                  onDismiss={dismissThreat}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Analytics Module
function AnalyticsModule() {
  const [dateRange, setDateRange] = useState("30");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 500)
  });

  const { data: qrAssets = [] } = useQuery({
    queryKey: ['qrAssets'],
    queryFn: () => base44.entities.QrAsset.list()
  });

  const { data: scanEvents = [] } = useQuery({
    queryKey: ['scanEvents'],
    queryFn: () => base44.entities.QrScanEvent.list('-created_date', 500)
  });

  const daysToShow = parseInt(dateRange);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToShow);

  const filteredLogs = auditLogs.filter(log => {
    const logDate = new Date(log.created_date);
    const matchesDate = logDate >= startDate;
    const matchesType = eventTypeFilter === "all" || log.event_type === eventTypeFilter;
    return matchesDate && matchesType;
  });

  const eventTypes = ["all", ...new Set(auditLogs.map(l => l.event_type).filter(Boolean))];

  const chartData = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (daysToShow - 1 - i));
    const dateStr = date.toDateString();
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      scans: scanEvents.filter(e => new Date(e.created_date).toDateString() === dateStr).length,
      events: filteredLogs.filter(l => new Date(l.created_date).toDateString() === dateStr).length,
      qrCreated: qrAssets.filter(q => new Date(q.created_date).toDateString() === dateStr).length
    };
  });

  const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-sm text-slate-400">Interactive insights from your data</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type}>{type === "all" ? "All Events" : type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-400 text-xs">QR Codes</p>
              <QrCode className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{qrAssets.length}</p>
            <p className="text-xs text-green-400 mt-1">+{qrAssets.filter(q => new Date(q.created_date) >= startDate).length} this period</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-400 text-xs">Total Scans</p>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{scanEvents.length}</p>
            <p className="text-xs text-purple-400 mt-1">{Math.round(scanEvents.length / daysToShow)} daily avg</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-400 text-xs">Events</p>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{filteredLogs.length}</p>
            <p className="text-xs text-blue-400 mt-1">{Math.round(filteredLogs.length / daysToShow)} daily avg</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Activity Trends ({dateRange} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorScans)" name="QR Scans" />
                <Area type="monotone" dataKey="events" stroke="#06b6d4" strokeWidth={2} fill="url(#colorEvents)" name="System Events" />
                <Area type="monotone" dataKey="qrCreated" stroke="#10b981" strokeWidth={2} fill="url(#colorQR)" name="QR Created" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Logs Module
function LogsModule() {
  const [filter, setFilter] = useState("all");
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 100)
  });

  const filteredLogs = filter === "all" ? logs : logs.filter(l => l.status === filter);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 p-6"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Activity Logs</h2>
          <p className="text-sm text-slate-400">{logs.length} total events</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failure">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">No logs found</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'failure' ? 'bg-red-400' : 'bg-green-400'}`} />
                      <div>
                        <p className="text-white text-sm">{log.event_type || 'System Event'}</p>
                        <p className="text-xs text-slate-500">{log.description || 'No description'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(log.created_date).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tools Module
function ToolsModule() {
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");

  const generateHash = async (algorithm) => {
    if (!hashInput) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHashOutput(hashHex);
    toast.success(`${algorithm} hash generated`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-white">Security Tools</h2>
        <p className="text-sm text-slate-400">Cryptographic utilities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Hash Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to hash..."
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-20"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => generateHash('SHA-256')} variant="outline" size="sm">SHA-256</Button>
              <Button onClick={() => generateHash('SHA-384')} variant="outline" size="sm">SHA-384</Button>
              <Button onClick={() => generateHash('SHA-512')} variant="outline" size="sm">SHA-512</Button>
            </div>
            {hashOutput && (
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Output</span>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(hashOutput); toast.success("Copied!"); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <code className="text-xs text-cyan-400 break-all">{hashOutput}</code>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// User Management Module
function UserManagementModule({ user }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [isInviting, setIsInviting] = useState(false);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
    enabled: user?.role === 'admin'
  });

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    setIsInviting(true);
    try {
      await base44.users.inviteUser(inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      refetch();
    } catch (err) {
      toast.error("Failed to send invitation");
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-sm text-slate-400">Invite and manage team members</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-sm">Invite New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white md:col-span-2"
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleInvite} disabled={isInviting} className="w-full">
            {isInviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-sm">Team Members ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" /></div>
          ) : users.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No users yet</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <div>
                    <p className="text-white text-sm">{u.email}</p>
                    <p className="text-xs text-slate-500">{u.full_name || 'No name'}</p>
                  </div>
                  <Badge className={u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}>
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Module
function SettingsModule({ user }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-bold text-white">Console Settings</h2>
        <p className="text-sm text-slate-400">Manage your account and preferences</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-sm">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-400 text-xs">Email</Label>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Role</Label>
            <Badge className="bg-cyan-500/20 text-cyan-400">{user?.role || 'User'}</Badge>
          </div>
          <div>
            <Label className="text-slate-400 text-xs">Account Created</Label>
            <p className="text-white">{user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-sm">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link to={createPageUrl('AccountSecurity')}>
            <Button variant="outline" className="w-full justify-start border-slate-700 hover:border-cyan-500/50">
              <Lock className="w-4 h-4 mr-2 text-cyan-400" />
              Account Security
            </Button>
          </Link>
          <Link to={createPageUrl('SDKDocs')}>
            <Button variant="outline" className="w-full justify-start border-slate-700 hover:border-blue-500/50">
              <Code className="w-4 h-4 mr-2 text-blue-400" />
              SDK Documentation
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Console Content Component
function ConsoleContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("dashboard");

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate(createPageUrl('Home'));
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
        if (userData?.role !== 'admin') {
          navigate(createPageUrl('Home'));
        }
      } catch (err) {
        console.error("Auth error:", err);
        navigate(createPageUrl('Home'));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const threatDetection = useThreatDetection(user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <VioletLoader text="Initializing GlyphLock Console..." />
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <DashboardHome user={user} />;
      case "api-keys": return <div className="p-6"><KeyManagement /></div>;
      case "sdk": return <SettingsModule user={user} />;
      case "functions": return <ToolsModule />;
      case "logs": return <LogsModule />;
      case "usage": return <AnalyticsModule />;
      case "team-roles": return <UserManagementModule user={user} />;
      case "security": return <ThreatDetectionModule user={user} threatDetection={threatDetection} />;
      case "billing": return <SettingsModule user={user} />;
      case "audit-timeline": return <LogsModule />;
      default: return <DashboardHome user={user} />;
    }
  };

  return (
    <>
      <SEOHead title="GlyphLock Console | Admin Dashboard" description="Enterprise admin console for GlyphLock Security" url="/console" />
      <AdminPageMeta />
      <ConsoleLayout user={user} activeModule={activeModule} setActiveModule={setActiveModule}>
        {renderModule()}
      </ConsoleLayout>
    </>
  );
}

// Admin-Protected Export
export default function Console() {
  return (
    <AdminGate pageName="GlyphLock Console">
      <ConsoleContent />
    </AdminGate>
  );
}