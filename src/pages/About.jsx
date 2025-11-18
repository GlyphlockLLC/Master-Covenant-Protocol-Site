import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Shield, Target, Users, Zap, Code, Brain, Sparkles } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Every decision we make prioritizes the security and privacy of our clients"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing the boundaries of cybersecurity with cutting-edge technology"
    },
    {
      icon: Users,
      title: "Client Success",
      description: "Your success is our success. We're committed to your digital safety"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We maintain the highest standards in every aspect of our work"
    }
  ];

  const buildJourney = [
    { tool: "VS Code", icon: Code, role: "Development Environment" },
    { tool: "Google AI", icon: Brain, role: "AI Integration" },
    { tool: "Base44", icon: Sparkles, role: "Full-Stack Platform" },
    { tool: "Claude", icon: Brain, role: "AI Assistant" },
    { tool: "ChatGPT", icon: Brain, role: "AI Collaboration" }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              About <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Pioneering quantum-resistant cybersecurity solutions for the digital age
            </p>
          </div>

          <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-white leading-relaxed mb-6">
              Founded in May 2025 in El Mirage, Arizona by Carlo Earl, GlyphLock Security LLC emerged from a vision to create 
              next-generation cybersecurity tools that combine quantum-resistant encryption with artificial intelligence.
            </p>
            <p className="text-white leading-relaxed mb-6">
              Our flagship technologies include the GlyphLock Master Covenant (Patent App. No. 18/584,961), 
              a revolutionary legal framework that binds AI systems through Contractual Auto-Binding (CAB), 
              and our comprehensive suite of security tools designed for enterprise-level protection.
            </p>
          </div>

          <div className="glass-card-dark border-blue-500/30 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">The Build Journey</h2>
            <p className="text-white leading-relaxed mb-8">
              While GlyphLock.io and Base44 emerged as distinct innovations in the tech landscape, our development story 
              is one of exploration, iteration, and ultimate convergence with cutting-edge AI technology.
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4">From Concept to Reality</h3>
              <p className="text-white leading-relaxed mb-4">
                Our journey began with testing multiple platforms, experimenting with different development approaches, 
                coding methodologies, managing DevOps challenges, and navigating the complexities of building a 
                comprehensive cybersecurity ecosystem.
              </p>
              <p className="text-white leading-relaxed mb-4">
                After extensive exploration, we discovered the perfect combination: <strong className="text-blue-400">VS Code</strong> as 
                our development environment, <strong className="text-blue-400">Google AI</strong> for intelligent integration, 
                and <strong className="text-blue-400">Base44</strong> — founded by Maor Shlomo and recently acquired by Wix — 
                as our no-code AI application builder. This platform revolutionized our approach by enabling rapid full-stack 
                development through natural language.
              </p>
              <p className="text-white leading-relaxed">
                Working alongside AI assistants <strong className="text-blue-400">Claude</strong> and <strong className="text-blue-400">ChatGPT</strong>, 
                we transformed our vision into a beautiful, fully functional cybersecurity platform. Base44's ability to handle 
                everything from database architecture to UI/UX design, user authentication, and deployment allowed us to focus 
                on what matters most: creating innovative security solutions that protect intellectual property and combat the 
                escalating crisis of digital theft.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {buildJourney.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="glass-card-dark border-blue-500/30 rounded-xl p-4 text-center">
                    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-bold text-white mb-1">{item.tool}</div>
                    <div className="text-xs text-white/60">{item.role}</div>
                  </div>
                );
              })}
            </div>

            <div className="glass-card-dark border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">The Result</h3>
              <p className="text-white leading-relaxed">
                Through this collaborative AI-powered development process, GlyphLock.io emerged as a sophisticated 
                cybersecurity platform featuring quantum-resistant encryption, steganography, secure QR generation, 
                blockchain integration, and the pioneering Master Covenant System — all built on a foundation of 
                modern technology and innovative thinking.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div key={idx} className="glass-card-dark border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                        <p className="text-white/70">{value.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card-dark border-blue-500/30 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's discuss how GlyphLock can protect your organization
            </p>
            <Link to={createPageUrl("Consultation")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}