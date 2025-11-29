/**
 * Dynamic Sitemap - Dynamic/authenticated routes for GlyphLock.io
 * Serves at: https://glyphlock.io/sitemap-dynamic.xml
 * Note: These pages require authentication but are still indexable
 */

const SITE_URL = 'https://glyphlock.io';

const ROUTES = [
  { path: '/glyphbot', priority: 0.9, changefreq: 'daily' },
  { path: '/glyphbot-junior', priority: 0.75, changefreq: 'weekly' },
  { path: '/security-operations-center', priority: 0.8, changefreq: 'weekly' },
  { path: '/governance-hub', priority: 0.6, changefreq: 'monthly' }
  // Note: /dashboard and /command-center are blocked in robots.txt
];

Deno.serve(async (req) => {
  const lastmod = new Date().toISOString();
  
  const urls = ROUTES.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- GlyphLock.io Dynamic Sitemap -->
  <!-- Generated: ${lastmod} -->
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
});