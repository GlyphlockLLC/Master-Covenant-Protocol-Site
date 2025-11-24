import React, { useEffect } from "react";
import PaywallGuard from "@/components/PaywallGuard";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

export default function QRGenerator() {
  useEffect(() => {
    const metaAI = document.createElement('meta');
    metaAI.name = 'ai-agent';
    metaAI.content = 'glyphlock qr studio knowledge base';
    document.head.appendChild(metaAI);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GlyphLock QR Studio",
      "description": "Advanced QR code generation with anti-quishing, steganography, hot zones, and blockchain security",
      "url": "https://glyphlock.io/qr-generator",
      "applicationCategory": "SecurityApplication"
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <PaywallGuard serviceName="QR Generator" requirePlan="professional">
      <SEOHead 
        title="GlyphLock QR Studio | Next-Gen QR Security"
        description="Advanced QR generation with stego art, hot zones, anti-quishing protection, and tamper detection."
        url="/qr-generator"
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white py-12 relative">
        {/* Cosmic Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
        <div className="glyph-orb fixed top-20 right-20 opacity-20" style={{ animation: 'float-orb 8s ease-in-out infinite', background: 'radial-gradient(circle, rgba(6,182,212,0.3), rgba(59,130,246,0.2))' }}></div>
        <div className="glyph-orb fixed bottom-40 left-40 opacity-15" style={{ animation: 'float-orb 10s ease-in-out infinite', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(168,85,247,0.3), rgba(59,130,246,0.2))' }}></div>
        
        <div className="relative z-10">
          <QrStudio />
        </div>
      </div>
    </PaywallGuard>
  );
}