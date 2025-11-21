import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using GlyphLock services, you accept and agree to be bound by these terms and conditions."
    },
    {
      title: "2. Service Description",
      content: "GlyphLock provides cybersecurity tools and services including visual cryptography, blockchain security, AI assistance, and security operations monitoring."
    },
    {
      title: "3. User Obligations",
      content: "You agree to use our services lawfully and not to engage in activities that could harm our systems or other users. You are responsible for maintaining the confidentiality of your account."
    },
    {
      title: "4. Intellectual Property",
      content: "All GlyphLock technology, including the Master Covenant, software, and documentation, is protected by intellectual property laws and the CAB framework. Unauthorized use is prohibited."
    },
    {
      title: "5. Limitation of Liability",
      content: "GlyphLock is provided 'as is' without warranties. We are not liable for indirect, incidental, or consequential damages arising from service use."
    },
    {
      title: "6. Termination",
      content: "We reserve the right to terminate or suspend access to our services at any time for violations of these terms."
    },
    {
      title: "7. Governing Law",
      content: "These terms are governed by the laws of Arizona, United States. Disputes will be resolved in Arizona courts."
    },
    {
      title: "8. Changes to Terms",
      content: "We may modify these terms at any time. Continued use of our services constitutes acceptance of modified terms."
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Service | GlyphLock"
        description="Terms and conditions for using GlyphLock security services."
        url="/terms"
      />
      <div className="min-h-screen bg-black text-white py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-4 font-space tracking-tight">
              TERMS OF <span className="text-[#00E4FF]">SERVICE</span>
            </h1>
            <p className="text-gray-400 uppercase tracking-widest text-sm">Last updated: May 2025</p>
          </div>

          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className="glass-card rounded-xl border border-white/10 p-6 hover:border-white/20 transition-colors">
                <h2 className="text-xl font-bold text-white mb-3 font-space">{section.title}</h2>
                <p className="text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card rounded-xl border border-[#00E4FF]/20 p-8 bg-[#00E4FF]/5 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-gray-300">
              For questions about these terms, contact us at{" "}
              <a href="mailto:glyphlock@gmail.com" className="text-[#00E4FF] hover:text-white font-bold transition-colors">
                glyphlock@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}