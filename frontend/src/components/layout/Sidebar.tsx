import {
  Bot,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gem,
  History,
  Home,
  Library,
  Settings,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'AI Assistant', path: '/assistant', icon: Bot },
  { label: 'Standards Search', path: '/standards', icon: Library },
  { label: 'Compliance Validator', path: '/compliance', icon: ClipboardCheck },
  { label: 'Documents', path: '/sources', icon: FileText },
  { label: 'Certification & Services', path: '/certification', icon: ShieldCheck },
  { label: 'Hallmarking', path: '/hallmarking', icon: Gem },
  { label: 'Testing & Labs', path: '/testing', icon: FlaskConical },
  { label: 'BIS Services', path: '/services', icon: Wrench },
  { label: 'History', path: '/history', icon: History },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col bg-[#063b73] text-white lg:flex">

      {/* Logo */}
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#063b73] shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide">
              BIS AI
            </p>
            <p className="text-[11px] text-blue-100">
              Intelligent Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-200/70">
          Main Menu
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-all',
                    isActive
                      ? 'bg-white text-[#063b73] font-semibold shadow-sm'
                      : 'text-blue-50 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors',
              isActive
                ? 'bg-white text-[#063b73] font-semibold'
                : 'text-blue-50 hover:bg-white/10',
            ].join(' ')
          }
        >
          <Settings className="h-4 w-4" />
          <span>Profile & Settings</span>
        </NavLink>

        <div className="mt-3 flex items-center gap-3 rounded-md bg-white/10 px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#063b73]">
            G
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">
              Guest User
            </p>
            <p className="truncate text-[10px] text-blue-200">
              Demo Mode
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}