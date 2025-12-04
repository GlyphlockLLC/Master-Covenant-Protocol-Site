import React from "react";

const GL_LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/382879216_qrgl.png";

const GlPreviewBlock = ({ previewSrc }) => {
  return (
    <div className="gl-preview-block">
      <div className="gl-preview-inner">
        <img 
          src={GL_LOGO_URL} 
          alt="GlyphLock Logo Frame" 
          className="gl-logo-frame" 
        />

        {previewSrc && (
          <img
            src={previewSrc}
            alt="QR Preview"
            className="qr-preview-inside"
          />
        )}
      </div>
    </div>
  );
};

export default GlPreviewBlock;