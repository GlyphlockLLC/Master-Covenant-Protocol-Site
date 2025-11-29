/**
 * robots.txt endpoint
 * Serves the robots.txt file for search engine crawlers
 */

const SITE_URL = 'https://glyphlock.io';

Deno.serve(async (req) => {
  const robotsContent = `# GlyphLock Security LLC - robots.txt
# https://glyphlock.io

User-agent: *
Allow: /

# Public QR Generator
Allow: /qr-generator
Allow: /qr-generator/*

# Block admin/private areas
Disallow: /dashboard
Disallow: /command-center
Disallow: /nups-staff
Disallow: /nups-owner
Disallow: /api/
Disallow: /functions/

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-qr.xml
Sitemap: ${SITE_URL}/sitemap-app.xml
Sitemap: ${SITE_URL}/sitemap-images.xml
Sitemap: ${SITE_URL}/sitemap-interactive.xml
Sitemap: ${SITE_URL}/sitemap-dynamic.xml

# Crawl-delay for politeness
Crawl-delay: 1
`;

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});