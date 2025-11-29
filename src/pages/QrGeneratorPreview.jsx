import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorPreview() {
  return (
    <>
      <SEOHead 
        title="Preview QR Code | GlyphLock QR Studio"
        description="Preview and download your generated QR codes. View safe, art, and steganographic versions of your QR code."
        keywords="preview QR code, download QR, QR viewer, GlyphLock"
        url="/qr-generator/preview"
      />
      <QrStudio initialTab="preview" />
    </>
  );
}