import { apiClient } from '@/api/client';
import { Language } from '@/types/language';

export const languagesService = {
  async list(): Promise<Language[]> {
    const response = await apiClient.get<Language[]>('/languages');
    return response;
  }
};
