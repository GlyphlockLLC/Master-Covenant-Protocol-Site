import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronRight, ChevronDown, File, Folder, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * File Tree Component
 * Displays project structure and allows file selection
 */
export default function FileTree({ onFileSelect, selectedFile }) {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/']));

  // Load file tree on mount
  useEffect(() => {
    loadFileTree();
  }, []);

  const loadFileTree = async () => {
    try {
      const response = await base44.functions.invoke('devGetFileTree', {});

      if (response.data.success) {
        setTree(response.data.tree);
      } else {
        throw new Error(response.data.error || 'Failed to load file tree');
      }
    } catch (error) {
      console.error('File tree error:', error);
      toast.error('Failed to load file tree');
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (file) => {
    if (file.type === 'file') {
      onFileSelect(file);
    } else {
      toggleFolder(file.path);
    }
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile?.path === node.path;
    const isFolder = node.type === 'directory';

    return (
      <div key={node.path}>
        <div
          onClick={() => handleFileClick(node)}
          className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-500/20 border-l-2 border-blue-500' 
              : 'hover:bg-white/5'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <File className="w-4 h-4 text-gray-400 ml-4" />
          )}
          <span className="text-sm text-white">{node.name}</span>
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Loading file tree...</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-red-400">Failed to load file tree</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-4 px-3 py-2 border-b border-blue-500/20">
        <h3 className="text-sm font-bold text-white">Project Files</h3>
      </div>
      {renderNode(tree)}
    </div>
  );
}