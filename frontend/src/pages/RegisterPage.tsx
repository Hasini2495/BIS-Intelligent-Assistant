import React, { useState } from 'react';
import { CheckCircle2, Lock, Mail, Shield, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BisLogo } from '@/components/ui/BisLogo';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('student');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f8fc] font-sans">
      {/* Left Brand Panel (Reference Screen 03) */}
      <div className="relative flex flex-col justify-between bg-linear-to-b from-[#063b73] via-[#0A2E5C] to-[#042449] p-8 sm:p-12 text-white md:w-5/12 lg:w-1/2">
        <div>
          <Link to="/welcome" className="inline-block">
            <BisLogo variant="header" size="lg" inverted />
          </Link>
        </div>

        <div className="my-auto py-12">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs text-white shadow-inner">
            <Shield className="h-8 w-8 text-amber-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Standards <br />
            Knowledge <br />
            Compliance
          </h2>
          <p className="mt-2 text-lg font-medium text-blue-200">
            For a Better Tomorrow
          </p>

          <div className="mt-8 space-y-3 text-xs sm:text-sm text-blue-100/90">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Free access to standard catalogue summaries &amp; citations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Automated product compliance checklist validator</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Authoritative answers grounded directly in BIS codes</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-xs text-blue-200/70">
          Bureau of Indian Standards • SIH 2026 Initiative
        </div>
      </div>

      {/* Right Form Card Panel (Reference Screen 03) */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create an Account
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Join BIS AI Assistant platform
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Select User Type */}
            <div>
              <label htmlFor="reg-usertype" className="block text-xs font-semibold text-slate-700 mb-1">
                Selected User Type
              </label>
              <select
                id="reg-usertype"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="student">Student / Researcher</option>
                <option value="industry">Industry / Manufacturer</option>
                <option value="msme">MSME / Startup</option>
                <option value="testing_lab">Conformity Assessment / Testing Lab</option>
                <option value="consumer">Consumer</option>
                <option value="officer">BIS Officer / Regulatory Authority</option>
              </select>
            </div>

            {/* Email / Mobile */}
            <div>
              <label htmlFor="reg-contact" className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-contact"
                  type="text"
                  required
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="Enter your email or mobile number"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirmpass" className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-confirmpass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#063b73] focus:ring-[#063b73]"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600 leading-tight">
                I agree to the{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="font-semibold text-[#063b73] hover:underline">
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-semibold text-[#063b73] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full rounded-xl bg-[#063b73] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0B4A8F] active:bg-[#042449] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#063b73] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
