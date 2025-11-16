import { f as apiClient } from "./index-74821ec3.js";
const fetchSurveys = (filters = {}, signal) => apiClient.get("/api/surveys", {
  params: filters,
  signal
}).then((res) => res.data);
const createSurvey = (payload, signal) => {
  const formData = new URLSearchParams();
  formData.append("eventId", payload.eventId.toString());
  formData.append("title", payload.title);
  payload.questions.forEach((question) => {
    formData.append("questions", question);
  });
  return apiClient.post("/api/surveys", formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    signal
  }).then((res) => res.data);
};
const answerSurveyQuestion = (questionId, payload, signal) => apiClient.post(`/api/surveys/${questionId}/answer`, null, {
  params: payload,
  signal
}).then((res) => res.data);
const fetchSurveyAnswers = (surveyId, signal) => apiClient.get(`/api/surveys/${surveyId}/answers`, { signal }).then((res) => res.data);
const closeSurvey = (surveyId, signal) => apiClient.post(`/api/surveys/${surveyId}/close`, {}, { signal }).then((res) => res.data);
export {
  answerSurveyQuestion as a,
  fetchSurveys as b,
  createSurvey as c,
  closeSurvey as d,
  fetchSurveyAnswers as f
};
