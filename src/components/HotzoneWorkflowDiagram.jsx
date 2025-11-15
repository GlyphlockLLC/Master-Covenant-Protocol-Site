import React from 'react';
import { Upload, MapPin, Shield, Download, ArrowRight } from 'lucide-react';

export default function HotzoneWorkflowDiagram() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Image",
      description: "Upload network diagrams, floor plans, or infrastructure maps",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Mark Hotspots",
      description: "Click to place security markers on vulnerable areas",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Assess Severity",
      description: "Classify each hotspot by threat level: Low, Medium, High, Critical",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Download visual maps or JSON data for security reports",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="glass-royal rounded-2xl p-8 mb-12">
      <h3 className="text-2xl font-bold text-white text-center mb-8">
        How Hotzone Mapping Works
      </h3>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 glow-royal`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-white/80 leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 z-10">
                  <ArrowRight className="w-6 h-6 text-blue-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-blue-500/30">
        <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">Real-Time</div>
            <div className="text-white/70">Interactive mapping as you click</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">Visual</div>
            <div className="text-white/70">Color-coded threat levels</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">Exportable</div>
            <div className="text-white/70">Share maps with your team</div>
          </div>
        </div>
      </div>
    </div>
  );
}