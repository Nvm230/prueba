import apiClient from './apiClient';
import { Survey } from '@/types';

export const fetchSurveys = (filters: { eventId?: number } = {}, signal?: AbortSignal) =>
  apiClient
    .get<Survey[]>('/api/surveys', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const fetchSurvey = (surveyId: number, signal?: AbortSignal) =>
  apiClient.get<Survey>(`/api/surveys/${surveyId}`, { signal }).then((res) => res.data);

export const createSurvey = (
  payload: { eventId: number; title: string; questions: string[] },
  signal?: AbortSignal
) =>
  apiClient
    .post('/api/surveys', null, {
      params: payload,
      signal
    })
    .then((res) => res.data as { surveyId: number; questionIds: number[] });

export const answerSurveyQuestion = (
  questionId: number,
  payload: { userId: number; answer: string },
  signal?: AbortSignal
) =>
  apiClient
    .post(`/api/surveys/${questionId}/answer`, null, {
      params: payload,
      signal
    })
    .then((res) => res.data as { id: number; questionId: number; respondentId: number; answer: string });
