// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: backend/src/utils/riskEngine.js
function mapSeverity(score) {
  if (score >= 120) return "CRITICAL";
  if (score >= 80) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function computeRisk({ rain1h, rain3h, windMs, tempC, alerts = [] }) {
  let score = 0;
  const reasons = [];

  // ===== COMPONENT 1: Risk Rule Table =====
  if ((rain1h >= 25) || (rain3h >= 50)) {
    score += 70;
    reasons.push("Heavy precipitation: rain_1h >= 25mm OR rain_3h >= 50mm (+70)");
  } else if ((rain1h >= 10) || (rain3h >= 20)) {
    score += 40;
    reasons.push("Strong precipitation: rain_1h >= 10mm OR rain_3h >= 20mm (+40)");
  }

  if (windMs >= 18) {
    score += 70;
    reasons.push("Very high wind speed >= 18 m/s (+70)");
  } else if (windMs >= 12) {
    score += 40;
    reasons.push("High wind speed >= 12 m/s (+40)");
  }

  if (tempC >= 38 || tempC <= 15) {
    score += 40;
    reasons.push("Severe temperature extreme >= 38C OR <= 15C (+40)");
  } else if (tempC >= 35 || tempC <= 18) {
    score += 25;
    reasons.push("Temperature extreme >= 35C OR <= 18C (+25)");
  }

  if (alerts.length > 0) {
    score += 80;
    reasons.push("Official OpenWeather alerts present (+80)");
  }

  return {
    riskScore: score,
    severity: mapSeverity(score),
    reasons,
  };
}

module.exports = { computeRisk, mapSeverity };