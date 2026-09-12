import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  FileText,

} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { format } from 'date-fns';
import type { Quotation, QuotationStatus } from '@/types';

interface QuotationsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const QuotationsPage: React.FC<QuotationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { getCustomerById } = useCustomerStore();
  const { getQuotationsByUser, deleteQuotation, duplicateQuotation } = useQuotationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null);

  if (!user) return null;

  const quotations = getQuotationsByUser(user.id);

  const filteredQuotations = useMemo(() => {
    let result = quotations;
    if (statusFilter !== 'all') {
      result = result.filter(q => q.status === statusFilter);
    }
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(q => {
        const customer = getCustomerById(q.customerId);
        return (
          q.title.toLowerCase().includes(lower) ||
          q.quotationNumber.toLowerCase().includes(lower) ||
          customer?.fullName.toLowerCase().includes(lower)
        );
      });
    }
    return result;
  }, [quotations, statusFilter, searchQuery]);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteQuotation(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = (q: Quotation) => {
    duplicateQuotation(q.id);
  };

  const statusFilters: { value: QuotationStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: quotations.length },
    { value: 'draft', label: 'Drafts', count: quotations.filter(q => q.status === 'draft').length },
    { value: 'sent', label: 'Sent', count: quotations.filter(q => q.status === 'sent').length },
    { value: 'accepted', label: 'Accepted', count: quotations.filter(q => q.status === 'accepted').length },
    { value: 'rejected', label: 'Rejected', count: quotations.filter(q => q.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by title, number, customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <Button onClick={() => onNavigate('quotation-form')} icon={<Plus size={16} />}>
          New Quotation
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusFilters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === filter.value
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {filter.label}
            <span className={`ml-1.5 text-xs ${statusFilter === filter.value ? 'text-white/80' : 'text-slate-400'}`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Quotation List */}
      {filteredQuotations.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={36} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            {searchQuery || statusFilter !== 'all' ? 'No quotations found' : 'No quotations yet'}
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first quotation to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button className="mt-4" onClick={() => onNavigate('quotation-form')}>
              <Plus size={16} /> Create Quotation
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredQuotations.map(quotation => {
            const customer = getCustomerById(quotation.customerId);
            return (
              <Card
                key={quotation.id}
                className="hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div
                    className="flex items-start gap-4 flex-1 min-w-0"
                    onClick={() => onNavigate('quotation-detail', { id: quotation.id })}
                  >
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {quotation.title}
                        </h3>
                        <Badge status={quotation.status} />
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {quotation.quotationNumber} · {customer?.fullName || 'Unknown Customer'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Created {format(new Date(quotation.createdAt), 'MMM d, yyyy')}
                        {quotation.validUntil && ` · Valid until ${format(new Date(quotation.validUntil), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        €{quotation.total.toLocaleString('en', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {quotation.lineItems.length} item{quotation.lineItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate('quotation-detail', { id: quotation.id }); }}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate('quotation-form', { quotation }); }}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(quotation); }}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(quotation); }}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-sm text-slate-500 text-center">
        Showing {filteredQuotations.length} of {quotations.length} quotations
      </p>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Quotation"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete quotation <strong>{deleteTarget?.quotationNumber}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Quotation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
