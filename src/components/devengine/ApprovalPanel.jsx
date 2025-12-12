import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, X, Shield } from 'lucide-react';

/**
 * Approval Panel Component
 * Review and approve/reject code changes
 */
export default function ApprovalPanel({ proposal, onApprove, onReject }) {
  if (!proposal) return null;

  const getRiskColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className="border-t border-blue-500/20 rounded-none bg-white/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Proposal Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Change Approval Required</h3>
              <Badge className={getRiskColor(proposal.risk)}>
                {proposal.risk || 'UNKNOWN'} RISK
              </Badge>
            </div>

            {/* Explanation */}
            {proposal.explanation && (
              <div className="bg-white/5 rounded-lg p-3 border border-blue-500/20">
                <p className="text-xs text-gray-400 mb-1">Explanation:</p>
                <p className="text-xs text-white">{proposal.explanation}</p>
              </div>
            )}

            {/* Files Affected */}
            {proposal.filesAffected && proposal.filesAffected.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Files Affected:</p>
                <div className="flex flex-wrap gap-2">
                  {proposal.filesAffected.map((file, idx) => (
                    <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400 text-xs">
                      {file}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Warning */}
            {proposal.risk === 'HIGH' && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-xs">
                  <p className="text-red-400 font-semibold mb-1">High Risk Change</p>
                  <p className="text-gray-300">
                    This change may significantly impact functionality. Review carefully before approving.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onApprove(proposal.proposalId)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve & Apply
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-4 pt-4 border-t border-blue-500/20">
          <p className="text-xs text-gray-500">
            ✓ Backup will be created automatically before applying changes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}