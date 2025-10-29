import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MasterCovenant() {
  const aiSystems = [
    { name: "Alfred", status: "Bound", color: "blue" },
    { name: "Claude", status: "Bound", color: "blue" },
    { name: "GitHub Copilot", status: "Bound", color: "blue" },
    { name: "Perplexity", status: "Bound", color: "blue" },
    { name: "OpenAI GPT", status: "Bound", color: "blue" }
  ];

  const features = [
    {
      title: "Legally Binding Contracts",
      description: "AI systems bound to enforceable legal agreements with clear liability terms"
    },
    {
      title: "$14M Liability Coverage",
      description: "Comprehensive insurance protection for all AI operations and decisions"
    },
    {
      title: "Cryptographic Proof",
      description: "Blockchain-verified attestation of AI compliance and contract adherence"
    },
    {
      title: "Real-time Monitoring",
      description: "24/7 surveillance of AI behavior with instant breach detection"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero with Covenant Image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/ee388f8e1_ai-covenant-binding.jpg"
            alt="AI Covenant Binding"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold">
              World's First AI Legal Framework
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Covenant</span> System
            </h1>
            
            <p className="text-xl text-white mb-8">
              Binding 5 AI systems to legally enforceable contracts with cryptographic proof and $14M liability coverage
            </p>

            <Link to={createPageUrl("Consultation")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Schedule Legal Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Systems Grid */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              The <span className="text-blue-400">Dream Team</span>
            </h2>
            <p className="text-white">5 AI systems legally bound and monitored</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {aiSystems.map((ai, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {ai.name[0]}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{ai.name}</h3>
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                    ✓ {ai.status}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              How It <span className="text-blue-400">Works</span>
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Revolutionary framework combining legal contracts with cryptographic verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg mb-4 flex items-center justify-center text-2xl text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/ee388f8e1_ai-covenant-binding.jpg"
            alt="AI Covenant"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">$14M</div>
              <div className="text-white">Liability Coverage</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">5</div>
              <div className="text-white">AI Systems Bound</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-white">Legal Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Secure Your AI Operations?
            </h2>
            <p className="text-xl text-white mb-8">
              Join the pioneers implementing legally binding AI frameworks with comprehensive protection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}