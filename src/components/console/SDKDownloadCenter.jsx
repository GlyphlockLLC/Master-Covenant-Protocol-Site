import React, { useState } from "react";
import { Download, FileCode, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const sdks = [
  {
    name: "Node.js",
    language: "javascript",
    icon: "📦",
    versions: ["v1.0.0", "v0.9.5", "v0.9.0"],
    installCmd: "npm install @glyphlock/sdk",
    color: "#68A063"
  },
  {
    name: "Python",
    language: "python",
    icon: "🐍",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "pip install glyphlock",
    color: "#3776AB"
  },
  {
    name: "Go",
    language: "go",
    icon: "🔷",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "go get github.com/glyphlock/sdk",
    color: "#00ADD8"
  },
  {
    name: "Java",
    language: "java",
    icon: "☕",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "maven: com.glyphlock:sdk:1.0.0",
    color: "#007396"
  },
  {
    name: ".NET",
    language: "csharp",
    icon: "🔷",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "dotnet add package GlyphLock.SDK",
    color: "#512BD4"
  },
  {
    name: "PHP",
    language: "php",
    icon: "🐘",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "composer require glyphlock/sdk",
    color: "#777BB4"
  },
  {
    name: "Rust",
    language: "rust",
    icon: "🦀",
    versions: ["v1.0.0", "v0.9.5"],
    installCmd: "cargo add glyphlock-sdk",
    color: "#CE422B"
  },
  {
    name: "Ruby",
    language: "ruby",
    icon: "💎",
    versions: ["v1.0.0"],
    installCmd: "gem install glyphlock",
    color: "#CC342D"
  }
];

export default function SDKDownloadCenter() {
  const [selectedVersions, setSelectedVersions] = useState({});

  const handleDownload = async (sdk) => {
    const version = selectedVersions[sdk.language] || sdk.versions[0];
    
    try {
      toast.success(`Downloading ${sdk.name} SDK ${version}...`);
      
      // Simulated download - replace with actual API call
      const blob = new Blob([`# ${sdk.name} SDK ${version}\n\n${sdk.installCmd}`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glyphlock-sdk-${sdk.language}-${version}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (err) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">SDK Download Center</h1>
        <p className="text-white/70">Official GlyphLock SDKs for all major platforms</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Available SDKs</p>
                <p className="text-2xl font-bold text-white">{sdks.length}</p>
              </div>
              <FileCode className="w-10 h-10 text-[#8C4BFF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-[#00E4FF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Latest Version</p>
                <p className="text-2xl font-bold text-white">v1.0.0</p>
              </div>
              <CheckCircle className="w-10 h-10 text-[#00E4FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A0F24] border-[#9F00FF]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Downloads</p>
                <p className="text-2xl font-bold text-white">12.4K</p>
              </div>
              <Download className="w-10 h-10 text-[#9F00FF]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDK Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sdks.map((sdk) => (
          <Card key={sdk.language} className="bg-[#0A0F24] border-[#8C4BFF]/20 hover:border-[#8C4BFF]/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <span className="text-3xl">{sdk.icon}</span>
                <div>
                  <div>{sdk.name}</div>
                  <div className="text-xs text-white/50 font-normal">{sdk.language}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Version Selector */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">Version</label>
                <Select
                  value={selectedVersions[sdk.language] || sdk.versions[0]}
                  onValueChange={(value) => setSelectedVersions({ ...selectedVersions, [sdk.language]: value })}
                >
                  <SelectTrigger className="bg-[#020617] border-[#8C4BFF]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sdk.versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Install Command */}
              <div>
                <label className="text-xs text-white/70 mb-2 block">Install Command</label>
                <code className="block bg-[#020617] px-3 py-2 rounded text-xs text-white font-mono overflow-x-auto">
                  {sdk.installCmd}
                </code>
              </div>

              {/* Download Button */}
              <Button
                onClick={() => handleDownload(sdk)}
                className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#9F00FF] hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SDK
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentation Link */}
      <Card className="bg-[#0A0F24] border-[#8C4BFF]/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-white font-medium mb-2">Need help integrating?</h3>
            <p className="text-white/70 text-sm mb-4">
              Check out our comprehensive documentation and code examples
            </p>
            <Button variant="outline" className="border-[#8C4BFF]/40 text-[#8C4BFF]">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}