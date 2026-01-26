import React, { useState, useEffect } from 'react';
import { TOTP } from 'otpauth';
import { Star, Copy, Trash2, RefreshCw, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCodeDisplay from './QRCodeDisplay';

export default function CredentialCard({ credential, onToggleFavorite, onDelete }) {
  const [code, setCode] = useState('------');
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState(100);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const generateCode = () => {
      try {
        const totp = new TOTP({
          issuer: credential.issuer || 'Unknown',
          label: credential.account_name,
          algorithm: credential.algorithm || 'SHA1',
          digits: credential.digits || 6,
          period: credential.period || 30,
          secret: credential.secret
        });
        
        const token = totp.generate();
        setCode(token);
        
        const now = Math.floor(Date.now() / 1000);
        const period = credential.period || 30;
        const remaining = period - (now % period);
        setTimeLeft(remaining);
        setProgress((remaining / period) * 100);
      } catch (err) {
        console.error('TOTP generation error:', err);
        setCode('ERROR');
      }
    };

    generateCode();
    const interval = setInterval(generateCode, 1000);
    return () => clearInterval(interval);
  }, [credential]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const getProgressColor = () => {
    if (timeLeft <= 5) return 'bg-red-500';
    if (timeLeft <= 10) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="relative bg-slate-900/60 border-2 border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/60 transition-all">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-xl overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex-1 min-w-0">
          {/* Account Info */}
          <div className="flex items-center gap-2 mb-2">
            {credential.icon_url && (
              <img src={credential.icon_url} alt="" className="w-6 h-6 rounded" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">{credential.account_name}</h3>
              {credential.issuer && (
                <p className="text-xs text-slate-400 truncate">{credential.issuer}</p>
              )}
            </div>
          </div>

          {/* Code Display */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 font-mono text-3xl font-bold text-emerald-300 tracking-wider">
              {code.slice(0, 3)} {code.slice(3)}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Expires in</div>
              <div className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-slate-400'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              onClick={() => setShowQR(true)}
              size="sm"
              variant="ghost"
              className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
            >
              <QrCode className="w-3 h-3 mr-1" />
              QR
            </Button>
            <Button
              onClick={() => onToggleFavorite(credential.id, credential.is_favorite)}
              size="sm"
              variant="ghost"
              className={`text-xs ${
                credential.is_favorite 
                  ? 'text-amber-400 hover:text-amber-300' 
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Star className={`w-3 h-3 mr-1 ${credential.is_favorite ? 'fill-current' : ''}`} />
              {credential.is_favorite ? 'Unfavorite' : 'Favorite'}
            </Button>
            <Button
              onClick={() => onDelete(credential.id)}
              size="sm"
              variant="ghost"
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-auto"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {showQR && (
        <QRCodeDisplay credential={credential} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}