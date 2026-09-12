import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => boolean;
  loginDemo: () => User;
  register: (data: { email: string; password: string; companyName: string; vatNumber: string }) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const DEMO_EMAIL = 'demo@buildquote.app';
export const DEMO_PASSWORD = 'Demo1234';

// Store passwords separately (in real app, this would be hashed server-side)
const getPasswords = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem('bq_passwords') || '{}');
  } catch {
    return {};
  }
};

const setPassword = (email: string, password: string) => {
  const passwords = getPasswords();
  passwords[email] = password;
  localStorage.setItem('bq_passwords', JSON.stringify(passwords));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      login: (email: string, password: string) => {
        const { users } = get();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        const passwords = getPasswords();

        if (user && passwords[user.email] === password) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      loginDemo: () => {
        const { users } = get();
        const existingUser = users.find(
          u => u.email.toLowerCase() === DEMO_EMAIL.toLowerCase()
        );
        const demoUser: User = existingUser || {
          id: uuidv4(),
          email: DEMO_EMAIL,
          companyName: 'Nordic Craft Demo',
          vatNumber: 'DK12345678',
          phone: '+45 12 34 56 78',
          address: 'Bygmestervej 10',
          zipCode: '2400',
          city: 'Copenhagen',
          createdAt: new Date().toISOString(),
        };

        // Reset the reserved demo account credentials so one-click login is reliable.
        setPassword(demoUser.email, DEMO_PASSWORD);
        set({
          users: existingUser ? users : [...users, demoUser],
          user: demoUser,
          isAuthenticated: true,
        });
        return demoUser;
      },

      register: (data) => {
        const { users } = get();
        const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (exists) return false;

        const newUser: User = {
          id: uuidv4(),
          email: data.email,
          companyName: data.companyName,
          vatNumber: data.vatNumber,
          createdAt: new Date().toISOString(),
        };

        setPassword(data.email, data.password);
        set({ users: [...users, newUser], user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const { user, users } = get();
        if (!user) return;
        const updated = { ...user, ...data };
        set({
          user: updated,
          users: users.map(u => u.id === user.id ? updated : u),
        });
      },
    }),
    {
      name: 'bq-auth-store',
    }
  )
);
