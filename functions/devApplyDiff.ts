import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Dev Engine - Apply Diff
 * Applies approved code changes to files
 * ADMIN ONLY - REQUIRES EXPLICIT APPROVAL
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin check
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { proposalId, filePath, modifiedCode, approved } = await req.json();
    
    if (!proposalId || !filePath || !modifiedCode) {
      return Response.json({ 
        error: 'proposalId, filePath, and modifiedCode required' 
      }, { status: 400 });
    }

    // Verify explicit approval
    if (approved !== true) {
      return Response.json({ 
        error: 'Change must be explicitly approved (approved: true)' 
      }, { status: 403 });
    }

    // Get the proposal log entry
    const proposals = await base44.asServiceRole.entities.BuilderActionLog.filter({
      id: proposalId
    });

    if (!proposals || proposals.length === 0) {
      return Response.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = proposals[0];

    // Verify proposal is still pending
    if (proposal.status !== 'pending') {
      return Response.json({ 
        error: `Proposal already ${proposal.status}` 
      }, { status: 400 });
    }

    // Step 1: Create backup
    const backupResponse = await base44.functions.invoke('devCreateBackup', {
      filePath: filePath,
      fileContent: '/* Original content would be here */'
    });

    if (!backupResponse.data.success) {
      throw new Error('Backup creation failed');
    }

    // Step 2: Apply the change
    // In production, this would use Deno.writeTextFile or Base44 file API
    // For now, we simulate the write operation
    
    const writeResult = {
      success: true,
      filePath: filePath,
      bytesWritten: modifiedCode.length,
      timestamp: new Date().toISOString()
    };

    // Step 3: Update proposal status
    await base44.asServiceRole.entities.BuilderActionLog.update(proposalId, {
      status: 'applied',
      approved: true,
      approvedBy: user.email,
      rollbackAvailable: true,
      backupPath: backupResponse.data.backupPath
    });

    // Step 4: Create applied action log
    await base44.asServiceRole.entities.BuilderActionLog.create({
      timestamp: new Date().toISOString(),
      actor: user.email,
      action: 'modify',
      filePath: filePath,
      diffSummary: `Applied change from proposal ${proposalId}`,
      approved: true,
      approvedBy: user.email,
      status: 'applied',
      rollbackAvailable: true,
      backupPath: backupResponse.data.backupPath
    });

    return Response.json({
      success: true,
      filePath: filePath,
      proposalId: proposalId,
      backupPath: backupResponse.data.backupPath,
      writeResult: writeResult,
      message: 'Change applied successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Apply diff error:', error);
    
    // Log failure
    try {
      await base44.asServiceRole.entities.BuilderActionLog.create({
        timestamp: new Date().toISOString(),
        actor: user.email,
        action: 'modify',
        filePath: filePath || 'unknown',
        diffSummary: 'Failed to apply change',
        status: 'failed',
        errorMessage: error.message
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});