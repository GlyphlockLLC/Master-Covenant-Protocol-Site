import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Loader2, CheckCircle2, AlertTriangle, Code } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CodeExecutor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsExecuting(true);
    setOutput(null);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a code execution engine. Analyze and simulate the execution of the following ${language} code. Provide a detailed response in JSON format.

Code to execute:
\`\`\`${language}
${code}
\`\`\`

Respond with JSON containing:
1. "syntax_valid": boolean - whether the syntax is valid
2. "output": string - the expected output/result of execution
3. "errors": array of error objects with {line, message, severity} if any
4. "warnings": array of warning objects with {line, message} if any
5. "execution_time_estimate": string - estimated execution time
6. "memory_estimate": string - estimated memory usage
7. "optimization_suggestions": array of strings with improvement recommendations
8. "security_issues": array of objects with {severity, description, line} for any security concerns

Be thorough in your analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            syntax_valid: { type: "boolean" },
            output: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: { type: "number" },
                  message: { type: "string" },
                  severity: { type: "string" }
                }
              }
            },
            warnings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: { type: "number" },
                  message: { type: "string" }
                }
              }
            },
            execution_time_estimate: { type: "string" },
            memory_estimate: { type: "string" },
            optimization_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            security_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  description: { type: "string" },
                  line: { type: "number" }
                }
              }
            }
          }
        }
      });

      setOutput(result);
    } catch (error) {
      setOutput({
        syntax_valid: false,
        errors: [{ line: 0, message: "Failed to execute code", severity: "error" }],
        output: "",
        warnings: [],
        optimization_suggestions: [],
        security_issues: []
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === "critical" || severity === "error") return "text-red-400 bg-red-500/10 border-red-500/50";
    if (severity === "high") return "text-orange-400 bg-orange-500/10 border-orange-500/50";
    if (severity === "medium") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/50";
    return "text-green-400 bg-green-500/10 border-green-500/50";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="w-5 h-5" />
              Code Execution Environment
            </CardTitle>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 bg-blue-900/30 border-blue-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-blue-900/90 backdrop-blur-md border-blue-500/30">
                <SelectItem value="javascript" className="text-white">JavaScript</SelectItem>
                <SelectItem value="python" className="text-white">Python</SelectItem>
                <SelectItem value="typescript" className="text-white">TypeScript</SelectItem>
                <SelectItem value="solidity" className="text-white">Solidity</SelectItem>
                <SelectItem value="rust" className="text-white">Rust</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Enter your ${language} code here...`}
            className="bg-blue-900/30 backdrop-blur-md border-blue-500/30 font-mono text-sm min-h-[300px] text-white placeholder:text-white/50"
          />
          <Button
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="w-full bg-green-500/30 hover:bg-green-500/50 text-white border border-green-500/50"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <Card className="bg-blue-900/20 backdrop-blur-md border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {output.syntax_valid ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Output */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-white">
                Output
                <Badge variant="outline" className="text-xs text-white border-white/30 bg-white/10">
                  {output.execution_time_estimate}
                </Badge>
              </h4>
              <pre className="bg-blue-900/30 backdrop-blur-md border border-blue-500/30 rounded-lg p-4 text-sm text-white overflow-x-auto">
                {output.output || "No output"}
              </pre>
            </div>

            {/* Errors - RED */}
            {output.errors && output.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-red-400">Errors</h4>
                <div className="space-y-2">
                  {output.errors.map((error, idx) => (
                    <div key={idx} className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-red-400">Line {error.line}</div>
                          <div className="text-sm text-white mt-1">{error.message}</div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                          {error.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings - YELLOW */}
            {output.warnings && output.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-yellow-400">Warnings</h4>
                <div className="space-y-2">
                  {output.warnings.map((warning, idx) => (
                    <div key={idx} className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-lg p-3">
                      <div className="text-sm text-white">
                        Line {warning.line}: {warning.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Issues - ORANGE */}
            {output.security_issues && output.security_issues.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-orange-400">Security Issues</h4>
                <div className="space-y-2">
                  {output.security_issues.map((issue, idx) => (
                    <div key={idx} className="bg-orange-500/10 backdrop-blur-md border border-orange-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-white">{issue.description}</div>
                          {issue.line > 0 && (
                            <div className="text-xs text-white/60 mt-1">Line {issue.line}</div>
                          )}
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-xs">
                          {issue.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimization Suggestions - GREEN */}
            {output.optimization_suggestions && output.optimization_suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-green-400">Optimization Suggestions</h4>
                <ul className="space-y-2">
                  {output.optimization_suggestions.map((suggestion, idx) => (
                    <li key={idx} className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg p-3 text-sm text-white">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/30">
              <div>
                <div className="text-xs text-white/60">Estimated Execution Time</div>
                <div className="text-sm font-semibold text-white">{output.execution_time_estimate}</div>
              </div>
              <div>
                <div className="text-xs text-white/60">Estimated Memory Usage</div>
                <div className="text-sm font-semibold text-white">{output.memory_estimate}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}