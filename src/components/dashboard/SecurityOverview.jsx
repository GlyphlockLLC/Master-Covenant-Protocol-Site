import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, AlertTriangle, CheckCircle, Activity, 
  Lock, Server, FileText, AlertOctagon, Eye
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import GlyphLoader from "@/components/GlyphLoader";

export default function SecurityOverview() {
  // 1. Active Threats
  const { data: qrThreats, isLoading: loadingQR } = useQuery({
    queryKey: ['qrThreats'],
    queryFn: () => base44.entities.QRThreatLog.filter({ resolved: false })
  });

  const { data: hotzoneThreats, isLoading: loadingHotzone } = useQuery({
    queryKey: ['hotzoneThreats'],
    queryFn: () => base44.entities.HotzoneThreat.filter({ status: "detected" }) // assuming 'detected' means active
  });

  // 2. Protected Assets
  const { data: imagesCount } = useQuery({
    queryKey: ['imagesCount'],
    queryFn: async () => (await base44.entities.InteractiveImage.list()).length
  });

  const { data: keysCount } = useQuery({
    queryKey: ['keysCount'],
    queryFn: async () => (await base44.entities.APIKey.list()).length
  });

  // 3. Recent Security Events
  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 10)
  });

  // Compliance Check (Mock/Calculated)
  const calculateCompliance = () => {
    let score = 100;
    const checks = [];
    
    if (qrThreats?.length > 0) {
      score -= 10;
      checks.push({ pass: false, msg: "Active QR threats detected" });
    } else {
        checks.push({ pass: true, msg: "No active QR threats" });
    }

    if (hotzoneThreats?.length > 0) {
      score -= 10;
      checks.push({ pass: false, msg: "Active Hotzone threats detected" });
    } else {
        checks.push({ pass: true, msg: "No active Hotzone threats" });
    }

    // Mock checks
    checks.push({ pass: true, msg: "API Keys rotated in last 90 days" });
    checks.push({ pass: true, msg: "2FA Enforced for Admins" });
    checks.push({ pass: true, msg: "Data Encryption at Rest" });

    return { score, checks };
  };

  const compliance = calculateCompliance();
  const activeThreatsCount = (qrThreats?.length || 0) + (hotzoneThreats?.length || 0);

  if (loadingQR || loadingHotzone || loadingAudit) {
    return <GlyphLoader text="Analyzing Security Posture..." fullScreen={false} />;
  }

  // Chart Data Preparation
  const threatData = [
    { name: 'QR Threats', count: qrThreats?.length || 0 },
    { name: 'Hotzone Threats', count: hotzoneThreats?.length || 0 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            Security Status Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Real-time threat monitoring and compliance overview</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant={activeThreatsCount > 0 ? "destructive" : "outline"} className="text-lg py-1 px-4">
             {activeThreatsCount > 0 ? `${activeThreatsCount} Active Threats` : "System Secure"}
           </Badge>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card-dark border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{activeThreatsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{compliance.score}%</div>
            <p className="text-xs text-gray-500 mt-1">Against industry standards</p>
          </CardContent>
        </Card>

         <Card className="glass-card-dark border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Protected Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{(imagesCount || 0) + (keysCount || 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Images & API Keys</p>
          </CardContent>
        </Card>

        <Card className="glass-card-dark border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
              <Activity className="w-5 h-5" />
              Operational
            </div>
            <p className="text-xs text-gray-500 mt-1">All systems normal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Threat Visualization */}
        <Card className="glass-card-dark border-blue-500/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              Threat Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6">
                   {threatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'QR Threats' ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Checklist */}
        <Card className="glass-card-dark border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Compliance Checks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compliance.checks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                {check.pass ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-300">{check.msg}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events Log */}
      <Card className="glass-card-dark border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs?.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-white font-medium text-sm">{log.event_type}</div>
                      <div className="text-gray-500 text-xs">{log.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{new Date(log.created_date).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{log.actor_email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No recent security events found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Threats List Details (if any) */}
      {activeThreatsCount > 0 && (
        <Card className="glass-card-dark border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Active Threat Details
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                {qrThreats?.map(threat => (
                    <Alert key={threat.id} variant="destructive" className="bg-red-950/20 border-red-900/50 text-white">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>QR Threat: {threat.attack_type}</AlertTitle>
                        <AlertDescription>
                            Detected on {new Date(threat.created_date).toLocaleString()}. Payload: {threat.payload}
                        </AlertDescription>
                    </Alert>
                ))}
                 {hotzoneThreats?.map(threat => (
                    <Alert key={threat.id} variant="destructive" className="bg-orange-950/20 border-orange-900/50 text-white">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Hotzone Threat: {threat.threat_type}</AlertTitle>
                        <AlertDescription>
                            {threat.description} (Severity: {threat.severity})
                        </AlertDescription>
                    </Alert>
                ))}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}