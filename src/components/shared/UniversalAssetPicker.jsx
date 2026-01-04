import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Image, QrCode, Check } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function UniversalAssetPicker({ onSelect, onCancel }) {
  const [activeTab, setActiveTab] = useState('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, [activeTab]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      let results = [];
      if (activeTab === 'images') {
        results = await base44.entities.InteractiveImage.list('-created_date', 50);
      } else {
        results = await base44.entities.QrAsset.list('-created_date', 50);
      }
      setAssets(results);
    } catch (error) {
      console.error("Failed to fetch assets", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => 
    (asset.name || asset.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-slate-900 border-slate-700">
      <div className="p-4 border-b border-slate-700 space-y-4">
        <h3 className="text-lg font-semibold text-white">Select Asset</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-slate-800">
            <TabsTrigger value="images" className="flex-1">
              <Image className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex-1">
              <QrCode className="w-4 h-4 mr-2" />
              QR Codes
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredAssets.map(asset => (
              <div 
                key={asset.id || asset._id}
                onClick={() => onSelect({ type: activeTab, ...asset })}
                className="group relative cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 hover:border-cyan-500 transition-all overflow-hidden aspect-square"
              >
                {activeTab === 'images' ? (
                  <img 
                    src={asset.fileUrl} 
                    alt={asset.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white p-4">
                     {/* Try to show QR preview if available, else placeholder */}
                     {asset.safeQrImageUrl ? (
                       <img src={asset.safeQrImageUrl} alt="QR" className="w-full h-full object-contain" />
                     ) : (
                       <QrCode className="w-12 h-12 text-slate-900" />
                     )}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="pointer-events-none">
                    Select
                  </Button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-sm">
                  <p className="text-xs text-white truncate font-medium">
                    {asset.name || asset.title || 'Untitled'}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredAssets.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-10">
                No assets found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 flex justify-end">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  );
}