import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Scan, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import QRScanner from '@/components/authenticator/QRScanner';
import CredentialCard from '@/components/authenticator/CredentialCard';
import ManualEntryForm from '@/components/authenticator/ManualEntryForm';
import { toast } from 'sonner';

export default function AuthenticatorPage() {
  const [user, setUser] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    })();
  }, []);

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['authenticator-credentials'],
    queryFn: () => base44.entities.AuthenticatorCredential.list('-sort_order', 100),
    enabled: !!user,
  });

  const createCredentialMutation = useMutation({
    mutationFn: (data) => base44.entities.AuthenticatorCredential.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential added successfully');
      setShowScanner(false);
      setShowManualEntry(false);
    },
    onError: (err) => {
      toast.error('Failed to add credential');
      console.error('Create credential error:', err);
    }
  });

  const updateCredentialMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AuthenticatorCredential.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential updated');
    }
  });

  const deleteCredentialMutation = useMutation({
    mutationFn: (id) => base44.entities.AuthenticatorCredential.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authenticator-credentials'] });
      toast.success('Credential deleted');
    }
  });

  const handleQRScan = (data) => {
    try {
      const url = new URL(data);
      if (url.protocol !== 'otpauth:') {
        toast.error('Invalid authenticator QR code');
        return;
      }

      const type = url.hostname; // totp or hotp
      const label = decodeURIComponent(url.pathname.slice(1));
      const params = new URLSearchParams(url.search);

      const secret = params.get('secret');
      if (!secret) {
        toast.error('QR code missing secret key');
        return;
      }

      const [issuer, accountName] = label.includes(':') 
        ? label.split(':').map(s => s.trim()) 
        : [params.get('issuer') || 'Unknown', label];

      createCredentialMutation.mutate({
        account_name: accountName,
        issuer: issuer,
        secret: secret,
        algorithm: params.get('algorithm') || 'SHA1',
        digits: parseInt(params.get('digits') || '6'),
        period: parseInt(params.get('period') || '30')
      });
    } catch (err) {
      toast.error('Invalid QR code format');
      console.error('QR parse error:', err);
    }
  };

  const handleManualAdd = (data) => {
    createCredentialMutation.mutate(data);
  };

  const handleToggleFavorite = (id, isFavorite) => {
    updateCredentialMutation.mutate({ id, data: { is_favorite: !isFavorite } });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      deleteCredentialMutation.mutate(id);
    }
  };

  const favorites = credentials.filter(c => c.is_favorite);
  const regular = credentials.filter(c => !c.is_favorite);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <SEOHead 
        title="Authenticator - Secure 2FA | GlyphLock"
        description="Secure two-factor authentication app with QR scanning and TOTP code generation"
        url="/authenticator"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border-2 border-emerald-400/60 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Authenticator</h1>
              <p className="text-sm text-slate-400">Secure 2FA Codes</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowScanner(true)}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 preserve-size"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
            <Button
              onClick={() => setShowManualEntry(true)}
              variant="outline"
              className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 preserve-size"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual
            </Button>
          </div>
        </div>

        {/* Credentials List */}
        {isLoading ? (
          <div className="text-center text-slate-400 py-12">Loading credentials...</div>
        ) : credentials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
            <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No credentials added yet</p>
            <p className="text-sm text-slate-500 mb-6">Scan a QR code or add manually to get started</p>
            <Button
              onClick={() => setShowScanner(true)}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan First QR Code
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favorites */}
            {favorites.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm text-emerald-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold uppercase tracking-wider">Favorites</span>
                </div>
                <div className="grid gap-3">
                  {favorites.map(cred => (
                    <CredentialCard
                      key={cred.id}
                      credential={cred}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Credentials */}
            {regular.length > 0 && (
              <div>
                {favorites.length > 0 && (
                  <div className="mb-3 text-sm text-slate-400 font-semibold uppercase tracking-wider">
                    All Accounts
                  </div>
                )}
                <div className="grid gap-3">
                  {regular.map(cred => (
                    <CredentialCard
                      key={cred.id}
                      credential={cred}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <ManualEntryForm
          onSubmit={handleManualAdd}
          onClose={() => setShowManualEntry(false)}
          isSubmitting={createCredentialMutation.isPending}
        />
      )}
    </div>
  );
}