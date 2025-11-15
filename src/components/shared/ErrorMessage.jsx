import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ error, retry }) {
  return (
    <Alert className="bg-red-500/10 border-red-500/30">
      <AlertTriangle className="h-4 w-4 text-red-400" />
      <AlertDescription className="text-white">
        <strong>Error:</strong> {error?.message || "Something went wrong"}
        {retry && (
          <button 
            onClick={retry} 
            className="ml-3 underline text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}