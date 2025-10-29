
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Lock, Brain, QrCode, Image, Blocks, 
  ChevronRight, TrendingUp, DollarSign, Users, CheckCircle2,
  Zap, Globe, Server, Database
} from "lucide-react";

export default function Home() {
  const stats = [
    { label: "IP Theft Crisis", value: "$283B+", icon: TrendingUp },
    { label: "Market Opportunity", value: "$10T+", icon: DollarSign },
    { label: "Insurance Coverage", value: "$14M", icon: Shield },
    { label: "Threat Detection", value: "99.97%", icon: CheckCircle2 }
  ];

  const services = [
    {
      title: "Master Covenant",
      description: "Legally binding AI contracts. 5 AI systems bound with cryptographic proof and liability coverage.",
      icon: Brain,
      link: "MasterCovenant",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Security Tools & Blockchain",
      description: "Complete cybersecurity suite with QR Generator, Steganography, and SHA-256/512 hashing.",
      icon: Shield,
      link: "SecurityTools",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "GlyphBot AI Assistant",
      description: "Advanced AI powered by Gemini with code execution, security scanning, and automated auditing.",
      icon: Brain,
      link: "GlyphBot",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      title: "QR Code Generator",
      description: "Secure QR code generation with custom branding, analytics tracking, and encryption.",
      icon: QrCode,
      link: "QRGenerator",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Steganography",
      description: "Hide encrypted data within images using LSB encoding for secure communications.",
      icon: Image,
      link: "Steganography",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, immutable verification, and cryptographic proof systems.",
      icon: Blocks,
      link: "Blockchain",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const partners = [
    "AWS", "Google Cloud", "Azure", "Stripe", "OpenAI", "Claude",
    "Vercel", "Supabase", "MongoDB", "Redis", "PostgreSQL", "Docker",
    "Kubernetes", "GitHub", "TypeScript", "React", "Node.js", "Next.js"
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold">
              5 AI Bound to Master Covenant
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Universal Security Platform
              </span>
              <br />
              <span className="text-white">with Smart Contracts</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Next-generation cybersecurity platform pioneering AI-contract integration technology with quantum-resistant encryption.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8">
                  Book Consultation
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("MasterCovenant")}>
                <Button size="lg" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10 text-lg px-8">
                  Explore Master Covenant
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6">
                  <stat.icon className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Platform & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete cybersecurity and AI platform with premium tools, enterprise solutions, and legal AI binding framework
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={createPageUrl(service.link)}>
                <Card className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-cyan-400 text-sm font-semibold">
                      Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-gray-400">Built on enterprise-grade infrastructure</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                <span className="text-gray-400 font-semibold text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Digital Infrastructure?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              GlyphLock is the world's first platform to bind 5 AI systems to legally enforceable contracts. Our revolutionary Master Covenant System combines cryptographic proof with $14M liability coverage, creating unprecedented accountability in AI-powered security.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Built by a team that generated $340K in verified revenue within 90 days, we're addressing the $283 billion annual IP theft crisis with quantum-resistant encryption, 99.97% threat detection accuracy, and enterprise-grade infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10 text-lg px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
