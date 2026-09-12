import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import type { Quotation, QuotationLineItem, QuotationStatus } from '@/types';

interface QuotationFormPageProps {
  quotation?: Quotation;
  onNavigate: (page: string, data?: any) => void;
}

const defaultLineItem = (): QuotationLineItem => ({
  id: uuidv4(),
  description: '',
  quantity: 1,
  unit: 'pcs',
  unitPrice: 0,
  total: 0,
});

export const QuotationFormPage: React.FC<QuotationFormPageProps> = ({ quotation, onNavigate }) => {
  const { user } = useAuthStore();
  const { getCustomersByUser } = useCustomerStore();
  const { addQuotation, updateQuotation } = useQuotationStore();
  const isEditing = !!quotation;

  const customers = user ? getCustomersByUser(user.id) : [];

  const [formData, setFormData] = useState({
    customerId: quotation?.customerId || '',
    title: quotation?.title || '',
    description: quotation?.description || '',
    status: quotation?.status || 'draft' as QuotationStatus,
    vatRate: quotation?.vatRate ?? 25,
    validUntil: quotation?.validUntil
      ? new Date(quotation.validUntil).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: quotation?.notes || '',
    termsAndConditions: quotation?.termsAndConditions || 'Payment is due within 14 days of invoice date. All prices are in EUR.',
  });

  const [lineItems, setLineItems] = useState<QuotationLineItem[]>(
    quotation?.lineItems?.length ? quotation.lineItems : [defaultLineItem()]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateLineItem = (id: string, field: keyof QuotationLineItem, value: any) => {
    setLineItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      })
    );
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, defaultLineItem()]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() =>
    lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    [lineItems]
  );

  const vatAmount = useMemo(() =>
    subtotal * (formData.vatRate / 100),
    [subtotal, formData.vatRate]
  );

  const total = subtotal + vatAmount;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerId) newErrors.customerId = 'Please select a customer';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required';
    if (lineItems.some(item => !item.description.trim())) {
      newErrors.lineItems = 'All line items must have a description';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setSaving(true);
    const computedLineItems = lineItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const quotationData = {
      customerId: formData.customerId,
      title: formData.title,
      description: formData.description,
      status: (asDraft ? 'draft' : formData.status) as QuotationStatus,
      lineItems: computedLineItems,
      subtotal,
      vatRate: formData.vatRate,
      vatAmount,
      total,
      validUntil: formData.validUntil,
      notes: formData.notes,
      termsAndConditions: formData.termsAndConditions,
    };

    setTimeout(() => {
      if (isEditing && quotation) {
        updateQuotation(quotation.id, quotationData);
      } else {
        addQuotation(user.id, quotationData as any);
      }
      setSaving(false);
      onNavigate('quotations');
    }, 300);
  };

  const unitOptions = [
    { value: 'pcs', label: 'Pieces' },
    { value: 'hrs', label: 'Hours' },
    { value: 'm', label: 'Meters' },
    { value: 'm²', label: 'Sq. Meters' },
    { value: 'm³', label: 'Cu. Meters' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'set', label: 'Set' },
    { value: 'lot', label: 'Lot' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => onNavigate('quotations')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Quotations
      </button>

      <form onSubmit={e => handleSubmit(e, false)}>
        {/* Header */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit Quotation' : 'Create New Quotation'}
              </h2>
              <p className="text-sm text-slate-500">
                {isEditing ? `Editing ${quotation?.quotationNumber}` : 'Fill in the quotation details'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Customer *"
              value={formData.customerId}
              onChange={e => handleChange('customerId', e.target.value)}
              options={[
                { value: '', label: 'Select a customer...' },
                ...customers.map(c => ({ value: c.id, label: c.fullName })),
              ]}
              error={errors.customerId}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={e => handleChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label="Quotation Title *"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Kitchen Renovation - Phase 1"
              error={errors.title}
            />
            <Input
              label="Valid Until *"
              type="date"
              value={formData.validUntil}
              onChange={e => handleChange('validUntil', e.target.value)}
              error={errors.validUntil}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Brief description of the work..."
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 resize-none"
            />
          </div>

          {customers.length === 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              You need to add a customer first.{' '}
              <button
                type="button"
                onClick={() => onNavigate('customer-form')}
                className="font-semibold underline cursor-pointer"
              >
                Add Customer
              </button>
            </div>
          )}
        </Card>

        {/* Line Items */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem} icon={<Plus size={14} />}>
              Add Item
            </Button>
          </div>

          {errors.lineItems && (
            <div className="mb-4 bg-danger-50 border border-red-200 text-danger-600 rounded-xl p-3 text-sm">
              {errors.lineItems}
            </div>
          )}

          <div className="space-y-3">
            {/* Desktop Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-3 text-xs font-medium text-slate-500 uppercase tracking-wider px-1">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {lineItems.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-3 lg:p-2 space-y-3 lg:space-y-0">
                <div className="lg:grid lg:grid-cols-12 gap-3 items-center space-y-3 lg:space-y-0">
                  <div className="col-span-4">
                    <label className="lg:hidden text-xs font-medium text-slate-500 mb-1 block">Description</label>
                    <input
                      value={item.description}
                      onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="lg:hidden text-xs font-medium text-slate-500 mb-1 block">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={e => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="lg:hidden text-xs font-medium text-slate-500 mb-1 block">Unit</label>
                    <select
                      value={item.unit}
                      onChange={e => updateLineItem(item.id, 'unit', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      {unitOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="lg:hidden text-xs font-medium text-slate-500 mb-1 block">Unit Price (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={e => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <label className="lg:hidden text-xs font-medium text-slate-500 mb-1 block">Total</label>
                    <span className="text-sm font-medium text-slate-900">
                      €{(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length <= 1}
                      className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-3">
                <span className="text-slate-500">VAT</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.vatRate}
                    onChange={e => handleChange('vatRate', parseFloat(e.target.value) || 0)}
                    className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-slate-500">%</span>
                  <span className="font-medium text-slate-900 ml-2">€{vatAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-brand-600">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes & Terms */}
        <Card className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Notes & Terms</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
              <textarea
                value={formData.notes}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder="Additional notes for the customer..."
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Terms & Conditions</label>
              <textarea
                value={formData.termsAndConditions}
                onChange={e => handleChange('termsAndConditions', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
          <Button type="button" variant="outline" onClick={() => onNavigate('quotations')}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={e => handleSubmit(e, true)}
            loading={saving}
          >
            Save as Draft
          </Button>
          <Button type="submit" loading={saving} icon={<Save size={16} />}>
            {isEditing ? 'Update Quotation' : 'Create Quotation'}
          </Button>
        </div>
      </form>
    </div>
  );
};
