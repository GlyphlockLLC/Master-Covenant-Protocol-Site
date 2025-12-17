import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";

// Dashboard now redirects to unified Command Center
export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Command Center
    navigate(createPageUrl('CommandCenter'), { replace: true });
  }, [navigate]);

  return <GlyphLoader text="Redirecting to Command Center..." />;
}