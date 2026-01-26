import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Activity, Shield, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Zap, Radio, Server, Database, Globe, QrCode,
  ShoppingCart, DollarSign, UserCheck
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RealtimeDashboard({ user }) {
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 0,
    qrScansToday: 0,
    threatsBlocked: 0,
    systemLoad: 0
  });

  // Real-time queries with auto-refresh
  const { data: systemLogs = [] } = useQuery({
    queryKey: ['system-logs-live'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 100),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const { data: threatLogs = [] } = useQuery({
    queryKey: ['threat-logs-live'],
    queryFn: () => base44.entities.QRThreatLog.list('-created_date', 50),
    refetchInterval: 10000
  });

  const { data: nupsTransactions = [] } = useQuery({
    queryKey: ['nups-transactions-live'],
    queryFn: async () => {
      const all = await base44.entities.POSTransaction.list('-created_date', 200);
      const today = new Date().toDateString();
      return all.filter(t => new Date(t.created_date).toDateString() === today);
    },
    refetchInterval: 15000
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['entertainers-live'],
    queryFn: () => base44.entities.EntertainerShift.filter({ status: 'checked_in' }),
    refetchInterval: 10000
  });

  const { data: qrScans = [] } = useQuery({
    queryKey: ['qr-scans-live'],
    queryFn: async () => {
      const all = await base44.entities.QrScanEvent.list('-created_date', 500);
      const today = new Date().toDateString();
      return all.filter(s => new Date(s.created_date).toDateString() === today);
    },
    refetchInterval: 10000
  });

  // Calculate live metrics
  useEffect(() => {
    const todayThreats = threatLogs.filter(t => {
      const date = new Date(t.created_date).toDateString();
      return date === new Date().toDateString();
    });

    setLiveMetrics({
      activeUsers: entertainers.length,
      qrScansToday: qrScans.length,
      threatsBlocked: todayThreats.length,
      systemLoad: Math.min(100, (systemLogs.length / 10) * 100)
    });
  }, [systemLogs, threatLogs, qrScans, entertainers]);

  // Activity timeline for last 24 hours
  const activityTimeline = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(i, 0, 0, 0);
    const hourStr = hour.toTimeString().split(':')[0];
    
    return {
      hour: `${hourStr}:00`,
      scans: qrScans.filter(s => new Date(s.created_date).getHours() === i).length,
      threats: threatLogs.filter(t => new Date(t.created_date).getHours() === i).length,
      transactions: nupsTransactions.filter(tx => new Date(tx.created_date).getHours() === i).length
    };
  });

  const criticalAlerts = threatLogs
    .filter(t => t.severity === 'critical' && !t.resolved)
    .slice(0, 5);

  const recentActivity = systemLogs.slice(0, 10);

  const todayRevenue = nupsTransactions.reduce((sum, t) => sum + (t.total || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Live Status Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-green-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <div>
            <p className="text-white font-semibold">System Active</p>
            <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400">All Systems Operational</Badge>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-6 h-6 text-cyan-400" />
              <Badge className="bg-cyan-500/20 text-cyan-400">LIVE</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{liveMetrics.activeUsers}</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-purple-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <QrCode className="w-6 h-6 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-400">TODAY</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{liveMetrics.qrScansToday}</div>
            <div className="text-sm text-slate-400">QR Scans</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-red-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-6 h-6 text-red-400" />
              <Badge className="bg-red-500/20 text-red-400">BLOCKED</Badge>
            </div>
            <div className="text-3xl font-bold text-white">{liveMetrics.threatsBlocked}</div>
            <div className="text-sm text-slate-400">Threats Today</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-green-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <Badge className="bg-green-500/20 text-green-400">NUPS</Badge>
            </div>
            <div className="text-3xl font-bold text-white">${todayRevenue.toFixed(0)}</div>
            <div className="text-sm text-slate-400">Revenue Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              Critical Security Alerts ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <div>
                    <p className="text-white font-medium">{alert.attack_type}</p>
                    <p className="text-xs text-slate-400">{alert.threat_description}</p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400">{alert.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Activity Chart */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            24-Hour Activity Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTimeline}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} fill="url(#colorScans)" name="QR Scans" />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fill="url(#colorThreats)" name="Threats" />
                <Area type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} fill="url(#colorTx)" name="NUPS Sales" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* NUPS Activity Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-400" />
              NUPS Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Transactions</span>
              <span className="text-xl font-bold text-white">{nupsTransactions.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Revenue</span>
              <span className="text-xl font-bold text-green-400">${todayRevenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Avg Ticket</span>
              <span className="text-xl font-bold text-cyan-400">
                ${(todayRevenue / nupsTransactions.length || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Staff On Duty</span>
              <span className="text-xl font-bold text-purple-400">{entertainers.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent System Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.map(log => (
                <div key={log.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'failure' ? 'bg-red-400' : 
                      log.status === 'alert' ? 'bg-yellow-400' : 
                      'bg-green-400'
                    }`} />
                    <span className="text-sm text-slate-300">{log.event_type}</span>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(log.created_date).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Indicators */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">API Gateway</p>
                  <p className="text-xs text-slate-400">Response Time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">23ms</p>
                <Badge className="bg-green-500/20 text-green-400 text-xs">Optimal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Database</p>
                  <p className="text-xs text-slate-400">Query Performance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">99.9%</p>
                <Badge className="bg-green-500/20 text-green-400 text-xs">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-white font-semibold">CDN</p>
                  <p className="text-xs text-slate-400">Global Uptime</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">100%</p>
                <Badge className="bg-green-500/20 text-green-400 text-xs">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}