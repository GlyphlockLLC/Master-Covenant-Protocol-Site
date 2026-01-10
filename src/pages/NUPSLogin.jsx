/**
 * NUPS Login Entry
 * ================
 * Redirects to main NUPS auth gate
 */

import React, { useEffect } from "react";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";

export default function NUPSLogin() {
  useEffect(() => {
    window.location.href = createPageUrl("NUPS");
  }, []);

  return <GlyphLoader text="Loading N.U.P.S..." />;
}