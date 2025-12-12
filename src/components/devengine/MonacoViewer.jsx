import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

/**
 * Monaco Viewer Component
 * Read-only code viewer (Monaco placeholder - replace with actual Monaco in production)
 */
export default function MonacoViewer({ content, filePath, language = 'javascript' }) {
  if (!content) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Select a file to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
            {language}
          </Badge>
          <span className="text-xs text-gray-400">{filePath}</span>
        </div>
        <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
          <Lock className="w-3 h-3 mr-1" />
          READ-ONLY
        </Badge>
      </div>

      {/* Code Display (Monaco placeholder) */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs text-white font-mono">
          <code className="language-javascript">
            {content}
          </code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-blue-500/20 text-xs text-gray-500">
        {content.split('\n').length} lines • {content.length} characters
      </div>
    </div>
  );
}

/**
 * NOTE FOR PRODUCTION:
 * 
 * Replace the <pre><code> section with actual Monaco Editor:
 * 
 * import Editor from '@monaco-editor/react';
 * 
 * <Editor
 *   height="100%"
 *   language={language}
 *   value={content}
 *   theme="vs-dark"
 *   options={{
 *     readOnly: true,
 *     minimap: { enabled: false },
 *     fontSize: 12,
 *     lineNumbers: 'on',
 *     scrollBeyondLastLine: false,
 *     automaticLayout: true
 *   }}
 * />
 */