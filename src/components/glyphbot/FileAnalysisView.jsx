import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Loader2, Trash2, ArrowRight, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

export default function FileAnalysisView() {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeFiles = async () => {
    if (files.length === 0) return;

    setAnalyzing(true);
    try {
      const fileUrls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrls.push({ url: file_url, name: file.name });
      }

      const prompt = files.length === 1
        ? `Analyze this file in detail: ${files[0].name}. Provide key insights, structure, and important findings.`
        : `Analyze and compare these ${files.length} files: ${files.map(f => f.name).join(', ')}. 
           Provide:
           1. Individual file summaries
           2. Common themes and patterns across files
           3. Key differences and unique aspects
           4. Cross-document insights and connections
           5. Security concerns if applicable`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: fileUrls.map(f => f.url),
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  summary: { type: "string" },
                  key_points: { type: "array", items: { type: "string" } }
                }
              }
            },
            cross_analysis: {
              type: "object",
              properties: {
                common_themes: { type: "array", items: { type: "string" } },
                differences: { type: "array", items: { type: "string" } },
                insights: { type: "array", items: { type: "string" } }
              }
            },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Failed to analyze files");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 glass-royal border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white">File Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block">
            <div className="border-2 border-dashed border-blue-500/50 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-500/10 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-white">Click to upload files</p>
              <p className="text-xs text-white/60 mt-1">Multiple files supported</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{files.length} file(s) selected</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFiles([])}
                  className="text-red-400 hover:text-red-300"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="glass-dark rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-white/60">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={analyzeFiles}
            disabled={files.length === 0 || analyzing}
            className="w-full bg-blue-500/30 hover:bg-blue-500/50 border border-blue-500/50 text-white"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="w-4 h-4 mr-2" />
                Analyze {files.length > 1 ? `${files.length} Files` : 'File'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card className="glass-royal border-blue-500/30 h-full">
          <CardHeader>
            <CardTitle className="text-white">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!analysis ? (
              <div className="text-center py-12 text-white/60">
                <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload and analyze files to see results</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                <div className="glass-dark rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-blue-400">Overall Summary</h3>
                  <p className="text-sm text-white leading-relaxed">{analysis.summary}</p>
                </div>

                {analysis.files && analysis.files.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-400">Individual File Analysis</h3>
                    <div className="space-y-3">
                      {analysis.files.map((file, index) => (
                        <div key={index} className="glass-dark rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <h4 className="font-medium text-white">{file.name}</h4>
                            {file.type && <Badge variant="outline" className="border-blue-500/50 text-white">{file.type}</Badge>}
                          </div>
                          <p className="text-sm text-white/80 mb-2">{file.summary}</p>
                          {file.key_points && file.key_points.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                              {file.key_points.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.cross_analysis && files.length > 1 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-400 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Cross-Document Analysis
                    </h3>
                    <div className="space-y-3">
                      {analysis.cross_analysis.common_themes && analysis.cross_analysis.common_themes.length > 0 && (
                        <div className="glass-dark rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-green-400">Common Themes</h4>
                          <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                            {analysis.cross_analysis.common_themes.map((theme, i) => (
                              <li key={i}>{theme}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.cross_analysis.differences && analysis.cross_analysis.differences.length > 0 && (
                        <div className="glass-dark rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-yellow-400">Key Differences</h4>
                          <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                            {analysis.cross_analysis.differences.map((diff, i) => (
                              <li key={i}>{diff}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.cross_analysis.insights && analysis.cross_analysis.insights.length > 0 && (
                        <div className="glass-dark rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-blue-400">Insights & Connections</h4>
                          <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                            {analysis.cross_analysis.insights.map((insight, i) => (
                              <li key={i}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="glass-dark rounded-lg p-4 border border-blue-500/50">
                    <h3 className="font-semibold mb-2 text-blue-400">Recommendations</h3>
                    <ul className="list-disc list-inside text-sm text-white space-y-1">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}