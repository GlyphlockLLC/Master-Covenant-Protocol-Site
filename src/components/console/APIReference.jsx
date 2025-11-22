import React, { useState } from "react";
import { Book, Code, Play, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const endpoints = [
  {
    name: "Health Check",
    method: "GET",
    endpoint: "/api/health",
    description: "Check system health and status",
    auth: false,
    request: null,
    response: { status: "healthy", timestamp: "2025-01-01T00:00:00Z" }
  },
  {
    name: "Generate API Key",
    method: "POST",
    endpoint: "/api/keys/generate",
    description: "Create a new API key",
    auth: true,
    request: { name: "My API Key", environment: "live" },
    response: { id: "key_123", public_key: "pk_...", secret_key: "sk_..." }
  },
  {
    name: "List API Keys",
    method: "GET",
    endpoint: "/api/keys",
    description: "Retrieve all API keys",
    auth: true,
    request: null,
    response: { keys: [{ id: "key_123", name: "My Key", status: "active" }] }
  },
  {
    name: "Rotate API Key",
    method: "POST",
    endpoint: "/api/keys/rotate",
    description: "Rotate an existing API key",
    auth: true,
    request: { key_id: "key_123" },
    response: { id: "key_123", secret_key: "sk_new_..." }
  }
];

export default function APIReference() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(JSON.stringify(code, null, 2));
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">API Reference</h1>
        <p className="text-white/70">Complete documentation for GlyphLock API endpoints</p>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar - Endpoints List */}
        <Card className="lg:col-span-1 bg-[#0A0F24] border-[#8C4BFF]/20">
          <CardHeader>
            <CardTitle className="text-white">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.endpoint}
                onClick={() => setSelectedEndpoint(endpoint)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedEndpoint.endpoint === endpoint.endpoint
                    ? "bg-[#8C4BFF]/20 text-[#8C4BFF] border border-[#8C4BFF]/40"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="text-sm font-medium">{endpoint.name}</span>
                </div>
                <code className="text-xs text-white/50">{endpoint.endpoint}</code>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Main Content - Endpoint Details */}
        <Card className="lg:col-span-2 bg-[#0A0F24] border-[#8C4BFF]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-white">
                <Book className="w-5 h-5 text-[#8C4BFF]" />
                {selectedEndpoint.name}
              </CardTitle>
              {selectedEndpoint.auth && (
                <span className="text-xs px-3 py-1 rounded bg-yellow-500/20 text-yellow-400">
                  Requires Auth
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-white/70">{selectedEndpoint.description}</p>
            </div>

            {/* Endpoint Details */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-white/50">Method</Label>
                <p className="text-white font-mono mt-1">{selectedEndpoint.method}</p>
              </div>
              <div>
                <Label className="text-xs text-white/50">Endpoint</Label>
                <code className="block text-white bg-[#020617] px-3 py-2 rounded mt-1">
                  {selectedEndpoint.endpoint}
                </code>
              </div>
            </div>

            {/* Code Examples */}
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#020617]">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>

              <TabsContent value="curl">
                <div className="relative">
                  <pre className="bg-[#020617] p-4 rounded text-sm text-white overflow-x-auto">
{`curl -X ${selectedEndpoint.method} https://api.glyphlock.io${selectedEndpoint.endpoint} \\
  ${selectedEndpoint.auth ? '-H "Authorization: Bearer YOUR_API_KEY" \\\n  ' : ''}-H "Content-Type: application/json"${selectedEndpoint.request ? ` \\\n  -d '${JSON.stringify(selectedEndpoint.request, null, 2)}'` : ''}`}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(`curl -X ${selectedEndpoint.method} https://api.glyphlock.io${selectedEndpoint.endpoint}`)}
                    className="absolute top-2 right-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="javascript">
                <div className="relative">
                  <pre className="bg-[#020617] p-4 rounded text-sm text-white overflow-x-auto">
{`const response = await fetch('https://api.glyphlock.io${selectedEndpoint.endpoint}', {
  method: '${selectedEndpoint.method}',
  headers: {
    ${selectedEndpoint.auth ? "'Authorization': 'Bearer YOUR_API_KEY',\n    " : ""}'Content-Type': 'application/json'
  }${selectedEndpoint.request ? `,\n  body: JSON.stringify(${JSON.stringify(selectedEndpoint.request, null, 2)})` : ''}
});

const data = await response.json();
console.log(data);`}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode("fetch code")}
                    className="absolute top-2 right-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="python">
                <div className="relative">
                  <pre className="bg-[#020617] p-4 rounded text-sm text-white overflow-x-auto">
{`import requests

response = requests.${selectedEndpoint.method.toLowerCase()}(
    'https://api.glyphlock.io${selectedEndpoint.endpoint}',
    headers={
        ${selectedEndpoint.auth ? "'Authorization': 'Bearer YOUR_API_KEY',\n        " : ""}'Content-Type': 'application/json'
    }${selectedEndpoint.request ? `,\n    json=${JSON.stringify(selectedEndpoint.request, null, 2)}` : ''}
)

data = response.json()
print(data)`}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode("python code")}
                    className="absolute top-2 right-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Request/Response */}
            <div className="grid md:grid-cols-2 gap-4">
              {selectedEndpoint.request && (
                <div>
                  <Label className="text-xs text-white/50 mb-2 block">Request Body</Label>
                  <pre className="bg-[#020617] p-3 rounded text-xs text-white overflow-x-auto">
                    {JSON.stringify(selectedEndpoint.request, null, 2)}
                  </pre>
                </div>
              )}
              
              <div>
                <Label className="text-xs text-white/50 mb-2 block">Response</Label>
                <pre className="bg-[#020617] p-3 rounded text-xs text-white overflow-x-auto">
                  {JSON.stringify(selectedEndpoint.response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Try It Button */}
            <Button className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#9F00FF] hover:opacity-90">
              <Play className="w-4 h-4 mr-2" />
              Try It Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}