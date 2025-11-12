import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, Loader2, AlertTriangle, CheckCircle2, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SecurityScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setScanResult(null);
    }
  };

  const scanFile = async () => {
    if (!selectedFile) return;
    
    setIsScanning(true);
    setScanResult(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ 
        file: selectedFile 
      });

      const response = await fetch(file_url);
      const content = await response.text();

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced security vulnerability scanner. Analyze the following code for security vulnerabilities, code quality issues, and potential exploits.

File: ${selectedFile.name}

Code:
\`\`\`
${content}
\`\`\`

Provide a comprehensive security analysis in JSON format with:
1. "overall_risk_score": number 1-100 (100 being most critical)
2. "vulnerabilities": array of objects with {
   - severity: "Critical"|"High"|"Medium"|"Low"
   - category: string (e.g., "SQL Injection", "XSS", "Authentication")
   - description: string
   - line: number
   - remediation: string
   - cwe_id: string (CWE identifier if applicable)
}
3. "code_quality_issues": array of objects with {line, message, impact}
4. "best_practice_violations": array of strings
5. "dependencies_risk": object with {high_risk: number, medium_risk: number, low_risk: number}
6. "owasp_top_10_findings": array of strings
7. "recommendations": array of strings with prioritized action items
8. "security_score": number 1-10 (10 being most secure)
9. "compliance_issues": array of objects with {standard: string, issue: string}`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_risk_score: { type: "number" },
            vulnerabilities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  category: { type: "string" },
                  description: { type: "string" },
                  line: { type: "number" },
                  remediation: { type: "string" },
                  cwe_id: { type: "string" }
                }
              }
            },
            code_quality_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: { type: "number" },
                  message: { type: "string" },
                  impact: { type: "string" }
                }
              }
            },
            best_practice_violations: {
              type: "array",
              items: { type: "string" }
            },
            dependencies_risk: {
              type: "object",
              properties: {
                high_risk: { type: "number" },
                medium_risk: { type: "number" },
                low_risk: { type: "number" }
              }
            },
            owasp_top_10_findings: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            security_score: { type: "number" },
            compliance_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  standard: { type: "string" },
                  issue: { type: "string" }
                }
              }
            }
          }
        }
      });

      setScanResult(result);
    } catch (error) {
      console.error("Scan error:", error);
      setScanResult({
        overall_risk_score: 0,
        vulnerabilities: [],
        code_quality_issues: [],
        best_practice_violations: [],
        dependencies_risk: { high_risk: 0, medium_risk: 0, low_risk: 0 },
        owasp_top_10_findings: [],
        recommendations: ["Failed to scan file. Please try again."],
        security_score: 0,
        compliance_issues: []
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50" };
    if (severity === "High") return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/50" };
    if (severity === "Medium") return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/50" };
    return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/50" };
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { label: "Critical", color: "red" };
    if (score >= 60) return { label: "High", color: "orange" };
    if (score >= 40) return { label: "Moderate", color: "yellow" };
    if (score >= 20) return { label: "Low", color: "green" };
    return { label: "Minimal", color: "green" };
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5" />
            Security Vulnerability Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors backdrop-blur-md">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".js,.jsx,.ts,.tsx,.py,.sol,.rs,.go,.java"
              className="hidden"
            />
            <FileCode className="w-12 h-12 text-white/60 mx-auto mb-4" />
            {selectedFile ? (
              <div>
                <p className="text-white font-semibold mb-2">{selectedFile.name}</p>
                <p className="text-sm text-white/60">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-white/60">
                  Supported: JS, TS, Python, Solidity, Rust, Go, Java
                </p>
              </div>
            )}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mt-4 border-blue-500/50 hover:bg-blue-500/20 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {selectedFile ? "Change File" : "Select File"}
            </Button>
          </div>

          <Button
            onClick={scanFile}
            disabled={isScanning || !selectedFile}
            className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning for vulnerabilities...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Start Security Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {scanResult && (
        <div className="space-y-4">
          {/* Risk Overview */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Security Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-white/60 mb-2">Overall Risk Score</div>
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl font-bold ${getRiskLevel(scanResult.overall_risk_score).color === 'red' ? 'text-red-400' : getRiskLevel(scanResult.overall_risk_score).color === 'orange' ? 'text-orange-400' : getRiskLevel(scanResult.overall_risk_score).color === 'yellow' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {scanResult.overall_risk_score}
                    </div>
                    <Badge className={`${getRiskLevel(scanResult.overall_risk_score).color === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/50' : getRiskLevel(scanResult.overall_risk_score).color === 'orange' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : getRiskLevel(scanResult.overall_risk_score).color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}>
                      {getRiskLevel(scanResult.overall_risk_score).label}
                    </Badge>
                  </div>
                  <Progress 
                    value={scanResult.overall_risk_score} 
                    className="mt-3"
                  />
                </div>

                <div>
                  <div className="text-sm text-white/60 mb-2">Security Score</div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-green-400">
                      {scanResult.security_score}/10
                    </div>
                    {scanResult.security_score >= 8 ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Dependencies Risk */}
              {scanResult.dependencies_risk && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-white">Dependencies Risk Analysis</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">{scanResult.dependencies_risk.high_risk}</div>
                      <div className="text-xs text-white/60 mt-1">High Risk</div>
                    </div>
                    <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{scanResult.dependencies_risk.medium_risk}</div>
                      <div className="text-xs text-white/60 mt-1">Medium Risk</div>
                    </div>
                    <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">{scanResult.dependencies_risk.low_risk}</div>
                      <div className="text-xs text-white/60 mt-1">Low Risk</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vulnerabilities */}
          {scanResult.vulnerabilities && scanResult.vulnerabilities.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Vulnerabilities ({scanResult.vulnerabilities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanResult.vulnerabilities.map((vuln, idx) => {
                    const colors = getSeverityColor(vuln.severity);
                    return (
                      <div key={idx} className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                              {vuln.severity}
                            </Badge>
                            <span className="font-semibold text-sm text-white">{vuln.category}</span>
                            {vuln.cwe_id && (
                              <Badge className="bg-white/10 text-white border-white/30 text-xs">
                                {vuln.cwe_id}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-white/60">Line {vuln.line}</span>
                        </div>
                        <p className="text-sm text-white mb-3">{vuln.description}</p>
                        <div className="bg-blue-900/30 backdrop-blur-md rounded p-3">
                          <div className="text-xs text-green-400 font-semibold mb-1">Remediation:</div>
                          <p className="text-xs text-white">{vuln.remediation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* OWASP Top 10 Findings - ORANGE */}
          {scanResult.owasp_top_10_findings && scanResult.owasp_top_10_findings.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400">OWASP Top 10 Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scanResult.owasp_top_10_findings.map((finding, idx) => (
                    <li key={idx} className="bg-orange-500/10 backdrop-blur-md border border-orange-500/30 rounded-lg p-3 text-sm text-white">
                      {finding}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendations - GREEN */}
          {scanResult.recommendations && scanResult.recommendations.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Prioritized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {scanResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg p-3">
                      <span className="text-green-400 font-semibold mr-2">{idx + 1}.</span>
                      <span className="text-sm text-white">{rec}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}