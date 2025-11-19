import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Download, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FreeTrialGuard from "@/components/FreeTrialGuard";
import ContentTypeSelector from "@/components/content/ContentTypeSelector";
import ToneSelector from "@/components/content/ToneSelector";
import GeneratedContent from "@/components/content/GeneratedContent";

export default function ContentGenerator() {
  const [contentType, setContentType] = useState("marketing");
  const [tone, setTone] = useState("professional");
  const [topic, setTopic] = useState("");
  const [brandGuidelines, setBrandGuidelines] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [wordCount, setWordCount] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentHistory, setContentHistory] = useState([]);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or description");
      return;
    }

    setIsGenerating(true);
    try {
      const wordLimits = {
        short: "100-200 words",
        medium: "300-500 words",
        long: "800-1200 words"
      };

      const contentTypeInstructions = {
        marketing: "Create compelling marketing copy that drives action and engagement",
        product: "Write a detailed, SEO-friendly product description that highlights benefits and features",
        blog: "Write an informative, engaging blog post with a clear structure (intro, body, conclusion)",
        social: "Create engaging social media content optimized for platforms like LinkedIn, Twitter, or Instagram",
        email: "Write a professional email campaign with a strong subject line and clear call-to-action",
        press: "Write a professional press release following AP style guidelines"
      };

      const prompt = `
You are a professional content writer and marketing expert. Generate ${contentTypeInstructions[contentType]}.

**Topic/Description:** ${topic}

**Tone:** ${tone}
${brandGuidelines ? `**Brand Guidelines:** ${brandGuidelines}` : ''}
${targetAudience ? `**Target Audience:** ${targetAudience}` : ''}
${additionalContext ? `**Additional Context:** ${additionalContext}` : ''}
**Length:** ${wordLimits[wordCount]}

Requirements:
- Match the specified tone exactly (${tone})
- Follow brand guidelines if provided
- Be engaging and actionable
- Include relevant keywords naturally
- Use proper formatting (headers, bullets where appropriate)
- End with a strong call-to-action if relevant

Generate the content now:`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setGeneratedContent(response);
      
      const newHistory = {
        id: Date.now(),
        type: contentType,
        topic: topic,
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setContentHistory(prev => [newHistory, ...prev.slice(0, 9)]);
      
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadContent = (text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}-content-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <FreeTrialGuard serviceName="GlyphBot">
      <div className="min-h-screen bg-black text-white relative">
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/8cd0364f8_Whisk_2bd57b9a449d359968944ab33f98257edr-Copy.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">AI Content Generator</h1>
              </div>
              <p className="text-white/80 text-lg">
                Create professional content in seconds with AI-powered writing assistance
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="glass-royal border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Content Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">Content Type</Label>
                      <ContentTypeSelector selected={contentType} onSelect={setContentType} />
                    </div>

                    <div>
                      <Label className="text-white">Tone & Style</Label>
                      <ToneSelector selected={tone} onSelect={setTone} />
                    </div>

                    <div>
                      <Label className="text-white">Length</Label>
                      <Select value={wordCount} onValueChange={setWordCount}>
                        <SelectTrigger className="glass-dark border-blue-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-blue-500/30">
                          <SelectItem value="short">Short (100-200 words)</SelectItem>
                          <SelectItem value="medium">Medium (300-500 words)</SelectItem>
                          <SelectItem value="long">Long (800-1200 words)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Target Audience (Optional)</Label>
                      <Input
                        placeholder="e.g., Tech professionals, Small businesses"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="glass-dark border-blue-500/30 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {contentHistory.length > 0 && (
                  <Card className="glass-royal border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Recent Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                      {contentHistory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setGeneratedContent(item.content)}
                          className="glass-dark p-3 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors"
                        >
                          <Badge variant="outline" className="text-xs mb-1">
                            {item.type}
                          </Badge>
                          <p className="text-white text-xs truncate">{item.topic}</p>
                          <p className="text-white/50 text-[10px]">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <Card className="glass-royal border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Content Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">Topic / Description *</Label>
                      <Textarea
                        placeholder="Describe what you want to write about..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="glass-dark border-blue-500/30 text-white min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Brand Guidelines (Optional)</Label>
                      <Textarea
                        placeholder="Enter your brand voice, values, or specific requirements..."
                        value={brandGuidelines}
                        onChange={(e) => setBrandGuidelines(e.target.value)}
                        className="glass-dark border-blue-500/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Additional Context (Optional)</Label>
                      <Textarea
                        placeholder="Any other details, keywords, or requirements..."
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value)}
                        className="glass-dark border-blue-500/30 text-white"
                      />
                    </div>

                    <Button
                      onClick={generateContent}
                      disabled={isGenerating || !topic.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {generatedContent && (
                  <GeneratedContent
                    content={generatedContent}
                    onCopy={() => copyToClipboard(generatedContent)}
                    onDownload={() => downloadContent(generatedContent)}
                    onRegenerate={generateContent}
                    isGenerating={isGenerating}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}