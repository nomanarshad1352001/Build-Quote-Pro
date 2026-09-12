import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  FileText,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { Badge } from '@/components/ui/Badge';


interface GlobalSearchProps {
  onNavigate: (page: string, data?: any) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { getCustomersByUser } = useCustomerStore();
  const { getQuotationsByUser } = useQuotationStore();
  const { getCustomerById } = useCustomerStore();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const customers = user ? getCustomersByUser(user.id) : [];
  const quotations = user ? getQuotationsByUser(user.id) : [];

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { customers: [], quotations: [] };
    const q = query.toLowerCase();

    const matchedCustomers = customers
      .filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedQuotations = quotations
      .filter(qt => {
        const cust = getCustomerById(qt.customerId);
        return (
          qt.title.toLowerCase().includes(q) ||
          qt.quotationNumber.toLowerCase().includes(q) ||
          qt.description?.toLowerCase().includes(q) ||
          cust?.fullName.toLowerCase().includes(q)
        );
      })
      .slice(0, 5);

    return { customers: matchedCustomers, quotations: matchedQuotations };
  }, [query, customers, quotations, getCustomerById]);

  const totalResults = results.customers.length + results.quotations.length;
  const hasQuery = query.trim().length > 0;

  const handleSelect = (type: 'customer' | 'quotation', data: any) => {
    setIsOpen(false);
    if (type === 'customer') {
      onNavigate('customer-form', { customer: data });
    } else {
      onNavigate('quotation-detail', { id: data.id });
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer group"
      >
        <Search size={16} className="text-slate-400 dark:text-slate-500" />
        <span className="text-sm text-slate-400 dark:text-slate-500 hidden lg:inline">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded text-[10px] text-slate-400 dark:text-slate-400 font-mono">
          <Command size={10} />K
        </kbd>
      </button>

      {/* Mobile search icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <Search size={20} className="text-slate-500 dark:text-slate-400" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <Search size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search customers, quotations, anything..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-400 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!hasQuery ? (
                <div className="p-8 text-center">
                  <Search size={40} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Start typing to search across customers and quotations
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {customers.length} customers
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} /> {quotations.length} quotations
                    </span>
                  </div>
                </div>
              ) : totalResults === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search size={20} className="text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">No results found</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    No matches for "<strong>{query}</strong>". Try different keywords.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Customer Results */}
                  {results.customers.length > 0 && (
                    <div>
                      <div className="px-5 py-2 bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Customers ({results.customers.length})
                        </span>
                      </div>
                      {results.customers.map(customer => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelect('customer', customer)}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
                        >
                          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {customer.fullName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {customer.email} · {customer.city}
                            </p>
                          </div>
                          <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quotation Results */}
                  {results.quotations.length > 0 && (
                    <div>
                      <div className="px-5 py-2 bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Quotations ({results.quotations.length})
                        </span>
                      </div>
                      {results.quotations.map(qt => {
                        const cust = getCustomerById(qt.customerId);
                        return (
                          <button
                            key={qt.id}
                            onClick={() => handleSelect('quotation', qt)}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
                          >
                            <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                  {qt.title}
                                </p>
                                <Badge status={qt.status} />
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {qt.quotationNumber} · {cust?.fullName || 'Unknown'} · €{qt.total.toLocaleString('en', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded font-mono">↵</kbd>
                  Select
                </span>
              </div>
              <span>{totalResults} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
