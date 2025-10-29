import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, FileText, Lock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function MasterCovenant() {
  const aiSystems = [
    { name: "Alfred", status: "Bound", color: "cyan" },
    { name: "Claude", status: "Bound", color: "purple" },
    { name: "GitHub Copilot", status: "Bound", color: "blue" },
    { name: "Perplexity", status: "Bound", color: "green" },
    { name: "OpenAI GPT", status: "Bound", color: "orange" }
  ];

  const features = [
    {
      icon: FileText,
      title: "Legally Binding Contracts",
      description: "AI systems bound to enforceable legal agreements with clear liability terms"
    },
    {
      icon: Shield,
      title: "$14M Liability Coverage",
      description: "Comprehensive insurance protection for all AI operations and decisions"
    },
    {
      icon: Lock,
      title: "Cryptographic Proof",
      description: "Blockchain-verified attestation of AI compliance and contract adherence"
    },
    {
      icon: CheckCircle2,
      title: "Real-time Monitoring",
      description: "24/7 surveillance of AI behavior with instant breach detection"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 via-blue-600/10 to-cyan-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-semibold">
              World's First AI Legal Framework
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Covenant</span> System
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Binding 5 AI systems to legally enforceable contracts with cryptographic proof and $14M liability coverage
            </p>

            <Link to={createPageUrl("Consultation")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
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
            <h2 className="text-4xl font-bold mb-4">
              The <span className="text-purple-400">Dream Team</span>
            </h2>
            <p className="text-gray-400">5 AI systems legally bound and monitored</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {aiSystems.map((ai, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-all">
                <CardContent className="p-6 text-center">
                  <Brain className={`w-12 h-12 text-${ai.color}-400 mx-auto mb-4`} />
                  <h3 className="text-lg font-bold mb-2">{ai.name}</h3>
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    {ai.status}
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
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="text-purple-400">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Revolutionary framework combining legal contracts with cryptographic verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all">
                <CardContent className="p-8">
                  <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">$14M</div>
              <div className="text-gray-400">Liability Coverage</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-pink-400 mb-2">5</div>
              <div className="text-gray-400">AI Systems Bound</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">100%</div>
              <div className="text-gray-400">Legal Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your AI Operations?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join the pioneers implementing legally binding AI frameworks with comprehensive protection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Consultation")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600">
                  Book Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
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