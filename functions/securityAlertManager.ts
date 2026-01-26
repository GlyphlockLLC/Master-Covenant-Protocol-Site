import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * 🚨 SECURITY ALERT MANAGER
 * Threat feed aggregation, alert threshold evaluation, notifications
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, alert, thresholdId, filters } = await req.json();

    switch (action) {
      case 'create_alert': {
        // Create security alert from threat feed or audit
        if (!alert || !alert.title || !alert.severity) {
          return Response.json({ error: 'Invalid alert' }, { status: 400 });
        }

        const newAlert = {
          ...alert,
          created_by: user.email,
          status: 'new'
        };

        const created = await base44.entities.SecurityAlert.create(newAlert);

        // Evaluate against thresholds
        const matched = await evaluateThresholds(base44, created, user.email);
        if (matched.length > 0) {
          await triggerNotifications(base44, created, matched);
        }

        return Response.json({
          success: true,
          alert: created,
          triggeredThresholds: matched.map(t => t.id)
        });
      }

      case 'list_alerts': {
        // List alerts with filters
        const query = {
          created_by: user.email,
          ...(filters?.severity && { severity: filters.severity }),
          ...(filters?.status && { status: filters.status })
        };

        const alerts = await base44.entities.SecurityAlert.filter(query);

        // Group by severity
        const grouped = {
          critical: alerts.filter(a => a.severity === 'critical'),
          high: alerts.filter(a => a.severity === 'high'),
          medium: alerts.filter(a => a.severity === 'medium'),
          low: alerts.filter(a => a.severity === 'low')
        };

        return Response.json({
          alerts,
          grouped,
          total: alerts.length,
          summary: {
            critical: grouped.critical.length,
            high: grouped.high.length,
            medium: grouped.medium.length,
            low: grouped.low.length
          }
        });
      }

      case 'set_threshold': {
        // Create/update alert threshold
        if (!alert?.name || !alert?.condition) {
          return Response.json({ error: 'Invalid threshold' }, { status: 400 });
        }

        const threshold = {
          ...alert,
          created_by: user.email
        };

        if (thresholdId) {
          await base44.entities.AlertThreshold.update(thresholdId, threshold);
          return Response.json({ success: true, id: thresholdId });
        } else {
          const created = await base44.entities.AlertThreshold.create(threshold);
          return Response.json({ success: true, threshold: created });
        }
      }

      case 'get_dashboard_data': {
        // Get all alerts + thresholds for dashboard
        const alerts = await base44.entities.SecurityAlert.filter({
          created_by: user.email
        });

        const thresholds = await base44.entities.AlertThreshold.filter({
          created_by: user.email
        });

        // Get related audits
        const relatedAuditIds = [...new Set(alerts.map(a => a.relatedAuditId).filter(Boolean))];
        const audits = relatedAuditIds.length > 0
          ? await Promise.all(
              relatedAuditIds.map(id => base44.entities.AuditReport.filter({ id }))
            ).then(results => results.flat())
          : [];

        // Calculate stats
        const stats = {
          totalAlerts: alerts.length,
          criticalCount: alerts.filter(a => a.severity === 'critical').length,
          highCount: alerts.filter(a => a.severity === 'high').length,
          activeThresholds: thresholds.filter(t => t.enabled).length,
          unresolvedAlerts: alerts.filter(a => a.status !== 'resolved').length
        };

        // Trend (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const trend = {
          total: alerts.filter(a => new Date(a.created_date) > sevenDaysAgo).length,
          critical: alerts.filter(
            a => a.severity === 'critical' && new Date(a.created_date) > sevenDaysAgo
          ).length
        };

        return Response.json({
          alerts,
          thresholds,
          audits,
          stats,
          trend
        });
      }

      case 'update_alert_status': {
        // Update alert status
        if (!alert?.id || !alert?.status) {
          return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        await base44.entities.SecurityAlert.update(alert.id, {
          status: alert.status,
          assignedTo: alert.assignedTo || user.email
        });

        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[securityAlertManager]', error);
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
});

/**
 * Evaluate alert against all thresholds
 */
async function evaluateThresholds(base44, alert, userEmail) {
  const thresholds = await base44.entities.AlertThreshold.filter({
    created_by: userEmail,
    enabled: true
  });

  return thresholds.filter(threshold => {
    const { condition } = threshold;

    // Check severity
    if (condition.severity?.length && !condition.severity.includes(alert.severity)) {
      return false;
    }

    // Check source
    if (condition.source?.length && !condition.source.includes(alert.source)) {
      return false;
    }

    // Check keywords
    if (condition.keywords?.length) {
      const matchesKeyword = condition.keywords.some(kw =>
        alert.title.toLowerCase().includes(kw.toLowerCase()) ||
        alert.description?.toLowerCase().includes(kw.toLowerCase())
      );
      if (!matchesKeyword) return false;
    }

    return true;
  });
}

/**
 * Trigger notifications for matched thresholds
 */
async function triggerNotifications(base44, alert, thresholds) {
  for (const threshold of thresholds) {
    const { actions } = threshold;

    // Send email notifications
    if (actions?.notifyEmails?.length) {
      for (const email of actions.notifyEmails) {
        // TODO: Use SendGrid via integration
        console.log(`[Alert] Sending to ${email}: ${alert.title}`);
      }
    }

    // Post to Slack webhook
    if (actions?.slackWebhook) {
      try {
        await fetch(actions.slackWebhook, {
          method: 'POST',
          body: JSON.stringify({
            text: `🚨 ${alert.severity.toUpperCase()}: ${alert.title}`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*${alert.severity.toUpperCase()}* - ${alert.title}\n${alert.description}`
                }
              }
            ]
          })
        });
      } catch (e) {
        console.error('[Slack notification failed]', e);
      }
    }

    // Assign to team member
    if (actions?.assignTo) {
      await base44.entities.SecurityAlert.update(alert.id, {
        assignedTo: actions.assignTo,
        notificationSent: true
      });
    }
  }
}