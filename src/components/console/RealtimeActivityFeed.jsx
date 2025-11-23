import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, CheckCircle, Info, Clock } from "lucide-react";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";

export default function RealtimeActivityFeed({ maxItems = 10 }) {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadActivities();
    
    if (isLive) {
      const interval = setInterval(loadActivities, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const loadActivities = async () => {
    try {
      const data = await glyphLockAPI.logs.listRecent(maxItems);
      const newActivities = (data.logs || []).map(log => ({
        id: log.id,
        type: getActivityType(log),
        message: log.description,
        timestamp: new Date(log.created_date),
        actor: log.actor_email,
        resource: log.resource_id
      }));
      
      setActivities(prev => {
        const combined = [...newActivities, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique.slice(0, maxItems);
      });
    } catch (error) {
      console.error("Failed to load activities:", error);
    }
  };

  const getActivityType = (log) => {
    if (log.status === 'failure') return 'error';
    if (log.event_type.includes('ROTATION') || log.event_type.includes('SUCCESS')) return 'success';
    if (log.event_type.includes('WARNING')) return 'warning';
    return 'info';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-[#00E4FF]" />;
    }
  };

  const getRelativeTime = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className="bg-[#0A0F24]/80 border-[#00E4FF]/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00E4FF]" />
            Activity Feed
          </CardTitle>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={scrollRef} className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00E4FF]/20">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#00E4FF]/5 border border-[#00E4FF]/10 hover:border-[#00E4FF]/30 transition-all group"
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 group-hover:text-white transition-colors">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                    <span>{activity.actor}</span>
                    <span>•</span>
                    <span>{getRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}