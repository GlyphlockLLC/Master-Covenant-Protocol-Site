// DEPRECATED: Use VisualCryptography page instead
// This file redirects to the consolidated Visual Cryptography page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Steganography() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(createPageUrl("VisualCryptography"), { replace: true });
  }, []);
  
  return null;
}