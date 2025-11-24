/**
 * Sitemap Knowledge Base for AI Assistants
 * Provides context about GlyphLock's site structure and navigation
 */

export const SITEMAP_KNOWLEDGE = {
  platform: "GlyphLock Security",
  description: "Complete site navigation and structure information",
  
  mainSections: [
    {
      name: "QR Studio",
      path: "/qr-generator",
      description: "Advanced QR code generation with steganography, hot zones, anti-quishing protection, and tamper detection.",
      features: ["Secure QR generation", "90+ payload types", "Anti-quishing", "Steganography", "Hot zones", "Analytics"]
    },
    {
      name: "Image Lab",
      path: "/image-lab",
      description: "AI image generation and interactive hotspot editing with cryptographic verification.",
      features: ["AI image generation", "Interactive hotspots", "Cryptographic hashing", "Gallery management"]
    },
    {
      name: "FAQ",
      path: "/faq",
      description: "Comprehensive frequently asked questions about GlyphLock's platform, pricing, security tools, and support.",
      features: ["Searchable questions", "Categorized content", "Pricing information", "Technical support"]
    },
    {
      name: "Pricing",
      path: "/pricing",
      description: "Security subscription plans - Professional ($200/month) and Enterprise ($2,000/month).",
      features: ["Plan comparison", "Feature details", "Stripe checkout", "Cancel anytime"]
    },
    {
      name: "Master Covenant",
      path: "/master-covenant",
      description: "GlyphLock's comprehensive security framework and operational guidelines.",
      features: ["Security policies", "Governance framework", "Compliance standards"]
    }
  ],

  tools: [
    { name: "QR Generator", path: "/qr-generator", category: "Security" },
    { name: "Image Lab", path: "/image-lab", category: "AI Tools" },
    { name: "Steganography", path: "/steganography", category: "Security" },
    { name: "Blockchain Verification", path: "/blockchain", category: "Security" },
    { name: "GlyphBot Assistant", path: "/glyphbot", category: "AI Tools" },
    { name: "NUPS POS System", path: "/nups-login", category: "Services" }
  ],

  company: [
    { name: "About Us", path: "/about" },
    { name: "Dream Team", path: "/dream-team" },
    { name: "Partners", path: "/partners" },
    { name: "Roadmap", path: "/roadmap" },
    { name: "Contact", path: "/contact" }
  ],

  resources: [
    { name: "Documentation", path: "/security-docs" },
    { name: "FAQ", path: "/faq" },
    { name: "Sitemap", path: "/sitemap" },
    { name: "Consultation", path: "/consultation" },
    { name: "Command Center", path: "/command-center" }
  ],

  legal: [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" }
  ],

  sitemaps: {
    main: "/sitemap.xml",
    pages: "/sitemap-pages.xml",
    qr: "/sitemap-qr.xml",
    images: "/sitemap-images.xml",
    kb: "/sitemap-kb.xml",
    llmIndex: "/glyphlock-llm-index.json",
    robots: "/robots.txt"
  },

  commonQuestions: [
    {
      q: "Where can I find the QR code generator?",
      a: "Visit /qr-generator or navigate to Services > QR Studio in the main menu."
    },
    {
      q: "How do I access the Image Lab?",
      a: "Go to /image-lab or click Services > Image Lab. You need a Professional or Enterprise plan."
    },
    {
      q: "Where is the pricing information?",
      a: "Visit /pricing to see all subscription plans and features."
    },
    {
      q: "How do I view all available pages?",
      a: "Check out the Sitemap Command Center at /sitemap for a complete overview of all pages, XML sitemaps, and search engine integration."
    },
    {
      q: "What pages are available on GlyphLock?",
      a: "Main pages include: Home (/), QR Studio (/qr-generator), Image Lab (/image-lab), FAQ (/faq), Pricing (/pricing), About (/about), Contact (/contact), and more. See /sitemap for the complete list."
    }
  ],

  navigationTips: [
    "Use the main navigation menu at the top to access all major sections",
    "The footer contains links to company info, solutions, and resources",
    "The Sitemap page (/sitemap) provides a comprehensive overview of all available pages",
    "FAQ page (/faq) is searchable and categorized for easy information discovery",
    "Command Center (/command-center) is for authenticated enterprise users"
  ]
};

export default SITEMAP_KNOWLEDGE;