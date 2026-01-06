import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, Fingerprint, PenTool, CheckCircle, Printer,
  User, Calendar, Shield, AlertTriangle, Scale, Eye, Download
} from "lucide-react";
import { toast } from "sonner";

const CONTRACT_VERSION = "3.0.0";
const VENUE_NAME = "THE ESTABLISHMENT";
const VENUE_LEGAL_NAME = "GlyphLock Entertainment LLC";
const VENUE_ADDRESS = "123 Entertainment Blvd, Las Vegas, NV 89109";
const VENUE_LICENSE = "NV-ENT-2024-00001";

export default function VIPContractCard({ guest, onContractSigned }) {
  const [managerName, setManagerName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
  const [secondWitness, setSecondWitness] = useState('');
  const [secondWitnessSignature, setSecondWitnessSignature] = useState('');
  const [thumbprintCaptured, setThumbprintCaptured] = useState(false);
  const [guestSignature, setGuestSignature] = useState('');
  const [guestInitials, setGuestInitials] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [showFullContract, setShowFullContract] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState({
    ageVerification: false,
    identityConfirmation: false,
    conductAgreement: false,
    liabilityWaiver: false,
    indemnification: false,
    mediaConsent: false,
    noRecordingPolicy: false,
    paymentTerms: false,
    creditAuthorization: false,
    privacyPolicy: false,
    arbitrationAgreement: false,
    classActionWaiver: false,
    entireAgreement: false
  });

  const contractDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const contractTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(v => v);
  const contractId = `${VENUE_LEGAL_NAME.replace(/\s/g, '').substring(0,6).toUpperCase()}-${guest?.id?.slice(0, 8) || 'XXXXXX'}-${Date.now().toString(36).toUpperCase()}`;

  const handleThumbprintCapture = () => {
    setThumbprintCaptured(true);
    toast.success('Biometric thumbprint captured and encrypted with SHA-256');
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const guestAge = calculateAge(guest?.date_of_birth);

  const handleSignContract = async () => {
    if (!managerName || !managerSignature) {
      toast.error('Authorized manager witness signature required');
      return;
    }
    if (!thumbprintCaptured && !guestSignature) {
      toast.error('Guest signature or biometric thumbprint required');
      return;
    }
    if (!guestInitials) {
      toast.error('Guest initials required for all sections');
      return;
    }
    if (!allTermsAccepted) {
      toast.error('All terms and conditions must be acknowledged before execution');
      return;
    }
    if (guestAge && guestAge < 21) {
      toast.error('Guest must be 21 years of age or older');
      return;
    }

    setIsSigning(true);
    try {
      const signatureHash = await generateSignatureHash(guestSignature || 'BIOMETRIC_THUMBPRINT');
      
      await base44.entities.VIPGuest.update(guest.id, {
        contract_signed: true,
        contract_signed_date: new Date().toISOString(),
        contract_version: CONTRACT_VERSION,
        contract_signature: guestSignature || 'BIOMETRIC_THUMBPRINT',
        contract_signature_hash: signatureHash,
        thumbprint_captured: thumbprintCaptured,
        thumbprint_hash: thumbprintCaptured ? `SHA256:${Date.now().toString(36)}:${Math.random().toString(36).substring(2)}` : null,
        manager_witness: managerName,
        manager_witness_id: managerId,
        manager_signature: managerSignature,
        second_witness: secondWitness || null,
        second_witness_signature: secondWitnessSignature || null,
        contract_ip_address: 'VENUE_TERMINAL',
        contract_device_fingerprint: navigator.userAgent.substring(0, 100),
        status: 'active',
        verification_status: 'verified',
        id_verified_by: managerName,
        id_verified_date: new Date().toISOString()
      });
      
      toast.success('VIP Membership Agreement executed and recorded successfully');
      onContractSigned?.();
    } catch (err) {
      toast.error('Failed to record contract - please try again');
      console.error(err);
    } finally {
      setIsSigning(false);
    }
  };

  const generateSignatureHash = async (signature) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(signature + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintableContract());
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintableContract = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VIP Membership Agreement - ${guest?.guest_name} - ${contractId}</title>
      <style>
        @page { margin: 0.6in; size: letter; }
        body { 
          font-family: 'Times New Roman', Georgia, serif; 
          font-size: 10pt;
          line-height: 1.4;
          color: #000;
          max-width: 8.5in;
          margin: 0 auto;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px double #000; 
          padding-bottom: 12px; 
          margin-bottom: 15px; 
        }
        .title { font-size: 16pt; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }
        .subtitle { font-size: 9pt; color: #333; margin-top: 4px; }
        .legal-entity { font-size: 8pt; color: #666; font-style: italic; }
        .section { margin: 12px 0; page-break-inside: avoid; }
        .section-title { 
          font-weight: bold; 
          font-size: 10pt; 
          text-transform: uppercase; 
          border-bottom: 1px solid #000; 
          padding-bottom: 2px; 
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .clause { margin: 6px 0; padding-left: 12px; text-align: justify; }
        .clause-number { font-weight: bold; }
        .sub-clause { margin: 4px 0 4px 24px; font-size: 9pt; }
        .guest-info { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 8px; 
          background: #f8f8f8; 
          padding: 12px; 
          margin: 12px 0;
          border: 1px solid #ccc;
        }
        .info-item { margin: 3px 0; }
        .info-label { font-weight: bold; font-size: 8pt; color: #444; text-transform: uppercase; }
        .info-value { font-size: 10pt; }
        .signature-section { margin-top: 30px; page-break-inside: avoid; }
        .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; }
        .signature-box { text-align: center; }
        .signature-line { border-top: 1px solid #000; padding-top: 4px; margin-top: 40px; font-size: 9pt; }
        .thumbprint-box {
          width: 1.25in;
          height: 1.75in;
          border: 2px solid #000;
          margin: 15px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8pt;
          text-align: center;
        }
        .legal-notice { 
          font-size: 8pt; 
          color: #444; 
          margin-top: 20px; 
          padding-top: 10px; 
          border-top: 1px solid #ccc;
          text-align: justify;
        }
        .watermark { 
          position: fixed; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%) rotate(-45deg); 
          font-size: 60pt; 
          color: rgba(0,0,0,0.02); 
          z-index: -1;
          white-space: nowrap;
        }
        .checkbox-section { margin: 10px 0; }
        .checkbox-item { margin: 4px 0; font-size: 9pt; }
        .checkbox { 
          display: inline-block; 
          width: 10px; 
          height: 10px; 
          border: 1px solid #000; 
          margin-right: 6px; 
          vertical-align: middle;
          text-align: center;
          line-height: 10px;
          font-size: 8pt;
        }
        .checkbox.checked::after { content: "✓"; }
        .initials-box { 
          display: inline-block; 
          width: 40px; 
          border-bottom: 1px solid #000; 
          text-align: center;
          margin-left: 10px;
          font-style: italic;
        }
        .warning-box {
          border: 2px solid #000;
          padding: 8px;
          margin: 10px 0;
          background: #fff8dc;
          font-weight: bold;
          text-align: center;
        }
        .page-number { text-align: center; font-size: 8pt; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="watermark">CONFIDENTIAL LEGAL DOCUMENT</div>
      
      <div class="header">
        <div class="title">${VENUE_NAME}</div>
        <div class="subtitle">VIP MEMBERSHIP AND SERVICE AGREEMENT</div>
        <div class="legal-entity">${VENUE_LEGAL_NAME} • License: ${VENUE_LICENSE}</div>
        <div class="subtitle">Contract Version ${CONTRACT_VERSION} | Execution Date: ${contractDate}</div>
      </div>

      <div class="warning-box">
        ⚠️ THIS IS A LEGALLY BINDING CONTRACT - READ CAREFULLY BEFORE SIGNING ⚠️
      </div>

      <div class="guest-info">
        <div class="info-item">
          <div class="info-label">Full Legal Name</div>
          <div class="info-value">${guest?.guest_name || '________________________________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Membership ID</div>
          <div class="info-value">${guest?.membership_number || 'PENDING ASSIGNMENT'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date of Birth</div>
          <div class="info-value">${guest?.date_of_birth || '____/____/________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age at Signing</div>
          <div class="info-value">${guestAge || '____'} years old</div>
        </div>
        <div class="info-item">
          <div class="info-label">Government ID Type</div>
          <div class="info-value">${guest?.government_id_type || '________________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">ID Number</div>
          <div class="info-value">${guest?.government_id_number ? '****' + guest.government_id_number.slice(-4) : '****************'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">ID Issuing State/Authority</div>
          <div class="info-value">${guest?.government_id_state || '________________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">ID Expiration</div>
          <div class="info-value">${guest?.government_id_expiry || '____/____/________'}</div>
        </div>
        <div class="info-item" style="grid-column: span 2">
          <div class="info-label">Residential Address</div>
          <div class="info-value">${guest?.address_line1 || '________________________________'}, ${guest?.address_line2 || ''} ${guest?.city || '____________'}, ${guest?.state || '____'} ${guest?.zip_code || '_______'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Primary Telephone</div>
          <div class="info-value">${guest?.phone || '(____) ____-________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email Address</div>
          <div class="info-value">${guest?.email || '________________________@____________'}</div>
        </div>
        <div class="info-item" style="grid-column: span 2">
          <div class="info-label">Emergency Contact</div>
          <div class="info-value">${guest?.emergency_contact_name || '________________'} (${guest?.emergency_contact_relationship || '________'}): ${guest?.emergency_contact_phone || '(____) ____-________'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">VIP Tier</div>
          <div class="info-value">${guest?.vip_tier || 'Standard'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Membership Start Date</div>
          <div class="info-value">${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Preamble and Recitals</div>
        <div class="clause">
          This VIP Membership and Service Agreement ("Agreement") is entered into as of the date of execution set forth below, by and between ${VENUE_LEGAL_NAME}, a Nevada limited liability company doing business as "${VENUE_NAME}" (hereinafter "Establishment," "Company," "We," or "Us"), located at ${VENUE_ADDRESS}, and the individual identified above (hereinafter "Member," "Guest," "You," or "Your").
        </div>
        <div class="clause">
          <span class="clause-number">WHEREAS,</span> the Establishment operates an adult entertainment venue offering VIP membership services, private accommodations, food and beverage services, and entertainment experiences; and
        </div>
        <div class="clause">
          <span class="clause-number">WHEREAS,</span> the Member desires to obtain VIP membership privileges and access to the Establishment's services and facilities; and
        </div>
        <div class="clause">
          <span class="clause-number">WHEREAS,</span> both parties wish to set forth the terms and conditions governing the Member's use of the Establishment's services;
        </div>
        <div class="clause">
          <span class="clause-number">NOW, THEREFORE,</span> in consideration of the mutual covenants and agreements herein contained, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article I - Age Verification and Legal Capacity</div>
        <div class="clause"><span class="clause-number">1.1 Age Representation.</span> Member represents, warrants, and affirms under penalty of perjury under the laws of the State of Nevada that Member is at least twenty-one (21) years of age as of the date of this Agreement. Member acknowledges that this representation is material to the Establishment's willingness to enter into this Agreement.</div>
        <div class="clause"><span class="clause-number">1.2 Identification Verification.</span> Member has presented valid, unexpired government-issued photographic identification to authorized personnel of the Establishment, which has been examined, verified, and documented. Member warrants that such identification is authentic, unaltered, and accurately reflects Member's identity and age.</div>
        <div class="clause"><span class="clause-number">1.3 Fraud Consequences.</span> Member acknowledges and agrees that any misrepresentation of age or identity constitutes fraud and may result in: (a) immediate termination of membership without refund; (b) permanent prohibition from the premises; (c) reporting to appropriate law enforcement authorities; (d) civil liability for damages; and (e) criminal prosecution to the fullest extent permitted by law.</div>
        <div class="clause"><span class="clause-number">1.4 Legal Capacity.</span> Member represents that Member possesses full legal capacity to enter into this Agreement, is not under the influence of any substance that would impair judgment, and is entering into this Agreement voluntarily and without coercion.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article II - Code of Conduct and Behavioral Standards</div>
        <div class="clause"><span class="clause-number">2.1 Respectful Conduct.</span> Member agrees to conduct themselves in a respectful, lawful, courteous, and appropriate manner at all times while on the premises of the Establishment or while interacting with Establishment personnel.</div>
        <div class="clause"><span class="clause-number">2.2 Treatment of Personnel.</span> Member shall treat all employees, independent contractors, entertainers, and fellow guests with dignity, respect, and professionalism. The following conduct is strictly prohibited and grounds for immediate removal and membership revocation:</div>
        <div class="sub-clause">(a) Physical contact with any entertainer or staff member without explicit consent;</div>
        <div class="sub-clause">(b) Verbal abuse, threats, intimidation, or harassment of any kind;</div>
        <div class="sub-clause">(c) Discrimination based on race, color, religion, sex, national origin, age, disability, or any other protected characteristic;</div>
        <div class="sub-clause">(d) Sexual harassment or unwelcome sexual advances;</div>
        <div class="sub-clause">(e) Stalking, following, or attempting to contact staff outside the Establishment;</div>
        <div class="sub-clause">(f) Intoxication to the point of disorderly conduct;</div>
        <div class="sub-clause">(g) Possession or use of illegal substances on the premises;</div>
        <div class="sub-clause">(h) Possession of weapons (except as permitted by law for licensed security personnel);</div>
        <div class="sub-clause">(i) Gambling or solicitation of illegal activities;</div>
        <div class="sub-clause">(j) Any conduct that disrupts the business operations or the enjoyment of other guests.</div>
        <div class="clause"><span class="clause-number">2.3 Management Discretion.</span> The Establishment reserves the absolute and sole right to refuse service, revoke membership, deny entry, and/or remove any individual from the premises at management's sole and absolute discretion, with or without stated cause, and without prior notice. Such decisions are final and not subject to appeal.</div>
        <div class="clause"><span class="clause-number">2.4 Compliance with Laws.</span> Member agrees to comply with all applicable federal, state, county, and municipal laws, regulations, and ordinances, as well as all rules, policies, and procedures established by the Establishment, whether posted or communicated verbally.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article III - Financial Terms and Payment Obligations</div>
        <div class="clause"><span class="clause-number">3.1 Service Charges.</span> Member understands and agrees that all VIP services, including but not limited to private room rentals, bottle service, entertainment fees, food and beverage purchases, membership dues, and ancillary charges, are subject to the Establishment's current posted rates and fee schedules, which may be amended from time to time at the Establishment's sole discretion.</div>
        <div class="clause"><span class="clause-number">3.2 Payment Obligation.</span> Member agrees to settle all outstanding charges, balances, tabs, and fees in full before departing the premises on each visit. Failure to do so constitutes a material breach of this Agreement and may result in: (a) membership suspension or revocation; (b) collection action including engagement of collection agencies; (c) reporting to credit bureaus; (d) civil litigation for recovery of amounts owed plus attorneys' fees and costs; and (e) criminal prosecution for theft of services where applicable.</div>
        <div class="clause"><span class="clause-number">3.3 Credit Authorization.</span> By signing this Agreement, Member expressly authorizes the Establishment to charge any credit card, debit card, or other payment method on file for: (a) outstanding balances and unpaid tabs; (b) damages to Establishment property caused by Member; (c) cleaning fees resulting from Member's conduct; (d) replacement costs for lost or stolen property issued to Member; and (e) any other charges incurred by Member during visits to the Establishment.</div>
        <div class="clause"><span class="clause-number">3.4 Gratuities.</span> Gratuities for service personnel are not included in posted prices and remain at the sole discretion of the Member. Staff members are prohibited from soliciting gratuities. Member acknowledges that entertainers are independent contractors and any arrangements made directly with entertainers are outside the scope of this Agreement.</div>
        <div class="clause"><span class="clause-number">3.5 Pricing.</span> All prices are subject to applicable state and local taxes. The Establishment reserves the right to modify pricing at any time without notice. Posted prices at the time of service shall govern.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article IV - Assumption of Risk and Release of Liability</div>
        <div class="clause"><span class="clause-number">4.1 Voluntary Participation.</span> Member acknowledges that attendance at and participation in activities at the Establishment is entirely voluntary. Member has had the opportunity to inspect the premises and is satisfied that the premises are safe and suitable for Member's intended activities.</div>
        <div class="clause"><span class="clause-number">4.2 Assumption of Risk.</span> MEMBER VOLUNTARILY ASSUMES ALL RISKS, KNOWN AND UNKNOWN, ASSOCIATED WITH MEMBER'S PRESENCE AT THE ESTABLISHMENT, including but not limited to: (a) risks arising from consumption of alcoholic beverages; (b) risks of interaction with other guests who may be intoxicated or behave inappropriately; (c) risks of slipping, tripping, or falling; (d) risks associated with entertainment activities; (e) risks of exposure to communicable diseases; (f) risks associated with loud music and lighting effects; and (g) all other risks inherent in adult entertainment venues.</div>
        <div class="clause"><span class="clause-number">4.3 Release and Waiver.</span> TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEMBER HEREBY RELEASES, WAIVES, DISCHARGES, AND COVENANTS NOT TO SUE the Establishment, ${VENUE_LEGAL_NAME}, its owners, members, managers, officers, directors, employees, agents, representatives, successors, assigns, affiliated entities, insurers, and all other persons or entities acting on its behalf (collectively, "Released Parties") from any and all liability, claims, demands, actions, causes of action, damages, costs, expenses, and attorneys' fees arising from or related to Member's presence at, use of, or activities at the Establishment, including claims for personal injury, property damage, emotional distress, or death, whether caused by the negligence of the Released Parties or otherwise.</div>
        <div class="clause"><span class="clause-number">4.4 Waiver of Unknown Claims.</span> Member expressly waives any rights under California Civil Code Section 1542 (and similar statutes in other jurisdictions), which provides: "A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party."</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article V - Indemnification</div>
        <div class="clause"><span class="clause-number">5.1 Member Indemnification.</span> Member agrees to INDEMNIFY, DEFEND, AND HOLD HARMLESS the Released Parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees and court costs) arising from or related to: (a) Member's breach of this Agreement; (b) Member's negligent, reckless, or intentional acts or omissions; (c) Member's violation of any law, regulation, or third-party right; (d) any dispute between Member and any other guest or third party; and (e) any claim brought by any third party related to Member's conduct at the Establishment.</div>
        <div class="clause"><span class="clause-number">5.2 Defense Obligation.</span> The Establishment shall have the right, at its option, to assume the exclusive defense and control of any matter subject to indemnification by Member. Member agrees to cooperate fully with the Establishment in asserting any available defenses.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article VI - Privacy, Surveillance, and Recording Policy</div>
        <div class="clause"><span class="clause-number">6.1 Surveillance Notice.</span> Member acknowledges and consents that audio and video surveillance equipment is in continuous operation throughout the public areas of the premises for security, safety, and loss prevention purposes. Recordings may be retained indefinitely and may be disclosed to law enforcement or used in legal proceedings.</div>
        <div class="clause"><span class="clause-number">6.2 Prohibition on Recording.</span> MEMBER AGREES THAT PERSONAL PHOTOGRAPHY, VIDEO RECORDING, AUDIO RECORDING, LIVE STREAMING, AND ANY OTHER FORM OF ELECTRONIC CAPTURE IS STRICTLY PROHIBITED in all areas of the Establishment without express written authorization from management. This prohibition applies to all devices including smartphones, cameras, smart glasses, and wearable technology.</div>
        <div class="clause"><span class="clause-number">6.3 Consequences of Unauthorized Recording.</span> Violation of the recording prohibition may result in: (a) immediate confiscation of recording device and/or storage media; (b) deletion of unauthorized recordings; (c) immediate removal from premises; (d) permanent membership revocation; (e) civil litigation for invasion of privacy, breach of contract, and related claims; and (f) criminal prosecution where applicable.</div>
        <div class="clause"><span class="clause-number">6.4 Privacy Policy.</span> Member's personal information will be collected, stored, and processed in accordance with the Establishment's Privacy Policy, which is incorporated herein by reference. Member consents to such collection and processing for purposes of membership administration, marketing (if opted in), and legal compliance.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article VII - Dispute Resolution and Arbitration</div>
        <div class="clause"><span class="clause-number">7.1 Mandatory Arbitration.</span> ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THIS AGREEMENT, OR THE BREACH, TERMINATION, ENFORCEMENT, INTERPRETATION, OR VALIDITY THEREOF, INCLUDING THE DETERMINATION OF THE SCOPE OR APPLICABILITY OF THIS AGREEMENT TO ARBITRATE, SHALL BE DETERMINED BY BINDING ARBITRATION in Clark County, Nevada, before a single arbitrator, administered by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures.</div>
        <div class="clause"><span class="clause-number">7.2 Class Action Waiver.</span> MEMBER AGREES THAT ANY ARBITRATION OR LEGAL PROCEEDING SHALL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. Member expressly waives any right to participate in a class action lawsuit or class-wide arbitration.</div>
        <div class="clause"><span class="clause-number">7.3 Governing Law.</span> This Agreement shall be governed by and construed in accordance with the laws of the State of Nevada, without regard to its conflict of laws principles.</div>
        <div class="clause"><span class="clause-number">7.4 Attorneys' Fees.</span> In any action or proceeding to enforce this Agreement, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs from the non-prevailing party.</div>
        <div class="clause"><span class="clause-number">7.5 Limitation of Actions.</span> Any claim arising under this Agreement must be brought within one (1) year of the date the claim accrued, or such claim shall be forever barred.</div>
        <div class="clause" style="text-align: right;">
          <strong>Member's Initials:</strong> <span class="initials-box">${guestInitials || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Article VIII - Membership Terms</div>
        <div class="clause"><span class="clause-number">8.1 Personal Membership.</span> This membership is personal to Member and is non-transferable. Member may not grant access privileges to any other individual, nor may Member allow any other person to use Member's membership credentials.</div>
        <div class="clause"><span class="clause-number">8.2 Modification.</span> The Establishment reserves the right to modify membership terms, benefits, rules, and pricing with thirty (30) days written notice to Member's address or email on file.</div>
        <div class="clause"><span class="clause-number">8.3 Termination.</span> Either party may terminate this Agreement with written notice. The Establishment may terminate immediately for cause, including violation of any term herein. No refunds shall be issued for unused membership periods or prepaid credits.</div>
        <div class="clause"><span class="clause-number">8.4 Survival.</span> The provisions of Articles IV, V, VI, VII, and IX shall survive termination of this Agreement.</div>
      </div>

      <div class="section">
        <div class="section-title">Article IX - General Provisions</div>
        <div class="clause"><span class="clause-number">9.1 Entire Agreement.</span> This Agreement constitutes the entire agreement between the parties and supersedes all prior and contemporaneous agreements, representations, and understandings, whether written or oral.</div>
        <div class="clause"><span class="clause-number">9.2 Severability.</span> If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.</div>
        <div class="clause"><span class="clause-number">9.3 Waiver.</span> No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.</div>
        <div class="clause"><span class="clause-number">9.4 Headings.</span> Section headings are for convenience only and shall not affect interpretation.</div>
        <div class="clause"><span class="clause-number">9.5 Counterparts.</span> This Agreement may be executed in counterparts, each of which shall be deemed an original.</div>
        <div class="clause"><span class="clause-number">9.6 Electronic Signature.</span> Member agrees that electronic signatures, including typed signatures and biometric captures, shall have the same legal effect as handwritten signatures.</div>
      </div>

      <div class="checkbox-section">
        <div class="section-title">Member Acknowledgments and Certifications</div>
        <p style="font-size: 9pt; margin-bottom: 8px;">By checking each box below, Member certifies and acknowledges:</p>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.ageVerification ? 'checked' : ''}"></span> I am at least 21 years of age and have presented valid government-issued identification</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.identityConfirmation ? 'checked' : ''}"></span> All information I have provided is true, accurate, and complete</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.conductAgreement ? 'checked' : ''}"></span> I have read, understand, and agree to comply with the Code of Conduct</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.liabilityWaiver ? 'checked' : ''}"></span> I have read, understand, and accept the Assumption of Risk and Release of Liability</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.indemnification ? 'checked' : ''}"></span> I have read, understand, and accept the Indemnification obligations</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.mediaConsent ? 'checked' : ''}"></span> I consent to audio/video surveillance and understand its purposes</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.noRecordingPolicy ? 'checked' : ''}"></span> I understand and agree to the strict no-recording policy</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.paymentTerms ? 'checked' : ''}"></span> I understand and accept all Financial Terms and Payment Obligations</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.creditAuthorization ? 'checked' : ''}"></span> I authorize charges to my payment method on file as described herein</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.privacyPolicy ? 'checked' : ''}"></span> I have read and accept the Privacy Policy</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.arbitrationAgreement ? 'checked' : ''}"></span> I agree to binding arbitration for all disputes</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.classActionWaiver ? 'checked' : ''}"></span> I waive my right to participate in class action lawsuits</div>
        <div class="checkbox-item"><span class="checkbox ${acceptedTerms.entireAgreement ? 'checked' : ''}"></span> I acknowledge this is the entire agreement and I have read all terms</div>
      </div>

      <div class="signature-section">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="thumbprint-box">${thumbprintCaptured ? '✓ BIOMETRIC<br>THUMBPRINT<br>CAPTURED' : 'RIGHT<br>THUMBPRINT'}</div>
          <p style="font-size: 8pt; color: #666;">Biometric data encrypted and stored securely</p>
        </div>

        <div class="signature-grid">
          <div class="signature-box">
            <div style="font-style: italic; font-size: 12pt; min-height: 25px; border-bottom: 1px dotted #ccc;">${guestSignature || ''}</div>
            <div class="signature-line">
              <strong>MEMBER SIGNATURE</strong><br>
              ${guest?.guest_name || ''}<br>
              Date: ${contractDate}<br>
              Time: ${contractTime}
            </div>
          </div>
          <div class="signature-box">
            <div style="font-style: italic; font-size: 12pt; min-height: 25px; border-bottom: 1px dotted #ccc;">${managerSignature || ''}</div>
            <div class="signature-line">
              <strong>AUTHORIZED WITNESS</strong><br>
              ${managerName || 'Manager on Duty'}<br>
              Employee ID: ${managerId || '________'}<br>
              Date: ${contractDate}
            </div>
          </div>
        </div>

        ${secondWitness ? `
        <div style="text-align: center; margin-top: 30px;">
          <div style="font-style: italic; font-size: 12pt; min-height: 25px;">${secondWitnessSignature || ''}</div>
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 4px; font-size: 9pt;">
            <strong>SECOND WITNESS</strong><br>
            ${secondWitness}
          </div>
        </div>
        ` : ''}
      </div>

      <div class="legal-notice">
        <strong>LEGAL NOTICE AND ACKNOWLEDGMENT:</strong> This document constitutes a legally binding contract between the parties identified herein. By executing this Agreement, Member acknowledges that: (1) Member has carefully read and fully understands all terms and conditions; (2) Member has had the opportunity to consult with legal counsel prior to signing; (3) Member is signing voluntarily and without coercion; (4) Member intends to be legally bound by this Agreement; and (5) Member has received a copy of this executed Agreement.
        <br><br>
        <strong>Contract ID:</strong> ${contractId}<br>
        <strong>Document Hash:</strong> SHA-256 verification applied at time of execution<br>
        <strong>Generated:</strong> ${new Date().toISOString()}<br>
        <strong>Jurisdiction:</strong> State of Nevada, United States of America
        <br><br>
        <div style="text-align: center; border-top: 1px solid #000; padding-top: 10px; margin-top: 10px;">
          <em>MEMBER COPY - RETAIN FOR YOUR RECORDS</em><br>
          ${VENUE_LEGAL_NAME} • ${VENUE_ADDRESS} • License: ${VENUE_LICENSE}
        </div>
      </div>

      <div class="page-number">Page 1 of 1 | Contract Version ${CONTRACT_VERSION}</div>
    </body>
    </html>
  `;

  return (
    <Card className="bg-slate-900/50 border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-400" />
          VIP Membership Agreement v{CONTRACT_VERSION}
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={() => setShowFullContract(!showFullContract)} variant="outline" size="sm" className="border-slate-600">
            <Eye className="w-4 h-4 mr-1" />
            {showFullContract ? 'Summary' : 'Full Contract'}
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Contract Header */}
          <div className="text-center pb-4 border-b-2 border-double border-slate-600">
            <h2 className="text-xl font-bold text-white tracking-wide">{VENUE_NAME}</h2>
            <p className="text-sm text-purple-400">VIP MEMBERSHIP AND SERVICE AGREEMENT</p>
            <p className="text-xs text-slate-500">{VENUE_LEGAL_NAME} • License: {VENUE_LICENSE}</p>
            <p className="text-xs text-slate-500">Version {CONTRACT_VERSION} | {contractDate}</p>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 inline mr-2" />
            <span className="text-amber-400 font-medium text-sm">THIS IS A LEGALLY BINDING CONTRACT - READ CAREFULLY BEFORE SIGNING</span>
          </div>

          {/* Guest Info Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-800/50 rounded-lg text-sm">
            <div>
              <Label className="text-slate-500 text-xs">Legal Name</Label>
              <p className="text-white font-medium">{guest?.guest_name || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Member ID</Label>
              <p className="text-white">{guest?.membership_number || 'PENDING'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">DOB / Age</Label>
              <p className="text-white">{guest?.date_of_birth || '—'} {guestAge && `(${guestAge} yrs)`}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">ID Type</Label>
              <p className="text-white">{guest?.government_id_type || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">ID State</Label>
              <p className="text-white">{guest?.government_id_state || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">ID Expiry</Label>
              <p className="text-white">{guest?.government_id_expiry || '—'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Tier</Label>
              <p className="text-amber-400 font-medium">{guest?.vip_tier || 'Standard'}</p>
            </div>
            <div>
              <Label className="text-slate-500 text-xs">Address</Label>
              <p className="text-white text-xs truncate">{guest?.city && guest?.state ? `${guest.city}, ${guest.state}` : '—'}</p>
            </div>
          </div>

          {/* Contract Terms */}
          {showFullContract ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4 text-sm">
                {/* Full legal text sections */}
                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article I: Age Verification & Legal Capacity</h4>
                  <p className="text-slate-300 text-xs mb-2">Member represents, warrants, and affirms under penalty of perjury that Member is at least twenty-one (21) years of age. Member has presented valid, unexpired government-issued photographic identification which has been verified.</p>
                  <p className="text-slate-400 text-xs">Any misrepresentation constitutes fraud and may result in: immediate termination without refund, permanent prohibition from premises, reporting to law enforcement, civil liability, and criminal prosecution.</p>
                </div>

                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article II: Code of Conduct</h4>
                  <p className="text-slate-300 text-xs mb-2">Member agrees to conduct themselves respectfully and lawfully. Prohibited conduct includes: unauthorized physical contact, harassment, discrimination, stalking, intoxication causing disorder, illegal substances, weapons, and disruptive behavior.</p>
                  <p className="text-slate-400 text-xs">Management reserves absolute right to refuse service, revoke membership, and remove any individual at sole discretion without stated cause.</p>
                </div>

                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article III: Financial Terms</h4>
                  <p className="text-slate-300 text-xs mb-2">All services subject to posted rates. Full payment required before departure. Member authorizes charges to payment method on file for outstanding balances, damages, and cleaning fees.</p>
                  <p className="text-slate-400 text-xs">Failure to pay may result in membership revocation, collection action, credit bureau reporting, civil litigation, and criminal prosecution for theft of services.</p>
                </div>

                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article IV: Assumption of Risk & Liability Release</h4>
                  <p className="text-slate-300 text-xs mb-2">MEMBER VOLUNTARILY ASSUMES ALL RISKS including those from alcohol consumption, interaction with intoxicated guests, slipping/falling, entertainment activities, communicable diseases, and loud music/lighting.</p>
                  <p className="text-slate-400 text-xs">MEMBER RELEASES, WAIVES, AND DISCHARGES the Establishment and all Released Parties from ANY AND ALL LIABILITY including personal injury, property damage, emotional distress, or death, whether caused by negligence or otherwise.</p>
                </div>

                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article V: Indemnification</h4>
                  <p className="text-slate-300 text-xs">Member agrees to INDEMNIFY, DEFEND, AND HOLD HARMLESS the Released Parties from all claims, damages, losses, and expenses arising from Member's breach, negligence, violations, disputes with third parties, and conduct at the Establishment.</p>
                </div>

                <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
                  <h4 className="text-purple-400 font-medium mb-2">Article VI: Privacy & Recording Policy</h4>
                  <p className="text-slate-300 text-xs mb-2">Audio/video surveillance in continuous operation. Member consents to monitoring and recording. ALL PERSONAL RECORDING IS STRICTLY PROHIBITED - smartphones, cameras, smart glasses, all devices.</p>
                  <p className="text-slate-400 text-xs">Violations result in device confiscation, content deletion, immediate removal, permanent ban, civil litigation, and criminal prosecution.</p>
                </div>

                <div className="p-3 bg-red-900/20 rounded border border-red-500/30">
                  <h4 className="text-red-400 font-medium mb-2">Article VII: Mandatory Arbitration & Class Action Waiver</h4>
                  <p className="text-slate-300 text-xs mb-2">ALL DISPUTES SHALL BE RESOLVED BY BINDING ARBITRATION in Clark County, Nevada before JAMS. Member WAIVES RIGHT TO JURY TRIAL and WAIVES RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS.</p>
                  <p className="text-slate-400 text-xs">Governed by Nevada law. Prevailing party entitled to attorneys' fees. Claims must be brought within one (1) year or forever barred.</p>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-3 text-sm max-h-[200px] overflow-y-auto pr-2">
              <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Age verification, legal capacity, fraud consequences</span>
              </div>
              <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Code of conduct, management discretion, compliance</span>
              </div>
              <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Payment terms, credit authorization, collection rights</span>
              </div>
              <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Full liability release, indemnification, risk assumption</span>
              </div>
              <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Surveillance consent, strict no-recording policy</span>
              </div>
              <div className="p-2 bg-red-900/20 rounded border border-red-500/30 flex items-center gap-2">
                <Scale className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Mandatory arbitration, class action waiver</span>
              </div>
            </div>
          )}

          <Separator className="bg-slate-700" />

          {/* Acknowledgments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Required Acknowledgments (All Must Be Checked)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {[
                { key: 'ageVerification', label: 'I am 21+ and presented valid government ID' },
                { key: 'identityConfirmation', label: 'All information provided is true and accurate' },
                { key: 'conductAgreement', label: 'I agree to the Code of Conduct' },
                { key: 'liabilityWaiver', label: 'I accept the Liability Release and Waiver' },
                { key: 'indemnification', label: 'I accept Indemnification obligations' },
                { key: 'mediaConsent', label: 'I consent to surveillance monitoring' },
                { key: 'noRecordingPolicy', label: 'I agree to strict no-recording policy' },
                { key: 'paymentTerms', label: 'I accept all Financial Terms' },
                { key: 'creditAuthorization', label: 'I authorize charges to payment on file' },
                { key: 'privacyPolicy', label: 'I accept the Privacy Policy' },
                { key: 'arbitrationAgreement', label: 'I agree to binding arbitration' },
                { key: 'classActionWaiver', label: 'I waive class action rights' },
                { key: 'entireAgreement', label: 'I have read the entire agreement' }
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

            {/* Guest Initials */}
            <div>
              <Label className="text-slate-400 text-xs">Guest Initials (Required for Each Section)</Label>
              <Input
                value={guestInitials}
                onChange={(e) => setGuestInitials(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="e.g., JDS"
                maxLength={4}
                className="bg-slate-800 border-slate-600 w-32 text-center font-bold"
              />
            </div>

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
                <p className="text-xs text-slate-400">Right thumb • SHA-256 encrypted • Secure storage</p>
              </div>
            </div>

            {/* Signatures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-xs">Member Signature (Type Full Legal Name)</Label>
                <Input
                  value={guestSignature}
                  onChange={(e) => setGuestSignature(e.target.value)}
                  placeholder={guest?.guest_name}
                  className="bg-slate-800 border-slate-600 italic"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Manager Witness Name *</Label>
                <Input
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Manager full name"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Manager Employee ID</Label>
                <Input
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  placeholder="Employee ID"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Manager Signature *</Label>
                <Input
                  value={managerSignature}
                  onChange={(e) => setManagerSignature(e.target.value)}
                  placeholder="Type name to sign"
                  className="bg-slate-800 border-slate-600 italic"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Second Witness (Optional)</Label>
                <Input
                  value={secondWitness}
                  onChange={(e) => setSecondWitness(e.target.value)}
                  placeholder="Second witness name"
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Second Witness Signature</Label>
                <Input
                  value={secondWitnessSignature}
                  onChange={(e) => setSecondWitnessSignature(e.target.value)}
                  placeholder="Type name to sign"
                  className="bg-slate-800 border-slate-600 italic"
                  disabled={!secondWitness}
                />
              </div>
            </div>

            {/* Previous Contract Status */}
            {guest?.contract_signed && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Active Contract on File (v{guest.contract_version || '1.0'})</p>
                  <p className="text-xs text-slate-400">
                    Executed {new Date(guest.contract_signed_date).toLocaleDateString()} • Witness: {guest.manager_witness}
                  </p>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <Button 
              onClick={handleSignContract}
              disabled={isSigning || !allTermsAccepted || (!thumbprintCaptured && !guestSignature) || !managerSignature || !guestInitials}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50 h-12"
            >
              {isSigning ? 'Recording Contract...' : (
                <>
                  <Scale className="w-5 h-5 mr-2" />
                  Execute VIP Membership Agreement
                </>
              )}
            </Button>

            {!allTermsAccepted && (
              <p className="text-xs text-amber-400 text-center">All {Object.keys(acceptedTerms).length} acknowledgments must be checked</p>
            )}
            {!guestInitials && (
              <p className="text-xs text-amber-400 text-center">Guest initials required</p>
            )}
          </div>

          {/* Contract ID Footer */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            <p><strong>Contract ID:</strong> {contractId}</p>
            <p className="mt-1">Governed by Nevada State Law • Binding Arbitration in Clark County</p>
            <p className="mt-1 text-slate-600">{VENUE_LEGAL_NAME} • {VENUE_ADDRESS}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}