import React from "react";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QrGeneratorAnalytics() {
  return (
    <>
      <SEOHead 
        title="Analytics Dashboard | GlyphLock QR Studio"
        description="Track QR code scans, geographic data, device information, and interaction analytics. Monitor your QR code performance in real-time."
        keywords="QR analytics, QR tracking, scan statistics, QR metrics, QR dashboard"
        url="/qr-generator/analytics"
      />
      <QrStudio initialTab="analytics" />
    </>
  );
}