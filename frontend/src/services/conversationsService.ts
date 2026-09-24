import { apiClient } from '@/api/client';
import { ConversationsListResponseSchema, ConversationSchema } from '@/api/schemas/conversations.schema';
import { Conversation } from '@/types/conversation';
import { Paginated } from '@/types/common';

export const conversationsService = {
  async list(): Promise<Paginated<Conversation>> {
    const response = await apiClient.get('/conversations');
    return ConversationsListResponseSchema.parse(response) as unknown as Paginated<Conversation>;
  },
  async getById(id: string): Promise<Conversation> {
    const response = await apiClient.get(`/conversations/${id}`);
    return ConversationSchema.parse(response) as Conversation;
  },
  async create(title: string): Promise<Conversation> {
    const response = await apiClient.post('/conversations', { title });
    return ConversationSchema.parse(response) as Conversation;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}`);
  },
  async rename(id: string, title: string): Promise<Conversation> {
    const response = await apiClient.put(`/conversations/${id}`, { title });
    return ConversationSchema.parse(response) as Conversation;
  }
};
