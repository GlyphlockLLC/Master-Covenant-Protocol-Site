// DEPRECATED: Use SecurityOperationsCenter page instead
// This file redirects to the consolidated SOC page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HotzoneMapper() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(createPageUrl("SecurityOperationsCenter"), { replace: true });
  }, []);
  
  return null;
}