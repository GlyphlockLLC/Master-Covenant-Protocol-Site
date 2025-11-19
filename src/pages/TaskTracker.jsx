import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, AlertCircle, Filter } from "lucide-react";

export default function TaskTracker() {
  const [filter, setFilter] = useState("all");

  const tasks = [
    // COMPLETED TASKS
    { id: 1, title: "Eliminate all white backgrounds", status: "completed", priority: "critical", category: "UI/UX", date: "2025-01-19" },
    { id: 2, title: "Apply dark blue glassmorphism theme globally", status: "completed", priority: "critical", category: "UI/UX", date: "2025-01-19" },
    { id: 3, title: "Fix Radix UI components styling", status: "completed", priority: "critical", category: "UI/UX", date: "2025-01-19" },
    { id: 4, title: "Style all tables with blue theme", status: "completed", priority: "high", category: "UI/UX", date: "2025-01-19" },
    { id: 5, title: "Fix dropdown menus backgrounds", status: "completed", priority: "critical", category: "UI/UX", date: "2025-01-19" },
    { id: 6, title: "Configure Stripe checkout integration", status: "completed", priority: "critical", category: "Payment", date: "2025-01-18" },
    { id: 7, title: "Setup webhook handlers", status: "completed", priority: "critical", category: "Payment", date: "2025-01-18" },
    { id: 8, title: "Implement subscription management", status: "completed", priority: "high", category: "Payment", date: "2025-01-18" },
    { id: 9, title: "Create consultation booking flow", status: "completed", priority: "high", category: "Feature", date: "2025-01-17" },
    { id: 10, title: "Build GlyphBot AI assistant", status: "completed", priority: "high", category: "Feature", date: "2025-01-16" },

    // IN PROGRESS
    { id: 11, title: "Mobile responsiveness testing (iOS)", status: "in-progress", priority: "high", category: "Testing", date: "2025-01-19" },
    { id: 12, title: "Mobile responsiveness testing (Android)", status: "in-progress", priority: "high", category: "Testing", date: "2025-01-19" },
    { id: 13, title: "Cross-browser compatibility testing", status: "in-progress", priority: "medium", category: "Testing", date: "2025-01-19" },

    // PENDING
    { id: 14, title: "Load testing with concurrent users", status: "pending", priority: "high", category: "Testing", date: null },
    { id: 15, title: "Security penetration testing", status: "pending", priority: "critical", category: "Security", date: null },
    { id: 16, title: "Lighthouse performance audit", status: "pending", priority: "medium", category: "Performance", date: null },
    { id: 17, title: "Core Web Vitals optimization", status: "pending", priority: "medium", category: "Performance", date: null },
    { id: 18, title: "Image optimization and lazy loading", status: "pending", priority: "medium", category: "Performance", date: null },
    { id: 19, title: "Code splitting and bundle optimization", status: "pending", priority: "medium", category: "Performance", date: null },
    { id: 20, title: "API documentation completion", status: "pending", priority: "medium", category: "Documentation", date: null },
    { id: 21, title: "User guides for all features", status: "pending", priority: "medium", category: "Documentation", date: null },
    { id: 22, title: "Admin dashboard documentation", status: "pending", priority: "low", category: "Documentation", date: null },
    { id: 23, title: "Security compliance documentation", status: "pending", priority: "medium", category: "Documentation", date: null },
    { id: 24, title: "Email notification templates", status: "pending", priority: "low", category: "Feature", date: null },
    { id: 25, title: "Advanced analytics dashboard", status: "pending", priority: "low", category: "Feature", date: null },
    { id: 26, title: "A/B testing framework", status: "pending", priority: "low", category: "Feature", date: null },
    { id: 27, title: "User onboarding flow", status: "pending", priority: "medium", category: "Feature", date: null }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "pending":
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Task <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Tracker</span>
            </h1>
            <p className="text-xl text-white/70">GlyphLock Security Platform Development</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
                  <div className="text-sm text-white/70">Total Tasks</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-green-500/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
                  <div className="text-sm text-white/70">Completed</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stats.inProgress}</div>
                  <div className="text-sm text-white/70">In Progress</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-gray-500/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400 mb-2">{stats.pending}</div>
                  <div className="text-sm text-white/70">Pending</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              className={filter === "all" ? "bg-blue-600 text-white" : "border-blue-500/30 text-white"}
            >
              <Filter className="w-4 h-4 mr-2" />
              All Tasks
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "outline"}
              className={filter === "completed" ? "bg-green-600 text-white" : "border-green-500/30 text-white"}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilter("in-progress")}
              variant={filter === "in-progress" ? "default" : "outline"}
              className={filter === "in-progress" ? "bg-blue-600 text-white" : "border-blue-500/30 text-white"}
            >
              In Progress
            </Button>
            <Button
              onClick={() => setFilter("pending")}
              variant={filter === "pending" ? "default" : "outline"}
              className={filter === "pending" ? "bg-gray-600 text-white" : "border-gray-500/30 text-white"}
            >
              Pending
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="glass-card-dark border-blue-500/30 hover:border-blue-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                      {task.date && (
                        <p className="text-sm text-white/50">
                          {task.status === "completed" ? "Completed:" : "Started:"} {task.date}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Bar */}
          <Card className="glass-card-dark border-blue-500/30 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Completion Rate</span>
                    <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}