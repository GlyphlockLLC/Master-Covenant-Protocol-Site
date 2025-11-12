import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Download, Shield, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AuditGenerator() {
  const [auditConfig, setAuditConfig] = useState({
    project_name: "",
    audit_type: "full",
    description: "",
    scope: ""
  });
  const [auditReport, setAuditReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAudit = async () => {
    if (!auditConfig.project_name) return;
    
    setIsGenerating(true);
    setAuditReport(null);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional security auditor. Generate a comprehensive security audit report based on the following information:

Project Name: ${auditConfig.project_name}
Audit Type: ${auditConfig.audit_type}
Description: ${auditConfig.description}
Scope: ${auditConfig.scope}

Create a detailed JSON audit report with:
1. "executive_summary": string with high-level overview
2. "audit_scope": array of strings
3. "methodology": string describing audit approach
4. "findings": array of objects with {
   - id: string
   - severity: "Critical"|"High"|"Medium"|"Low"
   - title: string
   - description: string
   - impact: string
   - recommendation: string
   - status: "Open"|"Resolved"|"Mitigated"
}
5. "risk_assessment": object with {
   - overall_risk: string
   - technical_risk: number (1-10)
   - business_risk: number (1-10)
   - compliance_risk: number (1-10)
}
6. "compliance_status": array of objects with {standard: string, status: string, gaps: array of strings}
7. "security_controls": array of objects with {category: string, implemented: number, missing: number}
8. "recommendations": array of strings prioritized by importance
9. "action_plan": array of objects with {priority: string, action: string, timeline: string, owner: string}
10. "conclusion": string with final assessment

Be thorough and professional.`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            audit_scope: { type: "array", items: { type: "string" } },
            methodology: { type: "string" },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  severity: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" },
                  recommendation: { type: "string" },
                  status: { type: "string" }
                }
              }
            },
            risk_assessment: {
              type: "object",
              properties: {
                overall_risk: { type: "string" },
                technical_risk: { type: "number" },
                business_risk: { type: "number" },
                compliance_risk: { type: "number" }
              }
            },
            compliance_status: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  standard: { type: "string" },
                  status: { type: "string" },
                  gaps: { type: "array", items: { type: "string" } }
                }
              }
            },
            security_controls: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  implemented: { type: "number" },
                  missing: { type: "number" }
                }
              }
            },
            recommendations: { type: "array", items: { type: "string" } },
            action_plan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  action: { type: "string" },
                  timeline: { type: "string" },
                  owner: { type: "string" }
                }
              }
            },
            conclusion: { type: "string" }
          }
        }
      });

      setAuditReport(result);
    } catch (error) {
      console.error("Audit generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!auditReport) return;
    
    const reportText = `
SECURITY AUDIT REPORT
=====================
Project: ${auditConfig.project_name}
Date: ${new Date().toLocaleDateString()}
Audit Type: ${auditConfig.audit_type}

EXECUTIVE SUMMARY
-----------------
${auditReport.executive_summary}

METHODOLOGY
-----------
${auditReport.methodology}

FINDINGS
--------
${auditReport.findings.map((f, idx) => `
${idx + 1}. [${f.severity}] ${f.title}
   ID: ${f.id}
   Status: ${f.status}
   
   Description: ${f.description}
   
   Impact: ${f.impact}
   
   Recommendation: ${f.recommendation}
`).join('\n')}

RISK ASSESSMENT
---------------
Overall Risk: ${auditReport.risk_assessment.overall_risk}
Technical Risk: ${auditReport.risk_assessment.technical_risk}/10
Business Risk: ${auditReport.risk_assessment.business_risk}/10
Compliance Risk: ${auditReport.risk_assessment.compliance_risk}/10

RECOMMENDATIONS
---------------
${auditReport.recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}

CONCLUSION
----------
${auditReport.conclusion}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${auditConfig.project_name.replace(/\s+/g, '_')}_Security_Audit.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50" };
    if (severity === "High") return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/50" };
    if (severity === "Medium") return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/50" };
    return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/50" };
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Automated Security Audit Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Project Name</Label>
              <Input
                value={auditConfig.project_name}
                onChange={(e) => setAuditConfig({...auditConfig, project_name: e.target.value})}
                placeholder="Enter project name"
                className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label className="text-white">Audit Type</Label>
              <Select 
                value={auditConfig.audit_type} 
                onValueChange={(value) => setAuditConfig({...auditConfig, audit_type: value})}
              >
                <SelectTrigger className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-900/90 backdrop-blur-md border-blue-500/30">
                  <SelectItem value="full" className="text-white">Full Security Audit</SelectItem>
                  <SelectItem value="smart-contract" className="text-white">Smart Contract Audit</SelectItem>
                  <SelectItem value="penetration" className="text-white">Penetration Test</SelectItem>
                  <SelectItem value="compliance" className="text-white">Compliance Review</SelectItem>
                  <SelectItem value="code-review" className="text-white">Code Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white">Project Description</Label>
            <Textarea
              value={auditConfig.description}
              onChange={(e) => setAuditConfig({...auditConfig, description: e.target.value})}
              placeholder="Describe the project, architecture, and key features..."
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-white">Audit Scope</Label>
            <Textarea
              value={auditConfig.scope}
              onChange={(e) => setAuditConfig({...auditConfig, scope: e.target.value})}
              placeholder="Define what will be audited (components, features, files, etc.)"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <Button
            onClick={generateAudit}
            disabled={isGenerating || !auditConfig.project_name}
            className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Audit Report...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Generate Security Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {auditReport && (
        <div className="space-y-4">
          {/* Executive Summary */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Audit Report: {auditConfig.project_name}</CardTitle>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 hover:bg-blue-500/20 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Executive Summary</h4>
                  <p className="text-sm text-white leading-relaxed">{auditReport.executive_summary}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Methodology</h4>
                  <p className="text-sm text-white leading-relaxed">{auditReport.methodology}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {auditReport.risk_assessment.overall_risk}
                  </div>
                  <div className="text-sm text-white/60">Overall Risk Level</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">{auditReport.risk_assessment.technical_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Technical</div>
                  </div>
                  <div className="bg-orange-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-orange-500/30">
                    <div className="text-2xl font-bold text-orange-400">{auditReport.risk_assessment.business_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Business</div>
                  </div>
                  <div className="bg-yellow-500/10 backdrop-blur-md rounded-lg p-4 text-center border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{auditReport.risk_assessment.compliance_risk}/10</div>
                    <div className="text-xs text-white/60 mt-1">Compliance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Findings */}
          {auditReport.findings && auditReport.findings.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Findings ({auditReport.findings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.findings.map((finding, idx) => {
                    const colors = getSeverityColor(finding.severity);
                    return (
                      <div key={idx} className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                              {finding.severity}
                            </Badge>
                            <span className="font-semibold text-white">{finding.title}</span>
                          </div>
                          <Badge className="bg-white/10 text-white border-white/30 text-xs">
                            {finding.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-white mb-2">{finding.description}</p>
                        <div className="bg-blue-900/30 backdrop-blur-md rounded p-3 mb-2">
                          <div className="text-xs text-orange-400 font-semibold mb-1">Impact:</div>
                          <p className="text-xs text-white">{finding.impact}</p>
                        </div>
                        <div className="bg-blue-900/30 backdrop-blur-md rounded p-3">
                          <div className="text-xs text-green-400 font-semibold mb-1">Recommendation:</div>
                          <p className="text-xs text-white">{finding.recommendation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan - GREEN */}
          {auditReport.action_plan && auditReport.action_plan.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditReport.action_plan.map((item, idx) => (
                    <div key={idx} className="bg-green-500/10 backdrop-blur-md rounded-lg p-4 border border-green-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="font-semibold text-sm text-white">{item.action}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">{item.priority}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-white/60 pl-6">
                        <div>Timeline: {item.timeline}</div>
                        <div>Owner: {item.owner}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conclusion */}
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white leading-relaxed">{auditReport.conclusion}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}