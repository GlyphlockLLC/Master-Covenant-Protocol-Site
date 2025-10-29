import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NUPSLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if user is authenticated
      const isAuthenticated = await base44.auth.isAuthenticated();
      
      if (isAuthenticated) {
        const user = await base44.auth.me();
        
        // Route based on role
        if (user.role === 'admin') {
          navigate('/nups-owner');
        } else {
          navigate('/nups-staff');
        }
      } else {
        // Redirect to login
        base44.auth.redirectToLogin('/nups-login');
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10" />
      
      <Card className="w-full max-w-md bg-gray-900 border-cyan-500/30 relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              N.U.P.S.
            </span>{" "}
            POS System
          </CardTitle>
          <p className="text-gray-400 mt-2">Nexus Universal Point-of-Sale</p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@glyphlock.com"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Staff Access:</span>
                <span className="text-cyan-400">Basic Operations</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Manager Access:</span>
                <span className="text-blue-400">Reports & Inventory</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Owner Access:</span>
                <span className="text-purple-400">Full Administration</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}