import React, { useState } from 'react';
import { navItems } from './DashboardData';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardSidebar({ onSelectItem, selectedModel, darkMode }) {
  const [openCategory, setOpenCategory] = useState(navItems[0].category);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <nav className={`w-64 h-full ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
      <div className="p-4">
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Data Models</h2>
        <div className="space-y-2">
          {navItems.map((section) => (
            <div key={section.category}>
              <button
                onClick={() => handleCategoryClick(section.category)}
                className={`w-full text-left font-semibold text-sm flex justify-between items-center p-2 rounded-md ${
                  darkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-900'
                } transition-colors`}
              >
                {section.category}
                {openCategory === section.category ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openCategory === section.category && (
                <ul className={`pl-4 mt-2 space-y-1 border-l-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => onSelectItem(item)}
                        className={`w-full text-left text-sm p-2 rounded-md transition-colors ${
                          selectedModel?.id === item.id
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : darkMode
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}