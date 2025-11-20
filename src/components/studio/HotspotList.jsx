import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";

export default function HotspotList({ hotspots, selectedHotspot, onSelect, onDelete }) {
  if (hotspots.length === 0) {
    return null;
  }

  return (
    <Card className="glass-royal border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white">Hotspots ({hotspots.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              onClick={() => onSelect(hotspot)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedHotspot?.id === hotspot.id
                  ? 'border-blue-400 bg-blue-500/20'
                  : 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{hotspot.label}</h4>
                  {hotspot.description && (
                    <p className="text-sm text-white/70 mt-1">{hotspot.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      {hotspot.actionType}
                    </span>
                    {hotspot.actionType === 'link' && hotspot.actionValue && (
                      <a
                        href={hotspot.actionValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(hotspot.id);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}