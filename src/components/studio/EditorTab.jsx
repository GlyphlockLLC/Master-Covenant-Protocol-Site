import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import UploadZone from "./UploadZone";
import ToolbarPanel from "./ToolbarPanel";
import CanvasPanel from "./CanvasPanel";
import PropertiesPanel from "./PropertiesPanel";

export default function EditorTab({ user, onFinalizeSuccess }) {
  const [imageId, setImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState("");
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      
      const uploadResult = await base44.integrations.Core.UploadFile({ file });
      
      const image = await base44.entities.InteractiveImage.create({
        name: file.name,
        fileUrl: uploadResult.file_url,
        width: 0,
        height: 0,
        status: 'draft',
        ownerEmail: user.email
      });
      
      setImageId(image.id);
      setImageUrl(uploadResult.file_url);
      setImageName(file.name);
      setHotspots([]);
      setSelectedHotspot(null);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotspot = (hotspot) => {
    const newHotspot = { 
      ...hotspot, 
      id: Date.now().toString(),
      label: `Hotspot ${hotspots.length + 1}`,
      description: '',
      actionType: 'none',
      actionValue: ''
    };
    setHotspots([...hotspots, newHotspot]);
    setSelectedHotspot(newHotspot);
  };

  const handleUpdateHotspot = (updatedHotspot) => {
    setHotspots(hotspots.map(h => h.id === updatedHotspot.id ? updatedHotspot : h));
    setSelectedHotspot(updatedHotspot);
  };

  const handleDeleteHotspot = () => {
    if (!selectedHotspot) return;
    setHotspots(hotspots.filter(h => h.id !== selectedHotspot.id));
    setSelectedHotspot(null);
  };

  const handleSaveHotspots = async () => {
    if (!imageId) return;

    try {
      const response = await base44.functions.invoke('saveImageHotspots', {
        imageId,
        hotspots
      });

      if (response.data.success) {
        return true;
      }
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    }
  };

  const handleFinalize = async () => {
    if (!imageId) return;

    try {
      await handleSaveHotspots();

      const response = await base44.functions.invoke('finalizeInteractiveImage', {
        imageId
      });

      if (response.data.success) {
        onFinalizeSuccess(response.data.logId);
        return response.data;
      }
    } catch (error) {
      console.error("Finalize error:", error);
      throw error;
    }
  };

  if (!imageUrl) {
    return <UploadZone onUpload={handleImageUpload} loading={loading} />;
  }

  return (
    <div className="grid lg:grid-cols-12 gap-4">
      <div className="lg:col-span-1">
        <ToolbarPanel activeTool={activeTool} onToolChange={setActiveTool} />
      </div>

      <div className="lg:col-span-7">
        <CanvasPanel
          imageUrl={imageUrl}
          imageName={imageName}
          hotspots={hotspots}
          selectedHotspot={selectedHotspot}
          activeTool={activeTool}
          onAddHotspot={handleAddHotspot}
          onSelectHotspot={setSelectedHotspot}
        />
      </div>

      <div className="lg:col-span-4">
        <PropertiesPanel
          selectedHotspot={selectedHotspot}
          hotspots={hotspots}
          onUpdateHotspot={handleUpdateHotspot}
          onDeleteHotspot={handleDeleteHotspot}
          onSelectHotspot={setSelectedHotspot}
          onSave={handleSaveHotspots}
          onFinalize={handleFinalize}
        />
      </div>
    </div>
  );
}