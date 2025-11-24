import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateScannability, downloadFile } from './qrUtils';
import { toast } from 'sonner';

export default function QrPreviewCanvas({ 
  safeQrImageUrl, 
  artQrImageUrl, 
  disguisedImageUrl,
  errorCorrectionLevel = 'H',
  artStyle,
  title = 'QR Preview'
}) {
  const [safeArtMode, setSafeArtMode] = useState(false);
  const [activeView, setActiveView] = useState('safe');

  const scannability = calculateScannability(
    errorCorrectionLevel,
    artStyle && activeView === 'art',
    safeArtMode ? 100 : 85
  );

  const currentImageUrl = activeView === 'disguised' && disguisedImageUrl 
    ? disguisedImageUrl 
    : activeView === 'art' && artQrImageUrl 
    ? artQrImageUrl 
    : safeQrImageUrl;

  const handleDownload = async (format = 'png') => {
    try {
      const filename = `glyphlock-qr-${Date.now()}.${format}`;
      await downloadFile(currentImageUrl, filename);
      toast.success(`QR code downloaded as ${filename}`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <Card className="w-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            {safeQrImageUrl && (
              <Button
                size="sm"
                variant={activeView === 'safe' ? 'default' : 'outline'}
                onClick={() => setActiveView('safe')}
                className="min-h-[44px]"
              >
                Safe
              </Button>
            )}
            {artQrImageUrl && (
              <Button
                size="sm"
                variant={activeView === 'art' ? 'default' : 'outline'}
                onClick={() => setActiveView('art')}
                className="min-h-[44px]"
              >
                Art
              </Button>
            )}
            {disguisedImageUrl && (
              <Button
                size="sm"
                variant={activeView === 'disguised' ? 'default' : 'outline'}
                onClick={() => setActiveView('disguised')}
                className="min-h-[44px]"
              >
                Disguised
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scannability Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Scannability</Label>
            <div className="flex items-center gap-2">
              {scannability >= 85 ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm text-gray-400">{scannability}%</span>
            </div>
          </div>
          <Progress value={scannability} className="h-2" />
          {scannability < 85 && (
            <p className="text-xs text-yellow-400">
              ⚠ Scannability below optimal. Consider enabling Safe Art Mode or increasing error correction.
            </p>
          )}
        </div>

        {/* Safe Art Mode Toggle */}
        {(activeView === 'art' || activeView === 'disguised') && (
          <div className="flex items-center justify-between py-2 border-t border-gray-700">
            <Label htmlFor="safe-art-mode" className="text-gray-300">
              Safe Art Mode
            </Label>
            <Switch
              id="safe-art-mode"
              checked={safeArtMode}
              onCheckedChange={setSafeArtMode}
              className="min-h-[44px] min-w-[44px]"
            />
          </div>
        )}

        {/* QR Image Display */}
        <div className="relative bg-white rounded-lg p-4">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="QR Code Preview"
              className={`w-full h-auto ${safeArtMode ? 'filter contrast-150' : ''}`}
              style={{
                imageRendering: 'pixelated',
                padding: safeArtMode ? '12px' : '4px'
              }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">No preview available</span>
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => handleDownload('png')}
            className="flex-1 gap-2 bg-cyan-600 hover:bg-cyan-700 min-h-[44px]"
            disabled={!currentImageUrl}
          >
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
          <Button
            onClick={() => handleDownload('svg')}
            variant="outline"
            className="flex-1 gap-2 min-h-[44px]"
            disabled={!currentImageUrl}
          >
            <Download className="w-4 h-4" />
            Download SVG
          </Button>
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>• <strong>Safe Mode:</strong> High-contrast version optimized for universal scanning</p>
          <p>• <strong>Art Mode:</strong> Artistic overlay with preserved finder patterns</p>
          {disguisedImageUrl && (
            <p>• <strong>Disguised Mode:</strong> Steganographic embedding in cover photo</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}