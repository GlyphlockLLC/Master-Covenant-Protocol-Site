import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GitCompare } from 'lucide-react';

/**
 * Diff Viewer Component
 * Displays side-by-side comparison of original vs modified code
 */
export default function DiffViewer({ original, modified, filePath }) {
  // Simple diff highlighting (replace with proper diff library in production)
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');

  const renderLine = (line, type, lineNumber) => {
    const bgColor = type === 'removed' ? 'bg-red-500/10' : 
                    type === 'added' ? 'bg-green-500/10' : 
                    'bg-transparent';
    
    const textColor = type === 'removed' ? 'text-red-300' : 
                      type === 'added' ? 'text-green-300' : 
                      'text-gray-300';

    return (
      <div key={lineNumber} className={`flex ${bgColor}`}>
        <span className="w-12 text-right pr-4 text-gray-500 select-none text-xs">
          {lineNumber}
        </span>
        <span className={`flex-1 font-mono text-xs ${textColor}`}>
          {type === 'removed' && '- '}
          {type === 'added' && '+ '}
          {line}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Diff Viewer</span>
          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
            {filePath}
          </Badge>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Original (Left) */}
        <div className="flex-1 border-r border-blue-500/20 overflow-y-auto">
          <div className="sticky top-0 bg-red-500/20 px-4 py-2 border-b border-red-500/30">
            <span className="text-xs text-red-300 font-semibold">Original</span>
          </div>
          <div className="p-4">
            {originalLines.map((line, idx) => renderLine(line, 'removed', idx + 1))}
          </div>
        </div>

        {/* Modified (Right) */}
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 bg-green-500/20 px-4 py-2 border-b border-green-500/30">
            <span className="text-xs text-green-300 font-semibold">Modified</span>
          </div>
          <div className="p-4">
            {modifiedLines.map((line, idx) => renderLine(line, 'added', idx + 1))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-blue-500/20 flex items-center justify-between text-xs">
        <span className="text-gray-400">
          {originalLines.length} lines → {modifiedLines.length} lines
        </span>
        <div className="flex items-center gap-4">
          <span className="text-red-400">
            -{originalLines.length} removed
          </span>
          <span className="text-green-400">
            +{modifiedLines.length} added
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * NOTE FOR PRODUCTION:
 * 
 * Replace with proper diff library like:
 * - react-diff-viewer
 * - diff2html
 * - monaco-diff-editor
 * 
 * Example with react-diff-viewer:
 * 
 * import ReactDiffViewer from 'react-diff-viewer';
 * 
 * <ReactDiffViewer
 *   oldValue={original}
 *   newValue={modified}
 *   splitView={true}
 *   useDarkTheme={true}
 * />
 */