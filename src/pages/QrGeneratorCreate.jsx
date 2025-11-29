import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorCreate() {
  return (
    <>
      <SEOHead 
        title="Create QR Code | GlyphLock QR Studio"
        description="Create secure QR codes with GlyphLock's QR Studio. Configure payload type, dynamic mode, and generate military-grade encrypted QR codes."
        keywords="create QR code, QR generator, secure QR, GlyphLock"
        url="/qr-generator/create"
      />
      <QrStudio initialTab="create" />
    </>
  );
}