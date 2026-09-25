import { apiClient } from '@/api/client';

export interface NotificationItem {
  id: string;
  category: 'system' | 'update' | 'security' | 'compliance';
  title: string;
  description: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    return await apiClient.get<NotificationItem[]>('/notifications');
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    return await apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return await apiClient.patch<{ success: boolean; message: string }>('/notifications/read-all');
  }
};
