import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, Link2, QrCode, Shield, Zap, 
  AlertTriangle, CheckCircle, Clock, ArrowRight
} from "lucide-react";
import { WEBHOOK_EVENTS, getEventSeverity, EVENT_SEVERITY } from "@/components/sdk/webhookEvents";

const EVENT_ICONS = {
  chain: Zap,
  qr: QrCode,
  covenant: Shield,
  security: AlertTriangle,
  payment: Link2
};

const SEVERITY_STYLES = {
  [EVENT_SEVERITY.INFO]: "bg-blue-500/20 border-blue-500/50 text-blue-400",
  [EVENT_SEVERITY.WARNING]: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
  [EVENT_SEVERITY.ERROR]: "bg-red-500/20 border-red-500/50 text-red-400",
  [EVENT_SEVERITY.CRITICAL]: "bg-red-600/30 border-red-600/60 text-red-300 animate-pulse"
};

export default function LiveSecurityFeed({ maxEvents = 15 }) {
  const [liveEvents, setLiveEvents] = useState([]);

  // Fetch recent audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['liveAuditLogs'],
    queryFn: () => base44.entities.SystemAuditLog.list('-created_date', maxEvents),
    refetchInterval: 5000 // Poll every 5 seconds
  });

  // Transform audit logs to events
  useEffect(() => {
    if (auditLogs) {
      const events = auditLogs.map(log => ({
        id: log.id,
        type: mapEventType(log.event_type),
        category: getEventCategory(log.event_type),
        severity: log.severity || EVENT_SEVERITY.INFO,
        message: log.event_type?.replace(/_/g, ' ').toUpperCase(),
        details: log.details,
        timestamp: new Date(log.created_date)
      }));
      setLiveEvents(events);
    }
  }, [auditLogs]);

  const mapEventType = (type) => {
    if (type?.includes('chain')) return 'chain';
    if (type?.includes('qr') || type?.includes('QR')) return 'qr';
    if (type?.includes('covenant')) return 'covenant';
    if (type?.includes('security') || type?.includes('threat')) return 'security';
    if (type?.includes('payment')) return 'payment';
    return 'chain';
  };

  const getEventCategory = (type) => {
    if (type?.includes('completed') || type?.includes('verified')) return 'success';
    if (type?.includes('failed') || type?.includes('denied') || type?.includes('threat')) return 'error';
    return 'info';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
      <CardHeader className="pb-3 border-b border-[#3B82F6]/30">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            Live Security Feed
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[400px] overflow-y-auto scrollbar-hide">
        {liveEvents.length === 0 ? (
          <div className="p-8 text-center text-white/50">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Waiting for security events...</p>
          </div>
        ) : (
          <div className="divide-y divide-[#3B82F6]/20">
            {liveEvents.map((event) => {
              const Icon = EVENT_ICONS[event.type] || Activity;
              const severityStyle = SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.info;
              
              return (
                <div 
                  key={event.id} 
                  className={`p-3 hover:bg-white/5 transition-colors cursor-pointer group ${
                    event.category === 'error' ? 'bg-red-950/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${severityStyle} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {event.message}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs shrink-0 ${
                            event.category === 'success' ? 'border-green-500/50 text-green-400' :
                            event.category === 'error' ? 'border-red-500/50 text-red-400' :
                            'border-blue-500/50 text-blue-400'
                          }`}
                        >
                          {event.type.toUpperCase()}
                        </Badge>
                      </div>
                      {event.details && (
                        <p className="text-xs text-white/50 mt-1 truncate">
                          {typeof event.details === 'object' 
                            ? JSON.stringify(event.details).slice(0, 80) + '...'
                            : event.details
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40">{getTimeAgo(event.timestamp)}</span>
                      <ArrowRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}