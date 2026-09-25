import { useState, useEffect } from 'react';
import {
  Check,
  Save,
  Lock,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { authService, UserProfile, TwoFactorStatusResponse } from '@/services/authService';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'preferences' | 'notifications' | 'security'>('profile');

  // Profile Form State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('Pavan');
  const [email, setEmail] = useState('pavan@example.com');
  const [mobile, setMobile] = useState('+91 9876543210');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Research & Standards');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Preference switches
  const [notifyRevisions, setNotifyRevisions] = useState(true);
  const [notifyAudits, setNotifyAudits] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Security Tab State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA State
  const [twoFaStatus, setTwoFaStatus] = useState<TwoFactorStatusResponse | null>(null);
  const [twoFaSetupId, setTwoFaSetupId] = useState<string | null>(null);
  const [twoFaOtpCode, setTwoFaOtpCode] = useState('');
  const [twoFaStatusMsg, setTwoFaStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading2Fa, setIsLoading2Fa] = useState(false);

  // Fetch initial profile
  useEffect(() => {
    async function loadData() {
      try {
        const p = await authService.getProfile();
        setProfile(p);
        setFullName(p.name || 'Pavan');
        setEmail(p.email || 'pavan@example.com');
        setMobile(p.phone || '+91 9876543210');
        setRole(p.role || 'Student');
        if (p.department) setDepartment(p.department);
      } catch {
        // Fallback to local user or guest defaults
        const u = authService.getCurrentUser();
        if (u) {
          setProfile(u);
          setFullName(u.name);
          setEmail(u.email);
        }
      }

      try {
        const s = await authService.get2FaStatus();
        setTwoFaStatus(s);
      } catch {
        // ignore
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    try {
      const updated = await authService.updateProfile({
        name: fullName,
        phone: mobile,
        department: department
      });
      setProfile(updated);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setProfileError(err?.detail || err?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setPasswordStatus({ type: 'success', message: res.message || 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err?.detail || err?.message || 'Failed to update password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleInitiate2Fa = async () => {
    setTwoFaStatusMsg(null);
    setIsLoading2Fa(true);
    try {
      const res = await authService.setup2Fa('sms');
      setTwoFaSetupId(res.verificationId);
      setTwoFaStatusMsg({
        type: 'success',
        message: `OTP sent to ${res.maskedDestination || 'registered mobile'}. Enter code below to confirm.`
      });
    } catch (err: any) {
      setTwoFaStatusMsg({ type: 'error', message: err?.detail || err?.message || 'Failed to initiate 2FA setup.' });
    } finally {
      setIsLoading2Fa(false);
    }
  };

  const handleConfirm2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaSetupId || !twoFaOtpCode.trim()) return;
    setIsLoading2Fa(true);
    setTwoFaStatusMsg(null);
    try {
      const res = await authService.enable2Fa(twoFaSetupId, twoFaOtpCode.trim());
      setTwoFaStatusMsg({ type: 'success', message: res.message || '2FA successfully enabled.' });
      setTwoFaSetupId(null);
      setTwoFaOtpCode('');
      const updatedStatus = await authService.get2FaStatus();
      setTwoFaStatus(updatedStatus);
    } catch (err: any) {
      setTwoFaStatusMsg({ type: 'error', message: err?.detail || err?.message || 'Invalid or expired 2FA code.' });
    } finally {
      setIsLoading2Fa(false);
    }
  };

  const handleDisable2Fa = async () => {
    setIsLoading2Fa(true);
    setTwoFaStatusMsg(null);
    try {
      const res = await authService.disable2Fa();
      setTwoFaStatusMsg({ type: 'success', message: res.message || '2FA successfully disabled.' });
      const updatedStatus = await authService.get2FaStatus();
      setTwoFaStatus(updatedStatus);
    } catch (err: any) {
      setTwoFaStatusMsg({ type: 'error', message: err?.detail || err?.message || 'Failed to disable 2FA.' });
    } finally {
      setIsLoading2Fa(false);
    }
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
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#063b73] border border-blue-200 uppercase">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{email}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  BIS AI Assistant User ID: #{profile?.id || 'USR-7821-2026'}
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

          {profileError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div>{profileError}</div>
            </div>
          )}

          {/* Profile Form (Screen 16) */}
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
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
                  disabled
                  value={email}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-xs sm:text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="settings-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="settings-mobile"
                  type="text"
                  disabled={!isEditing}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label htmlFor="settings-dept" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Department / Unit
                </label>
                <input
                  id="settings-dept"
                  type="text"
                  disabled={!isEditing}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm text-slate-900 disabled:opacity-70 disabled:bg-slate-100 outline-none focus:border-[#063b73]"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B4A8F] transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}

            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                <Check className="h-4 w-4 text-emerald-600" />
                Profile changes saved successfully to database!
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: Organization */}
      {activeTab === 'organization' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Affiliated Entity Details</h3>
          <p className="text-xs text-slate-500">
            Registered organization details associated with standards licensing and laboratory audit access.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-slate-400 block mb-1">Organization Name</span>
              <span className="font-bold text-slate-800 text-sm">National Standards Institute</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-slate-400 block mb-1">GSTIN / Corporate Reg</span>
              <span className="font-bold text-slate-800 text-sm">07AAAAA0000A1Z5</span>
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
                <option>Telugu (తెలుగు)</option>
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
        <div className="space-y-6">
          {/* Password Change Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#063b73]" />
              <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
            </div>
            <p className="text-xs text-slate-500">
              Ensure your account is protected with a secure password of at least 6 characters.
            </p>

            {passwordStatus && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${passwordStatus.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                  }`}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <div>{passwordStatus.message}</div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-[#063b73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-[#063b73]"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="mt-2 rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] transition disabled:opacity-50"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication Management */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#063b73]" />
                <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${twoFaStatus?.enabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
              >
                {twoFaStatus?.enabled ? 'Active (Enabled)' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Protect your BIS account with one-time verification codes sent during sign in.
            </p>

            {twoFaStatusMsg && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${twoFaStatusMsg.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                  }`}
              >
                {twoFaStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <div>{twoFaStatusMsg.message}</div>
              </div>
            )}

            {!twoFaStatus?.enabled && !twoFaSetupId && (
              <button
                type="button"
                onClick={handleInitiate2Fa}
                disabled={isLoading2Fa}
                className="rounded-xl bg-[#063b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B4A8F] transition disabled:opacity-50"
              >
                {isLoading2Fa ? 'Requesting OTP...' : 'Enable 2FA via SMS OTP'}
              </button>
            )}

            {twoFaSetupId && (
              <form onSubmit={handleConfirm2Fa} className="space-y-3 max-w-sm rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <label className="block text-xs font-semibold text-slate-800">
                  Enter 6-Digit Confirmation Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={twoFaOtpCode}
                    onChange={(e) => setTwoFaOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="h-9 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs font-mono tracking-widest outline-none focus:border-[#063b73]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isLoading2Fa || twoFaOtpCode.length !== 6}
                    className="rounded-xl bg-[#063b73] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0B4A8F] transition disabled:opacity-50"
                  >
                    Confirm &amp; Activate
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTwoFaSetupId(null); setTwoFaOtpCode(''); }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {twoFaStatus?.enabled && (
              <button
                type="button"
                onClick={handleDisable2Fa}
                disabled={isLoading2Fa}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
              >
                {isLoading2Fa ? 'Processing...' : 'Disable Two-Factor Authentication'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}