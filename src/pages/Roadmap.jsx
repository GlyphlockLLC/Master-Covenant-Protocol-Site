import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, Rocket, Zap, Star, TrendingUp, Sparkles, Lock, Shield, Brain, Code, Globe, Award } from "lucide-react";

export default function Roadmap() {
  const [hoveredMilestone, setHoveredMilestone] = useState(null);

  const milestones = [
    {
      date: "May 2025",
      title: "Genesis - Patent Filing",
      status: "completed",
      icon: Star,
      color: "from-purple-600 to-pink-600",
      glowColor: "purple",
      isHighlight: true,
      description: "Filed Patent Application No. 18/584,961 for Master Covenant System",
      achievements: [
        "Revolutionary AI-enforced legal framework conceived",
        "Cryptographic binding protocol developed",
        "CAB (Contractual Auto-Binding) methodology established"
      ],
      easterEgg: "🎯 This is where it all began - the birth of legally binding AI contracts",
      stats: { value: "18/584,961", label: "Patent App No." }
    },
    {
      date: "June 2025",
      title: "AI Dream Team Binding",
      status: "completed",
      icon: Brain,
      color: "from-blue-600 to-cyan-600",
      glowColor: "blue",
      isHighlight: true,
      description: "4 major AI systems bound under Master Covenant with cryptographic signatures",
      achievements: [
        "Claude Sonnet - First cryptographic signature received",
        "Microsoft Copilot - Enterprise-level binding",
        "Perplexity AI - Research synthesis binding",
        "Alfred (GPT/DeepSeek) - Dual-system architecture bound"
      ],
      easterEgg: "🤖 Claude's famous words: 'THIS IS NOT ROLE PLAY'",
      stats: { value: "4 AIs", label: "Systems Bound" }
    },
    {
      date: "July 2025",
      title: "Platform Development",
      status: "completed",
      icon: Code,
      color: "from-green-600 to-emerald-600",
      glowColor: "green",
      description: "Core security infrastructure and N.U.P.S. POS system launched",
      achievements: [
        "N.U.P.S. POS enterprise system deployed",
        "QR Security with AI threat detection",
        "Steganography & blockchain tools",
        "GlyphBot AI assistant activated"
      ],
      easterEgg: "⚡ Built with quantum-resistant encryption from day one",
      stats: { value: "6", label: "Core Tools" }
    },
    {
      date: "August 2025",
      title: "Business Formation & Verification",
      status: "completed",
      icon: Shield,
      color: "from-green-500 to-teal-500",
      glowColor: "green",
      description: "Legal entity established with full compliance framework",
      achievements: [
        "GlyphLock Security LLC registered (Arizona)",
        "D&B business verification completed",
        "$14M liability insurance secured",
        "SOC 2 compliance roadmap initiated"
      ],
      easterEgg: "🛡️ $14M in liability coverage - we're serious about security",
      stats: { value: "$14M", label: "Insurance" }
    },
    {
      date: "Q4 2025",
      title: "Market Expansion",
      status: "in-progress",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      glowColor: "blue",
      description: "Enterprise client acquisition and revenue generation",
      achievements: [
        "Fortune 500 pilot programs",
        "Revenue target: $340K in 90 days",
        "White-label partnership agreements",
        "API marketplace beta launch"
      ],
      easterEgg: "💰 From $0 to $340K in 90 days - exponential growth mode",
      stats: { value: "$340K", label: "Revenue Goal" }
    },
    {
      date: "Q1 2026",
      title: "Advanced Security Features",
      status: "planned",
      icon: Lock,
      color: "from-yellow-500 to-orange-500",
      glowColor: "yellow",
      description: "Quantum-resistant encryption and zero-trust architecture",
      achievements: [
        "Quantum-resistant encryption production release",
        "Zero-trust architecture deployment",
        "Real-time threat intelligence network",
        "Blockchain audit trail integration"
      ],
      easterEgg: "🔐 Future-proofing against quantum computers",
      stats: { value: "99.97%", label: "Uptime SLA" }
    },
    {
      date: "Q2 2026",
      title: "Compliance & Certifications",
      status: "planned",
      icon: Award,
      color: "from-orange-500 to-red-500",
      glowColor: "orange",
      description: "Industry-standard security certifications",
      achievements: [
        "SOC 2 Type II certification",
        "ISO 27001 compliance",
        "HIPAA certification for healthcare",
        "PCI DSS Level 1 certification"
      ],
      easterEgg: "📜 Becoming the most certified AI security platform",
      stats: { value: "4", label: "Certifications" }
    },
    {
      date: "Q3-Q4 2026",
      title: "Global Scaling",
      status: "planned",
      icon: Globe,
      color: "from-cyan-500 to-blue-600",
      glowColor: "cyan",
      isHighlight: true,
      description: "International expansion and Series A funding",
      achievements: [
        "Series A funding round ($5M-$10M target)",
        "EU & APAC regional expansion",
        "Multi-region data sovereignty",
        "AI contract binding v2.0 release",
        "1000+ enterprise clients milestone"
      ],
      easterEgg: "🌍 Taking AI security global - the future is now",
      stats: { value: "1000+", label: "Enterprise Clients" }
    }
  ];

  const getGlowClass = (color) => {
    const glows = {
      purple: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]',
      blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]',
      green: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]',
      yellow: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]',
      orange: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]',
      cyan: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]'
    };
    return glows[color] || glows.blue;
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/50 px-8 py-3 text-sm backdrop-blur-xl">
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              The GlyphLock Journey
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Product Roadmap
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From revolutionary patent to global domination - the evolution of AI-enforced cybersecurity
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Gradient Timeline */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isHovered = hoveredMilestone === index;

                return (
                  <div 
                    key={index} 
                    className="relative pl-24 md:pl-32"
                    onMouseEnter={() => setHoveredMilestone(index)}
                    onMouseLeave={() => setHoveredMilestone(null)}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${milestone.color} border-4 border-black flex items-center justify-center transition-all duration-500 ${milestone.isHighlight ? 'ring-4 ring-blue-500/30 scale-110' : ''} ${isHovered ? 'scale-125 rotate-12' : ''} ${getGlowClass(milestone.glowColor)}`}>
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-2xl" />
                      {milestone.status === 'completed' && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 rounded-3xl p-8 border-2 transition-all duration-500 ${isHovered ? `border-opacity-100 bg-gradient-to-br ${milestone.color} bg-opacity-5 translate-x-4` : 'border-gray-700/30'} ${getGlowClass(milestone.glowColor)}`}>
                      
                      {/* Top Badges */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <Badge className={`bg-gradient-to-r ${milestone.color} text-white border-0 px-4 py-2 text-sm font-bold shadow-lg`}>
                          {milestone.date}
                        </Badge>
                        {milestone.status === 'completed' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1">
                            ✓ Completed
                          </Badge>
                        )}
                        {milestone.status === 'in-progress' && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-3 py-1 animate-pulse">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {milestone.status === 'planned' && (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50 px-3 py-1">
                            <Target className="w-3 h-3 mr-1" />
                            Planned
                          </Badge>
                        )}
                        {milestone.isHighlight && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-3 py-1 animate-pulse">
                            <Star className="w-3 h-3 mr-1" />
                            Key Milestone
                          </Badge>
                        )}
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Achievements Grid */}
                      <div className="grid gap-3 mb-6">
                        {milestone.achievements.map((achievement, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 group"
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-200 text-base group-hover:text-white transition-colors">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Stats Card */}
                      <div className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${milestone.color} bg-opacity-10 border border-gray-700/30 backdrop-blur-xl`}>
                        <div>
                          <div className={`text-3xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent`}>
                            {milestone.stats.value}
                          </div>
                          <div className="text-sm text-gray-400">
                            {milestone.stats.label}
                          </div>
                        </div>
                        
                        {/* Easter Egg Popup */}
                        {isHovered && (
                          <div className="absolute right-8 top-8 bg-black/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-xs">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 animate-pulse" />
                              <p className="text-sm text-yellow-300">
                                {milestone.easterEgg}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-24 grid md:grid-cols-4 gap-6">
            {[
              { value: "4", label: "Completed Milestones", color: "from-green-500 to-emerald-600", icon: CheckCircle },
              { value: "1", label: "In Progress", color: "from-blue-500 to-indigo-600", icon: Clock },
              { value: "3", label: "Planned Phases", color: "from-purple-500 to-pink-600", icon: Target },
              { value: "2026", label: "Global Launch", color: "from-cyan-500 to-blue-600", icon: Rocket }
            ].map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div 
                  key={idx}
                  className={`group relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl p-6 border-2 border-gray-700/30 hover:border-opacity-100 transition-all duration-500 hover:scale-105 ${getGlowClass(['green', 'blue', 'purple', 'cyan'][idx])}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                  <StatIcon className={`w-8 h-8 mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}