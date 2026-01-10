/**
 * NUPS Role Router
 * ================
 * Routes authenticated users to their role-appropriate dashboard
 */

import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Crown, Briefcase, Mic, CheckCircle } from "lucide-react";

export default function NUPSRoute() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const routeByRole = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        
        if (!isAuth) {
          base44.auth.redirectToLogin(createPageUrl("NUPSRoute"));
          return;
        }

        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Determine destination based on role
        const role = (currentUser.role || "user").toLowerCase();
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
            destination = "NUPSDashboard";
        }

        // Brief delay to show user info
        setTimeout(() => {
          window.location.href = createPageUrl(destination);
        }, 1200);

      } catch (err) {
        console.error("Routing failed:", err);
        setError(err.message);
      }
    };

    routeByRole();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/80 border-red-500/30">
          <CardContent className="p-8 text-center">
            <p className="text-red-400">Authentication error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <p className="text-white text-xl font-medium">{user.full_name || user.email}</p>
              <Badge className={`${config.bg} ${config.color} mt-2`}>
                <RoleIcon className="w-4 h-4 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <GlyphLoader text="Loading your dashboard..." />;
}