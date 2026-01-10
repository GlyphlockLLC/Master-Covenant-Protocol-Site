/**
 * NUPS Entry Point
 * ================
 * Base44 Auth Gate - redirects to login if not authenticated
 * Then routes to role-appropriate dashboard
 */

import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";

export default function NUPS() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRoute = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        
        if (!isAuth) {
          // Not authenticated - redirect to Base44 login
          base44.auth.redirectToLogin(createPageUrl("NUPSRoute"));
          return;
        }

        // Authenticated - go to role router
        window.location.href = createPageUrl("NUPSRoute");
      } catch (err) {
        console.error("Auth check failed:", err);
        base44.auth.redirectToLogin(createPageUrl("NUPSRoute"));
      }
    };

    checkAuthAndRoute();
  }, []);

  return <GlyphLoader text="Authenticating NUPS access..." />;
}