import React from 'react';

function buildSimpleDiffLines(original, proposed) {
  if (typeof original !== 'string') original = '';
  if (typeof proposed !== 'string') proposed = '';

  const originalLines = original.split('\n');
  const proposedLines = proposed.split('\n');
  const maxLen = Math.max(originalLines.length, proposedLines.length);
  const result = [];

  for (let i = 0; i < maxLen; i += 1) {
    const oldLine = originalLines[i] || '';
    const newLine = proposedLines[i] || '';

    if (oldLine === newLine) {
      result.push({ type: 'context', text: oldLine });
    } else {
      if (oldLine) {
        result.push({ type: 'remove', text: oldLine });
      }
      if (newLine) {
        result.push({ type: 'add', text: newLine });
      }
    }
  }

  return result;
}

export default function DiffViewer(props) {
  const { path, original, proposed, diff } = props;

  const lines = diff && Array.isArray(diff.lines)
    ? diff.lines
    : buildSimpleDiffLines(original, proposed);

  if (!path) {
    return (
      <div className="h-full bg-slate-950 text-slate-500 text-[11px] flex items-center justify-center">
        Select a file and generate a proposal to view diffs.
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 text-[11px] font-mono overflow-auto">
      <div className="px-3 py-2 border-b border-slate-800 text-slate-400 flex justify-between">
        <span>Diff Viewer</span>
        <span className="text-[10px] text-slate-500">{path}</span>
      </div>
      <div className="p-3 space-y-0.5">
        {lines.map(function renderLine(line, idx) {
          let colorClass = 'text-slate-200';
          let prefix = ' ';

          if (line.type === 'add') {
            colorClass = 'text-emerald-300';
            prefix = '+';
          } else if (line.type === 'remove') {
            colorClass = 'text-rose-300';
            prefix = '-';
          }

          return (
            <div key={idx} className={colorClass + ' whitespace-pre'}>
              {prefix} {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}