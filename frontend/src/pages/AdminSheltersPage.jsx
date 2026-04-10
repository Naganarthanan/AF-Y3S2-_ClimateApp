// COMPONENT 2: Geo-Location + Safe Route / Shelter Management
// File: frontend/src/pages/AdminSheltersPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  Home, 
  Plus, 
  Trash2, 
  Power, 
  MapPin, 
  Users, 
  Building,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Navigation
} from "lucide-react";

export default function AdminSheltersPage() {
  const [regions, setRegions] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    address: "", 
    regionId: "", 
    lat: 0, 
    lng: 0, 
    capacity: 100, 
    currentOccupancy: 0, 
    shelterType: "General", 
    isActive: true 
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadShelters() {
    const res = await endpoints.shelters();
    setShelters(res.data.data);
  }

  useEffect(() => {
    endpoints.regions().then((res) => {
      setRegions(res.data.data);
      if (res.data.data[0]) setForm((p) => ({ ...p, regionId: res.data.data[0]._id }));
    });
    loadShelters().catch(() => setShelters([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      await endpoints.createShelter(form);
      await loadShelters();
      setForm((prev) => ({ 
        ...prev, 
        name: "", 
        address: "",
        lat: 0,
        lng: 0,
        capacity: 100
      }));
      setSuccessMessage("Shelter created successfully!");
      setShowForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shelter");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (shelter) => {
    setError("");
    try {
      await endpoints.updateShelterStatus(shelter._id, !shelter.isActive);
      await loadShelters();
      setSuccessMessage(`Shelter ${!shelter.isActive ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update shelter status");
    }
  };

  const removeShelter = async (id) => {
    setError("");
    if (!window.confirm("Are you sure you want to delete this shelter?")) return;
    
    try {
      await endpoints.deleteShelter(id);
      await loadShelters();
      setSuccessMessage("Shelter deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete shelter");
    }
  };

  const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
  const activeShelters = shelters.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Admin Shelters
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Facility Management
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Manage shelter availability with a cleaner operations view
              </h1>
              <p className="text-gray-600">
                Create new shelters, review live status, and quickly activate or deactivate locations as conditions change.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {shelters.length} Shelters
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                New Shelter
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
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Shelters</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{shelters.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Active Shelters</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{activeShelters}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Capacity</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Regions Covered</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{regions.length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
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

        {/* Create Shelter Form */}
        {showForm && (
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Create New Shelter</h2>
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Shelter Name</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g., Central Community Hall"
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="Street address"
                      value={form.address} 
                      onChange={(e) => setForm({ ...form, address: e.target.value })} 
                      required
                    />
                  </div>
                </div>
                
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Shelter Type</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.shelterType} 
                      onChange={(e) => setForm({ ...form, shelterType: e.target.value })}
                    >
                      <option>General</option>
                      <option>Medical</option>
                      <option>School</option>
                      <option>Religious</option>
                      <option>Community</option>
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Capacity</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      placeholder="Maximum capacity"
                      value={form.capacity} 
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Current Occupancy</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      placeholder="Current occupants"
                      value={form.currentOccupancy} 
                      onChange={(e) => setForm({ ...form, currentOccupancy: Number(e.target.value) })} 
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
                        Create Shelter
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

        {/* Shelters List */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Manage Shelters</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all registered shelters
            </p>
          </div>
          
          <div className="p-6">
            {shelters.length > 0 ? (
              <div className="space-y-3">
                {shelters.map((shelter) => {
                  const region = regions.find(r => r._id === shelter.regionId);
                  const occupancyPercent = shelter.capacity ? (shelter.currentOccupancy / shelter.capacity) * 100 : 0;
                  
                  return (
                    <div 
                      key={shelter._id} 
                      className="p-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{shelter.name}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              shelter.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {shelter.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-3.5 h-3.5" />
                              {region?.name || 'Unknown Region'}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Users className="w-3.5 h-3.5" />
                              Capacity: {shelter.capacity}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Navigation className="w-3.5 h-3.5" />
                              {shelter.lat}, {shelter.lng}
                            </div>
                          </div>
                          
                          {shelter.address && (
                            <p className="mt-2 text-sm text-gray-500">{shelter.address}</p>
                          )}
                          
                          {occupancyPercent > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between mb-1 text-xs text-gray-500">
                                <span>Occupancy</span>
                                <span>{Math.round(occupancyPercent)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full transition-all ${
                                    occupancyPercent > 80 ? 'bg-red-500' : 
                                    occupancyPercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-50"
                            onClick={() => toggleStatus(shelter)}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {shelter.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                            onClick={() => removeShelter(shelter._id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No shelters found.</p>
                <p className="mt-1 text-sm text-gray-400">Click "New Shelter" to add your first shelter</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Shelter Management Tips</h4>
              <p className="text-sm text-blue-800">
                Keep shelter information up-to-date, especially capacity and occupancy numbers. 
                Deactivate shelters that are unavailable and reactivate them when they become operational again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}