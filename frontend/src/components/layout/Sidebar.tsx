import {
  BarChart3,
  Bell,
  Bookmark,
  Bot,
  CheckCircle2,
  Database,
  FileText,
  History,
  Home,
  LayoutDashboard,
  Library,
  MessageSquareHeart,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { BisLogo } from '../ui/BisLogo';
import { cn } from '@/lib/cn';

const mainNavigation = [
  { label: 'Dashboard', path: '/', icon: Home, exact: true },
  { label: 'AI Assistant', path: '/assistant', icon: Bot },
  { label: 'Standards Search', path: '/standards', icon: Library },
  { label: 'Compliance Validator', path: '/compliance', icon: CheckCircle2 },
  { label: 'Documents', path: '/documents', icon: FileText },
  { label: 'Certification & Services', path: '/certification', icon: ShieldCheck },
  { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  { label: 'History', path: '/history', icon: History },
  { label: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
  { label: 'Profile & Settings', path: '/settings', icon: Settings },
];

const adminNavigation = [
  { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Knowledge Base', path: '/admin/knowledge-base', icon: Database },
  { label: 'Usage Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export interface SidebarProps {
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onCloseMobile, isMobile = false }: SidebarProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-[#063b73] text-white shadow-xl',
        isMobile ? 'w-72' : 'hidden w-64 shrink-0 lg:flex sticky top-0'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <BisLogo variant="header" size="md" inverted />
        </NavLink>

        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
            Main Portal
          </p>
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={cn(
                    'group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white text-[#063b73] font-bold shadow-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                        isActive ? 'text-[#063b73]' : 'text-blue-200'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                        isActive
                          ? 'bg-[#E8850C] text-white'
                          : 'bg-white/20 text-white'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Administration & Management */}
        <div className="pt-2 border-t border-white/10">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
              Admin & Governance
            </p>
            {isAdminRoute && (
              <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
                Active
              </span>
            )}
          </div>
          <div className="space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white text-[#063b73] font-bold shadow-sm'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-[#063b73]' : 'text-blue-200'
                    )}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Feedback Link */}
        <div className="pt-2 border-t border-white/10">
          <NavLink
            to="/feedback"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-white text-[#063b73] font-bold shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <MessageSquareHeart className="h-4 w-4 shrink-0 text-blue-200" />
            <span>We value feedback</span>
          </NavLink>
        </div>
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-white/10 p-3 bg-black/10">
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#063b73] shadow-xs">
            P
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              Pavan
            </p>
            <p className="truncate text-[10px] text-blue-200 font-medium">
              Student / Researcher
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}