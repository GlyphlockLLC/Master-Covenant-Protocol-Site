import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataLoadError({ message = "Failed to load data", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="glass-card-dark p-8 rounded-2xl text-center max-w-md">
        <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">Error Loading Data</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}