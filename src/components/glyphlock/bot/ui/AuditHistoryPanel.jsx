import React, { useState, useEffect } from 'react';
import { Clock, Shield, CheckCircle, XCircle, Loader2, Trash2, Eye, Archive, ChevronDown, ChevronUp, Globe, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AuditHistoryPanel({ 
  audits = [], 
  isLoading, 
  onViewAudit, 
  onDeleteAudit, 
  onArchiveAudit,
  onLoadArchivedAudits 
}) {
  const [filter, setFilter] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedAudits, setArchivedAudits] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(false);

  useEffect(() => {
    if (showArchived && onLoadArchivedAudits) {
      setLoadingArchived(true);
      onLoadArchivedAudits().then(results => {
        setArchivedAudits(results || []);
        setLoadingArchived(false);
      });
    }
  }, [showArchived, onLoadArchivedAudits]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETE': return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'IN_PROGRESS': return <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
      case 'FAILED': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-slate-400';
    const letter = grade.charAt(0);
    if (letter === 'A') return 'text-emerald-400';
    if (letter === 'B') return 'text-cyan-400';
    if (letter === 'C') return 'text-yellow-400';
    if (letter === 'D') return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredAudits = filter === 'ALL' 
    ? audits 
    : audits.filter(a => a.status === filter);

  const getTargetTypeIcon = (type) => {
    switch (type) {
      case 'business': return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'person': return <User className="w-3.5 h-3.5 text-purple-400" />;
      case 'agency': return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Shield className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleArchive = async (e, auditId) => {
    e.stopPropagation();
    if (!onArchiveAudit) return;
    
    const success = await onArchiveAudit(auditId);
    if (success) {
      toast.success('Audit archived');
    }
  };

  const handleDelete = async (e, auditId) => {
    e.stopPropagation();
    if (!confirm('Delete this audit permanently?')) return;
    
    const success = await onDeleteAudit(auditId);
    if (success) {
      toast.success('Audit deleted');
    } else {
      toast.error('Failed to delete audit');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border-l border-purple-500/30">
      <div className="px-4 py-3 border-b border-purple-500/30 bg-purple-500/10">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
            Audit History
          </span>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-slate-800/50 flex gap-1">
        {['ALL', 'COMPLETE', 'FAILED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900/40 text-slate-500 hover:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-xs text-slate-500 text-center py-4">Loading...</div>
        ) : filteredAudits.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            {filter === 'ALL' ? 'No audits yet' : `No ${filter.toLowerCase()} audits`}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAudits.map(audit => {
              const realId = audit.id || audit._id || audit.entity_id;
              if (!realId) return null;

              return (
                <div
                  key={realId}
                  className="p-2 rounded-lg bg-slate-900/40 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {getTargetTypeIcon(audit.targetType)}
                      {getStatusIcon(audit.status)}
                      <span className="text-xs text-slate-300 truncate font-medium">
                        {audit.targetIdentifier?.replace(/^https?:\/\//, '') || audit.targetUrl?.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                    {audit.overallGrade && (
                      <span className={`text-xs font-bold ${getGradeColor(audit.overallGrade)}`}>
                        {audit.overallGrade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(audit.created_date).toLocaleDateString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      {audit.auditMode || audit.auditType}
                    </span>
                  </div>

                  {audit.summary && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">
                      {audit.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => onViewAudit(audit)}
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-[10px] bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={(e) => handleArchive(e, realId)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[10px] bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                    >
                      <Archive className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => handleDelete(e, realId)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[10px] bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-800/50 mt-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Archive className="w-3.5 h-3.5" />
              Archived Audits
            </span>
            {showArchived ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showArchived && (
            <div className="p-2 space-y-1">
              {loadingArchived ? (
                <div className="text-xs text-slate-500 text-center py-2">Loading...</div>
              ) : archivedAudits.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-2">No archived audits</div>
              ) : (
                archivedAudits.map(audit => {
                  const realId = audit.id || audit._id || audit.entity_id;
                  if (!realId) return null;
                  
                  return (
                    <div
                      key={realId}
                      className="p-2 rounded-lg bg-slate-900/40 border border-slate-700/50 text-xs"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {getTargetTypeIcon(audit.targetType)}
                        <span className="font-medium truncate text-slate-400">
                          {audit.targetIdentifier?.replace(/^https?:\/\//, '') || 'Archived Audit'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => onViewAudit(audit)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px]"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(null, realId)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[10px]"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}