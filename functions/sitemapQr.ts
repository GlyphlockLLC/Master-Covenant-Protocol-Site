/**
 * QR Sitemap XML Generator
 * Serves sitemap-qr.xml for QR Generator pages
 * REAL SUBROUTES - No hash fragments
 * Accessible at: https://glyphlock.io/sitemap-qr.xml
 */

const SITE_URL = 'https://glyphlock.io';

// Real subroutes - NOT hash fragments
const ROUTES = [
  { path: '/qr-generator', priority: 1.0, changefreq: 'daily', title: 'QR Studio - Main' },
  { path: '/qr-generator/create', priority: 0.95, changefreq: 'daily', title: 'QR Studio - Create' },
  { path: '/qr-generator/preview', priority: 0.85, changefreq: 'daily', title: 'QR Studio - Preview' },
  { path: '/qr-generator/customize', priority: 0.85, changefreq: 'daily', title: 'QR Studio - Customize' },
  { path: '/qr-generator/hotzones', priority: 0.8, changefreq: 'weekly', title: 'QR Studio - Hot Zones' },
  { path: '/qr-generator/stego', priority: 0.8, changefreq: 'weekly', title: 'QR Studio - Steganography' },
  { path: '/qr-generator/security', priority: 0.9, changefreq: 'daily', title: 'QR Studio - Security' },
  { path: '/qr-generator/analytics', priority: 0.75, changefreq: 'daily', title: 'QR Studio - Analytics' },
  { path: '/qr-generator/bulk', priority: 0.75, changefreq: 'weekly', title: 'QR Studio - Bulk Upload' }
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
  <!-- GlyphLock QR Generator Sitemap -->
  <!-- Real subroutes - no hash fragments -->
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