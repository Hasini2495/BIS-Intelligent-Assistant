import { ReactNode, useState, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BisLogo } from '../ui/BisLogo';

interface AppLayoutProps {
  children: ReactNode;
}

const STANDALONE_ROUTES = ['/welcome', '/login', '/register'];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const isStandalone = STANDALONE_ROUTES.includes(location.pathname);

  // If standalone auth or landing page, render without internal sidebar
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[#f4f8fc] text-slate-900 flex flex-col font-sans">
        {children}
      </div>
    );
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/standards?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f8fc] text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 animate-slide-in-left">
            <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Government Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
          {/* Left: Mobile Menu button + Brand/Search */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Logo mark */}
            <Link to="/" className="lg:hidden flex items-center shrink-0">
              <BisLogo variant="icon" size="sm" />
            </Link>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything (standards, compliance, services, labs)..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-10 pr-10 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-[#0875d1] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </form>
          </div>

          {/* Right: Quick actions, Notifications, Profile */}
          <div className="ml-4 flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Link to Public Portal */}
            <Link
              to="/welcome"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="View Public Welcome Portal"
            >
              <Globe className="h-3.5 w-3.5 text-[#063b73]" />
              <span>Public Portal</span>
            </Link>

            {/* AI Assistant Quick Pill */}
            <Link
              to="/assistant"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#063b73] hover:bg-blue-100 transition-colors border border-blue-200/60"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E8850C]" />
              <span>Ask AI</span>
            </Link>

            {/* Notifications Bell */}
            <Link
              to="/notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="View notifications (3 unread)"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8850C] text-[10px] font-bold text-white shadow-xs">
                3
              </span>
            </Link>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#063b73] text-xs font-bold text-white shadow-xs">
                  P
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    Pavan
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Student
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Profile Menu Popover */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-slide-in-up">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-bold text-slate-900">Pavan</p>
                      <p className="text-[11px] text-slate-500">pavan@example.com</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        to="/bookmarks"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span>Saved Bookmarks</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <Link
                        to="/login"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>Sign Out / Switch</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}