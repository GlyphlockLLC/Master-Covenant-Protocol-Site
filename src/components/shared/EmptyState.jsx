import React from "react";

export default function EmptyState({ 
  icon: Icon, 
  title = "No data found", 
  description,
  action 
}) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action}
    </div>
  );
}