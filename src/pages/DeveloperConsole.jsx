import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  Book, Shield, Key, Code, Webhook, 
  ChevronRight, Lock, Server, Terminal, 
  Download, Loader2, Globe, AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import DeveloperKeys from "@/components/dashboard/DeveloperKeys";
import { toast } from "sonner";

const SECTIONS = [
  { id: "api-keys", label: "API Key Management", icon: Key },
  { id: "quickstart", label: "Quickstart", icon: Terminal },
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "endpoints", label: "Core Endpoints", icon: Server },
  { id: "sdks", label: "SDKs & Libraries", icon: Code },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "security", label: "Security & Compliance", icon: Shield },
];

export default function DeveloperConsole() {
  const [activeSection, setActiveSection] = useState("api-keys");
  const [downloadingSdk, setDownloadingSdk] = useState(null);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownloadSdk = async (lang) => {
    try {
      setDownloadingSdk(lang);
      const response = await base44.functions.invoke("downloadSDK", { language: lang });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const { file_data, filename } = response.data;
      
      const binaryString = window.atob(file_data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      toast.error(`Failed to download ${lang} SDK`);
      console.error(error);
    } finally {
      setDownloadingSdk(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <SEOHead 
        title="GlyphLock Developer API Console" 
        description="Public, Secret, and Environment API Keys with rotating cryptographic GlyphHash, blockchain logs, and enterprise SDKs."
      />

      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-[#00E4FF]/20 bg-[#020617]/95 fixed h-full overflow-y-auto hidden lg:block z-20 backdrop-blur-xl">
        <div className="p-8 border-b border-[#00E4FF]/20">
          <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
              alt="GlyphLock"
              className="h-8 w-auto"
            />
            <div className="flex flex-col">
              <span className="font-black tracking-tight font-space text-lg text-white group-hover:text-[#00E4FF] transition-colors">GLYPHLOCK</span>
              <span className="text-[10px] text-[#00E4FF] uppercase tracking-widest font-bold">Developer</span>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id 
                  ? "bg-[#00E4FF]/10 text-[#00E4FF] border border-[#00E4FF]/30 shadow-[0_0_15px_rgba(0,228,255,0.1)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-[#00E4FF]/20">
          <div className="bg-[#00E4FF]/5 rounded-xl p-4 border border-[#00E4FF]/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#00E4FF] uppercase tracking-wider">System Status</h4>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <p className="text-xs text-gray-400">All Systems Operational</p>
            <p className="text-[10px] text-gray-500 mt-1">Latency: 24ms</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen bg-black relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Bar */}
        <header className="h-20 border-b border-[#00E4FF]/20 bg-black/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 md:px-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-space text-white">CONSOLE</span>
            <ChevronRight className="w-4 h-4" />
            <Badge className="bg-[#00E4FF]/10 text-[#00E4FF] border-[#00E4FF]/30">v2.4.0</Badge>
          </div>
          <div className="flex items-center gap-4">
             <Link to={createPageUrl("SecurityDocs")}>
               <Button variant="ghost" size="sm" className="text-gray-400 hover:text-[#00E4FF] hover:bg-[#00E4FF]/10">
                  <Book className="w-4 h-4 mr-2" />
                  Documentation
               </Button>
             </Link>
             <Link to={createPageUrl("Consultation")}>
               <Button variant="outline" size="sm" className="border-[#00E4FF]/30 text-[#00E4FF] hover:bg-[#00E4FF]/10 hover:text-white">
                  Enterprise Support
               </Button>
             </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-8 md:p-12 space-y-24 relative z-10">

          {/* 1. API Key Management */}
          <section id="api-keys" className="scroll-mt-28">
            <DeveloperKeys />
          </section>

          {/* 2. Quickstart */}
          <section id="quickstart" className="scroll-mt-28 space-y-8">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Terminal className="w-8 h-8 text-[#00E4FF]" />
                Quickstart
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Initialize secure binding in under 2 minutes.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
                {[
                  { num: "01", title: "Install SDK", desc: "Use our zero-dependency lightweight client." },
                  { num: "02", title: "Export Keys", desc: "Set your GLX-SEC and GLX-PUB variables." },
                  { num: "03", title: "Bind Assets", desc: "Call .bind() to secure data instantly." }
                ].map((step, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E4FF]/30 transition-all group">
                    <div className="text-4xl font-black text-[#00E4FF]/20 group-hover:text-[#00E4FF]/40 mb-4 font-space transition-colors">{step.num}</div>
                    <h3 className="font-bold text-white mb-2 text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
            </div>

            <div className="bg-[#0A0F24] rounded-xl border border-[#00E4FF]/20 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#020617] border-b border-white/10">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">terminal</span>
                </div>
                <div className="p-6 font-mono text-sm text-gray-300 space-y-4">
                    <div className="flex gap-3">
                      <span className="text-[#00E4FF] select-none">$</span>
                      <p>npm install @glyphlock/sdk</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#00E4FF] select-none">$</span>
                      <p>export GLX_SECRET_KEY="GLX-SEC-..."</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#00E4FF] select-none">$</span>
                      <p>node app.js</p>
                    </div>
                    <div className="pt-2 text-green-400 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      ✓ GlyphLock Secure Tunnel Established (24ms)
                    </div>
                </div>
            </div>
          </section>

          {/* 3. Authentication */}
          <section id="authentication" className="scroll-mt-28 space-y-8">
             <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Lock className="w-8 h-8 text-[#8C4BFF]" />
                Authentication
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Dual-layer cryptographic verification.</p>
            </div>
            
            <div className="bg-[#8C4BFF]/5 border border-[#8C4BFF]/20 p-6 rounded-xl">
                <p className="text-gray-300 leading-relaxed">
                    Use <code className="mx-1 px-2 py-0.5 bg-[#8C4BFF]/20 rounded text-[#8C4BFF] border border-[#8C4BFF]/30">GLX-PUB</code> for client-side operations. 
                    Use <code className="mx-1 px-2 py-0.5 bg-[#00E4FF]/20 rounded text-[#00E4FF] border border-[#00E4FF]/30">GLX-SEC</code> for server-side logic. 
                    Requests without valid signatures return <code className="text-red-400">401 Unauthorized</code>.
                </p>
            </div>

            <Tabs defaultValue="js" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-lg">
                    <TabsTrigger value="js" className="data-[state=active]:bg-[#00E4FF] data-[state=active]:text-black">Node.js</TabsTrigger>
                    <TabsTrigger value="curl" className="data-[state=active]:bg-[#00E4FF] data-[state=active]:text-black">cURL</TabsTrigger>
                    <TabsTrigger value="python" className="data-[state=active]:bg-[#00E4FF] data-[state=active]:text-black">Python</TabsTrigger>
                </TabsList>
                <div className="mt-4 bg-[#0A0F24] rounded-xl border border-white/10 p-6 font-mono text-sm text-gray-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <Badge variant="outline" className="border-white/20 text-white/50 text-[10px]">READ-ONLY</Badge>
                  </div>
                  <TabsContent value="js" className="mt-0">
<pre>{`import { GlyphClient } from '@glyphlock/sdk';

const client = new GlyphClient({
  secretKey: process.env.GLX_SECRET_KEY
});

const status = await client.auth.verify();
console.log(status); // { active: true, environment: 'live' }`}</pre>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-0">
<pre>{`curl -X GET https://api.glyphlock.io/v1/auth/verify \\
  -H "Authorization: Bearer GLX-SEC-LIVE-..." \\
  -H "Content-Type: application/json"`}</pre>
                  </TabsContent>
                  <TabsContent value="python" className="mt-0">
<pre>{`from glyphlock import GlyphClient

client = GlyphClient(secret_key="GLX-SEC-...")
status = client.auth.verify()
print(status)`}</pre>
                  </TabsContent>
                </div>
            </Tabs>
          </section>

          {/* 4. Endpoints */}
          <section id="endpoints" className="scroll-mt-28 space-y-8">
             <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Server className="w-8 h-8 text-green-400" />
                Core Endpoints
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Direct REST API access.</p>
            </div>

            <div className="space-y-4">
                {[
                    { method: "POST", path: "/v1/glyph/bind", desc: "Bind data to a secure glyph hash" },
                    { method: "GET", path: "/v1/glyph/{id}", desc: "Retrieve verified glyph data" },
                    { method: "POST", path: "/v1/hotzone/scan", desc: "Initiate a security scan" },
                    { method: "POST", path: "/v1/steganography/embed", desc: "Embed hidden data into media" },
                ].map((ep, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E4FF]/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <Badge className={`
                                ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : ''}
                                ${ep.method === 'POST' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                                text-xs font-bold px-3 py-1
                            `}>{ep.method}</Badge>
                            <code className="text-sm text-white font-mono group-hover:text-[#00E4FF] transition-colors">{ep.path}</code>
                        </div>
                        <span className="text-sm text-gray-500">{ep.desc}</span>
                    </div>
                ))}
            </div>
          </section>

           {/* 5. SDKs */}
           <section id="sdks" className="scroll-mt-28 space-y-8">
             <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Code className="w-8 h-8 text-yellow-400" />
                SDKs & Libraries
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Native support for your stack.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Node.js', cmd: 'npm i @glyphlock/sdk' },
                  { name: 'Python', cmd: 'pip install glyphlock' },
                  { name: 'Go', cmd: 'go get glyphlock' },
                  { name: 'Java', cmd: 'mvn install glyphlock' },
                  { name: '.NET', cmd: 'dotnet add package GlyphLock' },
                  { name: 'Ruby', cmd: 'gem install glyphlock' },
                  { name: 'PHP', cmd: 'composer require glyphlock/sdk' },
                  { name: 'Rust', cmd: 'cargo add glyphlock' }
                ].map((sdk) => (
                    <div 
                      key={sdk.name} 
                      onClick={() => handleDownloadSdk(sdk.name)}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E4FF]/50 hover:bg-[#00E4FF]/5 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white group-hover:text-[#00E4FF] transition-colors">{sdk.name}</h4>
                          {downloadingSdk === sdk.name ? (
                            <Loader2 className="w-4 h-4 text-[#00E4FF] animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 text-gray-600 group-hover:text-[#00E4FF] transition-colors" />
                          )}
                        </div>
                        <code className="text-[10px] bg-black/50 px-2 py-1 rounded text-gray-400 font-mono mb-3 block w-fit group-hover:text-[#00E4FF] transition-colors border border-white/5">
                          {sdk.cmd}
                        </code>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Stable</p>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* 6. Webhooks */}
          <section id="webhooks" className="scroll-mt-28 space-y-8">
             <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Webhook className="w-8 h-8 text-pink-400" />
                Webhooks
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Real-time event streams.</p>
            </div>

            <div className="glass-card rounded-xl border border-[#00E4FF]/20 p-8 bg-[#00E4FF]/5">
                <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Event Types</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-white/5">
                      <div className="w-2 h-2 bg-[#00E4FF] rounded-full" /> 
                      <span className="font-mono text-[#00E4FF]">glyph.created</span>
                      <span className="text-gray-500 ml-auto text-xs">New glyph generated</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-white/5">
                      <div className="w-2 h-2 bg-red-500 rounded-full" /> 
                      <span className="font-mono text-red-400">security.breach</span>
                      <span className="text-gray-500 ml-auto text-xs">Threat detected</span>
                    </li>
                    <li className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-white/5">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" /> 
                      <span className="font-mono text-yellow-400">hotzone.alert</span>
                      <span className="text-gray-500 ml-auto text-xs">Geo-fence trigger</span>
                    </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-[#00E4FF]/20">
                    <Button variant="outline" className="border-[#00E4FF]/30 text-[#00E4FF] hover:bg-[#00E4FF] hover:text-black">Configure Webhooks</Button>
                </div>
            </div>
          </section>

          {/* 7. Security */}
          <section id="security" className="scroll-mt-28 space-y-8 pb-24">
             <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-space">
                <Shield className="w-8 h-8 text-red-500" />
                Security Standards
              </h2>
              <p className="text-gray-400 mt-2 text-lg">Enterprise compliance & encryption.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <Shield className="w-10 h-10 text-green-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">SOC 2 Type II</h3>
                    <p className="text-gray-400 leading-relaxed">
                      GlyphLock adheres to strict SOC 2 Type II standards for security, availability, and confidentiality protocols.
                    </p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    <Lock className="w-10 h-10 text-[#8C4BFF] mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3">AES-256-GCM</h3>
                    <p className="text-gray-400 leading-relaxed">
                      End-to-end encryption for all data in transit (TLS 1.3) and at rest. Your keys are never stored in plaintext.
                    </p>
                </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}