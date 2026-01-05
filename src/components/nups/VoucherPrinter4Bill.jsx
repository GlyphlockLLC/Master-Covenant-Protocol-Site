import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Printer, Download, RefreshCw, QrCode, Image as ImageIcon, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Venue Prefixes
const VENUE_PREFIXES = [
  { id: 'SK', name: 'Skin Cabaret', color: '#FF1493' },
  { id: 'BN', name: 'Bones Cabaret', color: '#8B0000' },
  { id: 'DP', name: 'Dream Palace', color: '#9400D3' },
  { id: 'EV', name: 'Eve\'s Teas', color: '#228B22' },
  { id: 'GL', name: 'GlyphLock Generic', color: '#3B82F6' },
];

// US Currency Dimensions: 6.14" x 2.61"
const BILL_WIDTH_INCHES = 6.14;
const BILL_HEIGHT_INCHES = 2.61;
const DPI = 96; // Screen DPI for preview
const BILL_WIDTH_PX = Math.round(BILL_WIDTH_INCHES * DPI);
const BILL_HEIGHT_PX = Math.round(BILL_HEIGHT_INCHES * DPI);

export default function VoucherPrinter4Bill() {
  const [venuePrefix, setVenuePrefix] = useState('SK');
  const [currentSerial, setCurrentSerial] = useState(1);
  const [denomination, setDenomination] = useState(20);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sheetsGenerated, setSheetsGenerated] = useState(0);
  const [totalBillsPrinted, setTotalBillsPrinted] = useState(0);
  const fileInputRef = useRef(null);
  const printRef = useRef(null);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('glyphlock_voucher_state');
    if (saved) {
      const state = JSON.parse(saved);
      setCurrentSerial(state.currentSerial || 1);
      setSheetsGenerated(state.sheetsGenerated || 0);
      setTotalBillsPrinted(state.totalBillsPrinted || 0);
      if (state.venuePrefix) setVenuePrefix(state.venuePrefix);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('glyphlock_voucher_state', JSON.stringify({
      currentSerial,
      sheetsGenerated,
      totalBillsPrinted,
      venuePrefix
    }));
  }, [currentSerial, sheetsGenerated, totalBillsPrinted, venuePrefix]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setImageFile(file);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const generateSerialNumber = (index) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const serialNum = (currentSerial + index).toString().padStart(3, '0');
    return `${venuePrefix}${serialNum}-${year}`;
  };

  const generateQRPayload = (serial) => {
    const payload = {
      type: 'GLYPHLOCK_VOUCHER',
      serial,
      venue: venuePrefix,
      denomination,
      issued: new Date().toISOString(),
      checksum: btoa(`${serial}:${denomination}:${Date.now()}`).slice(0, 8)
    };
    return JSON.stringify(payload);
  };

  const handlePrint = () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsGenerating(true);

    // Create print window
    const printWindow = window.open('', '', 'width=800,height=1000');
    
    const venueData = VENUE_PREFIXES.find(v => v.id === venuePrefix);
    const serials = [0, 1, 2, 3].map(i => generateSerialNumber(i));
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GlyphLock Vouchers - ${venuePrefix}</title>
        <style>
          @page {
            size: letter portrait;
            margin: 0.25in;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            background: white;
          }
          
          .sheet {
            width: 8in;
            height: 10.5in;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 0.25in 0;
          }
          
          .bill {
            width: ${BILL_WIDTH_INCHES}in;
            height: ${BILL_HEIGHT_INCHES}in;
            position: relative;
            border: 1px dashed #ccc;
            overflow: hidden;
            background: linear-gradient(135deg, #000 0%, #1a1a2e 100%);
          }
          
          .bill-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.9;
          }
          
          .bill-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 8px 12px;
          }
          
          .bill-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .venue-badge {
            background: ${venueData?.color || '#3B82F6'};
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
          }
          
          .denomination {
            font-size: 24px;
            font-weight: 900;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          }
          
          .bill-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          
          .serial {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #00FF00;
            background: rgba(0,0,0,0.7);
            padding: 2px 6px;
            border-radius: 2px;
          }
          
          .qr-placeholder {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #333;
          }
          
          .crop-mark {
            position: absolute;
            background: #333;
          }
          
          .crop-mark.top-left { top: -5px; left: -5px; width: 10px; height: 1px; }
          .crop-mark.top-left-v { top: -5px; left: -5px; width: 1px; height: 10px; }
          .crop-mark.top-right { top: -5px; right: -5px; width: 10px; height: 1px; }
          .crop-mark.top-right-v { top: -5px; right: -5px; width: 1px; height: 10px; }
          .crop-mark.bottom-left { bottom: -5px; left: -5px; width: 10px; height: 1px; }
          .crop-mark.bottom-left-v { bottom: -5px; left: -5px; width: 1px; height: 10px; }
          .crop-mark.bottom-right { bottom: -5px; right: -5px; width: 10px; height: 1px; }
          .crop-mark.bottom-right-v { bottom: -5px; right: -5px; width: 1px; height: 10px; }
          
          .watermark {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6px;
            color: rgba(255,255,255,0.3);
            letter-spacing: 1px;
          }
          
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .bill { border: none; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          ${serials.map((serial, i) => `
            <div class="bill">
              <div class="crop-mark top-left"></div>
              <div class="crop-mark top-left-v"></div>
              <div class="crop-mark top-right"></div>
              <div class="crop-mark top-right-v"></div>
              <div class="crop-mark bottom-left"></div>
              <div class="crop-mark bottom-left-v"></div>
              <div class="crop-mark bottom-right"></div>
              <div class="crop-mark bottom-right-v"></div>
              
              <img src="${uploadedImage}" alt="Voucher" class="bill-image" />
              
              <div class="bill-overlay">
                <div class="bill-header">
                  <span class="venue-badge">${venueData?.name || 'GlyphLock'}</span>
                  <span class="denomination">$${denomination}</span>
                </div>
                <div class="bill-footer">
                  <span class="serial">${serial}</span>
                  <div class="qr-placeholder">QR</div>
                </div>
              </div>
              
              <div class="watermark">GLYPHLOCK SECURE VOUCHER</div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      
      // Update stats
      setCurrentSerial(prev => prev + 4);
      setSheetsGenerated(prev => prev + 1);
      setTotalBillsPrinted(prev => prev + 4);
      setIsGenerating(false);
      
      toast.success(`Sheet printed! Serials: ${serials[0]} - ${serials[3]}`);
    }, 500);
  };

  const handleDownloadPDF = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    // For now, trigger print dialog - PDF generation requires jspdf
    handlePrint();
  };

  const resetSerials = () => {
    if (confirm('Reset serial counter to 001? This cannot be undone.')) {
      setCurrentSerial(1);
      toast.success('Serial counter reset to 001');
    }
  };

  const venueData = VENUE_PREFIXES.find(v => v.id === venuePrefix);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card-dark border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{totalBillsPrinted}</div>
            <div className="text-xs text-gray-400">Total Bills Printed</div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{sheetsGenerated}</div>
            <div className="text-xs text-gray-400">Sheets Generated</div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{generateSerialNumber(0)}</div>
            <div className="text-xs text-gray-400">Next Serial</div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-pink-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-400" style={{ color: venueData?.color }}>
              {venueData?.id}
            </div>
            <div className="text-xs text-gray-400">{venueData?.name}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="glass-card-dark border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              4-Bill Voucher Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Venue Selection */}
            <div>
              <Label className="text-white">Venue Prefix</Label>
              <Select value={venuePrefix} onValueChange={setVenuePrefix}>
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {VENUE_PREFIXES.map(venue => (
                    <SelectItem key={venue.id} value={venue.id}>
                      <span style={{ color: venue.color, fontWeight: 'bold' }}>{venue.id}</span>
                      {' - '}{venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Denomination */}
            <div>
              <Label className="text-white">Denomination ($)</Label>
              <Select value={String(denomination)} onValueChange={(v) => setDenomination(Number(v))}>
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {[5, 10, 20, 50, 100, 200, 500].map(d => (
                    <SelectItem key={d} value={String(d)}>${d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-white">Bill Background Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full glass-card hover:glass-card-hover border-cyan-500/30 mt-2"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadedImage ? 'Change Image' : 'Upload Image'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 6.14" × 2.61" aspect ratio (US currency size)
              </p>
            </div>

            {/* Serial Management */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-white">Current Serial Start</Label>
                <Input
                  type="number"
                  min="1"
                  value={currentSerial}
                  onChange={(e) => setCurrentSerial(Math.max(1, parseInt(e.target.value) || 1))}
                  className="glass-input"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={resetSerials}
                  variant="outline"
                  className="border-red-500/50 text-red-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePrint}
                disabled={!uploadedImage || isGenerating}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <Printer className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Print Sheet (4 Bills)'}
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={!uploadedImage}
                variant="outline"
                className="border-purple-500/50"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="glass-card-dark border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Bill Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700"
              style={{
                width: '100%',
                maxWidth: `${BILL_WIDTH_PX}px`,
                aspectRatio: `${BILL_WIDTH_INCHES} / ${BILL_HEIGHT_INCHES}`,
                margin: '0 auto'
              }}
            >
              {uploadedImage ? (
                <>
                  <img 
                    src={uploadedImage} 
                    alt="Bill preview" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-3">
                    <div className="flex justify-between items-start">
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: venueData?.color }}
                      >
                        {venueData?.name}
                      </span>
                      <span className="text-2xl font-black text-yellow-400 drop-shadow-lg">
                        ${denomination}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-xs text-green-400 bg-black/70 px-2 py-0.5 rounded">
                        {generateSerialNumber(0)}
                      </span>
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-800" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/30">
                    GLYPHLOCK SECURE VOUCHER
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Upload an image to preview</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bill Dimensions Info */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
              <div className="flex justify-between">
                <span>US Currency Dimensions:</span>
                <span className="text-cyan-400">{BILL_WIDTH_INCHES}" × {BILL_HEIGHT_INCHES}"</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Bills per sheet:</span>
                <span className="text-purple-400">4</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Next 4 serials:</span>
                <span className="text-green-400 font-mono text-xs">
                  {[0,1,2,3].map(i => generateSerialNumber(i)).join(', ')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}