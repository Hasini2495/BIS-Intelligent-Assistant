import { useState } from 'react';
import {
  Check,
  Save,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'preferences' | 'notifications' | 'security'>('profile');

  // Profile Form State (Screen 16)
  const [fullName, setFullName] = useState('Pavan');
  const [email, setEmail] = useState('pavan@example.com');
  const [mobile, setMobile] = useState('+91 9876543210');
  const [role, setRole] = useState('Student');
  const [accessibility, setAccessibility] = useState('Standard');
  const [timeZone, setTimeZone] = useState('(GMT+5:30) India Standard Time');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preference switches
  const [notifyRevisions, setNotifyRevisions] = useState(true);
  const [notifyAudits, setNotifyAudits] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Page Header (Screen 16) */}
      <PageHeader
        title="Profile & Settings"
        description="Manage your account profile, organization affiliation, and interface preferences."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Profile & Settings' },
        ]}
      />

      {/* Tabs Navigation (Reference Screen 16) */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs sm:text-sm font-semibold">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'organization', label: 'Organization' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'security', label: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 border-b-2 font-bold transition-colors ${activeTab === tab.id
                  ? 'border-[#063b73] text-[#063b73]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 1: Profile (Screen 16) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* User Profile Card Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#063b73] text-2xl font-black text-white shadow-sm">
                P
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#063b73] border border-blue-200">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{email}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  BIS AI Assistant User ID: #USR-7821-2026
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs self-end sm:self-auto"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Form (Screen 16) */}
          <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-fullname" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="settings-fullname"
                  type="text"
                  disabled={!isEditing}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label htmlFor="settings-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="settings-email"
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label htmlFor="settings-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="settings-mobile"
                  type="tel"
                  disabled={!isEditing}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label htmlFor="settings-role" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role / User Type
                </label>
                <input
                  id="settings-role"
                  type="text"
                  disabled={!isEditing}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label htmlFor="settings-accessibility" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Accessibility Mode
                </label>
                <select
                  id="settings-accessibility"
                  disabled={!isEditing}
                  value={accessibility}
                  onChange={(e) => setAccessibility(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                >
                  <option value="Standard">Standard Visual Theme</option>
                  <option value="High Contrast">High Contrast (WCAG AAA)</option>
                  <option value="Screen Reader Optimized">Screen Reader Optimized</option>
                </select>
              </div>

              <div>
                <label htmlFor="settings-timezone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Time Zone
                </label>
                <input
                  id="settings-timezone"
                  type="text"
                  disabled={!isEditing}
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#063b73] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F]"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

            {savedSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Profile preferences updated successfully!</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: Organization */}
      {activeTab === 'organization' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Institution &amp; Organization</h3>
          <p className="text-xs text-slate-500">
            Link your institutional email or manufacturing company profile to unlock authorized BIS testing queues.
          </p>
          <div className="space-y-3 max-w-md">
            <div>
              <label htmlFor="settings-org-name" className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
              <input
                id="settings-org-name"
                type="text"
                defaultValue="Indian Institute of Technology / Research Lab"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="settings-org-type" className="block text-xs font-semibold text-slate-700 mb-1">Organization Type</label>
              <select id="settings-org-type" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900">
                <option>Academic / Research Institution</option>
                <option>MSME Manufacturer</option>
                <option>Testing Laboratory</option>
                <option>Government Body</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'preferences' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900">User Interface &amp; Language</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">High Contrast Mode</p>
                <p className="text-slate-500">Enhanced contrast borders and typography for readability</p>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="h-4 w-4 rounded text-[#063b73] focus:ring-[#063b73]"
              />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Default Query Language</p>
                <p className="text-slate-500">Select preferred language for standards responses</p>
              </div>
              <select className="rounded-lg border border-slate-200 p-1.5 text-xs text-slate-700">
                <option>English</option>
                <option>Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Notification Alerts</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Standard Revisions</p>
                <p className="text-slate-500">Receive alerts when bookmarked standards publish revisions</p>
              </div>
              <input
                type="checkbox"
                checked={notifyRevisions}
                onChange={(e) => setNotifyRevisions(e.target.checked)}
                className="h-4 w-4 rounded text-[#063b73] focus:ring-[#063b73]"
              />
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Compliance Audit Completion</p>
                <p className="text-slate-500">Notify when product validator generates final reports</p>
              </div>
              <input
                type="checkbox"
                checked={notifyAudits}
                onChange={(e) => setNotifyAudits(e.target.checked)}
                className="h-4 w-4 rounded text-[#063b73] focus:ring-[#063b73]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Security &amp; Session Management</h3>
          <p className="text-xs text-slate-500">
            Manage your password, two-factor authentication, and active sessions.
          </p>
          <div className="space-y-3 max-w-sm">
            <button
              type="button"
              onClick={() => alert('Password change request initiated.')}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              Change Account Password
            </button>
            <button
              type="button"
              onClick={() => alert('Two-Factor Authentication is currently enabled via registered mobile OTP.')}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
            >
              Two-Factor Authentication (2FA) Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}