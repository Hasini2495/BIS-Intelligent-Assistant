import { apiClient } from '@/api/client';

export const healthService = {
  async check(): Promise<{ status: string, version: string }> {
    return await apiClient.get('/health');
  }
};
