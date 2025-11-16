import React from "react";
import { Loader2 } from "lucide-react";

export default function PageLoader({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="glass-royal p-8 rounded-2xl inline-block">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}