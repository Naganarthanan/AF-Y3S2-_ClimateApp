// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: frontend/src/pages/AdminZonesPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  Map, 
  Plus, 
  Trash2, 
  AlertTriangle,
  MapPin,
  Radio,
  Clock,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Navigation,
  Layers
} from "lucide-react";

export default function AdminZonesPage() {
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ 
    regionId: "", 
    disasterType: "Flood", 
    shapeType: "circle", 
    lat: 6.9271, 
    lng: 79.8612, 
    radiusKm: 5, 
    severity: "HIGH", 
    activeFrom: new Date().toISOString(), 
    activeTo: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() 
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadZones() {
    const res = await endpoints.zonesAll();
    setZones(res.data.data);
  }

  useEffect(() => {
    endpoints.regions().then((res) => {
      setRegions(res.data.data);
      if (res.data.data[0]) setForm((f) => ({ ...f, regionId: res.data.data[0]._id }));
    });
    loadZones().catch(() => setZones([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      await endpoints.createZone(form);
      await loadZones();
      setSuccessMessage("Unsafe zone created successfully!");
      setShowForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create zone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeZone = async (id) => {
    setError("");
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    
    try {
      await endpoints.deleteZone(id);
      await loadZones();
      setSuccessMessage("Zone deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete zone");
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const activeZones = zones.filter(z => new Date(z.activeTo) > new Date()).length;
  const criticalZones = zones.filter(z => z.severity === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-red-700 uppercase bg-red-100 rounded-lg">
                  Admin Zones
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-orange-700 uppercase bg-orange-100 rounded-lg">
                  Risk Areas
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Control unsafe zone definitions with better visibility
              </h1>
              <p className="text-gray-600">
                Create region-based zones, assign severity, and remove outdated areas from active operations.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {zones.length} Zones
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                New Zone
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
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Zones</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{zones.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Layers className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Active Zones</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{activeZones}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Radio className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Critical Zones</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{criticalZones}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Regions Covered</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{regions.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Map className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm border bg-emerald-50 border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Create Zone Form */}
        {showForm && (
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Create Unsafe Zone</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Region</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.regionId} 
                      onChange={(e) => setForm({ ...form, regionId: e.target.value })}
                    >
                      {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Disaster Type</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.disasterType} 
                      onChange={(e) => setForm({ ...form, disasterType: e.target.value })}
                    >
                      <option>Flood</option>
                      <option>Cyclone</option>
                      <option>Heat</option>
                      <option>Earthquake</option>
                      <option>Landslide</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Severity Level</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.severity} 
                      onChange={(e) => setForm({ ...form, severity: e.target.value })}
                    >
                      <option>LOW</option>
                      <option>MEDIUM</option>
                      <option>HIGH</option>
                      <option>CRITICAL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Shape Type</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.shapeType} 
                      onChange={(e) => setForm({ ...form, shapeType: e.target.value })}
                    >
                      <option>circle</option>
                      <option>polygon</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      step="any"
                      placeholder="6.9271"
                      value={form.lat} 
                      onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })} 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      step="any"
                      placeholder="79.8612"
                      value={form.lng} 
                      onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })} 
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Radius (km)</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      step="0.5"
                      placeholder="5"
                      value={form.radiusKm} 
                      onChange={(e) => setForm({ ...form, radiusKm: Number(e.target.value) })} 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Active Until</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="datetime-local" 
                      value={form.activeTo.slice(0, 16)} 
                      onChange={(e) => setForm({ ...form, activeTo: new Date(e.target.value).toISOString() })} 
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Zone
                      </>
                    )}
                  </button>
                  <button 
                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                    type="button" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Zones List */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Manage Zones</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all defined unsafe zones
            </p>
          </div>
          
          <div className="p-6">
            {zones.length > 0 ? (
              <div className="space-y-3">
                {zones.map((zone) => {
                  const region = regions.find(r => r._id === zone.regionId);
                  const isExpired = new Date(zone.activeTo) < new Date();
                  
                  return (
                    <div 
                      key={zone._id} 
                      className="p-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{zone.disasterType}</span>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(zone.severity)}`}>
                              {getSeverityIcon(zone.severity)}
                              {zone.severity}
                            </div>
                            {isExpired && (
                              <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-lg">
                                Expired
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-3.5 h-3.5" />
                              {region?.name || 'Unknown Region'}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Radio className="w-3.5 h-3.5" />
                              Radius: {zone.radiusKm} km
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Navigation className="w-3.5 h-3.5" />
                              {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            Active until: {new Date(zone.activeTo).toLocaleString()}
                          </div>
                        </div>
                        
                        <button 
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                          onClick={() => removeZone(zone._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Map className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No zones found.</p>
                <p className="mt-1 text-sm text-gray-400">Click "New Zone" to create your first unsafe zone</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Zone Management Guidelines</h4>
              <p className="text-sm text-blue-800">
                Zones define high-risk areas for specific disaster types. Set appropriate severity levels and expiration dates.
                Expired zones are automatically hidden from public view. Review and update zones regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}