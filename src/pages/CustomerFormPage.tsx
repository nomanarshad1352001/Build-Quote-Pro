import React, { useState } from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import type { Customer } from '@/types';

interface CustomerFormPageProps {
  customer?: Customer;
  onNavigate: (page: string) => void;
}

export const CustomerFormPage: React.FC<CustomerFormPageProps> = ({ customer, onNavigate }) => {
  const { user } = useAuthStore();
  const { addCustomer, updateCustomer } = useCustomerStore();
  const isEditing = !!customer;

  const [formData, setFormData] = useState({
    fullName: customer?.fullName || '',
    address: customer?.address || '',
    zipCode: customer?.zipCode || '',
    city: customer?.city || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    notes: customer?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setSaving(true);
    setTimeout(() => {
      if (isEditing && customer) {
        updateCustomer(customer.id, formData);
      } else {
        addCustomer(user.id, formData);
      }
      setSaving(false);
      onNavigate('customers');
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={() => onNavigate('customers')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Customers
      </button>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-brand-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Update customer information' : 'Fill in the customer details'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name *"
            value={formData.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            error={errors.fullName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              error={errors.email}
            />
            <Input
              label="Phone *"
              type="tel"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="+45 12 34 56 78"
              error={errors.phone}
            />
          </div>

          <Input
            label="Address *"
            value={formData.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="Street Address 123"
            error={errors.address}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Zip Code *"
              value={formData.zipCode}
              onChange={e => handleChange('zipCode', e.target.value)}
              placeholder="1000"
              error={errors.zipCode}
            />
            <Input
              label="City *"
              value={formData.city}
              onChange={e => handleChange('city', e.target.value)}
              placeholder="Copenhagen"
              error={errors.city}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Any additional notes about this customer..."
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => onNavigate('customers')}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} icon={<Save size={16} />}>
              {isEditing ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
