import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorSecurity() {
  return (
    <>
      <SEOHead 
        title="Security & Integrity | GlyphLock QR Studio"
        description="View security analysis and integrity verification for your QR codes. Check immutable hashes, risk scores, and anti-quishing protection status."
        keywords="QR security, anti-quishing, QR integrity, QR hash verification, secure QR"
        url="/qr-generator/security"
      />
      <QrStudio initialTab="security" />
    </>
  );
}