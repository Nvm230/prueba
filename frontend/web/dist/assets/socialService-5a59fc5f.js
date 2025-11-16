import { f as apiClient } from "./index-74821ec3.js";
const getMyProfile = (signal) => apiClient.get("/api/social/profile/me", { signal }).then((res) => res.data);
const searchUsers = (email, signal) => apiClient.get("/api/social/search", {
  params: { email },
  signal
}).then((res) => res.data);
const scanQr = (qrData, signal) => apiClient.post("/api/social/scan-qr", { qrData }, { signal }).then((res) => res.data);
const sendFriendRequest = (receiverId, signal) => apiClient.post("/api/friends/request", null, {
  params: { receiverId },
  signal
}).then((res) => res.data);
const getFriendRequests = (signal) => apiClient.get("/api/friends/requests", { signal }).then((res) => res.data);
const acceptFriendRequest = (requestId, signal) => apiClient.post(`/api/friends/requests/${requestId}/accept`, {}, { signal }).then((res) => res.data);
const rejectFriendRequest = (requestId, signal) => apiClient.post(`/api/friends/requests/${requestId}/reject`, {}, { signal }).then((res) => res.data);
const getFriends = (signal) => apiClient.get("/api/friends", { signal }).then((res) => res.data);
const getFriendRecommendations = (signal) => apiClient.get("/api/friends/recommendations", { signal }).then((res) => res.data);
const getConversations = (signal) => apiClient.get("/api/private-messages/conversations", { signal }).then((res) => res.data);
const getConversation = (otherUserId, filters, signal) => apiClient.get(`/api/private-messages/conversation/${otherUserId}`, {
  params: filters,
  signal
}).then((res) => res.data);
export {
  getFriends as a,
  getFriendRequests as b,
  getFriendRecommendations as c,
  sendFriendRequest as d,
  acceptFriendRequest as e,
  scanQr as f,
  getMyProfile as g,
  getConversation as h,
  getConversations as i,
  rejectFriendRequest as r,
  searchUsers as s
};
