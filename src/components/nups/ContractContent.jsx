/**
 * Contract Content - 3-signature workflow (Hostess → Manager → Client)
 */

import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FileText, Printer, Search, Fingerprint, PenTool, CheckCircle, Scale, Lock, AlertTriangle, UserCheck, Users, User } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedField from '@/components/nups/ProtectedField';

const VENUE_NAME = 'DREAM PALACE';
const VENUE_LEGAL = 'Dream Palace Entertainment LLC';
const VENUE_ADDRESS = '123 Entertainment Blvd, Las Vegas, NV 89109';
const CONTRACT_VERSION = '3.1.0';

// IndexedDB for contracts
const DB_NAME = 'NUPS_Contracts';
const DB_VERSION = 1;

function openContractDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('contracts')) {
        db.createObjectStore('contracts', { keyPath: 'id' });
      }
    };
  });
}

async function saveContract(contract) {
  const db = await openContractDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contracts', 'readwrite');
    tx.objectStore('contracts').put(contract);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getContract(id) {
  const db = await openContractDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contracts', 'readonly');
    const request = tx.objectStore('contracts').get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Signature Capture Component
function SignatureCapture({ onSignature, label, disabled, existingSignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!existingSignature);

  useEffect(() => {
    if (existingSignature && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new window.Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const startDrawing = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignature(null);
  };

  const saveSignature = () => {
    if (!hasSignature) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSignature(dataUrl);
    toast.success(`${label} signature captured`);
  };

  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50' : ''}`}>
      <Label className="text-white">{label} Signature</Label>
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-2 bg-white">
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
          className={`w-full bg-white rounded ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={clearSignature} disabled={disabled} className="border-slate-600">Clear</Button>
        <Button size="sm" onClick={saveSignature} disabled={disabled || !hasSignature} className="bg-cyan-600">Capture</Button>
      </div>
    </div>
  );
}

export default function NUPSContractContent() {
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [search, setSearch] = useState('');
  const [showAcknowledgmentModal, setShowAcknowledgmentModal] = useState(false);
  
  // 3-signature state
  const [hostessSignature, setHostessSignature] = useState(null);
  const [hostessSigned, setHostessSigned] = useState(false);
  const [hostessSignedAt, setHostessSignedAt] = useState(null);
  const [hostessName, setHostessName] = useState('');
  
  const [managerSignature, setManagerSignature] = useState(null);
  const [managerSigned, setManagerSigned] = useState(false);
  const [managerSignedAt, setManagerSignedAt] = useState(null);
  const [managerName, setManagerName] = useState('');
  
  const [clientSignature, setClientSignature] = useState(null);
  const [clientSigned, setClientSigned] = useState(false);
  const [clientSignedAt, setClientSignedAt] = useState(null);
  
  const [contractHash, setContractHash] = useState('');
  const [contractStatus, setContractStatus] = useState('DRAFT');
  const [localContractId, setLocalContractId] = useState(null);
  
  const [modalTerms, setModalTerms] = useState({
    age: false,
    conduct: false,
    liability: false,
    arbitration: false
  });

  const { data: guests = [] } = useQuery({
    queryKey: ['vip-guests-contract'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 200)
  });

  const filtered = guests.filter(g =>
    g.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.membership_number?.toLowerCase().includes(search.toLowerCase())
  );

  const guest = guests.find(g => g.id === selectedGuestId);
  const allModalTerms = Object.values(modalTerms).every(Boolean);
  const allSigned = hostessSigned && managerSigned && clientSigned;

  const contractDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const contractTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
  const contractId = localContractId || `${VENUE_LEGAL.replace(/\s/g, '').slice(0, 6).toUpperCase()}-${guest?.id?.slice(0, 8) || 'XXXXXX'}-${Date.now().toString(36).toUpperCase()}`;

  // Load existing contract when guest selected
  useEffect(() => {
    if (guest?.id) {
      loadExistingContract(guest.id);
    }
  }, [guest?.id]);

  const loadExistingContract = async (guestId) => {
    const existing = await getContract(guestId);
    if (existing) {
      setLocalContractId(existing.id);
      setContractStatus(existing.status);
      setHostessSignature(existing.hostessSignature);
      setHostessSigned(!!existing.hostessSignedAt);
      setHostessSignedAt(existing.hostessSignedAt);
      setHostessName(existing.hostessName || '');
      setManagerSignature(existing.managerSignature);
      setManagerSigned(!!existing.managerSignedAt);
      setManagerSignedAt(existing.managerSignedAt);
      setManagerName(existing.managerName || '');
      setClientSignature(existing.clientSignature);
      setClientSigned(!!existing.clientSignedAt);
      setClientSignedAt(existing.clientSignedAt);
      setContractHash(existing.documentHash || '');
    } else {
      resetSignatures();
    }
  };

  const resetSignatures = () => {
    setLocalContractId(null);
    setContractStatus('DRAFT');
    setHostessSignature(null);
    setHostessSigned(false);
    setHostessSignedAt(null);
    setHostessName('');
    setManagerSignature(null);
    setManagerSigned(false);
    setManagerSignedAt(null);
    setManagerName('');
    setClientSignature(null);
    setClientSigned(false);
    setClientSignedAt(null);
    setContractHash('');
  };

  // Hostess signs first
  const handleHostessSign = async () => {
    if (!hostessSignature || !hostessName) {
      toast.error('Hostess name and signature required');
      return;
    }
    
    const signedAt = new Date().toISOString();
    setHostessSigned(true);
    setHostessSignedAt(signedAt);
    setContractStatus('HOSTESS_SIGNED');
    
    await saveContract({
      id: guest.id,
      guestId: guest.id,
      guestName: guest.guest_name,
      contractId,
      type: 'VIP',
      hostessSignature,
      hostessSignedAt: signedAt,
      hostessName,
      managerSignature: null,
      managerSignedAt: null,
      managerName: '',
      clientSignature: null,
      clientSignedAt: null,
      documentHash: null,
      status: 'HOSTESS_SIGNED',
      editable: true,
      createdAt: Date.now()
    });
    
    toast.success('Hostess signature captured');
  };

  // Manager signs second
  const handleManagerSign = async () => {
    if (!hostessSigned) {
      toast.error('Hostess must sign first');
      return;
    }
    if (!managerSignature || !managerName) {
      toast.error('Manager name and signature required');
      return;
    }
    
    const signedAt = new Date().toISOString();
    setManagerSigned(true);
    setManagerSignedAt(signedAt);
    setContractStatus('MANAGER_SIGNED');
    
    const existing = await getContract(guest.id);
    await saveContract({
      ...existing,
      managerSignature,
      managerSignedAt: signedAt,
      managerName,
      status: 'MANAGER_SIGNED'
    });
    
    toast.success('Manager signature captured');
  };

  // Client signs third (requires acknowledgment modal)
  const handleClientSignClick = () => {
    if (!managerSigned) {
      toast.error('Manager must sign first');
      return;
    }
    if (!clientSignature) {
      toast.error('Client signature required');
      return;
    }
    setShowAcknowledgmentModal(true);
  };

  const handleConfirmClientSign = async () => {
    if (!allModalTerms) {
      toast.error('All acknowledgments required');
      return;
    }

    const signedAt = new Date().toISOString();
    
    // Generate final hash with all 3 signatures
    const contractContent = JSON.stringify({
      guestId: guest.id,
      guestName: guest.guest_name,
      contractId,
      version: CONTRACT_VERSION,
      hostessSignature: hostessSignature?.substring(0, 50),
      hostessSignedAt,
      hostessName,
      managerSignature: managerSignature?.substring(0, 50),
      managerSignedAt,
      managerName,
      clientSignature: clientSignature?.substring(0, 50),
      clientSignedAt: signedAt,
      allSignedAt: signedAt,
      terms: modalTerms
    });

    const hash = await sha256(contractContent);
    
    setClientSigned(true);
    setClientSignedAt(signedAt);
    setContractHash(hash);
    setContractStatus('FULLY_SIGNED');

    const existing = await getContract(guest.id);
    await saveContract({
      ...existing,
      clientSignature,
      clientSignedAt: signedAt,
      documentHash: hash,
      status: 'FULLY_SIGNED',
      editable: false
    });

    // Also update Base44 entity
    try {
      await base44.entities.VIPGuest.update(guest.id, {
        contract_signed: true,
        contract_signed_date: signedAt,
        contract_version: CONTRACT_VERSION,
        contract_signature_hash: hash
      });
    } catch (err) {
      console.error('Failed to update Base44:', err);
    }

    setShowAcknowledgmentModal(false);
    toast.success('Contract fully signed and sealed!');
  };

  const handlePrint = () => {
    if (!guest || !allSigned) {
      toast.error('All 3 signatures required before printing');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintHTML());
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintHTML = () => `<!DOCTYPE html><html><head><title>VIP Contract - ${guest?.guest_name}</title><style>
    @page { margin: 0.5in; size: letter; }
    body { font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.4; color: #000; max-width: 8in; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 15px; }
    .title { font-size: 18pt; font-weight: bold; letter-spacing: 2px; }
    .subtitle { font-size: 9pt; color: #333; margin-top: 4px; }
    .section { margin: 10px 0; page-break-inside: avoid; }
    .section-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 6px; }
    .clause { margin: 4px 0; padding-left: 12px; text-align: justify; font-size: 9pt; }
    .guest-info { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #f8f8f8; padding: 10px; margin: 10px 0; border: 1px solid #ccc; }
    .info-label { font-weight: bold; font-size: 7pt; color: #444; }
    .signature-block { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; border-top: 2px solid #000; padding-top: 20px; }
    .signature-box { text-align: center; }
    .signature-img { max-width: 150px; max-height: 60px; border-bottom: 1px solid #000; margin-bottom: 4px; }
    .signature-label { font-size: 8pt; font-weight: bold; margin-top: 4px; }
    .signature-name { font-size: 9pt; }
    .signature-date { font-size: 7pt; color: #666; }
    .hash-box { background: #f0f0f0; padding: 8px; font-family: monospace; font-size: 6pt; word-break: break-all; margin-top: 20px; border: 1px solid #ccc; }
    .warning { border: 2px solid #000; padding: 6px; margin: 8px 0; background: #fff8dc; font-weight: bold; text-align: center; font-size: 9pt; }
    .legal-notice { font-size: 7pt; color: #444; margin-top: 15px; padding-top: 8px; border-top: 1px solid #ccc; }
  </style></head><body>
    <div class="header">
      <div class="title">${VENUE_NAME}</div>
      <div class="subtitle">VIP MEMBERSHIP AND SERVICE AGREEMENT</div>
      <div class="subtitle">${VENUE_LEGAL} • ${VENUE_ADDRESS}</div>
      <div class="subtitle">Contract Version ${CONTRACT_VERSION} | ${contractDate}</div>
    </div>
    <div class="warning">⚠️ LEGALLY BINDING CONTRACT - REQUIRES 3 SIGNATURES ⚠️</div>
    <div class="guest-info">
      <div><div class="info-label">FULL LEGAL NAME</div>${guest?.guest_name || '—'}</div>
      <div><div class="info-label">MEMBERSHIP ID</div>${guest?.membership_number || 'PENDING'}</div>
      <div><div class="info-label">DATE OF BIRTH</div>${guest?.date_of_birth || '—'}</div>
      <div><div class="info-label">VIP TIER</div>${guest?.vip_tier || 'Standard'}</div>
    </div>
    <div class="section"><div class="section-title">Article I - Age Verification</div><div class="clause">Member represents under penalty of perjury that Member is at least 21 years of age.</div></div>
    <div class="section"><div class="section-title">Article II - Code of Conduct</div><div class="clause">Member agrees to conduct themselves respectfully at all times.</div></div>
    <div class="section"><div class="section-title">Article III - Liability Release</div><div class="clause">MEMBER VOLUNTARILY ASSUMES ALL RISKS and RELEASES the Establishment from ALL LIABILITY.</div></div>
    <div class="section"><div class="section-title">Article IV - Arbitration</div><div class="clause">ALL DISPUTES resolved by BINDING ARBITRATION in Clark County, Nevada.</div></div>
    
    <div class="signature-block">
      <div class="signature-box">
        <img src="${hostessSignature}" class="signature-img" alt="Hostess Signature" />
        <div class="signature-label">HOSTESS SIGNATURE</div>
        <div class="signature-name">${hostessName}</div>
        <div class="signature-date">${hostessSignedAt ? new Date(hostessSignedAt).toLocaleString() : ''}</div>
      </div>
      <div class="signature-box">
        <img src="${managerSignature}" class="signature-img" alt="Manager Signature" />
        <div class="signature-label">MANAGER SIGNATURE</div>
        <div class="signature-name">${managerName}</div>
        <div class="signature-date">${managerSignedAt ? new Date(managerSignedAt).toLocaleString() : ''}</div>
      </div>
      <div class="signature-box">
        <img src="${clientSignature}" class="signature-img" alt="Client Signature" />
        <div class="signature-label">CLIENT SIGNATURE</div>
        <div class="signature-name">${guest?.guest_name}</div>
        <div class="signature-date">${clientSignedAt ? new Date(clientSignedAt).toLocaleString() : ''}</div>
      </div>
    </div>
    
    <div class="hash-box"><strong>DOCUMENT HASH (SHA-256):</strong><br>${contractHash}</div>
    <div class="legal-notice">
      <strong>Contract ID:</strong> ${contractId}<br>
      <strong>Version:</strong> ${CONTRACT_VERSION} | <strong>Status:</strong> ${contractStatus}<br>
      Governed by Nevada State Law • Binding Arbitration in Clark County<br>
      <em>ALL PARTIES HAVE RECEIVED A COPY OF THIS AGREEMENT</em>
    </div>
  </body></html>`;

  const getStatusBadge = () => {
    const statusColors = {
      'DRAFT': 'bg-slate-500/20 text-slate-400',
      'HOSTESS_SIGNED': 'bg-yellow-500/20 text-yellow-400',
      'MANAGER_SIGNED': 'bg-blue-500/20 text-blue-400',
      'FULLY_SIGNED': 'bg-green-500/20 text-green-400'
    };
    return <Badge className={statusColors[contractStatus] || statusColors['DRAFT']}>{contractStatus.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Guest Selection */}
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Search className="w-5 h-5 text-cyan-400" />Select Guest</CardTitle></CardHeader>
          <CardContent>
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..." className="mb-4 bg-slate-800 border-slate-600" />
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filtered.map(g => (
                <div key={g.id} onClick={() => setSelectedGuestId(g.id)} className={`p-3 rounded-lg border cursor-pointer ${selectedGuestId === g.id ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-white">{g.guest_name}</p><p className="text-xs text-slate-400">{g.membership_number || 'No ID'}</p></div>
                    {g.contract_signed && <Badge className="bg-green-500/20 text-green-400">Signed</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contract Signing - 3 Signatures */}
        <Card className="bg-slate-900/50 border-purple-500/30 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                {guest ? `Contract: ${guest.guest_name}` : 'Select a Guest'}
              </CardTitle>
              {guest && getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            {guest ? (
              <div className="space-y-6">
                {/* Guest Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-800/50 rounded-lg text-sm">
                  <div><p className="text-slate-500 text-xs">Name</p><p className="text-white">{guest.guest_name}</p></div>
                  <div><p className="text-slate-500 text-xs">ID</p><p className="text-white">{guest.membership_number || '—'}</p></div>
                  <div><p className="text-slate-500 text-xs">Tier</p><p className="text-amber-400">{guest.vip_tier || 'Standard'}</p></div>
                  <div><p className="text-slate-500 text-xs">DOB</p><ProtectedField requireRole="manager" mask maskLength={10}><p className="text-white">{guest.date_of_birth || '—'}</p></ProtectedField></div>
                </div>

                {/* 3 Signature Sections */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Hostess Signature */}
                  <Card className={`bg-slate-800/30 ${hostessSigned ? 'border-green-500/50' : 'border-yellow-500/50'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-yellow-400" />
                        1. Hostess
                        {hostessSigned && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-slate-400 text-xs">Hostess Name</Label>
                        <Input value={hostessName} onChange={e => setHostessName(e.target.value)} placeholder="Enter name" disabled={hostessSigned} className="bg-slate-900 border-slate-600 h-8 text-sm" />
                      </div>
                      <SignatureCapture onSignature={setHostessSignature} label="Hostess" disabled={hostessSigned} existingSignature={hostessSignature} />
                      {hostessSigned ? (
                        <p className="text-xs text-green-400">✅ Signed {new Date(hostessSignedAt).toLocaleTimeString()}</p>
                      ) : (
                        <Button size="sm" onClick={handleHostessSign} disabled={!hostessSignature || !hostessName} className="w-full bg-yellow-600 hover:bg-yellow-700">Sign</Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Manager Signature */}
                  <Card className={`bg-slate-800/30 ${managerSigned ? 'border-green-500/50' : hostessSigned ? 'border-blue-500/50' : 'border-slate-600 opacity-50'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        2. Manager
                        {managerSigned && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-slate-400 text-xs">Manager Name</Label>
                        <Input value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Enter name" disabled={!hostessSigned || managerSigned} className="bg-slate-900 border-slate-600 h-8 text-sm" />
                      </div>
                      <SignatureCapture onSignature={setManagerSignature} label="Manager" disabled={!hostessSigned || managerSigned} existingSignature={managerSignature} />
                      {managerSigned ? (
                        <p className="text-xs text-green-400">✅ Signed {new Date(managerSignedAt).toLocaleTimeString()}</p>
                      ) : (
                        <Button size="sm" onClick={handleManagerSign} disabled={!hostessSigned || !managerSignature || !managerName} className="w-full bg-blue-600 hover:bg-blue-700">Sign</Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Client Signature */}
                  <Card className={`bg-slate-800/30 ${clientSigned ? 'border-green-500/50' : managerSigned ? 'border-purple-500/50' : 'border-slate-600 opacity-50'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-400" />
                        3. Client
                        {clientSigned && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-slate-400 text-xs">Client Name</Label>
                        <Input value={guest.guest_name} disabled className="bg-slate-900 border-slate-600 h-8 text-sm" />
                      </div>
                      <SignatureCapture onSignature={setClientSignature} label="Client" disabled={!managerSigned || clientSigned} existingSignature={clientSignature} />
                      {clientSigned ? (
                        <p className="text-xs text-green-400">✅ Signed {new Date(clientSignedAt).toLocaleTimeString()}</p>
                      ) : (
                        <Button size="sm" onClick={handleClientSignClick} disabled={!managerSigned || !clientSignature} className="w-full bg-purple-600 hover:bg-purple-700">Sign</Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Hash Display */}
                {contractHash && (
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Document Hash (SHA-256)</p>
                    <p className="font-mono text-xs text-cyan-400 break-all">{contractHash}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handlePrint} disabled={!allSigned} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50">
                    <Printer className="w-4 h-4 mr-2" />
                    {allSigned ? 'Print Contract' : 'All 3 Signatures Required'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a guest to view/sign contract</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Blocking Acknowledgment Modal */}
      <Dialog open={showAcknowledgmentModal} onOpenChange={setShowAcknowledgmentModal}>
        <DialogContent className="bg-slate-900 border-amber-500/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Final Client Acknowledgment
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              All acknowledgments must be checked. This completes the contract.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {[
              { key: 'age', label: 'I am at least 21 years of age with valid ID.' },
              { key: 'conduct', label: 'I agree to the Code of Conduct.' },
              { key: 'liability', label: 'I RELEASE the Establishment from ALL LIABILITY.' },
              { key: 'arbitration', label: 'I agree to BINDING ARBITRATION.' }
            ].map(t => (
              <div key={t.key} className="flex items-start gap-3 p-2 bg-slate-800/50 rounded-lg">
                <Checkbox checked={modalTerms[t.key]} onCheckedChange={c => setModalTerms({ ...modalTerms, [t.key]: c })} className="mt-0.5 border-amber-500" />
                <span className="text-sm text-slate-300">{t.label}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAcknowledgmentModal(false)} className="border-slate-600">Cancel</Button>
            <Button onClick={handleConfirmClientSign} disabled={!allModalTerms} className="bg-gradient-to-r from-amber-600 to-red-600 disabled:opacity-50">
              <CheckCircle className="w-4 h-4 mr-2" />I Consent & Sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}