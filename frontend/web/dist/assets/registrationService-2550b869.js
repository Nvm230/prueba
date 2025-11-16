import { f as apiClient } from "./index-74821ec3.js";
const registerForEvent = (eventId, signal) => apiClient.post(`/api/registrations/${eventId}`, null, { signal }).then((res) => res.data);
export {
  registerForEvent as r
};
