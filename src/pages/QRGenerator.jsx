import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Link as LinkIcon, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(256);
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = () => {
    if (url) {
      setQrGenerated(true);
    }
  };

  const downloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              QR Code <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-xl text-gray-400">
              Create secure, branded QR codes with analytics tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="url">URL or Text</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label>Size: {size}px</Label>
                  <Slider
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                    min={128}
                    max={512}
                    step={64}
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={generateQR}
                  disabled={!url}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {qrGenerated && url ? (
                  <div className="space-y-4">
                    <div className="bg-white p-8 rounded-lg flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`}
                        alt="QR Code"
                        className="max-w-full"
                      />
                    </div>
                    <Button
                      onClick={downloadQR}
                      variant="outline"
                      className="w-full border-green-500/50 hover:bg-green-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">Your QR code will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <LinkIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Custom URLs</h3>
                <p className="text-sm text-gray-400">Link to any website or content</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Sparkles className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">High Quality</h3>
                <p className="text-sm text-gray-400">Up to 512x512px resolution</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <Download className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Easy Export</h3>
                <p className="text-sm text-gray-400">Download as PNG instantly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}