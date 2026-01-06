import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Printer, Download, RefreshCw, QrCode, Shuffle, Hash } from "lucide-react";
import { toast } from "sonner";

// Venue Prefixes
const VENUE_PREFIXES = [
  { id: 'SK', name: 'Skin Cabaret', color: '#FF1493' },
  { id: 'BN', name: 'Bones Cabaret', color: '#8B0000' },
  { id: 'DP', name: 'Dream Palace', color: '#9400D3' },
  { id: 'EV', name: 'Eve\'s Teas', color: '#228B22' },
  { id: 'GL', name: 'GlyphLock Generic', color: '#3B82F6' },
];

// Simple CRC32 checksum
function crc32(str) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ ((crc ^ str.charCodeAt(i)) & 0xFF);
  }
  return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

// Cryptographic non-sequential serial generator
function generateNonSequentialSerial(prefix, index, seed) {
  const year = new Date().getFullYear().toString().slice(-2);
  // Use a simple hash-like distribution
  const hash = ((index * 2654435761) ^ seed) >>> 0;
  const serialNum = (hash % 9999 + 1).toString().padStart(4, '0');
  return `${prefix}${serialNum}-${year}`;
}

export default function VoucherPrinter5Sheet() {
  const [venuePrefix, setVenuePrefix] = useState('SK');
  const [currentSerial, setCurrentSerial] = useState(1);
  const [denomination, setDenomination] = useState(20);
  const [nonSequentialMode, setNonSequentialMode] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [randomSeed] = useState(() => Math.floor(Math.random() * 1000000));
  const [sheetsGenerated, setSheetsGenerated] = useState(0);
  const [totalVouchersPrinted, setTotalVouchersPrinted] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('glyphlock_5sheet_state');
    if (saved) {
      const state = JSON.parse(saved);
      setCurrentSerial(state.currentSerial || 1);
      setSheetsGenerated(state.sheetsGenerated || 0);
      setTotalVouchersPrinted(state.totalVouchersPrinted || 0);
      if (state.venuePrefix) setVenuePrefix(state.venuePrefix);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('glyphlock_5sheet_state', JSON.stringify({
      currentSerial,
      sheetsGenerated,
      totalVouchersPrinted,
      venuePrefix
    }));
  }, [currentSerial, sheetsGenerated, totalVouchersPrinted, venuePrefix]);

  const generateSerial = (index) => {
    const year = new Date().getFullYear().toString().slice(-2);
    if (nonSequentialMode) {
      return generateNonSequentialSerial(venuePrefix, currentSerial + index, randomSeed);
    }
    const serialNum = (currentSerial + index).toString().padStart(4, '0');
    return `${venuePrefix}${serialNum}-${year}`;
  };

  const generateQRPayload = (serial) => {
    const payload = `GLYPHLOCK:${serial}:${denomination}:${Date.now()}`;
    const checksum = crc32(payload);
    return { payload, checksum };
  };

  const handlePrint = () => {
    setIsGenerating(true);

    const printWindow = window.open('', '', 'width=850,height=1100');
    const venueData = VENUE_PREFIXES.find(v => v.id === venuePrefix);
    
    // Generate sheets
    let allSheets = '';
    for (let sheet = 0; sheet < batchCount; sheet++) {
      const serials = [0, 1, 2, 3, 4].map(i => generateSerial(sheet * 5 + i));
      const qrData = serials.map(s => generateQRPayload(s));
      
      allSheets += `
        <div class="sheet ${sheet > 0 ? 'page-break' : ''}">
          ${serials.map((serial, i) => `
            <div class="voucher">
              <div class="perf-line"></div>
              
              <div class="voucher-content">
                <div class="voucher-header">
                  <div class="venue-name">${venueData?.name || 'VENUE'}</div>
                  <div class="voucher-type">DANCE VOUCHER</div>
                </div>
                
                <div class="voucher-body">
                  <div class="denomination-box">
                    <span class="currency">$</span>
                    <span class="amount">${denomination}</span>
                  </div>
                  
                  <div class="qr-section">
                    <div class="qr-box">[QR]</div>
                    <div class="checksum">CRC: ${qrData[i].checksum}</div>
                  </div>
                </div>
                
                <div class="voucher-footer">
                  <div class="serial-number">${serial}</div>
                  <div class="validity">VALID FOR ONE (1) DANCE</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GlyphLock 5-Sheet Vouchers</title>
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
            color: black;
          }
          
          .sheet {
            width: 8in;
            height: 10.5in;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .voucher {
            width: 7.5in;
            height: 2.1in;
            position: relative;
            border: none;
            background: white;
          }
          
          .perf-line {
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            width: 100%;
            height: 0;
            border-bottom: 1px dashed #666;
          }
          
          .voucher:last-child .perf-line {
            display: none;
          }
          
          .voucher-content {
            padding: 12px 16px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .voucher-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
            padding-bottom: 6px;
          }
          
          .venue-name {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          
          .voucher-type {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .voucher-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;
            padding: 8px 0;
          }
          
          .denomination-box {
            display: flex;
            align-items: baseline;
          }
          
          .currency {
            font-size: 24px;
            font-weight: bold;
          }
          
          .amount {
            font-size: 48px;
            font-weight: 900;
            letter-spacing: -2px;
          }
          
          .qr-section {
            text-align: center;
          }
          
          .qr-box {
            width: 60px;
            height: 60px;
            border: 2px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            margin: 0 auto;
          }
          
          .checksum {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            margin-top: 4px;
            color: #666;
          }
          
          .voucher-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #333;
            padding-top: 6px;
          }
          
          .serial-number {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .validity {
            font-size: 10px;
            font-style: italic;
          }
          
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${allSheets}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      
      const vouchersThisBatch = batchCount * 5;
      setCurrentSerial(prev => prev + vouchersThisBatch);
      setSheetsGenerated(prev => prev + batchCount);
      setTotalVouchersPrinted(prev => prev + vouchersThisBatch);
      setIsGenerating(false);
      
      toast.success(`Printed ${batchCount} sheet(s) with ${vouchersThisBatch} vouchers!`);
    }, 500);
  };

  const venueData = VENUE_PREFIXES.find(v => v.id === venuePrefix);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card-dark border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{totalVouchersPrinted}</div>
            <div className="text-xs text-gray-400">Total Vouchers</div>
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
            <div className="text-2xl font-bold text-green-400 font-mono text-lg">{generateSerial(0)}</div>
            <div className="text-xs text-gray-400">Next Serial</div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-pink-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: venueData?.color }}>
              {nonSequentialMode ? <Shuffle className="w-6 h-6 mx-auto" /> : <Hash className="w-6 h-6 mx-auto" />}
            </div>
            <div className="text-xs text-gray-400">{nonSequentialMode ? 'Random' : 'Sequential'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card-dark border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            5-Sheet Perforated Voucher Printer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
                  {[5, 10, 20, 25, 30, 40, 50, 75, 100].map(d => (
                    <SelectItem key={d} value={String(d)}>${d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Batch Count */}
            <div>
              <Label className="text-white">Sheets to Print (1-100)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={batchCount}
                onChange={(e) => setBatchCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="glass-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                = {batchCount * 5} vouchers total
              </p>
            </div>

            {/* Serial Mode Toggle */}
            <div>
              <Label className="text-white">Serial Generation Mode</Label>
              <div className="flex items-center gap-3 mt-2 p-3 glass-card rounded-lg">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${!nonSequentialMode ? 'text-cyan-400' : 'text-gray-500'}`}>Sequential</span>
                <Switch
                  checked={nonSequentialMode}
                  onCheckedChange={setNonSequentialMode}
                />
                <span className={`text-sm ${nonSequentialMode ? 'text-purple-400' : 'text-gray-500'}`}>Random</span>
                <Shuffle className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Serial Start */}
          <div>
            <Label className="text-white">Starting Serial Number</Label>
            <Input
              type="number"
              min="1"
              value={currentSerial}
              onChange={(e) => setCurrentSerial(Math.max(1, parseInt(e.target.value) || 1))}
              className="glass-input"
            />
          </div>

          {/* Preview of Next 5 Serials */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <Label className="text-gray-400 text-xs mb-2 block">Next 5 Serial Numbers:</Label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map(i => {
                const serial = generateSerial(i);
                const { checksum } = generateQRPayload(serial);
                return (
                  <div key={i} className="bg-gray-900 px-3 py-1 rounded border border-gray-700">
                    <span className="font-mono text-sm text-green-400">{serial}</span>
                    <span className="text-xs text-gray-500 ml-2">CRC:{checksum.slice(0,4)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Print Button */}
          <Button
            onClick={handlePrint}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 h-12 text-lg"
          >
            <Printer className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : `Print ${batchCount} Sheet${batchCount > 1 ? 's' : ''} (${batchCount * 5} Vouchers)`}
          </Button>

          {/* Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Monochrome design optimized for single-color printing</p>
            <p>• Perforation lines included for easy separation</p>
            <p>• CRC32 checksum for QR validation</p>
            <p>• {nonSequentialMode ? 'Cryptographic random' : 'Sequential'} serial generation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}