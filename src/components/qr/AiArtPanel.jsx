import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Wand2, Image as ImageIcon, Sparkles, Loader2, Palette } from 'lucide-react';

export default function AiArtPanel({ qrPayload, customization, setCustomization, onArtGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [artResult, setArtResult] = useState(null);

  // 1. Generate Artistic Background
  const generateBackground = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }
    setGenerating(true);
    try {
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt: `A high quality, subtle background texture or artistic composition suitable for a QR code overlay. Style: ${prompt}. Minimalist, high contrast where needed, not too busy in the center.`,
      });
      
      setArtResult(url);
      setCustomization(prev => ({
        ...prev,
        background: {
          ...prev.background,
          type: 'image',
          imageUrl: url,
          transparency: 90 // Default to slight transparency for blend
        },
        // Ensure dots are readable
        dotStyle: 'square', 
        foregroundColor: '#000000'
      }));
      toast.success("AI Background Generated");
    } catch (err) {
      toast.error("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // 2. Intelligent Design Suggestions
  const suggestDesign = async () => {
    setSuggestionLoading(true);
    try {
      const { data } = await base44.functions.invoke('suggestQrDesign', {
        payloadType: 'General', 
        intent: prompt || "Modern and Professional"
      });
      
      setCustomization(prev => ({
        ...prev,
        dotStyle: data.dotStyle || 'square',
        eyeStyle: data.eyeStyle || 'square',
        foregroundColor: data.foregroundColor || '#000000',
        backgroundColor: data.backgroundColor || '#ffffff',
        gradient: data.gradient || prev.gradient
      }));
      
      toast.success("Applied AI Design: " + (data.explanation || "Optimized styling"));
    } catch (err) {
      toast.error("Suggestion failed: " + err.message);
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            AI Design Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Smart Suggestions */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Smart Styling
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Let AI analyze your intent and suggest the optimal color palette and dot styles.
            </p>
            <div className="flex gap-2">
               <Input 
                 placeholder="E.g., Eco-friendly brand, Cyberpunk, Luxury..." 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="bg-slate-800 border-slate-700 text-white"
               />
               <Button 
                 onClick={suggestDesign} 
                 disabled={suggestionLoading}
                 className="bg-purple-600 hover:bg-purple-700 text-white"
               >
                 {suggestionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
               </Button>
            </div>
          </div>

          {/* AI Background Generation */}
          <div className="space-y-4">
            <Label className="text-white">Generative Art Background</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Describe the background (e.g., 'Neon city rain', 'Abstract geometric pastel')" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button 
                onClick={generateBackground}
                disabled={generating || !prompt}
                className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[120px]"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" /> Generate
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Generates a unique image and applies it as the QR background. 
              Adjust transparency below to ensure scannability.
            </p>
          </div>

          {/* Transparency Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-white">Background Opacity</Label>
              <span className="text-xs text-slate-400">{customization.background?.transparency || 100}%</span>
            </div>
            <Slider 
              value={[customization.background?.transparency || 100]}
              onValueChange={(val) => setCustomization(prev => ({
                ...prev, 
                background: { ...prev.background, transparency: val[0] }
              }))}
              min={0} max={100} step={1}
            />
          </div>

          {artResult && (
            <div className="mt-4">
              <Label className="text-white mb-2 block">Generated Result</Label>
              <div className="relative rounded-lg overflow-hidden border border-slate-700 aspect-square w-32">
                <img src={artResult} alt="AI Art" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <Button onClick={onArtGenerated} className="w-full" variant="outline">
            View in Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}