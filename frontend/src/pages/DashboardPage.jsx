// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { endpoints } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import { 
  Activity, 
  AlertTriangle, 
  Cloud, 
  CloudRain, 
  Droplets, 
  MapPin, 
  Thermometer, 
  Wind, 
  Bell,
  Shield,
  TrendingUp,
  Calendar,
  ChevronRight,
  Navigation,
  RefreshCw,
  Eye
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [risk, setRisk] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [geoMessage, setGeoMessage] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weatherInputs = risk?.explain?.inputs || {};
  const latestCondition = history.length ? history[history.length - 1]?.condition : null;
  const skyCondition = weatherInputs.condition || latestCondition || "-";
  const activeRegionName = regions.find((region) => region._id === selectedRegionId)?.name || "your region";

  useEffect(() => {
    endpoints.regions().then((res) => {
      setRegions(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (!regions.length) return;
    if (selectedRegionId && regions.some((r) => r._id === selectedRegionId)) return;

    const defaultRegionId = user?.defaultRegionId;
    const hasDefault = defaultRegionId && regions.some((r) => r._id === defaultRegionId);
    setSelectedRegionId(hasDefault ? defaultRegionId : regions[0]._id);
  }, [regions, user?.defaultRegionId, selectedRegionId]);

  useEffect(() => {
    if (!selectedRegionId) return;

    async function loadRegionData() {
      try {
        const riskRes = await endpoints.riskByRegion(selectedRegionId);
        setRisk(riskRes.data.data);
      } catch (error) {
        setRisk(null);
      }

      try {
        const regionAlertsRes = await endpoints.alerts(`?regionId=${selectedRegionId}`);
        let regionAlerts = regionAlertsRes.data.data.slice(0, 5);

        if (regionAlerts.length === 0) {
          const globalAlertsRes = await endpoints.alerts();
          regionAlerts = globalAlertsRes.data.data.slice(0, 5);
        }

        setAlerts(regionAlerts);
      } catch (error) {
        setAlerts([]);
      }

      try {
        const weatherRes = await endpoints.weatherHistory(selectedRegionId, 7);
        setHistory(weatherRes.data.data);
      } catch (error) {
        setHistory([]);
      }
    }

    loadRegionData();
  }, [selectedRegionId]);

  const detectByGeo = async () => {
    if (!navigator.geolocation) {
      setGeoMessage("Geolocation is not supported on this browser.");
      return;
    }

    setGeoLoading(true);
    setGeoMessage("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await endpoints.currentRisk(pos.coords.latitude, pos.coords.longitude);
          setSelectedRegionId(res.data.data.region._id);
          setGeoMessage(`Location detected: nearest region is ${res.data.data.region.name}.`);
          setTimeout(() => setGeoMessage(""), 3000);
        } catch (error) {
          setGeoMessage("Location detected, but risk lookup failed. Please try again.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        if (error.code === 1) {
          setGeoMessage("Location permission denied. Allow location access in browser settings.");
        } else if (error.code === 2) {
          setGeoMessage("Location unavailable. Check device location services.");
        } else if (error.code === 3) {
          setGeoMessage("Location request timed out. Try again.");
        } else {
          setGeoMessage("Unable to read location.");
        }
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const riskRes = await endpoints.riskByRegion(selectedRegionId);
      setRisk(riskRes.data.data);
      const regionAlertsRes = await endpoints.alerts(`?regionId=${selectedRegionId}`);
      setAlerts(regionAlertsRes.data.data.slice(0, 5));
      const weatherRes = await endpoints.weatherHistory(selectedRegionId, 7);
      setHistory(weatherRes.data.data);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRiskColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-green-600';
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
                  Citizen Dashboard
                </div>
                {user?.role && (
                  <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100 rounded-lg">
                    {user.role} access
                  </div>
                )}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Climate command view for {activeRegionName}
              </h1>
              <p className="text-gray-600">
                See the current district risk level, latest warnings, and the live weather drivers behind them in one clearer operational dashboard.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <select 
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-700 outline-none transition-all cursor-pointer"
                  value={selectedRegionId} 
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                >
                  {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
              </div>
              
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                onClick={detectByGeo} 
                disabled={geoLoading}
              >
                <Navigation className="w-4 h-4" />
                {geoLoading ? "Detecting..." : "Use Geolocation"}
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Geo Message Toast */}
        {geoMessage && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm border bg-emerald-50 border-emerald-200 rounded-xl text-emerald-700">
            <Navigation className="w-4 h-4" />
            {geoMessage}
          </div>
        )}

        {/* Risk Overview Cards */}
        {risk && (
          <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Risk Score Card */}
            <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{risk.riskScore}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
              <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-emerald-500 to-orange-500"
                  style={{ width: `${risk.riskScore}%` }}
                />
              </div>
            </div>

            {/* Severity Card */}
            <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${getRiskColor(risk.severity)}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(risk.severity)}`}>
                  {risk.severity || "Unknown"}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Severity Level</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900 capitalize">{risk.severity || "N/A"}</p>
            </div>

            {/* Source Card */}
            <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Cloud className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Data Source</h3>
              <p className="mt-1 text-xl font-semibold text-gray-900">{risk.source || "N/A"}</p>
            </div>

            {/* Active Reasons Card */}
            <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Active Risk Factors</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{risk.reasons?.length || 0}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          {/* Risk Reasons Section */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Risk Reasons</h2>
            </div>
            <div className="space-y-3">
              {risk?.reasons?.length ? (
                risk.reasons.map((r, i) => (
                  <div key={i} className="p-3 text-sm text-gray-700 border border-gray-100 bg-gray-50 rounded-xl">
                    {r}
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-center text-gray-500 bg-gray-50 rounded-xl">
                  No active risk factors at this time
                </div>
              )}
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              </div>
              <span className="text-xs text-gray-500">{alerts.length} active alerts</span>
            </div>
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a._id} className="flex items-center gap-3 p-3 transition-all border border-gray-100 bg-gray-50 rounded-xl hover:border-gray-200">
                  <div className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase ${
                    a.severity === 'high' ? 'bg-red-100 text-red-700' :
                    a.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a.severity}
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-900">{a.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              {!alerts.length && (
                <div className="p-3 text-sm text-center text-gray-500 bg-gray-50 rounded-xl">
                  No active alerts for this region
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Weather Inputs */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Current Weather Conditions</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Droplets className="w-5 h-5 mb-2 text-blue-600" />
              <p className="text-xs text-gray-600">Rain (1h)</p>
              <p className="text-xl font-bold text-gray-900">{weatherInputs.rain1h ?? "-"} <span className="text-sm font-normal">mm</span></p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <CloudRain className="w-5 h-5 mb-2 text-blue-600" />
              <p className="text-xs text-gray-600">Rain (3h)</p>
              <p className="text-xl font-bold text-gray-900">{weatherInputs.rain3h ?? "-"} <span className="text-sm font-normal">mm</span></p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
              <Wind className="w-5 h-5 mb-2 text-teal-600" />
              <p className="text-xs text-gray-600">Wind Speed</p>
              <p className="text-xl font-bold text-gray-900">{weatherInputs.windMs ?? "-"} <span className="text-sm font-normal">m/s</span></p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Thermometer className="w-5 h-5 mb-2 text-orange-600" />
              <p className="text-xs text-gray-600">Temperature</p>
              <p className="text-xl font-bold text-gray-900">{weatherInputs.tempC ?? "-"} <span className="text-sm font-normal">°C</span></p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Droplets className="w-5 h-5 mb-2 text-purple-600" />
              <p className="text-xs text-gray-600">Humidity</p>
              <p className="text-xl font-bold text-gray-900">{weatherInputs.humidity ?? "-"} <span className="text-sm font-normal">%</span></p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <Eye className="w-5 h-5 mb-2 text-indigo-600" />
              <p className="text-xs text-gray-600">Sky Condition</p>
              <p className="text-lg font-bold text-gray-900 truncate">{skyCondition}</p>
            </div>
          </div>
          
          {weatherInputs.alertsCount > 0 && (
            <div className="flex items-center gap-2 p-3 mt-4 text-sm text-yellow-700 border border-yellow-200 bg-yellow-50 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
              Official Alerts: {weatherInputs.alertsCount} active warnings
            </div>
          )}
        </div>

        {/* Weather Trend Chart */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">7-Day Weather Trend</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Temperature (°C)</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.map((h) => ({ 
                date: new Date(h.fetchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                temperature: h.tempC,
                humidity: h.humidity
              }))}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorTemp)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#059669' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {history.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No weather history data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}