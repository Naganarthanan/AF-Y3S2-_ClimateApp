// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/pages/AdminAlertsPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  Bell, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Save,
  Clock
} from "lucide-react";

export default function AdminAlertsPage() {
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ regionId: "", severity: "HIGH", title: "", description: "", expiresAt: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadAlerts() {
    const res = await endpoints.alerts("?source=Manual");
    setAlerts(res.data.data);
  }

  useEffect(() => {
    endpoints.regions().then((res) => {
      setRegions(res.data.data);
      if (res.data.data[0]) setForm((f) => ({ ...f, regionId: res.data.data[0]._id }));
    });
    loadAlerts().catch(() => setAlerts([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        await endpoints.updateAlert(editingId, { ...form, expiresAt: form.expiresAt || undefined });
        setSuccessMessage("Alert updated successfully!");
      } else {
        await endpoints.manualAlert({ ...form, expiresAt: form.expiresAt || undefined });
        setSuccessMessage("Alert published successfully!");
      }
      await loadAlerts();
      setEditingId(null);
      setForm((prev) => ({ ...prev, title: "", description: "", expiresAt: "" }));
      setShowForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (alert) => {
    setEditingId(alert._id);
    setForm({
      regionId: alert.regionId,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      expiresAt: alert.expiresAt ? new Date(alert.expiresAt).toISOString().slice(0, 16) : "",
    });
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const onDelete = async (id) => {
    setError("");
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    
    try {
      await endpoints.deleteAlert(id);
      await loadAlerts();
      if (editingId === id) {
        setEditingId(null);
        setForm((prev) => ({ ...prev, title: "", description: "", expiresAt: "" }));
        setShowForm(false);
      }
      setSuccessMessage("Alert deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete alert");
    }
  };

  const onCancel = () => {
    setEditingId(null);
    setForm({ regionId: regions[0]?._id || "", severity: "HIGH", title: "", description: "", expiresAt: "" });
    setShowForm(false);
    setError("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-red-700 uppercase bg-red-100 rounded-lg">
                  Admin Alerts
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-purple-700 uppercase bg-purple-100 rounded-lg">
                  Manual Publishing
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Publish and manage manual warning notices
              </h1>
              <p className="text-gray-600">
                Create targeted alerts for regions, adjust expiration windows, and keep the alert stream well maintained.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {alerts.length} Manual Alerts
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                New Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
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

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editingId ? (
                    <Edit2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-emerald-600" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingId ? "Edit Manual Alert" : "Publish Manual Alert"}
                  </h2>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Severity</label>
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
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Alert title"
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    rows="3"
                    placeholder="Detailed description of the alert"
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Expires At (Optional)</label>
                  <input 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    type="datetime-local" 
                    value={form.expiresAt} 
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} 
                  />
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingId ? "Update Alert" : "Publish Alert"}
                      </>
                    )}
                  </button>
                  <button 
                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                    type="button" 
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Manual Alerts</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Manage all manually published alerts
            </p>
          </div>
          
          <div className="p-6">
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert._id} 
                    className="flex flex-wrap items-center gap-3 p-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md"
                  >
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{alert.title}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {regions.find(r => r._id === alert.regionId)?.name || 'Unknown'}
                        </span>
                        {alert.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-50"
                        onClick={() => onEdit(alert)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                        onClick={() => onDelete(alert._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No manual alerts yet.</p>
                <p className="mt-1 text-sm text-gray-400">Click "New Alert" to create your first alert</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Alert Guidelines</h4>
              <p className="text-sm text-blue-800">
                Manual alerts are immediately visible to citizens. Ensure accuracy of information before publishing.
                Set expiration dates for time-sensitive alerts to keep the system clean.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}