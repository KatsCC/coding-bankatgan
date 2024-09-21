import create from 'zustand';
import { fetchNotificationsApi } from '@/api/postApi';

interface Notification {
  id: number;
  memberId: number;
  postId: number | null;
  type: string;
  content: string;
  createdAt: string;
  isNew: boolean;
}

interface NotificationState {
  notifications: Notification[];
  newNotificationCount: number;
  addNewNotification: (notification: Notification) => void;

  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  setPagination: (pagination: NotificationState['pagination']) => void;

  setNotifications: (announcements: Notification[]) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => void;
}

const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  newNotificationCount: 0,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  },
  setPagination: pagination => set({ pagination }),
  setNotifications: notifications => {
    const newCount = notifications.filter(n => n.isNew).length;
    set({ notifications, newNotificationCount: newCount });
  },
  fetchNotifications: async () => {
    try {
      const data = await fetchNotificationsApi();
      if (data) {
        const notifications = data.content.map((notification: Notification) => ({
          ...notification,
          isNew: notification.isNew ?? true,
        }));

        set({ notifications });
        set({
          pagination: {
            totalElements: data.totalElements,
            totalPages: 1,
            size: 20,
            number: 0,
          },
        });

        const newCount = notifications.filter((n: Notification) => n.isNew).length;
        set({ newNotificationCount: newCount });
      }
    } catch (error) {
      set({
        notifications: [],
        pagination: { totalElements: 0, totalPages: 0, size: 20, number: 0 },
      });
    }
  },
  markAsRead: (id: number) => {
    set(state => {
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === id ? { ...notification, isNew: false } : notification,
      );

      const newCount = updatedNotifications.filter(n => n.isNew).length;

      return { notifications: updatedNotifications, newNotificationCount: newCount };
    });
  },
  addNewNotification: (notification: Notification) => {
    set(state => {
      const updatedNotifications = [{ ...notification, isNew: true }, ...state.notifications].slice(
        0,
        20,
      );

      const newCount = updatedNotifications.filter(n => n.isNew).length;

      return { notifications: updatedNotifications, newNotificationCount: newCount };
    });
  },
}));

export default useNotificationStore;