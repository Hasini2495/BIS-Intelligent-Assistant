import { apiClient } from '@/api/client';
import { StandardsListResponseSchema, StandardSchema } from '@/api/schemas/standards.schema';
import { Standard, StandardReference } from '@/types/standard';
import { Paginated } from '@/types/common';
import { buildQueryString } from '@/lib/utils';

export const standardsService = {
  async list(params?: Record<string, unknown>): Promise<Paginated<StandardReference>> {
    const qs = params ? `?${buildQueryString(params)}` : '';
    const response = await apiClient.get(`/standards${qs}`);
    return StandardsListResponseSchema.parse(response) as unknown as Paginated<StandardReference>;
  },
  async getById(id: string): Promise<Standard> {
    const response = await apiClient.get(`/standards/${id}`);
    return StandardSchema.parse(response) as unknown as Standard;
  }
};
