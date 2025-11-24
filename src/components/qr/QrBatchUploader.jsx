import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function QrBatchUploader() {
  const [csvData, setCsvData] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            payloadValue: { type: 'string' },
            payloadType: { type: 'string' }
          },
          required: ['payloadValue']
        }
      });

      if (extracted.status === 'success' && extracted.output) {
        const data = Array.isArray(extracted.output) ? extracted.output : [extracted.output];
        
        // Limit to 100 rows
        const limitedData = data.slice(0, 100);
        setCsvData(limitedData);
        toast.success(`Loaded ${limitedData.length} rows from CSV`);
      } else {
        toast.error('Failed to extract CSV data');
      }
    } catch (error) {
      toast.error('CSV upload failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateDrafts = async () => {
    if (csvData.length === 0) {
      toast.error('No data to process');
      return;
    }

    setIsProcessing(true);
    const newDrafts = [];

    try {
      for (const row of csvData) {
        const draft = await base44.entities.QrAsset.create({
          title: row.title || `QR ${Date.now()}`,
          mode: 'static',
          payloadType: row.payloadType || 'url',
          payloadValue: row.payloadValue,
          errorCorrectionLevel: 'H',
          hotZones: [],
          stegoConfig: { enabled: false },
          riskScore: 0,
          riskFlags: [],
          status: 'draft'
        });

        newDrafts.push({
          ...draft,
          generationStatus: 'pending'
        });
      }

      setDrafts(newDrafts);
      toast.success(`Created ${newDrafts.length} draft assets`);
    } catch (error) {
      toast.error('Draft creation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateAll = async () => {
    if (drafts.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const total = drafts.length;
    for (let i = 0; i < total; i++) {
      const draft = drafts[i];
      
      try {
        const result = await base44.functions.invoke('generateQrAsset', {
          title: draft.title,
          mode: draft.mode,
          payloadType: draft.payloadType,
          payloadValue: draft.payloadValue,
          errorCorrectionLevel: draft.errorCorrectionLevel,
          hotZones: draft.hotZones,
          stegoConfig: draft.stegoConfig
        });

        setDrafts(prev => prev.map((d, idx) => 
          idx === i 
            ? { 
                ...d, 
                generationStatus: 'success',
                safeQrImageUrl: result.data.safeQrImageUrl,
                immutableHash: result.data.immutableHash
              }
            : d
        ));
      } catch (error) {
        setDrafts(prev => prev.map((d, idx) => 
          idx === i 
            ? { ...d, generationStatus: 'error', error: error.message }
            : d
        ));
      }

      setProgress(((i + 1) / total) * 100);
    }

    setIsProcessing(false);
    toast.success('Batch generation complete');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-white flex items-center gap-2 text-lg lg:text-xl">
            <FileSpreadsheet className="w-5 h-5 lg:w-6 lg:h-6" />
            Bulk QR Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <label htmlFor="csvUpload" className="text-sm lg:text-base text-gray-300 font-medium">
              Upload CSV (max 100 rows)
            </label>
            <Input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              disabled={isProcessing}
              className="min-h-[48px] text-base bg-gray-800 border-gray-700"
            />
            <p className="text-xs lg:text-sm text-gray-500">
              CSV should have columns: <span className="font-mono text-cyan-400">title, payloadValue, payloadType</span> (optional)
            </p>
          </div>

          {csvData.length > 0 && (
            <>
              <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4 lg:p-6">
                <p className="text-sm lg:text-base text-cyan-400 font-semibold">
                  ✓ Loaded {csvData.length} rows from CSV
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCreateDrafts}
                  disabled={isProcessing || drafts.length > 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 min-h-[52px] text-base font-semibold shadow-lg shadow-blue-500/30"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Drafts...
                    </>
                  ) : (
                    'Create Drafts'
                  )}
                </Button>

                {drafts.length > 0 && (
                  <Button
                    onClick={handleGenerateAll}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-[52px] text-base font-semibold shadow-lg shadow-purple-500/30"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating {Math.round(progress)}%
                      </>
                    ) : (
                      'Generate All'
                    )}
                  </Button>
                )}
              </div>

              {isProcessing && drafts.length > 0 && (
                <Progress value={progress} className="h-2" />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Drafts List */}
      {drafts.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white text-lg lg:text-xl">Draft Assets ({drafts.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {drafts.map((draft, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors gap-3 sm:gap-0"
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <p className="text-sm lg:text-base font-semibold text-white mb-1">{draft.title}</p>
                    <p className="text-xs lg:text-sm text-gray-400 truncate">{draft.payloadValue}</p>
                  </div>
                  <div className="w-full sm:w-auto">
                    {draft.generationStatus === 'pending' && (
                      <Badge variant="outline" className="bg-gray-700/50">
                        Pending
                      </Badge>
                    )}
                    {draft.generationStatus === 'success' && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    )}
                    {draft.generationStatus === 'error' && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}