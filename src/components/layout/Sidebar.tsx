import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'quotations', label: 'Quotations', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const quickActions = [
  { id: 'new-customer', label: 'New Customer', page: 'customer-form' },
  { id: 'new-quotation', label: 'New Quotation', page: 'quotation-form' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggle,
  onMobileClose,
}) => {
  const { user, logout } = useAuthStore();

  const handleNav = (page: string) => {
    onNavigate(page);
    onMobileClose?.();
  };

  return (
    <aside
      className={cn(
        'h-full bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
          <HardHat size={22} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight flex items-center gap-1">
              BuildQuote 
              <span className="text-brand-400">Pro</span>
              <Sparkles size={12} className="text-amber-400" />
            </h1>
            <p className="text-xs text-slate-400 truncate">Professional Quotations</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden lg:flex cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">
              {user?.companyName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.companyName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentPage === item.id ||
            (item.id === 'customers' && currentPage.startsWith('customer')) ||
            (item.id === 'quotations' && currentPage.startsWith('quotation'));
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/25'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Quick Actions */}
        {!collapsed && (
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Quick Actions
            </p>
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleNav(action.page)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Pro Badge - Upgrade CTA */}
      {!collapsed && (
        <div className="p-3">
          <div className="bg-gradient-to-br from-brand-600/20 to-purple-600/20 rounded-xl p-3 border border-brand-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-sm font-medium text-white">Pro Plan</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Unlimited quotations & customers
            </p>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
