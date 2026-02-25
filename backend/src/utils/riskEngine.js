
function mapSeverity(score) {
  if (score >= 120) return "CRITICAL";
  if (score >= 80) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

const RISK_THRESHOLDS = {
  LOW: "0-39",
  MEDIUM: "40-79",
  HIGH: "80-119",
  CRITICAL: "120+",
};

function computeRisk({ rain1h, rain3h, windMs, tempC, humidity = 0, condition = "Unknown", alerts = [] }) {
  let score = 0;
  const reasons = [];
  const matchedRules = [];

  // ===== COMPONENT 1: Risk Rule Table =====
  if ((rain1h >= 25) || (rain3h >= 50)) {
    score += 70;
    reasons.push("Heavy precipitation: rain_1h >= 25mm OR rain_3h >= 50mm (+70)");
    matchedRules.push({
      id: "flood_rain_heavy",
      condition: "rain_1h >= 25 OR rain_3h >= 50",
      actual: { rain1h, rain3h },
      weight: 70,
    });
  } else if ((rain1h >= 10) || (rain3h >= 20)) {
    score += 40;
    reasons.push("Strong precipitation: rain_1h >= 10mm OR rain_3h >= 20mm (+40)");
    matchedRules.push({
      id: "flood_rain_strong",
      condition: "rain_1h >= 10 OR rain_3h >= 20",
      actual: { rain1h, rain3h },
      weight: 40,
    });
  }

  if (windMs >= 18) {
    score += 70;
    reasons.push("Very high wind speed >= 18 m/s (+70)");
    matchedRules.push({
      id: "wind_very_high",
      condition: "wind_ms >= 18",
      actual: { windMs },
      weight: 70,
    });
  } else if (windMs >= 12) {
    score += 40;
    reasons.push("High wind speed >= 12 m/s (+40)");
    matchedRules.push({
      id: "wind_high",
      condition: "wind_ms >= 12",
      actual: { windMs },
      weight: 40,
    });
  }

  if (tempC >= 38 || tempC <= 15) {
    score += 40;
    reasons.push("Severe temperature extreme >= 38C OR <= 15C (+40)");
    matchedRules.push({
      id: "temp_extreme_severe",
      condition: "temp_c >= 38 OR temp_c <= 15",
      actual: { tempC },
      weight: 40,
    });
  } else if (tempC >= 35 || tempC <= 18) {
    score += 25;
    reasons.push("Temperature extreme >= 35C OR <= 18C (+25)");
    matchedRules.push({
      id: "temp_extreme_moderate",
      condition: "temp_c >= 35 OR temp_c <= 18",
      actual: { tempC },
      weight: 25,
    });
  }

  if (alerts.length > 0) {
    score += 80;
    reasons.push("Official OpenWeather alerts present (+80)");
    matchedRules.push({
      id: "official_alert_present",
      condition: "alerts.length > 0",
      actual: { alertsCount: alerts.length },
      weight: 80,
    });
  }

  return {
    riskScore: score,
    severity: mapSeverity(score),
    reasons,
    explain: {
      version: "risk-rules-v1",
      inputs: { rain1h, rain3h, windMs, tempC, humidity, condition, alertsCount: alerts.length },
      matchedRules,
      thresholds: RISK_THRESHOLDS,
      totalFromRules: score,
    },
  };
}

module.exports = { computeRisk, mapSeverity, RISK_THRESHOLDS };
