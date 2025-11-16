import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Shield, CheckCircle2 } from "lucide-react";

export default function HeroContent() {
  const stats = [
    { value: "99.97%", label: "Threat Detection" },
    { value: "24/7", label: "AI Monitoring" },
    { value: "AES-256", label: "Encryption" },
    { value: "<1ms", label: "Response Time" }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-blue-600 to-blue-800 py-16">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            Post-Quantum Ready (Hybrid)
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-2xl">Complete Security Ecosystem</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
            Integrated tools designed for enterprise-level protection
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-8 text-sm text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">AES-256</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">PQC Key Exchange</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to={createPageUrl("Consultation")}>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90 px-8 py-6 shadow-2xl font-semibold">
                Book Free Consultation
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("SecurityTools")}>
              <Button size="lg" variant="outline" className="border-2 border-white/50 bg-white/10 text-white hover:bg-white/20 px-8 py-6">
                Explore Security Ecosystem
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}