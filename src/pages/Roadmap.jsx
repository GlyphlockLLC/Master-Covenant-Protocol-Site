import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, Rocket, Brain, CheckCircle2 } from "lucide-react";

export default function Roadmap() {
  const aiDreamTeam = [
    {
      name: "Alfred",
      role: "Contract Architect",
      status: "Bound",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
      specialty: "Legal Framework Design"
    },
    {
      name: "Claude",
      role: "Security Engineer",
      status: "Bound",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop",
      specialty: "Code & Audit Systems"
    },
    {
      name: "GitHub Copilot",
      role: "Development Assistant",
      status: "Bound",
      image: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&h=400&fit=crop",
      specialty: "Automated Code Generation"
    },
    {
      name: "Perplexity",
      role: "Research Analyst",
      status: "Bound",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",
      specialty: "Threat Intelligence"
    },
    {
      name: "OpenAI GPT",
      role: "Integration Specialist",
      status: "Bound",
      image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=400&fit=crop",
      specialty: "Natural Language Processing"
    }
  ];

  const milestones = [
    {
      quarter: "Q1 2025",
      status: "completed",
      icon: CheckCircle,
      color: "text-green-400",
      items: [
        "Master Covenant System launched",
        "5 AI systems legally bound with cryptographic proof",
        "$340K revenue generated in 90 days",
        "D&B business verification completed",
        "$14M liability insurance secured"
      ]
    },
    {
      quarter: "Q2 2025",
      status: "in-progress",
      icon: Clock,
      color: "text-blue-400",
      items: [
        "N.U.P.S. POS enterprise rollout",
        "Advanced threat detection AI training",
        "Quantum-resistant encryption beta",
        "SOC 2 Type II compliance certification",
        "Fortune 500 pilot programs"
      ]
    },
    {
      quarter: "Q3 2025",
      status: "planned",
      icon: Target,
      color: "text-purple-400",
      items: [
        "API marketplace launch",
        "White-label partnership program",
        "Blockchain audit trail integration",
        "Real-time threat intelligence network",
        "Multi-region data sovereignty"
      ]
    },
    {
      quarter: "Q4 2025",
      status: "planned",
      icon: Rocket,
      color: "text-cyan-400",
      items: [
        "Series A funding round",
        "Global expansion - EU & APAC",
        "Zero-trust architecture deployment",
        "AI contract binding v2.0",
        "Industry certifications (ISO 27001, HIPAA)"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Product <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Roadmap</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our journey to revolutionize cybersecurity with legally bound AI systems
            </p>
          </div>

          {/* AI Dream Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                The AI <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dream Team</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                5 AI systems legally bound through our revolutionary Master Covenant System
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6 mb-8">
              {aiDreamTeam.map((ai, index) => (
                <Card key={index} className="glass-card-dark border-blue-500/30 hover:border-blue-500/50 transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <img 
                        src={ai.image}
                        alt={ai.name}
                        className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-blue-500/30 group-hover:border-blue-500 transition-all"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {ai.status}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-white">{ai.name}</h3>
                    <p className="text-sm text-blue-400 mb-2">{ai.role}</p>
                    <p className="text-xs text-gray-500">{ai.specialty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <Card key={index} className={`glass-card-dark border-${milestone.color.split('-')[1]}-500/30`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-white">
                        <Icon className={`w-6 h-6 ${milestone.color}`} />
                        {milestone.quarter}
                      </CardTitle>
                      <Badge 
                        className={
                          milestone.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : milestone.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }
                      >
                        {milestone.status === 'completed' ? 'Completed' : milestone.status === 'in-progress' ? 'In Progress' : 'Planned'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {milestone.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 mt-0.5 ${milestone.color} flex-shrink-0`} />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Vision Statement */}
          <Card className="glass-card-dark border-blue-500/30 mt-12">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Brain className="w-6 h-6 text-blue-400" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg leading-relaxed">
                GlyphLock is pioneering the future of cybersecurity by creating the world's first legally binding AI contract framework. 
                Our Master Covenant System ensures AI accountability with cryptographic proof and $14M liability coverage, 
                addressing the $283 billion annual IP theft crisis with quantum-resistant encryption and 99.97% threat detection accuracy.
              </p>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-1">$340K</div>
                  <div className="text-sm text-gray-400">Revenue in 90 Days</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">5 AI</div>
                  <div className="text-sm text-gray-400">Systems Bound</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">$14M</div>
                  <div className="text-sm text-gray-400">Liability Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}