import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidationErrorAlert, FieldError } from './utils/validationErrors';
import { validateBuilderActionLog } from './utils/schemaValidator';
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  Send,
  Eye,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Mobile Dev Console
 * Touch-optimized, explicit field rendering, same schema as desktop
 * NO HIDDEN FIELDS. NO GUESSING.
 */
export default function MobileDevConsole() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  // File tree state
  const [tree, setTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/']));
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Content state
  const [fileContent, setFileContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [proposal, setProposal] = useState(null);
  
  // UI state
  const [activeSection, setActiveSection] = useState('files'); // 'files', 'analyze', 'propose', 'view'
  const [validationErrors, setValidationErrors] = useState([]);
  const [proposalInput, setProposalInput] = useState('');
  
  // Check authorization
  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          setLoading(false);
          return;
        }

        const userData = await base44.auth.me();
        setUser(userData);

        const allowedUsers = ['carloearl@glyphlock.com', 'carloearl@gmail.com'];
        const isAuthorized = userData.role === 'admin' || allowedUsers.includes(userData.email);
        
        setAuthorized(isAuthorized);
        
        if (isAuthorized) {
          loadFileTree();
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadFileTree = async () => {
    try {
      const response = await base44.functions.invoke('devGetFileTree', {});
      if (response.data.success) {
        setTree(response.data.tree);
      }
    } catch (error) {
      console.error('File tree error:', error);
      toast.error('Failed to load file tree');
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = async (file) => {
    if (file.type !== 'file') {
      toggleFolder(file.path);
      return;
    }

    setSelectedFile(file);
    setValidationErrors([]);
    setActiveSection('view');

    try {
      const response = await base44.functions.invoke('devGetFileContent', {
        filePath: file.path
      });

      if (response.data.success) {
        setFileContent(response.data.content);
        toast.success(`Loaded ${file.name}`);
      } else {
        if (response.data.error && response.data.error.includes('SCHEMA VIOLATION')) {
          setValidationErrors([response.data.error]);
          toast.error('Schema validation failed');
        } else {
          throw new Error(response.data.error || 'Failed to load file');
        }
      }
    } catch (error) {
      console.error('File load error:', error);
      toast.error('Failed to load file: ' + error.message);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !fileContent) {
      toast.error('No file selected');
      return;
    }

    setValidationErrors([]);

    try {
      const response = await base44.functions.invoke('devAnalyzeFile', {
        filePath: selectedFile.path,
        fileContent: fileContent
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
        setActiveSection('analyze');
        toast.success('Analysis complete');
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed: ' + error.message);
    }
  };

  const handlePropose = async () => {
    if (!selectedFile || !fileContent || !proposalInput.trim()) {
      toast.error('Missing required data');
      return;
    }

    setValidationErrors([]);

    try {
      const response = await base44.functions.invoke('devProposeChange', {
        filePath: selectedFile.path,
        fileContent: fileContent,
        changeDescription: proposalInput
      });

      if (response.data.success) {
        setProposal(response.data.proposal);
        setActiveSection('propose');
        toast.success('Proposal generated');
      } else {
        throw new Error(response.data.error || 'Proposal failed');
      }
    } catch (error) {
      console.error('Proposal error:', error);
      toast.error('Proposal failed: ' + error.message);
    }
  };

  const handleApprove = async () => {
    if (!proposal) {
      toast.error('No proposal to approve');
      return;
    }

    setValidationErrors([]);

    try {
      const response = await base44.functions.invoke('devApplyDiff', {
        proposalId: proposal.proposalId,
        filePath: selectedFile.path,
        modifiedCode: proposal.modifiedCode,
        approved: true
      });

      if (response.data.success) {
        toast.success('Change applied successfully');
        setFileContent(proposal.modifiedCode);
        setProposal(null);
        setProposalInput('');
        setActiveSection('view');
      } else {
        if (response.data.error && response.data.error.includes('SCHEMA VIOLATION')) {
          const errors = response.data.error.split('\n').filter(e => e.trim());
          setValidationErrors(errors);
          toast.error('Schema validation failed');
        } else {
          throw new Error(response.data.error || 'Apply failed');
        }
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to apply: ' + error.message);
    }
  };

  // Render file tree node
  const renderNode = (node, level = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile?.path === node.path;
    const isFolder = node.type === 'directory';

    return (
      <div key={node.path}>
        <div
          onClick={() => handleFileSelect(node)}
          className={`flex items-center gap-3 py-3 px-4 cursor-pointer transition-colors min-h-[48px] ${
            isSelected 
              ? 'bg-blue-500/20 border-l-4 border-blue-500' 
              : 'hover:bg-white/5 active:bg-white/10'
          }`}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-blue-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-blue-400" />
              )}
              <Folder className="w-5 h-5 text-blue-400" />
            </>
          ) : (
            <File className="w-5 h-5 text-gray-400 ml-5" />
          )}
          <span className="text-base text-white">{node.name}</span>
        </div>

        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950/20 to-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading Dev Engine...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-950/20 to-black p-4">
        <Card className="bg-white/5 border-red-500/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">Dev Mode is admin-only</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950/20 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-blue-500/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Dev Engine Mobile</h1>
            <p className="text-xs text-blue-300">{user?.email}</p>
          </div>
          {selectedFile && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
              {selectedFile.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4">
          <ValidationErrorAlert errors={validationErrors} />
        </div>
      )}

      {/* Section Tabs */}
      <div className="sticky top-[72px] z-40 bg-white/5 backdrop-blur-xl border-b border-blue-500/20 flex overflow-x-auto">
        {[
          { id: 'files', label: 'Files', icon: Folder },
          { id: 'view', label: 'View', icon: Eye, disabled: !selectedFile },
          { id: 'analyze', label: 'Analyze', icon: Code, disabled: !selectedFile },
          { id: 'propose', label: 'Propose', icon: Send, disabled: !selectedFile }
        ].map(({ id, label, icon: Icon, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && setActiveSection(id)}
            disabled={disabled}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-4 border-b-2 transition-colors min-h-[56px] ${
              activeSection === id
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : disabled
                ? 'border-transparent text-gray-600 cursor-not-allowed'
                : 'border-transparent text-gray-400 hover:text-white active:bg-white/5'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-semibold">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="p-4">
        {/* Files Section */}
        {activeSection === 'files' && (
          <Card className="bg-white/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white text-base">Project Files</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {tree ? renderNode(tree) : (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Loading files...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* View Section */}
        {activeSection === 'view' && selectedFile && (
          <Card className="bg-white/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base">File Content</CardTitle>
              <Button
                onClick={handleAnalyze}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                <Code className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-white font-mono whitespace-pre-wrap">
                  {fileContent}
                </pre>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                {fileContent.split('\n').length} lines • {fileContent.length} characters
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyze Section */}
        {activeSection === 'analyze' && analysis && (
          <div className="space-y-4">
            <Card className="bg-white/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white text-base">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Summary</p>
                  <p className="text-sm text-white">{analysis.summary}</p>
                </div>

                {analysis.issues && analysis.issues.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Issues Found</p>
                    <div className="space-y-3">
                      {analysis.issues.map((issue, idx) => (
                        <div key={idx} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-white mb-1">{issue.description}</p>
                              <p className="text-xs text-gray-400">Line {issue.line} • {issue.severity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.quality_score && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Quality Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          style={{ width: `${analysis.quality_score}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-semibold">{analysis.quality_score}%</span>
                    </div>
                  </div>
                )}

                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Suggestions</p>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                          <span className="text-white">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => setActiveSection('propose')}
              className="w-full min-h-[48px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base"
            >
              Create Change Proposal
            </Button>
          </div>
        )}

        {/* Propose Section */}
        {activeSection === 'propose' && (
          <div className="space-y-4">
            {!proposal ? (
              <Card className="bg-white/5 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-base">Propose Change</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Describe the change you want to make:
                    </label>
                    <Textarea
                      value={proposalInput}
                      onChange={(e) => setProposalInput(e.target.value)}
                      placeholder="e.g., Add error handling to the submit function..."
                      className="min-h-[120px] bg-white/5 border-blue-500/20 text-white text-base"
                    />
                  </div>
                  <Button
                    onClick={handlePropose}
                    disabled={!proposalInput.trim()}
                    className="w-full min-h-[48px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Generate Proposal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="bg-white/5 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      Proposal Generated
                      <Badge className={
                        proposal.risk === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        proposal.risk === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                        'bg-green-500/20 text-green-400 border-green-500/50'
                      }>
                        {proposal.risk || 'UNKNOWN'} RISK
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Explanation</p>
                      <p className="text-sm text-white">{proposal.explanation}</p>
                    </div>

                    {proposal.filesAffected && proposal.filesAffected.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Files Affected</p>
                        <div className="flex flex-wrap gap-2">
                          {proposal.filesAffected.map((file, idx) => (
                            <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {proposal.diff && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Changes</p>
                        <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-white font-mono whitespace-pre-wrap">
                            {proposal.diff}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      setProposal(null);
                      setProposalInput('');
                    }}
                    variant="outline"
                    className="min-h-[48px] border-red-500/50 text-red-400 hover:bg-red-500/10 text-base"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="min-h-[48px] bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Approve
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  ✓ Backup will be created automatically
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}