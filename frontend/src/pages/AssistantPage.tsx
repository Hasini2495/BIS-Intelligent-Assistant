import { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  Send,
  Share2,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { BisLogo } from '@/components/ui/BisLogo';
import { GroundednessBadge } from '@/components/domain/GroundednessBadge';
import { DisclaimerNote } from '@/components/domain/DisclaimerNote';
import { chatService } from '@/services/chatService';
import { Message } from '@/types/chat';
import { LanguageCode } from '@/types/language';
import { generateId } from '@/lib/utils';

const SUGGESTIONS = [
  'What is IS 456?',
  'Which standard applies for LED bulb?',
  'Explain Clause 7.2 of IS 302',
  'What is IS 10500?',
  'How to get BIS certification?',
];

export default function AssistantPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { i18n } = useTranslation();

  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle URL query param if present
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const currentLang: LanguageCode = (['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'or', 'pa', 'ur'].includes(i18n.language)
      ? i18n.language
      : 'en') as LanguageCode;

    const userMessage: Message = {
      id: generateId(),
      conversationId: conversationId || 'conv-pending',
      role: 'user',
      content: query,
      status: 'complete',
      language: currentLang,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await chatService.sendMessage({
        message: query,
        conversationId: conversationId,
        language: currentLang,
      });

      if (res.conversationId) {
        setConversationId(res.conversationId);
      }
      setMessages((prev) => [...prev, res.message]);
    } catch (err: unknown) {
      console.error('Chat service request failed:', err);
      const errMsg = err instanceof Error ? err.message : 'The BIS AI service is currently unavailable.';
      const fallbackMsg: Message = {
        id: generateId(),
        conversationId: conversationId || 'conv-error',
        role: 'assistant',
        content: `### Bureau of Indian Standards — Service Notice\n\nUnable to generate response from the BIS AI Assistant.\n\n*Error details: ${errMsg}*\n\nPlease verify that the backend server is running and try again, or consult [Manakonline](https://www.manakonline.in).`,
        status: 'error',
        language: currentLang,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [copiedBanner, setCopiedBanner] = useState<string | null>(null);

  const handleShare = (_id: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedBanner('Assistant response link copied to clipboard!');
    setTimeout(() => setCopiedBanner(null), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto font-sans">
      {copiedBanner && (
        <div className="mb-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{copiedBanner}</span>
        </div>
      )}
      {/* Top Welcome / Guidance Header */}
      <div className="border-b border-slate-200 bg-white p-4 sm:p-5 rounded-2xl shadow-xs mb-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#063b73] text-white shadow-xs">
            <BisLogo variant="icon" size="sm" inverted />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Bureau of Indian Standards — Intelligent Assistant
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Authoritative technical guidance on Indian Standards (IS), conformity assessment, testing, and certification schemes.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#063b73] hover:bg-blue-50 hover:text-[#063b73] transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#063b73] mb-3">
              <FileText aria-hidden="true" focusable="false" className="h-8 w-8 text-[#063b73]" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No messages yet</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select one of the suggestion chips above or type a question about an Indian Standard or certification scheme.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="flex items-start gap-2.5 max-w-xl">
                  <div className="rounded-2xl rounded-tr-xs bg-[#063b73] px-4 py-3 text-white text-xs sm:text-sm font-medium shadow-xs">
                    {msg.content}
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    <User aria-hidden="true" focusable="false" className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Response Card
          const answer = msg.answer;
          const status = answer?.status || 'grounded';
          const isSaved = savedIds.has(msg.id);

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="flex items-start gap-3 max-w-3xl w-full">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#063b73] text-white shadow-xs mt-1">
                  <BisLogo variant="icon" size="sm" inverted />
                </div>

                <div className="flex-1 rounded-2xl rounded-tl-xs border border-slate-200 bg-white p-5 shadow-xs">
                  {/* Groundedness Badge & Model Verification */}
                  {msg.status === 'error' ? (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle aria-hidden="true" focusable="false" className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>System Notice</span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 flex items-center justify-between">
                      <GroundednessBadge status={status} />
                      <span className="text-[10px] text-slate-500 font-medium">
                        Grounded in retrieved BIS sources
                      </span>
                    </div>
                  )}

                  {/* Formatted Answer Content */}
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2.5 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2.5 space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        h3: ({ children }) => <h3 className="font-bold text-sm text-[#063b73] mt-3.5 mb-1.5">{children}</h3>,
                        h4: ({ children }) => <h4 className="font-semibold text-xs text-slate-900 mt-2 mb-1">{children}</h4>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="min-w-full text-xs border border-slate-200 rounded-lg">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="bg-slate-50 p-2 border border-slate-200 text-left font-semibold text-slate-800">{children}</th>,
                        td: ({ children }) => <td className="p-2 border border-slate-200 text-slate-700">{children}</td>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Retrieved Evidence & Specific Citations Grid */}
                  {answer?.evidence && answer.evidence.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <FileText aria-hidden="true" focusable="false" className="h-3.5 w-3.5 text-[#063b73]" />
                        <span>Supporting BIS Evidence &amp; Specific Clauses:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {answer.evidence.slice(0, 4).map((ev) => (
                          <div key={ev.id} className="rounded-xl border border-blue-100 bg-blue-50/40 p-2.5 text-left">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] font-bold text-slate-900 truncate">
                                [{ev.citationIndex}] {ev.standardNumber || 'Indian Standard'}
                                {ev.clause && ` · Cl. ${ev.clause}`}
                              </span>
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 shrink-0">
                                {ev.relevance} relevance
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 italic">
                              "{ev.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar (Copy, Save, Share, Feedback) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Copy answer"
                        aria-label="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check aria-hidden="true" focusable="false" className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy aria-hidden="true" focusable="false" className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave(msg.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Save to bookmarks"
                        aria-label="Save to bookmarks"
                      >
                        <Bookmark
                          aria-hidden="true"
                          focusable="false"
                          className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#063b73] text-[#063b73]' : ''}`}
                        />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(msg.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Share response"
                        aria-label="Share response"
                      >
                        <Share2 aria-hidden="true" focusable="false" className="h-3.5 w-3.5" />
                        <span>Share</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'up' }))
                        }
                        className={`rounded-lg p-1.5 transition-colors ${feedbackGiven[msg.id] === 'up'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                        title="Helpful response"
                        aria-label="Helpful response"
                      >
                        <ThumbsUp aria-hidden="true" focusable="false" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'down' }))
                        }
                        className={`rounded-lg p-1.5 transition-colors ${feedbackGiven[msg.id] === 'down'
                          ? 'bg-red-50 text-red-700'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                          }`}
                        title="Not helpful"
                        aria-label="Not helpful"
                      >
                        <ThumbsDown aria-hidden="true" focusable="false" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#063b73] text-white">
                <BisLogo variant="icon" size="sm" inverted />
              </div>
              <div className="rounded-2xl rounded-tl-xs border border-slate-200 bg-white px-4 py-3 shadow-xs flex items-center gap-2">
                <Loader2 aria-hidden="true" focusable="false" className="h-4 w-4 animate-spin text-[#063b73]" />
                <span className="text-xs font-semibold text-slate-600">
                  Retrieving relevant Indian Standards &amp; clauses...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer at Bottom */}
      <div className="mt-3 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center rounded-2xl bg-white p-2 shadow-sm border border-slate-200 focus-within:border-[#063b73] focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a question or follow-up (e.g., What does IS 456 say about concrete?)..."
            className="w-full bg-transparent pl-3 pr-12 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#063b73] text-white shadow-xs hover:bg-[#0B4A8F] disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send aria-hidden="true" focusable="false" className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 text-center">
          <DisclaimerNote className="max-w-2xl mx-auto" />
        </div>
      </div>
    </div>
  );
}