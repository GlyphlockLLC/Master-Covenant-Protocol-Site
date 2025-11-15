import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading...", size = "default" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin mb-3`} />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}