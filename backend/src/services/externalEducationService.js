// COMPONENT 4: User + Education + Analytics
// File: backend/src/services/externalEducationService.js
const axios = require("axios");
const env = require("../config/env");

const youtubeClient = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  timeout: 10000,
});

function normalizeLimit(limit, fallback = 10, max = 25) {
  const parsed = Number(limit);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function getAxiosMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;
  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }
  if (typeof responseData?.error === "string" && responseData.error.trim()) {
    return responseData.error;
  }
  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }
  return fallbackMessage;
}

async function fetchYouTubeEducation(options = {}) {
  if (!env.YOUTUBE_API_KEY) {
    const error = new Error("YOUTUBE_API_KEY is not configured");
    error.statusCode = 400;
    throw error;
  }

  const q = String(options.q || "").trim();
  const disasterType = String(options.disasterType || "").trim();
  const limit = normalizeLimit(options.limit, 10, 25);
  const query = [q, disasterType, "preparedness", "safety"].filter(Boolean).join(" ").trim();

  let response;
  try {
    response = await youtubeClient.get("/search", {
      params: {
        key: env.YOUTUBE_API_KEY,
        part: "snippet",
        q: query || "disaster preparedness climate safety",
        type: "video",
        maxResults: limit,
        safeSearch: "strict",
        order: "date",
      },
    });
  } catch (error) {
    const message = getAxiosMessage(error, "YouTube request failed. Check YOUTUBE_API_KEY and API restrictions.");
    const wrapped = new Error(message);
    wrapped.statusCode = error?.response?.status || 502;
    throw wrapped;
  }

  const items = response.data?.items || [];
  return items.map((item) => ({
    id: item.id?.videoId || "",
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    url: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : "",
    thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
    channelTitle: item.snippet?.channelTitle || "",
    publishedAt: item.snippet?.publishedAt || null,
    provider: "YouTube",
  }));
}

module.exports = { fetchYouTubeEducation };
