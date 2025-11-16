import { f as apiClient } from "./index-74821ec3.js";
const fetchGroups = (filters, signal) => apiClient.get("/api/groups", {
  params: filters,
  signal
}).then((res) => res.data);
const fetchGroupDetail = (groupId, signal) => apiClient.get(`/api/groups/${groupId}`, { signal }).then((res) => res.data);
const createGroup = (payload, signal) => apiClient.post("/api/groups", null, {
  params: { name: payload.name },
  signal
}).then((res) => res.data);
const joinGroup = (groupId, payload, signal) => apiClient.post(`/api/groups/${groupId}/join`, null, {
  params: payload,
  signal
}).then((res) => res.data);
const getGroupMessages = (groupId, filters, signal) => apiClient.get(`/api/groups/${groupId}/channel/messages`, {
  params: filters,
  signal
}).then((res) => res.data);
const createGroupAnnouncement = (groupId, payload, signal) => apiClient.post(`/api/groups/${groupId}/channel/announcements`, null, {
  params: payload,
  signal
}).then((res) => res.data);
const getGroupAnnouncements = (groupId, filters, signal) => apiClient.get(`/api/groups/${groupId}/channel/announcements`, {
  params: filters,
  signal
}).then((res) => res.data);
const createGroupEvent = (groupId, payload, signal) => apiClient.post(`/api/groups/${groupId}/channel/events/create`, payload, { signal }).then((res) => res.data);
const getGroupEvents = (groupId, signal) => apiClient.get(`/api/groups/${groupId}/channel/events`, { signal }).then((res) => res.data);
const shareSurveyToGroup = (groupId, surveyId, signal) => apiClient.post(`/api/groups/${groupId}/channel/surveys/${surveyId}/share`, {}, { signal }).then((res) => res.data);
const getGroupSurveys = (groupId, signal) => apiClient.get(`/api/groups/${groupId}/channel/surveys`, { signal }).then((res) => res.data);
const createGroupSurvey = (groupId, payload, signal) => apiClient.post(`/api/groups/${groupId}/channel/surveys/create`, null, {
  params: {
    title: payload.title,
    questions: payload.questions
  },
  signal
}).then((res) => res.data);
export {
  fetchGroupDetail as a,
  getGroupAnnouncements as b,
  createGroup as c,
  getGroupEvents as d,
  getGroupSurveys as e,
  fetchGroups as f,
  getGroupMessages as g,
  createGroupAnnouncement as h,
  createGroupEvent as i,
  joinGroup as j,
  createGroupSurvey as k,
  shareSurveyToGroup as s
};
