/**
 * NUPS Entry Point
 * Redirects to NUPSLogin for authentication routing
 */

import React, { useEffect } from "react";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";

export default function NUPS() {
  useEffect(() => {
    window.location.href = createPageUrl("NUPSLogin");
  }, []);

  return <GlyphLoader text="Loading N.U.P.S..." />;
}