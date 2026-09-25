import { apiClient } from '@/api/client';

export interface AdminMetrics {
  totalUsers: number;
  totalDocuments: number;
  ingestionQueue: number;
  failedDocuments: number;
  indexedDocuments: number;
  openFeedback: number;
  totalQueries: number;
  uniqueUsers: number;
  unresolvedQueries: number;
  documentIndexedPercentage: number;
  userGrowthRate: number;
}

export interface DailyMetricPoint {
  date: string;
  queries: number;
  users: number;
  unresolved: number;
}

export interface TopQueryItem {
  query: string;
  count: number;
  standardNumber?: string;
}

export interface AdminAnalytics {
  timeRange: string;
  totalQueries: number;
  uniqueUsers: number;
  unresolvedQueries: number;
  queryGrowthRate: number;
  retrievalAccuracyPercentage: number;
  averageLatencyMs: number;
  dailyMetrics: DailyMetricPoint[];
  topQueries: TopQueryItem[];
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  type: string;
  status: 'indexed' | 'processing' | 'failed';
  version?: string;
  size?: string;
  uploadedOn?: string;
}

export const adminService = {
  async getMetrics(): Promise<AdminMetrics> {
    return await apiClient.get<AdminMetrics>('/admin/metrics');
  },

  async getAnalytics(range: string = '30d'): Promise<AdminAnalytics> {
    return await apiClient.get<AdminAnalytics>(`/admin/analytics?range=${range}`);
  },

  async listKnowledgeBase(): Promise<KnowledgeBaseItem[]> {
    return await apiClient.get<KnowledgeBaseItem[]>('/admin/knowledge-base');
  },

  async uploadKnowledgeBase(
    file: File,
    title: string,
    type: string = 'Document'
  ): Promise<KnowledgeBaseItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', type);
    return await apiClient.postForm<KnowledgeBaseItem>('/admin/knowledge-base/upload', formData);
  },

  async reindexKnowledgeBase(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post<{ success: boolean; message: string }>(`/admin/knowledge-base/${id}/reindex`);
  },

  async deleteKnowledgeBase(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete<{ success: boolean; message: string }>(`/admin/knowledge-base/${id}`);
  }
};
