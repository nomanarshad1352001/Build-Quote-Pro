import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (userId: string, data: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: (userId: string) => void;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (userId, data) => {
        const notification: Notification = {
          ...data,
          id: uuidv4(),
          userId,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
        }));
      },

      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: (userId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearAll: (userId) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.userId !== userId),
        }));
      },

      getNotificationsByUser: (userId) => {
        return get().notifications.filter(n => n.userId === userId);
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      },
    }),
    {
      name: 'bq-notification-store',
    }
  )
);

// Helper to create welcome notifications for new users
export const createWelcomeNotifications = (userId: string, addNotification: NotificationState['addNotification']) => {
  addNotification(userId, {
    type: 'success',
    title: 'Welcome to BuildQuote Pro! 🎉',
    message: 'Your account is ready. We\'ve added some demo data to help you get started.',
  });
  
  setTimeout(() => {
    addNotification(userId, {
      type: 'info',
      title: 'Tip: Create your first quotation',
      message: 'Head to Quotations → New Quotation to create a professional quote for your customers.',
    });
  }, 100);
  
  setTimeout(() => {
    addNotification(userId, {
      type: 'info',
      title: 'Customize your profile',
      message: 'Add your company logo and details in Settings to personalize your quotations.',
    });
  }, 200);
};
