import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";

const GL_LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/382879216_qrgl.png";

const GlPreviewBlock = ({ qrData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!qrData || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, qrData, {
      width: 120,
      margin: 0,
      color: {
        dark: "#000000",
        light: "#ffffff00" // transparent background
      }
    });
  }, [qrData]);

  return (
    <div className="gl-preview-block">
      <div className="gl-preview-inner">
        {/* GL Logo Frame */}
        <img 
          src={GL_LOGO_URL} 
          alt="GlyphLock Logo Frame" 
          className="gl-logo-frame" 
        />

        {/* QR Canvas positioned inside the hollow square */}
        {qrData && (
          <canvas
            ref={canvasRef}
            className="qr-preview-inside"
          />
        )}
      </div>
    </div>
  );
};

export default GlPreviewBlock;