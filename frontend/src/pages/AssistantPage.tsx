import { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  Check,
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
import { BisLogo } from '@/components/ui/BisLogo';
import { GroundednessBadge } from '@/components/domain/GroundednessBadge';
import { DisclaimerNote } from '@/components/domain/DisclaimerNote';
import { chatResponsesFixture } from '@/mocks/fixtures/chatResponses';
import { chatService } from '@/services/chatService';
import { Message, GroundedAnswer } from '@/types/chat';
import { generateId } from '@/lib/utils';

const SUGGESTIONS = [
  'What is IS 456?',
  'Which standard applies for LED bulb?',
  'Explain Clause 7.2 of IS 302',
  'How to get BIS certification?',
];

export default function AssistantPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  // Initial messages state matching Screen 05
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-user-init',
      conversationId: 'conv-1',
      role: 'user',
      content: 'What is IS 456?',
      status: 'complete',
      language: 'en',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'msg-asst-init',
      conversationId: 'conv-1',
      role: 'assistant',
      content: (chatResponsesFixture.concrete || chatResponsesFixture.default)!.answerMarkdown,
      status: 'complete',
      language: 'en',
      createdAt: new Date(Date.now() - 3590000).toISOString(),
      answer: (chatResponsesFixture.concrete || chatResponsesFixture.default)!,
    },
  ]);

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

    const userMessage: Message = {
      id: generateId(),
      conversationId: 'conv-1',
      role: 'user',
      content: query,
      status: 'complete',
      language: 'en',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call service layer (which talks to apiClient -> MSW / mock)
      const res = await chatService.sendMessage({
        message: query,
        language: 'en',
      });
      setMessages((prev) => [...prev, res.message]);
    } catch {
      // Fallback matching in case of network or mock timing
      const q = query.toLowerCase();
      let ans: GroundedAnswer = chatResponsesFixture.default!;
      if (q.includes('concrete') || q.includes('456')) ans = chatResponsesFixture.concrete || ans;
      else if (q.includes('led') || q.includes('bulb')) ans = chatResponsesFixture.led || ans;
      else if (q.includes('302') || q.includes('clause 7.2')) ans = chatResponsesFixture.is302 || ans;
      else if (q.includes('certificat') || q.includes('isi')) ans = chatResponsesFixture.certification || ans;
      else if (q.includes('water')) ans = chatResponsesFixture.water || ans;
      else if (q.includes('hallmark')) ans = chatResponsesFixture.hallmarking || ans;

      const fallbackMsg: Message = {
        id: generateId(),
        conversationId: 'conv-1',
        role: 'assistant',
        content: ans.answerMarkdown,
        status: 'complete',
        language: 'en',
        createdAt: new Date().toISOString(),
        answer: ans,
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

  const handleShare = (_id: string) => {
    navigator.clipboard.writeText(window.location.href);
    alert('Assistant response link copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto font-sans">
      {/* Top Welcome / Guidance Header (Screen 05) */}
      <div className="border-b border-slate-200 bg-white p-4 sm:p-5 rounded-2xl shadow-xs mb-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#063b73] text-white shadow-xs">
            <BisLogo variant="icon" size="sm" inverted />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              How can I help you today?
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ask anything about Indian Standards, certification schemes, testing procedures, or compliance rules.
            </p>

            {/* Quick Suggestion Chips (Screen 05) */}
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
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Response Card (Screen 05)
          const answer = msg.answer;
          const status = answer?.status || 'grounded';
          const primarySource = answer?.sources?.[0];
          const primaryEvidence = answer?.evidence?.[0];
          const isSaved = savedIds.has(msg.id);

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="flex items-start gap-3 max-w-3xl w-full">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#063b73] text-white shadow-xs mt-1">
                  <BisLogo variant="icon" size="sm" inverted />
                </div>

                <div className="flex-1 rounded-2xl rounded-tl-xs border border-slate-200 bg-white p-5 shadow-xs">
                  {/* Groundedness Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <GroundednessBadge status={status} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      Verified BIS Model
                    </span>
                  </div>

                  {/* Answer Content */}
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {msg.content}
                  </div>

                  {/* Evidence / Source Card (Screen 05) */}
                  {(primaryEvidence || primarySource) && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3 flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#063b73]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-900">
                            Source: {primaryEvidence?.standardNumber || 'Indian Standard'}
                            {primaryEvidence?.clause && `, ${primaryEvidence.clause}`}
                          </span>
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                            Official Code
                          </span>
                        </div>
                        {primaryEvidence?.text && (
                          <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 italic">
                            "{primaryEvidence.text}"
                          </p>
                        )}
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
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave(msg.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Save to bookmarks"
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#063b73] text-[#063b73]' : ''}`}
                        />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(msg.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Share response"
                      >
                        <Share2 className="h-3.5 w-3.5" />
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
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
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
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
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
                <Loader2 className="h-4 w-4 animate-spin text-[#063b73]" />
                <span className="text-xs font-semibold text-slate-600">
                  Retrieving relevant Indian Standards &amp; clauses...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer at Bottom (Screen 05) */}
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
            placeholder="Type your follow-up question (e.g., Which standard applies for LED bulb?)..."
            className="w-full bg-transparent pl-3 pr-12 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#063b73] text-white shadow-xs hover:bg-[#0B4A8F] disabled:opacity-40 transition-all"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 text-center">
          <DisclaimerNote className="max-w-2xl mx-auto" />
        </div>
      </div>
    </div>
  );
}