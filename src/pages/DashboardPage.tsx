import React, { useMemo } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  Calendar,
  Activity,
  Target,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/charts/StatsCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart, DonutLegend } from '@/components/charts/DonutChart';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface DashboardPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { getCustomersByUser } = useCustomerStore();
  const { getDashboardStats, getRecentQuotations, getQuotationsByUser } = useQuotationStore();
  const { getCustomerById } = useCustomerStore();

  if (!user) return null;

  const customers = getCustomersByUser(user.id);
  const quotations = getQuotationsByUser(user.id);
  const stats = getDashboardStats(user.id);
  stats.totalCustomers = customers.length;
  const recentQuotations = getRecentQuotations(user.id, 5);

  // Generate chart data
  const monthlyRevenueData = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayQuotations = quotations.filter(
        q => q.status === 'accepted' && isSameDay(new Date(q.createdAt), day)
      );
      const value = dayQuotations.reduce((sum, q) => sum + q.total, 0);
      return {
        label: format(day, 'd'),
        value,
      };
    });
  }, [quotations]);

  const last7DaysData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(today, 6 - i);
      const dayQuotations = quotations.filter(q =>
        isSameDay(new Date(q.createdAt), day)
      );
      return {
        label: format(day, 'EEE'),
        value: dayQuotations.length,
        color: '#3b82f6',
      };
    });
  }, [quotations]);

  const statusDonutData = [
    { label: 'Draft', value: stats.draftQuotations, color: '#94a3b8' },
    { label: 'Sent', value: stats.sentQuotations, color: '#3b82f6' },
    { label: 'Accepted', value: stats.acceptedQuotations, color: '#22c55e' },
    { label: 'Rejected', value: stats.rejectedQuotations, color: '#ef4444' },
  ];

  const conversionRate = stats.totalQuotations > 0
    ? Math.round((stats.acceptedQuotations / stats.totalQuotations) * 100)
    : 0;

  const avgQuotationValue = stats.totalQuotations > 0
    ? stats.totalValue / stats.totalQuotations
    : 0;

  // Activity timeline
  const activityTimeline = useMemo(() => {
    return quotations
      .slice(0, 5)
      .map(q => {
        const customer = getCustomerById(q.customerId);
        let action = 'created';
        let color = 'bg-blue-500';
        
        if (q.status === 'accepted') {
          action = 'accepted';
          color = 'bg-emerald-500';
        } else if (q.status === 'sent') {
          action = 'sent';
          color = 'bg-purple-500';
        } else if (q.status === 'rejected') {
          action = 'rejected';
          color = 'bg-red-500';
        }

        return {
          id: q.id,
          title: q.title,
          customer: customer?.fullName || 'Unknown',
          action,
          color,
          time: q.updatedAt,
          amount: q.total,
        };
      });
  }, [quotations, getCustomerById]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg text-slate-500 dark:text-slate-400">Welcome back,</h2>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{user.companyName} 👋</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('customer-form')}
            icon={<Plus size={16} />}
          >
            New Customer
          </Button>
          <Button
            onClick={() => onNavigate('quotation-form')}
            icon={<Plus size={16} />}
          >
            New Quotation
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon={<Users size={22} />}
          color="blue"
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatsCard
          label="Total Quotations"
          value={stats.totalQuotations}
          icon={<FileText size={22} />}
          color="purple"
          trend={{ value: 8, label: 'vs last month' }}
        />
        <StatsCard
          label="Accepted"
          value={stats.acceptedQuotations}
          icon={<CheckCircle2 size={22} />}
          color="emerald"
          trend={{ value: conversionRate, label: 'conversion rate' }}
        />
        <StatsCard
          label="Total Revenue"
          value={`€${stats.acceptedValue.toLocaleString('en', { minimumFractionDigits: 0 })}`}
          icon={<DollarSign size={22} />}
          color="amber"
          trend={{ value: 15, label: 'vs last month' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly accepted quotations value</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="text-slate-500 dark:text-slate-400">Revenue</span>
              </div>
            </div>
          </div>
          <LineChart
            data={monthlyRevenueData}
            height={220}
            color="#3b82f6"
            showGrid
          />
        </Card>

        {/* Quotation Status Donut */}
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quotation Status</h3>
          <div className="flex flex-col items-center gap-4">
            <DonutChart
              data={statusDonutData}
              size={160}
              strokeWidth={20}
              centerValue={stats.totalQuotations.toString()}
              centerLabel="Total"
            />
            <DonutLegend data={statusDonutData} />
          </div>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotations */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Recent Quotations</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Latest quotation activity</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('quotations')}>
                View all <ArrowRight size={14} />
              </Button>
            </div>

            {recentQuotations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-700 dark:text-slate-300">No quotations yet</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your first quotation to get started</p>
                <Button className="mt-4" size="sm" onClick={() => onNavigate('quotation-form')}>
                  <Plus size={16} /> Create Quotation
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentQuotations.map(q => {
                  const customer = getCustomerById(q.customerId);
                  return (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-4 mx-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                      onClick={() => onNavigate('quotation-detail', { id: q.id })}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg shadow-brand-500/20">
                          {q.quotationNumber.slice(-4)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{q.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {customer?.fullName || 'Unknown'} · {format(new Date(q.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge status={q.status} />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white hidden sm:inline">
                          €{q.total.toLocaleString('en', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Activity & Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Target size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Conversion Rate</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Accepted / Total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{conversionRate}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Zap size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Avg. Quote Value</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Per quotation</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  €{avgQuotationValue.toLocaleString('en', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Pending</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Awaiting response</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.sentQuotations}</span>
              </div>
            </div>
          </Card>

          {/* Quotations This Week */}
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quotations This Week</h3>
            <BarChart data={last7DaysData} height={140} showValues />
          </Card>
        </div>
      </div>

      {/* Third Row - Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-slate-500 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          
          {activityTimeline.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-4">
                {activityTimeline.map((item, i) => (
                  <div key={item.id} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 z-10 shadow-lg`}>
                      {item.action === 'accepted' && <CheckCircle2 size={14} className="text-white" />}
                      {item.action === 'sent' && <Send size={14} className="text-white" />}
                      {item.action === 'rejected' && <XCircle size={14} className="text-white" />}
                      {item.action === 'created' && <FileText size={14} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-slate-500 dark:text-slate-400"> was {item.action}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.customer} · €{item.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {format(new Date(item.time), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('customer-form')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Add Customer</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create new customer</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('quotation-form')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">New Quotation</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create professional quote</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('customers')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">View Customers</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage customer list</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={18} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Settings</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage preferences</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
