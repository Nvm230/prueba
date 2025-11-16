import { f as apiClient } from "./index-74821ec3.js";
const fetchNotifications = (userId, filters, signal) => apiClient.get(`/api/notifications/${userId}`, {
  params: filters,
  signal
}).then((res) => res.data);
const sendNotification = (userId, payload, signal) => apiClient.post(`/api/notifications/${userId}`, null, {
  params: {
    ...payload,
    sendEmail: payload.sendEmail ?? false
  },
  signal
}).then((res) => res.data);
export {
  fetchNotifications as f,
  sendNotification as s
};
