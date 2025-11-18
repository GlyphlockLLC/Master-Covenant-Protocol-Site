import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HeroContent() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <Badge className="mb-6 bg-blue-500/20 border-blue-500/50 text-blue-400 px-6 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Post-Quantum Ready
        </Badge>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Enterprise-Grade <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Cybersecurity</span>
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
          Military-grade encryption, AI-powered threat detection, and quantum-resistant security protocols designed for the next generation of digital warfare.
        </p>
        
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="glass-card-dark border-blue-500/30 px-6 py-3 rounded-xl">
            <Lock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-white">AES-256</div>
          </div>
          <div className="glass-card-dark border-blue-500/30 px-6 py-3 rounded-xl">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-white">PQC Key Exchange</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Consultation")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8">
              Book Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to={createPageUrl("SecurityTools")}>
            <Button size="lg" variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/20 text-lg px-8">
              Explore Security Ecosystem
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Threats Detected", value: "500K+", icon: Shield },
          { label: "AI Monitoring", value: "24/7", icon: Lock },
          { label: "Encryption", value: "AES-256", icon: Lock },
          { label: "Response Time", value: "<1ms", icon: Shield }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card-dark border-blue-500/30 p-6 rounded-xl text-center">
              <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}