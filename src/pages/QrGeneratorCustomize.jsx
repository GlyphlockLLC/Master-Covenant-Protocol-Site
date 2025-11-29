import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorCustomize() {
  return (
    <>
      <SEOHead 
        title="Customize QR Code | GlyphLock QR Studio"
        description="Customize your QR code appearance with art styles, color themes, logos, and error correction levels."
        keywords="customize QR code, QR design, QR styling, color QR, logo QR"
        url="/qr-generator/customize"
      />
      <QrStudio initialTab="customize" />
    </>
  );
}