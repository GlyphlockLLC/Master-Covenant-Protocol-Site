import React from 'react';

export default function ApprovalPanel(props) {
  const {
    selectedFile,
    proposal,
    diff,
    onApprove,
    onReject,
    backups,
    busy,
    status
  } = props;

  const hasProposal = !!proposal;

  return (
    <div className="border-t border-slate-800 bg-slate-950 px-3 py-2 text-[11px] flex items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <div className="text-slate-300">
          {selectedFile ? selectedFile : 'No file selected'}
        </div>
        <div className="text-slate-500">
          {status}
        </div>
        {diff && (
          <div className="text-slate-400">
            Diff ready. Review above before applying.
          </div>
        )}
        {Array.isArray(backups) && backups.length > 0 && (
          <div className="text-slate-500">
            Backups: {backups.length} available.
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReject}
          disabled={!hasProposal || busy}
          className="px-3 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onApprove}
          disabled={!hasProposal || busy}
          className="px-3 py-1 rounded text-xs bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40"
        >
          Approve & Apply
        </button>
      </div>
    </div>
  );
}