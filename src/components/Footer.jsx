import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield } from "lucide-react";

const certifications = [
  { name: "SOC 2", subtitle: "TYPE II" },
  { name: "GDPR", subtitle: "COMPLIANT" },
  { name: "ISO 27001", subtitle: "CERTIFIED" },
  { name: "PCI DSS", subtitle: "COMPLIANT" },
  { name: "HIPAA", subtitle: "COMPLIANT" }
];

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-ultraviolet/40 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
              alt="GlyphLock"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm text-gray-400">
            Quantum-resistant security. AI-native governance. Blockchain-backed verification.
          </p>
        </div>

        <div>
          <h4 className="text-ultraviolet font-semibold mb-4">Company</h4>
          <div className="footer-links flex flex-col gap-2">
            <Link to={createPageUrl("About")}>About</Link>
            <Link to={createPageUrl("DreamTeam")}>Dream Team</Link>
            <Link to={createPageUrl("Partners")}>Partners</Link>
            <Link to={createPageUrl("MasterCovenant")}>Master Covenant</Link>
          </div>
        </div>

        <div>
          <h4 className="text-ultraviolet font-semibold mb-4">Services</h4>
          <div className="footer-links flex flex-col gap-2">
            <Link to={createPageUrl("SecurityTools")}>Security Suite</Link>
            <Link to={createPageUrl("Blockchain")}>Blockchain Verification</Link>
            <Link to={createPageUrl("InteractiveImageStudio")}>Interactive Image Studio</Link>
            <Link to={createPageUrl("Consultation")}>Consulting</Link>
          </div>
        </div>

        <div>
          <h4 className="text-ultraviolet font-semibold mb-4">Developer</h4>
          <div className="footer-links flex flex-col gap-2">
            <Link to={createPageUrl("SecurityDocs")}>Security Docs</Link>
            <Link to={createPageUrl("Roadmap")}>Roadmap</Link>
            <Link to={createPageUrl("Terms")}>Terms</Link>
            <Link to={createPageUrl("Privacy")}>Privacy</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-7xl mx-auto px-6">
        <h4 className="text-center text-sm font-semibold mb-6 text-gray-400">
          Security & Compliance
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {certifications.map((cert, idx) => (
            <div key={idx} className="bg-neutral-950 border border-ultraviolet/30 rounded-lg p-4 w-24 h-24 flex flex-col items-center justify-center hover:border-ultraviolet/50 transition-all">
              <Shield className="w-8 h-8 text-ultraviolet mb-2" />
              <div className="text-xs font-bold text-white text-center leading-tight">{cert.name}</div>
              <div className="text-[10px] text-cyan-300 mt-1">{cert.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} GlyphLock Security LLC — All Rights Reserved
      </div>
    </footer>
  );
}