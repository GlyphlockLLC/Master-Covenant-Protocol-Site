import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * 🔐 AUDIT SHARING & COLLABORATION
 * Secure role-based sharing with audit log
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, auditId, sharedWith, role, shareToken, comment } = await req.json();

    // Validate inputs
    if (!auditId || !action) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    switch (action) {
      case 'share': {
        // Share audit with specific users
        if (!sharedWith || !Array.isArray(sharedWith) || !role) {
          return Response.json({ error: 'Invalid share payload' }, { status: 400 });
        }

        // Check if user owns this audit
        const audit = await base44.entities.AuditReport.filter({ id: auditId });
        if (!audit.length || audit[0].created_by !== user.email) {
          return Response.json({ error: 'Not audit owner' }, { status: 403 });
        }

        // Create or update share record
        const existing = await base44.entities.SharedAuditAccess.filter({ auditId });
        const accessLog = existing[0]?.accessLog || [];

        const shareData = {
          auditId,
          sharedBy: user.email,
          sharedWith: sharedWith.map(email => ({
            email,
            role,
            grantedAt: new Date().toISOString()
          })),
          accessLog: [
            ...accessLog,
            {
              userEmail: user.email,
              action: `shared_with_${role}`,
              timestamp: new Date().toISOString()
            }
          ]
        };

        if (existing.length) {
          await base44.entities.SharedAuditAccess.update(existing[0].id, shareData);
        } else {
          await base44.entities.SharedAuditAccess.create(shareData);
        }

        return Response.json({
          success: true,
          message: `Shared with ${sharedWith.length} users as ${role}`
        });
      }

      case 'add_comment': {
        // Add comment with mentions
        if (!comment || !comment.content) {
          return Response.json({ error: 'Missing comment content' }, { status: 400 });
        }

        // Parse mentions from content (@email)
        const mentionRegex = /@([\w\.\-]+@[\w\.\-]+\.\w+)/g;
        const mentions = [...new Set((comment.content.match(mentionRegex) || []).map(m => m.slice(1)))];

        const newComment = {
          auditId,
          findingId: comment.findingId || null,
          authorEmail: user.email,
          authorName: user.full_name || user.email,
          content: comment.content,
          mention: mentions,
          severity: comment.severity || 'info',
          status: 'open'
        };

        const created = await base44.entities.AuditComment.create(newComment);

        // Notify mentioned users
        if (mentions.length > 0) {
          // TODO: Send notifications via backend
          console.log(`[Audit] Mentioned ${mentions.join(', ')}`);
        }

        return Response.json({
          success: true,
          comment: created,
          message: 'Comment added'
        });
      }

      case 'check_access': {
        // Check if user has access to audit
        const audit = await base44.entities.AuditReport.filter({ id: auditId });
        if (!audit.length) {
          return Response.json({ hasAccess: false });
        }

        // Owner always has access
        if (audit[0].created_by === user.email) {
          return Response.json({
            hasAccess: true,
            role: 'admin',
            audit: audit[0]
          });
        }

        // Check shared access
        const shared = await base44.entities.SharedAuditAccess.filter({ auditId });
        if (!shared.length) {
          return Response.json({ hasAccess: false });
        }

        const userShare = shared[0].sharedWith?.find(s => s.email === user.email);
        if (!userShare) {
          return Response.json({ hasAccess: false });
        }

        // Log access
        await base44.entities.SharedAuditAccess.update(shared[0].id, {
          accessLog: [
            ...(shared[0].accessLog || []),
            {
              userEmail: user.email,
              action: 'accessed',
              timestamp: new Date().toISOString()
            }
          ]
        });

        return Response.json({
          hasAccess: true,
          role: userShare.role,
          audit: audit[0]
        });
      }

      case 'get_comments': {
        // Fetch comments for audit (with role check)
        const access = await fetch(new Request(req, {
          method: 'POST',
          body: JSON.stringify({
            action: 'check_access',
            auditId
          })
        }));
        const accessData = await access.json();

        if (!accessData.hasAccess) {
          return Response.json({ error: 'No access' }, { status: 403 });
        }

        const comments = await base44.entities.AuditComment.filter({ auditId });
        return Response.json({ comments });
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[auditShareAndCollaborate]', error);
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
});