import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Customer } from '@/types';

interface CustomerState {
  customers: Customer[];
  addCustomer: (userId: string, data: Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomersByUser: (userId: string) => Customer[];
  getCustomerById: (id: string) => Customer | undefined;
  searchCustomers: (userId: string, query: string) => Customer[];
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: [],

      addCustomer: (userId, data) => {
        const now = new Date().toISOString();
        const customer: Customer = {
          ...data,
          id: uuidv4(),
          userId,
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ customers: [...state.customers, customer] }));
        return customer;
      },

      updateCustomer: (id, data) => {
        set(state => ({
          customers: state.customers.map(c =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCustomer: (id) => {
        set(state => ({ customers: state.customers.filter(c => c.id !== id) }));
      },

      getCustomersByUser: (userId) => {
        return get().customers.filter(c => c.userId === userId);
      },

      getCustomerById: (id) => {
        return get().customers.find(c => c.id === id);
      },

      searchCustomers: (userId, query) => {
        const lower = query.toLowerCase();
        return get().customers.filter(c =>
          c.userId === userId &&
          (c.fullName.toLowerCase().includes(lower) ||
           c.email.toLowerCase().includes(lower) ||
           c.phone.includes(lower) ||
           c.city.toLowerCase().includes(lower))
        );
      },
    }),
    {
      name: 'bq-customer-store',
    }
  )
);
