import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Privacy <span className="bg-gradient-to-r from-ultraviolet to-cyan bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400">Last Updated: May 2025</p>
          </div>

          <div className="glass-card p-8 space-y-8 text-gray-200 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>We collect only the information necessary to operate our platform and services, including:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Account details (name, email)</li>
                <li>Uploaded content (images, files, metadata)</li>
                <li>Security-related activity logs (authentication events, system interactions)</li>
              </ul>
              <p className="mt-4 font-semibold text-cyan">We do not sell, rent, or trade your personal information. Ever.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>Your data is used solely for:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Providing and improving our services</li>
                <li>Securing your account</li>
                <li>Generating verifiable logs for security integrity</li>
                <li>Preventing fraud and abuse</li>
                <li>Supporting customer service requests</li>
              </ul>
              <p className="mt-4">All analytics used for performance improvement are anonymized and aggregated.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Security & Encryption</h2>
              <p>GlyphLock applies multi-layered security including:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>AES-256 encryption at rest</li>
                <li>TLS 1.3 encryption in transit</li>
                <li>Zero-trust access controls</li>
                <li>Automated tamper-detection logs</li>
                <li>Cryptographic verification for certain user actions</li>
              </ul>
              <p className="mt-4">Some system events may be hashed or recorded for integrity protection, but never in a way that exposes personal content.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Control Over Your Data</h2>
              <p>You may request:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Data access</li>
                <li>Data correction</li>
                <li>Account deletion</li>
                <li>Removal of uploaded content</li>
              </ul>
              <p className="mt-4">
                Submit requests at{" "}
                <a href="mailto:glyphlock@gmail.com" className="text-cyan hover:text-ultraviolet transition">
                  glyphlock@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
              <p>We retain only what is required to maintain account validity, security integrity, and legal compliance.</p>
              <p className="mt-2">When data is deleted, it is purged from active storage and scheduled for secure destruction from backups.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
              <p>If third-party integrations (AI, storage, payment processing) are used, only the minimal required data is shared, and only under strict security controls.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Updates to This Policy</h2>
              <p>We may update this Privacy Policy to reflect changes in technology, security requirements, or legal standards. Updates will be posted on this page.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p>
                For questions, concerns, or data requests:{" "}
                <a href="mailto:glyphlock@gmail.com" className="text-cyan hover:text-ultraviolet transition font-semibold">
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