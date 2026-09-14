import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { normalizeApiError } from '../../utils/errorHandler';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatBotFAB = () => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm **CalorieMate AI**.\n\nI can help you:\n- **Log meals** — just tell me what you ate\n- **Check your goals** — ask \"what are my goals?\"\n- **View today's meals** — ask \"what did I eat today?\"\n- **Weekly summary** — ask \"how was my week?\"\n- **Nutrition questions** — ask anything!\n\nWhat would you like to do?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;

    // Abort any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    // Snapshot history BEFORE adding new messages (for sending to backend)
    const historyForBackend = messages
      .filter(m => m.id !== 'welcome' && m.text) // exclude welcome and empty
      .map(m => ({ sender: m.sender, text: m.text }))
      .slice(-12); // last 12 messages for context

    // Add user message and placeholder bot message
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: trimmed },
      { id: botMsgId, sender: 'bot', text: '', streaming: true }
    ]);
    setInputValue('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyForBackend
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const processSSELine = (line) => {
        if (!line.startsWith('data: ')) return;
        const dataStr = line.slice(6).trim();
        if (dataStr === '[DONE]') return;

        try {
          const event = JSON.parse(dataStr);

          if (event.type === 'text_delta') {
            // Append streaming text
            setMessages(prev => prev.map(m =>
              m.id === botMsgId ? { ...m, text: m.text + event.text } : m
            ));
            scrollToBottom();
          } else if (event.type === 'actions') {
            // Trigger UI refresh for logged meals etc.
            if (event.actions && event.actions.length > 0) {
              window.dispatchEvent(new Event('appDataChanged'));
            }
          } else if (event.type === 'error') {
            setMessages(prev => prev.map(m =>
              m.id === botMsgId ? { ...m, text: m.text + (m.text ? '\n\n' : '') + `⚠️ ${event.text}`, streaming: false } : m
            ));
          }
        } catch (parseErr) {
          // Ignore malformed SSE events silently
        }
      };

      // Read the stream
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages (separated by \n\n)
        const parts = buffer.split('\n\n');
        buffer = parts.pop(); // Keep incomplete last part in buffer

        for (const part of parts) {
          for (const line of part.split('\n')) {
            processSSELine(line.trim());
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        for (const line of buffer.split('\n')) {
          processSSELine(line.trim());
        }
      }

      // Mark bot message as done streaming
      setMessages(prev => prev.map(m =>
        m.id === botMsgId ? { ...m, streaming: false } : m
      ));

    } catch (error) {
      if (error.name === 'AbortError') return; // User cancelled, don't show error

      console.error('Chat error:', error);
      const normalized = normalizeApiError(error);
      setMessages(prev => prev.map(m =>
        m.id === botMsgId
          ? { ...m, text: `⚠️ **${normalized.title}**\n\n${normalized.message}`, streaming: false }
          : m
      ));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm **CalorieMate AI**.\n\nI can help you:\n- **Log meals** — just tell me what you ate\n- **Check your goals** — ask \"what are my goals?\"\n- **View today's meals** — ask \"what did I eat today?\"\n- **Weekly summary** — ask \"how was my week?\"\n- **Nutrition questions** — ask anything!\n\nWhat would you like to do?"
    }]);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Popover */}
      {isOpen && (
        <div className={`bg-surface-container-lowest rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-outline-variant/50 flex flex-col overflow-hidden transition-all ${
            isFullScreen
              ? 'fixed inset-2 sm:inset-4 z-[60] mb-0'
              : 'mb-4 w-[calc(100vw-32px)] sm:w-[380px] h-[min(calc(100vh-120px),600px)] sm:h-auto sm:max-h-[600px]'
          }`}
          style={{ animation: 'slideUp 0.2s ease-out' }}>

          {/* Header */}
          <div className="bg-primary text-on-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">CalorieMate AI</div>
                <div className="text-[11px] text-on-primary/70 mt-0.5">
                  {isStreaming ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse inline-block"></span>
                      Thinking...
                    </span>
                  ) : 'Online'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? "Minimize" : "Expand"}
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFullScreen ? 'close_fullscreen' : 'open_in_full'}
                </span>
              </button>
              <button
                onClick={clearChat}
                title="Clear chat"
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-surface min-h-0"
            style={{ maxHeight: isFullScreen ? 'none' : '430px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 min-w-0`}>
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span>
                  </div>
                )}
                <div className={`max-w-[82%] min-w-0 overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                  msg.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-tr-sm'
                    : 'bg-surface-container text-on-surface rounded-tl-sm'
                }`}>
                  {msg.sender === 'bot' ? (
                    <>
                      {msg.text ? (
                        <div className="prose prose-sm max-w-none break-words overflow-hidden [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_strong]:text-on-surface [&_a]:break-all">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        /* Typing dots while waiting for first token */
                        <div className="flex gap-1 items-center py-0.5">
                          <div className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      )}
                      {msg.streaming && msg.text && (
                        <span className="inline-block w-0.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                      )}
                    </>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-surface">
              {['What did I eat today?', 'What are my goals?', 'How was my week?'].map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInputValue(chip); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend}
            className="px-3 py-2.5 border-t border-outline-variant/40 bg-surface-container-lowest flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              placeholder={isStreaming ? 'Waiting for response...' : 'Ask anything or say what you ate...'}
              className="flex-1 h-10 bg-surface-container px-4 rounded-full text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 placeholder:text-on-surface-variant/60 transition-all"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ marginLeft: '2px' }}>send</span>
            </button>
          </form>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/30 active:scale-95"
        title="Open CalorieMate AI"
      >
        <span className="material-symbols-outlined text-[26px]"
          style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatBotFAB;
