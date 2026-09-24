import { apiClient } from '@/api/client';
import { DocumentSchema } from '@/api/schemas/sources.schema';
import { Document } from '@/types/source';

export const documentsService = {
  async getById(id: string): Promise<Document> {
    const response = await apiClient.get(`/documents/${id}`);
    return DocumentSchema.parse(response) as Document;
  }
};
