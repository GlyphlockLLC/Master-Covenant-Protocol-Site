import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import GlyphLoader from "@/components/GlyphLoader";
import ConsoleSidebar from "@/components/console/ConsoleSidebar";
import DashboardHome from "@/components/console/DashboardHome";
import APIKeyVault from "@/components/console/APIKeyVault";
import SDKDownloadCenter from "@/components/console/SDKDownloadCenter";
import AdminUserManagement from "@/components/console/AdminUserManagement";
import LogsPanel from "@/components/console/LogsPanel";
import EdgeFunctionExplorer from "@/components/console/EdgeFunctionExplorer";
import SecuritySettings from "@/components/console/SecuritySettings";
import APIReference from "@/components/console/APIReference";

export default function EnterpriseConsole() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("dashboard");

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate("/");
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <GlyphLoader text="Loading GlyphLock Console..." />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardHome user={user} />;
      case "api-keys":
        return <APIKeyVault user={user} />;
      case "sdk":
        return <SDKDownloadCenter />;
      case "users":
        return <AdminUserManagement user={user} />;
      case "logs":
        return <LogsPanel user={user} />;
      case "functions":
        return <EdgeFunctionExplorer />;
      case "security":
        return <SecuritySettings user={user} />;
      case "api-reference":
        return <APIReference />;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <>
      <SEOHead
        title="GlyphLock Enterprise Console - Secure API & Key Management"
        description="Manage API keys, monitor security, deploy edge functions, and control your GlyphLock enterprise infrastructure."
      />
      
      <div className="min-h-screen bg-black text-white flex">
        <ConsoleSidebar activeModule={activeModule} setActiveModule={setActiveModule} user={user} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderModule()}
          </div>
        </main>
      </div>
    </>
  );
}