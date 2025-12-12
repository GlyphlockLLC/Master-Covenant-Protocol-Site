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
              // Simple terminal wiring, can be extended later
              if (cmd === 'tree') {
                return JSON.stringify(fileTree, null, 2);
              }
              if (cmd === 'status') {
                return status;
              }
              return 'Unknown command. Try: tree, status';
            }}
          />
        </div>
      </div>
    </div>
  );
}