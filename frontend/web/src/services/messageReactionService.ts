import apiClient from './apiClient';
import { MessageContextType } from '@/types/reaction';

export const toggleReaction = <T>(
  context: MessageContextType,
  messageId: number,
  emoji: string
): Promise<T> => {
  return apiClient
    .post<T>(`/api/messages/${context}/${messageId}/reactions`, { emoji })
    .then((res) => res.data);
};















