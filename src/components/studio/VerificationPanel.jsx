import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, ExternalLink } from "lucide-react";

export default function VerificationPanel() {
  const [logId, setLogId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!logId) return;

    try {
      setLoading(true);
      setResult(null);

      const response = await base44.functions.invoke('getImageHashLog', { logId });

      if (response.data.success) {
        setResult(response.data.log);
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Failed to verify log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-royal border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white">Verify Image Hash</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="logId" className="text-white">Log ID</Label>
              <Input
                id="logId"
                value={logId}
                onChange={(e) => setLogId(e.target.value)}
                placeholder="Enter log ID to verify"
                className="glass-card-dark border-blue-500/30 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !logId}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="glass-royal border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/70 text-sm">Hash</Label>
              <p className="font-mono text-sm text-white bg-black/30 p-3 rounded-lg break-all">
                {result.hash}
              </p>
            </div>

            <div>
              <Label className="text-white/70 text-sm">Image File Hash</Label>
              <p className="font-mono text-sm text-white bg-black/30 p-3 rounded-lg break-all">
                {result.imageFileHash}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/70 text-sm">Created At</Label>
                <p className="text-white">{new Date(result.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-white/70 text-sm">Image ID</Label>
                <p className="text-white font-mono text-sm">{result.imageId}</p>
              </div>
            </div>

            {result.imageName && (
              <div>
                <Label className="text-white/70 text-sm">Image Name</Label>
                <p className="text-white">{result.imageName}</p>
              </div>
            )}

            {result.imageUrl && (
              <div>
                <Label className="text-white/70 text-sm">Image</Label>
                <img
                  src={result.imageUrl}
                  alt="Verified"
                  className="w-full max-w-md rounded-lg border border-blue-500/30 mt-2"
                />
              </div>
            )}

            <div>
              <Label className="text-white/70 text-sm">Hotspots Snapshot ({result.hotspotsSnapshot.length})</Label>
              <div className="space-y-2 mt-2">
                {result.hotspotsSnapshot.map((hotspot, index) => (
                  <div key={index} className="p-3 bg-black/30 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-white">{hotspot.label}</h4>
                    {hotspot.description && (
                      <p className="text-sm text-white/70 mt-1">{hotspot.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                        {hotspot.actionType}
                      </span>
                      {hotspot.actionType === 'link' && hotspot.actionValue && (
                        <a
                          href={hotspot.actionValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}