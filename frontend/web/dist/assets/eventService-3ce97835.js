import { f as apiClient } from "./index-74821ec3.js";
const fetchEvents = (filters, signal) => apiClient.get("/api/events", {
  params: filters,
  signal
}).then((res) => res.data);
const fetchEventDetail = (eventId, signal) => apiClient.get(`/api/events/${eventId}`, { signal }).then((res) => res.data);
const createEvent = (payload, signal) => apiClient.post("/api/events", payload, { signal }).then((res) => res.data);
const startEvent = (eventId, signal) => apiClient.post(`/api/events/${eventId}/start`, null, { signal }).then((res) => res.data);
const finishEvent = (eventId, signal) => apiClient.post(`/api/events/${eventId}/finish`, null, { signal }).then((res) => res.data);
export {
  fetchEventDetail as a,
  finishEvent as b,
  createEvent as c,
  fetchEvents as f,
  startEvent as s
};
