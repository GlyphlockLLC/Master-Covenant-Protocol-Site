import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Key, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import glyphLockAPI from '@/components/api/glyphLockAPI';

const USAGE_METRICS = [
  { key: 'apiCalls', label: 'API Calls', icon: Activity, color: 'text-cyan-400', limit: 10000 },
  { key: 'edgeCalls', label: 'Edge Function Calls', icon: Zap, color: 'text-purple-400', limit: 5000 },
  { key: 'keyUsage', label: 'Active API Keys', icon: Key, color: 'text-yellow-400', limit: 50 },
  { key: 'sdkDownloads', label: 'SDK Downloads', icon: Download, color: 'text-green-400', limit: 100 }
];

export default function UsagePanel() {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const data = await glyphLockAPI.usage.get();
      setUsageData(data);
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
      toast.error('Failed to load usage metrics');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (current, limit) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-400 bg-red-400/20';
    if (percentage >= 75) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-green-400 bg-green-400/20';
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Usage Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-white/5" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!usageData) {
    return (
      <Card className="glass-card border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            Usage Data Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Unable to load usage metrics at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          Usage Metrics
          <span className="text-sm text-white/50 font-normal ml-auto">Last 30 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {USAGE_METRICS.map((metric) => {
          const Icon = metric.icon;
          const current = usageData[metric.key] || 0;
          const percentage = calculatePercentage(current, metric.limit);
          const statusColor = getUsageColor(percentage);

          return (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-white/80 font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{current.toLocaleString()}</span>
                  <span className="text-white/50 text-sm">/ {metric.limit.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${metric.color.replace('text', 'bg')}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}