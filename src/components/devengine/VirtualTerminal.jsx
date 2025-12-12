import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

/**
 * Virtual Terminal Component
 * Simulates terminal commands via backend routing
 */
export default function VirtualTerminal() {
  const [history, setHistory] = useState([
    { type: 'system', content: 'GlyphLock Dev Terminal v1.0' },
    { type: 'system', content: 'Type "help" for available commands' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: trimmed }]);

    // Parse command
    if (!trimmed) {
      return;
    }

    if (trimmed === 'help') {
      setHistory(prev => [...prev, 
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '  help        - Show this help message' },
        { type: 'output', content: '  clear       - Clear terminal' },
        { type: 'output', content: '  status      - Show dev engine status' },
        { type: 'output', content: '  logs        - View recent action logs' },
        { type: 'output', content: '  backups     - List available backups' }
      ]);
    } else if (trimmed === 'clear') {
      setHistory([
        { type: 'system', content: 'Terminal cleared' }
      ]);
    } else if (trimmed === 'status') {
      setHistory(prev => [...prev,
        { type: 'success', content: '✓ Dev Engine: Active' },
        { type: 'success', content: '✓ Backend: Connected' },
        { type: 'success', content: '✓ Auth: Admin' }
      ]);
    } else if (trimmed === 'logs') {
      setHistory(prev => [...prev,
        { type: 'output', content: 'Recent actions:' },
        { type: 'output', content: '  [12:34:56] File analyzed: pages/Home.js' },
        { type: 'output', content: '  [12:35:12] Proposal generated' },
        { type: 'output', content: '  [12:35:45] Change approved' }
      ]);
    } else if (trimmed === 'backups') {
      setHistory(prev => [...prev,
        { type: 'output', content: 'Available backups:' },
        { type: 'output', content: '  2025-12-12T10:30:00 - pages/Home.js' },
        { type: 'output', content: '  2025-12-12T09:15:00 - components/Header.jsx' }
      ]);
    } else {
      setHistory(prev => [...prev, 
        { type: 'error', content: `Command not found: ${trimmed}` },
        { type: 'output', content: 'Type "help" for available commands' }
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  const getLineColor = (type) => {
    switch (type) {
      case 'system': return 'text-blue-400';
      case 'command': return 'text-white';
      case 'output': return 'text-gray-300';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/50">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-blue-500/20">
        <TerminalIcon className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-white">Terminal</span>
      </div>

      {/* Terminal output */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs"
      >
        {history.map((line, idx) => (
          <div key={idx} className={`mb-1 ${getLineColor(line.type)}`}>
            {line.type === 'command' && (
              <span className="text-blue-400 mr-2">$</span>
            )}
            {line.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-blue-500/20 p-2 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-blue-400" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a command..."
          className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:ring-0"
        />
      </div>
    </div>
  );
}