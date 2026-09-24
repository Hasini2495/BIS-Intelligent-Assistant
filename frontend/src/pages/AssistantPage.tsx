import { Bot, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AssistantPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">Ask BIS</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ask questions about BIS standards and services.
        </p>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                BIS Intelligent Assistant
              </h2>
              <p className="text-xs text-slate-500">Demo Mode</p>
            </div>
          </div>

          <div className="min-h-[360px] p-6">
            <div className="max-w-2xl rounded-xl bg-slate-100 p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Welcome to Ask BIS
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Ask about standards, certification, hallmarking, testing,
                    or BIS services.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                'Find a standard',
                'Certification information',
                'Testing laboratories',
                'BIS services',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMessage(item)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question..."
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        <Link
          to="/sources"
          className="mt-5 block text-center text-sm text-slate-500 hover:text-slate-900"
        >
          Browse available sources →
        </Link>
      </main>
    </div>
  );
}