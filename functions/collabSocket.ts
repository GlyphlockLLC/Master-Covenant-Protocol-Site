import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Global map to store active connections per project
// In a distributed environment, use BroadcastChannel for cross-isolate comms
const clients = new Map(); // projectId -> Set<WebSocket>
const channel = new BroadcastChannel('collab_sync');

channel.onmessage = (event) => {
    const { projectId, message, senderId } = event.data;
    const projectClients = clients.get(projectId);
    if (projectClients) {
        projectClients.forEach(ws => {
            if (ws.userId !== senderId && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    }
};

Deno.serve(async (req) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const userEmail = url.searchParams.get('user') || 'Anonymous';
    const userId = crypto.randomUUID();

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.userId = userId;
    socket.userEmail = userEmail;

    socket.onopen = () => {
        if (!clients.has(projectId)) {
            clients.set(projectId, new Set());
        }
        clients.get(projectId).add(socket);

        // Broadcast join
        const joinMsg = { type: 'presence', action: 'join', user: { id: userId, email: userEmail } };
        broadcast(projectId, joinMsg, userId);
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // Re-broadcast to others
            broadcast(projectId, data, userId);
            
            // If it's a state update, we might want to persist it occasionally
            // For now, we rely on the clients to be the source of truth
        } catch (e) {
            console.error("WS Message error", e);
        }
    };

    socket.onclose = () => {
        const projectClients = clients.get(projectId);
        if (projectClients) {
            projectClients.delete(socket);
            if (projectClients.size === 0) {
                clients.delete(projectId);
            } else {
                broadcast(projectId, { type: 'presence', action: 'leave', user: { id: userId, email: userEmail } }, userId);
            }
        }
    };

    return response;
});

function broadcast(projectId, message, senderId) {
    // Send to local clients
    const projectClients = clients.get(projectId);
    if (projectClients) {
        projectClients.forEach(ws => {
            if (ws.userId !== senderId && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    }
    
    // Send to other isolates
    channel.postMessage({ projectId, message, senderId });
}