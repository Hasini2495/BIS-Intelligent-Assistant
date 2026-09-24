import { apiClient } from '@/api/client';
import { SourceSchema } from '@/api/schemas/sources.schema';
import { Source } from '@/types/source';

export const sourcesService = {
  async getById(id: string): Promise<Source> {
    const response = await apiClient.get(`/sources/${id}`);
    return SourceSchema.parse(response) as Source;
  }
};
