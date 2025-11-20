import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/SEOHead";
import EditorTab from "@/components/studio/EditorTab";
import VerifyTab from "@/components/studio/VerifyTab";

export default function InteractiveImageStudio() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editor");
  const [verifyLogId, setVerifyLogId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        } else {
          await base44.auth.redirectToLogin();
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFinalizeSuccess = (logId) => {
    setVerifyLogId(logId);
    setActiveTab("verify");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <SEOHead
        title="Interactive Image Studio | GlyphLock Security"
        description="Create cryptographically secured interactive images with hotspots, hashing, and verification."
      />

      <div className="container mx-auto px-4">
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent blur-3xl -z-10"></div>
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-white">Interactive </span>
            <span className="text-white">Image </span>
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Studio</span>
          </h1>
          <p className="text-white/60 text-lg">Create secure, interactive, cryptographically verified images</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-royal border-cyan-500/30 mx-auto flex w-fit">
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-white"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger 
              value="verify" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-white"
            >
              Verify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <EditorTab user={user} onFinalizeSuccess={handleFinalizeSuccess} />
          </TabsContent>

          <TabsContent value="verify">
            <VerifyTab initialLogId={verifyLogId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}