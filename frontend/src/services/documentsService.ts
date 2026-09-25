import { apiClient } from '@/api/client';
import { DocumentSchema } from '@/api/schemas/sources.schema';
import { Document } from '@/types/source';

export interface UploadedDocumentItem {
  id: string;
  title: string;
  originalFilename?: string;
  documentType: string;
  status: string;
  fileSize?: number;
  createdAt?: string;
  errorMessage?: string;
  previewUrl?: string;
  downloadUrl?: string;
}

export const documentsService = {
  async getById(id: string): Promise<Document> {
    const response = await apiClient.get(`/documents/${id}`);
    return DocumentSchema.parse(response) as Document;
  },

  async list(params?: { type?: string; status?: string }): Promise<UploadedDocumentItem[]> {
    let query = '';
    if (params) {
      const q = new URLSearchParams();
      if (params.type) q.append('type', params.type);
      if (params.status) q.append('status', params.status);
      query = `?${q.toString()}`;
    }
    return await apiClient.get<UploadedDocumentItem[]>(`/documents${query}`);
  },

  async upload(
    file: File,
    meta?: { title?: string; documentType?: string }
  ): Promise<UploadedDocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (meta?.title) {
      formData.append('title', meta.title);
    }
    if (meta?.documentType) {
      formData.append('document_type', meta.documentType);
    }
    return await apiClient.postForm<UploadedDocumentItem>('/documents/upload', formData);
  },

  async download(id: string, fallbackFilename?: string): Promise<void> {
    const name = fallbackFilename || `BIS_Document_${id}.pdf`;
    await apiClient.downloadFile(`/documents/${id}/download`, name);
  },

  async preview(id: string): Promise<UploadedDocumentItem> {
    return await apiClient.get<UploadedDocumentItem>(`/documents/${id}/preview`);
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete<{ success: boolean; message: string }>(`/documents/${id}`);
  }
};
