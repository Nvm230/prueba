import { f as apiClient } from "./index-74821ec3.js";
const fetchUsers = (filters, signal) => apiClient.get("/api/users", {
  params: filters,
  signal
}).then((res) => res.data);
const updateUserRole = (userId, role, signal) => apiClient.post(`/api/users/${userId}/role`, null, {
  params: { role },
  signal
}).then((res) => res.data);
export {
  fetchUsers as f,
  updateUserRole as u
};
