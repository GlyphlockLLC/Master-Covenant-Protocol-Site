import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Image, Blocks, ChevronRight, Shield } from "lucide-react";

export default function SecurityTools() {
  const tools = [
    {
      name: "QR Code Generator",
      description: "Create secure, branded QR codes with custom styling and analytics tracking",
      icon: QrCode,
      price: "$49.99",
      link: "QRGenerator",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "Steganography",
      description: "Hide encrypted messages within images using advanced LSB encoding techniques",
      icon: Image,
      price: "$149.99",
      link: "Steganography",
      gradient: "from-orange-500 to-red-600"
    },
    {
      name: "Blockchain Security",
      description: "SHA-256/512 hashing, immutable data verification, and cryptographic proofs",
      icon: Blocks,
      price: "$99.99",
      link: "Blockchain",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Security <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tools</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional-grade cybersecurity tools for encryption, verification, and secure communications
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{tool.name}</h3>
                  <p className="text-gray-400 mb-6">{tool.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-cyan-400">{tool.price}</span>
                    <span className="text-sm text-gray-500">one-time</span>
                  </div>

                  <Link to={createPageUrl(tool.link)}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      Try Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Our team can build tailored security tools for your specific needs
              </p>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}