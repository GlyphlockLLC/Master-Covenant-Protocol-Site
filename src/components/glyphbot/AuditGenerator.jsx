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
    const colors = {
      Critical: "red",
      High: "orange",
      Medium: "yellow",
      Low: "blue"
    };
    return colors[severity] || "gray";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Automated Security Audit Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input
                value={auditConfig.project_name}
                onChange={(e) => setAuditConfig({...auditConfig, project_name: e.target.value})}
                placeholder="Enter project name"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Audit Type</Label>
              <Select 
                value={auditConfig.audit_type} 
                onValueChange={(value) => setAuditConfig({...auditConfig, audit_type: value})}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="full">Full Security Audit</SelectItem>
                  <SelectItem value="smart-contract">Smart Contract Audit</SelectItem>
                  <SelectItem value="penetration">Penetration Test</SelectItem>
                  <SelectItem value="compliance">Compliance Review</SelectItem>
                  <SelectItem value="code-review">Code Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Project Description</Label>
            <Textarea
              value={auditConfig.description}
              onChange={(e) => setAuditConfig({...auditConfig, description: e.target.value})}
              placeholder="Describe the project, architecture, and key features..."
              className="bg-gray-800 border-gray-700"
              rows={3}
            />
          </div>

          <div>
            <Label>Audit Scope</Label>
            <Textarea
              value={auditConfig.scope}
              onChange={(e) => setAuditConfig({...auditConfig, scope: e.target.value})}
              placeholder="Define what will be audited (components, features, files, etc.)"
              className="bg-gray-800 border-gray-700"
              rows={3}
            />
          </div>

          <Button
            onClick={generateAudit}
            disabled={isGenerating || !auditConfig.project_name}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
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
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Report: {auditConfig.project_name}</CardTitle>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 hover:bg-cyan-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Executive Summary</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{auditReport.executive_summary}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Methodology</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{auditReport.methodology}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {auditReport.risk_assessment.overall_risk}
                  </div>
                  <div className="text-sm text-gray-400">Overall Risk Level</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{auditReport.risk_assessment.technical_risk}/10</div>
                    <div className="text-xs text-gray-400 mt-1">Technical</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{auditReport.risk_assessment.business_risk}/10</div>
                    <div className="text-xs text-gray-400 mt-1">Business</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{auditReport.risk_assessment.compliance_risk}/10</div>
                    <div className="text-xs text-gray-400 mt-1">Compliance</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Findings */}
          {auditReport.findings && auditReport.findings.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Findings ({auditReport.findings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.findings.map((finding, idx) => (
                    <div key={idx} className={`bg-${getSeverityColor(finding.severity)}-500/10 border border-${getSeverityColor(finding.severity)}-500/30 rounded-lg p-4`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`border-${getSeverityColor(finding.severity)}-500 text-${getSeverityColor(finding.severity)}-400`}>
                            {finding.severity}
                          </Badge>
                          <span className="font-semibold">{finding.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {finding.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{finding.description}</p>
                      <div className="bg-gray-800 rounded p-3 mb-2">
                        <div className="text-xs text-orange-400 font-semibold mb-1">Impact:</div>
                        <p className="text-xs text-gray-300">{finding.impact}</p>
                      </div>
                      <div className="bg-gray-800 rounded p-3">
                        <div className="text-xs text-green-400 font-semibold mb-1">Recommendation:</div>
                        <p className="text-xs text-gray-300">{finding.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          {auditReport.action_plan && auditReport.action_plan.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditReport.action_plan.map((item, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold text-sm">{item.action}</span>
                        </div>
                        <Badge variant="outline">{item.priority}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pl-6">
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
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
            <CardHeader>
              <CardTitle>Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 leading-relaxed">{auditReport.conclusion}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}