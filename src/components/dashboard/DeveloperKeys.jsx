import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, RefreshCw, Plus, Eye, EyeOff, Shield, Terminal, Globe, Lock, Server } from "lucide-react";
import GlyphLoader from "@/components/GlyphLoader";
import { toast } from "sonner";

export default function DeveloperKeys() {
  const [showSecret, setShowSecret] = useState({});
  const [copied, setCopied] = useState(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [environment, setEnvironment] = useState("live");
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => base44.entities.APIKey.list({ sort: { created_date: -1 } })
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke("generateAPIKey", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsCreating(false);
      setNewKeyName("");
      toast.success("Keys generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate Keys");
    }
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const toggleSecret = (id) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    createKeyMutation.mutate({ name: newKeyName, environment });
  };

  if (isLoading) return <GlyphLoader text="Loading Developer Console..." />;

  return (
    <div className="p-8 bg-black min-h-full text-white space-y-8">
      <div className="flex justify-between items-end border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            GlyphLock Tri-Key System
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Manage your cryptographic access credentials. The Tri-Key System provides distinct layers for client-side access (Public), server-side operations (Secret), and environment verification (Env).
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Keys
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-gray-900/50 border-blue-500/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-white">Generate New Key Set</CardTitle>
            <CardDescription className="text-gray-400">Creates a full set of Public, Secret, and Environment keys.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateKey} className="flex gap-4 items-end">
              <div className="grid gap-2 flex-1">
                <Label>Key Name</Label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Payment Service Prod"
                  className="bg-black/50 border-blue-500/30 text-white placeholder:text-gray-600"
                />
              </div>
              <div className="grid gap-2 w-40">
                <Label>Environment</Label>
                <select 
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="h-10 bg-black/50 border border-blue-500/30 rounded-md text-white px-3"
                >
                  <option value="live">Live</option>
                  <option value="test">Test</option>
                </select>
              </div>
              <Button 
                type="submit" 
                disabled={createKeyMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {createKeyMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate Keys"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {keys.length === 0 ? (
          <Card className="bg-gray-900/30 border-dashed border-2 border-gray-700 p-12 flex flex-col items-center justify-center text-center">
            <Shield className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Access Keys Active</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Initialize your first Tri-Key set to start integrating with the GlyphLock secure ecosystem.
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              Initialize Keys
            </Button>
          </Card>
        ) : (
          keys.map((key) => (
            <Card key={key.id} className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">{key.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {key.environment.toUpperCase()}</span>
                        <span>•</span>
                        <span>Created: {new Date(key.created_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-mono">ID: {key.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        Tri-Key Active
                     </Badge>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Public Key Section */}
                  <div className="space-y-3 p-4 rounded-lg bg-blue-950/10 border border-blue-500/10">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-wider">PUBLIC KEY</span>
                    </div>
                    <p className="text-xs text-gray-500">Safe for client-side usage (browsers, mobile apps).</p>
                    <div className="relative">
                      <Input 
                        readOnly 
                        value={key.public_key} 
                        className="bg-black/60 border-blue-500/20 font-mono text-sm text-green-400 pr-10 h-11"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(key.public_key, `pk-${key.id}`)}
                        className="absolute right-1 top-1 hover:bg-blue-500/20 text-gray-400 hover:text-white h-9 w-9"
                      >
                        {copied === `pk-${key.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Secret Key Section */}
                  <div className="space-y-3 p-4 rounded-lg bg-purple-950/10 border border-purple-500/10">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-wider">SECRET KEY</span>
                    </div>
                    <p className="text-xs text-gray-500">Server-side only. Never expose this key to the public.</p>
                    <div className="relative">
                      <Input 
                        readOnly 
                        type={showSecret[key.id] ? "text" : "password"}
                        value={key.secret_key} 
                        className="bg-black/60 border-purple-500/20 font-mono text-sm text-purple-300 pr-20 h-11"
                      />
                      <div className="absolute right-1 top-1 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSecret(key.id)}
                          className="hover:bg-purple-500/20 text-gray-400 hover:text-white h-9 w-9"
                        >
                          {showSecret[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(key.secret_key, `sk-${key.id}`)}
                          className="hover:bg-purple-500/20 text-gray-400 hover:text-white h-9 w-9"
                        >
                          {copied === `sk-${key.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Environment Variables Section */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-300">
                       <Server className="w-4 h-4" />
                       <span className="text-sm font-bold tracking-wider">ENVIRONMENT VARIABLES</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`export GLX_PUBLIC_KEY="${key.public_key}"\nexport GLX_SECRET_KEY="${key.secret_key}"\nexport GLX_ENV_TAG="${key.environment}"\nexport GLX_DEVICE_SIG="${key.env_key || ''}"`, `env-${key.id}`)}
                      className="text-xs h-7 border-gray-700 hover:bg-gray-800"
                    >
                      {copied === `env-${key.id}` ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                      Copy Export Block
                    </Button>
                  </div>
                  
                  <div className="bg-black/80 rounded-lg p-4 border border-gray-800 font-mono text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex">
                        <span className="text-purple-400 w-40">GLX_PUBLIC_KEY</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-green-400 ml-2">"{key.public_key}"</span>
                      </div>
                      <div className="flex">
                        <span className="text-purple-400 w-40">GLX_SECRET_KEY</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-gray-400 ml-2">"{key.secret_key.substring(0, 20)}...{key.secret_key.slice(-4)}"</span>
                      </div>
                      <div className="flex">
                        <span className="text-purple-400 w-40">GLX_ENV_TAG</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-blue-400 ml-2">"{key.environment}"</span>
                      </div>
                      <div className="flex">
                        <span className="text-purple-400 w-40">GLX_DEVICE_SIG</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-yellow-400 ml-2">"{key.env_key}"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}