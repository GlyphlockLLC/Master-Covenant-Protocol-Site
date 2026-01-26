import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { 
  Upload, FileText, AlertTriangle, Shield, CheckCircle2, 
  XCircle, Loader2, Eye, Download, Trash2, FileWarning
} from 'lucide-react';
import { toast } from 'sonner';

export default function FileAnalyzer({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Size limit: 25MB
    if (selectedFile.size > 25 * 1024 * 1024) {
      toast.error('File too large (max 25MB)');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      // Upload to server
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Analyze via backend (secure sandbox)
      const { data } = await base44.functions.invoke('analyzeFileSecure', {
        fileUrl: file_url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      setResult(data);
      toast.success('Analysis complete!');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'safe': return 'text-green-400 border-green-500/50 bg-green-500/10';
      case 'low': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'high': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
      case 'critical': return 'text-red-400 border-red-500/50 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'safe': return <CheckCircle2 className="w-5 h-5" />;
      case 'low': return <Shield className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <FileWarning className="w-5 h-5" />;
      case 'critical': return <XCircle className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-cyan-500/30">
        <CardHeader className="border-b border-cyan-500/20">
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            File Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-analyzer-input"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.exe,.dll,.zip,.rar,.js,.py,.sh,.bat"
          />
          
          {!file ? (
            <div 
              onClick={() => document.getElementById('file-analyzer-input')?.click()}
              className="border-2 border-dashed border-cyan-500/40 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5 transition-all"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <p className="text-white font-semibold mb-2">Click to upload file</p>
              <p className="text-gray-400 text-sm">PDF, Office docs, executables, scripts (max 25MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFile(null); setResult(null); }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={analyzeFile}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 min-h-[56px]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing in Sandbox...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Analyze File
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-purple-500/30">
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Security Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Risk Level */}
            <div className={`p-4 rounded-xl border-2 ${getRiskColor(result.riskLevel)}`}>
              <div className="flex items-center gap-3">
                {getRiskIcon(result.riskLevel)}
                <div>
                  <p className="font-bold text-lg uppercase">{result.riskLevel} Risk</p>
                  <p className="text-sm opacity-80">Security Score: {result.securityScore}/100</p>
                </div>
              </div>
            </div>

            {/* Threat Detection */}
            {result.threats && result.threats.length > 0 && (
              <Alert className="bg-red-500/10 border-red-500/50">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <strong className="block mb-2">Threats Detected:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    {result.threats.map((threat, i) => (
                      <li key={i}>{threat}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* File Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-gray-400 text-xs mb-1">File Type</p>
                <p className="text-white font-semibold">{result.fileType || 'Unknown'}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-gray-400 text-xs mb-1">Hash (SHA-256)</p>
                <p className="text-cyan-400 font-mono text-xs truncate">{result.hash}</p>
              </div>
            </div>

            {/* Malware Signatures */}
            {result.malwareSignatures && result.malwareSignatures.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-orange-400" />
                  Malware Signatures
                </h4>
                <div className="space-y-2">
                  {result.malwareSignatures.map((sig, i) => (
                    <div key={i} className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <p className="text-orange-300 text-sm font-mono">{sig}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {result.extractedData && (
              <div>
                <h4 className="text-white font-semibold mb-2">Extracted Content</h4>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 max-h-60 overflow-y-auto">
                  <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap">{result.extractedData}</pre>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Security Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-cyan-400 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}