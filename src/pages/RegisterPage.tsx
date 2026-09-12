import React, { useState } from 'react';
import { HardHat, Mail, Lock, Building2, FileDigit, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { useNotificationStore, createWelcomeNotifications } from '@/store/notificationStore';
import { generateSeedCustomers, generateSeedQuotations } from '@/utils/seedData';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, users } = useAuthStore();
  const { addCustomer } = useCustomerStore();
  const { addQuotation } = useQuotationStore();
  const { addNotification } = useNotificationStore();

  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const passwordChecks = [
    { label: 'At least 8 characters', pass: formData.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(formData.password) },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(formData.password) },
  ];

  // Check if email already registered
  const emailAlreadyExists = formData.email.trim().length > 0 &&
    users.some(u => u.email.toLowerCase() === formData.email.toLowerCase().trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (emailAlreadyExists) {
      setError('This email is already registered. Please sign in instead.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordChecks.every(c => c.pass)) {
      setError('Password does not meet all requirements');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = register({
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.companyName.trim(),
        vatNumber: formData.vatNumber.trim(),
      });

      if (!success) {
        setError('An account with this email already exists. Please sign in.');
        setLoading(false);
        return;
      }

      // Seed demo data for new user
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const seedCustomers = generateSeedCustomers(currentUser.id);
        seedCustomers.forEach(c => {
          const { id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...data } = c;
          addCustomer(currentUser.id, data);
        });
        const storedCustomers = useCustomerStore.getState().getCustomersByUser(currentUser.id);
        const seedQuotations = generateSeedQuotations(currentUser.id, storedCustomers);
        seedQuotations.forEach(q => {
          const { id: _id, userId: _uid, quotationNumber: _qn, createdAt: _ca, updatedAt: _ua, ...data } = q;
          addQuotation(currentUser.id, data as any);
        });

        createWelcomeNotifications(currentUser.id, addNotification);
      }

      setLoading(false);
      // The App useEffect will automatically redirect to dashboard
    }, 500);
  };

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

          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Start your<br />
              free trial today.
            </h2>
            <div className="space-y-4">
              {[
                'Create unlimited professional quotations',
                'Manage your customer database',
                'Generate and send PDF quotations',
                'Mobile-friendly dashboard',
                'Secure multi-tenant platform',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-white/50">
            © 2026 BuildQuote Pro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
              <HardHat size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BuildQuote Pro</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="text-slate-500 mt-1">Get started with BuildQuote Pro</p>
          </div>

          {/* Already have accounts? */}
          {users.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 animate-fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">You already have {users.length} registered account{users.length > 1 ? 's' : ''}.</p>
                  <p className="mt-1">
                    Want to sign in instead?{' '}
                    <button
                      onClick={() => onNavigate('login')}
                      className="text-brand-600 hover:text-brand-700 font-semibold underline cursor-pointer"
                    >
                      Go to Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-red-200 text-danger-600 rounded-xl p-3 text-sm animate-fade-in flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Company name *"
              value={formData.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
              placeholder="Your Company Ltd."
              icon={<Building2 size={18} />}
              required
            />

            <Input
              label="VAT/CVR Number *"
              value={formData.vatNumber}
              onChange={e => handleChange('vatNumber', e.target.value)}
              placeholder="DK12345678"
              icon={<FileDigit size={18} />}
              required
            />

            <div>
              <Input
                label="Email address *"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="you@company.com"
                icon={<Mail size={18} />}
                error={emailAlreadyExists ? 'This email is already registered' : undefined}
                required
              />
              {emailAlreadyExists && (
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium mt-1 cursor-pointer"
                >
                  → Sign in with this email instead
                </button>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="Create a strong password"
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

            {formData.password && (
              <div className="space-y-1.5 animate-fade-in">
                {passwordChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      size={14}
                      className={check.pass ? 'text-emerald-500' : 'text-slate-300'}
                    />
                    <span className={check.pass ? 'text-emerald-600' : 'text-slate-400'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Input
              label="Confirm password *"
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              icon={<Lock size={18} />}
              error={
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={emailAlreadyExists}
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
