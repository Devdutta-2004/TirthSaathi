import React, { useState, useRef, useEffect } from 'react';
import { useYatra } from '../context/YatraContext';
import { aiSampleQueries } from '../data/faq';
import { Bot, Send, Sparkles, Mic, Compass, CornerDownLeft, Volume2, ShieldCheck } from 'lucide-react';

export const AIAssistantSection = () => {
  const { addToast } = useYatra();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Namaste! I am your TirthSaathi AI Yatra Guide. How can I assist your sacred pilgrimage today? Ask me about medical aid, bhandaras, darshan queue timings, or family safety.',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (queryText) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Find closest matched preset or default response
    const matched = aiSampleQueries.find(
      (q) => q.question.toLowerCase().includes(textToSend.toLowerCase()) ||
             textToSend.toLowerCase().includes(q.category.toLowerCase().split(' ')[0])
    );

    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: matched
          ? matched.answer
          : `For "${textToSend}" in your current yatra sector, the Temple Coordination Desk recommends checking official security gates 1-4. All nearby emergency medical booths and free Annakshetras are open. Would you like me to guide you to the nearest help station?`,
        time: 'Just now'
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 700);
  };

  const handleVoiceQuery = () => {
    addToast('Voice Query Enabled', 'Listening in Hindi / English for your pilgrimage query...', 'info');
    setTimeout(() => {
      handleSendMessage('Where is the nearest medical center?');
    }, 1200);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yatra-bg border-t border-slate-100 relative overflow-hidden">
      {/* Subtle Glowing Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-yatra-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-yatra-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yatra-gold" /> AI Yatra Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-navy-900 tracking-tight">
            Your Personal Yatra Assistant
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
            Ask. Discover. Navigate. Stay informed with 24x7 intelligent pilgrimage guidance in your language.
          </p>
        </div>

        {/* AI Interface Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl sm:rounded-4xl shadow-float border border-slate-200/90 overflow-hidden">
          {/* Chat Top Banner */}
          <div className="bg-gradient-to-r from-navy-900 via-yatra-blue to-navy-900 p-4 sm:p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-yatra-gold shadow-glow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base font-display">TirthSaathi AI Companion</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-sky-100">Live Context: Kashi Vishwanath Dham • Multilingual</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-yatra-sky" />
              <span>Temple Trust Verified Info</span>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/70 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
              Suggestions:
            </span>
            {aiSampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.question)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-yatra-light text-slate-700 hover:text-yatra-blue text-xs font-semibold border border-slate-200 hover:border-yatra-blue/40 transition-all shadow-2xs"
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* Chat Messages Container */}
          <div className="p-4 sm:p-6 h-80 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-yatra-blue text-white flex items-center justify-center text-xs flex-shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-yatra-blue text-white rounded-tr-xs'
                        : 'bg-white text-navy-900 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[10px] block mt-1.5 ${isUser ? 'text-sky-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-navy-800 text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      👤
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-yatra-blue text-white flex items-center justify-center text-xs flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 text-xs text-slate-500 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-yatra-blue animate-ping" />
                  <span>Checking live temple telemetry...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceQuery}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-yatra-light text-slate-600 hover:text-yatra-blue transition-colors flex-shrink-0"
              title="Voice Query (Speak in Hindi/English)"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Ask anything (e.g. 'Where is the nearest medical center?')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yatra-blue/30 focus:border-yatra-blue text-navy-900 font-medium"
            />

            <button
              type="submit"
              className="p-3 rounded-2xl bg-yatra-blue hover:bg-yatra-bright text-white shadow-md transition-all flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
