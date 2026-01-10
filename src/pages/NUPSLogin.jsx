/**
 * NUPS 2.0 - Authentication Gateway
 * =====================================
 * Routes authenticated users to role-appropriate dashboards
 * Uses Base44 authentication (not localStorage)
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Crown, Briefcase, Mic, LogIn, Loader2, 
  CheckCircle, AlertCircle, Lock
} from "lucide-react";

export default function NUPSLogin() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndRoute();
  }, []);

  const checkAuthAndRoute = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      
      if (!isAuth) {
        // Not authenticated - show login prompt
        setLoading(false);
        return;
      }

      // Get current user
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Route based on role
      const role = (currentUser.role || "user").toLowerCase();
      
      // Determine destination based on role
      let destination;
      switch (role) {
        case "admin":
          destination = "NUPSDashboard";
          break;
        case "manager":
          destination = "NUPSOwner";
          break;
        case "staff":
          destination = "NUPSStaff";
          break;
        case "entertainer":
          destination = "NUPSTimeClock";
          break;
        default:
          // Default to dashboard for unknown roles
          destination = "NUPSDashboard";
      }

      // Small delay to show user info before redirect
      setTimeout(() => {
        window.location.href = createPageUrl(destination);
      }, 1500);

    } catch (err) {
      console.error("Auth check failed:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl("NUPSLogin"));
  };

  // Loading state - checking authentication
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-900/80 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg">Checking authentication...</p>
            <p className="text-slate-400 text-sm mt-2">Please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - showing user info and routing
  if (user) {
    const role = (user.role || "user").toLowerCase();
    const roleConfig = {
      admin: { icon: Crown, color: "text-amber-400", bg: "bg-amber-500/20", label: "Administrator" },
      manager: { icon: Shield, color: "text-purple-400", bg: "bg-purple-500/20", label: "Manager" },
      staff: { icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-500/20", label: "Staff" },
      entertainer: { icon: Mic, color: "text-pink-400", bg: "bg-pink-500/20", label: "Entertainer" },
      user: { icon: Shield, color: "text-slate-400", bg: "bg-slate-500/20", label: "User" }
    };
    const config = roleConfig[role] || roleConfig.user;
    const RoleIcon = config.icon;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/80 border-green-500/30">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div>
              <p className="text-white text-lg font-medium">{user.full_name || user.email}</p>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>

            <div className="flex justify-center">
              <Badge className={`${config.bg} ${config.color} px-4 py-2 text-sm`}>
                <RoleIcon className="w-4 h-4 mr-2" />
                {config.label}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecting to your dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/50">
              <Shield className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-white text-3xl font-bold">N.U.P.S.</CardTitle>
          <p className="text-slate-400 mt-2">Nexus Universal Point-of-Sale</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to N.U.P.S.
            </Button>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-500 text-xs text-center">
              <Lock className="w-3 h-3 inline mr-1" />
              Secure authentication powered by GlyphLock
            </p>
          </div>

          {/* Role Information */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <RoleCard icon={Crown} label="Admin" color="amber" />
            <RoleCard icon={Shield} label="Manager" color="purple" />
            <RoleCard icon={Briefcase} label="Staff" color="cyan" />
            <RoleCard icon={Mic} label="Entertainer" color="pink" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleCard({ icon: Icon, label, color }) {
  const colorClasses = {
    amber: "text-amber-400/60 border-amber-500/20",
    purple: "text-purple-400/60 border-purple-500/20",
    cyan: "text-cyan-400/60 border-cyan-500/20",
    pink: "text-pink-400/60 border-pink-500/20"
  };
  
  return (
    <div className={`flex items-center gap-2 p-2 rounded border ${colorClasses[color]} bg-slate-800/30`}>
      <Icon className={`w-4 h-4 ${colorClasses[color].split(" ")[0]}`} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}