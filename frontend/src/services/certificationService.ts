import { apiClient } from '@/api/client';
import { CertificationSchemeSchema } from '@/api/schemas/certification.schema';
import { CertificationScheme } from '@/types/certification';
import { z } from 'zod';

export const certificationService = {
  async listSchemes(): Promise<CertificationScheme[]> {
    const response = await apiClient.get('/certification/schemes');
    return z.array(CertificationSchemeSchema).parse(response) as CertificationScheme[];
  },
  async getSchemeById(id: string): Promise<CertificationScheme> {
    const response = await apiClient.get(`/certification/schemes/${id}`);
    return CertificationSchemeSchema.parse(response) as CertificationScheme;
  }
};
