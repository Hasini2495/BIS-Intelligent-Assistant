import { apiClient } from '@/api/client';
import { LaboratorySchema } from '@/api/schemas/testing.schema';
import { Laboratory } from '@/types/laboratory';
import { Paginated } from '@/types/common';
import { buildQueryString } from '@/lib/utils';

import { createPaginatedSchema } from '@/api/schemas/common.schema';

const LabsListSchema = createPaginatedSchema(LaboratorySchema);

export const labsService = {
  async list(params?: Record<string, any>): Promise<Paginated<Laboratory>> {
    const qs = params ? `?${buildQueryString(params)}` : '';
    const response = await apiClient.get(`/labs${qs}`);
    return LabsListSchema.parse(response) as unknown as Paginated<Laboratory>;
  },
  async getById(id: string): Promise<Laboratory> {
    const response = await apiClient.get(`/labs/${id}`);
    return LaboratorySchema.parse(response) as Laboratory;
  }
};
