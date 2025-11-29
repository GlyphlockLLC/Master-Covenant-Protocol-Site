import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import QrStudio from "@/components/qr/QrStudio";
import SEOHead from "@/components/SEOHead";

/**
 * PUBLIC QR Generator Page - Main Entry Point
 * Accessible without login - paywall removed for public access
 * Full QrStudio with all tabs
 * 
 * Subroutes available:
 * - /qr-generator/create
 * - /qr-generator/preview
 * - /qr-generator/customize
 * - /qr-generator/hotzones
 * - /qr-generator/stego
 * - /qr-generator/security
 * - /qr-generator/analytics
 * - /qr-generator/bulk
 */
export default function QrGenerator() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Add structured data for search engines
    const metaAI = document.createElement('meta');
    metaAI.name = 'ai-agent';
    metaAI.content = 'glyphlock qr studio knowledge base';
    document.head.appendChild(metaAI);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'qr-schema';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GlyphLock QR Studio",
      "description": "Advanced QR code generation with anti-quishing protection, steganography, hot zones, and blockchain security. Create secure QR codes with military-grade encryption.",
      "url": "https://glyphlock.io/qr-generator",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free tier available with premium features"
      },
      "featureList": [
        "QR Code Generation",
        "Anti-Quishing Protection",
        "Steganography Embedding",
        "Hot Zone Interactive Areas",
        "Risk Analysis",
        "Bulk Generation",
        "Analytics Dashboard"
      ],
      "provider": {
        "@type": "Organization",
        "name": "GlyphLock Security LLC"
      }
    });
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(metaAI)) document.head.removeChild(metaAI);
      const existingScript = document.getElementById('qr-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  // Handle legacy hash-based navigation - redirect to real subroutes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const validTabs = ['create', 'preview', 'customize', 'hotzones', 'stego', 'security', 'analytics', 'bulk'];
      if (validTabs.includes(hash)) {
        // Redirect hash to real subroute
        window.location.href = `/qr-generator/${hash}`;
      } else {
        // Invalid hash, stay on base
        window.history.replaceState(null, '', '/qr-generator');
      }
    }
  }, [location.hash]);

  return (
    <>
      <SEOHead 
        title="GlyphLock QR Studio | Secure QR Code Generator with Anti-Quishing Protection"
        description="Create secure QR codes with GlyphLock's advanced QR Studio. Features include anti-quishing protection, steganography embedding, hot zones, risk analysis, bulk generation, and military-grade encryption. Free tier available."
        keywords="QR code generator, secure QR codes, anti-quishing, steganography QR, QR security, hot zones QR, bulk QR generation, GlyphLock QR Studio"
        url="/qr-generator"
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white relative">
        {/* Cosmic Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/10 to-transparent pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />
        <div className="glyph-orb fixed top-20 right-20 opacity-20 pointer-events-none" style={{ animation: 'float-orb 8s ease-in-out infinite', background: 'radial-gradient(circle, rgba(6,182,212,0.3), rgba(59,130,246,0.2))' }}></div>
        <div className="glyph-orb fixed bottom-40 left-40 opacity-15 pointer-events-none" style={{ animation: 'float-orb 10s ease-in-out infinite', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(168,85,247,0.3), rgba(59,130,246,0.2))' }}></div>
        
        <div className="relative z-10 py-8">
          <QrStudio initialTab="create" />
        </div>
      </div>
    </>
  );
}