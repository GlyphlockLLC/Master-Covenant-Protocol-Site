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
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
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
            <Link to={createPageUrl("QRGenerator")}>QR Generator</Link>
            <Link to={createPageUrl("Blockchain")}>Blockchain Verification</Link>
            <Link to={createPageUrl("InteractiveImageStudio")}>Image Studio</Link>
            <Link to={createPageUrl("Steganography")}>Steganography</Link>
            <Link to={createPageUrl("HotzoneMapper")}>Hotzone Mapper</Link>
            <Link to={createPageUrl("NUPSLogin")}>NUPS POS</Link>
          </div>
        </div>

        <div>
          <h4 className="text-ultraviolet font-semibold mb-4">AI Tools</h4>
          <div className="footer-links flex flex-col gap-2">
            <Link to={createPageUrl("GlyphBot")}>GlyphBot AI</Link>
            <Link to={createPageUrl("ContentGenerator")}>Content Generator</Link>
            <Link to={createPageUrl("ImageGenerator")}>Image Generator</Link>
          </div>
        </div>

        <div>
          <h4 className="text-ultraviolet font-semibold mb-4">Resources</h4>
          <div className="footer-links flex flex-col gap-2">
            <Link to={createPageUrl("SecurityDocs")}>Documentation</Link>
            <Link to={createPageUrl("Roadmap")}>Roadmap</Link>
            <Link to={createPageUrl("Terms")}>Terms</Link>
            <Link to={createPageUrl("Privacy")}>Privacy</Link>
          </div>
        </div>
      </div>



      <div className="mt-10 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} GlyphLock Security LLC — All Rights Reserved
      </div>
    </footer>
  );
}