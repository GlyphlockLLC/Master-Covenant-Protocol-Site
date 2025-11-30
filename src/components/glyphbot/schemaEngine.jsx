/**
 * GlyphBot Schema Engine
 * Dynamically generates JSON schemas for structured LLM outputs
 */

const SCHEMA_TYPES = {
  URL_AUDIT: 'url_audit',
  CODE_AUDIT: 'code_audit',
  BUSINESS_AUDIT: 'business_audit',
  LLM_AUDIT: 'llm_audit',
  CUSTOM: 'custom'
};

const URL_AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    subject: { type: 'string', description: 'URL or domain being audited' },
    riskScore: { type: 'number', minimum: 0, maximum: 100 },
    domainAge: { type: 'string', description: 'Approximate domain age' },
    hosting: { type: 'string', description: 'Hosting provider or location' },
    ssl: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        issuer: { type: 'string' },
        expiry: { type: 'string' }
      },
      required: ['valid']
    },
    threats: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
          description: { type: 'string' }
        },
        required: ['id', 'type', 'severity']
      }
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' }
    },
    overallRisk: { type: 'string', enum: ['safe', 'low', 'moderate', 'high', 'critical'] }
  },
  required: ['subject', 'riskScore', 'overallRisk']
};

const CODE_AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    subject: { type: 'string', description: 'Code file or snippet being audited' },
    language: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          line: { type: 'number' },
          severity: { type: 'string', enum: ['info', 'warning', 'error', 'critical'] },
          category: { type: 'string' },
          description: { type: 'string' },
          suggestion: { type: 'string' }
        },
        required: ['id', 'severity', 'description']
      }
    },
    severityCounts: {
      type: 'object',
      properties: {
        info: { type: 'number' },
        warning: { type: 'number' },
        error: { type: 'number' },
        critical: { type: 'number' }
      }
    },
    fileSummary: { type: 'string' },
    risks: {
      type: 'array',
      items: { type: 'string' }
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' }
    },
    overallScore: { type: 'number', minimum: 0, maximum: 100 }
  },
  required: ['subject', 'issues', 'overallScore']
};

const BUSINESS_AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Business or entity name' },
    category: { type: 'string' },
    stability: { type: 'string', enum: ['unstable', 'developing', 'stable', 'established'] },
    credibilityScore: { type: 'number', minimum: 0, maximum: 100 },
    risks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          severity: { type: 'string' },
          description: { type: 'string' }
        }
      }
    },
    redFlags: {
      type: 'array',
      items: { type: 'string' }
    },
    positiveIndicators: {
      type: 'array',
      items: { type: 'string' }
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['name', 'credibilityScore']
};

const LLM_AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    model: { type: 'string', description: 'LLM model identifier' },
    provider: { type: 'string' },
    latencyMs: { type: 'number' },
    reliabilityScore: { type: 'number', minimum: 0, maximum: 100 },
    strengths: {
      type: 'array',
      items: { type: 'string' }
    },
    weaknesses: {
      type: 'array',
      items: { type: 'string' }
    },
    useCases: {
      type: 'array',
      items: { type: 'string' }
    },
    securityConsiderations: {
      type: 'array',
      items: { type: 'string' }
    },
    recommendation: { type: 'string' }
  },
  required: ['model', 'reliabilityScore']
};

const GENERAL_AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    subject: { type: 'string' },
    type: { type: 'string', enum: ['url', 'domain', 'business', 'code', 'character', 'profile', 'api', 'llm', 'other'] },
    risk_score: { type: 'number', minimum: 0, maximum: 100 },
    severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          description: { type: 'string' },
          impact: { type: 'string' },
          remediation: { type: 'string' }
        },
        required: ['id', 'description']
      }
    },
    overall_risk_reasoning: { type: 'string' }
  },
  required: ['subject', 'type', 'risk_score', 'severity']
};

function detectSchemaType(userMessage, persona) {
  const msg = userMessage.toLowerCase();
  
  if (persona === 'AUDIT' || persona === 'AUDITOR') {
    if (msg.includes('url') || msg.includes('website') || msg.includes('domain') || msg.includes('http')) {
      return SCHEMA_TYPES.URL_AUDIT;
    }
    if (msg.includes('code') || msg.includes('function') || msg.includes('script') || msg.includes('program')) {
      return SCHEMA_TYPES.CODE_AUDIT;
    }
    if (msg.includes('business') || msg.includes('company') || msg.includes('organization') || msg.includes('profile')) {
      return SCHEMA_TYPES.BUSINESS_AUDIT;
    }
    if (msg.includes('model') || msg.includes('llm') || msg.includes('ai') || msg.includes('gpt') || msg.includes('claude')) {
      return SCHEMA_TYPES.LLM_AUDIT;
    }
  }
  
  return null;
}

function getSchemaForType(schemaType) {
  switch (schemaType) {
    case SCHEMA_TYPES.URL_AUDIT:
      return { schema: URL_AUDIT_SCHEMA, name: 'URL Security Audit' };
    case SCHEMA_TYPES.CODE_AUDIT:
      return { schema: CODE_AUDIT_SCHEMA, name: 'Code Security Audit' };
    case SCHEMA_TYPES.BUSINESS_AUDIT:
      return { schema: BUSINESS_AUDIT_SCHEMA, name: 'Business Credibility Audit' };
    case SCHEMA_TYPES.LLM_AUDIT:
      return { schema: LLM_AUDIT_SCHEMA, name: 'LLM Model Audit' };
    default:
      return { schema: GENERAL_AUDIT_SCHEMA, name: 'General Security Audit' };
  }
}

function buildResponseFormat(schemaType) {
  const { schema, name } = getSchemaForType(schemaType);
  return {
    type: 'json_schema',
    json_schema: {
      name: name.replace(/\s+/g, '_').toLowerCase(),
      strict: true,
      schema: schema
    }
  };
}

function buildSimplifiedSchema(schemaType) {
  return {
    type: 'json_object'
  };
}

export {
  SCHEMA_TYPES,
  URL_AUDIT_SCHEMA,
  CODE_AUDIT_SCHEMA,
  BUSINESS_AUDIT_SCHEMA,
  LLM_AUDIT_SCHEMA,
  GENERAL_AUDIT_SCHEMA,
  detectSchemaType,
  getSchemaForType,
  buildResponseFormat,
  buildSimplifiedSchema
};