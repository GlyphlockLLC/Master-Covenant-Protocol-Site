
/**
 * SINGLE SOURCE OF TRUTH - Navigation Links
 * Used by Navbar and Footer to prevent drift
 */

export const NAV_SECTIONS = [
  {
    label: "Company",
    items: [
      { label: "About", page: "About" },
      { label: "Dream Team", page: "DreamTeam" },
      { label: "Partners", page: "Partners" },
      { label: "Master Covenant", page: "MasterCovenant" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "QR Studio", page: "QRGenerator" },
      { label: "Image Lab", page: "ImageLab" },
      { label: "Blockchain Verification", page: "Blockchain" },
      { label: "Steganography", page: "Steganography" },
      { label: "NUPS POS System", page: "NUPSLogin" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { label: "GlyphBot Assistant", page: "GlyphBot" },
      { label: "Content Generator", page: "ContentGenerator" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Command Center", page: "CommandCenter" },
      { label: "Documentation", page: "SecurityDocs" },
      { label: "Roadmap", page: "Roadmap" },
      { label: "FAQ", page: "FAQ" },
      { label: "Sitemap", page: "Sitemap" },
    ],
  },
];

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", page: "About" },
    { label: "Partners", page: "Partners" },
    { label: "Governance", page: "MasterCovenant" },
    { label: "Contact", page: "Contact" },
  ],
  solutions: [
    { label: "QR Studio", page: "QRGenerator" },
    { label: "Image Lab", page: "ImageLab" },
    { label: "Blockchain", page: "Blockchain" },
    { label: "Steganography", page: "Steganography" },
    { label: "NUPS POS", page: "NUPSLogin" },
  ],
  resources: [
    { label: "Documentation", page: "SecurityDocs" },
    { label: "Command Center", page: "CommandCenter" },
    { label: "Roadmap", page: "Roadmap" },
    { label: "FAQ", page: "FAQ" },
    { label: "Sitemap", page: "Sitemap" },
    { label: "Pricing", page: "Pricing" },
  ],
  legal: [
    { label: "Terms of Service", page: "Terms" },
    { label: "Privacy Policy", page: "Privacy" },
    { label: "Cookies", page: "Cookies" },
  ],
};

export default { NAV_SECTIONS, FOOTER_LINKS };
