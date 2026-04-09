// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/api/endpoints.js
import api from "./client";

export const endpoints = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  verifyResetOtp: (payload) => api.post("/auth/verify-reset-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  me: () => api.get("/me"),
  regions: () => api.get("/regions"),
  riskByRegion: (regionId) => api.get(`/risk/region/${regionId}`),
  currentRisk: (lat, lng) => api.get(`/risk/current?lat=${lat}&lng=${lng}`),
  weatherHistory: (regionId, days = 7) => api.get(`/weather/history?regionId=${regionId}&days=${days}`),
  alerts: (params = "") => api.get(`/alerts${params}`),
  manualAlert: (payload) => api.post("/alerts/manual", payload),
  updateAlert: (id, payload) => api.put(`/alerts/${id}`, payload),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  shelters: (query = "") => api.get(`/shelters${query}`),
  nearbyShelters: (lat, lng, radiusKm = 50) => api.get(`/shelters/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),
  shelterById: (id) => api.get(`/shelters/${id}`),
  createShelter: (payload) => api.post("/shelters", payload),
  updateShelter: (id, payload) => api.put(`/shelters/${id}`, payload),
  updateShelterStatus: (id, isActive) => api.patch(`/shelters/${id}/status`, { isActive }),
  deleteShelter: (id) => api.delete(`/shelters/${id}`),
  zonesAll: (query = "") => api.get(`/zones${query}`),
  zones: (query = "") => api.get(`/zones/active${query}`),
  createZone: (payload) => api.post("/zones", payload),
  deleteZone: (id) => api.delete(`/zones/${id}`),
  safeRoutes: (fromLat, fromLng, disasterType) =>
    api.get(`/routes/safe?fromLat=${fromLat}&fromLng=${fromLng}&disasterType=${disasterType}`),
  resources: (shelterId) => api.get(`/resources?shelterId=${shelterId}`),
  upsertResource: (payload) => api.post("/resources", payload),
  updateResource: (id, payload) => api.put(`/resources/${id}`, payload),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  lowStock: (threshold = 20) => api.get(`/resources/low-stock?threshold=${threshold}`),
  education: () => api.get("/education"),
  educationYouTube: (q = "", disasterType = "", limit = 10) =>
    api.get(
      `/education/external/youtube?q=${encodeURIComponent(q)}&disasterType=${encodeURIComponent(disasterType)}&limit=${limit}`
    ),
  educationById: (id) => api.get(`/education/${id}`),
  createEducation: (payload) => api.post("/education", payload),
  updateEducation: (id, payload) => api.put(`/education/${id}`, payload),
  deleteEducation: (id) => api.delete(`/education/${id}`),
  quiz: (disasterType = "") => api.get(`/quiz${disasterType ? `?disasterType=${disasterType}` : ""}`),
  submitQuiz: (payload) => api.post("/quiz/submit", payload),
  prepPlan: () => api.get("/prep-plan"),
  updatePrepPlan: (payload) => api.put("/prep-plan", payload),
  activity: (payload) => api.post("/activity", payload),
  analytics: () => api.get("/analytics/summary"),
};
