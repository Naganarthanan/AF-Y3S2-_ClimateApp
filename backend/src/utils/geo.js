// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: backend/src/utils/geo.js
function toRad(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function nearestRegion(lat, lng, regions) {
  let nearest = null;
  let minDistance = Number.POSITIVE_INFINITY;

  regions.forEach((region) => {
    const distance = distanceKm(lat, lng, region.lat, region.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = region;
    }
  });

  return { nearest, distanceKm: minDistance };
}

function insideCircle(lat, lng, centerLat, centerLng, radiusKm) {
  return distanceKm(lat, lng, centerLat, centerLng) <= radiusKm;
}

module.exports = { distanceKm, nearestRegion, insideCircle };