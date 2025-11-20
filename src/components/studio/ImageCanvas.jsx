import React, { useRef, useEffect, useState } from "react";

export default function ImageCanvas({ imageUrl, hotspots, selectedHotspot, onAddHotspot, onSelectHotspot }) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setImage(img);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, hotspots, selectedHotspot, currentRect]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    const containerWidth = canvas.parentElement.clientWidth;
    const scale = containerWidth / image.width;
    const scaledHeight = image.height * scale;

    canvas.width = containerWidth;
    canvas.height = scaledHeight;

    ctx.drawImage(image, 0, 0, containerWidth, scaledHeight);

    hotspots.forEach(hotspot => {
      const x = (hotspot.x / 100) * containerWidth;
      const y = (hotspot.y / 100) * scaledHeight;
      const w = (hotspot.width / 100) * containerWidth;
      const h = (hotspot.height / 100) * scaledHeight;

      const isSelected = selectedHotspot?.id === hotspot.id;

      ctx.strokeStyle = isSelected ? '#60a5fa' : '#3b82f6';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = isSelected ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(hotspot.label, x + 5, y + 20);
    });

    if (currentRect) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
      ctx.setLineDash([]);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedHotspot = hotspots.find(h => {
      const hx = (h.x / 100) * canvas.width;
      const hy = (h.y / 100) * canvas.height;
      const hw = (h.width / 100) * canvas.width;
      const hh = (h.height / 100) * canvas.height;
      return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
    });

    if (clickedHotspot) {
      onSelectHotspot(clickedHotspot);
    } else {
      setIsDrawing(true);
      setStartPos({ x, y });
      onSelectHotspot(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPos.x;
    const height = y - startPos.y;

    setCurrentRect({
      x: width > 0 ? startPos.x : x,
      y: height > 0 ? startPos.y : y,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width > 10 && currentRect.height > 10) {
      const canvas = canvasRef.current;
      const xPercent = (currentRect.x / canvas.width) * 100;
      const yPercent = (currentRect.y / canvas.height) * 100;
      const wPercent = (currentRect.width / canvas.width) * 100;
      const hPercent = (currentRect.height / canvas.height) * 100;

      onAddHotspot({
        x: xPercent,
        y: yPercent,
        width: wPercent,
        height: hPercent,
        label: `Hotspot ${hotspots.length + 1}`,
        description: '',
        actionType: 'none',
        actionValue: ''
      });
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentRect(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full border border-blue-500/30 rounded-lg cursor-crosshair"
      />
      <p className="text-xs text-white/50 mt-2">Click and drag to draw hotspots. Click existing hotspots to select them.</p>
    </div>
  );
}