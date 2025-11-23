import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Zap, Shield, Clock } from "lucide-react";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    requestsToday: 0,
    requestsWeek: 0,
    requestsTrend: 0,
    avgResponseTime: "0ms",
    errorRate: "0%",
    securityScore: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await glyphLockAPI.usage.getDetailedMetrics();
      setMetrics({
        requestsToday: data.requests?.today || 0,
        requestsWeek: data.requests?.week || 0,
        requestsTrend: data.requests?.trend || 0,
        avgResponseTime: data.performance?.avgResponseTime || "0ms",
        errorRate: data.errors?.rate || "0%",
        securityScore: data.security?.score || 100
      });
    } catch (error) {
      console.error("Failed to load metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: "Requests Today",
      value: metrics.requestsToday.toLocaleString(),
      trend: metrics.requestsTrend,
      icon: Activity,
      color: "#00E4FF"
    },
    {
      title: "Weekly Traffic",
      value: metrics.requestsWeek.toLocaleString(),
      icon: TrendingUp,
      color: "#8C4BFF"
    },
    {
      title: "Avg Response",
      value: metrics.avgResponseTime,
      icon: Clock,
      color: "#9F00FF"
    },
    {
      title: "Error Rate",
      value: metrics.errorRate,
      icon: Shield,
      color: parseFloat(metrics.errorRate) > 1 ? "#FF4444" : "#00FF88"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#0A0F24]/80 border-[#00E4FF]/20 backdrop-blur-xl animate-pulse">
            <CardContent className="p-6 h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, idx) => {
        const Icon = metric.icon;
        const hasTrend = metric.trend !== undefined;
        
        return (
          <Card 
            key={idx} 
            className="bg-[#0A0F24]/80 border-[#00E4FF]/20 hover:border-[#00E4FF]/50 transition-all backdrop-blur-xl group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: metric.color }} />
                <div 
                  className="w-12 h-12 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" 
                  style={{ background: `linear-gradient(135deg, ${metric.color}, ${metric.color}40)` }} 
                />
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                  <p className="text-sm text-white/60">{metric.title}</p>
                </div>
                
                {hasTrend && (
                  <div className={`flex items-center gap-1 text-xs font-semibold ${
                    metric.trend > 0 ? 'text-green-400' : metric.trend < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : metric.trend < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                    {metric.trend !== 0 && `${Math.abs(metric.trend)}%`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}