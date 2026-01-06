/**
 * VIP Client Contract Modal - Full Agreement
 * Must acknowledge before VIP transaction
 */

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const CONTRACT_TEXT = `VIP CLIENT LICENSE & CONDUCT AGREEMENT

PREAMBLE
THIS VIP CLIENT LICENSE & CONDUCT AGREEMENT ("Agreement") is entered into by and between DREAM PALACE CABARET, an Arizona business entity with principal place of business at 815 N Scottsdale Rd, Scottsdale, Arizona, Maricopa County ("Club") and the undersigned individual ("Client").

PURPOSE
Client seeks a temporary, revocable license to access private or VIP entertainment areas of Club premises. This Agreement governs facility access and conduct only.

ARTICLE I — LICENSE ONLY; NO SERVICES GUARANTEED
1.1 VIP access constitutes a revocable facility license only.
1.2 No specific entertainer, service, performance, or outcome is guaranteed.
1.3 Entertainers are independent contractors and NOT employees of Club.
1.4 Club does not control, direct, or supervise entertainer conduct or services.
1.5 Any arrangement between Client and Entertainer is a private matter between those parties.

ARTICLE II — FEES
2.1 All VIP access fees are FACILITY ACCESS FEES for use of premium Club space.
2.2 Fees are paid in advance or at time of access.
2.3 Fees are NON-REFUNDABLE regardless of duration, satisfaction, or early departure.
2.4 Fees are NON-TRANSFERABLE and cannot be applied to future visits.
2.5 Additional purchases (beverages, etc.) are separate transactions.

ARTICLE III — CONDUCT REQUIREMENTS
3.1 Client agrees to conduct themselves respectfully and lawfully at all times.
3.2 PROHIBITED CONDUCT includes but is not limited to:
    (a) Photography, video recording, or audio recording of any kind;
    (b) Possession or use of illegal substances;
    (c) Physical contact without explicit consent;
    (d) Harassment, coercion, or intimidation;
    (e) Negotiating for illegal services;
    (f) Intoxication to the point of impairment;
    (g) Violation of posted rules or staff instructions.
3.3 Violation of any conduct requirement results in IMMEDIATE REMOVAL WITHOUT REFUND.
3.4 Club reserves the right to refuse or revoke access at any time for any reason.

ARTICLE IV — ASSUMPTION OF RISK
4.1 Client acknowledges adult entertainment venues involve inherent risks including but not limited to: emotional distress, misunderstandings, financial loss, and interpersonal conflicts.
4.2 Client VOLUNTARILY ASSUMES ALL SUCH RISKS.
4.3 Client acknowledges no outcome or experience is guaranteed.

ARTICLE V — LIMITATION OF LIABILITY
5.1 Club is NOT liable for actions, statements, or conduct of entertainers or other patrons.
5.2 Club is NOT liable for personal property loss or damage.
5.3 Club's maximum liability under any circumstance is LIMITED TO THE AMOUNT PAID for the specific VIP session giving rise to the claim.
5.4 Club is NOT liable for consequential, incidental, or punitive damages.

ARTICLE VI — RELEASE & INDEMNIFICATION
6.1 Client hereby RELEASES Club, its owners, officers, employees, entertainers, security personnel, and technology providers from ANY AND ALL CLAIMS arising from Client's presence on premises or participation in VIP services.
6.2 Client agrees to INDEMNIFY AND HOLD HARMLESS Club from all claims, damages, and expenses arising from:
    (a) Client's conduct on premises;
    (b) Disputes between Client and entertainers;
    (c) Client's violation of this Agreement;
    (d) Client's violation of any law or regulation.

ARTICLE VII — PRIVACY & MONITORING
7.1 VIP areas may be monitored by security personnel and/or electronic surveillance for safety purposes.
7.2 Client has NO EXPECTATION OF PRIVACY beyond minimum legal requirements.
7.3 Club may retain records of Client visits for safety and compliance purposes.

ARTICLE VIII — DISPUTE RESOLUTION
8.1 This Agreement is governed by the laws of the State of Arizona.
8.2 All disputes shall be resolved by BINDING ARBITRATION in Maricopa County, Arizona.
8.3 CLIENT WAIVES THE RIGHT TO JURY TRIAL.
8.4 CLIENT WAIVES THE RIGHT TO PARTICIPATE IN CLASS ACTIONS.
8.5 Arbitration shall be conducted under AAA Commercial Arbitration Rules.

ARTICLE IX — DIGITAL EXECUTION
9.1 This Agreement may be executed electronically via NUPS / GlyphLock digital signature system.
9.2 Electronic acknowledgment, execution timestamp, and agreement hash constitute conclusive proof of acceptance.
9.3 Client acknowledges digital execution is legally binding under Arizona and federal electronic signature laws.

ARTICLE X — ENTIRE AGREEMENT
10.1 This Agreement constitutes the entire agreement regarding VIP access.
10.2 No oral representations or promises modify this Agreement.
10.3 If any provision is unenforceable, remaining provisions remain in effect.`;

export default function VIPContractModal({ open, onOpenChange, client, onAccepted }) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [acknowledgments, setAcknowledgments] = useState({
    license: false,
    fees: false,
    independent: false,
    arbitration: false
  });
  const [accepting, setAccepting] = useState(false);

  const allAcknowledged = Object.values(acknowledgments).every(Boolean);
  const canAccept = scrolledToEnd && allAcknowledged;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setScrolledToEnd(true);
    }
  };

  const handleAccept = async () => {
    if (!canAccept) return;
    setAccepting(true);

    const sessionId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const hashContent = JSON.stringify({
      clientId: client?.id,
      clientName: client?.guest_name,
      contractVersion: '1.0.0',
      timestamp,
      sessionId,
      acknowledgments
    });

    const agreementHash = await sha256(hashContent);

    const record = {
      clientId: client?.id,
      clientName: client?.guest_name,
      timestamp,
      sessionId,
      agreementHash,
      contractType: 'VIP_CLIENT_LICENSE',
      version: '1.0.0'
    };

    // Store in IndexedDB
    try {
      const db = await openContractDB();
      const tx = db.transaction('vipContracts', 'readwrite');
      tx.objectStore('vipContracts').put({ id: `${client?.id}-${sessionId}`, ...record });
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    } catch (err) {
      console.error('Failed to store contract:', err);
    }

    toast.success('Agreement accepted');
    setAccepting(false);
    onAccepted?.(record);
    onOpenChange(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>VIP Client Agreement</title><style>@page{margin:0.75in}body{font-family:Georgia,serif;font-size:11pt;line-height:1.6;max-width:8in;margin:0 auto;padding:20px}h1{text-align:center;font-size:14pt;border-bottom:2px solid #000;padding-bottom:10px}pre{white-space:pre-wrap;font-family:Georgia,serif;font-size:11pt}.sig-block{margin-top:40px;border-top:1px solid #000;padding-top:20px}.sig-line{margin-top:30px;border-top:1px solid #000;width:300px;padding-top:5px}</style></head><body><h1>DREAM PALACE CABARET</h1><pre>${CONTRACT_TEXT}</pre><div class="sig-block"><p><strong>CLIENT:</strong></p><div class="sig-line">Signature / Date / Time</div><p style="margin-top:20px"><strong>CLUB AUTHORIZED REPRESENTATIVE:</strong></p><div class="sig-line">Signature / Date / Time</div></div></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-amber-500/50 max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            VIP Client License & Conduct Agreement
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[400px] border border-slate-700 rounded-lg p-4 bg-slate-950" onScrollCapture={handleScroll}>
          <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">{CONTRACT_TEXT}</pre>
          <div className="h-4" />
        </ScrollArea>

        {!scrolledToEnd && (
          <p className="text-amber-400 text-xs text-center">⬇️ Scroll to bottom to enable acknowledgments</p>
        )}

        <div className={`space-y-2 py-2 ${!scrolledToEnd ? 'opacity-50 pointer-events-none' : ''}`}>
          {[
            { key: 'license', label: 'I acknowledge VIP access is a FACILITY LICENSE only.' },
            { key: 'fees', label: 'I acknowledge all fees are NON-REFUNDABLE.' },
            { key: 'independent', label: 'I acknowledge entertainers are INDEPENDENT CONTRACTORS.' },
            { key: 'arbitration', label: 'I accept BINDING ARBITRATION and WAIVE jury trial rights.' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-start gap-2 p-2 bg-slate-800/50 rounded">
              <Checkbox checked={acknowledgments[key]} onCheckedChange={(c) => setAcknowledgments(prev => ({ ...prev, [key]: c }))} disabled={!scrolledToEnd} />
              <span className="text-xs text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handlePrint} className="border-slate-600">
            <Printer className="w-4 h-4 mr-1" />Print
          </Button>
          <Button onClick={handleAccept} disabled={!canAccept || accepting} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 disabled:opacity-50">
            <CheckCircle className="w-4 h-4 mr-1" />{accepting ? 'Processing...' : 'I Accept'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function openContractDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NUPS_Contracts', 2);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('entertainerContracts')) db.createObjectStore('entertainerContracts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('vipContracts')) db.createObjectStore('vipContracts', { keyPath: 'id' });
    };
  });
}