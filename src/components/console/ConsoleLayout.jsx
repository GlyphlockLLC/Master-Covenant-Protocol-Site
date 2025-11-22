import React from "react";
import ConsoleSidebar from "./ConsoleSidebar";
import TopBar from "./TopBar";

export default function ConsoleLayout({ 
  user, 
  activeModule, 
  setActiveModule, 
  children 
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ConsoleSidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule} 
          user={user} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} />
          
          <main className="flex-1 overflow-auto bg-[#020617]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}