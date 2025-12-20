import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Play, CheckCircle2, AlertCircle } from "lucide-react";
import RoyalLoader from "@/components/shared/RoyalLoader";

export default function SiteAudit() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [lastScan, setLastScan] = useState(null);

  const runScan = async () => {
    setScanning(true);
    try {
      const response = await base44.functions.invoke("siePhase1Scan", {});
      setScanResult(response.data);
      setLastScan(new Date());
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setScanning(false);
    }
  };

  const handleExport = () => {
    if (!scanResult) return;
    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SIE_Phase1_Scan_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (scanning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <RoyalLoader text="SIE PHASE 1: OBSERVATION IN PROGRESS" />
        <p className="mt-4 text-xs font-mono text-slate-500">ENUMERATING ROUTES... AUDITING COMPONENTS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">SIE Phase 1: Observation Layer</h1>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${scanResult ? "bg-green-500" : "bg-slate-700"}`} />
              STATUS: {scanResult ? "ACTIVE" : "IDLE"}
            </span>
            {lastScan && <span>LAST SUCCESS: {lastScan.toISOString()}</span>}
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button 
            onClick={runScan} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none border border-indigo-400/30 uppercase tracking-widest text-xs h-10 px-6"
          >
            <Play className="w-3 h-3 mr-2" /> Run Scan
          </Button>
          <Button 
            onClick={handleExport}
            disabled={!scanResult}
            variant="outline"
            className="border-white/20 hover:bg-white/5 text-white rounded-none uppercase tracking-widest text-xs h-10 px-6"
          >
            <Download className="w-3 h-3 mr-2" /> Export JSON
          </Button>
        </div>
      </div>

      {!scanResult ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
          <p className="text-slate-500 text-sm">NO ARTIFACTS GENERATED. INITIATE SCAN.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* 1. System Route Map */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">1. System Route Map</h2>
            <div className="border border-white/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Path</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Type</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Auth</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Role</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.routes.map((route, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-indigo-300">{route.path}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{route.route_type}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{route.auth_required ? "YES" : "NO"}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{route.role}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400 text-right">{route.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* 2. Page Inventory */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">2. Page Inventory</h2>
            <div className="border border-white/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Page Name</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Route Binding</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase text-right">Error State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.pages.map((page, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-white">{page.page_name}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{page.route_binding}</TableCell>
                      <TableCell className="font-mono text-xs text-right">
                        {page.error_state ? <span className="text-red-500">DETECTED</span> : <span className="text-green-500/50">NONE</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* 3. Component Usage Map */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">3. Component Usage Map</h2>
            <div className="border border-white/10 rounded-none overflow-hidden max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-white/5 sticky top-0">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Component</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Usage Count</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.components.sort((a,b) => b.usage_count - a.usage_count).map((comp, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-white truncate max-w-[300px]" title={comp.component_name}>
                        {comp.component_name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{comp.usage_count}</TableCell>
                      <TableCell className="font-mono text-xs text-right">
                        {comp.orphaned ? 
                          <span className="bg-red-900/20 text-red-500 px-2 py-0.5 rounded text-[10px]">ORPHANED</span> : 
                          <span className="text-slate-600">ACTIVE</span>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* 4. Feature Presence Matrix */}
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">4. Feature Presence Matrix</h2>
            <div className="border border-white/10 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Feature</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase">Implementation</TableHead>
                    <TableHead className="text-white font-bold h-10 text-xs uppercase text-right">Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.features.map((feat, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-white">{feat.feature_name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {feat.implemented === 'full' && <span className="text-green-400">FULL</span>}
                        {feat.implemented === 'partial' && <span className="text-amber-400">PARTIAL</span>}
                        {feat.implemented === 'none' && <span className="text-red-400">NONE</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-400">
                        {feat.used ? "YES" : "NO"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}