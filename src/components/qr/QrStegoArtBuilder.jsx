import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function QrStegoArtBuilder({ qrAssetDraft, onEmbedded }) {
  const [coverFileUri, setCoverFileUri] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [mode, setMode] = useState('standardDisguised');
  const [hiddenPayload, setHiddenPayload] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [disguisedResult, setDisguisedResult] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setCoverFileUri(file_url);
      setCoverPreviewUrl(URL.createObjectURL(file));
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuild = async () => {
    if (!coverFileUri || !qrAssetDraft) {
      toast.error('Cover image and QR asset required');
      return;
    }

    if (mode === 'dualLayerDisguised' && !hiddenPayload) {
      toast.error('Hidden payload required for dual layer mode');
      return;
    }

    setIsEmbedding(true);
    try {
      const result = await base44.functions.invoke('buildStegoDisguisedImage', {
        cover_file_uri: coverFileUri,
        qrAssetId: qrAssetDraft.id,
        mode,
        hiddenPayload: mode === 'dualLayerDisguised' ? hiddenPayload : undefined
      });

      setDisguisedResult({
        disguisedImageUrl: result.data.disguisedImageUrl,
        mode: result.data.mode
      });

      onEmbedded(result.data.disguisedImageUrl, result.data.mode);
      toast.success('Disguised QR image created!');
    } catch (error) {
      toast.error(error.message || 'Embedding failed');
    } finally {
      setIsEmbedding(false);
    }
  };

  return (
    <Card className="w-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Stego Disguised Art Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Cover Image */}
        <div className="space-y-2">
          <Label htmlFor="coverImage" className="text-gray-300">
            Cover Image
          </Label>
          <div className="flex gap-2">
            <Input
              id="coverImage"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="min-h-[44px]"
            />
            {isUploading && <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />}
          </div>
          {coverPreviewUrl && (
            <div className="mt-2">
              <img
                src={coverPreviewUrl}
                alt="Cover preview"
                className="w-full max-w-md rounded-lg border border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div className="space-y-2">
          <Label htmlFor="stegoMode" className="text-gray-300">Stego Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="stegoMode" className="min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standardDisguised">
                Standard Disguised (Any scanner reads base payload)
              </SelectItem>
              <SelectItem value="dualLayerDisguised">
                Dual Layer Disguised (GlyphLock reads hidden layer)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hidden Payload for Dual Layer */}
        {mode === 'dualLayerDisguised' && (
          <div className="space-y-2">
            <Label htmlFor="hiddenPayload" className="text-gray-300">
              Hidden Payload (GlyphLock Only)
            </Label>
            <Textarea
              id="hiddenPayload"
              value={hiddenPayload}
              onChange={(e) => setHiddenPayload(e.target.value)}
              placeholder="Secret data only GlyphLock scanner can read"
              className="min-h-[80px]"
            />
          </div>
        )}

        {/* Build Button */}
        <Button
          onClick={handleBuild}
          disabled={isEmbedding || !coverFileUri || !qrAssetDraft}
          className="w-full bg-purple-600 hover:bg-purple-700 min-h-[44px]"
        >
          {isEmbedding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Embedding QR...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Build Disguised Image
            </>
          )}
        </Button>

        {/* Result Preview */}
        {disguisedResult && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Before (Cover)</Label>
                <img
                  src={coverPreviewUrl}
                  alt="Before"
                  className="w-full rounded-lg border border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">After (Disguised QR)</Label>
                <img
                  src={disguisedResult.disguisedImageUrl}
                  alt="After"
                  className="w-full rounded-lg border border-cyan-500/50"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <strong>Regular Scanners:</strong> Can read the base payload: "{qrAssetDraft.title || 'QR payload'}"
                  </p>
                  {mode === 'dualLayerDisguised' && (
                    <p>
                      <strong>GlyphLock Scanner:</strong> Additionally extracts the hidden layer: "{hiddenPayload}"
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    The QR code is embedded using adaptive luminance modulation while preserving finder patterns and quiet zones for universal scannability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}