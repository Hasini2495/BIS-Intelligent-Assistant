import { useState, useMemo } from 'react';
import {
  Bell,
  Calendar,
  CheckCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

interface NotificationItem {
  id: string;
  category: 'system' | 'standards' | 'validation' | 'updates';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    category: 'system',
    title: 'New revision of IS 875 published',
    description: 'Design loads code updated with revised unit weights for modern composite structures.',
    timestamp: '20 Sep 2026',
    read: false,
    link: '/standards/std-4',
  },
  {
    id: 'n-2',
    category: 'validation',
    title: 'Your validation report is ready',
    description: 'Automated audit for LED Bulb (9W) under IS 16102 (Part 1) finished with 7/10 satisfied.',
    timestamp: '19 Sep 2026',
    read: false,
    link: '/compliance/result',
  },
  {
    id: 'n-3',
    category: 'standards',
    title: 'New standard added: IS 19030',
    description: 'Electric Vehicle battery swapping systems safety requirements now indexed in catalogue.',
    timestamp: '18 Sep 2026',
    read: false,
    link: '/standards',
  },
  {
    id: 'n-4',
    category: 'system',
    title: 'Scheduled maintenance on Sunday',
    description: 'Manakonline gateway upgrade from 02:00 AM to 05:00 AM IST for enhanced performance.',
    timestamp: '17 Sep 2026',
    read: true,
  },
  {
    id: 'n-5',
    category: 'updates',
    title: 'Mandatory Hallmarking Phase-IV Circular',
    description: '18 additional districts notified under compulsory gold hallmarking scheme.',
    timestamp: '15 Sep 2026',
    read: true,
    link: '/hallmarking',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'standards' | 'validation' | 'updates'>('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getCategoryBadge = (category: NotificationItem['category']) => {
    switch (category) {
      case 'system':
        return (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#063b73] border border-blue-200">
            System
          </span>
        );
      case 'standards':
        return (
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
            Standards
          </span>
        );
      case 'validation':
        return (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            Validation
          </span>
        );
      case 'updates':
        return (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
            Updates
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* Page Header (Screen 15) */}
      <PageHeader
        title="Notifications"
        description="Stay updated with important standard revisions, regulatory circulars, and validation reports."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Notifications' },
        ]}
        actions={
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <CheckCheck className="h-4 w-4 text-[#063b73]" />
            <span>Mark all as read</span>
          </button>
        }
      />

      {/* Filter Tabs (Reference Screen 15) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'system', label: 'System' },
            { id: 'standards', label: 'Standards' },
            { id: 'validation', label: 'Validation' },
            { id: 'updates', label: 'Updates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id
                  ? 'bg-[#063b73] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List (Reference Screen 15) */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            role="button"
            tabIndex={0}
            onClick={() => markAsRead(notif.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                markAsRead(notif.id);
              }
            }}
            className={`group rounded-2xl border bg-white p-5 shadow-xs transition-all flex items-start justify-between gap-4 cursor-pointer ${notif.read
                ? 'border-slate-200 opacity-80 hover:opacity-100'
                : 'border-blue-200 bg-blue-50/20 hover:border-[#063b73]/40'
              }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notif.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-[#063b73]'
                  }`}
              >
                <Bell className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#063b73] transition-colors">
                    {notif.title}
                  </h3>
                  {getCategoryBadge(notif.category)}
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-[#E8850C]" title="Unread" />
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {notif.description}
                </p>

                <p className="mt-2 text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{notif.timestamp}</span>
                </p>
              </div>
            </div>

            {notif.link && (
              <Link
                to={notif.link}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-[#063b73] hover:text-white transition-all shrink-0 self-center"
              >
                <span>View</span>
              </Link>
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-sm font-bold text-slate-800">
              No notifications in this category
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              You are completely caught up with all circulars and regulatory alerts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
