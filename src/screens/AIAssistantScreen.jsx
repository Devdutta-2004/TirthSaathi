import React, { useState, useRef, useEffect } from 'react';
import { useYatra } from '../context/YatraContext';
import { aiSampleQueries } from '../data/faq';
import { Bot, Send, Mic, Sparkles, ShieldCheck, User } from 'lucide-react';

export const AIAssistantScreen = () => {
  const { addToast } = useYatra();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Namaste! I am your TirthSaathi AI Yatra Guide. How can I assist your pilgrimage today? Ask me about queue wait times, free bhandaras, nearest medical aid, or family tracking.',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: query, time: 'Just now' }
    ]);
    setInputValue('');
    setIsTyping(true);

    const match = aiSampleQueries.find(
      (q) => q.question.toLowerCase().includes(query.toLowerCase()) ||
             query.toLowerCase().includes(q.category.toLowerCase().split(' ')[0])
    );

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: match
            ? match.answer
            : `Regarding "${query}" in your yatra area: Temple Trust authorities confirm all security corridors are operational. Free drinking water ATMs and medical booths are open. Would you like me to guide you to the nearest recommended gate?`,
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  const handleVoice = () => {
    addToast('Voice Query Active', 'Listening for your pilgrimage question in Hindi/English...', 'info');
    setTimeout(() => {
      handleSend('Where is the nearest medical center?');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-yatra-blue to-navy-900 rounded-3xl p-4 sm:p-5 text-white flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-yatra-gold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold font-display">TirthSaathi AI Companion</h1>
            <p className="text-xs text-sky-200">Multilingual 24x7 Sacred Yatra Guide</p>
          </div>
        </div>

        <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full border border-white/20 hidden sm:inline">
          Verified Temple Intelligence
        </span>
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
        {aiSampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.question)}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-yatra-light text-slate-700 hover:text-yatra-blue text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
          >
            {q.question}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-yatra-blue text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-yatra-blue text-white rounded-tr-xs'
                    : 'bg-slate-50 text-navy-900 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[10px] block mt-1 ${isUser ? 'text-sky-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-navy-900 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400">
            <Bot className="w-5 h-5 text-yatra-blue animate-pulse" />
            <span>Consulting live temple telemetry...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <button
          type="button"
          onClick={handleVoice}
          className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-yatra-blue shadow-sm"
          title="Speak Query"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Ask a yatra question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-yatra-blue/30 focus:outline-none"
        />

        <button
          type="submit"
          className="p-3 rounded-2xl bg-yatra-blue hover:bg-yatra-bright text-white shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
