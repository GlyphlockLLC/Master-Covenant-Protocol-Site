import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorBulk() {
  return (
    <>
      <SEOHead 
        title="Bulk Generation | GlyphLock QR Studio"
        description="Generate multiple QR codes at once with batch upload. Upload CSV files or paste multiple payloads for mass QR code generation."
        keywords="bulk QR generation, batch QR codes, mass QR, CSV QR upload"
        url="/qr-generator/bulk"
      />
      <QrStudio initialTab="bulk" />
    </>
  );
}