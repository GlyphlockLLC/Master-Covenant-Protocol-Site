import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorStego() {
  return (
    <>
      <SEOHead 
        title="Steganography Art | GlyphLock QR Studio"
        description="Embed QR codes invisibly into images using advanced steganography. Create disguised QR codes that blend seamlessly into photographs."
        keywords="QR steganography, hidden QR code, invisible QR, disguised QR, stego art"
        url="/qr-generator/stego"
      />
      <QrStudio initialTab="stego" />
    </>
  );
}