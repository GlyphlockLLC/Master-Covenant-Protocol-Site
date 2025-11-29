import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorHotzones() {
  return (
    <>
      <SEOHead 
        title="Hot Zones Editor | GlyphLock QR Studio"
        description="Add interactive hot zones to your QR codes. Create clickable regions with custom actions like URLs, audio, modals, and agent invocations."
        keywords="QR hot zones, interactive QR, clickable QR regions, QR actions"
        url="/qr-generator/hotzones"
      />
      <QrStudio initialTab="hotzones" />
    </>
  );
}