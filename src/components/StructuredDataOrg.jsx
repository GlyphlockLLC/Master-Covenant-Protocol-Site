// GLYPHLOCK: Enhanced structured data for organization
import { useEffect } from 'react';

export default function StructuredDataOrg() {
  useEffect(() => {
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GlyphLock Security LLC",
      "alternateName": "GlyphLock",
      "legalName": "GlyphLock Security LLC",
      "url": "https://glyphlock.io",
      "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png",
      "description": "Enterprise-grade quantum-resistant cybersecurity platform offering AI-powered threat detection, visual cryptography, blockchain security, and secure POS systems.",
      "foundingDate": "2025-01",
      "founders": [
        {
          "@type": "Person",
          "name": "Carlo Rene Earl",
          "jobTitle": "Founder & CEO"
        },
        {
          "@type": "Person",
          "name": "Collin Vanderginst",
          "jobTitle": "Chief Technology Officer"
        },
        {
          "@type": "Person",
          "name": "Jacub Lough",
          "jobTitle": "Chief Security Officer & Chief Financial Officer"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "El Mirage",
        "addressRegion": "AZ",
        "postalCode": "85335",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "33.6131",
        "longitude": "-112.3246"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-424-246-6499",
          "contactType": "customer service",
          "email": "glyphlock@gmail.com",
          "availableLanguage": ["en"],
          "areaServed": "Worldwide"
        },
        {
          "@type": "ContactPoint",
          "email": "carloearl@gmail.com",
          "contactType": "technical support"
        }
      ],
      "sameAs": [
        "https://instagram.com/glyphlock",
        "https://tiktok.com/@glyphlock",
        "https://twitter.com/glyphlock",
        "https://linkedin.com/company/glyphlock"
      ],
      "slogan": "Quantum-Grade Security for the AI Era",
      "areaServed": "Worldwide",
      "numberOfEmployees": "3",
      "knowsAbout": [
        "Quantum-resistant encryption",
        "Cybersecurity",
        "Artificial Intelligence Security",
        "Blockchain Security",
        "Visual Cryptography",
        "Threat Detection",
        "Data Protection",
        "Identity Verification",
        "Fraud Prevention",
        "Security Auditing",
        "POS Security",
        "QR Code Security"
      ]
    };

    let script = document.getElementById('org-schema-enhanced');
    if (!script) {
      script = document.createElement('script');
      script.id = 'org-schema-enhanced';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(orgSchema);
  }, []);

  return null;
}