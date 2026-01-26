import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManualEntryForm({ onSubmit, onClose, isSubmitting }) {
  const [formData, setFormData] = useState({
    account_name: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate secret key (Base32)
    const cleanSecret = formData.secret.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z2-7]+=*$/.test(cleanSecret)) {
      alert('Invalid secret key. Must be Base32 encoded (A-Z, 2-7)');
      return;
    }

    onSubmit({
      ...formData,
      secret: cleanSecret
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Account Manually</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account_name">Account Name *</Label>
            <Input
              id="account_name"
              placeholder="e.g., john@example.com"
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="issuer">Issuer</Label>
            <Input
              id="issuer"
              placeholder="e.g., Google, GitHub"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="secret">Secret Key (Base32) *</Label>
            <Input
              id="secret"
              placeholder="JBSWY3DPEHPK3PXP"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              required
              className="font-mono"
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter the secret key provided by the service
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="algorithm">Algorithm</Label>
              <Select
                value={formData.algorithm}
                onValueChange={(value) => setFormData({ ...formData, algorithm: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHA1">SHA-1</SelectItem>
                  <SelectItem value="SHA256">SHA-256</SelectItem>
                  <SelectItem value="SHA512">SHA-512</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="digits">Digits</Label>
              <Select
                value={formData.digits.toString()}
                onValueChange={(value) => setFormData({ ...formData, digits: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 digits</SelectItem>
                  <SelectItem value="8">8 digits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="period">Period (seconds)</Label>
            <Input
              id="period"
              type="number"
              min="15"
              max="60"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}