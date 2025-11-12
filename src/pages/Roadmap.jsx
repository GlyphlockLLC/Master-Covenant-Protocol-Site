import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Rocket, Target, Zap } from "lucide-react";

export default function Roadmap() {
  const [activeQuarter, setActiveQuarter] = useState("Q1");

  const roadmapData = {
    "Q1": {
      title: "Q1 2025 - Foundation",
      status: "completed",
      features: [
        { name: "Master Covenant System", description: "Legally bind 5 AI systems", status: "completed", impact: "Revolutionary" },
        { name: "Platform Launch", description: "Full cybersecurity suite", status: "completed", impact: "High" },
        { name: "$14M Liability Coverage", description: "Enterprise insurance secured", status: "completed", impact: "Critical" },
        { name: "QR Security Generator", description: "AI-powered threat detection", status: "completed", impact: "High" },
        { name: "Steganography Tools", description: "LSB encoding/decoding", status: "completed", impact: "Medium" },
        { name: "Blockchain Security", description: "SHA-256/512 hashing", status: "completed", impact: "High" },
        { name: "GlyphBot AI", description: "Code execution & security scanning", status: "completed", impact: "High" },
        { name: "N.U.P.S. POS System", description: "AI-powered retail platform", status: "completed", impact: "High" }
      ]
    },
    "Q2": {
      title: "Q2 2025 - Enterprise Expansion",
      status: "in-progress",
      features: [
        { name: "Fortune 500 Partnerships", description: "Enterprise client onboarding", status: "in-progress", impact: "Critical" },
        { name: "API Platform", description: "Developer-first integration", status: "in-progress", impact: "High" },
        { name: "Advanced AI Agents", description: "Custom agent training", status: "planned", impact: "High" },
        { name: "Real-time Threat Detection", description: "24/7 monitoring dashboard", status: "in-progress", impact: "Critical" },
        { name: "Mobile Apps", description: "iOS & Android security tools", status: "planned", impact: "Medium" },
        { name: "White-label Solutions", description: "Branded security platforms", status: "planned", impact: "High" },
        { name: "Compliance Automation", description: "SOC2, ISO 27001, GDPR", status: "in-progress", impact: "Critical" }
      ]
    },
    "Q3": {
      title: "Q3 2025 - AI Innovation",
      status: "planned",
      features: [
        { name: "Quantum Encryption v2", description: "Next-gen cryptography", status: "planned", impact: "Revolutionary" },
        { name: "AI Contract Marketplace", description: "Buy/sell AI services", status: "planned", impact: "High" },
        { name: "Smart Contract Generator", description: "Automated legal templates", status: "planned", impact: "High" },
        { name: "Decentralized Identity", description: "Blockchain-based auth", status: "planned", impact: "Medium" },
        { name: "AI Audit Automation", description: "Continuous compliance", status: "planned", impact: "Critical" },
        { name: "Neural Threat Prediction", description: "Predictive security AI", status: "planned", impact: "Revolutionary" },
        { name: "Multi-chain Support", description: "Ethereum, Solana, Polygon", status: "planned", impact: "Medium" }
      ]
    },
    "Q4": {
      title: "Q4 2025 - Global Scale",
      status: "planned",
      features: [
        { name: "Global SOC Network", description: "24/7 security operations", status: "planned", impact: "Critical" },
        { name: "AI Insurance Platform", description: "Automated liability coverage", status: "planned", impact: "Revolutionary" },
        { name: "Zero-trust Architecture", description: "Enterprise security framework", status: "planned", impact: "Critical" },
        { name: "Threat Intelligence Marketplace", description: "Community-driven security", status: "planned", impact: "High" },
        { name: "Quantum-resistant VPN", description: "Post-quantum networking", status: "planned", impact: "High" },
        { name: "AI Governance Framework", description: "Regulatory compliance tools", status: "planned", impact: "Critical" },
        { name: "100+ AI Systems Bound", description: "Expand Master Covenant", status: "planned", impact: "Revolutionary" }
      ]
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-blue-400" />;
      case "planned": return <Rocket className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const getImpactColor = (impact) => {
    const colors = {
      "Revolutionary": "from-purple-500 to-pink-600",
      "Critical": "from-red-500 to-orange-600",
      "High": "from-blue-500 to-cyan-600",
      "Medium": "from-green-500 to-emerald-600"
    };
    return colors[impact] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-black" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6">
              <Target className="w-4 h-4 mr-2" />
              Product Roadmap 2025
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Building the <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Future</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Our ambitious plan to revolutionize cybersecurity with AI-powered legal frameworks, 
              quantum-resistant encryption, and enterprise-grade protection.
            </p>
          </div>
        </div>
      </section>

      {/* Quarter Selector */}
      <section className="py-12 bg-gray-900 sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(roadmapData).map((quarter) => (
              <Button
                key={quarter}
                onClick={() => setActiveQuarter(quarter)}
                variant={activeQuarter === quarter ? "default" : "outline"}
                className={activeQuarter === quarter 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700" 
                  : "border-gray-700 hover:border-blue-500/50"}
              >
                {quarter} 2025
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Content */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold mb-4 text-white">
                {roadmapData[activeQuarter].title}
              </h2>
              <Badge 
                variant="outline" 
                className={`
                  ${roadmapData[activeQuarter].status === 'completed' ? 'border-green-500/50 bg-green-500/10 text-green-400' : ''}
                  ${roadmapData[activeQuarter].status === 'in-progress' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : ''}
                  ${roadmapData[activeQuarter].status === 'planned' ? 'border-gray-500/50 bg-gray-500/10 text-gray-400' : ''}
                `}
              >
                {roadmapData[activeQuarter].status === 'completed' && <CheckCircle className="w-4 h-4 mr-2" />}
                {roadmapData[activeQuarter].status === 'in-progress' && <Zap className="w-4 h-4 mr-2" />}
                {roadmapData[activeQuarter].status === 'planned' && <Rocket className="w-4 h-4 mr-2" />}
                {roadmapData[activeQuarter].status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {roadmapData[activeQuarter].features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`
                    bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all group
                    ${feature.status === 'completed' ? 'border-green-500/30' : ''}
                  `}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(feature.status)}
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {feature.name}
                        </h3>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`bg-gradient-to-r ${getImpactColor(feature.impact)} bg-clip-text text-transparent border-gray-700`}
                      >
                        {feature.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                    {feature.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Live Now</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Progress <span className="text-blue-400">Metrics</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">8/8</div>
                <div className="text-white font-semibold mb-1">Q1 Features</div>
                <div className="text-sm text-gray-500">100% Complete</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">4/7</div>
                <div className="text-white font-semibold mb-1">Q2 Features</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">7</div>
                <div className="text-white font-semibold mb-1">Q3 Planned</div>
                <div className="text-sm text-gray-500">Coming Soon</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-400 mb-2">7</div>
                <div className="text-white font-semibold mb-1">Q4 Planned</div>
                <div className="text-sm text-gray-500">Future Vision</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Join Our Journey
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Be an early adopter of revolutionary cybersecurity technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}