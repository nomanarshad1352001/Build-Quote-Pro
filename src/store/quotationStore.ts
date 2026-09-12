import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Quotation, QuotationStatus, DashboardStats } from '@/types';

interface QuotationState {
  quotations: Quotation[];
  addQuotation: (userId: string, data: Omit<Quotation, 'id' | 'userId' | 'quotationNumber' | 'createdAt' | 'updatedAt'>) => Quotation;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  duplicateQuotation: (id: string) => Quotation | null;
  updateStatus: (id: string, status: QuotationStatus) => void;
  getQuotationsByUser: (userId: string) => Quotation[];
  getQuotationById: (id: string) => Quotation | undefined;
  getQuotationsByCustomer: (customerId: string) => Quotation[];
  getRecentQuotations: (userId: string, limit?: number) => Quotation[];
  getDashboardStats: (userId: string) => DashboardStats;
  getNextQuotationNumber: (userId: string) => string;
}

export const useQuotationStore = create<QuotationState>()(
  persist(
    (set, get) => ({
      quotations: [],

      getNextQuotationNumber: (userId) => {
        const userQuotations = get().quotations.filter(q => q.userId === userId);
        const year = new Date().getFullYear();
        const count = userQuotations.length + 1;
        return `QT-${year}-${String(count).padStart(4, '0')}`;
      },

      addQuotation: (userId, data) => {
        const now = new Date().toISOString();
        const quotation: Quotation = {
          ...data,
          id: uuidv4(),
          userId,
          quotationNumber: get().getNextQuotationNumber(userId),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ quotations: [...state.quotations, quotation] }));
        return quotation;
      },

      updateQuotation: (id, data) => {
        set(state => ({
          quotations: state.quotations.map(q =>
            q.id === id ? { ...q, ...data, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      deleteQuotation: (id) => {
        set(state => ({ quotations: state.quotations.filter(q => q.id !== id) }));
      },

      duplicateQuotation: (id) => {
        const original = get().quotations.find(q => q.id === id);
        if (!original) return null;

        const now = new Date().toISOString();
        const duplicate: Quotation = {
          ...original,
          id: uuidv4(),
          quotationNumber: get().getNextQuotationNumber(original.userId),
          title: `${original.title} (Copy)`,
          status: 'draft' as QuotationStatus,
          lineItems: original.lineItems.map(item => ({ ...item, id: uuidv4() })),
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({ quotations: [...state.quotations, duplicate] }));
        return duplicate;
      },

      updateStatus: (id, status) => {
        set(state => ({
          quotations: state.quotations.map(q =>
            q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },

      getQuotationsByUser: (userId) => {
        return get().quotations
          .filter(q => q.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getQuotationById: (id) => {
        return get().quotations.find(q => q.id === id);
      },

      getQuotationsByCustomer: (customerId) => {
        return get().quotations.filter(q => q.customerId === customerId);
      },

      getRecentQuotations: (userId, limit = 5) => {
        return get().quotations
          .filter(q => q.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },

      getDashboardStats: (userId) => {
        const userQuotations = get().quotations.filter(q => q.userId === userId);
        return {
          totalCustomers: 0, // Will be set from component
          totalQuotations: userQuotations.length,
          draftQuotations: userQuotations.filter(q => q.status === 'draft').length,
          sentQuotations: userQuotations.filter(q => q.status === 'sent').length,
          acceptedQuotations: userQuotations.filter(q => q.status === 'accepted').length,
          rejectedQuotations: userQuotations.filter(q => q.status === 'rejected').length,
          totalValue: userQuotations.reduce((sum, q) => sum + q.total, 0),
          acceptedValue: userQuotations
            .filter(q => q.status === 'accepted')
            .reduce((sum, q) => sum + q.total, 0),
        };
      },
    }),
    {
      name: 'bq-quotation-store',
    }
  )
);
