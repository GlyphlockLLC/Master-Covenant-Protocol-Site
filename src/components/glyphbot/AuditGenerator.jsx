import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Download, Shield, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Link as LinkIcon, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AuditGenerator() {
  const [auditConfig, setAuditConfig] = useState({
    project_name: "",
    audit_type: "web-application",
    description: "",
    website_urls: "",
    technology_stack: "",
    deployment_environment: ""
  });
  const [auditReport, setAuditReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAudit = async () => {
    if (!auditConfig.project_name || !auditConfig.website_urls) return;
    
    setIsGenerating(true);
    setAuditReport(null);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform a professional security audit for the following web application. Analyze actual security risks based on the information provided.

Project: ${auditConfig.project_name}
Type: ${auditConfig.audit_type}
Description: ${auditConfig.description || "Web application security assessment"}
Website URLs: ${auditConfig.website_urls}
Technology Stack: ${auditConfig.technology_stack || "Not specified"}
Deployment: ${auditConfig.deployment_environment || "Not specified"}

Provide a security assessment in JSON format that evaluates:

1. Website Security Posture - Analyze the URLs provided for common vulnerabilities
2. Technology Stack Risks - Based on the technologies mentioned
3. OWASP Top 10 Compliance - Real assessment against current standards
4. Attack Surface - Evaluate endpoints and potential entry points
5. Security Controls - What's implemented vs. what's missing

Return structured JSON with:
{
  "executive_summary": "Clear 2-3 paragraph summary of security findings",
  "website_analysis": {
    "urls_tested": ["list of URLs"],
    "security_grade": "A|B|C|D|F",
    "ssl_status": "Valid|Invalid|Missing",
    "header_security": {
      "score": 0-100,
      "missing_headers": ["list headers"],
      "present_headers": ["list headers"]
    }
  },
  "test_categories": [
    {
      "category": "Authentication & Access Control",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Data Protection",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Input Validation",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Session Security",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Error Handling",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    },
    {
      "category": "Security Configuration",
      "tests_performed": ["specific tests"],
      "pass_rate": 0-100,
      "findings_count": number
    }
  ],
  "findings": [
    {
      "id": "finding-001",
      "severity": "Critical|High|Medium|Low",
      "title": "Specific security issue",
      "description": "Clear technical explanation",
      "affected_urls": ["specific URLs affected"],
      "impact": "Business and security impact",
      "likelihood": "High|Medium|Low",
      "cvss_score": 1-10,
      "cwe_reference": "CWE-###",
      "remediation": "Step-by-step fix instructions",
      "effort_hours": number,
      "status": "Open"
    }
  ],
  "positive_findings": [
    "Security practices implemented correctly"
  ],
  "risk_assessment": {
    "overall_risk": "Critical|High|Moderate|Low",
    "data_exposure_risk": 1-10,
    "reputational_risk": 1-10,
    "compliance_risk": 1-10,
    "risk_trend": "Improving|Stable|Declining",
    "estimated_remediation_time": "X hours/days"
  },
  "owasp_top10_compliance": [
    {
      "item": "A01:2021 – Broken Access Control",
      "status": "Pass|Fail|Partial",
      "findings": ["specific issues"],
      "score": 0-100
    },
    {
      "item": "A02:2021 – Cryptographic Failures",
      "status": "Pass|Fail|Partial",
      "findings": ["specific issues"],
      "score": 0-100
    },
    {
      "item": "A03:2021 – Injection",
      "status": "Pass|Fail|Partial",
      "findings": ["specific issues"],
      "score": 0-100
    }
  ],
  "attack_surface": {
    "public_endpoints": number,
    "api_routes": number,
    "forms_detected": number,
    "file_uploads": number,
    "authentication_pages": number,
    "high_risk_areas": ["specific areas"]
  },
  "security_recommendations": [
    {
      "priority": "Critical|High|Medium|Low",
      "recommendation": "Actionable recommendation",
      "timeline": "Immediate|1 week|1 month",
      "impact": "High|Medium|Low",
      "cost_estimate": "Low|Medium|High"
    }
  ],
  "metrics": {
    "total_tests": number,
    "passed": number,
    "failed": number,
    "warnings": number,
    "vulnerabilities_by_severity": {
      "critical": number,
      "high": number,
      "medium": number,
      "low": number
    }
  },
  "conclusion": "Honest assessment with clear next steps"
}

Make findings realistic and specific to the URLs and technologies mentioned. Be honest about risks.`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            website_analysis: {
              type: "object",
              properties: {
                urls_tested: { type: "array", items: { type: "string" } },
                security_grade: { type: "string" },
                ssl_status: { type: "string" },
                header_security: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    missing_headers: { type: "array", items: { type: "string" } },
                    present_headers: { type: "array", items: { type: "string" } }
                  }
                }
              }
            },
            test_categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  tests_performed: { type: "array", items: { type: "string" } },
                  pass_rate: { type: "number" },
                  findings_count: { type: "number" }
                }
              }
            },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  severity: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  affected_urls: { type: "array", items: { type: "string" } },
                  impact: { type: "string" },
                  likelihood: { type: "string" },
                  cvss_score: { type: "number" },
                  cwe_reference: { type: "string" },
                  remediation: { type: "string" },
                  effort_hours: { type: "number" },
                  status: { type: "string" }
                }
              }
            },
            positive_findings: { type: "array", items: { type: "string" } },
            risk_assessment: {
              type: "object",
              properties: {
                overall_risk: { type: "string" },
                data_exposure_risk: { type: "number" },
                reputational_risk: { type: "number" },
                compliance_risk: { type: "number" },
                risk_trend: { type: "string" },
                estimated_remediation_time: { type: "string" }
              }
            },
            owasp_top10_compliance: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  status: { type: "string" },
                  findings: { type: "array", items: { type: "string" } },
                  score: { type: "number" }
                }
              }
            },
            attack_surface: {
              type: "object",
              properties: {
                public_endpoints: { type: "number" },
                api_routes: { type: "number" },
                forms_detected: { type: "number" },
                file_uploads: { type: "number" },
                authentication_pages: { type: "number" },
                high_risk_areas: { type: "array", items: { type: "string" } }
              }
            },
            security_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  recommendation: { type: "string" },
                  timeline: { type: "string" },
                  impact: { type: "string" },
                  cost_estimate: { type: "string" }
                }
              }
            },
            metrics: {
              type: "object",
              properties: {
                total_tests: { type: "number" },
                passed: { type: "number" },
                failed: { type: "number" },
                warnings: { type: "number" },
                vulnerabilities_by_severity: {
                  type: "object",
                  properties: {
                    critical: { type: "number" },
                    high: { type: "number" },
                    medium: { type: "number" },
                    low: { type: "number" }
                  }
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
╔════════════════════════════════════════════════════════════════╗
║              WEB APPLICATION SECURITY AUDIT REPORT             ║
╚════════════════════════════════════════════════════════════════╝

Project: ${auditConfig.project_name}
Date: ${new Date().toLocaleDateString()}
Audit Type: ${auditConfig.audit_type}
Auditor: GlyphBot Security Assessment

════════════════════════════════════════════════════════════════

TESTED WEBSITES
---------------
${auditReport.website_analysis.urls_tested.map(url => `• ${url}`).join('\n')}

Security Grade: ${auditReport.website_analysis.security_grade}
SSL Status: ${auditReport.website_analysis.ssl_status}
Security Headers Score: ${auditReport.website_analysis.header_security.score}/100

Missing Security Headers:
${auditReport.website_analysis.header_security.missing_headers.map(h => `  ⚠ ${h}`).join('\n')}

EXECUTIVE SUMMARY
-----------------
${auditReport.executive_summary}

VULNERABILITY SUMMARY
---------------------
Total Tests: ${auditReport.metrics.total_tests}
Passed: ${auditReport.metrics.passed}
Failed: ${auditReport.metrics.failed}
Warnings: ${auditReport.metrics.warnings}

Critical Issues: ${auditReport.metrics.vulnerabilities_by_severity.critical}
High Severity: ${auditReport.metrics.vulnerabilities_by_severity.high}
Medium Severity: ${auditReport.metrics.vulnerabilities_by_severity.medium}
Low Severity: ${auditReport.metrics.vulnerabilities_by_severity.low}

TEST RESULTS BY CATEGORY
------------------------
${auditReport.test_categories.map(cat => `
${cat.category}
  Pass Rate: ${cat.pass_rate}%
  Findings: ${cat.findings_count}
  Tests: ${cat.tests_performed.join(', ')}
`).join('\n')}

SECURITY FINDINGS
-----------------
${auditReport.findings.map((f, idx) => `
${idx + 1}. [${f.severity}] ${f.title}
   ID: ${f.id}
   CVSS: ${f.cvss_score}/10 | ${f.cwe_reference}
   Likelihood: ${f.likelihood} | Effort: ${f.effort_hours}h
   
   Affected URLs: ${f.affected_urls.join(', ')}
   
   Description: ${f.description}
   
   Impact: ${f.impact}
   
   Remediation: ${f.remediation}
`).join('\n')}

OWASP TOP 10 COMPLIANCE
-----------------------
${auditReport.owasp_top10_compliance.map(item => `
${item.item}
  Status: ${item.status} (${item.score}%)
  Findings: ${item.findings.join(', ')}
`).join('\n')}

SECURITY STRENGTHS
------------------
${auditReport.positive_findings.map((pf, idx) => `${idx + 1}. ${pf}`).join('\n')}

ATTACK SURFACE ANALYSIS
-----------------------
Public Endpoints: ${auditReport.attack_surface.public_endpoints}
API Routes: ${auditReport.attack_surface.api_routes}
Forms Detected: ${auditReport.attack_surface.forms_detected}
File Uploads: ${auditReport.attack_surface.file_uploads}
Authentication Pages: ${auditReport.attack_surface.authentication_pages}

High-Risk Areas:
${auditReport.attack_surface.high_risk_areas.map((area, idx) => `  ${idx + 1}. ${area}`).join('\n')}

RISK ASSESSMENT
---------------
Overall Risk: ${auditReport.risk_assessment.overall_risk}
Data Exposure: ${auditReport.risk_assessment.data_exposure_risk}/10
Reputational Risk: ${auditReport.risk_assessment.reputational_risk}/10
Compliance Risk: ${auditReport.risk_assessment.compliance_risk}/10
Trend: ${auditReport.risk_assessment.risk_trend}
Remediation Time: ${auditReport.risk_assessment.estimated_remediation_time}

PRIORITIZED RECOMMENDATIONS
----------------------------
${auditReport.security_recommendations.map((rec, idx) => `
${idx + 1}. [${rec.priority}] ${rec.recommendation}
   Timeline: ${rec.timeline}
   Impact: ${rec.impact}
   Cost: ${rec.cost_estimate}
`).join('\n')}

CONCLUSION
----------
${auditReport.conclusion}

════════════════════════════════════════════════════════════════
Report Generated: ${new Date().toLocaleString()}
GlyphBot Security Assessment - Professional Security Auditing
════════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${auditConfig.project_name.replace(/\s+/g, '_')}_Security_Audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50" };
    if (severity === "High") return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/50" };
    if (severity === "Medium") return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/50" };
    return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/50" };
  };

  const getRiskTrendIcon = (trend) => {
    if (trend === "Improving") return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "Declining") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Website Security Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Project Name *</Label>
            <Input
              value={auditConfig.project_name}
              onChange={(e) => setAuditConfig({...auditConfig, project_name: e.target.value})}
              placeholder="Company Website Security Audit"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website URLs to Audit *
            </Label>
            <Textarea
              value={auditConfig.website_urls}
              onChange={(e) => setAuditConfig({...auditConfig, website_urls: e.target.value})}
              placeholder="Enter URLs to audit (one per line)&#10;https://example.com&#10;https://example.com/login&#10;https://api.example.com"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={4}
            />
            <p className="text-xs text-white/60 mt-1">List all URLs you want assessed for security vulnerabilities</p>
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
                <SelectItem value="web-application" className="text-white">Web Application Security</SelectItem>
                <SelectItem value="api" className="text-white">API Security</SelectItem>
                <SelectItem value="e-commerce" className="text-white">E-commerce Platform</SelectItem>
                <SelectItem value="saas" className="text-white">SaaS Application</SelectItem>
                <SelectItem value="mobile-backend" className="text-white">Mobile App Backend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              value={auditConfig.description}
              onChange={(e) => setAuditConfig({...auditConfig, description: e.target.value})}
              placeholder="What does this application do? What sensitive data does it handle?"
              className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Technology Stack</Label>
              <Input
                value={auditConfig.technology_stack}
                onChange={(e) => setAuditConfig({...auditConfig, technology_stack: e.target.value})}
                placeholder="React, Node.js, PostgreSQL, AWS"
                className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label className="text-white">Hosting Environment</Label>
              <Input
                value={auditConfig.deployment_environment}
                onChange={(e) => setAuditConfig({...auditConfig, deployment_environment: e.target.value})}
                placeholder="AWS, Azure, Self-hosted"
                className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          <Button
            onClick={generateAudit}
            disabled={isGenerating || !auditConfig.project_name || !auditConfig.website_urls}
            className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Security...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Run Security Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {auditReport && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{auditReport.metrics.vulnerabilities_by_severity.critical}</div>
                <div className="text-xs text-white/60 mt-1">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 backdrop-blur-md border-orange-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">{auditReport.metrics.vulnerabilities_by_severity.high}</div>
                <div className="text-xs text-white/60 mt-1">High</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 backdrop-blur-md border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{auditReport.metrics.vulnerabilities_by_severity.medium}</div>
                <div className="text-xs text-white/60 mt-1">Medium</div>
              </CardContent>
            </Card>
            <Card className={`${auditReport.website_analysis.security_grade.match(/[AB]/) ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} backdrop-blur-md`}>
              <CardContent className="p-4 text-center">
                <div className={`text-3xl font-bold ${auditReport.website_analysis.security_grade.match(/[AB]/) ? 'text-green-400' : 'text-red-400'}`}>
                  {auditReport.website_analysis.security_grade}
                </div>
                <div className="text-xs text-white/60 mt-1">Security Grade</div>
              </CardContent>
            </Card>
          </div>

          {/* Website Analysis */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <LinkIcon className="w-5 h-5" />
                  {auditConfig.project_name} - Security Report
                </CardTitle>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 hover:bg-blue-500/20 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Tested URLs</h4>
                <div className="space-y-1">
                  {auditReport.website_analysis.urls_tested.map((url, idx) => (
                    <div key={idx} className="text-sm text-blue-400 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {url}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xs text-white/60 mb-1">SSL Certificate</div>
                  <div className={`font-semibold ${auditReport.website_analysis.ssl_status === 'Valid' ? 'text-green-400' : 'text-red-400'}`}>
                    {auditReport.website_analysis.ssl_status}
                  </div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xs text-white/60 mb-1">Security Headers</div>
                  <div className={`font-semibold ${auditReport.website_analysis.header_security.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                    {auditReport.website_analysis.header_security.score}/100
                  </div>
                </div>
              </div>

              {auditReport.website_analysis.header_security.missing_headers.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded p-3">
                  <div className="text-xs text-orange-400 font-semibold mb-2">Missing Security Headers</div>
                  <div className="flex flex-wrap gap-2">
                    {auditReport.website_analysis.header_security.missing_headers.map((header, idx) => (
                      <Badge key={idx} className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-xs">
                        {header}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-white mb-2">Executive Summary</h4>
                <p className="text-sm text-white leading-relaxed">{auditReport.executive_summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Categories */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditReport.test_categories.map((cat, idx) => (
                  <div key={idx} className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{cat.category}</h4>
                      <Badge className={
                        cat.pass_rate >= 80 ? "bg-green-500/20 text-green-400 border-green-500/50" :
                        cat.pass_rate >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                        "bg-red-500/20 text-red-400 border-red-500/50"
                      }>
                        {cat.pass_rate}% Pass
                      </Badge>
                    </div>
                    <div className="text-xs text-white/60">{cat.tests_performed.join(' • ')}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-orange-400 mb-2 flex items-center justify-center gap-2">
                  {auditReport.risk_assessment.overall_risk}
                  {getRiskTrendIcon(auditReport.risk_assessment.risk_trend)}
                </div>
                <div className="text-sm text-white/60">
                  {auditReport.risk_assessment.risk_trend} • {auditReport.risk_assessment.estimated_remediation_time}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-500/10 rounded p-3 text-center border border-red-500/30">
                  <div className="text-xl font-bold text-red-400">{auditReport.risk_assessment.data_exposure_risk}/10</div>
                  <div className="text-xs text-white/60 mt-1">Data Exposure</div>
                </div>
                <div className="bg-orange-500/10 rounded p-3 text-center border border-orange-500/30">
                  <div className="text-xl font-bold text-orange-400">{auditReport.risk_assessment.reputational_risk}/10</div>
                  <div className="text-xs text-white/60 mt-1">Reputational</div>
                </div>
                <div className="bg-yellow-500/10 rounded p-3 text-center border border-yellow-500/30">
                  <div className="text-xl font-bold text-yellow-400">{auditReport.risk_assessment.compliance_risk}/10</div>
                  <div className="text-xs text-white/60 mt-1">Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OWASP Top 10 */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">OWASP Top 10 Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditReport.owasp_top10_compliance.map((item, idx) => (
                  <div key={idx} className="bg-blue-900/30 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{item.item}</span>
                      <Badge className={
                        item.status === "Pass" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                        item.status === "Partial" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                        "bg-red-500/20 text-red-400 border-red-500/50"
                      }>
                        {item.status} ({item.score}%)
                      </Badge>
                    </div>
                    {item.findings.length > 0 && (
                      <div className="text-xs text-white/60 mt-1">
                        {item.findings.join(' • ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attack Surface */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Attack Surface</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface.public_endpoints}</div>
                  <div className="text-xs text-white/60">Public Endpoints</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface.api_routes}</div>
                  <div className="text-xs text-white/60">API Routes</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface.forms_detected}</div>
                  <div className="text-xs text-white/60">Forms</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface.file_uploads}</div>
                  <div className="text-xs text-white/60">File Uploads</div>
                </div>
                <div className="bg-blue-900/30 p-3 rounded">
                  <div className="text-xl font-bold text-white">{auditReport.attack_surface.authentication_pages}</div>
                  <div className="text-xs text-white/60">Auth Pages</div>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-3">
                <h4 className="text-xs font-semibold text-orange-400 mb-2">High-Risk Areas</h4>
                <ul className="space-y-1">
                  {auditReport.attack_surface.high_risk_areas.map((area, idx) => (
                    <li key={idx} className="text-sm text-white flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-orange-400" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Positive Findings */}
          {auditReport.positive_findings.length > 0 && (
            <Card className="bg-green-500/10 backdrop-blur-md border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Security Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {auditReport.positive_findings.map((finding, idx) => (
                    <li key={idx} className="text-sm text-white flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Findings */}
          {auditReport.findings.length > 0 && (
            <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Security Vulnerabilities ({auditReport.findings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditReport.findings.map((finding, idx) => {
                    const colors = getSeverityColor(finding.severity);
                    return (
                      <div key={idx} className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-lg p-4`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                              {finding.severity}
                            </Badge>
                            <span className="font-semibold text-white">{finding.title}</span>
                            <Badge className="bg-white/10 text-white text-xs">
                              CVSS {finding.cvss_score}
                            </Badge>
                            <Badge className="bg-white/10 text-white text-xs">
                              {finding.cwe_reference}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-white/60">Affected URLs: </span>
                            <span className="text-blue-400">{finding.affected_urls.join(', ')}</span>
                          </div>
                          <p className="text-white">{finding.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-white/60">Likelihood: </span>
                              <span className="text-white">{finding.likelihood}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Fix Time: </span>
                              <span className="text-white">{finding.effort_hours}h</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-900/30 rounded p-3 mt-3 mb-2">
                          <div className="text-xs text-orange-400 font-semibold mb-1">Impact:</div>
                          <p className="text-xs text-white">{finding.impact}</p>
                        </div>
                        
                        <div className="bg-blue-900/30 rounded p-3">
                          <div className="text-xs text-green-400 font-semibold mb-1">How to Fix:</div>
                          <p className="text-xs text-white">{finding.remediation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditReport.security_recommendations.map((rec, idx) => {
                  const colors = getSeverityColor(rec.priority);
                  return (
                    <div key={idx} className={`${colors.bg} rounded-lg p-4 border ${colors.border}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm text-white">{rec.recommendation}</span>
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>{rec.priority}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-white/60">
                        <div>Timeline: <span className="text-white">{rec.timeline}</span></div>
                        <div>Impact: <span className="text-white">{rec.impact}</span></div>
                        <div>Cost: <span className="text-white">{rec.cost_estimate}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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