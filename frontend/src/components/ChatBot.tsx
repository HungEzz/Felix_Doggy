import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import type { Product } from '../types';
import { addToCart } from '../store/cartSlice';

// ============================================================
// TYPES
// ============================================================
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAction {
  type: 'add_to_cart';
  product: Product;
  quantity: number;
}

interface ChatApiResponse {
  response: string;
  actions?: ChatAction[];
  role?: string;
}

// ============================================================
// CHATBOT LOGIC (DeepSeek V3.2 via Backend with Function Calling)
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function getChatResponse(
  message: string,
  history: { role: string; content: string }[],
  cartItems: any[]
): Promise<ChatApiResponse> {
  try {
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('admin_token') || localStorage.getItem('token')) 
      : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        history,
        context: {
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          cart: cartItems,
        },
      }),
    });

    if (!response.ok) throw new Error('API error');
    const data: ChatApiResponse = await response.json();
    return {
      response: data.response || 'Sorry, I did not understand your question. Please try again.',
      actions: Array.isArray(data.actions) ? data.actions : [],
      role: data.role,
    };
  } catch (error) {
    console.error('Chat Error:', error);
    return {
      response:
        'Sorry, I am having trouble connecting to the server. Please try again later or contact our hotline 1800-FELIX.',
      actions: [],
    };
  }
}

// ============================================================
// QUICK REPLY SUGGESTIONS
// ============================================================
const QUICK_REPLIES = [
  { label: '🐶 Adopt a Dog', text: 'Show me dogs' },
  { label: '🦴 Dog Food', text: 'Show me dog food' },
  { label: '🧸 Dog Toys', text: 'Show me dog toys' },
  { label: '👕 Dog Clothes', text: 'Show me dog clothes' },
  { label: '📦 My Orders', text: 'Show me my orders' },
  { label: '📊 Stats (admin)', text: 'Show me sales statistics' },
  { label: '🚚 Shipping Info', text: 'What is the shipping policy?' },
];

// ============================================================
// CHATBOT COMPONENT
// ============================================================
const MAX_HISTORY_ITEMS = 12;
const IDLE_CLEAR_MS = 30 * 60 * 1000; // 30 minutes
const MESSAGES_STORAGE_KEY = 'felix_doggy_chat_messages';
const LAST_ACTIVITY_KEY = 'felix_doggy_chat_last_activity';

const INITIAL_GREETING: Message = {
  id: '0',
  role: 'assistant',
  content:
    '👋 Hello! I am the AI assistant of **Felix Doggy**, powered by DeepSeek.\n\nI can help you:\n• Find products (Dogs, Food, Toys, Clothes, by price, etc.)\n• Add products to your cart directly\n• View your orders (requires login)\n• Manage orders (update status, delete) — admin\n\nWhat can I do for you today?',
  timestamp: new Date(),
};

const getRecentHistory = (messages: Message[]) =>
  messages.slice(-MAX_HISTORY_ITEMS).map((m) => ({ role: m.role, content: m.content }));

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const idleTimerRef = useRef<number | null>(null);

  const resetHistory = useCallback(() => {
    setMessages([{ ...INITIAL_GREETING, timestamp: new Date() }]);
    try {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const armIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(resetHistory, IDLE_CLEAR_MS);
  }, [resetHistory]);

  // Restore history from localStorage; reset if inactive for >30 mins
  useEffect(() => {
    try {
      const lastTs = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
      if (lastTs && Date.now() - lastTs > IDLE_CLEAR_MS) {
        resetHistory();
        return;
      }
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(
            parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          );
        }
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
    armIdleTimer();
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [armIdleTimer, resetHistory]);

  // Persist messages + update last activity timestamp + rearm idle timer
  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
    armIdleTimer();
  }, [messages, armIdleTimer]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll: scroll inside the chat window, not the whole page.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const scrollToBottom = () => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    };
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom);
    });

    const imgs = container.querySelectorAll('img');
    const handlers: Array<() => void> = [];
    imgs.forEach((img) => {
      if (!img.complete) {
        const h = () => scrollToBottom();
        img.addEventListener('load', h, { once: true });
        img.addEventListener('error', h, { once: true });
        handlers.push(() => {
          img.removeEventListener('load', h);
          img.removeEventListener('error', h);
        });
      }
    });

    return () => {
      cancelAnimationFrame(r1);
      handlers.forEach((cleanup) => cleanup());
    };
  }, [messages, isLoading, isOpen]);

  const applyChatActions = useCallback(
    (actions: ChatAction[] | undefined) => {
      if (!actions || actions.length === 0) return;
      for (const action of actions) {
        if (action.type === 'add_to_cart' && action.product) {
          dispatch(
            addToCart({
              product: action.product,
              quantity: action.quantity || 1,
            })
          );
        }
      }
    },
    [dispatch]
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = getRecentHistory(messages);

      const { response, actions } = await getChatResponse(text.trim(), history, cartItems);
      applyChatActions(actions);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setUnreadCount((c) => c + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again or contact our hotline 1800-FELIX.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatContent = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="chatbot-window fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-32px)] z-50 flex flex-col hard-shadow-olive wobbly-border bg-[#f5ede0] overflow-hidden"
          style={{
            height: '520px',
            fontFamily: "'Work Sans', 'Space Mono', sans-serif",
            transition: 'transform 0.3s ease-in-out',
            zIndex: 9999,
          }}
        >
          {/* HEADER */}
          <div className="bg-[#ffdbd0] border-b-4 border-[#1e1b14] p-4 flex justify-between items-center relative overflow-hidden flex-shrink-0">
            {/* Abstract background blob */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ff6b35] opacity-20 blob-shape-1 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-[#1e1b14] flex items-center justify-center overflow-hidden flex-shrink-0 jiggle">
                <img 
                  className="w-10 h-10 object-contain" 
                  alt="Mascot" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxR458ER3jIUByiAoy7gBfdk7pjTdPYxSY0nGiQ1hf41EUxqKz_sWe-PeuBoHPK1QveRbNkp1pyBGdpQjxEjfjpmniKaLw_tMUsl1o-6rxpgCeGlTJhgVA4qeVFnHuv6F39ZjPkFsWju4txPmBjBGyHQUNeCRt_OjQbzV8DjTEGOlFG3qI52oE2mqYlEwWNzqs700KN8Ql0qjJ-QMSKoGPYcoY9IiDPXtBrQypqrjdXEDGOFtw-7B7fk9WrhcSfoo-zX7xYw40AQ8" 
                />
              </div>
              <div>
                <h2 className="font-sans text-sm font-black text-[#5f1900] m-0 uppercase tracking-wide">The Weirdo Whisperer</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#576415] animate-pulse"></div>
                  <span className="font-mono text-[10px] text-[#5f1900] opacity-80 font-bold">Online and plotting</span>
                </div>
              </div>
            </div>

            <button 
              className="w-8 h-8 flex items-center justify-center bg-white border-2 border-[#1e1b14] rounded-full hard-shadow-sm organic-brutal-btn relative z-10 hover:bg-[#daeb8d] hover:text-[#576415] cursor-pointer" 
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-lg leading-none">close</span>
            </button>
          </div>

          {/* CHAT BODY */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#f5ede0] relative"
            style={{ scrollbarWidth: 'thin' }}
          >
            {/* Background texture line */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern height="40" id="wavy" patternUnits="userSpaceOnUse" width="40" x="0" y="0">
                  <path d="M0 20 Q 10 0, 20 20 T 40 20" fill="none" stroke="currentColor" stroke-width="2"></path>
                </pattern>
                <rect fill="url(#wavy)" height="100%" width="100%" x="0" y="0"></rect>
              </svg>
            </div>

            {/* Messages Loop */}
            {messages.map((msg) => {
              if (msg.role === 'assistant') {
                return (
                  <div className="flex items-end gap-2 relative z-10 max-w-[85%] self-start" key={msg.id}>
                    <div className="w-8 h-8 rounded-full border-2 border-[#1e1b14] overflow-hidden flex-shrink-0 mb-2 bg-[#fff8f0]">
                      <img 
                        className="w-full h-full object-cover" 
                        alt="Assistant" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8J3ZhJqfWRchRR1kLCBX5QxpJ_RzOIJsbPJD-VjlNuhGZ_5VdAwdJH8X1C60c0YuXbH5VLEJCZh4RKNapPY3H3ZBb77VZtdzyCCcF-WDd6nrtvlRMdwQACIOgOWnYJ08-9lVeuav3pX-Ix5p6Q0pNxFodTqcTXogP0dGhHiEk8VH9GHlphTHBs5BeWB7KWwlM3vdKhDtSCpN-LqKxK9aJht5I9ZcxZJuluvbqdaJFdCatCpqKzTejaaLWPU55iGAJDKA9rPzB44" 
                      />
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <div 
                        className="bg-[#daeb8d] text-[#181e00] p-4 blob-shape-1 border-2 border-[#1e1b14] hard-shadow-sm font-sans text-sm jiggle origin-bottom-left"
                        dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                      />
                      <span className="font-mono text-[9px] text-[#1e1b14] opacity-50 px-1 font-bold">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="flex justify-end relative z-10 max-w-[85%] self-end" key={msg.id}>
                    <div className="flex flex-col gap-1 items-end">
                      <div 
                        className="bg-[#ffdbd0] text-[#390c00] p-4 blob-shape-2 border-2 border-[#1e1b14] hard-shadow-sm font-sans text-sm jiggle origin-bottom-right"
                        dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                      />
                      <span className="font-mono text-[9px] text-[#1e1b14] opacity-50 px-1 font-bold">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              }
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-end gap-2 relative z-10 mt-2 self-start">
                <div className="w-6 h-6 rounded-full border-2 border-[#1e1b14] overflow-hidden flex-shrink-0 mb-1 opacity-70 bg-[#fff8f0]">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Thinking" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHKW56tXafLl03OqbIBCd13In5CwQw1hCZ3hHdBBH-3W-ZcY07kJ2OnxJ2W087a4WSNS_vbWSK1b9UFqcGkH2g5NUAHaTWWmlkVAK4yumpKSwn2VkRReRt9WCbw1xPJ7jy8scchbsZYqFgvcCyNPV6bwqWYoq4Q_T3tY7abq6gBl1NVIU5ZpUPjb_mIACUCugc-QyWga4Gl4suhuCahh-oKFVEyvmtNfuFlS3ytd_lq23dnviVwPN4hmaLtwgjwtghLFrq9vbaYaA" 
                  />
                </div>
                <div className="bg-[#e9e2d5] p-3 blob-shape-1 border-2 border-[#1e1b14] flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#1e1b14] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-[#1e1b14] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#1e1b14] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* QUICK REPLIES */}
          {!isLoading && (
            <div className="p-3 bg-[#f5ede0] flex gap-2 overflow-x-auto scrollbar-none relative z-10 border-t border-[#1e1b14]/10 flex-shrink-0">
              {QUICK_REPLIES.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(qr.text)}
                  className="px-4 py-2 rounded-full bg-white border border-[#1e1b14]/20 font-mono text-xs cursor-pointer text-[#5f5e5e] hover:border-[#1e1b14] hover:text-[#1e1b14] transition-all flex-shrink-0 font-bold"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t-4 border-[#1e1b14] flex gap-3 items-end relative z-10 flex-shrink-0">
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type something weird..."
                disabled={isLoading}
                className="w-full bg-[#fbf3e6] wobbly-border p-3 font-mono text-xs text-[#1e1b14] focus:outline-none focus:ring-0 focus:border-[#ab3500] focus:bg-white"
                style={{ borderStyle: 'solid', borderWidth: '3px', borderColor: '#1e1b14', minHeight: '48px' }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#ffdbd0] text-[#5f1900] border-3 border-[#1e1b14] blob-shape-2 hard-shadow-sm organic-brutal-btn hover:bg-[#ab3500] hover:text-white cursor-pointer"
              style={{ borderStyle: 'solid', borderWidth: '3px', borderColor: '#1e1b14' }}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            </button>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      <button
        className="chatbot-toggle animate-bounce-slow"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '16px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isOpen ? '#1e1b14' : '#8B9A46',
          border: '4px solid #1e1b14',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10000,
          transition: 'transform 0.2s, box-shadow 0.2s',
          overflow: 'hidden',
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)';
        }}
        title="Chat with Felix Doggy"
        aria-label="Open support chat"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <img 
            className="w-full h-full object-cover animate-pulse" 
            alt="Ngáo Mascot" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiNk6O8gWkORCFO-HRp3LpzjyDDkiq8S1y2E2SUFZh27yRTv8-QQqn_FG9FO9C5lsaLi6I9GVcmT_W_7QgOUNPiiyoe_AKcbHfJXdn7wgs-rucbrD7IUehW8AKKvL2ZPnaqO90Z--g08AeCcT5qKZ9v945cPWOujK4rhwo-N7Spd5Xsve1LyPiPCNX0tqrWc_0TP8MonEi3XATGimrddS-iJYYAaPEqUyttB2sjlACek7Vr5gARFX8M1QBVuJMmmYsKtp012E8G6Q" 
          />
        )}
        {unreadCount > 0 && !isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* CHATBOT STYLE EXTENSIONS */}
      <style>{`
        @media (max-width: 767px) {
          .chatbot-toggle {
            bottom: 96px !important;
            right: 16px !important;
          }
          .chatbot-window {
            bottom: 168px !important;
            right: 16px !important;
            height: 460px !important;
            max-height: calc(100vh - 188px) !important;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }

        .blob-shape-1 {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .blob-shape-2 {
            border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%;
        }
        .blob-shape-container {
             border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        .wobbly-border {
            border: 3px solid #1e1b14;
            border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .hard-shadow {
            box-shadow: 6px 6px 0px 0px #1e1b14;
        }
        .hard-shadow-olive {
             box-shadow: 6px 6px 0px 0px #576415;
        }
        .hard-shadow-sm {
            box-shadow: 3px 3px 0px 0px #1e1b14;
        }
        
        .jiggle:hover {
            transform: scale(1.02) rotate(-1deg);
        }
        
        .organic-brutal-btn {
            border: 3px solid #1e1b14;
            transition: all 0.2s ease-in-out;
        }
        .organic-brutal-btn:active {
            transform: translate(3px, 3px);
            box-shadow: 0px 0px 0px 0px #1e1b14;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
