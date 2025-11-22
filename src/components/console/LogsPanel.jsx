import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, CheckCircle, Info, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";

export default function LogsPanel({ user }) {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    try {
      const data = await glyphLockAPI.getLogs(filter);
      setLogs(data.logs || mockLogs);
    } catch (err) {
      setLogs(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const mockLogs = [
    { id: 1, type: "success", message: "API key rotation completed successfully", timestamp: new Date(Date.now() - 120000), function: "rotateAPIKey" },
    { id: 2, type: "info", message: "New edge function deployed", timestamp: new Date(Date.now() - 3600000), function: "deployFunction" },
    { id: 3, type: "error", message: "Rate limit exceeded for user request", timestamp: new Date(Date.now() - 7200000), function: "healthCheck" },
    { id: 4, type: "success", message: "User authentication successful", timestamp: new Date(Date.now() - 10800000), function: "auth" },
    { id: 5, type: "warning", message: "High memory usage detected", timestamp: new Date(Date.now() - 14400000), function: "monitor" },
    { id: 6, type: "info", message: "Database backup completed", timestamp: new Date(Date.now() - 18000000), function: "backup" },
    { id: 7, type: "success", message: "New API key generated", timestamp: new Date(Date.now() - 21600000), function: "generateAPIKey" }
  ];

  const getLogIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredLogs = filter === "all" ? logs : logs.filter(log => log.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-white/70">Monitor real-time system activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-white/70" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-[#0A0F24] border-[#8C4BFF]/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Logs</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#0A0F24] border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Success</p>
                <p className="text-2xl font-bold text-white">{logs.filter(l => l.type === 'success').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Errors</p>
                <p className="text-2xl font-bold text-white">{logs.filter(l => l.type === 'error').length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Warnings</p>
                <p className="text-2xl font-bold text-white">{logs.filter(l => l.type === 'warning').length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Info</p>
                <p className="text-2xl font-bold text-white">{logs.filter(l => l.type === 'info').length}</p>
              </div>
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
        <CardHeader>
          <CardTitle className="text-white">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-white/70">Loading logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-white/70">No logs found</div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-white/50">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-[#8C4BFF]/20 text-[#8C4BFF]">
                        {log.function}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}