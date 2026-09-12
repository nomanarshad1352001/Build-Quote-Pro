import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Edit3,
  Copy,
  Printer,
  CheckCircle2,
  XCircle,
  Mail,
  HardHat,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useCustomerStore } from '@/store/customerStore';
import { useQuotationStore } from '@/store/quotationStore';
import { useNotificationStore } from '@/store/notificationStore';
import { format } from 'date-fns';


interface QuotationDetailPageProps {
  quotationId: string;
  onNavigate: (page: string, data?: any) => void;
}

export const QuotationDetailPage: React.FC<QuotationDetailPageProps> = ({
  quotationId,
  onNavigate,
}) => {
  const { user } = useAuthStore();
  const { getCustomerById } = useCustomerStore();
  const { getQuotationById, updateStatus, duplicateQuotation } = useQuotationStore();
  const { addNotification } = useNotificationStore();
  const [sendModal, setSendModal] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const quotation = getQuotationById(quotationId);
  if (!quotation || !user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Quotation not found</p>
        <Button className="mt-4" onClick={() => onNavigate('quotations')}>
          Back to Quotations
        </Button>
      </div>
    );
  }

  const customer = getCustomerById(quotation.customerId);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${quotation.quotationNumber} - ${quotation.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, sans-serif; color: #1e293b; padding: 40px; font-size: 14px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; }
          .logo { font-size: 24px; font-weight: 800; color: #3b82f6; }
          .logo-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
          .company-info { text-align: right; font-size: 13px; color: #475569; }
          .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .address-block { }
          .address-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600; margin-bottom: 8px; }
          .address-value { font-size: 13px; color: #334155; line-height: 1.6; }
          .meta { display: flex; gap: 40px; margin-bottom: 30px; padding: 16px; background: #f8fafc; border-radius: 8px; }
          .meta-item { }
          .meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-weight: 600; }
          .meta-value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          thead th { text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
          thead th:last-child { text-align: right; }
          tbody td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
          tbody td:last-child { text-align: right; font-weight: 500; }
          .totals { display: flex; justify-content: flex-end; margin-bottom: 30px; }
          .totals-box { width: 280px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
          .total-row.final { border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 4px; font-size: 18px; font-weight: 700; color: #3b82f6; }
          .notes { margin-top: 30px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 13px; color: #475569; }
          .notes-title { font-weight: 600; color: #1e293b; margin-bottom: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">BuildQuote Pro</div>
            <div class="logo-sub">Professional Quotation</div>
          </div>
          <div class="company-info">
            <div style="font-weight:600; color:#1e293b;">${user.companyName}</div>
            <div>VAT: ${user.vatNumber}</div>
            <div>${user.email}</div>
            ${user.phone ? `<div>${user.phone}</div>` : ''}
            ${user.address ? `<div>${user.address}</div>` : ''}
          </div>
        </div>

        <div class="addresses">
          <div class="address-block">
            <div class="address-label">Bill To</div>
            <div class="address-value">
              <strong>${customer?.fullName || 'N/A'}</strong><br/>
              ${customer?.address || ''}<br/>
              ${customer?.zipCode || ''} ${customer?.city || ''}<br/>
              ${customer?.email || ''}<br/>
              ${customer?.phone || ''}
            </div>
          </div>
        </div>

        <div class="meta">
          <div class="meta-item">
            <div class="meta-label">Quotation No.</div>
            <div class="meta-value">${quotation.quotationNumber}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Date</div>
            <div class="meta-value">${format(new Date(quotation.createdAt), 'dd MMM yyyy')}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Valid Until</div>
            <div class="meta-value">${quotation.validUntil ? format(new Date(quotation.validUntil), 'dd MMM yyyy') : 'N/A'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Status</div>
            <div class="meta-value">${quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}</div>
          </div>
        </div>

        <h3 style="font-size:16px; font-weight:600; margin-bottom:12px;">${quotation.title}</h3>
        ${quotation.description ? `<p style="color:#64748b; margin-bottom:20px; font-size:13px;">${quotation.description}</p>` : ''}

        <table>
          <thead>
            <tr>
              <th style="width:40%">Description</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td>€${item.unitPrice.toFixed(2)}</td>
                <td>€${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-box">
            <div class="total-row">
              <span>Subtotal</span>
              <span>€${quotation.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>VAT (${quotation.vatRate}%)</span>
              <span>€${quotation.vatAmount.toFixed(2)}</span>
            </div>
            <div class="total-row final">
              <span>Total</span>
              <span>€${quotation.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${quotation.notes ? `
          <div class="notes">
            <div class="notes-title">Notes</div>
            <p>${quotation.notes}</p>
          </div>
        ` : ''}

        ${quotation.termsAndConditions ? `
          <div class="notes" style="margin-top:16px;">
            <div class="notes-title">Terms & Conditions</div>
            <p>${quotation.termsAndConditions}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>${user.companyName} · VAT: ${user.vatNumber} · ${user.email}</p>
          <p style="margin-top:4px;">Generated by BuildQuote Pro</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleSend = () => {
    updateStatus(quotation.id, 'sent');
    setSendModal(false);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
    if (user) {
      addNotification(user.id, {
        type: 'success',
        title: 'Quotation Sent',
        message: `${quotation.quotationNumber} has been sent to ${customer?.fullName || 'customer'}.`,
      });
    }
  };

  const handleDuplicate = () => {
    const dup = duplicateQuotation(quotation.id);
    if (dup) onNavigate('quotation-form', { quotation: dup });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => onNavigate('quotations')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Quotations
      </button>

      {sendSuccess && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={20} />
          <span className="font-medium">Quotation marked as sent! Email notification simulated.</span>
        </div>
      )}

      {/* Actions Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{quotation.quotationNumber}</h2>
              <Badge status={quotation.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Created {format(new Date(quotation.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quotation.status === 'draft' && (
              <Button size="sm" onClick={() => setSendModal(true)} icon={<Send size={14} />}>
                Send to Customer
              </Button>
            )}
            {quotation.status === 'sent' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateStatus(quotation.id, 'accepted');
                    if (user) addNotification(user.id, { type: 'success', title: 'Quotation Accepted', message: `${quotation.quotationNumber} "${quotation.title}" has been marked as accepted.` });
                  }}
                  icon={<CheckCircle2 size={14} />}
                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateStatus(quotation.id, 'rejected');
                    if (user) addNotification(user.id, { type: 'warning', title: 'Quotation Rejected', message: `${quotation.quotationNumber} "${quotation.title}" has been marked as rejected.` });
                  }}
                  icon={<XCircle size={14} />}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => onNavigate('quotation-form', { quotation })} icon={<Edit3 size={14} />}>
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={handleDuplicate} icon={<Copy size={14} />}>
              Duplicate
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint} icon={<Printer size={14} />}>
              Print / PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Quotation Preview */}
      <div ref={printRef}>
        <Card className="printable-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                <HardHat size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-600">BuildQuote Pro</h3>
                <p className="text-xs text-slate-500">Professional Quotation</p>
              </div>
            </div>
            <div className="text-left sm:text-right text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{user.companyName}</p>
              <p>VAT: {user.vatNumber}</p>
              <p>{user.email}</p>
              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>

          {/* Customer & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-slate-900">{customer?.fullName || 'N/A'}</p>
              <p className="text-sm text-slate-600">{customer?.address}</p>
              <p className="text-sm text-slate-600">{customer?.zipCode} {customer?.city}</p>
              <p className="text-sm text-slate-600">{customer?.email}</p>
              <p className="text-sm text-slate-600">{customer?.phone}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between sm:justify-end sm:gap-8 text-sm">
                <span className="text-slate-400">Quotation No.</span>
                <span className="font-semibold text-slate-900">{quotation.quotationNumber}</span>
              </div>
              <div className="flex justify-between sm:justify-end sm:gap-8 text-sm">
                <span className="text-slate-400">Date</span>
                <span className="text-slate-700">{format(new Date(quotation.createdAt), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between sm:justify-end sm:gap-8 text-sm">
                <span className="text-slate-400">Valid Until</span>
                <span className="text-slate-700">
                  {quotation.validUntil ? format(new Date(quotation.validUntil), 'dd MMM yyyy') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between sm:justify-end sm:gap-8 text-sm">
                <span className="text-slate-400">Status</span>
                <Badge status={quotation.status} />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="py-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">{quotation.title}</h3>
            {quotation.description && (
              <p className="text-sm text-slate-600 mt-1">{quotation.description}</p>
            )}
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-slate-200 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 px-4">
                    Qty
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 px-4">
                    Unit
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 px-4">
                    Unit Price
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pl-4">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotation.lineItems.map(item => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-sm text-slate-900">{item.description}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.unit}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 text-right">€{item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 pl-4 text-sm font-medium text-slate-900 text-right">
                      €{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end py-6 border-b border-slate-200">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">€{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">VAT ({quotation.vatRate}%)</span>
                <span className="text-slate-900">€{quotation.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-brand-600">€{quotation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(quotation.notes || quotation.termsAndConditions) && (
            <div className="py-6 space-y-4">
              {quotation.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Notes</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{quotation.notes}</p>
                </div>
              )}
              {quotation.termsAndConditions && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Terms & Conditions</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{quotation.termsAndConditions}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            <p>{user.companyName} · VAT: {user.vatNumber} · {user.email}</p>
            <p className="mt-1">Generated by BuildQuote Pro</p>
          </div>
        </Card>
      </div>

      {/* Send Modal */}
      <Modal
        isOpen={sendModal}
        onClose={() => setSendModal(false)}
        title="Send Quotation"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Send to {customer?.fullName}</p>
                <p className="text-sm text-blue-700 mt-0.5">{customer?.email}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            This will mark the quotation as <strong>Sent</strong> and simulate sending an email notification
            to the customer with the quotation attached as a PDF.
          </p>
          <div className="bg-slate-50 rounded-xl p-3 text-sm">
            <p className="font-medium text-slate-900">{quotation.title}</p>
            <p className="text-slate-500">{quotation.quotationNumber} · €{quotation.total.toFixed(2)}</p>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setSendModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} icon={<Send size={16} />}>
              Send Quotation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
