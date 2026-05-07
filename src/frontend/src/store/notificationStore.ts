import { mockNotifications } from "@/data/mockData";
import type { Notification } from "@/types";
import { create } from "zustand";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()((set) => ({
  notifications: [...mockNotifications],
  unreadCount: mockNotifications.filter((n) => !n.isRead).length,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id && !n.isRead ? { ...n, isRead: true } : n,
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    });
  },
}));
