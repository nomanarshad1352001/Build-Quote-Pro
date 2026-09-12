import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <AlertCircle size={18} className="text-blue-500" />,
  };

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm',
          styles[type]
        )}
      >
        {icons[type]}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-70 cursor-pointer">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
