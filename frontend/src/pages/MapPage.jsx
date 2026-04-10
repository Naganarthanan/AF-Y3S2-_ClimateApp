// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: frontend/src/pages/MapPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import { 
  MapPin, 
  Navigation, 
  Home, 
  Route, 
  Target, 
  AlertTriangle,
  Star,
  TrendingUp,
  Users,
  ExternalLink,
  Compass,
  Shield,
  Building,
  Car,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";

function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new Error("VITE_GOOGLE_MAPS_API_KEY is missing"));
      return;
    }

    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google.maps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
}

export default function MapPage() {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [lat, setLat] = useState(6.9271);
  const [lng, setLng] = useState(79.8612);
  const [shelters, setShelters] = useState([]);
  const [safeRoutes, setSafeRoutes] = useState([]);
  const [geoMessage, setGeoMessage] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [mapMessage, setMapMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  const drawMap = useCallback(() => {
    if (!window.google?.maps || !mapContainerRef.current) return;

    const center = { lat: Number(lat), lng: Number(lng) };
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
    } else {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(13);
    }

    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    // User location marker
    const userMarker = new window.google.maps.Marker({
      map: mapRef.current,
      position: center,
      title: "Your Location",
      label: {
        text: "You",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold"
      },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#10b981",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
    markerRefs.current.push(userMarker);

    // Add info window for user location
    const userInfoWindow = new window.google.maps.InfoWindow({
      content: '<div style="padding: 8px; font-size: 12px; font-weight: bold;">📍 Your Current Location</div>'
    });
    userMarker.addListener("click", () => {
      userInfoWindow.open(mapRef.current, userMarker);
    });

    // Shelter markers
    const allMarkers = safeRoutes.length ? safeRoutes : shelters.slice(0, 15);
    allMarkers.forEach((item) => {
      const isRecommended = item.recommended || item.suitability === "BEST";
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: { lat: Number(item.lat), lng: Number(item.lng) },
        title: item.name,
        icon: isRecommended
          ? {
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            }
          : {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            },
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 200px;">
            <strong style="font-size: 14px; color: #1f2937;">${item.name}</strong>
            <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">
              ${item.distanceKm ? `${item.distanceKm.toFixed(1)} km away` : ''}
              ${isRecommended ? '<br/><span style="color: #10b981;">✓ Recommended Route</span>' : ''}
            </p>
          </div>
        `
      });
      
      marker.addListener("click", () => {
        infoWindow.open(mapRef.current, marker);
      });
      
      markerRefs.current.push(marker);
    });
  }, [lat, lng, safeRoutes, shelters]);

  useEffect(() => {
    loadGoogleMapsApi(mapsApiKey)
      .then(() => {
        setMapMessage("");
        drawMap();
      })
      .catch((error) => {
        setMapMessage(error.message || "Google Maps failed to load.");
      });
  }, [mapsApiKey, drawMap]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoMessage("Geolocation is not supported on this browser.");
      return;
    }

    setGeoLoading(true);
    setGeoMessage("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGeoMessage("Current location detected successfully!");
        setTimeout(() => setGeoMessage(""), 3000);
        setGeoLoading(false);
      },
      (error) => {
        if (error.code === 1) setGeoMessage("Permission denied. Allow location access in browser settings.");
        else if (error.code === 2) setGeoMessage("Location unavailable. Check your device location settings.");
        else if (error.code === 3) setGeoMessage("Location request timed out. Try again.");
        else setGeoMessage("Unable to detect your current location.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const load = async () => {
    setIsLoading(true);
    setGeoMessage("");
    try {
      const [nearbyRes, safeRes] = await Promise.all([
        endpoints.nearbyShelters(lat, lng, 100),
        endpoints.safeRoutes(lat, lng, "Flood"),
      ]);
      setShelters(nearbyRes.data.data);
      setSafeRoutes(safeRes.data.data);
      setGeoMessage(`Found ${nearbyRes.data.data.length} shelters and ${safeRes.data.data.length} route suggestions!`);
      setTimeout(() => setGeoMessage(""), 3000);
    } catch (error) {
      setGeoMessage("Unable to load shelter routes for the selected coordinates.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSuitabilityColor = (suitability) => {
    switch(suitability) {
      case 'BEST': return 'text-green-600 bg-green-50 border-green-200';
      case 'GOOD': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'AVOID': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSuitabilityIcon = (suitability) => {
    switch(suitability) {
      case 'BEST': return <CheckCircle className="w-4 h-4" />;
      case 'GOOD': return <Star className="w-4 h-4" />;
      case 'AVOID': return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Safe Navigation
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Live Tracking
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Locate shelters and compare safer route recommendations
              </h1>
              <p className="text-gray-600">
                Use live coordinates or geolocation to center the map, surface nearby shelters, 
                and identify the most suitable destinations.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input 
                    className="py-2 pr-3 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none pl-9 w-28 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    value={lat} 
                    onChange={(e) => setLat(Number(e.target.value))} 
                  />
                </div>
                <div className="relative">
                  <Target className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input 
                    className="py-2 pr-3 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none pl-9 w-28 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    value={lng} 
                    onChange={(e) => setLng(Number(e.target.value))} 
                  />
                </div>
              </div>
              
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                onClick={locate} 
                disabled={geoLoading}
              >
                <Compass className="w-4 h-4" />
                {geoLoading ? "Detecting..." : "Use Geolocation"}
              </button>
              
              <button 
                className="flex items-center gap-2 px-4 py-2 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600"
                onClick={load}
                disabled={isLoading}
              >
                <Navigation className="w-4 h-4" />
                {isLoading ? "Loading..." : "Find Shelters"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Nearby Shelters</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{shelters.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100">
                <Building className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Route Suggestions</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{safeRoutes.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Route className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Best Routes</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {safeRoutes.filter(r => r.suitability === 'BEST').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Avg Occupancy</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {safeRoutes.length ? Math.round(safeRoutes.reduce((acc, r) => acc + (r.occupancyRate || 0), 0) / safeRoutes.length * 100) : 0}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Geo Message Toast */}
        {geoMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
            geoMessage.includes('success') || geoMessage.includes('Found') 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
          }`}>
            {geoMessage.includes('success') || geoMessage.includes('Found') ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {geoMessage}
          </div>
        )}

        {/* Map Section */}
        <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">Interactive Map</h2>
            </div>
          </div>
          <div className="p-6">
            {mapMessage && (
              <div className="flex items-center gap-2 p-3 mb-4 text-sm text-yellow-700 border border-yellow-200 bg-yellow-50 rounded-xl">
                <AlertTriangle className="w-4 h-4" />
                {mapMessage}
              </div>
            )}
            <div 
              ref={mapContainerRef} 
              className="h-[500px] w-full rounded-xl border border-gray-200 overflow-hidden shadow-inner"
            />
            <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Recommended Route/Shelter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Alternative Route/Shelter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shelters and Routes Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Nearby Shelters */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-gray-900">Nearby Shelters</h2>
              </div>
            </div>
            <div className="p-6">
              {shelters.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {shelters.map((shelter, idx) => (
                    <div key={shelter._id} className="p-4 transition-all border border-gray-100 bg-gray-50 rounded-xl hover:border-emerald-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link 
                            to={`/shelters/${shelter._id}`}
                            className="font-semibold text-gray-900 transition-colors hover:text-emerald-600"
                          >
                            {shelter.name}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {shelter.distanceKm?.toFixed(1)} km away
                            </span>
                            {shelter.capacity && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Capacity: {shelter.capacity}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {shelter.recommended && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 bg-green-100 rounded-lg">
                              <Star className="w-3 h-3" />
                              Recommended
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Search for shelters to populate this list.</p>
                  <p className="mt-1 text-sm">Click "Find Shelters" to discover nearby locations</p>
                </div>
              )}
            </div>
          </div>

          {/* Safe Route Recommendations */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Safe Route Recommendations</h2>
              </div>
            </div>
            <div className="p-6">
              {safeRoutes.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {safeRoutes.map((route) => (
                    <div 
                      key={route._id} 
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedRoute === route._id 
                          ? 'border-emerald-300 bg-emerald-50' 
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                      onClick={() => setSelectedRoute(selectedRoute === route._id ? null : route._id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{route.name}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${getSuitabilityColor(route.suitability)}`}>
                              {getSuitabilityIcon(route.suitability)}
                              {route.suitability}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Distance</p>
                              <p className="font-semibold text-gray-900">{route.distanceKm.toFixed(1)} km</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Risk Score</p>
                              <p className="font-semibold text-gray-900">{route.routeRiskScore?.toFixed(1)}/10</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Occupancy</p>
                              <p className="font-semibold text-gray-900">{Math.round((route.occupancyRate || 0) * 100)}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Est. Time</p>
                              <p className="font-semibold text-gray-900">
                                {Math.round(route.distanceKm / 5 * 60)} min
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedRoute === route._id && (
                        <div className="pt-4 mt-4 border-t border-gray-200">
                          <a 
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600"
                            href={route.navigationUrl} 
                            target="_blank" 
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open in Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <Route className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Recommended routes will appear after you load shelters.</p>
                  <p className="mt-1 text-sm">Click "Find Shelters" to get route suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend Footer */}
        <div className="p-4 mt-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Route Suitability:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Best - Optimal route</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Good - Acceptable route</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-600">Avoid - High risk route</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}