/**
 * GlyphLock System Module Index
 * Centralized export registry for Phase 5+ modules
 * 
 * Purpose:
 * - Provide clean imports for persistence hooks
 * - Export system status for admin dashboards
 * - Support future WYT (Watch Your Tone) integration
 */

// GlyphBot Persistence Exports (Phase 5)
export { useGlyphBotPersistence } from '@/components/glyphbot/useGlyphBotPersistence';
export { default as ChatHistoryPanel } from '@/components/glyphbot/ChatHistoryPanel';

// GlyphBot Audit Exports (Phase 6)
export { useGlyphBotAudit } from '@/components/glyphbot/useGlyphBotAudit';
export { default as AuditPanel } from '@/components/glyphbot/AuditPanel';
export { default as AuditHistoryPanel } from '@/components/glyphbot/AuditHistoryPanel';
export { default as AuditReportView } from '@/components/glyphbot/AuditReportView';

// System Status Helper
export const WYT = () => ({
  glyphbot_version: 'phase_6',
  persistence: 'active',
  status: 'stable',
  message: 'GlyphBot Enterprise Audit Engine Online',
  features: {
    save: true,
    load: true,
    archive: true,
    unarchive: true,
    delete: true,
    auto_resume: true,
    full_history: true,
    user_scoped: true,
    retry_logic: true,
    security_audits: true,
    audit_history: true,
    audit_reports: true,
    voice_summaries: true
  },
  entities: ['GlyphBotChat', 'GlyphBotAudit'],
  timestamp: new Date().toISOString()
});

// Module Status Registry
export const SYSTEM_STATUS = {
  glyphbot: {
    version: '6.0',
    status: 'active',
    persistence: true,
    entities: ['GlyphBotChat', 'GlyphBotAudit'],
    features: ['chat', 'persistence', 'security_audits', 'enterprise_reports']
  },
  qr_studio: {
    version: '4.0',
    status: 'active',
    persistence: true,
    entity: 'QrPreview'
  },
  image_lab: {
    version: '3.0',
    status: 'active',
    entity: 'InteractiveImage'
  },
  wyt: {
    version: '0.1.0',
    status: 'planned',
    description: 'Watch Your Tone - Future sentiment analysis module'
  }
};

// Health Check Function
export function checkSystemHealth() {
  return {
    timestamp: new Date().toISOString(),
    modules: SYSTEM_STATUS,
    wyt: WYT(),
    health: 'operational'
  };
}

export default {
  WYT,
  SYSTEM_STATUS,
  checkSystemHealth
};