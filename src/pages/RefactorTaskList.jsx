import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle, Zap, Shield, DollarSign } from "lucide-react";

export default function RefactorTaskList() {
  const tasks = {
    critical: [
      { id: 1, title: "Stripe Integration - Fix API Key Configuration", status: "in-progress", priority: "critical" },
      { id: 2, title: "OAuth Implementation - User Authentication Flow", status: "pending", priority: "critical" },
      { id: 3, title: "Paywall System - Consultation & Service Access", status: "pending", priority: "critical" },
      { id: 4, title: "Mobile Responsiveness - All Pages", status: "in-progress", priority: "critical" },
      { id: 5, title: "Footer Scroll Issue - Fix Navigation", status: "completed", priority: "critical" },
    ],
    high: [
      { id: 6, title: "White Background Fixes - Master Covenant Page", status: "completed", priority: "high" },
      { id: 7, title: "White Background Fixes - Image Generator", status: "pending", priority: "high" },
      { id: 8, title: "HSSS Redesign - Real Hotspot Mapping", status: "completed", priority: "high" },
      { id: 9, title: "Payment Success Flow - Confirmation Pages", status: "pending", priority: "high" },
      { id: 10, title: "Email Notifications - Consultation Booking", status: "pending", priority: "high" },
    ],
    medium: [
      { id: 11, title: "Dashboard Analytics - User Metrics", status: "pending", priority: "medium" },
      { id: 12, title: "Security Scanner - Real-time Monitoring", status: "pending", priority: "medium" },
      { id: 13, title: "GlyphBot AI - Enhance Responses", status: "in-progress", priority: "medium" },
      { id: 14, title: "NUPS POS - Inventory Sync", status: "pending", priority: "medium" },
      { id: 15, title: "Documentation - API Reference", status: "pending", priority: "medium" },
    ],
    improvements: [
      { title: "Home Page Scroll - 3D Effects", completed: true },
      { title: "Navigation - Glassmorphism Design", completed: true },
      { title: "Interactive Nebula Background", completed: true },
      { title: "Tech Stack Carousel", completed: true },
      { title: "Consultation Booking Form", completed: true },
    ]
  };

  const stats = {
    total: Object.values(tasks).flat().filter(t => t.id).length,
    completed: Object.values(tasks).flat().filter(t => t.status === "completed").length,
    inProgress: Object.values(tasks).flat().filter(t => t.status === "in-progress").length,
    pending: Object.values(tasks).flat().filter(t => t.status === "pending").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case "pending": return <Circle className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Launch <span className="text-blue-400">Preparation</span>
            </h1>
            <p className="text-xl text-gray-400">
              Critical tasks before going live
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card-dark">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-green-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-yellow-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.inProgress}</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </CardContent>
            </Card>
            <Card className="glass-card-dark border-gray-500/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-400 mb-2">{stats.pending}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card-dark border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  Critical Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.critical.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Shield className="w-5 h-5" />
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.high.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-blue-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <DollarSign className="w-5 h-5" />
                  Medium Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.medium.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-green-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Recent Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.improvements.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg glass-dark">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}