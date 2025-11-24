import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getRiskLevel } from '@/utils/qrUtils';

export default function QrSecurityBadge({ riskScore = 0, riskFlags = [] }) {
  const { level, color } = getRiskLevel(riskScore);

  const icons = {
    safe: CheckCircle2,
    low: Shield,
    medium: AlertTriangle,
    high: AlertOctagon,
    critical: AlertOctagon
  };

  const colors = {
    safe: 'bg-green-500/20 text-green-400 border-green-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    critical: 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  const Icon = icons[level];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${colors[level]} px-4 py-2 gap-2 min-h-[44px] flex items-center`}>
            <Icon className="w-4 h-4" />
            <span className="font-semibold capitalize">{level} Risk</span>
            <span className="text-xs">({riskScore}/100)</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Risk Score: {riskScore}/100</p>
            {riskFlags.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-1">Detected Issues:</p>
                <ul className="text-xs space-y-1">
                  {riskFlags.map((flag, idx) => (
                    <li key={idx}>• {flag.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            )}
            {riskFlags.length === 0 && (
              <p className="text-xs text-gray-400">No security issues detected</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}