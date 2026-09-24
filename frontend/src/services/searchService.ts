import { apiClient } from '@/api/client';

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  url?: string;
}

export const searchService = {
  async search(query: string, filters?: object): Promise<SearchResult[]> {
    const response = await apiClient.post<SearchResult[]>('/search', { query, filters });
    return response;
  }
};
