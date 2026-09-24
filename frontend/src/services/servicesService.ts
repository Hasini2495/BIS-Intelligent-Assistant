import { apiClient } from '@/api/client';
import { ServicesListResponseSchema, BISServiceSchema } from '@/api/schemas/services.schema';
import { BISService } from '@/types/service';
import { Paginated } from '@/types/common';

export const servicesService = {
  async list(): Promise<Paginated<BISService>> {
    const response = await apiClient.get('/services');
    return ServicesListResponseSchema.parse(response) as unknown as Paginated<BISService>;
  },
  async getById(id: string): Promise<BISService> {
    const response = await apiClient.get(`/services/${id}`);
    return BISServiceSchema.parse(response) as BISService;
  }
};
