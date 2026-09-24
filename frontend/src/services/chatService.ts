import { apiClient } from '@/api/client';
import { ChatRequestSchema, ChatResponseSchema } from '@/api/schemas/chat.schema';
import { ChatRequest, ChatResponse } from '@/types/chat';

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const validatedRequest = ChatRequestSchema.parse(request);
    const response = await apiClient.post('/chat', validatedRequest);
    return ChatResponseSchema.parse(response) as ChatResponse;
  }
};
