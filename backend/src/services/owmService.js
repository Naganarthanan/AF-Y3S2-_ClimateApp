// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/services/owmService.js
const axios = require("axios");
const env = require("../config/env");

const weatherClient = axios.create({ baseURL: "https://api.openweathermap.org" });

async function fetchRegionWeather(region) {
  if (!env.OPENWEATHER_API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not configured");
  }

  const weatherResponse = await weatherClient.get("/data/2.5/weather", {
    params: {
      lat: region.lat,
      lon: region.lng,
      appid: env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });

  let alerts = [];
  try {
    const oneCallResponse = await weatherClient.get("/data/3.0/onecall", {
      params: {
        lat: region.lat,
        lon: region.lng,
        appid: env.OPENWEATHER_API_KEY,
        units: "metric",
        exclude: "minutely,hourly,daily",
      },
    });
    alerts = oneCallResponse.data.alerts || [];
  } catch (error) {
    alerts = [];
  }

  const raw = weatherResponse.data;
  return {
    raw: {
      main: raw.main,
      weather: raw.weather,
      wind: raw.wind,
      rain: raw.rain,
      dt: raw.dt,
      timezone: raw.timezone,
      alerts,
    },
    tempC: raw.main?.temp || 0,
    windMs: raw.wind?.speed || 0,
    rain1h: raw.rain?.["1h"] || 0,
    rain3h: raw.rain?.["3h"] || 0,
    humidity: raw.main?.humidity || 0,
    condition: raw.weather?.[0]?.main || "Unknown",
    alerts,
  };
}

module.exports = { fetchRegionWeather };