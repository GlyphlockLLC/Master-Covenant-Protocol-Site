import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import DeveloperKeys from "@/components/dashboard/DeveloperKeys";
import SecurityOverview from "@/components/dashboard/SecurityOverview";
import GlyphLoader from "@/components/GlyphLoader";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Auth error:", error);
      base44.auth.redirectToLogin(window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GlyphLoader text="Loading Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#000000] flex overflow-hidden">
      <DashboardSidebar 
        selectedModel={selectedModel} 
        setSelectedModel={setSelectedModel}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000000] relative">
        {/* Dashboard Header */}
        <div className="glass-panel border-b border-[#00E4FF]/20 px-8 py-5 flex items-center justify-between z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-black text-white font-space tracking-tight">
              ADMIN <span className="text-[#00E4FF]">DASHBOARD</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
              {user?.email} • <span className="text-[#8C4BFF]">{user?.role}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">System Active</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {selectedModel?.id === 'api-keys' ? (
            <DeveloperKeys />
          ) : selectedModel?.id === 'security-overview' ? (
            <SecurityOverview />
          ) : (
            <DataTable selectedModel={selectedModel} />
          )}
        </div>
      </div>
    </div>
  );
}