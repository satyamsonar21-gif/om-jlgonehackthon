import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  RefreshCw,
  ChevronDown,
  Briefcase,
  Code,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  isFallback?: boolean;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: 'Which internships match my profile?', icon: Briefcase },
  { label: 'What skills should I learn next?', icon: Code },
  { label: 'Explain my skill gaps', icon: AlertCircle },
  { label: 'Help improve my resume', icon: FileText },
  { label: 'Explain my placement readiness score', icon: TrendingUp },
];

export function CareerAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; isFallback: boolean }>({
    provider: 'heuristic-engine',
    isFallback: true,
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Hello ${user?.name || 'Student'}! 👋 I am your AI Career Placement Assistant.\n\nI analyze your academic background, verified technical skills, and current internship progress to provide personalized guidance.\n\nHow can I help you accelerate your placement readiness today?`,
        provider: 'heuristic-engine',
        isFallback: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkProvider() {
      try {
        const res = await api.getAiProviderInfo();
        if (res.data) setProviderInfo(res.data);
      } catch {
        // Fallback
      }
    }
    checkProvider();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'msg_welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.aiChat(textToSend, historyPayload);

      const assistantMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: res.data?.text || 'I analyzed your request, but could not produce a response.',
        provider: res.data?.provider,
        isFallback: res.data?.isFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          '⚠️ Could not connect to the AI Career Engine. Please check your network connection and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. How can I assist with your career and placement goals, ${user?.name || 'Student'}?`,
        provider: providerInfo.provider,
        isFallback: providerInfo.isFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    toast.success('Conversation history cleared.');
  };

  // Only render for logged-in students or authenticated users
  if (!user) return null;

  return (
    <>
      {/* ─── FLOATING TRIGGER BUTTON ────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full font-bold shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isOpen
              ? 'bg-slate-900 text-white'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 hover:scale-105'
          }`}
          aria-label="Open AI Career Assistant"
        >
          <div className="relative">
            <Sparkles size={19} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <span className="text-xs sm:text-sm tracking-tight">
            {isOpen ? 'Close Assistant' : 'AI Career Coach'}
          </span>
        </button>
      </div>

      {/* ─── CHAT PANEL / MOBILE BOTTOM SHEET ──────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[420px] sm:h-[580px] z-50 flex flex-col bg-white sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 sm:px-5 sm:py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">AI Career Placement Coach</h3>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {providerInfo.provider === 'gemini' ? 'Gemini 2.0' : 'Heuristic Engine'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Grounded in verified academic & internship data</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC] text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed font-normal">
                      {msg.content}
                    </div>
                    <div
                      className={`text-[9px] font-mono text-right pt-0.5 ${
                        isUser ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 rounded-bl-none flex items-center gap-2 text-slate-500">
                  <Loader2 size={14} className="animate-spin text-blue-600" />
                  <span className="text-[11px] font-medium">Analyzing platform context & synthesizing recommendations...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt.label)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/70 text-slate-700 text-[10px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all"
                >
                  <Icon size={11} className="text-slate-500" />
                  <span>{prompt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about matches, skill gaps, resume..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none text-xs text-slate-900 transition-all"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputMessage.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 w-9 p-0 flex items-center justify-center flex-shrink-0"
            >
              <Send size={14} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
