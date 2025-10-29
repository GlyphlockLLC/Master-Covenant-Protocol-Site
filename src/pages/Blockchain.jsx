import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Blocks, Hash, Shield, CheckCircle2, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blockchain() {
  const [inputText, setInputText] = useState("");
  const [hash256, setHash256] = useState("");
  const [hash512, setHash512] = useState("");

  const generateHashes = async () => {
    if (!inputText) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(inputText);

    // SHA-256
    const hash256Buffer = await crypto.subtle.digest('SHA-256', data);
    const hash256Array = Array.from(new Uint8Array(hash256Buffer));
    const hash256Hex = hash256Array.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash256(hash256Hex);

    // SHA-512
    const hash512Buffer = await crypto.subtle.digest('SHA-512', data);
    const hash512Array = Array.from(new Uint8Array(hash512Buffer));
    const hash512Hex = hash512Array.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash512(hash512Hex);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Blocks className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Blockchain</span> Security
            </h1>
            <p className="text-xl text-gray-400">
              SHA-256/512 hashing and cryptographic verification
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Generate Cryptographic Hash</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="input">Input Text or Data</Label>
                <Input
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button
                onClick={generateHashes}
                disabled={!inputText}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Hash className="w-4 h-4 mr-2" />
                Generate Hashes
              </Button>

              {hash256 && (
                <div className="space-y-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-indigo-400">SHA-256</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(hash256)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-mono break-all text-gray-300">{hash256}</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-purple-400">SHA-512</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(hash512)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-mono break-all text-gray-300">{hash512}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Shield className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Immutable</h3>
                <p className="text-sm text-gray-400">Tamper-proof verification</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Hash className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Cryptographic</h3>
                <p className="text-sm text-gray-400">Industry-standard algorithms</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <CheckCircle2 className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Verified</h3>
                <p className="text-sm text-gray-400">Mathematically proven</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}