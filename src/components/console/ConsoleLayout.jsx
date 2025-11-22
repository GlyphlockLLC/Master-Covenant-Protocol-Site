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
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#00E4FF]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#8C4BFF]/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <ConsoleSidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule} 
          user={user} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} />
          
          <main className="flex-1 overflow-auto bg-[#020617]/50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}