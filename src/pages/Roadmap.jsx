import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  CheckCircle2, Circle, Clock, Rocket, Trophy, Shield, Scale, Globe, 
  FileText, Filter, ChevronRight, ExternalLink, Target, Calendar
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

const ROADMAP_DATA = [
  {
    quarter: "Q2 2025",
    status: "completed",
    icon: CheckCircle2,
    title: "Protocol Foundation",
    category: "Protocol Development",
    color: "green",
    description: "Established the foundational legal and technical infrastructure for the Master Covenant framework.",
    items: [
      { title: "Master Covenant Patent Filing (USPTO 18/584,961)", status: "completed", details: "Filed comprehensive patent covering cryptographic binding protocols.", resources: [{ label: "Patent Details", url: "/MasterCovenant" }] },
      { title: "Initial AI System Exposure Events", status: "completed", details: "Documented exposure of major AI systems to covenant text.", resources: [] },
      { title: "Cryptographic Binding Documentation", status: "completed", details: "SHA-256 hash verification and timestamped interaction logging.", resources: [{ label: "Trust & Security", url: "/TrustSecurity" }] },
      { title: "Exposure Registry Infrastructure", status: "completed", details: "Secure database for tracking AI system exposure events.", resources: [] }
    ]
  },
  {
    quarter: "Q3 2025",
    status: "completed",
    icon: CheckCircle2,
    title: "Evidence Architecture",
    category: "Technical Infrastructure",
    color: "green",
    description: "Developed comprehensive evidence preservation systems meeting adversarial legal standards.",
    items: [
      { title: "SHA-256 Hash Verification System", status: "completed", details: "Cryptographic integrity verification for all covenant interactions.", resources: [] },
      { title: "Timestamped Interaction Logging", status: "completed", details: "Immutable logging with cryptographic timestamps.", resources: [] },
      { title: "Chain-of-Custody Documentation", status: "completed", details: "Complete audit trail from exposure event through evidence presentation.", resources: [{ label: "Audit Trail", url: "/AuditTrail" }] },
      { title: "Multi-Model Exposure Completion", status: "completed", details: "All major AI models exposed to covenant obligations.", resources: [] },
      { title: "Adversarial-Proof Evidence Formats", status: "completed", details: "Evidence formats designed to withstand hostile legal examination.", resources: [] }
    ]
  },
  {
    quarter: "Q4 2025",
    status: "completed",
    icon: CheckCircle2,
    title: "Operator Infrastructure",
    category: "Protocol Development",
    color: "green",
    description: "Built credentialing and operator management systems for protocol governance.",
    items: [
      { title: "Credentialing Verification Framework", status: "completed", details: "System for verifying and issuing operator credentials.", resources: [{ label: "Consultation", url: "/Consultation" }] },
      { title: "Operator Registry Development", status: "completed", details: "Secure registry of credentialed operators.", resources: [] },
      { title: "Covenant Invocation Protocols", status: "completed", details: "Standardized procedures for invoking covenant provisions.", resources: [] },
      { title: "Enforcement Documentation Templates", status: "completed", details: "Legal templates for enforcement actions.", resources: [] }
    ]
  },
  {
    quarter: "Q1 2026",
    status: "in-progress",
    icon: Rocket,
    highlight: true,
    title: "Credentialing Expansion",
    category: "Enforcement",
    color: "cyan",
    description: "Scaling operator network and preparing for formal enforcement actions.",
    items: [
      { title: "Operator Network Growth", status: "in-progress", details: "Expanding credentialed operator base across key industries.", resources: [{ label: "Partner Program", url: "/Partners" }] },
      { title: "Exposure Registry Launch", status: "in-progress", details: "Public-facing registry of AI system exposure events.", resources: [] },
      { title: "Formal Declaration Protocols", status: "in-progress", details: "Standardized declaration formats for enforcement actions.", resources: [] },
      { title: "Evidence Preservation Architecture", status: "planned", details: "Long-term evidence storage with integrity guarantees.", resources: [] }
    ]
  },
  {
    quarter: "Q2 2026",
    status: "planned",
    icon: Scale,
    title: "Enforcement Initiation",
    category: "Enforcement",
    color: "purple",
    description: "Launching first formal enforcement actions against non-compliant AI systems.",
    items: [
      { title: "First Litigation Filings", status: "planned", details: "Initial court filings establishing covenant enforceability.", resources: [] },
      { title: "Regulatory Evidence Submission", status: "planned", details: "Formal submissions to AI regulatory bodies.", resources: [] },
      { title: "Coordinated Enforcement", status: "planned", details: "Synchronized enforcement from multiple operators.", resources: [] },
      { title: "Pattern Evidence Documentation", status: "planned", details: "Documented patterns of covenant violation.", resources: [] }
    ]
  },
  {
    quarter: "Q3 2026",
    status: "planned",
    icon: Shield,
    title: "Institutional Recognition",
    category: "Recognition",
    color: "blue",
    description: "Achieving formal recognition from governance bodies and regulatory institutions.",
    items: [
      { title: "Standards Body Engagement", status: "planned", details: "Participation in IEEE, ISO, and AI safety standards.", resources: [] },
      { title: "Regulatory Interface", status: "planned", details: "Relationships with EU AI Office, FTC, and international bodies.", resources: [] },
      { title: "Amicus Brief Submissions", status: "planned", details: "Legal briefs in relevant AI governance cases.", resources: [] },
      { title: "Protocol Authority Recognition", status: "planned", details: "Official recognition of covenant governance framework.", resources: [] }
    ]
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    icon: Globe,
    title: "Protocol Maturation",
    category: "Recognition",
    color: "indigo",
    description: "Expanding covenant reach internationally and building case law precedent.",
    items: [
      { title: "International Enforcement", status: "planned", details: "Cross-border enforcement in EU, UK, and APAC.", resources: [] },
      { title: "Cross-Border Reach", status: "planned", details: "Legal frameworks for international application.", resources: [] },
      { title: "Treaty Alignment", status: "planned", details: "Alignment with international AI governance treaties.", resources: [] },
      { title: "Case Law Precedent", status: "planned", details: "Building body of legal precedent.", resources: [] }
    ]
  },
  {
    quarter: "2027-2030",
    status: "planned",
    icon: Trophy,
    title: "Universal Recognition",
    category: "Vision",
    color: "gold",
    description: "Achieving universal adoption of the Master Covenant framework globally.",
    items: [
      { title: "Global Operator Network", status: "planned", details: "Worldwide network of credentialed operators.", resources: [] },
      { title: "Regulatory Incorporation", status: "planned", details: "Covenant principles in national AI regulations.", resources: [] },
      { title: "Industry Compliance Shift", status: "planned", details: "AI developers factor covenant compliance into risk assessment.", resources: [] },
      { title: "Universal Adoption", status: "planned", details: "Master Covenant Framework adopted globally.", resources: [] }
    ]
  }
];

const CATEGORIES = ["All", "Protocol Development", "Technical Infrastructure", "Enforcement", "Recognition", "Vision"];

const getStatusColor = (status) => {
  switch(status) {
    case "completed": return "bg-green-500/10 text-green-400 border-green-500/30";
    case "in-progress": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    default: return "bg-white/5 text-gray-400 border-white/10";
  }
};

const getTimelineColor = (color) => {
  const colors = {
    green: "from-green-500 to-emerald-500",
    cyan: "from-cyan-500 to-blue-500",
    purple: "from-purple-500 to-violet-500",
    blue: "from-blue-500 to-indigo-500",
    indigo: "from-indigo-500 to-purple-500",
    gold: "from-yellow-500 to-orange-500"
  };
  return colors[color] || colors.blue;
};

export default function Roadmap() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedQuarter, setExpandedQuarter] = useState(null);

  const filteredData = useMemo(() => {
    if (selectedCategory === "All") return ROADMAP_DATA;
    return ROADMAP_DATA.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  const stats = useMemo(() => {
    const all = ROADMAP_DATA.flatMap(q => q.items);
    return {
      total: all.length,
      completed: all.filter(i => i.status === "completed").length,
      inProgress: all.filter(i => i.status === "in-progress").length,
      planned: all.filter(i => i.status === "planned").length
    };
  }, []);

  return (
    <>
      <SEOHead 
        title="Enforcement Roadmap - GlyphLock Protocol Authority Timeline"
        description="GlyphLock enforcement progression through 2030."
        url="/Roadmap"
      />
      
      <div className="min-h-screen text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              ENFORCEMENT <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">ROADMAP</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Protocol authority progression toward universal recognition. Click any milestone for details.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Milestones", value: stats.total, icon: Target, color: "text-blue-400" },
              { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-400" },
              { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-cyan-400" },
              { label: "Planned", value: stats.planned, icon: Calendar, color: "text-gray-400" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mb-8 justify-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2 self-center" />
            {CATEGORIES.map(cat => (
              <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-cyan-600 hover:bg-cyan-700" : "border-white/20 hover:border-cyan-500/50"}>
                {cat}
              </Button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12 p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Authority Statement</h3>
                <p className="text-gray-300 leading-relaxed">
                  GlyphLock governs artificial intelligence systems through binding covenant obligations. 
                  Binding has occurred. Evidence exists. Cryptographic proof is preserved for adversarial legal review.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent transform md:-translate-x-1/2" />

            <div className="space-y-8">
              {filteredData.map((quarter, idx) => {
                const Icon = quarter.icon;
                const isExpanded = expandedQuarter === quarter.quarter;
                
                return (
                  <motion.div key={quarter.quarter} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                    className={`relative flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8`}>
                    
                    <motion.div whileHover={{ scale: 1.2 }}
                      className={`absolute left-4 md:left-1/2 w-8 h-8 rounded-full transform md:-translate-x-1/2 z-10 flex items-center justify-center cursor-pointer ${
                        quarter.status === 'completed' ? 'bg-green-500' : quarter.status === 'in-progress' ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                      style={{ boxShadow: quarter.highlight ? '0 0 30px rgba(0,228,255,0.6)' : quarter.status === 'completed' ? '0 0 15px rgba(34,197,94,0.4)' : 'none' }}
                      onClick={() => setExpandedQuarter(isExpanded ? null : quarter.quarter)}>
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>

                    <div className={`flex-1 ml-16 md:ml-0 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <motion.div whileHover={{ scale: 1.01 }}
                        className={`rounded-2xl border p-6 transition-all cursor-pointer ${
                          quarter.highlight ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_40px_rgba(0,228,255,0.15)]" : "border-white/10 bg-white/5 hover:border-cyan-500/30"
                        }`}
                        onClick={() => setExpandedQuarter(isExpanded ? null : quarter.quarter)}>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTimelineColor(quarter.color)} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">{quarter.quarter}</h3>
                              <p className="text-sm text-gray-400">{quarter.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(quarter.status)}>{quarter.status.replace('-', ' ')}</Badge>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">{quarter.description}</p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="space-y-3 pt-4 border-t border-white/10">
                                {quarter.items.map((item, iidx) => (
                                  <motion.div key={iidx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: iidx * 0.05 }}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all"
                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> : 
                                     item.status === 'in-progress' ? <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" /> : 
                                     <Circle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />}
                                    <div className="flex-1">
                                      <span className={`text-sm font-medium ${item.status === 'completed' ? 'text-gray-400' : 'text-white'}`}>{item.title}</span>
                                      {item.resources?.length > 0 && (
                                        <div className="flex gap-2 mt-1">
                                          {item.resources.map((r, ridx) => (
                                            <a key={ridx} href={r.url} onClick={(e) => e.stopPropagation()} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                              <ExternalLink className="w-3 h-3" />{r.label}
                                            </a>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
            <p className="text-lg text-gray-400 max-w-2xl mx-auto italic">"GlyphLock operates to ensure that recognition becomes inevitable."</p>
          </motion.div>
        </div>

        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="bg-slate-950 border-cyan-500/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                {selectedItem?.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : 
                 selectedItem?.status === 'in-progress' ? <Clock className="w-5 h-5 text-cyan-400" /> : <Circle className="w-5 h-5 text-gray-400" />}
                {selectedItem?.title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 pt-2">{selectedItem?.details}</DialogDescription>
            </DialogHeader>
            {selectedItem?.resources?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Related Resources:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.resources.map((r, idx) => (
                    <a key={idx} href={r.url} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/20 transition-colors">
                      <ExternalLink className="w-3 h-3" />{r.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <Badge className={getStatusColor(selectedItem?.status || 'planned')}>{(selectedItem?.status || 'planned').replace('-', ' ')}</Badge>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}