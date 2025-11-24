import React from "react";
import GlyphBotJr from "@/components/GlyphBotJr";
import SEOHead from "@/components/SEOHead";

export default function GlyphBotJuniorPage() {
  return (
    <>
      <SEOHead
        title="GlyphBot Junior - Kid-Friendly AI Assistant"
        description="Meet GlyphBot Junior! A friendly, safe, and educational AI assistant designed for kids. Ask questions, learn new things, and have fun!"
        url="/glyphbot-junior"
      />
      <GlyphBotJr />
    </>
  );
}