import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GlyphLoader from "@/components/GlyphLoader";

export default function DreamTeam() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to About page where Dream Team is featured
    navigate(createPageUrl("About"), { replace: true });
  }, [navigate]);

  return <GlyphLoader text="Accessing Team Data..." />;
}