import { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useCollaboration({ projectId, currentUser, onStateUpdate }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!projectId || !currentUser) return;

    const wsUrl = new URL(base44.functions.getEndpoint('collabSocket'));
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.searchParams.set('projectId', projectId);
    wsUrl.searchParams.set('user', currentUser.email);

    const ws = new WebSocket(wsUrl.toString());
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      toast.success("Connected to live session");
      // Add self
      setActiveUsers(prev => {
        if (!prev.find(u => u.email === currentUser.email)) {
          return [...prev, { email: currentUser.email, id: currentUser.id }];
        }
        return prev;
      });
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        switch (msg.type) {
          case 'state_update':
            if (onStateUpdate) onStateUpdate(msg.data);
            break;
            
          case 'chat':
            setMessages(prev => [...prev, msg.payload]);
            break;
            
          case 'presence':
            if (msg.action === 'join') {
              setActiveUsers(prev => {
                if (!prev.find(u => u.email === msg.user.email)) {
                  toast.info(`${msg.user.email} joined`);
                  return [...prev, msg.user];
                }
                return prev;
              });
            } else if (msg.action === 'leave') {
              setActiveUsers(prev => prev.filter(u => u.email !== msg.user.email));
            }
            break;
        }
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [projectId, currentUser]);

  const sendMessage = useCallback((text) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        text,
        senderId: currentUser?.id,
        senderEmail: currentUser?.email,
        timestamp: new Date().toISOString()
      };
      
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        payload
      }));
      
      setMessages(prev => [...prev, payload]);
    }
  }, [currentUser]);

  const sendStateUpdate = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'state_update',
        data
      }));
    }
  }, []);

  return {
    activeUsers,
    messages,
    isConnected,
    sendMessage,
    sendStateUpdate
  };
}