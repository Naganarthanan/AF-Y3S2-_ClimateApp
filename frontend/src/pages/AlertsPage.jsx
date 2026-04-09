// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/pages/AlertsPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  Bell, 
  AlertTriangle, 
  Filter, 
  Clock, 
  MapPin, 
  ChevronRight,
  Shield,
  Info,
  Calendar,
  Eye
} from "lucide-react";

export default function AlertsPage() {
  const [severity, setSeverity] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const query = severity ? `?severity=${severity}` : "";
    setIsLoading(true);
    endpoints.alerts(query)
      .then((res) => {
        setAlerts(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setAlerts([]);
        setIsLoading(false);
      });
  }, [severity]);

  const getSeverityColor = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-500', icon: 'text-red-500' };
      case 'HIGH':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-500', icon: 'text-orange-500' };
      case 'MEDIUM':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-500', icon: 'text-yellow-500' };
      case 'LOW':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-500', icon: 'text-blue-500' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-500', icon: 'text-gray-500' };
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5" />;
      case 'LOW':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const severityOptions = [
    { value: "", label: "All Severities", color: "gray" },
    { value: "LOW", label: "Low", color: "blue" },
    { value: "MEDIUM", label: "Medium", color: "yellow" },
    { value: "HIGH", label: "High", color: "orange" },
    { value: "CRITICAL", label: "Critical", color: "red" }
  ];

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity?.toUpperCase() === 'CRITICAL').length,
    high: alerts.filter(a => a.severity?.toUpperCase() === 'HIGH').length,
    medium: alerts.filter(a => a.severity?.toUpperCase() === 'MEDIUM').length,
    low: alerts.filter(a => a.severity?.toUpperCase() === 'LOW').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-red-700 uppercase bg-red-100 rounded-lg">
                  Alerts Center
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100 rounded-lg">
                  Real-time Updates
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Review active warnings with clear severity context
              </h1>
              <p className="text-gray-600">
                Filter alerts by severity and scan the latest notices in a cleaner, easier-to-triage layout.
              </p>
            </div>
            
            <div className="relative">
              <Filter className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <select 
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-700 outline-none transition-all cursor-pointer appearance-none min-w-[200px]"
                value={severity} 
                onChange={(e) => setSeverity(e.target.value)}
              >
                {severityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-5">
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Alerts</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Critical</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">High</p>
                <p className="mt-1 text-2xl font-bold text-orange-600">{stats.high}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Medium</p>
                <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Low</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">{stats.low}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="w-1/3 h-5 mb-3 bg-gray-200 rounded-lg"></div>
                    <div className="w-full h-4 mb-2 bg-gray-200 rounded-lg"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const colors = getSeverityColor(alert.severity);
              return (
                <div 
                  key={alert._id} 
                  className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      {/* Severity Badge */}
                      <div className={`flex-shrink-0 ${colors.bg} rounded-xl p-3 border ${colors.border}`}>
                        <div className={colors.icon}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {alert.severity || "UNKNOWN"}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(alert.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(alert.createdAt || Date.now()).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <h3 className="mb-3 text-xl font-bold text-gray-900">
                          {alert.title}
                        </h3>
                        
                        <p className="mb-4 leading-relaxed text-gray-600">
                          {alert.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => setSelectedAlert(selectedAlert === alert._id ? null : alert._id)}
                            className="flex items-center gap-1 text-sm transition-colors text-emerald-600 hover:text-emerald-700"
                          >
                            <Eye className="w-4 h-4" />
                            {selectedAlert === alert._id ? "Show less" : "Read more"}
                            <ChevronRight className={`w-4 h-4 transition-transform ${selectedAlert === alert._id ? 'rotate-90' : ''}`} />
                          </button>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>Affected regions: Multiple</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Verified source</span>
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        {selectedAlert === alert._id && (
                          <div className="p-4 mt-4 border border-gray-200 bg-gray-50 rounded-xl">
                            <h4 className="mb-2 font-semibold text-gray-900">Additional Information</h4>
                            <p className="mb-3 text-sm text-gray-600">
                              This alert has been issued based on the latest weather data and risk assessment models.
                              Residents in affected areas should take necessary precautions and stay updated.
                            </p>
                            <div className="flex gap-2">
                              <button className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors">
                                View Safety Guidelines
                              </button>
                              <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                Share Alert
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No alerts found</h3>
            <p className="text-gray-500">
              {severity ? `No ${severity.toLowerCase()} severity alerts at this time.` : "There are no active alerts at this time."}
            </p>
            {severity && (
              <button 
                onClick={() => setSeverity("")}
                className="px-4 py-2 mt-4 text-white transition-colors bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
        
        {/* Legend */}
        <div className="p-4 mt-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Severity Levels:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Low</span>
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