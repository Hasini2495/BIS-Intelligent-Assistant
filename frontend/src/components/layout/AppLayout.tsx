import { ReactNode } from 'react';
import {
  Bell,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f4f8fc] text-slate-900">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">

          {/* Search */}
          <div className="flex w-full max-w-xl items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search standards, services, documents..."
                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#0875d1] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="ml-5 flex items-center gap-4">

            <button
              type="button"
              className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f1fb] text-xs font-bold text-[#063b73]">
                G
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  Guest User
                </p>
                <p className="text-[10px] text-slate-400">
                  Demo
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}