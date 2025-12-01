import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

const PROVIDERS = [
  { id: 'anthropic', label: 'Anthropic', color: '#D97706' },
  { id: 'openai', label: 'OpenAI', color: '#10B981' },
  { id: 'gemini', label: 'Gemini', color: '#3B82F6' },
  { id: 'openrouter', label: 'OpenRouter', color: '#8B5CF6' }
];

export default function ChainStatusWidget() {
  const { data: chainLogs } = useQuery({
    queryKey: ['chainStatus'],
    queryFn: async () => {
      const logs = await base44.entities.SystemAuditLog.filter(
        { event_type: { $in: ['chain_completed', 'chain_failed'] } },
        '-created_date',
        20
      );
      return logs;
    },
    refetchInterval: 10000
  });

  // Calculate stats per provider
  const providerStats = PROVIDERS.map(provider => {
    const providerLogs = chainLogs?.filter(l => 
      l.details?.provider?.toLowerCase() === provider.id.toLowerCase()
    ) || [];
    const successes = providerLogs.filter(l => l.event_type === 'chain_completed').length;
    const failures = providerLogs.filter(l => l.event_type === 'chain_failed').length;
    const total = successes + failures;
    const successRate = total > 0 ? Math.round((successes / total) * 100) : 100;
    const avgLatency = providerLogs.length > 0
      ? Math.round(providerLogs.reduce((acc, l) => acc + (l.details?.latency_ms || 0), 0) / providerLogs.length)
      : 0;

    return {
      ...provider,
      successes,
      failures,
      total,
      successRate,
      avgLatency,
      status: total === 0 ? 'idle' : successRate >= 90 ? 'healthy' : successRate >= 70 ? 'degraded' : 'failed'
    };
  });

  const totalCalls = chainLogs?.length || 0;
  const totalSuccesses = chainLogs?.filter(l => l.event_type === 'chain_completed').length || 0;
  const overallSuccessRate = totalCalls > 0 ? Math.round((totalSuccesses / totalCalls) * 100) : 100;

  return (
    <Card className="bg-slate-900/80 border-2 border-[#3B82F6]/40 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
      <CardHeader className="pb-3 border-b border-[#3B82F6]/30">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
            Provider Chain Status
          </span>
          <Badge 
            variant="outline" 
            className={`${
              overallSuccessRate >= 90 ? 'border-green-500/50 text-green-400' :
              overallSuccessRate >= 70 ? 'border-yellow-500/50 text-yellow-400' :
              'border-red-500/50 text-red-400'
            }`}
          >
            {overallSuccessRate}% Success
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Provider Chain Visualization */}
        <div className="flex items-center justify-between mb-4 px-2">
          {providerStats.map((provider, idx) => (
            <React.Fragment key={provider.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    provider.status === 'healthy' ? 'border-green-500 bg-green-500/20' :
                    provider.status === 'degraded' ? 'border-yellow-500 bg-yellow-500/20' :
                    provider.status === 'failed' ? 'border-red-500 bg-red-500/20' :
                    'border-slate-600 bg-slate-700/50'
                  }`}
                  style={{ boxShadow: `0 0 10px ${provider.color}40` }}
                >
                  {provider.status === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : provider.status === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-400" />
                  ) : provider.status === 'degraded' ? (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                  )}
                </div>
                <span className="text-xs text-white/60 mt-1 font-medium">{provider.label}</span>
              </div>
              {idx < providerStats.length - 1 && (
                <ArrowRight className="w-4 h-4 text-[#3B82F6]/50" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Provider Stats */}
        <div className="space-y-2">
          {providerStats.map((provider) => (
            <div 
              key={provider.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: provider.color }}
                />
                <span className="text-sm text-white/80">{provider.label}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-green-400">{provider.successes} ✓</span>
                <span className="text-red-400">{provider.failures} ✗</span>
                {provider.avgLatency > 0 && (
                  <span className="text-white/40">{provider.avgLatency}ms</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between text-xs text-white/50">
          <span>Total Calls: {totalCalls}</span>
          <span>Last 20 events</span>
        </div>
      </CardContent>
    </Card>
  );
}