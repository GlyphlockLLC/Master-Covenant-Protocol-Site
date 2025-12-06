/**
 * Audit Service - Audit execution and prompt building logic
 */

export function buildAuditPrompt(config, targetType) {
  const { targetIdentifier, auditMode, notes } = config;
  
  const channelPrompts = {
    business: `Perform a comprehensive BUSINESS SECURITY AUDIT for: ${targetIdentifier}`,
    person: `Perform a comprehensive PEOPLE BACKGROUND CHECK for: ${targetIdentifier}`,
    agency: `Perform a comprehensive GOVERNMENT AGENCY AUDIT for: ${targetIdentifier}`
  };

  const basePrompt = channelPrompts[targetType] || channelPrompts.business;
  
  const modeInstructions = {
    SURFACE: 'Provide a high-level overview with key findings.',
    CONCISE: 'Provide a concise report focusing on critical issues.',
    MEDIUM: 'Provide a detailed analysis with actionable recommendations.',
    DEEP: 'Provide an exhaustive deep-dive analysis with full technical breakdown.',
    ENTERPRISE_A: 'Provide enterprise-grade audit with compliance focus.',
    ENTERPRISE_B: 'Provide enterprise-grade audit with operational risk focus.'
  };

  let fullPrompt = `${basePrompt}\n\nAudit Mode: ${auditMode}\n${modeInstructions[auditMode]}\n\n`;
  
  if (notes) {
    fullPrompt += `Focus Areas: ${notes}\n\n`;
  }

  fullPrompt += `
Return a structured JSON response with the following schema:
{
  "target": "${targetIdentifier}",
  "targetType": "${targetType}",
  "auditMode": "${auditMode}",
  "overallGrade": "A-F letter grade",
  "riskScore": 0-100,
  "summary": "Executive summary",
  "technicalFindings": [{"title": "...", "description": "...", "severity": "CRITICAL|HIGH|MEDIUM|LOW"}],
  "businessRisks": [{"title": "...", "description": "...", "severity": "..."}],
  "fixPlan": [{"title": "...", "description": "...", "severity": "..."}]
}
`;

  return fullPrompt;
}

export function parseAuditResults(response) {
  try {
    if (typeof response === 'string') {
      return JSON.parse(response);
    }
    return response;
  } catch (error) {
    console.error('[Audit Service] Parse error:', error);
    return {
      target: 'Unknown',
      targetType: 'unknown',
      auditMode: 'UNKNOWN',
      overallGrade: 'N/A',
      riskScore: 0,
      summary: 'Failed to parse audit results',
      technicalFindings: [],
      businessRisks: [],
      fixPlan: []
    };
  }
}

export default { buildAuditPrompt, parseAuditResults };