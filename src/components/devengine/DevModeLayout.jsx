import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AIConsole from './AIConsole';
import FileTree from './FileTree';
import MonacoViewer from './MonacoViewer';
import VirtualTerminal from './VirtualTerminal';
import DiffViewer from './DiffViewer';
import ApprovalPanel from './ApprovalPanel';

async function callDevFunction(name, payload) {
  try {
    if (base44 && base44.functions && base44.functions.invoke) {
      const result = await base44.functions.invoke(name, payload || {});
      return result.data || result;
    }
    console.error('Base44 functions API not available');
    return { error: 'Base44 functions API not available' };
  } catch (err) {
    console.error('Dev function error:', err);
    return { error: err.message || 'Unknown error' };
  }
}

export default function DevModeLayout() {
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [diff, setDiff] = useState(null);
  const [backups, setBackups] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState('Idle');

  useEffect(function loadTreeOnMount() {
    let cancelled = false;

    async function loadTree() {
      setStatus('Loading file tree…');
      const result = await callDevFunction('devGetFileTree', {});
      if (cancelled) return;
      if (result && result.tree) {
        setFileTree(result.tree);
        setStatus('File tree loaded');
      } else {
        setStatus('Failed to load file tree');
      }
    }

    loadTree();

    return function cleanup() {
      cancelled = true;
    };
  }, []);

  async function handleSelectFile(path) {
    setSelectedFile(path);
    setAnalysis(null);
    setProposal(null);
    setDiff(null);
    setStatus('Loading file content…');
    setIsBusy(true);
    const result = await callDevFunction('devGetFileContent', { path });
    setIsBusy(false);

    if (result && typeof result.content === 'string') {
      setFileContent(result.content);
      setStatus('File loaded');
    } else {
      setStatus('Failed to load file content');
    }
  }

  async function handleAnalyzeFile() {
    if (!selectedFile) return;
    setIsBusy(true);
    setStatus('Analyzing file…');
    const result = await callDevFunction('devAnalyzeFile', {
      path: selectedFile
    });
    setIsBusy(false);

    if (result && result.analysis) {
      setAnalysis(result.analysis);
      setStatus('Analysis complete');
    } else {
      setStatus('Analysis failed');
    }
  }

  async function handleProposeChange(instructions) {
    if (!selectedFile || !fileContent) return;
    setIsBusy(true);
    setStatus('Requesting proposal…');

    const result = await callDevFunction('devProposeChange', {
      path: selectedFile,
      original: fileContent,
      instructions
    });

    setIsBusy(false);

    if (result && result.proposed) {
      setProposal(result.proposed);
      if (result.diff) {
        setDiff(result.diff);
      }
      setStatus('Proposal ready');
    } else {
      setStatus('Proposal failed');
    }
  }

  async function handleApplyChange() {
    if (!selectedFile || !proposal) return;
    setIsBusy(true);
    setStatus('Applying change…');

    const result = await callDevFunction('devApplyDiff', {
      path: selectedFile,
      original: fileContent,
      proposed: proposal
    });

    setIsBusy(false);

    if (result && result.success) {
      setFileContent(proposal);
      setDiff(result.diff || null);
      setStatus('Change applied and backed up');
      const backupList = await callDevFunction('devGetBackups', {
        path: selectedFile
      });
      if (backupList && Array.isArray(backupList.backups)) {
        setBackups(backupList.backups);
      }
    } else {
      setStatus('Apply failed: ' + (result && result.error ? result.error : 'Unknown'));
    }
  }

  function handleRejectChange() {
    setProposal(null);
    setDiff(null);
    setStatus('Proposal discarded');
  }

  return (
    <div className="flex h-full bg-slate-950 text-slate-50">
      {/* Left: File Tree */}
      <div className="w-64 border-r border-slate-800 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-400 border-b border-slate-800">
          Files
        </div>
        <FileTree
          tree={fileTree}
          selectedPath={selectedFile}
          onSelect={handleSelectFile}
        />
      </div>

      {/* Middle: Console + Diff */}
      <div className="flex flex-col flex-1 border-r border-slate-800">
        <div className="flex-1 flex flex-col">
          <AIConsole
            selectedFile={selectedFile}
            analysis={analysis}
            proposal={proposal}
            onAnalyze={handleAnalyzeFile}
            onPropose={handleProposeChange}
            busy={isBusy}
          />
          <div className="border-t border-slate-800 h-64">
            <DiffViewer
              path={selectedFile}
              original={fileContent}
              proposed={proposal}
              diff={diff}
            />
          </div>
        </div>
        <ApprovalPanel
          selectedFile={selectedFile}
          proposal={proposal}
          diff={diff}
          onApprove={handleApplyChange}
          onReject={handleRejectChange}
          backups={backups}
          busy={isBusy}
          status={status}
        />
      </div>

      {/* Right: Code Viewer + Terminal */}
      <div className="w-[32rem] flex flex-col">
        <div className="flex-1 border-b border-slate-800">
          <MonacoViewer
            path={selectedFile}
            code={proposal || fileContent}
          />
        </div>
        <div className="h-56">
          <VirtualTerminal
            onCommand={async function onCommand(cmd) {
              const parts = cmd.trim().split(' ');
              const command = parts[0];
              const args = parts.slice(1);

              // TREE - Show file tree structure
              if (command === 'tree') {
                if (fileTree.length === 0) return '📁 No files loaded';
                return '📂 File Tree:\n' + JSON.stringify(fileTree, null, 2);
              }

              // STATUS - System status
              if (command === 'status') {
                return `
        📊 SYSTEM STATUS
        ━━━━━━━━━━━━━━━━
        Status: ${status}
        Selected File: ${selectedFile || 'none'}
        Backups: ${backups.length}
        Files Loaded: ${fileTree.length}
        `;
              }

              // FILES - List all files
              if (command === 'files' || command === 'ls') {
                if (fileTree.length === 0) return '❌ No files loaded';
                const flatFiles = [];
                function flatten(nodes, prefix = '') {
                  nodes.forEach(n => {
                    if (!n.children) {
                      flatFiles.push(prefix + n.name);
                    } else {
                      flatFiles.push(prefix + '📁 ' + n.name + '/');
                      flatten(n.children, prefix + '  ');
                    }
                  });
                }
                flatten(fileTree);
                const display = flatFiles.slice(0, 30).join('\n');
                return display + (flatFiles.length > 30 ? `\n... ${flatFiles.length - 30} more files` : '');
              }

              // ENTITIES - List entities
              if (command === 'entities') {
                const entities = fileTree.filter(f => f.path?.startsWith('entities/'));
                if (entities.length === 0) return '❌ No entities found';
                return '📦 ENTITIES:\n' + entities.map(e => '  • ' + e.name).join('\n');
              }

              // FUNCTIONS - List backend functions
              if (command === 'functions') {
                const functions = fileTree.filter(f => f.path?.startsWith('functions/'));
                if (functions.length === 0) return '❌ No functions found';
                return '⚙️ BACKEND FUNCTIONS:\n' + functions.map(f => '  • ' + f.name).join('\n');
              }

              // PAGES - List pages
              if (command === 'pages') {
                const pages = fileTree.filter(f => f.path?.startsWith('pages/'));
                if (pages.length === 0) return '❌ No pages found';
                return '📄 PAGES:\n' + pages.map(p => '  • ' + p.name).join('\n');
              }

              // CAT - Show file content
              if (command === 'cat') {
                if (!args[0]) return '❌ Usage: cat <filename>';
                if (selectedFile && selectedFile.includes(args[0])) {
                  return fileContent || '❌ File content not loaded';
                }
                return `❌ File "${args[0]}" not found or not selected`;
              }

              // LOG - Action log
              if (command === 'log') {
                const result = await callDevFunction('devGetBackups', { path: selectedFile || 'all' });
                if (result.backups && result.backups.length > 0) {
                  return '📝 ACTION LOG:\n' + result.backups.slice(0, 10)
                    .map(b => `  ${b.timestamp} - ${b.path}`)
                    .join('\n');
                }
                return '❌ No action log available';
              }

              return `❌ Command not found: ${command}\n💡 Type "help" for available commands`;
            }}
          />
        </div>
      </div>
    </div>
  );
}