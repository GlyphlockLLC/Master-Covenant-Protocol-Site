import React from "react";
import { MessageSquare, Trash2, Plus } from "lucide-react";

export default function ConversationList({ 
  conversations, 
  currentConvId, 
  onSelect, 
  onNew, 
  onDelete 
}) {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  currentConvId === conv.id
                    ? "bg-cyan-600/20 border border-cyan-600"
                    : "hover:bg-gray-800 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {conv.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {conv.messages?.length || 0} messages
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this conversation?")) {
                        onDelete(conv.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}