import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, Crosshair, Download, Trash2, Save, AlertTriangle } from "lucide-react";
import FreeTrialGuard from "@/components/FreeTrialGuard";
import HotzoneWorkflowDiagram from "@/components/HotzoneWorkflowDiagram";

export default function HotzoneMapper() {
  const [image, setImage] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hotspotForm, setHotspotForm] = useState({
    name: "",
    description: "",
    severity: "medium",
    url: ""
  });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, hotspots, selectedHotspot]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setHotspots([]);
          setSelectedHotspot(null);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    hotspots.forEach((hotspot, index) => {
      const isSelected = selectedHotspot === index;
      const color = getSeverityColor(hotspot.severity);

      ctx.beginPath();
      ctx.arc(hotspot.x, hotspot.y, isSelected ? 25 : 20, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 4 : 3;
      ctx.stroke();
      ctx.fillStyle = color + "40";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(hotspot.x - 15, hotspot.y);
      ctx.lineTo(hotspot.x + 15, hotspot.y);
      ctx.moveTo(hotspot.x, hotspot.y - 15);
      ctx.lineTo(hotspot.x, hotspot.y + 15);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "bold 14px Arial";
      ctx.fillText(`#${index + 1}`, hotspot.x + 30, hotspot.y + 5);
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "#10b981",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626"
    };
    return colors[severity] || colors.medium;
  };

  const handleCanvasClick = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const clickedIndex = hotspots.findIndex(
      (h) => Math.sqrt((h.x - x) ** 2 + (h.y - y) ** 2) < 25
    );

    if (clickedIndex !== -1) {
      setSelectedHotspot(clickedIndex);
      const hotspot = hotspots[clickedIndex];
      setHotspotForm({
        name: hotspot.name,
        description: hotspot.description,
        severity: hotspot.severity,
        url: hotspot.url || ""
      });
    } else {
      const newHotspot = {
        x,
        y,
        name: `Hotspot ${hotspots.length + 1}`,
        description: "",
        severity: "medium",
        url: ""
      };
      setHotspots([...hotspots, newHotspot]);
      setSelectedHotspot(hotspots.length);
      setHotspotForm({
        name: newHotspot.name,
        description: "",
        severity: "medium",
        url: ""
      });
    }
  };

  const updateHotspot = () => {
    if (selectedHotspot === null) return;

    const updatedHotspots = [...hotspots];
    updatedHotspots[selectedHotspot] = {
      ...updatedHotspots[selectedHotspot],
      ...hotspotForm
    };
    setHotspots(updatedHotspots);
  };

  const deleteHotspot = () => {
    if (selectedHotspot === null) return;

    const updatedHotspots = hotspots.filter((_, index) => index !== selectedHotspot);
    setHotspots(updatedHotspots);
    setSelectedHotspot(null);
    setHotspotForm({
      name: "",
      description: "",
      severity: "medium",
      url: ""
    });
  };

  const exportData = () => {
    const data = {
      hotspots: hotspots.map((h) => ({
        x: h.x,
        y: h.y,
        name: h.name,
        description: h.description,
        severity: h.severity,
        url: h.url
      })),
      imageWidth: image.width,
      imageHeight: image.height
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hotzone-map.json";
    a.click();
  };

  const exportImage = () => {
    if (!canvasRef.current) return;

    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "hotzone-map.png";
    a.click();
  };

  return (
    <FreeTrialGuard serviceName="HotzoneMapper">
      <div className="bg-black text-white min-h-screen py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="border-red-500/50 glass-dark text-red-400 mb-6">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Security Mapping Tool
              </Badge>
              <h1 className="text-5xl font-bold mb-4 text-white">
                Hotzone <span className="bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">Mapper</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-2">
                Interactive security vulnerability mapping tool
              </p>
              <p className="text-sm text-white/60 max-w-2xl mx-auto">
                Upload images and mark security hotspots with severity levels to visualize your attack surface
              </p>
            </div>

            <HotzoneWorkflowDiagram />

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="glass-royal border-blue-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Security Map Canvas</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isDrawing ? "default" : "outline"}
                          onClick={() => setIsDrawing(!isDrawing)}
                          className={isDrawing ? "bg-gradient-to-r from-red-600 to-orange-700 text-white" : "text-white border-blue-500/50"}
                        >
                          <Crosshair className="w-4 h-4 mr-2" />
                          {isDrawing ? "Drawing" : "View"}
                        </Button>
                        {image && (
                          <>
                            <Button size="sm" variant="outline" onClick={exportImage} className="text-white border-blue-500/50 hover:bg-blue-500/20">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={exportData} className="text-white border-blue-500/50 hover:bg-blue-500/20">
                              <Save className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!image ? (
                      <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-12 text-center glass-dark">
                        <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                        <p className="text-white mb-4">Upload an image to start mapping</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="max-w-xs mx-auto glass-input text-white"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          onClick={handleCanvasClick}
                          className="w-full border border-blue-500/30 rounded-lg cursor-crosshair"
                          style={{ maxHeight: "600px", objectFit: "contain" }}
                        />
                        {isDrawing && (
                          <div className="absolute top-4 left-4 glass-royal rounded-lg p-3 text-sm text-white">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Click to place hotspots
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {image && (
                  <Card className="glass-royal border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Change Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="glass-input text-white"
                      />
                    </CardContent>
                  </Card>
                )}

                {selectedHotspot !== null && (
                  <Card className="glass-royal border-blue-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Edit Hotspot #{selectedHotspot + 1}</CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={deleteHotspot}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white">Name</Label>
                        <Input
                          value={hotspotForm.name}
                          onChange={(e) => setHotspotForm({ ...hotspotForm, name: e.target.value })}
                          className="glass-input text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Description</Label>
                        <Input
                          value={hotspotForm.description}
                          onChange={(e) => setHotspotForm({ ...hotspotForm, description: e.target.value })}
                          className="glass-input text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Severity Level</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["low", "medium", "high", "critical"].map((level) => (
                            <Button
                              key={level}
                              size="sm"
                              variant={hotspotForm.severity === level ? "default" : "outline"}
                              onClick={() => setHotspotForm({ ...hotspotForm, severity: level })}
                              className={
                                hotspotForm.severity === level
                                  ? `bg-gradient-to-r ${
                                      level === "low"
                                        ? "from-green-600 to-emerald-700"
                                        : level === "medium"
                                        ? "from-yellow-600 to-orange-700"
                                        : level === "high"
                                        ? "from-orange-600 to-red-700"
                                        : "from-red-600 to-red-800"
                                    } text-white`
                                  : "text-white border-blue-500/50 hover:bg-blue-500/20"
                              }
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-white">Link URL (optional)</Label>
                        <Input
                          value={hotspotForm.url}
                          onChange={(e) => setHotspotForm({ ...hotspotForm, url: e.target.value })}
                          placeholder="https://..."
                          className="glass-input text-white"
                        />
                      </div>
                      <Button
                        onClick={updateHotspot}
                        className="w-full bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-500/50"
                      >
                        Update Hotspot
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {hotspots.length > 0 && (
                  <Card className="glass-royal border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Hotspots ({hotspots.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                      {hotspots.map((hotspot, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedHotspot(index);
                            setHotspotForm({
                              name: hotspot.name,
                              description: hotspot.description,
                              severity: hotspot.severity,
                              url: hotspot.url || ""
                            });
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all glass-dark ${
                            selectedHotspot === index
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-blue-500/30 hover:border-blue-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white">#{index + 1} {hotspot.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                hotspot.severity === "low"
                                  ? "border-green-500 text-green-400 bg-green-500/10"
                                  : hotspot.severity === "medium"
                                  ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                                  : hotspot.severity === "high"
                                  ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                  : "border-red-500 text-red-400 bg-red-500/10"
                              }`}
                            >
                              {hotspot.severity}
                            </Badge>
                          </div>
                          {hotspot.description && (
                            <p className="text-sm text-white/80">{hotspot.description}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card className="glass-royal border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Quick Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-white">
                    <p>1. Upload network diagram or floor plan</p>
                    <p>2. Enable Drawing Mode</p>
                    <p>3. Click to place security markers</p>
                    <p>4. Set severity levels</p>
                    <p>5. Export for reports</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}