import React from "react";

export default function GlowButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        px-5 py-2 rounded-md 
        bg-black border border-ultraviolet 
        text-cyan-300 font-medium 
        shadow-[0_0_12px_rgba(127,0,255,0.6)]
        hover:bg-ultraviolet/20 hover:text-white
        transition
      "
    >
      {children}
    </button>
  );
}