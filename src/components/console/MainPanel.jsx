import React from "react";

export default function MainPanel({ children, title, description, actions }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Panel Header */}
      {(title || actions) && (
        <div className="bg-[#020617] border-b border-[#8C4BFF]/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>}
              {description && <p className="text-white/70">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}