import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User, Bot, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { LanguageProps } from '../types';

export const ChatBot: React.FC<LanguageProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      placeholder: "Ask Jason about training...",
      title: "Jason AI Twin",
      status: "Online",
      welcome: "Hey! I'm Jason's AI twin. Ready to crush some sets?"
    },
    cn: {
      placeholder: "詢問關於訓練的問題...",
      title: "新爺 AI 分身",
      status: "在線",
      welcome: "嘿！我是新爺的 AI 分身。準備好開始訓練了嗎？"
    }
  }[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: lang === 'cn' ? "抱歉，連線出了點問題，等等再試吧。" : "Connection error. Let's try another set later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-bold uppercase text-xs">
            Chat with Jason
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-zinc-900 w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-zinc-800 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold font-display">
                  JH
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-800 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-none font-display">{t.title}</h4>
                <p className="text-zinc-500 text-xs mt-1">{t.status}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.length === 0 && (
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-yellow-500" />
                </div>
                <div className="bg-zinc-800 text-white p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                  {t.welcome}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-yellow-500' : 'bg-zinc-800'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-black" /> : <Bot size={16} className="text-yellow-500" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-yellow-500 text-black rounded-tr-none font-medium' 
                    : 'bg-zinc-800 text-white rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-yellow-500" />
                </div>
                <div className="bg-zinc-800 text-white p-3 rounded-2xl rounded-tl-none text-sm">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="w-full bg-zinc-800 text-white text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 p-2 bg-yellow-500 rounded-full text-black hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};