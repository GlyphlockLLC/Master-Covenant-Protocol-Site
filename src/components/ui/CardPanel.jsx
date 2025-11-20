import React from "react";

export function CardPanel({ children, className = "" }) {
  return (
    <div className={`
      bg-neutral-950 
      border border-ultraviolet/30 
      shadow-[0_0_10px_rgba(127,0,255,0.4)]
      rounded-lg p-6
      ${className}
    `}>
      {children}
    </div>
  );
}