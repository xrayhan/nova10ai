
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types';
import { generateAIResponse } from './services/geminiService';
import MessageItem from './components/MessageItem';
import AdultModeToggle from './components/AdultModeToggle';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: 'welcome',
        role: 'model',
        text: 'Hello! I am Nova AI. How can I assist you today? আপনি চাইলে আমার সাথে বাংলাতেও কথা বলতে পারেন।',
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    isAdultMode: false,
    error: null,
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true,
      error: null,
    }));
    setInput('');

    try {
      const assistantId = (Date.now() + 1).toString();
      let assistantText = "";
      
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages, 
          { id: assistantId, role: 'model', text: '', timestamp: new Date() }
        ]
      }));

      await generateAIResponse(
        [...state.messages, userMsg],
        state.isAdultMode,
        (chunk) => {
          assistantText += chunk;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === assistantId ? { ...m, text: assistantText } : m
            )
          }));
        }
      );

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Message failed. Please check your network.",
      }));
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] relative overflow-hidden">
      <div className={`mesh-gradient ${state.isAdultMode ? 'adult' : ''}`} />

      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${state.isAdultMode ? 'bg-red-600 scale-105' : 'bg-[#0084FF]'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#18191a]"></div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Nova AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {state.isAdultMode ? '18+ Unlocked' : 'Active Now'}
            </p>
          </div>
        </div>
        <AdultModeToggle isActive={state.isAdultMode} onToggle={(val) => setState(p => ({ ...p, isAdultMode: val }))} />
      </nav>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 md:px-24 lg:px-[25%] flex flex-col">
        <div className="mt-auto">
          {state.messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          
          {state.isLoading && state.messages[state.messages.length - 1]?.text === '' && (
             <div className="flex justify-start mb-4 px-1 items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
               <div className="bg-[#242526] px-4 py-3 rounded-[18px] flex items-center gap-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="p-3 md:p-4 lg:px-[25%] bg-[#0b0e14]/90 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={state.isLoading}
              placeholder={state.isAdultMode ? "Type unfiltered message..." : "Aa"}
              className={`w-full bg-[#242526] border-none rounded-full px-5 py-2.5 text-[15px] text-[#E4E6EB] placeholder-[#8e8e93] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all`}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || state.isLoading}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
              !input.trim() || state.isLoading 
                ? 'text-gray-700' 
                : state.isAdultMode ? 'text-red-500' : 'text-[#0084FF]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
