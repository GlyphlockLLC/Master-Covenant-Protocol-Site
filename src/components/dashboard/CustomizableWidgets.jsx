import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, GripVertical, Eye, EyeOff, 
  Activity, Shield, Zap, QrCode, Lock,
  BarChart3, AlertTriangle, Clock, X
} from "lucide-react";

const AVAILABLE_WIDGETS = [
  { id: 'live_feed', label: 'Live Security Feed', icon: Activity, default: true },
  { id: 'kpis', label: 'Security KPIs', icon: BarChart3, default: true },
  { id: 'threats', label: 'Threat Summary', icon: AlertTriangle, default: true },
  { id: 'chain_status', label: 'Chain Status', icon: Zap, default: true },
  { id: 'qr_activity', label: 'QR Activity', icon: QrCode, default: false },
  { id: 'covenant_status', label: 'Covenant Status', icon: Shield, default: false },
  { id: 'api_health', label: 'API Health', icon: Lock, default: false },
  { id: 'audit_timeline', label: 'Audit Timeline', icon: Clock, default: false }
];

const STORAGE_KEY = 'glyphlock_dashboard_widgets';

export default function CustomizableWidgets({ onWidgetsChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [widgets, setWidgets] = useState([]);

  // Load saved widget configuration
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch {
        setWidgets(AVAILABLE_WIDGETS.filter(w => w.default).map(w => w.id));
      }
    } else {
      setWidgets(AVAILABLE_WIDGETS.filter(w => w.default).map(w => w.id));
    }
  }, []);

  // Save and notify parent on change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
      onWidgetsChange?.(widgets);
    }
  }, [widgets, onWidgetsChange]);

  const toggleWidget = (widgetId) => {
    setWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const resetToDefault = () => {
    const defaults = AVAILABLE_WIDGETS.filter(w => w.default).map(w => w.id);
    setWidgets(defaults);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6]/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
      >
        <Settings className="w-4 h-4 mr-2" />
        Customize Dashboard
      </Button>
    );
  }

  return (
    <Card className="fixed top-20 right-4 z-50 w-80 bg-slate-900/95 border-2 border-[#3B82F6]/50 shadow-[0_0_40px_rgba(59,130,246,0.3)] backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#3B82F6]/30">
        <CardTitle className="text-white flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#3B82F6]" />
            Dashboard Widgets
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
        {AVAILABLE_WIDGETS.map((widget) => {
          const Icon = widget.icon;
          const isActive = widgets.includes(widget.id);
          
          return (
            <div 
              key={widget.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50' 
                  : 'bg-slate-800/50 border-slate-700/50 opacity-60'
              }`}
              onClick={() => toggleWidget(widget.id)}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-white/30 cursor-grab" />
                <div className={`p-1.5 rounded ${isActive ? 'bg-[#3B82F6]/20' : 'bg-slate-700/50'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#3B82F6]' : 'text-white/50'}`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                  {widget.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {widget.default && (
                  <Badge variant="outline" className="text-xs border-[#3B82F6]/30 text-[#3B82F6]/70">
                    Default
                  </Badge>
                )}
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleWidget(widget.id)}
                  className="data-[state=checked]:bg-[#3B82F6]"
                />
              </div>
            </div>
          );
        })}

        <div className="pt-3 border-t border-slate-700/50 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="text-white/60 hover:text-white text-xs"
          >
            Reset to Default
          </Button>
          <Badge variant="outline" className="border-[#3B82F6]/30 text-[#3B82F6]">
            {widgets.length} Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Export the widget IDs for parent component use
export { AVAILABLE_WIDGETS };