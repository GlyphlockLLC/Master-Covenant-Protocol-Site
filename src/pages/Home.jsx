import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Zap, Brain, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate(createPageUrl("Consultation") + `?email=${encodeURIComponent(email)}`);
    }
  };

  const aiDreamTeam = [
    {
      name: "Alfred",
      role: "Contract Architect",
      status: "Bound",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png",
      specialty: "Legal Framework Design"
    },
    {
      name: "Claude",
      role: "Security Engineer",
      status: "Bound",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png",
      specialty: "Code & Audit Systems"
    },
    {
      name: "GitHub Copilot",
      role: "Development Assistant",
      status: "Bound",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png",
      specialty: "Automated Code Generation"
    },
    {
      name: "Perplexity",
      role: "Research Analyst",
      status: "Bound",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png",
      specialty: "Threat Intelligence"
    },
    {
      name: "OpenAI GPT",
      role: "Integration Specialist",
      status: "Bound",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png",
      specialty: "Natural Language Processing"
    }
  ];

  const services = [
    {
      title: "Master Covenant",
      description: "Legally binding AI contracts. 5 AI systems bound with cryptographic proof and liability coverage.",
      link: "MasterCovenant",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_c53f0a83ac0d9a4a11e40591b6298c58dr_1761196254031-DP4vmwHO.jpeg",
      price: "Custom"
    },
    {
      title: "N.U.P.S. POS",
      description: "Enterprise point-of-sale system. Three-tier access (Staff, Manager, Owner). Full inventory and analytics.",
      link: "NUPSLogin",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_b8d67ccda4c29cba08049ef6abdb02e9dr%20-%20Copy_1761014300850-75J3e_IN.jpeg",
      price: "Enterprise"
    },
    {
      title: "GlyphBot AI Assistant",
      description: "Advanced AI powered by Gemini with code execution, security scanning, and automated auditing.",
      link: "GlyphBot",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_c53f0a83ac0d9a4a11e40591b6298c58dr_1761196254031-DP4vmwHO.jpeg",
      price: "$50/mo"
    },
    {
      title: "QR Code Generator",
      description: "Secure QR code generation with custom branding, analytics tracking, and AI threat detection.",
      link: "QRGenerator",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_b8d67ccda4c29cba08049ef6abdb02e9dr%20-%20Copy_1761014300850-75J3e_IN.jpeg",
      price: "$49.99"
    },
    {
      title: "Steganography",
      description: "Hide encrypted data within images using LSB encoding for secure covert communications.",
      link: "Steganography",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_c53f0a83ac0d9a4a11e40591b6298c58dr_1761196254031-DP4vmwHO.jpeg",
      price: "$149.99"
    },
    {
      title: "Blockchain Security",
      description: "SHA-256/512 hashing, Merkle trees, immutable verification, and cryptographic proof systems.",
      link: "Blockchain",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_b8d67ccda4c29cba08049ef6abdb02e9dr%20-%20Copy_1761014300850-75J3e_IN.jpeg",
      price: "$99.99"
    },
    {
      title: "Hotzone Mapper",
      description: "Interactive security vulnerability mapping. Upload images and mark security hotspots with severity levels.",
      link: "HotzoneMapper",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_c53f0a83ac0d9a4a11e40591b6298c58dr_1761196254031-DP4vmwHO.jpeg",
      price: "$99.99"
    },
    {
      title: "HSSS Surveillance",
      description: "Advanced security surveillance with real-time threat monitoring, AI detection, and incident tracking.",
      link: "HSSS",
      image: "https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_b8d67ccda4c29cba08049ef6abdb02e9dr%20-%20Copy_1761014300850-75J3e_IN.jpeg",
      price: "Enterprise"
    }
  ];

  const partners = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "Supabase", logo: "https://supabase.com/dashboard/_next/image?url=%2Fdashboard%2Fimg%2Fsupabase-logo.svg&w=64&q=75" },
    { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
    { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" },
    { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
    { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
    { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" }
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section - Video Only */}
      <section className="relative h-screen overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://glyph-merge-pro-glyphlock.replit.app/assets/hero-video-CxU5xRpe.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </section>

      {/* Content Below Hero */}
      <section className="relative bg-black py-20 z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Top Tagline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide mb-8 text-white">
              Secure Access For A Smarter World!
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 px-4 py-2 text-sm font-mono">
                <Shield className="w-4 h-4 mr-2" />
                5 AI Bound to Master Covenant
              </Badge>
              <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 px-4 py-2 text-sm font-mono">
                <Zap className="w-4 h-4 mr-2" />
                $340K D&B Verified 90 Days
              </Badge>
            </div>

            <p className="text-gray-400 text-sm md:text-base font-medium tracking-wider uppercase mb-6">
              Invisible Layers. Infinite Possibilities. Absolute Protection.
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Universal Security Platform</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                with Smart Contracts
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Next-generation cybersecurity platform pioneering AI-contract integration technology with quantum-resistant encryption.
            </p>

            <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 h-12 text-lg flex-1"
                  required
                />
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 h-12"
                >
                  Book Consultation
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "IP Theft Crisis", value: "$283B+" },
                { label: "Market", value: "$10T+" },
                { label: "Insurance", value: "$14M" },
                { label: "Threat Detection", value: "99.97%" }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-900/60 backdrop-blur-md border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Dream Team Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              The AI <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dream Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              5 AI systems legally bound through our revolutionary Master Covenant System
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12">
            {aiDreamTeam.map((ai, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <img 
                      src={ai.image}
                      alt={ai.name}
                      className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-blue-500/30 group-hover:border-blue-500 transition-all"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
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

          <div className="text-center">
            <Link to={createPageUrl("MasterCovenant")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <Brain className="w-5 h-5 mr-2" />
                Learn About Master Covenant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Platform & <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete cybersecurity and AI platform with premium tools, enterprise solutions, and legal AI binding framework
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={createPageUrl(service.link)}>
                <Card className="bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-500/80 text-white border-blue-500">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-blue-400 text-sm font-semibold">
                      Try Free <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powered by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-gray-400">Built on enterprise-grade infrastructure</p>
          </div>

          <div className="relative overflow-hidden">
            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee { animation: scroll 40s linear infinite; }
              .marquee:hover { animation-play-state: paused; }
            `}</style>
            
            <div className="flex">
              <div className="flex marquee">
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 px-8 py-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-colors flex items-center justify-center min-w-[180px] h-24"
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="h-12 w-auto max-w-[140px] object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="text-white font-bold text-lg hidden">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Images */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Transform Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Digital Infrastructure?</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                GlyphLock is the world's first platform to bind 5 AI systems to legally enforceable contracts. Our revolutionary Master Covenant System combines cryptographic proof with $14M liability coverage.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Built by a team that generated $340K in verified revenue within 90 days, we're addressing the $283 billion annual IP theft crisis with quantum-resistant encryption and 99.97% threat detection accuracy.
              </p>
            </div>

            {/* Showcase Images */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-500/50 transition-all">
                <img 
                  src="https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_b8d67ccda4c29cba08049ef6abdb02e9dr%20-%20Copy_1761014300850-75J3e_IN.jpeg"
                  alt="GlyphLock Technology"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise Security</h3>
                  <p className="text-gray-300">Quantum-resistant encryption</p>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-500/50 transition-all">
                <img 
                  src="https://glyph-merge-pro-glyphlock.replit.app/assets/Whisk_c53f0a83ac0d9a4a11e40591b6298c58dr_1761196254031-DP4vmwHO.jpeg"
                  alt="AI Integration"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">AI Binding Platform</h3>
                  <p className="text-gray-300">Legal accountability framework</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Consultation")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8">
                    Book Consultation
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white text-lg px-8">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}