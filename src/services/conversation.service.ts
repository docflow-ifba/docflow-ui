import { ConversationDTO } from '@/dtos/conversation.entity';
import { api } from '.';

export const ask = async (noticeId: string, question: string) => {
  return api.post(`v1/conversations/ask/${noticeId}`, null, {
    params: { question },
  });
};

export const findConversations = async (noticeId?: string): Promise<ConversationDTO[]> => {
  try {
    const response = await api.get(`/v1/conversations`, {
      params: { noticeId },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    throw error;
  }
};

export const createConversation = async (body: { noticeId: string }): Promise<ConversationDTO> => {
  try {
    const response = await api.post(`/v1/conversations`, {
      noticeId: body.noticeId,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    throw error;
  }
};

export const clearConversations = async (noticeId: string): Promise<void> => {
  try {
    await api.delete(`/v1/conversations/clear/${noticeId}`);
  } catch (error) {
    console.error('Erro ao limpar conversas:', error);
    throw error;
  }
};
