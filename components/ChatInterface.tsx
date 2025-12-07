import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, AnalysisVibe } from "../types";
import { sendChatMessage } from "../services/geminiService";

interface ChatInterfaceProps {
  initialQuestion: string;
  imageBase64: string;
  mimeType: string;
  vibe: AnalysisVibe;
  initialUserPrompt: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialQuestion, 
  imageBase64, 
  mimeType, 
  vibe,
  initialUserPrompt 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: initialQuestion }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMsg = input.trim();
    setInput("");
    
    // Optimistic update
    const newMessages = [...messages, { role: 'user', text: userMsg } as ChatMessage];
    setMessages(newMessages);
    setIsSending(true);

    try {
      // Pass the history *excluding* the very last optimistic message to the service, 
      // or handle it inside. The service expects history + new message.
      // We pass `messages` (which is history before the new user msg) and `userMsg`.
      const responseText = await sendChatMessage(
        messages, 
        userMsg, 
        imageBase64, 
        mimeType, 
        vibe, 
        initialUserPrompt
      );

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "System Error: Unable to process query." }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Chat Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-debug-blue/20 flex items-center justify-center">
             <i className="fa-solid fa-comments text-debug-blue text-sm"></i>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide uppercase">Live Consultation</h3>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">With Life Debugger</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-debug-dark/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-debug-blue text-white rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
               <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 border border-slate-700 flex items-center gap-2">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 pr-12 focus:outline-none focus:border-debug-blue focus:ring-1 focus:ring-debug-blue transition-all resize-none min-h-[50px] max-h-[120px]"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="absolute right-2 bottom-2 w-10 h-10 bg-gradient-to-r from-debug-blue to-debug-orange hover:from-blue-500 hover:to-orange-400 text-white rounded-lg flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <i className="fa-solid fa-paper-plane group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;
