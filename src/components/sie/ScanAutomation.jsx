
import React from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function ScanAutomation({ config, onConfigChange, onSave }) {
    // Config and handlers are now managed by the parent via middleware
    if (!config) return null;

    const webhookUrl = `${window.location.origin}/api/apps/functions/triggerSieScan`;

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">Scan Automation</CardTitle>
                <CardDescription>Configure scheduled and event-based scans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-white">Active Status</Label>
                        <p className="text-sm text-slate-400">Enable or disable automated scanning</p>
                    </div>
                    <Switch 
                        checked={config.is_active}
                        onCheckedChange={(c) => onConfigChange({ ...config, is_active: c })}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Schedule</Label>
                    <Select 
                        value={config.schedule_type} 
                        onValueChange={(v) => onConfigChange({ ...config, schedule_type: v })}
                    >
                        <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                            <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual Only</SelectItem>
                            <SelectItem value="daily">Daily (Midnight UTC)</SelectItem>
                            <SelectItem value="weekly">Weekly (Sunday UTC)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="text-sm font-medium text-white">Event Triggers</h3>
                    
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Run on Deployment</Label>
                        <Switch 
                            checked={config.trigger_on_deploy}
                            onCheckedChange={(c) => onConfigChange({ ...config, trigger_on_deploy: c })}
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Run on Sitemap Change</Label>
                        <Switch 
                            checked={config.trigger_on_sitemap}
                            onCheckedChange={(c) => onConfigChange({ ...config, trigger_on_sitemap: c })}
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                    <Label className="text-white">Webhook Integration</Label>
                    <p className="text-xs text-slate-400 mb-2">Use this URL to trigger scans from external systems (CI/CD, etc).</p>
                    <div className="flex gap-2">
                        <Input 
                            readOnly 
                            value={webhookUrl} 
                            className="bg-slate-950 border-slate-800 text-slate-400 font-mono text-xs"
                        />
                        <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("Copied"); }}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-1 mt-2">
                        <Label className="text-xs text-slate-400">Secret Key (Include in payload as 'secret')</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={config.webhook_secret} 
                                readOnly
                                className="bg-slate-950 border-slate-800 text-slate-400 font-mono text-xs"
                            />
                             <Button variant="outline" size="icon" onClick={() => onConfigChange({ ...config, webhook_secret: crypto.randomUUID() })}>
                                <span className="text-xs">Gen</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <Button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700">
                    Save Configuration
                </Button>
            </CardContent>
        </Card>
    );
}
