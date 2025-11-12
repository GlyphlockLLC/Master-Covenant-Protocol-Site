import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, Search, Shield, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-600/10 to-black" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Looks like this page has been quantum-encrypted and hidden from reality. 
            Even our AI couldn't locate it!
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="text-left">
              <h3 className="font-bold text-white mb-2">Security Notice</h3>
              <p className="text-sm text-gray-400">
                If you believe you've reached this page in error or suspect a security issue, 
                please contact our security team immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Home")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to={createPageUrl("Contact")}>
            <Button size="lg" variant="outline" className="border-red-500/50 hover:bg-red-500/10 text-white">
              <Search className="w-5 h-5 mr-2" />
              Report Issue
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Error Code: 404 | Page Not Found</p>
          <p className="mt-1">Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}