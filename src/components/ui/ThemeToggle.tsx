import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer',
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          size={20}
          className={cn(
            'absolute inset-0 text-amber-500 transition-all duration-300',
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          )}
        />
        <Moon
          size={20}
          className={cn(
            'absolute inset-0 text-blue-400 transition-all duration-300',
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          )}
        />
      </div>
    </button>
  );
};
