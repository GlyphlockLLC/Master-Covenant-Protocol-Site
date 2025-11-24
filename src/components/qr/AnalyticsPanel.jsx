import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, AlertCircle, MapPin, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsPanel({ qrAssetId }) {
  const { data: scanEvents = [], isLoading } = useQuery({
    queryKey: ['qrScanEvents', qrAssetId],
    queryFn: async () => {
      if (!qrAssetId) return [];
      return await base44.entities.QrScanEvent.filter({ qrAssetId }, '-scannedAt', 500);
    },
    enabled: !!qrAssetId
  });

  const metrics = useMemo(() => {
    const totalScans = scanEvents.length;
    const tamperCount = scanEvents.filter(e => e.tamperSuspected).length;
    const avgRisk = totalScans > 0
      ? scanEvents.reduce((sum, e) => sum + (e.riskScoreAtScan || 0), 0) / totalScans
      : 0;

    return { totalScans, tamperCount, avgRisk: avgRisk.toFixed(1) };
  }, [scanEvents]);

  const scansOverTime = useMemo(() => {
    const buckets = {};
    scanEvents.forEach(event => {
      const date = new Date(event.scannedAt).toLocaleDateString();
      buckets[date] = (buckets[date] || 0) + 1;
    });
    return Object.entries(buckets)
      .map(([date, count]) => ({ date, scans: count }))
      .slice(-14); // Last 14 days
  }, [scanEvents]);

  const riskDistribution = useMemo(() => {
    const buckets = { safe: 0, low: 0, medium: 0, high: 0, critical: 0 };
    scanEvents.forEach(event => {
      const score = event.riskScoreAtScan || 0;
      if (score >= 70) buckets.critical++;
      else if (score >= 50) buckets.high++;
      else if (score >= 30) buckets.medium++;
      else if (score >= 10) buckets.low++;
      else buckets.safe++;
    });
    return Object.entries(buckets).map(([level, count]) => ({ level, count }));
  }, [scanEvents]);

  const handleExportCSV = () => {
    const headers = ['Scanned At', 'Geo', 'Device', 'Resolved URL', 'Risk Score', 'Tamper Suspected', 'Tamper Reason'];
    const rows = scanEvents.map(e => [
      e.scannedAt,
      e.geoApprox || 'unknown',
      e.deviceHint || 'unknown',
      e.resolvedUrl || '',
      e.riskScoreAtScan || 0,
      e.tamperSuspected ? 'Yes' : 'No',
      e.tamperReason || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-analytics-${qrAssetId}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 p-12 text-center">
        <p className="text-gray-400">Loading analytics...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Scans</p>
                <p className="text-3xl font-bold text-white">{metrics.totalScans}</p>
              </div>
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tamper Events</p>
                <p className="text-3xl font-bold text-red-400">{metrics.tamperCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Risk Score</p>
                <p className="text-3xl font-bold text-yellow-400">{metrics.avgRisk}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scansOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Line type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="level" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Scan Events</CardTitle>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2 min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-400 font-semibold">Time</th>
                  <th className="text-left p-3 text-gray-400 font-semibold">Location</th>
                  <th className="text-left p-3 text-gray-400 font-semibold">Device</th>
                  <th className="text-left p-3 text-gray-400 font-semibold">Risk</th>
                  <th className="text-left p-3 text-gray-400 font-semibold">Tamper</th>
                </tr>
              </thead>
              <tbody>
                {scanEvents.slice(0, 20).map((event, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="p-3 text-gray-300">
                      {new Date(event.scannedAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.geoApprox || 'Unknown'}
                      </div>
                    </td>
                    <td className="p-3 text-gray-400 text-xs truncate max-w-[150px]">
                      {event.deviceHint || 'Unknown'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        (event.riskScoreAtScan || 0) >= 50
                          ? 'bg-red-500/20 text-red-400'
                          : (event.riskScoreAtScan || 0) >= 30
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {event.riskScoreAtScan || 0}
                      </span>
                    </td>
                    <td className="p-3">
                      {event.tamperSuspected ? (
                        <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}