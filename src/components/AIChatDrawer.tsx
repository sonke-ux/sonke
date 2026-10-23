import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, User, Loader2, Copy, Check, MessageSquare, MapPin, ExternalLink } from 'lucide-react';
import { RatepayerAccount } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  locations?: Array<{ title: string; url: string; address?: string }>;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  account: RatepayerAccount | null;
  initialQuery?: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onToggle,
  account,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Sanibonani! I am your official City of uMhlathuze Municipal Rates & Valuation AI Advisor, powered by Gemini 3 Flash. I can explain property valuations, dispute procedures, Section 118 clearance certificates, and pensioner rebates across Richards Bay, Empangeni, and surrounding areas. How may I assist you today?",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const isLocationQuery =
        text.toLowerCase().includes('office') ||
        text.toLowerCase().includes('location') ||
        text.toLowerCase().includes('pay point') ||
        text.toLowerCase().includes('map') ||
        text.toLowerCase().includes('where') ||
        text.toLowerCase().includes('kiosk') ||
        text.toLowerCase().includes('richards bay') ||
        text.toLowerCase().includes('empangeni') ||
        text.toLowerCase().includes('esikhaleni') ||
        text.toLowerCase().includes('meerensee');

      if (isLocationQuery) {
        const response = await fetch('/api/gemini/maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text }),
        });
        const data = await response.json();

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text || 'Here are verified City of uMhlathuze customer service centres and payment points:',
          locations: data.locations || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            context: account
              ? {
                  name: account.name,
                  accNo: account.accNo,
                  address: account.address,
                  balance: account.balance,
                  valuation: account.marketValuation,
                }
              : null,
          }),
        });

        const data = await response.json();
        const aiReply = data.reply || "I am unable to answer right now. Please contact the uMhlathuze municipal customer service line.";

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "Under City of uMhlathuze Municipal policy, property rates are calculated as: (Market Value - R350,000 primary rebate) × 0.0125 for residential properties. You can view your bill breakdown, download official clearance certificates, or submit an objection directly through this portal.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '📍 Find Municipal Offices & Pay Points',
    'How do I dispute my property valuation?',
    'What is a Section 118 clearance certificate?',
    'How do I apply for pensioner rates rebate?',
    'Explain the 50% debt relief incentive.',
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-sky-500/30 flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer group border border-sky-400/40"
          title="Chat with uMhlathuze Rates Gemini AI"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border border-slate-900 shadow">
            AI Online
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-900/80 via-slate-900 to-slate-900 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                  <span>uMhlathuze Rates AI</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded">Gemini 3.8</span>
                </h3>
                <p className="text-[10px] text-slate-400">Official Municipal Regulations Advisor</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Google Maps Grounded Locations */}
                  {msg.locations && msg.locations.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60 not-prose">
                      <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1 uppercase tracking-wider">
                        <MapPin className="w-3 h-3" /> Grounded Locations (Google Maps):
                      </span>
                      {msg.locations.map((loc, idx) => (
                        <a
                          key={idx}
                          href={loc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 transition group/loc text-left no-underline"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-bold text-white text-[11px] group-hover/loc:text-sky-300 transition">
                              {loc.title}
                            </span>
                            <ExternalLink className="w-3 h-3 text-sky-400 flex-shrink-0" />
                          </div>
                          {loc.address && (
                            <p className="text-[10px] text-slate-400 mt-0.5">{loc.address}</p>
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] mt-1.5 opacity-60 text-right">{msg.time}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-800/90 text-slate-400 border border-slate-700/80 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>Consulting municipal rate regulations...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt chips */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] rounded-lg border border-slate-700 transition cursor-pointer flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 items-center flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask regarding valuations, rates, rebates..."
              className="flex-1 py-2 px-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
