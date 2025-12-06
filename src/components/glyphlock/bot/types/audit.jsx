/**
 * @typedef {Object} AuditConfig
 * @property {'business'|'person'|'agency'} targetType - Type of audit target
 * @property {string} targetIdentifier - URL, name, or identifier
 * @property {'SURFACE'|'CONCISE'|'MEDIUM'|'DEEP'|'ENTERPRISE_A'|'ENTERPRISE_B'} auditMode - Audit depth
 * @property {string} [notes] - Optional focus areas
 * @property {string} [rawInput] - Original user input
 */

/**
 * @typedef {Object} AuditResult
 * @property {string} target - Target identifier
 * @property {string} targetType - business/person/agency
 * @property {string} auditMode - Audit depth used
 * @property {string} overallGrade - Letter grade A-F
 * @property {number} riskScore - Risk score 0-100
 * @property {string} summary - Executive summary
 * @property {Array<AuditFinding>} technicalFindings - Technical issues
 * @property {Array<AuditFinding>} businessRisks - Business risks
 * @property {Array<AuditFinding>} fixPlan - Recommended fixes
 */

/**
 * @typedef {Object} AuditFinding
 * @property {string} title - Finding title
 * @property {string} description - Finding description
 * @property {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO'} severity - Severity level
 * @property {Array<string>} [recommendations] - Recommended actions
 */

export const AuditConfigType = {};
export const AuditResultType = {};
export const AuditFindingType = {};