import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, QrCode, Image, AppWindow, Layers, Zap } from 'lucide-react';

export default function SitemapXml() {
  const sitemaps = [
    { title: "QR Generator", path: "sitemap-qr", icon: QrCode, desc: "QR Studio, creation, and analytics pages" },
    { title: "App Pages", path: "SitemapApp", icon: AppWindow, desc: "Dashboard, login, and core app routes" },
    { title: "Images & Media", path: "SitemapImages", icon: Image, desc: "Image processing and media hub resources" },
    { title: "Interactive", path: "SitemapInteractive", icon: Layers, desc: "Interactive tools and components" },
    { title: "Dynamic Content", path: "SitemapDynamic", icon: Zap, desc: "Dynamically generated content pages" },
  ];

  const generalPages = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/About" },
    { label: "Contact", path: "/Contact" },
    { label: "Dream Team", path: "/DreamTeam" },
    { label: "GlyphBot", path: "/GlyphBot" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Site Map Index</h1>
          <p className="text-slate-400">Central directory of all site resources and modules.</p>
        </div>

        {/* Module Sitemaps Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Module Sitemaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sitemaps.map((map) => (
              <Link key={map.path} to={createPageUrl(map.path)}>
                <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all h-full group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-cyan-400 flex items-center gap-3">
                      <map.icon className="w-5 h-5" />
                      {map.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 mb-4">{map.desc}</p>
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider group-hover:underline">
                      View Sitemap →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* General Pages List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            General Pages
          </h2>
          <Card className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generalPages.map((page) => (
                  <Link 
                    key={page.path} 
                    to={page.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded hover:bg-white/5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {page.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <a 
                  href="/api/apps/functions/sitemapXml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" />
                  View Raw XML (General)
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}