/**
 * CanvasMode - Visual artifact builder with drag-drop, templates, and ZIP support
 */

import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Upload, FolderArchive, FileCode, Layout, Database, Terminal,
  Plus, Download, Trash2, Copy, Eye, Code, Sparkles, Loader2,
  FileJson, FileText, Image, Folder, ChevronRight, ChevronDown,
  Package, Layers, Grid3X3, Component, Zap, Shield, Globe
} from 'lucide-react';

// Boilerplate Templates
const BOILERPLATE_TEMPLATES = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    description: 'Hero, features, CTA sections',
    files: [
      { path: 'pages/Landing.jsx', type: 'page' },
      { path: 'components/landing/Hero.jsx', type: 'component' },
      { path: 'components/landing/Features.jsx', type: 'component' },
      { path: 'components/landing/CTA.jsx', type: 'component' }
    ]
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Layout,
    color: 'from-purple-500 to-indigo-600',
    description: 'Admin dashboard with stats',
    files: [
      { path: 'pages/Dashboard.jsx', type: 'page' },
      { path: 'components/dashboard/StatCards.jsx', type: 'component' },
      { path: 'components/dashboard/Charts.jsx', type: 'component' },
      { path: 'components/dashboard/RecentActivity.jsx', type: 'component' }
    ]
  },
  {
    id: 'crud-module',
    name: 'CRUD Module',
    icon: Database,
    color: 'from-green-500 to-emerald-600',
    description: 'Entity with list, form, detail',
    files: [
      { path: 'entities/Item.json', type: 'entity' },
      { path: 'pages/Items.jsx', type: 'page' },
      { path: 'components/items/ItemForm.jsx', type: 'component' },
      { path: 'components/items/ItemList.jsx', type: 'component' }
    ]
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    icon: Terminal,
    color: 'from-amber-500 to-orange-600',
    description: 'Backend function + frontend',
    files: [
      { path: 'functions/apiHandler.js', type: 'function' },
      { path: 'components/api/ApiClient.jsx', type: 'component' }
    ]
  },
  {
    id: 'auth-flow',
    name: 'Auth Flow',
    icon: Shield,
    color: 'from-red-500 to-pink-600',
    description: 'Protected routes & guards',
    files: [
      { path: 'components/auth/AuthGuard.jsx', type: 'component' },
      { path: 'components/auth/LoginPrompt.jsx', type: 'component' },
      { path: 'pages/ProtectedPage.jsx', type: 'page' }
    ]
  },
  {
    id: 'form-wizard',
    name: 'Form Wizard',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    description: 'Multi-step form flow',
    files: [
      { path: 'components/wizard/FormWizard.jsx', type: 'component' },
      { path: 'components/wizard/StepIndicator.jsx', type: 'component' },
      { path: 'components/wizard/steps/Step1.jsx', type: 'component' },
      { path: 'components/wizard/steps/Step2.jsx', type: 'component' }
    ]
  }
];

// Artifact Types
const ARTIFACT_TYPES = [
  { id: 'page', name: 'Page', icon: Layout, color: 'text-blue-400', folder: 'pages' },
  { id: 'component', name: 'Component', icon: Component, color: 'text-purple-400', folder: 'components' },
  { id: 'entity', name: 'Entity', icon: Database, color: 'text-green-400', folder: 'entities' },
  { id: 'function', name: 'Function', icon: Terminal, color: 'text-amber-400', folder: 'functions' },
  { id: 'agent', name: 'Agent', icon: Zap, color: 'text-pink-400', folder: 'agents' }
];

export default function CanvasMode({ onArtifactCreated }) {
  const [activeTab, setActiveTab] = useState('templates');
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newArtifact, setNewArtifact] = useState({ name: '', type: 'component', description: '' });
  const zipInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle ZIP upload and extraction
  const handleZipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.zip')) {
      toast.error('Please upload a ZIP file');
      return;
    }

    setUploading(true);
    try {
      // Upload ZIP to backend for extraction
      const result = await base44.integrations.Core.UploadFile({ file });
      
      // Call backend to extract and analyze
      const extractResult = await base44.functions.invoke('siteBuilderExtractZip', {
        fileUrl: result.file_url,
        fileName: file.name
      });

      if (extractResult.data?.files) {
        setExtractedFiles(extractResult.data.files);
        toast.success(`Extracted ${extractResult.data.files.length} files from ZIP`);
        setActiveTab('extracted');
      }
    } catch (error) {
      console.error('ZIP extraction failed:', error);
      toast.error('Failed to extract ZIP: ' + error.message);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // Generate artifact from template
  const generateFromTemplate = async (template) => {
    setGenerating(true);
    try {
      const result = await base44.functions.invoke('siteBuilderGenerate', {
        templateId: template.id,
        templateName: template.name,
        files: template.files
      });

      if (result.data?.artifacts) {
        setArtifacts(prev => [...prev, ...result.data.artifacts]);
        toast.success(`Generated ${result.data.artifacts.length} files from ${template.name}`);
        setActiveTab('artifacts');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Create blank artifact
  const createBlankArtifact = async () => {
    if (!newArtifact.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setGenerating(true);
    try {
      const result = await base44.functions.invoke('siteBuilderGenerate', {
        type: 'blank',
        artifactType: newArtifact.type,
        name: newArtifact.name,
        description: newArtifact.description
      });

      if (result.data?.artifact) {
        setArtifacts(prev => [...prev, result.data.artifact]);
        toast.success(`Created ${newArtifact.name}`);
        setNewArtifact({ name: '', type: 'component', description: '' });
        setActiveTab('artifacts');
      }
    } catch (error) {
      console.error('Creation failed:', error);
      toast.error('Failed to create: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Import extracted file as artifact
  const importExtractedFile = async (file) => {
    try {
      const artifact = {
        id: Date.now().toString(),
        name: file.name,
        path: file.path,
        type: detectFileType(file.path),
        content: file.content,
        status: 'imported'
      };
      setArtifacts(prev => [...prev, artifact]);
      toast.success(`Imported ${file.name}`);
    } catch (error) {
      toast.error('Failed to import file');
    }
  };

  // Deploy artifact to codebase
  const deployArtifact = async (artifact) => {
    try {
      const result = await base44.functions.invoke('siteBuilderDeploy', {
        artifact
      });
      
      if (result.data?.success) {
        setArtifacts(prev => prev.map(a => 
          a.id === artifact.id ? { ...a, status: 'deployed' } : a
        ));
        toast.success(`Deployed ${artifact.name} to codebase`);
        onArtifactCreated?.(artifact);
      }
    } catch (error) {
      toast.error('Failed to deploy: ' + error.message);
    }
  };

  // Download artifact as file
  const downloadArtifact = (artifact) => {
    const blob = new Blob([artifact.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Detect file type from path
  const detectFileType = (path) => {
    if (path.startsWith('pages/')) return 'page';
    if (path.startsWith('components/')) return 'component';
    if (path.startsWith('entities/')) return 'entity';
    if (path.startsWith('functions/')) return 'function';
    if (path.startsWith('agents/')) return 'agent';
    if (path.endsWith('.json')) return 'entity';
    return 'component';
  };

  // Get icon for file type
  const getFileIcon = (type) => {
    const found = ARTIFACT_TYPES.find(t => t.id === type);
    return found ? found.icon : FileCode;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-blue-500/20 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Canvas Mode</h2>
              <p className="text-xs text-blue-300">Generate artifacts & import projects</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip"
              onChange={handleZipUpload}
              className="hidden"
            />
            <Button
              onClick={() => zipInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              className="bg-white/5 border-purple-500/30 hover:bg-purple-500/20 text-purple-300"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FolderArchive className="w-4 h-4 mr-2" />
              )}
              Upload ZIP
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 bg-white/5 border border-blue-500/20">
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-500">
            <Package className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="data-[state=active]:bg-green-500">
            <Layers className="w-4 h-4 mr-2" />
            Artifacts ({artifacts.length})
          </TabsTrigger>
          {extractedFiles.length > 0 && (
            <TabsTrigger value="extracted" className="data-[state=active]:bg-amber-500">
              <FolderArchive className="w-4 h-4 mr-2" />
              Extracted ({extractedFiles.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOILERPLATE_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group"
                  onClick={() => generateFromTemplate(template)}
                >
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{template.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                    <div className="space-y-1">
                      {template.files.slice(0, 3).map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-blue-300">
                          <FileCode className="w-3 h-3" />
                          <span className="truncate">{file.path}</span>
                        </div>
                      ))}
                      {template.files.length > 3 && (
                        <p className="text-xs text-gray-500">+{template.files.length - 3} more files</p>
                      )}
                    </div>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-purple-500/30"
                      disabled={generating}
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="flex-1 p-4">
          <Card className="bg-white/5 border-blue-500/20 max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Create Blank Artifact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Artifact Type</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {ARTIFACT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewArtifact(prev => ({ ...prev, type: type.id }))}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          newArtifact.type === type.id
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <span className="text-xs text-white">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Name</Label>
                <Input
                  value={newArtifact.name}
                  onChange={(e) => setNewArtifact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., UserProfile, OrderForm, calculateTotal"
                  className="bg-white/5 border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-300">Description (optional)</Label>
                <Input
                  value={newArtifact.description}
                  onChange={(e) => setNewArtifact(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this artifact do?"
                  className="bg-white/5 border-white/10 text-white mt-1"
                />
              </div>

              <Button
                onClick={createBlankArtifact}
                disabled={generating || !newArtifact.name.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Artifact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Artifacts Tab */}
        <TabsContent value="artifacts" className="flex-1 p-4 overflow-auto">
          {artifacts.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Artifacts Yet</h3>
              <p className="text-gray-400 mb-4">Generate from templates or create blank artifacts</p>
              <Button onClick={() => setActiveTab('templates')} variant="outline" className="border-blue-500/30">
                Browse Templates
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {artifacts.map((artifact) => {
                const Icon = getFileIcon(artifact.type);
                return (
                  <Card key={artifact.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{artifact.name}</p>
                          <p className="text-xs text-gray-400">{artifact.path || artifact.type}</p>
                        </div>
                        {artifact.status === 'deployed' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                            Deployed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedArtifact(artifact)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadArtifact(artifact)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deployArtifact(artifact)}
                          disabled={artifact.status === 'deployed'}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Extracted Files Tab */}
        <TabsContent value="extracted" className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {extractedFiles.map((file, idx) => (
              <Card key={idx} className="bg-white/5 border-white/10">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedArtifact(file)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => importExtractedFile(file)}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-blue-500/30 w-full max-w-4xl max-h-[80vh] flex flex-col">
            <CardHeader className="border-b border-blue-500/20 flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                {selectedArtifact.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArtifact(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap">
                {selectedArtifact.content || '// No content generated yet'}
              </pre>
            </CardContent>
            <div className="border-t border-blue-500/20 p-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(selectedArtifact.content || '');
                  toast.success('Copied to clipboard');
                }}
                className="border-blue-500/30"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={() => downloadArtifact(selectedArtifact)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}