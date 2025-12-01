import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, AlertOctagon, Shield, ArrowRight, 
  Clock, ExternalLink, CheckCircle, XCircle
} from "lucide-react";

const SEVERITY_CONFIG = {
  critical: { color: 'red', icon: AlertOctagon, priority: 1 },
  high: { color: 'orange', icon: AlertTriangle, priority: 2 },
  medium: { color: 'yellow', icon: AlertTriangle, priority: 3 },
  low: { color: 'blue', icon: Shield, priority: 4 }
};

export default function ThreatSummaryPanel() {
  const { data: threats, isLoading } = useQuery({
    queryKey: ['recentThreats'],
    queryFn: () => base44.entities.QRThreatLog.list('-created_date', 10),
    refetchInterval: 10000
  });

  const activeThreats = threats?.filter(t => !t.resolved) || [];
  const resolvedThreats = threats?.filter(t => t.resolved) || [];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getSeverityStyle = (severity) => {
    const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
    return {
      badge: `bg-${config.color}-500/20 border-${config.color}-500/50 text-${config.color}-400`,
      icon: config.icon
    };
  };

  return (
    <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
      <CardHeader className="pb-3 border-b border-[#3B82F6]/30">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
            Threat Summary
          </span>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${activeThreats.length > 0 ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'}`}
            >
              {activeThreats.length} Active
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{activeThreats.length}</div>
            <div className="text-xs text-red-400/70 uppercase">Active</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{resolvedThreats.length}</div>
            <div className="text-xs text-green-400/70 uppercase">Resolved</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{threats?.length || 0}</div>
            <div className="text-xs text-blue-400/70 uppercase">Total</div>
          </div>
        </div>

        {/* Recent Threats List */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="text-center py-8 text-white/50">Loading threats...</div>
          ) : threats?.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-10 h-10 mx-auto mb-2 text-green-400 opacity-50" />
              <p className="text-green-400/70 text-sm">No threats detected</p>
            </div>
          ) : (
            threats.slice(0, 5).map((threat) => {
              const severity = SEVERITY_CONFIG[threat.severity] || SEVERITY_CONFIG.medium;
              const SeverityIcon = severity.icon;
              
              return (
                <div 
                  key={threat.id}
                  className={`p-3 rounded-lg border transition-all hover:bg-white/5 cursor-pointer ${
                    threat.resolved 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-red-950/20 border-red-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded ${
                        threat.resolved ? 'bg-green-500/20' : `bg-${severity.color}-500/20`
                      }`}>
                        {threat.resolved ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <SeverityIcon className={`w-4 h-4 text-${severity.color}-400`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {threat.attack_type}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              threat.resolved 
                                ? 'border-green-500/50 text-green-400' 
                                : `border-${severity.color}-500/50 text-${severity.color}-400`
                            }`}
                          >
                            {threat.resolved ? 'RESOLVED' : threat.severity?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/50 mt-1 line-clamp-1">
                          {threat.threat_description || threat.payload?.slice(0, 60)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/40 shrink-0">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(threat.created_date)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All Link */}
        {threats?.length > 0 && (
          <Link to={createPageUrl("SecurityOperationsCenter")}>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-[#3B82F6] hover:bg-[#3B82F6]/10 border border-[#3B82F6]/30"
            >
              View All Threats
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}