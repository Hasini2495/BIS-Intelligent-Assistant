import { apiClient } from '@/api/client';

export interface BookmarkItem {
  id: string;
  itemId: string;
  itemType: 'standard' | 'lab' | 'scheme' | 'document';
  title: string;
  description?: string;
  link?: string;
  referenceNumber?: string;
  createdAt: string;
}

export const bookmarksService = {
  async getBookmarks(): Promise<BookmarkItem[]> {
    return await apiClient.get<BookmarkItem[]>('/bookmarks');
  },

  async addBookmark(data: {
    itemId: string;
    itemType: string;
    title: string;
    description?: string;
    link?: string;
    referenceNumber?: string;
  }): Promise<BookmarkItem> {
    return await apiClient.post<BookmarkItem>('/bookmarks', data);
  },

  async removeBookmark(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete<{ success: boolean; message: string }>(`/bookmarks/${id}`);
  }
};
