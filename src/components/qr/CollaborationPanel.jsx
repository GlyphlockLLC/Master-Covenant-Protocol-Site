import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Users, Wifi, WifiOff, Minimize2, Maximize2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CollaborationPanel({ activeUsers = [], isConnected, messages = [], onSendMessage, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !onSendMessage) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  // Minimized View
  if (!isOpen) {
    return (
      <Card 
        className="fixed bottom-4 right-4 w-auto bg-slate-900/90 border-slate-700 shadow-2xl backdrop-blur-lg z-50 cursor-pointer hover:border-cyan-500/50 transition-all min-w-[200px]"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono text-slate-400">
              {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-700" />
          
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-slate-900">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback className="bg-cyan-900 text-cyan-200 text-[8px]">
                  {user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
          
          {messages.length > 0 && (
             <Badge className="ml-auto bg-cyan-600 text-white text-[10px] h-5 px-1.5 flex items-center gap-1">
               <MessageSquare className="w-3 h-3" />
               {messages.length}
             </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  // Expanded View
  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 bg-slate-900 border-slate-700 shadow-2xl backdrop-blur-lg z-50 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-950/50 flex flex-row items-center justify-between space-y-0 rounded-t-lg">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Collaborators ({activeUsers.length})
        </CardTitle>
        <div className="flex items-center gap-1">
          {isConnected ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Wifi className="w-3 h-3 text-green-500" /></TooltipTrigger>
                <TooltipContent>Connected</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Active Users List */}
        <div className="p-2 bg-slate-900/50 border-b border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
           {activeUsers.map((user, i) => (
             <TooltipProvider key={i}>
               <Tooltip>
                 <TooltipTrigger>
                   <div className="relative">
                     <Avatar className="w-8 h-8 border border-slate-600">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                       <AvatarFallback className="bg-slate-800 text-xs">{user.email?.[0]}</AvatarFallback>
                     </Avatar>
                     <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-slate-900 rounded-full"></div>
                   </div>
                 </TooltipTrigger>
                 <TooltipContent className="text-xs bg-slate-800 text-white border-slate-700">
                   {user.email}
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
           ))}
           {activeUsers.length === 0 && (
             <span className="text-xs text-slate-500 italic px-2 py-1">Waiting for others...</span>
           )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-slate-500 mt-10">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>Chat with your team in real-time.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.senderId === currentUser?.id || msg.senderEmail === currentUser?.email;
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-2 text-xs shadow-sm ${
                      isMe 
                        ? 'bg-cyan-600 text-white rounded-br-none' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}>
                      {!isMe && <div className="text-[9px] text-slate-400 mb-1 font-semibold">{msg.senderEmail?.split('@')[0]}</div>}
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-600 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-2 border-t border-slate-800 bg-slate-950/30 flex gap-2">
          <Input 
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type message..."
            className="h-9 text-xs bg-slate-900 border-slate-700 text-white focus-visible:ring-cyan-500/50"
          />
          <Button type="submit" size="icon" className="h-9 w-9 bg-cyan-600 hover:bg-cyan-700 shrink-0" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}