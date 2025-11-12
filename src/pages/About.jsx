import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Users, Zap, Brain, Award } from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Chief Security Architect",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Former NSA cryptographer with 15+ years in quantum security"
    },
    {
      name: "Head of AI Integration",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      bio: "PhD in Machine Learning, pioneering AI-contract binding"
    },
    {
      name: "Legal Technology Lead",
      role: "Chief Legal Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Stanford Law, specializing in AI liability frameworks"
    },
    {
      name: "Blockchain Architect",
      role: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      bio: "Built cryptographic systems for Fortune 500 companies"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Every decision prioritizes the protection of our clients' digital assets"
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Pioneering AI-contract binding technology and quantum-resistant encryption"
    },
    {
      icon: Users,
      title: "Transparency",
      description: "Open about our methods, honest about our capabilities"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "99.97% threat detection accuracy, $340K revenue in 90 days"
    }
  ];

  const milestones = [
    { year: "2024 Q1", event: "Company Founded", description: "Vision to bind AI to legal contracts" },
    { year: "2024 Q2", event: "Master Covenant System", description: "First 5 AI systems legally bound" },
    { year: "2024 Q3", event: "$14M Liability Coverage", description: "Secured enterprise-grade insurance" },
    { year: "2024 Q4", event: "$340K Revenue", description: "D&B verified in 90 days" },
    { year: "2025 Q1", event: "Platform Launch", description: "Full cybersecurity suite released" },
    { year: "2025 Q2", event: "Enterprise Expansion", description: "Fortune 500 partnerships" }
  ];

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">GlyphLock</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're building the world's first platform to legally bind AI systems to enforceable contracts, 
              addressing the $283 billion annual IP theft crisis with quantum-resistant encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Our <span className="text-blue-400">Mission</span>
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  To create unprecedented accountability in AI-powered security through legally binding contracts, 
                  cryptographic proof, and comprehensive liability coverage.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We're not just building security tools – we're pioneering a new paradigm where AI systems 
                  operate within enforceable legal frameworks, protecting enterprises from emerging threats 
                  while maintaining full transparency and accountability.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                  alt="Mission"
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop"
                  alt="Vision"
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg" />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Our <span className="text-blue-400">Vision</span>
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  A future where every AI system operates within a transparent legal framework, 
                  where enterprises have guaranteed protection, and where innovation happens 
                  without compromising security or accountability.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We envision a world where quantum-resistant encryption is standard, where threat 
                  detection is instantaneous, and where legal liability is clearly defined – 
                  making the digital world as secure as the physical one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Core <span className="text-blue-400">Values</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Leadership <span className="text-blue-400">Team</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              World-class experts in cybersecurity, AI, and legal technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all group">
                <CardContent className="p-6 text-center">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500/30 group-hover:border-blue-500 transition-all"
                  />
                  <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Our <span className="text-blue-400">Journey</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From vision to reality in record time
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full group-hover:scale-150 transition-transform" />
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 group-hover:border-blue-500/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue-400 font-bold">{milestone.year}</span>
                        <h3 className="text-xl font-bold text-white">{milestone.event}</h3>
                      </div>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "$340K", label: "Revenue in 90 Days", sublabel: "D&B Verified" },
              { value: "$14M", label: "Liability Coverage", sublabel: "Enterprise Grade" },
              { value: "99.97%", label: "Threat Detection", sublabel: "Industry Leading" },
              { value: "5", label: "AI Systems Bound", sublabel: "Master Covenant" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Join the Revolution
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Be part of the first platform to legally bind AI systems with comprehensive protection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}