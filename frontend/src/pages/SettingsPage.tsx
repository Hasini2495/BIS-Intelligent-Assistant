import { Globe2, Bell, Shield, User } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your assistant preferences.
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex gap-4">
              <User className="h-5 w-5 text-slate-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Guest User
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex gap-4">
              <Globe2 className="h-5 w-5 text-slate-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Language</h2>
                <p className="mt-1 text-sm text-slate-500">
                  English
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                <Bell className="h-5 w-5 text-slate-600" />
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Receive product notifications.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={[
                  'h-6 w-11 rounded-full p-1 transition',
                  notifications ? 'bg-slate-900' : 'bg-slate-300',
                ].join(' ')}
                aria-label="Toggle notifications"
              >
                <span
                  className={[
                    'block h-4 w-4 rounded-full bg-white transition',
                    notifications ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex gap-4">
              <Shield className="h-5 w-5 text-slate-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Privacy</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your preferences and conversation data are managed according
                  to the application's privacy configuration.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}