import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Globe, Rocket, CheckCircle, Clock, Calendar } from "lucide-react";

export default function Roadmap() {
  const goals = [
    {
      icon: Target,
      title: "Market Leadership",
      subtitle: "Become the industry standard for AI-contract binding technology",
      metric: "$10T+ market opportunity in IP protection"
    },
    {
      icon: Rocket,
      title: "Technology Innovation",
      subtitle: "Pioneer quantum-resistant security solutions for enterprise AI",
      metric: "5+ patents filed in steganographic security"
    },
    {
      icon: Globe,
      title: "Enterprise Adoption",
      subtitle: "Deploy Master Covenant across Fortune 500 companies",
      metric: "1000+ enterprise deployments by 2026"
    }
  ];

  const milestones = [
    {
      quarter: "Q2 2025",
      period: "May - June",
      status: "completed",
      items: [
        { title: "Company Founded", desc: "GlyphLock Security LLC established in May 2025, El Mirage, Arizona" },
        { title: "Master Covenant System Launch", desc: "First ever AI-contract binding with 5 major AI systems" },
        { title: "D&B Revenue Verification", desc: "$340K verified revenue in first 90 days" },
        { title: "$14M Liability Coverage", desc: "Enterprise-grade insurance coverage secured" },
        { title: "N.U.P.S. Platform Beta", desc: "Three-tier POS portal management system" }
      ]
    },
    {
      quarter: "Q3 2025",
      period: "July - September",
      status: "progress",
      items: [
        { title: "Quantum-Resistant Encryption", desc: "Post-quantum cryptography implementation across all systems" },
        { title: "DeepSeek AI Escalation Response", desc: "Strategic response to August 2025 DeepSeek AI market disruption" },
        { title: "Blockchain Timestamping", desc: "Immutable audit trail with cryptographic proof" },
        { title: "Steganography Tools", desc: "LSB encryption/decryption for secure data embedding" },
        { title: "Interactive Mapping Platform", desc: "Advanced hotzone visualization and analytics" }
      ]
    },
    {
      quarter: "Q4 2025",
      period: "October - December",
      status: "planned",
      items: [
        { title: "Enterprise API Launch", desc: "Developer access to Master Covenant integration" },
        { title: "Mobile Applications", desc: "iOS and Android apps for security management" },
        { title: "AI Compliance Monitoring", desc: "Automated contract enforcement with real-time alerts" },
        { title: "Global Expansion", desc: "GDPR and international compliance frameworks" }
      ]
    },
    {
      quarter: "Q1 2026",
      period: "January - March",
      status: "planned",
      items: [
        { title: "Smart Contract Marketplace", desc: "Platform for buying/selling verified AI contracts" },
        { title: "Decentralized Verification", desc: "Blockchain-based covenant validation network" },
        { title: "Advanced Analytics Dashboard", desc: "Real-time threat detection and compliance reporting" },
        { title: "Partner Ecosystem Program", desc: "Integration framework for security providers" }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      completed: { label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/50" },
      progress: { label: "In Progress", color: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
      planned: { label: "Planned", color: "bg-gray-500/20 text-gray-400 border-gray-500/50" }
    };
    return config[status];
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 mb-6 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Product Roadmap
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Building the Future of <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">AI Security</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our strategic vision for revolutionizing cybersecurity through AI-contract integration, quantum-resistant encryption, and blockchain verification.
            </p>
          </div>

          {/* Strategic Goals */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-4 text-white">Strategic Goals</h2>
            <p className="text-gray-400 mb-8">Ambitious objectives driving our product development and market expansion</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <Card key={index} className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30 hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <goal.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{goal.subtitle}</p>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                      {goal.metric}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Development Milestones */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-4 text-white">Development Milestones</h2>
            <p className="text-gray-400 mb-8">Detailed quarterly roadmap with completed achievements and upcoming features</p>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const statusBadge = getStatusBadge(milestone.status);
                return (
                  <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <CardTitle className="text-white text-2xl mb-2">{milestone.quarter}</CardTitle>
                          <p className="text-gray-400">{milestone.period}</p>
                        </div>
                        <Badge variant="outline" className={statusBadge.color}>
                          {milestone.status === "completed" && <CheckCircle className="w-4 h-4 mr-2" />}
                          {milestone.status === "progress" && <Clock className="w-4 h-4 mr-2 animate-spin" />}
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {milestone.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            {milestone.status === "completed" ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : milestone.status === "progress" ? (
                              <Clock className="w-5 h-5 text-blue-400" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Vision 2026 */}
          <section className="mb-20">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-blue-500/30">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Our Vision for 2026 and Beyond</h2>
                  </div>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    GlyphLock will become the universal standard for AI accountability, creating a world where automation is answerable to written law. Our Master Covenant System will protect the $10 trillion intellectual property market, binding every AI system to legal contracts with cryptographic proof and quantum-resistant security.
                  </p>
                  <p>
                    Through continuous innovation in steganographic technology, blockchain verification, and enterprise-grade security solutions, we're building the infrastructure that makes trust scalable, proof permanent, and accountability enforceable in the age of artificial intelligence.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Join Us on This Journey</h3>
            <p className="text-gray-400 mb-8">Be part of the revolution in AI security and accountability</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}