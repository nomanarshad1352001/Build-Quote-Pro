export interface User {
  id: string;
  email: string;
  companyName: string;
  vatNumber: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  fullName: string;
  address: string;
  zipCode: string;
  city: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  userId: string;
  customerId: string;
  quotationNumber: string;
  title: string;
  description?: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: QuotationStatus;
  validUntil: string;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalQuotations: number;
  draftQuotations: number;
  sentQuotations: number;
  acceptedQuotations: number;
  rejectedQuotations: number;
  totalValue: number;
  acceptedValue: number;
}
