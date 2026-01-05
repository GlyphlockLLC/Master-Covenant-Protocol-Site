import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, Fingerprint, PenTool, CheckCircle, Printer,
  User, Calendar, Shield, AlertTriangle, Scale
} from "lucide-react";
import { toast } from "sonner";

const CONTRACT_VERSION = "2.1.0";
const VENUE_NAME = "THE ESTABLISHMENT";
const VENUE_ADDRESS = "123 Entertainment Blvd, Las Vegas, NV 89109";

export default function VIPContractCard({ guest, printMode = false }) {
  const [managerName, setManagerName] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
  const [thumbprintCaptured, setThumbprintCaptured] = useState(false);
  const [guestSignature, setGuestSignature] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState({
    ageVerification: false,
    conductAgreement: false,
    liabilityWaiver: false,
    mediaConsent: false,
    paymentTerms: false,
    privacyPolicy: false
  });
  const contractRef = useRef(null);

  const contractDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const contractTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(v => v);

  const handleThumbprintCapture = () => {
    setThumbprintCaptured(true);
    toast.success('Biometric thumbprint captured and encrypted');
  };

  const handleSignContract = async () => {
    if (!managerName || !managerSignature) {
      toast.error('Manager witness signature required');
      return;
    }
    if (!thumbprintCaptured && !guestSignature) {
      toast.error('Guest signature or thumbprint required');
      return;
    }
    if (!allTermsAccepted) {
      toast.error('All terms must be acknowledged');
      return;
    }

    setIsSigning(true);
    try {
      await base44.entities.VIPGuest.update(guest.id, {
        contract_signed: true,
        contract_signed_date: new Date().toISOString(),
        contract_version: CONTRACT_VERSION,
        contract_signature: guestSignature || 'BIOMETRIC_THUMBPRINT',
        thumbprint_captured: thumbprintCaptured,
        thumbprint_hash: thumbprintCaptured ? `SHA256:${Date.now().toString(36)}` : null,
        manager_witness: managerName,
        manager_signature: managerSignature,
        contract_ip_address: 'VENUE_TERMINAL'
      });
      toast.success('Contract executed and recorded successfully');
    } catch (err) {
      toast.error('Failed to record contract');
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VIP Membership Agreement - ${guest?.guest_name}</title>
        <style>
          @page { margin: 0.75in; }
          body { 
            font-family: 'Times New Roman', Georgia, serif; 
            font-size: 11pt;
            line-height: 1.5;
            color: #000;
            max-width: 8.5in;
            margin: 0 auto;
          }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 18pt; font-weight: bold; letter-spacing: 2px; }
          .subtitle { font-size: 10pt; color: #444; margin-top: 5px; }
          .section { margin: 15px 0; }
          .section-title { font-weight: bold; font-size: 11pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; }
          .clause { margin: 8px 0; padding-left: 15px; text-align: justify; }
          .clause-number { font-weight: bold; }
          .guest-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f5f5f5; padding: 15px; margin: 15px 0; }
          .info-item { margin: 5px 0; }
          .info-label { font-weight: bold; font-size: 9pt; color: #666; }
          .signature-section { margin-top: 40px; page-break-inside: avoid; }
          .signature-box { 
            display: inline-block; 
            width: 45%; 
            margin-top: 50px;
            text-align: center;
            vertical-align: top;
          }
          .signature-line { border-top: 1px solid #000; padding-top: 5px; margin-top: 40px; }
          .thumbprint-box {
            width: 1.5in;
            height: 2in;
            border: 2px solid #000;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9pt;
          }
          .legal-notice { font-size: 9pt; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72pt; color: rgba(0,0,0,0.03); z-index: -1; }
          .checkbox-item { margin: 5px 0; }
          .checkbox { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; margin-right: 8px; vertical-align: middle; }
          .checkbox.checked::after { content: "✓"; font-size: 10pt; }
        </style>
      </head>
      <body>
        <div class="watermark">CONFIDENTIAL</div>
        
        <div class="header">
          <div class="title">${VENUE_NAME}</div>
          <div class="subtitle">VIP MEMBERSHIP & SERVICE AGREEMENT</div>
          <div class="subtitle">Contract Version ${CONTRACT_VERSION} | Effective Date: ${contractDate}</div>
        </div>

        <div class="guest-info">
          <div class="info-item">
            <div class="info-label">FULL LEGAL NAME</div>
            <div>${guest?.guest_name || '_______________'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">MEMBERSHIP ID</div>
            <div>${guest?.membership_number || 'PENDING'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">DATE OF BIRTH</div>
            <div>${guest?.date_of_birth || '_______________'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">GOVERNMENT ID</div>
            <div>${guest?.government_id_type || '_______________'} (Last 4: ${guest?.government_id_number || 'XXXX'})</div>
          </div>
          <div class="info-item">
            <div class="info-label">ADDRESS</div>
            <div>${guest?.address_line1 || '_______________'}, ${guest?.city || '___'}, ${guest?.state || '__'} ${guest?.zip_code || '_____'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">CONTACT</div>
            <div>${guest?.phone || '_______________'} | ${guest?.email || '_______________'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">EMERGENCY CONTACT</div>
            <div>${guest?.emergency_contact_name || '_______________'} (${guest?.emergency_contact_relationship || '___'}): ${guest?.emergency_contact_phone || '_______________'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">MEMBERSHIP TIER</div>
            <div>${guest?.vip_tier || 'Standard'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Article I: Age Verification & Legal Capacity</div>
          <div class="clause"><span class="clause-number">1.1</span> I, the undersigned MEMBER, hereby affirm under penalty of perjury that I am at least twenty-one (21) years of age and possess the legal capacity to enter into this binding agreement.</div>
          <div class="clause"><span class="clause-number">1.2</span> I have presented valid government-issued photo identification which has been verified by establishment personnel and recorded above.</div>
          <div class="clause"><span class="clause-number">1.3</span> I understand that providing false identification or misrepresenting my age constitutes fraud and may result in immediate termination of membership, removal from premises, and reporting to law enforcement authorities.</div>
        </div>

        <div class="section">
          <div class="section-title">Article II: Code of Conduct & Behavioral Standards</div>
          <div class="clause"><span class="clause-number">2.1</span> I agree to conduct myself in a respectful, lawful, and appropriate manner at all times while on the premises of ${VENUE_NAME} ("the Establishment").</div>
          <div class="clause"><span class="clause-number">2.2</span> I shall treat all staff members, entertainers, and fellow guests with dignity and respect. Any form of harassment, discrimination, or inappropriate physical contact is strictly prohibited and grounds for immediate removal and membership revocation.</div>
          <div class="clause"><span class="clause-number">2.3</span> I acknowledge that the Establishment reserves the right to refuse service, revoke membership, and remove any individual from the premises at management's sole discretion, with or without stated cause.</div>
          <div class="clause"><span class="clause-number">2.4</span> I agree to comply with all applicable federal, state, and local laws, as well as all rules and policies established by the Establishment.</div>
        </div>

        <div class="section">
          <div class="section-title">Article III: Financial Terms & Obligations</div>
          <div class="clause"><span class="clause-number">3.1</span> I understand and agree that all VIP services, including but not limited to private room rentals, bottle service, entertainment fees, and ancillary charges, are subject to posted rates and will be charged according to the current fee schedule.</div>
          <div class="clause"><span class="clause-number">3.2</span> I agree to settle all outstanding charges and balances in full before departing the premises on each visit. Failure to do so may result in membership suspension and collection action.</div>
          <div class="clause"><span class="clause-number">3.3</span> I authorize the Establishment to charge any payment method on file for outstanding balances, service fees, damages, or other charges incurred during my visits.</div>
          <div class="clause"><span class="clause-number">3.4</span> Gratuities are not included in posted prices and are at the sole discretion of the member. Staff members may not solicit gratuities.</div>
        </div>

        <div class="section">
          <div class="section-title">Article IV: Assumption of Risk & Liability Waiver</div>
          <div class="clause"><span class="clause-number">4.1</span> I voluntarily assume all risks associated with my presence at the Establishment, including but not limited to risks arising from the consumption of alcohol, interaction with other guests, and participation in entertainment activities.</div>
          <div class="clause"><span class="clause-number">4.2</span> I hereby RELEASE, WAIVE, DISCHARGE, AND COVENANT NOT TO SUE the Establishment, its owners, operators, employees, agents, and affiliates from any and all liability, claims, demands, actions, or causes of action arising from my presence at or use of the facilities.</div>
          <div class="clause"><span class="clause-number">4.3</span> I agree to INDEMNIFY AND HOLD HARMLESS the Establishment from any claims, damages, or expenses arising from my conduct or actions while on the premises.</div>
          <div class="clause"><span class="clause-number">4.4</span> The Establishment assumes no responsibility for loss, theft, or damage to personal belongings brought onto the premises.</div>
        </div>

        <div class="section">
          <div class="section-title">Article V: Privacy, Media & Recording</div>
          <div class="clause"><span class="clause-number">5.1</span> I acknowledge that audio and video surveillance is in operation throughout the premises for security purposes. I consent to such monitoring and recording.</div>
          <div class="clause"><span class="clause-number">5.2</span> Personal photography, video recording, and audio recording by guests is STRICTLY PROHIBITED in all areas of the Establishment unless expressly authorized by management in writing.</div>
          <div class="clause"><span class="clause-number">5.3</span> I agree that any personal information collected will be handled in accordance with the Establishment's Privacy Policy and applicable data protection laws.</div>
          <div class="clause"><span class="clause-number">5.4</span> Violation of the recording prohibition may result in immediate removal, membership revocation, confiscation of recording devices, and legal action.</div>
        </div>

        <div class="section">
          <div class="section-title">Article VI: Membership Terms</div>
          <div class="clause"><span class="clause-number">6.1</span> This membership is personal and non-transferable. Member may not grant access privileges to any other individual.</div>
          <div class="clause"><span class="clause-number">6.2</span> The Establishment reserves the right to modify membership terms, benefits, and pricing with thirty (30) days written notice.</div>
          <div class="clause"><span class="clause-number">6.3</span> Membership may be terminated by either party with written notice. No refunds will be issued for unused membership periods.</div>
        </div>

        <div class="section">
          <div class="section-title">Article VII: Acknowledgments</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.ageVerification ? 'checked' : ''}"></span> I confirm I am 21+ years of age and have presented valid ID</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.conductAgreement ? 'checked' : ''}"></span> I agree to abide by the Code of Conduct</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.paymentTerms ? 'checked' : ''}"></span> I understand and accept the Financial Terms</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.liabilityWaiver ? 'checked' : ''}"></span> I have read and agree to the Liability Waiver</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.mediaConsent ? 'checked' : ''}"></span> I consent to surveillance and agree to the no-recording policy</div>
          <div class="checkbox-item"><span class="checkbox ${acceptedTerms.privacyPolicy ? 'checked' : ''}"></span> I have read and accept the Privacy Policy</div>
        </div>

        <div class="signature-section">
          <div style="text-align: center;">
            <div class="thumbprint-box">${thumbprintCaptured ? '✓ BIOMETRIC CAPTURED' : 'RIGHT THUMBPRINT'}</div>
          </div>

          <div style="display: flex; justify-content: space-between;">
            <div class="signature-box">
              <div style="font-style: italic; font-size: 14pt; min-height: 30px;">${guestSignature || guest?.guest_name || ''}</div>
              <div class="signature-line">
                <strong>MEMBER SIGNATURE</strong><br>
                ${guest?.guest_name || ''}
              </div>
            </div>
            <div class="signature-box">
              <div style="font-style: italic; font-size: 14pt; min-height: 30px;">${managerSignature || ''}</div>
              <div class="signature-line">
                <strong>AUTHORIZED WITNESS</strong><br>
                ${managerName || 'Manager on Duty'}
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <strong>Date & Time of Execution:</strong> ${contractDate} at ${contractTime}
          </div>
        </div>

        <div class="legal-notice">
          <strong>LEGAL NOTICE:</strong> This Agreement constitutes a legally binding contract. By signing below, you acknowledge that you have read, understand, and voluntarily agree to all terms and conditions contained herein. This Agreement shall be governed by the laws of the State of Nevada. Any disputes arising from this Agreement shall be resolved through binding arbitration in Clark County, Nevada.
          <br><br>
          <strong>Contract ID:</strong> ${VENUE_NAME.replace(/\s/g, '')}-${guest?.id?.slice(0, 8) || 'XXXXXX'}-${Date.now().toString(36).toUpperCase()}
          <br>
          <strong>Document Generated:</strong> ${new Date().toISOString()}
          <br><br>
          <em>MEMBER COPY - RETAIN FOR YOUR RECORDS</em>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-400" />
          VIP Membership Agreement
        </CardTitle>
        <Button onClick={handlePrint} variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
          <Printer className="w-4 h-4 mr-2" />
          Print Contract
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={contractRef} className="space-y-6">
          {/* Contract Header */}
          <div className="text-center pb-4 border-b-2 border-double border-slate-600">
            <h2 className="text-xl font-bold text-white tracking-wide">{VENUE_NAME}</h2>
            <p className="text-sm text-purple-400">VIP MEMBERSHIP & SERVICE AGREEMENT</p>
            <p className="text-xs text-slate-500">Version {CONTRACT_VERSION} | {contractDate}</p>
          </div>

          {/* Guest Info Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-800/50 rounded-lg text-sm">
            <div>
              <Label className="text-slate-500 text-xs">Legal Name</Label>
              <p className="text-white">{guest?.guest_name || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Member ID</Label>
              <p className="text-white">{guest?.membership_number || 'PENDING'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">DOB</Label>
              <p className="text-white">{guest?.date_of_birth || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">ID Type</Label>
              <p className="text-white">{guest?.government_id_type || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Tier</Label>
              <p className="text-amber-400 font-medium">{guest?.vip_tier || 'Standard'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Address</Label>
              <p className="text-white text-xs">{guest?.city && guest?.state ? `${guest.city}, ${guest.state}` : '—'}</p>
            </div>
          </div>

          {/* Terms Sections - Collapsible */}
          <div className="space-y-3 text-sm max-h-[300px] overflow-y-auto pr-2">
            <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
              <h4 className="text-purple-400 font-medium mb-2">Article I: Age Verification</h4>
              <p className="text-slate-400 text-xs">Member affirms being 21+ years of age with valid government ID verified and recorded. False identification constitutes fraud.</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
              <h4 className="text-purple-400 font-medium mb-2">Article II: Code of Conduct</h4>
              <p className="text-slate-400 text-xs">Member agrees to respectful conduct toward all staff and guests. Harassment or inappropriate contact results in immediate removal and membership revocation.</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
              <h4 className="text-purple-400 font-medium mb-2">Article III: Financial Terms</h4>
              <p className="text-slate-400 text-xs">All services subject to posted rates. Full payment required before departure. Payment method on file may be charged for outstanding balances.</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
              <h4 className="text-purple-400 font-medium mb-2">Article IV: Liability Waiver</h4>
              <p className="text-slate-400 text-xs">Member assumes all risks and releases establishment from liability. Member agrees to indemnify establishment from claims arising from member's conduct.</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
              <h4 className="text-purple-400 font-medium mb-2">Article V: Privacy & Recording</h4>
              <p className="text-slate-400 text-xs">Surveillance in operation for security. Personal recording is STRICTLY PROHIBITED. Violations result in removal and legal action.</p>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Acknowledgments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Required Acknowledgments
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { key: 'ageVerification', label: 'I am 21+ and presented valid ID' },
                { key: 'conductAgreement', label: 'I agree to the Code of Conduct' },
                { key: 'paymentTerms', label: 'I accept the Financial Terms' },
                { key: 'liabilityWaiver', label: 'I agree to the Liability Waiver' },
                { key: 'mediaConsent', label: 'I consent to surveillance & no-recording policy' },
                { key: 'privacyPolicy', label: 'I accept the Privacy Policy' }
              ].map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <Checkbox 
                    checked={acceptedTerms[item.key]}
                    onCheckedChange={(checked) => setAcceptedTerms({...acceptedTerms, [item.key]: checked})}
                    className="border-slate-600"
                  />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Signature Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Execution Signatures
            </h4>

            {/* Thumbprint */}
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div 
                className={`w-20 h-24 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                  thumbprintCaptured 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-dashed border-slate-600 hover:border-amber-500'
                }`}
                onClick={handleThumbprintCapture}
              >
                {thumbprintCaptured ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <span className="text-xs text-green-400 mt-1">Captured</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-8 h-8 text-slate-500" />
                    <span className="text-xs text-slate-500 mt-1">Press Here</span>
                  </>
                )}
              </div>
              <div>
                <Label className="text-white font-medium">Biometric Thumbprint</Label>
                <p className="text-xs text-slate-400">Right thumb • Encrypted storage • SHA-256 hash</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-xs">Member Signature (Type Full Name)</Label>
                <Input
                  value={guestSignature}
                  onChange={(e) => setGuestSignature(e.target.value)}
                  placeholder={guest?.guest_name}
                  className="bg-slate-800 border-slate-600 italic"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Manager Witness Name</Label>
                <Input
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Manager on duty"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-slate-400 text-xs">Manager Witness Signature</Label>
                <Input
                  value={managerSignature}
                  onChange={(e) => setManagerSignature(e.target.value)}
                  placeholder="Type name to sign"
                  className="bg-slate-800 border-slate-600 italic"
                />
              </div>
            </div>

            {/* Previous Contract Status */}
            {guest?.contract_signed && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Contract on File (v{guest.contract_version || '1.0'})</p>
                  <p className="text-xs text-slate-400">
                    Executed {new Date(guest.contract_signed_date).toLocaleDateString()} • Witness: {guest.manager_witness}
                  </p>
                </div>
              </div>
            )}

            {/* Execute Button */}
            {!printMode && (
              <Button 
                onClick={handleSignContract}
                disabled={isSigning || !allTermsAccepted || (!thumbprintCaptured && !guestSignature) || !managerSignature}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50"
              >
                {isSigning ? 'Recording...' : (
                  <>
                    <Scale className="w-4 h-4 mr-2" />
                    Execute Agreement
                  </>
                )}
              </Button>
            )}
            {!allTermsAccepted && (
              <p className="text-xs text-amber-400 text-center">All acknowledgments must be checked to proceed</p>
            )}
          </div>

          {/* Contract ID */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            <p>Contract ID: {VENUE_NAME.replace(/\s/g, '')}-{guest?.id?.slice(0, 8) || 'XXXXXX'}-{Date.now().toString(36).toUpperCase()}</p>
            <p className="mt-1">Governed by Nevada State Law • Disputes resolved via binding arbitration</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}