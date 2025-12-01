import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Activity, Clock, CheckCircle, 
  AlertTriangle, Zap, Lock, TrendingUp 
} from "lucide-react";

const KPI_CONFIGS = [
  {
    id: 'uptime',
    label: 'System Uptime',
    icon: Activity,
    color: 'green',
    format: (v) => `${v}%`,
    target: 99.9
  },
  {
    id: 'integrity',
    label: 'Integrity Score',
    icon: Shield,
    color: 'blue',
    format: (v) => `${v}%`,
    target: 100
  },
  {
    id: 'response',
    label: 'Avg Response',
    icon: Zap,
    color: 'purple',
    format: (v) => `${v}ms`,
    target: 50
  },
  {
    id: 'threats_blocked',
    label: 'Threats Blocked',
    icon: Lock,
    color: 'red',
    format: (v) => v.toLocaleString(),
    target: null
  }
];

const COLOR_CLASSES = {
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'
  },
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  purple: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
  },
  red: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
  }
};

export default function SecurityKPIs() {
  // Fetch threat data for calculations
  const { data: threats } = useQuery({
    queryKey: ['kpiThreats'],
    queryFn: () => base44.entities.QRThreatLog.list('-created_date', 100)
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['kpiAuditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', 50)
  });

  // Calculate KPIs
  const calculateKPIs = () => {
    const resolvedThreats = threats?.filter(t => t.resolved)?.length || 0;
    const totalThreats = threats?.length || 0;
    const blockedThreats = totalThreats;

    // Calculate integrity based on resolved vs total threats
    const integrityScore = totalThreats > 0 
      ? Math.round((resolvedThreats / totalThreats) * 100) 
      : 100;

    // Mock uptime (would come from monitoring service)
    const uptime = 99.97;

    // Calculate avg response from audit logs with latency
    const logsWithLatency = auditLogs?.filter(l => l.details?.latency_ms) || [];
    const avgResponse = logsWithLatency.length > 0
      ? Math.round(logsWithLatency.reduce((acc, l) => acc + (l.details?.latency_ms || 0), 0) / logsWithLatency.length)
      : 42;

    return {
      uptime,
      integrity: integrityScore,
      response: avgResponse,
      threats_blocked: blockedThreats
    };
  };

  const kpis = calculateKPIs();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIGS.map((kpi) => {
        const value = kpis[kpi.id];
        const colors = COLOR_CLASSES[kpi.color];
        const Icon = kpi.icon;
        const isGood = kpi.target === null || value >= kpi.target;

        return (
          <Card 
            key={kpi.id} 
            className={`bg-slate-900/80 border-2 ${colors.border} ${colors.glow} hover:scale-[1.02] transition-transform cursor-pointer`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                {kpi.target !== null && (
                  <div className={`flex items-center gap-1 ${isGood ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isGood ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              <div className={`text-2xl font-black ${colors.text} mb-1`}>
                {kpi.format(value)}
              </div>
              <div className="text-xs text-white/60 uppercase tracking-wider font-medium">
                {kpi.label}
              </div>
              {kpi.target !== null && (
                <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors.bg.replace('/20', '')} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min((value / kpi.target) * 100, 100)}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}