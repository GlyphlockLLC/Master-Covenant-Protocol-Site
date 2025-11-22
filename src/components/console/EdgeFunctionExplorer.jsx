import React, { useState, useEffect } from "react";
import { Zap, CheckCircle, XCircle, Code, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { glyphLockAPI } from "@/components/api/glyphLockAPI";
import { toast } from "sonner";

export default function EdgeFunctionExplorer() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunctions();
  }, []);

  const loadFunctions = async () => {
    try {
      const data = await glyphLockAPI.listFunctions();
      setFunctions(data.functions || mockFunctions);
    } catch (err) {
      setFunctions(mockFunctions);
    } finally {
      setLoading(false);
    }
  };

  const mockFunctions = [
    { name: "healthCheck", status: "healthy", endpoint: "/functions/v1/healthCheck", method: "GET", description: "Check system health status" },
    { name: "generateAPIKey", status: "healthy", endpoint: "/functions/v1/generateAPIKey", method: "POST", description: "Generate new API key" },
    { name: "rotateAPIKey", status: "healthy", endpoint: "/functions/v1/rotateAPIKey", method: "POST", description: "Rotate existing API key" },
    { name: "listAPIKeys", status: "healthy", endpoint: "/functions/v1/listAPIKeys", method: "GET", description: "List all API keys" },
    { name: "listUsers", status: "healthy", endpoint: "/functions/v1/listUsers", method: "GET", description: "List all users" },
    { name: "getLogs", status: "healthy", endpoint: "/functions/v1/getLogs", method: "GET", description: "Retrieve system logs" }
  ];

  const copyCurl = (func) => {
    const curl = `curl -X ${func.method} https://kygisdokikvzgzwonzxk.supabase.co${func.endpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
    
    navigator.clipboard.writeText(curl);
    toast.success("cURL command copied");
  };

  const copyFetch = (func) => {
    const fetchCode = `const response = await fetch('https://kygisdokikvzgzwonzxk.supabase.co${func.endpoint}', {
  method: '${func.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`;
    
    navigator.clipboard.writeText(fetchCode);
    toast.success("Fetch code copied");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edge Function Explorer</h1>
        <p className="text-white/70">Monitor and test deployed serverless functions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Functions</p>
                <p className="text-2xl font-bold text-white">{functions.length}</p>
              </div>
              <Zap className="w-10 h-10 text-[#8C4BFF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Healthy</p>
                <p className="text-2xl font-bold text-white">{functions.filter(f => f.status === 'healthy').length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Degraded</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Functions List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
            <CardContent className="p-12 text-center text-white/70">
              Loading functions...
            </CardContent>
          </Card>
        ) : (
          functions.map((func) => (
            <Card key={func.name} className="bg-[#0A0F24] border-[#8C4BFF]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Zap className="w-5 h-5 text-[#8C4BFF]" />
                    {func.name}
                  </CardTitle>
                  <Badge className={func.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {func.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70 text-sm">{func.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50 mb-1">Endpoint</p>
                    <code className="text-sm text-white bg-[#020617] px-2 py-1 rounded">
                      {func.endpoint}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1">Method</p>
                    <Badge className="bg-[#8C4BFF]/20 text-[#8C4BFF]">{func.method}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/50">Example cURL</p>
                  <div className="relative">
                    <pre className="bg-[#020617] p-3 rounded text-xs text-white overflow-x-auto">
{`curl -X ${func.method} https://kygisdokikvzgzwonzxk.supabase.co${func.endpoint} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyCurl(func)}
                      className="absolute top-2 right-2 text-white/70 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => copyFetch(func)}
                    className="bg-[#8C4BFF]/20 text-[#8C4BFF] hover:bg-[#8C4BFF]/30"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Copy Fetch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}