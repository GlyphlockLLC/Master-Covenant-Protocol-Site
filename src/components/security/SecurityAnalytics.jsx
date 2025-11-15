import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Shield, AlertTriangle } from "lucide-react";

export default function SecurityAnalytics() {
  const { data: threats = [] } = useQuery({
    queryKey: ['threats'],
    queryFn: () => base44.entities.HotzoneThreat.list('-created_date', 100)
  });

  const totalThreats = threats.length;
  const criticalThreats = threats.filter(t => t.severity === "critical").length;
  const resolvedThreats = threats.filter(t => t.status === "resolved").length;
  const activeThreats = threats.filter(t => t.status === "detected" || t.status === "investigating").length;

  const resolutionRate = totalThreats > 0 ? Math.round((resolvedThreats / totalThreats) * 100) : 0;

  const threatsByType = threats.reduce((acc, threat) => {
    acc[threat.threat_type] = (acc[threat.threat_type] || 0) + 1;
    return acc;
  }, {});

  const threatsBySeverity = {
    critical: threats.filter(t => t.severity === "critical").length,
    high: threats.filter(t => t.severity === "high").length,
    medium: threats.filter(t => t.severity === "medium").length,
    low: threats.filter(t => t.severity === "low").length
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{totalThreats}</div>
            <div className="text-sm text-gray-400">Total Threats</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-700/10 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{criticalThreats}</div>
            <div className="text-sm text-gray-400">Critical</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{activeThreats}</div>
            <div className="text-sm text-gray-400">Active</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-700/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{resolutionRate}%</div>
            <div className="text-sm text-gray-400">Resolution Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Threats by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(threatsByType).map(([type, count], idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(count / totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold text-sm w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Threats by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(threatsBySeverity).map(([severity, count], idx) => {
                const colors = {
                  critical: "bg-red-500",
                  high: "bg-orange-500",
                  medium: "bg-yellow-500",
                  low: "bg-blue-500"
                };
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm capitalize">{severity}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[severity]}`}
                          style={{ width: `${(count / totalThreats) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold text-sm w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}