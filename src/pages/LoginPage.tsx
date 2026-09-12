import React, { useState } from 'react';
import { HardHat, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, UserRoundCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DEMO_EMAIL, DEMO_PASSWORD, useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { useNotificationStore } from '@/store/notificationStore';
import { generateSeedCustomers, generateSeedQuotations } from '@/utils/seedData';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, loginDemo, users } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        // Check if email exists to give a better error message
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          setError('Incorrect password. Please try again or use "Forgot password".');
        } else {
          setError('No account found with this email. Please sign up first.');
        }
      }
      // If login succeeds, the App useEffect will redirect to dashboard
      setLoading(false);
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setResetSent(true);
    // In production this would send a real email via Supabase
  };

  const handleDemoLogin = () => {
    setError('');
    setDemoLoading(true);

    setTimeout(() => {
      const demoUser = loginDemo();
      const customerStore = useCustomerStore.getState();
      const quotationStore = useQuotationStore.getState();
      const notificationStore = useNotificationStore.getState();

      let demoCustomers = customerStore.getCustomersByUser(demoUser.id);
      if (demoCustomers.length === 0) {
        generateSeedCustomers(demoUser.id).forEach(customer => {
          const { id: _id, userId: _userId, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = customer;
          customerStore.addCustomer(demoUser.id, data);
        });
        demoCustomers = customerStore.getCustomersByUser(demoUser.id);
      }

      if (quotationStore.getQuotationsByUser(demoUser.id).length === 0) {
        generateSeedQuotations(demoUser.id, demoCustomers).forEach(quotation => {
          const { id: _id, userId: _userId, quotationNumber: _number, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = quotation;
          quotationStore.addQuotation(demoUser.id, data);
        });
      }

      if (notificationStore.getNotificationsByUser(demoUser.id).length === 0) {
        notificationStore.addNotification(demoUser.id, {
          type: 'info',
          title: 'Demo workspace ready',
          message: 'Explore the sample customers, quotations, reports, and dashboard analytics.',
        });
      }

      setDemoLoading(false);
    }, 300);
  };

  // ─── Forgot Password View ───
  if (forgotMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
              <HardHat size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BuildQuote Pro</h1>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
            <p className="text-slate-500 mt-1">Enter your email to receive a reset link</p>
          </div>

          {resetSent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
              <p className="text-sm text-emerald-800 font-medium">
                ✓ If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              </p>
              <p className="text-xs text-emerald-600">
                (Demo mode — in production, this sends a real email via Supabase Auth)
              </p>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <div className="bg-danger-50 border border-red-200 text-danger-600 rounded-xl p-3 text-sm animate-fade-in flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                icon={<Mail size={18} />}
                required
              />

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>
          )}

          <button
            onClick={() => { setForgotMode(false); setResetSent(false); setError(''); }}
            className="w-full text-center text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ─── Login View ───
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-800/85 to-slate-900/90" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <HardHat size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold">BuildQuote Pro</h1>
              <p className="text-sm text-white/70">Professional Quotations</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Professional quotations<br />
              made simple.
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Create, manage, and send professional quotations to your customers in minutes.
              Built for tradespeople and small construction businesses.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-white/60">Active Businesses</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-white/60">Quotations Sent</p>
              </div>
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-white/60">Satisfaction</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/50">
            © 2026 BuildQuote Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
              <HardHat size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BuildQuote Pro</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Show registered accounts hint */}
          {users.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800 animate-fade-in">
              <p className="font-medium mb-1">Your registered account{users.length > 1 ? 's' : ''}:</p>
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setEmail(u.email)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-6 bg-brand-600 text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {u.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-blue-900 truncate">{u.companyName}</p>
                    <p className="text-xs text-blue-600 truncate">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger-50 border border-red-200 text-danger-600 rounded-xl p-3 text-sm animate-fade-in flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="you@company.com"
              icon={<Mail size={18} />}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(''); }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign in
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 text-slate-400">or explore the product</span>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                <UserRoundCheck size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Demo account</p>
                <p className="mt-0.5 text-xs text-slate-600">Sample customers, quotations, and analytics are included.</p>
                <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-xs text-slate-600">
                  <p><span className="font-medium">Email:</span> {DEMO_EMAIL}</p>
                  <p><span className="font-medium">Password:</span> {DEMO_PASSWORD}</p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              className="mt-3 w-full"
              onClick={handleDemoLogin}
              loading={demoLoading}
              icon={<UserRoundCheck size={17} />}
            >
              Open Demo Dashboard
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 text-slate-400">New to BuildQuote?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => onNavigate('register')}
          >
            Create a new account
          </Button>
        </div>
      </div>
    </div>
  );
};
