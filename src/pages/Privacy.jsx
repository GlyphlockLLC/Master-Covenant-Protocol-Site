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
    <div className="min-h-screen bg-black text-white py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-ultraviolet/5 via-transparent to-cyan/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-ultraviolet/10 rounded-full mb-6 border border-ultraviolet/30">
              <Shield className="w-16 h-16 text-ultraviolet" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Privacy <span className="bg-gradient-to-r from-ultraviolet to-cyan bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-cyan text-lg">Last Updated: May 2025</p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-ultraviolet/20 via-black/40 to-cyan/20 border border-ultraviolet/40 rounded-2xl shadow-[0_0_50px_rgba(138,43,226,0.3)] p-8 md:p-12 space-y-12">
            <section className="border-l-4 border-ultraviolet pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-cyan" />
                <h2 className="text-3xl font-bold text-white">1. Information We Collect</h2>
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
              <div className="mt-6 p-4 bg-cyan/10 border border-cyan/30 rounded-lg">
                <p className="font-bold text-cyan text-xl">We do not sell, rent, or trade your personal information. Ever.</p>
              </div>
            </section>

            <section className="border-l-4 border-cyan pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-ultraviolet" />
                <h2 className="text-3xl font-bold text-white">2. How We Use Your Information</h2>
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

            <section className="border-l-4 border-ultraviolet pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-cyan" />
                <h2 className="text-3xl font-bold text-white">3. Security & Encryption</h2>
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

            <section className="border-l-4 border-cyan pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-ultraviolet" />
                <h2 className="text-3xl font-bold text-white">4. Control Over Your Data</h2>
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

            <section className="border-l-4 border-ultraviolet pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="w-8 h-8 text-cyan" />
                <h2 className="text-3xl font-bold text-white">5. Data Retention</h2>
              </div>
              <p className="text-gray-100 text-lg">We retain only what is required to maintain account validity, security integrity, and legal compliance.</p>
              <p className="mt-3 text-gray-100 text-lg">When data is deleted, it is purged from active storage and scheduled for secure destruction from backups.</p>
            </section>

            <section className="border-l-4 border-cyan pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-ultraviolet" />
                <h2 className="text-3xl font-bold text-white">6. Third-Party Services</h2>
              </div>
              <p className="text-gray-100 text-lg">If third-party integrations (AI, storage, payment processing) are used, only the minimal required data is shared, and only under strict security controls.</p>
            </section>

            <section className="border-l-4 border-ultraviolet pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-8 h-8 text-cyan" />
                <h2 className="text-3xl font-bold text-white">7. Updates to This Policy</h2>
              </div>
              <p className="text-gray-100 text-lg">We may update this Privacy Policy to reflect changes in technology, security requirements, or legal standards. Updates will be posted on this page.</p>
            </section>

            <section className="mt-12 p-8 bg-gradient-to-r from-ultraviolet/20 to-cyan/20 border-2 border-ultraviolet rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Contact</h2>
              <p className="text-gray-100 text-lg text-center">
                For questions, concerns, or data requests:{" "}
                <a href="mailto:glyphlock@gmail.com" className="text-cyan hover:text-white transition font-bold underline text-xl">
                  glyphlock@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}