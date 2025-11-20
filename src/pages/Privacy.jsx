import React from "react";
import { Shield, Lock, Database, Eye, Trash2, Globe, Bell } from "lucide-react";

export default function Privacy() {
  const sections = [
    { icon: Database, title: "1. Information We Collect" },
    { icon: Eye, title: "2. How We Use Your Information" },
    { icon: Lock, title: "3. Security & Encryption" },
    { icon: Shield, title: "4. Control Over Your Data" },
    { icon: Trash2, title: "5. Data Retention" },
    { icon: Globe, title: "6. Third-Party Services" },
    { icon: Bell, title: "7. Updates to This Policy" }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ultraviolet/20 via-black to-cyan/20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ultraviolet/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan/30 rounded-full blur-[120px] animate-pulse" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-6 bg-gradient-to-br from-ultraviolet/30 to-cyan/30 rounded-full mb-6 border-4 border-cyan shadow-[0_0_40px_rgba(0,234,255,0.6)] animate-pulse">
              <Shield className="w-20 h-20 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="text-white">Privacy </span>
              <span className="bg-gradient-to-r from-ultraviolet via-cyan to-ultraviolet bg-clip-text text-transparent animate-pulse">Policy</span>
            </h1>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-cyan/20 to-ultraviolet/20 border-2 border-cyan rounded-full">
              <p className="text-cyan text-xl font-bold">Last Updated: May 2025</p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-ultraviolet/30 via-black/50 to-cyan/30 border-4 border-ultraviolet rounded-3xl shadow-[0_0_80px_rgba(138,43,226,0.5),0_0_120px_rgba(0,234,255,0.3)] p-8 md:p-12 space-y-12">
            <section className="border-l-8 border-ultraviolet pl-6 bg-gradient-to-r from-ultraviolet/10 to-transparent p-6 rounded-r-xl hover:from-ultraviolet/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan to-ultraviolet rounded-xl shadow-[0_0_20px_rgba(0,234,255,0.5)]">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">1. Information We Collect</h2>
              </div>
              <p className="text-gray-100 text-lg mb-3">We collect only the information necessary to operate our platform and services, including:</p>
              <ul className="space-y-2 text-gray-200 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Account details (name, email)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Uploaded content (images, files, metadata)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Security-related activity logs (authentication events, system interactions)</span>
                </li>
              </ul>
              <div className="mt-6 p-6 bg-gradient-to-r from-cyan/30 to-ultraviolet/30 border-4 border-cyan rounded-xl shadow-[0_0_30px_rgba(0,234,255,0.4)] animate-pulse">
                <p className="font-black text-white text-2xl text-center">⚡ We do not sell, rent, or trade your personal information. Ever. ⚡</p>
              </div>
            </section>

            <section className="border-l-8 border-cyan pl-6 bg-gradient-to-r from-cyan/10 to-transparent p-6 rounded-r-xl hover:from-cyan/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-ultraviolet to-cyan rounded-xl shadow-[0_0_20px_rgba(138,43,226,0.5)]">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-100 text-lg mb-3">Your data is used solely for:</p>
              <ul className="space-y-2 text-gray-200 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Providing and improving our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Securing your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Generating verifiable logs for security integrity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Preventing fraud and abuse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Supporting customer service requests</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-100 text-lg">All analytics used for performance improvement are anonymized and aggregated.</p>
            </section>

            <section className="border-l-8 border-ultraviolet pl-6 bg-gradient-to-r from-ultraviolet/10 to-transparent p-6 rounded-r-xl hover:from-ultraviolet/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan to-ultraviolet rounded-xl shadow-[0_0_20px_rgba(0,234,255,0.5)]">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">3. Security & Encryption</h2>
              </div>
              <p className="text-gray-100 text-lg mb-3">GlyphLock applies multi-layered security including:</p>
              <ul className="space-y-2 text-gray-200 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>AES-256 encryption at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>TLS 1.3 encryption in transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Zero-trust access controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Automated tamper-detection logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">•</span>
                  <span>Cryptographic verification for certain user actions</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-100 text-lg">Some system events may be hashed or recorded for integrity protection, but never in a way that exposes personal content.</p>
            </section>

            <section className="border-l-8 border-cyan pl-6 bg-gradient-to-r from-cyan/10 to-transparent p-6 rounded-r-xl hover:from-cyan/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-ultraviolet to-cyan rounded-xl shadow-[0_0_20px_rgba(138,43,226,0.5)]">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">4. Control Over Your Data</h2>
              </div>
              <p className="text-gray-100 text-lg mb-3">You may request:</p>
              <ul className="space-y-2 text-gray-200 text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Data access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Data correction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Account deletion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ultraviolet mt-1">•</span>
                  <span>Removal of uploaded content</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-100 text-lg">
                Submit requests at{" "}
                <a href="mailto:glyphlock@gmail.com" className="text-cyan hover:text-white transition font-semibold underline">
                  glyphlock@gmail.com
                </a>
              </p>
            </section>

            <section className="border-l-8 border-ultraviolet pl-6 bg-gradient-to-r from-ultraviolet/10 to-transparent p-6 rounded-r-xl hover:from-ultraviolet/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan to-ultraviolet rounded-xl shadow-[0_0_20px_rgba(0,234,255,0.5)]">
                  <Trash2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">5. Data Retention</h2>
              </div>
              <p className="text-gray-100 text-lg">We retain only what is required to maintain account validity, security integrity, and legal compliance.</p>
              <p className="mt-3 text-gray-100 text-lg">When data is deleted, it is purged from active storage and scheduled for secure destruction from backups.</p>
            </section>

            <section className="border-l-8 border-cyan pl-6 bg-gradient-to-r from-cyan/10 to-transparent p-6 rounded-r-xl hover:from-cyan/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-ultraviolet to-cyan rounded-xl shadow-[0_0_20px_rgba(138,43,226,0.5)]">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">6. Third-Party Services</h2>
              </div>
              <p className="text-gray-100 text-lg">If third-party integrations (AI, storage, payment processing) are used, only the minimal required data is shared, and only under strict security controls.</p>
            </section>

            <section className="border-l-8 border-ultraviolet pl-6 bg-gradient-to-r from-ultraviolet/10 to-transparent p-6 rounded-r-xl hover:from-ultraviolet/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan to-ultraviolet rounded-xl shadow-[0_0_20px_rgba(0,234,255,0.5)]">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">7. Updates to This Policy</h2>
              </div>
              <p className="text-gray-100 text-lg">We may update this Privacy Policy to reflect changes in technology, security requirements, or legal standards. Updates will be posted on this page.</p>
            </section>

            <section className="mt-12 p-10 bg-gradient-to-br from-ultraviolet/40 via-cyan/30 to-ultraviolet/40 border-4 border-cyan rounded-2xl shadow-[0_0_60px_rgba(0,234,255,0.6)] hover:shadow-[0_0_100px_rgba(138,43,226,0.8)] transition-all duration-500">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-xl border-2 border-white/30">
                  <Shield className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-5xl font-black text-white mb-6 text-center">Contact Us</h2>
              <p className="text-white text-xl text-center mb-4">
                For questions, concerns, or data requests:
              </p>
              <div className="text-center">
                <a 
                  href="mailto:glyphlock@gmail.com" 
                  className="inline-block px-8 py-4 bg-gradient-to-r from-cyan to-ultraviolet text-white font-black text-2xl rounded-xl shadow-[0_0_30px_rgba(0,234,255,0.5)] hover:shadow-[0_0_50px_rgba(138,43,226,0.8)] hover:scale-105 transition-all duration-300"
                >
                  📧 glyphlock@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}