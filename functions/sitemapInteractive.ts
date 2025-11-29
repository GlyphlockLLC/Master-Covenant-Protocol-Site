/**
 * Interactive Sitemap - Interactive Studio routes for GlyphLock.io
 * Serves at: https://glyphlock.io/sitemap-interactive.xml
 */

const SITE_URL = 'https://glyphlock.io';

const ROUTES = [
  { path: '/interactive-image-studio', priority: 1.0, changefreq: 'daily' },
  { path: '/interactive-image-studio#upload', priority: 0.8, changefreq: 'weekly' },
  { path: '/interactive-image-studio#editor', priority: 0.9, changefreq: 'daily' },
  { path: '/interactive-image-studio#verify', priority: 0.7, changefreq: 'weekly' }
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
  <!-- GlyphLock.io Interactive Sitemap -->
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