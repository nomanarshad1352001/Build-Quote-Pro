import React from 'react';
import {
  HardHat,
  FileText,
  Users,
  Send,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: FileText,
      title: 'Professional Quotations',
      description: 'Create beautiful, branded quotations in minutes. Add line items, set VAT rates, and generate professional PDFs.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Keep all your customer information organized. Quick search, full history, and easy communication.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Send,
      title: 'Send Instantly',
      description: 'Send quotations directly to your customers via email. Track status changes in real-time.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Multi-tenant architecture ensures your data is completely isolated and secure from others.',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Create and manage quotations from any device. Fully responsive design for on-the-go use.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Zap,
      title: 'Fast & Simple',
      description: 'No learning curve. Start creating professional quotations from day one with an intuitive interface.',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <HardHat size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                BuildQuote <span className="text-brand-600">Pro</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
              <Button onClick={() => onNavigate('register')}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-8">
              <Star size={14} className="fill-brand-500 text-brand-500" />
              Trusted by 500+ construction businesses
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
              Professional quotations
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
                made simple.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create, manage, and send professional quotations to your customers in minutes.
              Built specifically for tradespeople and small construction businesses.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => onNavigate('register')} className="px-8 text-base">
                Start Free Trial <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="px-8 text-base">
                Sign In to Account
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                No credit card needed
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-2 sm:p-3 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 px-3 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 ml-2">BuildQuote Pro — Dashboard</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 sm:p-6 space-y-4">
                {/* Stat cards preview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Customers', value: '24', color: 'border-l-blue-500' },
                    { label: 'Total Quotations', value: '67', color: 'border-l-purple-500' },
                    { label: 'Accepted', value: '43', color: 'border-l-emerald-500' },
                    { label: 'Revenue', value: '€142,580', color: 'border-l-amber-500' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-white rounded-xl p-3 sm:p-4 border-l-4 ${stat.color} shadow-sm`}>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                {/* Table preview */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm">Recent Quotations</p>
                  </div>
                  {[
                    { title: 'Kitchen Renovation', customer: 'Lars Jensen', amount: '€12,450', status: 'Accepted' },
                    { title: 'Bathroom Remodel', customer: 'Maria Nielsen', amount: '€8,920', status: 'Sent' },
                    { title: 'Roof Replacement', customer: 'Peter Andersen', amount: '€24,680', status: 'Draft' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{row.title}</p>
                        <p className="text-xs text-slate-500">{row.customer}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          row.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                          row.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>{row.status}</span>
                        <span className="text-sm font-semibold text-slate-900">{row.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything you need to manage quotations
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built with tradespeople in mind. Simple, fast, and professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-brand-200 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Get started in 3 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up with your company details. Takes less than a minute to get started.',
              },
              {
                step: '02',
                title: 'Add Customers',
                description: 'Import or add your customer information to your secure, private database.',
              },
              {
                step: '03',
                title: 'Send Quotations',
                description: 'Create professional quotations and send them directly to your customers.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to streamline your quotations?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of tradespeople who save hours every week with BuildQuote Pro.
            Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('register')}
              className="bg-white text-brand-700 hover:bg-slate-100 px-8 text-base"
            >
              Get Started Free <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <HardHat size={18} className="text-white" />
              </div>
              <span className="font-bold text-white">BuildQuote Pro</span>
            </div>
            <p className="text-sm">© 2026 BuildQuote Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
