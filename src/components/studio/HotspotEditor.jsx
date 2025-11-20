import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function HotspotEditor({ hotspot, onUpdate }) {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    actionType: 'none',
    actionValue: ''
  });

  useEffect(() => {
    if (hotspot) {
      setFormData({
        label: hotspot.label || '',
        description: hotspot.description || '',
        actionType: hotspot.actionType || 'none',
        actionValue: hotspot.actionValue || ''
      });
    }
  }, [hotspot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hotspot) {
      onUpdate({ ...hotspot, ...formData });
    }
  };

  if (!hotspot) {
    return (
      <Card className="glass-royal border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white">Hotspot Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/50 text-center py-8">Select a hotspot to edit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-royal border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white">Edit Hotspot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label" className="text-white">Label *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="glass-card-dark border-blue-500/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass-card-dark border-blue-500/30 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="actionType" className="text-white">Action Type</Label>
            <Select
              value={formData.actionType}
              onValueChange={(value) => setFormData({ ...formData, actionType: value })}
            >
              <SelectTrigger className="glass-card-dark border-blue-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card-dark border-blue-500/30">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.actionType !== 'none' && (
            <div>
              <Label htmlFor="actionValue" className="text-white">
                {formData.actionType === 'link' ? 'URL' : 'Text Content'}
              </Label>
              <Input
                id="actionValue"
                value={formData.actionValue}
                onChange={(e) => setFormData({ ...formData, actionValue: e.target.value })}
                className="glass-card-dark border-blue-500/30 text-white"
                placeholder={formData.actionType === 'link' ? 'https://example.com' : 'Enter text...'}
              />
            </div>
          )}

          <div className="pt-2 border-t border-blue-500/30">
            <p className="text-xs text-white/50 mb-2">Position</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
              <div>X: {hotspot.x.toFixed(2)}%</div>
              <div>Y: {hotspot.y.toFixed(2)}%</div>
              <div>Width: {hotspot.width.toFixed(2)}%</div>
              <div>Height: {hotspot.height.toFixed(2)}%</div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Update Hotspot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}