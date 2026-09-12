import React from 'react';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GlobalSearch } from '@/components/ui/GlobalSearch';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onNavigate: (page: string, data?: any) => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuClick, onNavigate, actions }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-8 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          
          {/* Global Search */}
          <GlobalSearch onNavigate={onNavigate} />
          
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* User avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-semibold shadow-lg shadow-brand-500/25">
              {user?.companyName?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
                {user?.companyName}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
