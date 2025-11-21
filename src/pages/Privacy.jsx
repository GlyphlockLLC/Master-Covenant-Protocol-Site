import React from "react";
import { Shield, Lock, Database, Eye, Trash2, Globe, Bell } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Privacy() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy | GlyphLock"
        description="GlyphLock Privacy Policy - How we protect, encrypt, and manage your data."
        url="/privacy"
      />
      <div className="min-h-screen bg-black text-white py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8C4BFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00E4FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block p-4 bg-white/5 rounded-2xl mb-6 border border-white/10">
              <Shield className="w-12 h-12 text-[#00E4FF]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-space">
              PRIVACY <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">POLICY</span>
            </h1>
            <div className="inline-block px-4 py-2 bg-[#00E4FF]/10 border border-[#00E4FF]/30 rounded-full">
              <p className="text-[#00E4FF] text-sm font-bold uppercase tracking-widest">Last Updated: May 2025</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-12 space-y-12 backdrop-blur-xl bg-black/40">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#00E4FF]/10 rounded-xl border border-[#00E4FF]/20">
                  <Database className="w-6 h-6 text-[#00E4FF]" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">1. Information We Collect</h2>
              </div>
              <div className="pl-4 border-l-2 border-white/10 ml-6 space-y-4">
                <p className="text-gray-300 text-lg">We collect only the information necessary to operate our platform and services, including:</p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E4FF] mt-1.5 text-xs">●</span>
                    <span>Account details (name, email)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E4FF] mt-1.5 text-xs">●</span>
                    <span>Uploaded content (images, files, metadata)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00E4FF] mt-1.5 text-xs">●</span>
                    <span>Security-related activity logs (authentication events, system interactions)</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-[#00E4FF]/5 border border-[#00E4FF]/20 rounded-xl text-center">
                  <p className="text-[#00E4FF] font-bold text-sm uppercase tracking-wide">We do not sell, rent, or trade your personal information.</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#8C4BFF]/10 rounded-xl border border-[#8C4BFF]/20">
                  <Eye className="w-6 h-6 text-[#8C4BFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">2. How We Use Your Information</h2>
              </div>
              <div className="pl-4 border-l-2 border-white/10 ml-6 space-y-4">
                <p className="text-gray-300 text-lg">Your data is used solely for:</p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8C4BFF] mt-1.5 text-xs">●</span>
                    <span>Providing and improving our services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8C4BFF] mt-1.5 text-xs">●</span>
                    <span>Securing your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8C4BFF] mt-1.5 text-xs">●</span>
                    <span>Generating verifiable logs for security integrity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8C4BFF] mt-1.5 text-xs">●</span>
                    <span>Preventing fraud and abuse</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">3. Security & Encryption</h2>
              </div>
              <div className="pl-4 border-l-2 border-white/10 ml-6 space-y-4">
                <p className="text-gray-300 text-lg">GlyphLock applies multi-layered security including:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "AES-256 encryption at rest",
                    "TLS 1.3 encryption in transit",
                    "Zero-trust access controls",
                    "Automated tamper-detection logs"
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg text-sm text-gray-300 border border-white/5">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Trash2 className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-space">4. Data Retention & Deletion</h2>
              </div>
              <div className="pl-4 border-l-2 border-white/10 ml-6 space-y-4">
                <p className="text-gray-300 text-lg">
                  We retain only what is required to maintain account validity and legal compliance. 
                  You may request full data deletion at any time via your account settings or support.
                </p>
              </div>
            </section>

            <section className="mt-16 p-8 bg-gradient-to-r from-[#00E4FF]/10 to-[#8C4BFF]/10 border border-[#00E4FF]/30 rounded-2xl text-center">
              <h2 className="text-3xl font-bold text-white mb-4 font-space">Contact Privacy Officer</h2>
              <p className="text-gray-300 mb-8">
                For questions, concerns, or data requests:
              </p>
              <a 
                href="mailto:glyphlock@gmail.com" 
                className="inline-flex items-center justify-center bg-white text-black font-bold uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-[#00E4FF] transition-colors"
              >
                Email Support
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}