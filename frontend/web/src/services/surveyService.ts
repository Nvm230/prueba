import apiClient from './apiClient';
import { Survey, PaginatedResponse } from '@/types';

export const fetchSurveys = (
  filters: { eventId?: number; page?: number; size?: number } = {},
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<Survey>>('/api/surveys', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const fetchSurvey = (surveyId: number, signal?: AbortSignal) =>
  apiClient.get<Survey>(`/api/surveys/${surveyId}`, { signal }).then((res) => res.data);

export const createSurvey = (
  payload: { eventId: number; title: string; questions: string[] },
  signal?: AbortSignal
) => {
  const formData = new URLSearchParams();
  formData.append('eventId', payload.eventId.toString());
  formData.append('title', payload.title);
  payload.questions.forEach((question) => {
    formData.append('questions', question);
  });
  
  return apiClient
    .post('/api/surveys', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      signal
    })
    .then((res) => res.data as { surveyId: number; questionIds: number[] });
};

export const answerSurveyQuestion = (
  questionId: number,
  payload: { answer: string },
  signal?: AbortSignal
) =>
  apiClient
    .post(`/api/surveys/${questionId}/answer`, null, {
      params: payload,
      signal
    })
    .then((res) => res.data as { id: number; questionId: number; respondentId: number; answer: string });

export const fetchSurveyAnswers = (surveyId: number, signal?: AbortSignal) =>
  apiClient
    .get(`/api/surveys/${surveyId}/answers`, { signal })
    .then((res) => res.data);

export const closeSurvey = (surveyId: number, signal?: AbortSignal) =>
  apiClient
    .post(`/api/surveys/${surveyId}/close`, {}, { signal })
    .then((res) => res.data as { surveyId: number; closed: boolean });
