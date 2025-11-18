import { useEffect } from "react";

export default function Sitemap() {
  useEffect(() => {
    const pages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/pricing", priority: "0.9", changefreq: "weekly" },
      { url: "/consultation", priority: "0.9", changefreq: "weekly" },
      { url: "/partners", priority: "0.8", changefreq: "weekly" },
      { url: "/governancehub", priority: "0.8", changefreq: "monthly" },
      { url: "/glyphbot", priority: "0.8", changefreq: "weekly" },
      { url: "/securitytools", priority: "0.7", changefreq: "weekly" },
      { url: "/qrgenerator", priority: "0.7", changefreq: "weekly" },
      { url: "/steganography", priority: "0.7", changefreq: "weekly" },
      { url: "/blockchain", priority: "0.7", changefreq: "weekly" },
      { url: "/hotzonemapper", priority: "0.7", changefreq: "weekly" },
      { url: "/hsss", priority: "0.7", changefreq: "weekly" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/roadmap", priority: "0.6", changefreq: "monthly" },
      { url: "/dreamteam", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
      { url: "/privacy", priority: "0.5", changefreq: "yearly" },
      { url: "/terms", priority: "0.5", changefreq: "yearly" },
      { url: "/securitydocs", priority: "0.5", changefreq: "monthly" }
    ];

    const baseUrl = window.location.origin;
    const currentDate = new Date().toISOString().split('T')[0];

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-blue-400 to-violet-600 bg-clip-text text-transparent">
            Sitemap Generated
          </span>
        </h1>
        
        <div className="glass-card-dark border-blue-500/30 p-8 rounded-xl">
          <p className="text-white/80 mb-4">
            Your sitemap.xml file has been downloaded. Upload this file to your website's root directory 
            to help search engines discover and index your pages.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-3">Next Steps:</h2>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              <li>Upload sitemap.xml to your root domain directory</li>
              <li>Submit sitemap URL to Google Search Console</li>
              <li>Submit to Bing Webmaster Tools</li>
              <li>Update robots.txt to reference sitemap location</li>
            </ol>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
            <p className="text-xs text-white/60">
              <strong className="text-violet-400">Sitemap URL:</strong> https://yourdomain.com/sitemap.xml
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            Sitemap follows XML Sitemap Protocol 0.9 standard
          </p>
        </div>
      </div>
    </div>
  );
}