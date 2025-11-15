import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, AlertTriangle } from "lucide-react";

export default function SavedMaps() {
  const { data: maps = [], isLoading } = useQuery({
    queryKey: ['maps'],
    queryFn: () => base44.entities.HotzoneMap.list('-created_date', 20)
  });

  const getThreatColor = (level) => {
    switch(level) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            Saved Security Maps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading maps...</div>
          ) : maps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No saved maps yet</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maps.map((map, idx) => (
                <Card key={idx} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={map.image_url} 
                      alt={map.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getThreatColor(map.threat_level)}>
                        {map.threat_level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">{map.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {map.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{map.hotspots?.length || 0} hotspots</span>
                      <span>{new Date(map.created_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}