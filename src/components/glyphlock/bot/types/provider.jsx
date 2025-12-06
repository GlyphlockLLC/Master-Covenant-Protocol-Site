/**
 * @typedef {Object} ProviderMeta
 * @property {Array<ProviderInfo>} availableProviders - List of enabled providers
 * @property {Object.<string, ProviderStats>} providerStats - Stats per provider
 * @property {string} providerUsed - Last provider used
 * @property {boolean} jsonModeEnabled - Whether JSON mode is active
 */

/**
 * @typedef {Object} ProviderInfo
 * @property {string} id - Provider ID
 * @property {string} label - Display label
 * @property {number} priority - Priority order
 * @property {boolean} enabled - Whether provider is enabled
 * @property {ProviderStats|null} stats - Provider statistics
 */

/**
 * @typedef {Object} ProviderStats
 * @property {string} id - Provider ID
 * @property {string} label - Provider label
 * @property {number} totalCalls - Total API calls
 * @property {number} successCount - Successful calls
 * @property {number} failureCount - Failed calls
 * @property {number} lastLatencyMs - Last response latency
 * @property {string|null} lastErrorType - Last error message
 * @property {string|null} lastUsedAt - ISO timestamp of last use
 */

/**
 * @typedef {Object} ProviderConfig
 * @property {string} id - Provider ID
 * @property {string} label - Display label
 * @property {string|null} envKey - Environment variable key
 * @property {number} priority - Chain priority
 * @property {boolean} [isPrimary] - Whether this is the primary provider
 */

export const ProviderMetaType = {};
export const ProviderInfoType = {};
export const ProviderStatsType = {};
export const ProviderConfigType = {};