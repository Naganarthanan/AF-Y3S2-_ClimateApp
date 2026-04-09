// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: frontend/src/utils/geo.js
export function findNearestRegion(lat, lng, regions) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dist = (aLat, aLng, bLat, bLng) => {
    const r = 6371;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return r * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  let nearest = null;
  let min = Number.POSITIVE_INFINITY;

  regions.forEach((region) => {
    const d = dist(lat, lng, region.lat, region.lng);
    if (d < min) {
      min = d;
      nearest = region;
    }
  });

  return { nearest, distanceKm: min };
}