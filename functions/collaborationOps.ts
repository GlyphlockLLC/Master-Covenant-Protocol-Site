import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, sessionId, data } = body;

        // --- JOIN SESSION ---
        if (action === 'join') {
            const { projectId } = data;
            const sessionKey = `collab_${projectId}`;
            
            // In a real Redis/WebSocket scenario, we'd subscribe here.
            // For DB-backed:
            // Use service role to bypass RLS for system-managed session consistency
            const adminBase44 = base44.asServiceRole;
            let session = await adminBase44.entities.CollaborationSession.filter({ projectId });
            
            if (session.length === 0) {
                // Create new session
                await adminBase44.entities.CollaborationSession.create({
                    projectId,
                    hostId: user.id,
                    activeUsers: [user.email],
                    currentState: data.initialState || {},
                    lastUpdate: new Date().toISOString()
                });
            } else {
                // Update existing
                const s = session[0];
                const activeUsers = new Set([...(s.activeUsers || []), user.email]);
                await adminBase44.entities.CollaborationSession.update(s.id, {
                    activeUsers: Array.from(activeUsers),
                    lastUpdate: new Date().toISOString()
                });
            }

            return Response.json({ success: true, sessionId: sessionKey });
        }

        // --- SYNC STATE (Heartbeat & Update) ---
        if (action === 'sync') {
            const adminBase44 = base44.asServiceRole;
            // "Last Write Wins" Strategy for simple object merge
            const { projectId, changes } = data;
            const sessions = await adminBase44.entities.CollaborationSession.filter({ projectId });
            
            if (sessions.length > 0) {
                const s = sessions[0];
                const newState = { ...s.currentState, ...changes };
                
                await adminBase44.entities.CollaborationSession.update(s.id, {
                    currentState: newState,
                    lastUpdate: new Date().toISOString(),
                });
                
                return Response.json({ 
                    success: true, 
                    state: newState, 
                    users: s.activeUsers 
                });
            }
        }

        // --- LEAVE SESSION ---
        if (action === 'leave') {
            const adminBase44 = base44.asServiceRole;
            const { projectId } = data;
            const sessions = await adminBase44.entities.CollaborationSession.filter({ projectId });
            if (sessions.length > 0) {
                const s = sessions[0];
                const activeUsers = (s.activeUsers || []).filter(u => u !== user.email);
                await adminBase44.entities.CollaborationSession.update(s.id, { activeUsers });
            }
            return Response.json({ success: true });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});