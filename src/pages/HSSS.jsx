import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Plus, Save, MapPin, ExternalLink, Phone, Mail, Calendar, ShoppingCart, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const hotspotTypes = [
  { value: "url", label: "URL Link", icon: ExternalLink },
  { value: "phone", label: "Phone Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "calendar", label: "Schedule Event", icon: Calendar },
  { value: "order", label: "Make Order", icon: ShoppingCart },
  { value: "message", label: "Send Message", icon: MessageSquare }
];

export default function HSSS() {
  const queryClient = useQueryClient();
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [currentHotspot, setCurrentHotspot] = useState(null);
  const imageRef = useRef(null);

  const { data: maps = [] } = useQuery({
    queryKey: ['hotspot-maps'],
    queryFn: () => base44.entities.HotzoneMap.list(),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const result = await base44.integrations.Core.UploadFile({ file });
      return result.file_url;
    }
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.HotzoneMap.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotspot-maps'] });
      resetForm();
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setUploadedImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentHotspot({ x, y, name: "", action: "", actionValue: "", type: "url" });
  };

  const saveHotspot = () => {
    if (currentHotspot && currentHotspot.name && currentHotspot.actionValue) {
      setHotspots([...hotspots, { ...currentHotspot, id: Date.now() }]);
      setCurrentHotspot(null);
    }
  };

  const removeHotspot = (id) => {
    setHotspots(hotspots.filter(h => h.id !== id));
  };

  const handleSaveMap = async () => {
    if (!imageFile || !mapName || hotspots.length === 0) return;

    const imageUrl = await uploadMutation.mutateAsync(imageFile);
    
    const mapData = {
      name: mapName,
      description: mapDescription,
      image_url: imageUrl,
      image_width: imageRef.current?.naturalWidth || 1000,
      image_height: imageRef.current?.naturalHeight || 1000,
      hotspots: hotspots.map(h => ({
        x: h.x,
        y: h.y,
        name: h.name,
        type: h.type,
        action_value: h.actionValue,
        description: h.action
      })),
      map_type: "interactive",
      status: "active"
    };

    saveMutation.mutate(mapData);
  };

  const resetForm = () => {
    setMapName("");
    setMapDescription("");
    setUploadedImage(null);
    setImageFile(null);
    setHotspots([]);
    setCurrentHotspot(null);
  };

  const getActionPrefix = (type) => {
    switch (type) {
      case "phone": return "tel:";
      case "email": return "mailto:";
      case "url": return "";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hotspot Smart System <span className="text-blue-400">(HSSS)</span>
            </h1>
            <p className="text-xl text-gray-400">
              Create interactive images with clickable hotspots for links, calls, emails, and more
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass-card-dark p-6">
              <h2 className="text-2xl font-bold mb-6">Create Interactive Map</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <Label>Map Name</Label>
                  <Input
                    value={mapName}
                    onChange={(e) => setMapName(e.target.value)}
                    placeholder="e.g., Product Catalog, Service Menu"
                    className="glass-dark"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={mapDescription}
                    onChange={(e) => setMapDescription(e.target.value)}
                    placeholder="Describe your interactive map"
                    className="glass-dark"
                  />
                </div>

                <div>
                  <Label>Upload Image</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" className="w-full glass-dark" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {imageFile ? imageFile.name : "Choose Image"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {uploadedImage && (
                <div className="relative rounded-lg overflow-hidden border-2 border-blue-500/30 mb-4">
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Hotspot map"
                    onClick={handleImageClick}
                    className="w-full cursor-crosshair"
                  />
                  {hotspots.map((hotspot) => (
                    <div
                      key={hotspot.id}
                      style={{
                        position: 'absolute',
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="group"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <p className="font-semibold text-sm">{hotspot.name}</p>
                        <p className="text-xs text-gray-400">{hotspot.action}</p>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeHotspot(hotspot.id)}
                          className="mt-2 w-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentHotspot && (
                <Card className="glass-card p-4 mb-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Hotspot
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Hotspot Name</Label>
                      <Input
                        value={currentHotspot.name}
                        onChange={(e) => setCurrentHotspot({...currentHotspot, name: e.target.value})}
                        placeholder="e.g., Contact Sales"
                        className="glass-dark"
                      />
                    </div>
                    
                    <div>
                      <Label>Action Type</Label>
                      <Select
                        value={currentHotspot.type}
                        onValueChange={(value) => setCurrentHotspot({...currentHotspot, type: value, actionValue: ""})}
                      >
                        <SelectTrigger className="glass-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-dark">
                          {hotspotTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>
                        {currentHotspot.type === "phone" && "Phone Number"}
                        {currentHotspot.type === "email" && "Email Address"}
                        {currentHotspot.type === "url" && "URL"}
                        {currentHotspot.type === "calendar" && "Calendar Link"}
                        {currentHotspot.type === "order" && "Order Link"}
                        {currentHotspot.type === "message" && "Message Link"}
                      </Label>
                      <Input
                        value={currentHotspot.actionValue}
                        onChange={(e) => setCurrentHotspot({...currentHotspot, actionValue: e.target.value})}
                        placeholder={
                          currentHotspot.type === "phone" ? "+1234567890" :
                          currentHotspot.type === "email" ? "contact@example.com" :
                          "https://example.com"
                        }
                        className="glass-dark"
                      />
                    </div>

                    <div>
                      <Label>Description (optional)</Label>
                      <Input
                        value={currentHotspot.action}
                        onChange={(e) => setCurrentHotspot({...currentHotspot, action: e.target.value})}
                        placeholder="What happens when clicked?"
                        className="glass-dark"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={saveHotspot} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Hotspot
                      </Button>
                      <Button onClick={() => setCurrentHotspot(null)} variant="outline" className="glass-dark">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <Button
                onClick={handleSaveMap}
                disabled={!imageFile || !mapName || hotspots.length === 0 || saveMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                {saveMutation.isPending ? "Saving..." : "Save Interactive Map"}
              </Button>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-6">Your Interactive Maps</h2>
              <div className="space-y-4">
                {maps.map((map) => (
                  <Card key={map.id} className="glass-card-dark p-4">
                    <div className="flex gap-4">
                      <img
                        src={map.image_url}
                        alt={map.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{map.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{map.description}</p>
                        <p className="text-xs text-blue-400">{map.hotspots?.length || 0} hotspots</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {map.hotspots?.map((hotspot, idx) => (
                            <a
                              key={idx}
                              href={getActionPrefix(hotspot.type) + hotspot.action_value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
                            >
                              {hotspot.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}