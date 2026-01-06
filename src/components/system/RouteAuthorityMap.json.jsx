{
  "version": "OMEGA-1.0",
  "lastUpdated": "2026-01-06",
  "authority": "CANONICAL",
  
  "accessTiers": {
    "PUBLIC": { "level": 0, "description": "No authentication required" },
    "ENTERTAINER": { "level": 1, "description": "Contract-bound, shift-based access" },
    "STAFF": { "level": 2, "description": "Authenticated employee" },
    "MANAGER": { "level": 3, "description": "Supervisory access" },
    "ADMIN": { "level": 4, "description": "Full system access" }
  },

  "routes": {
    "PUBLIC_PAGES": [
      { "page": "Home", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "About", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "AboutCarlo", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Contact", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "FAQ", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Partners", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "DreamTeam", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Roadmap", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Services", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Solutions", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "CaseStudies", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "CaseStudyPerplexity", "auth": false, "tier": "PUBLIC", "nav": false, "index": true },
      { "page": "CaseStudyAIBinding", "auth": false, "tier": "PUBLIC", "nav": false, "index": true },
      { "page": "CaseStudyCovenantVictory", "auth": false, "tier": "PUBLIC", "nav": false, "index": true },
      { "page": "CaseStudyTruthStrike", "auth": false, "tier": "PUBLIC", "nav": false, "index": true },
      { "page": "Privacy", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Terms", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Cookies", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Accessibility", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "TrustSecurity", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "NISTChallenge", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "MasterCovenant", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "GovernanceHub", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "SDKDocs", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "SecurityDocs", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Consultation", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Sitemap", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "SitemapXml", "auth": false, "tier": "PUBLIC", "nav": true, "index": true },
      { "page": "Blockchain", "auth": false, "tier": "PUBLIC", "nav": false, "index": true }
    ],

    "AUTHENTICATED_PAGES": [
      { "page": "Qr", "auth": true, "tier": "PUBLIC", "nav": true, "index": true, "description": "QR Studio" },
      { "page": "ImageLab", "auth": true, "tier": "PUBLIC", "nav": true, "index": true, "description": "Image Lab" },
      { "page": "GlyphBot", "auth": true, "tier": "PUBLIC", "nav": true, "index": true, "description": "GlyphBot AI" },
      { "page": "VideoUpload", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "InteractiveImageStudio", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ViewInteractive", "auth": false, "tier": "PUBLIC", "nav": false, "index": false, "description": "Public viewer" },
      { "page": "CommandCenter", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "UserSettings", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "AccountSecurity", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "SecurityTools", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "Dashboard", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ProjectUpdates", "auth": true, "tier": "PUBLIC", "nav": true, "index": false },
      { "page": "BillingAndPayments", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ManageSubscription", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "DeveloperAPI", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "SiteAudit", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "PartnerPortal", "auth": true, "tier": "PUBLIC", "nav": false, "index": false }
    ],

    "NUPS_UNIFIED_SHELL": {
      "page": "NUPS",
      "auth": true,
      "tier": "ENTERTAINER",
      "nav": true,
      "index": false,
      "description": "SOLE operational interface for all venue operations",
      "embeddedModules": [
        "TimeClock",
        "Vouchers",
        "Contracts (Entertainer + VIP)",
        "POS",
        "Inventory",
        "VIP Members",
        "VIP Rooms",
        "Entertainers",
        "Products",
        "Reports (Z, Audit, AI)",
        "AI Insights",
        "Offline Help"
      ]
    },

    "NUPS_LEGACY_DEPRECATED": [
      { "page": "NUPSDashboard", "status": "DEPRECATED", "reason": "Superseded by NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSTimeClock", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSVoucherPrint", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSContractPrint", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSOfflineHelp", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSOwner", "status": "DEPRECATED", "reason": "Superseded by NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSStaff", "status": "DEPRECATED", "reason": "Superseded by NUPS.jsx", "action": "DO NOT USE" },
      { "page": "EntertainerCheckIn", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "VIPContract", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "VIPMemberProfile", "status": "DEPRECATED", "reason": "Embedded in NUPS.jsx", "action": "DO NOT USE" },
      { "page": "NUPSLogin", "status": "DEPRECATED", "reason": "Auth handled by Base44", "action": "DO NOT USE" }
    ],

    "ADMIN_ONLY_INTERNAL": [
      { "page": "Sie", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Site Intelligence Engine" },
      { "page": "SecurityOperationsCenter", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "SOC" },
      { "page": "SystemStatus", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "System Health" },
      { "page": "AuditTrail", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Audit Logs" },
      { "page": "EmergencyBackup", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Backup Tools" },
      { "page": "FullExport", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Full Export" },
      { "page": "IntegrationTests", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Integration Tests" },
      { "page": "ProviderConsole", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "LLM Provider Chain" },
      { "page": "ComplianceReport", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Compliance Reports" },
      { "page": "SiteBuilder", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Site Builder" },
      { "page": "SiteBuilderTest", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Site Builder Test" }
    ],

    "SYSTEM_UTILITY_NO_NAV": [
      { "page": "NotFound", "auth": false, "tier": "PUBLIC", "nav": false, "index": false, "description": "404 handler" },
      { "page": "PaymentSuccess", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "PaymentCancel", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ConsultationSuccess", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "Mobile", "auth": false, "tier": "PUBLIC", "nav": false, "index": false, "description": "Mobile test" },
      { "page": "GlyphLockPlayground", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Dev playground" },
      { "page": "HSSS", "auth": true, "tier": "ADMIN", "nav": false, "index": false, "description": "Internal" },
      { "page": "HotzoneMapper", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ImageGenerator", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "ContentGenerator", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "GlyphBotJunior", "auth": true, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "Robots", "auth": false, "tier": "PUBLIC", "nav": false, "index": false }
    ],

    "SITEMAP_ENDPOINTS": [
      { "page": "SitemapApp", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "SitemapDynamic", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "SitemapImages", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "SitemapInteractive", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "SitemapQr", "auth": false, "tier": "PUBLIC", "nav": false, "index": false },
      { "page": "sitemap-qr", "auth": false, "tier": "PUBLIC", "nav": false, "index": false }
    ]
  },

  "navigationConfig": {
    "publicNav": ["Home", "DreamTeam", "GlyphBot", "CommandCenter", "Consultation"],
    "footerModules": ["Qr", "ImageLab", "GlyphBot", "NUPS", "SecurityTools", "SDKDocs"],
    "adminOnlyPages": ["Sie", "SecurityOperationsCenter", "SystemStatus", "AuditTrail", "EmergencyBackup", "FullExport", "IntegrationTests", "ProviderConsole", "ComplianceReport"],
    "nupsOnlyPage": "NUPS",
    "deprecatedNupsPages": ["NUPSDashboard", "NUPSTimeClock", "NUPSVoucherPrint", "NUPSContractPrint", "NUPSOfflineHelp", "NUPSOwner", "NUPSStaff", "EntertainerCheckIn", "VIPContract", "VIPMemberProfile", "NUPSLogin"]
  },

  "errorSignals": {
    "STATUS_0_ABORTED": {
      "cause": "Network request cancelled or CORS blocked",
      "resolution": "Check backend function CORS headers and network connectivity"
    },
    "ROUTE_DOWN": {
      "cause": "Page component failed to load or threw runtime error",
      "resolution": "Check component imports and error boundaries"
    },
    "404": {
      "cause": "Route not registered or page file missing",
      "resolution": "Verify page exists in pages/ directory with correct export"
    },
    "SITEMAP_WARNING": {
      "cause": "Page not included in sitemap or marked noindex incorrectly",
      "resolution": "Update sitemap generator and SEOHead component"
    }
  }
}