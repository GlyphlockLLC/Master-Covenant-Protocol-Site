import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QRCodeDisplay({ credential, onClose }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!credential || !canvasRef.current) return;

    const generateQR = async () => {
      try {
        // Build otpauth URL
        const otpauthUrl = `otpauth://totp/${encodeURIComponent(credential.issuer)}:${encodeURIComponent(credential.account_name)}?secret=${credential.secret}&issuer=${encodeURIComponent(credential.issuer)}&algorithm=${credential.algorithm || 'SHA1'}&digits=${credential.digits || 6}&period=${credential.period || 30}`;

        // Generate QR code on canvas
        await QRCode.toCanvas(canvasRef.current, otpauthUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
      } catch (err) {
        console.error('QR generation error:', err);
        setError('Failed to generate QR code');
      }
    };

    generateQR();
  }, [credential]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${credential.issuer}-${credential.account_name}-2fa.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border-2 border-emerald-500/50 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Export 2FA QR Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-emerald-300 font-semibold mb-1">{credential.issuer}</p>
          <p className="text-xs text-slate-400">{credential.account_name}</p>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 flex items-center justify-center mb-4">
            <canvas ref={canvasRef} />
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mb-4">
          Scan this QR code with another authenticator app to import this account
        </p>

        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600">
            <Download className="w-4 h-4 mr-2" />
            Download QR
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 border-slate-600 text-slate-300">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}