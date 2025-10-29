import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function SecurityTools() {
  const tools = [
    {
      name: "QR Code Generator",
      description: "Create secure, branded QR codes with custom styling and analytics tracking",
      price: "$49.99",
      link: "QRGenerator",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b5ad362ca_futuristic-qr-code.jpg"
    },
    {
      name: "Steganography",
      description: "Hide encrypted messages within images using advanced LSB encoding techniques",
      price: "$149.99",
      link: "Steganography",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/eab90f603_Whisk_a031d7a8f4d67e79d2d4deb5ac0e0183eg.jpg"
    },
    {
      name: "Blockchain Security",
      description: "SHA-256/512 hashing, immutable data verification, and cryptographic proofs",
      price: "$99.99",
      link: "Blockchain",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/4c116ea06_Whisk_311edc975728fa8ad384b1950238341bdr-Copy-Copy.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 pointer-events-none">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/b55c5807c_08f33231-115f-4c95-9719-682f4e9679cc-Copy-Copy-Copy-Copy-Copy-Copy.jpg"
                alt="Security"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Security <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Tools</span>
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Professional-grade cybersecurity tools for encryption, verification, and secure communications
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-all group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                  <p className="text-white mb-6">{tool.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-blue-400">{tool.price}</span>
                    <span className="text-sm text-gray-500">one-time</span>
                  </div>

                  <Link to={createPageUrl(tool.link)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                      Try Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-900 border-blue-500/30 overflow-hidden relative">
            <div className="absolute inset-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
                alt="GlyphLock Tech"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-white">Need a Custom Solution?</h2>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                Our team can build tailored security tools for your specific needs
              </p>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
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