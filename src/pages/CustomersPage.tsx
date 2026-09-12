import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Users,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { format } from 'date-fns';
import type { Customer } from '@/types';

interface CustomersPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { getCustomersByUser, deleteCustomer } = useCustomerStore();
  const { getQuotationsByCustomer } = useQuotationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (!user) return null;

  const customers = getCustomersByUser(user.id);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const lower = searchQuery.toLowerCase();
    return customers.filter(c =>
      c.fullName.toLowerCase().includes(lower) ||
      c.email.toLowerCase().includes(lower) ||
      c.phone.includes(lower) ||
      c.city.toLowerCase().includes(lower)
    );
  }, [customers, searchQuery]);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search customers by name, email, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <Button onClick={() => onNavigate('customer-form')} icon={<Plus size={16} />}>
          Add Customer
        </Button>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={36} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            {searchQuery ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Add your first customer to start creating quotations'}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={() => onNavigate('customer-form')}>
              <Plus size={16} /> Add First Customer
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card padding={false} className="hidden md:block overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Contact
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Location
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Quotations
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Added
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map(customer => {
                  const quotations = getQuotationsByCustomer(customer.id);
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {customer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900 text-sm">{customer.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Mail size={13} className="text-slate-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Phone size={13} className="text-slate-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={13} className="text-slate-400" />
                          {customer.city}, {customer.zipCode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <FileText size={13} className="text-slate-400" />
                          {quotations.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigate('customer-form', { customer })}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(customer)}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredCustomers.map(customer => {
              const quotations = getQuotationsByCustomer(customer.id);
              return (
                <Card key={customer.id} className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {customer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{customer.fullName}</p>
                        <p className="text-xs text-slate-500">{customer.city}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === customer.id ? null : customer.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                      {openMenuId === customer.id && (
                        <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 w-36 animate-scale-in">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onNavigate('customer-form', { customer });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeleteTarget(customer);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {customer.address}, {customer.zipCode} {customer.city}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{quotations.length} quotation{quotations.length !== 1 ? 's' : ''}</span>
                    <span>Added {format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <p className="text-sm text-slate-500 text-center">
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Customer"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
