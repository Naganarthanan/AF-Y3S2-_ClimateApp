// COMPONENT 3: Emergency Resource & Shelter Logistics
// File: frontend/src/pages/AdminResourcesPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Building,
  Box,
  TrendingDown,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ClipboardList
} from "lucide-react";

export default function AdminResourcesPage() {
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({ shelterId: "", category: "food", itemName: "", quantity: 0, unit: "units" });
  const [lowStock, setLowStock] = useState([]);
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    endpoints.nearbyShelters(6.9271, 79.8612, 5000).then((res) => {
      setShelters(res.data.data);
      if (res.data.data[0]) setForm((f) => ({ ...f, shelterId: res.data.data[0]._id }));
    });
    endpoints.lowStock(50).then((res) => setLowStock(res.data.data));
  }, []);

  useEffect(() => {
    if (!form.shelterId) return;
    refreshShelterResources(form.shelterId);
  }, [form.shelterId]);

  const resetForm = () => {
    setEditingId("");
    setForm((f) => ({ ...f, category: "food", itemName: "", quantity: 0, unit: "units" }));
    setError("");
  };

  const refreshShelterResources = async (shelterId) => {
    if (!shelterId) return;
    const res = await endpoints.resources(shelterId);
    setResources(res.data.data);
  };

  const refreshLowStock = async () => {
    const res = await endpoints.lowStock(50);
    setLowStock(res.data.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        await endpoints.updateResource(editingId, {
          category: form.category,
          itemName: form.itemName,
          quantity: form.quantity,
          unit: form.unit,
        });
        setSuccessMessage("Resource updated successfully!");
      } else {
        await endpoints.upsertResource(form);
        setSuccessMessage("Resource saved successfully!");
      }
      await refreshShelterResources(form.shelterId);
      await refreshLowStock();
      resetForm();
      setShowForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editResource = (resource) => {
    setEditingId(resource._id);
    setForm({
      shelterId: resource.shelterId,
      category: resource.category,
      itemName: resource.itemName,
      quantity: resource.quantity,
      unit: resource.unit,
    });
    setShowForm(true);
    setError("");
  };

  const removeResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      await endpoints.deleteResource(id);
      await refreshShelterResources(form.shelterId);
      await refreshLowStock();
      setSuccessMessage("Resource deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'food': return '🍔';
      case 'water': return '💧';
      case 'medical': return '💊';
      case 'tools': return '🔧';
      default: return '📦';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'food': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'water': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'medical': return 'bg-red-100 text-red-700 border-red-200';
      case 'tools': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStockStatus = (quantity, threshold = 50) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (quantity < threshold) return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const totalResources = resources.length;
  const totalQuantity = resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const lowStockCount = lowStock.length;

  const selectedShelter = shelters.find(s => s._id === form.shelterId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Admin Resources
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Inventory Management
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Keep shelter inventory organized and visible
              </h1>
              <p className="text-gray-600">
                Add stock, update quantities, and monitor low inventory across shelter locations from one tidy workspace.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {totalResources} Items
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="flex items-center gap-2 px-4 py-2 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                Add Resource
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
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Items</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{totalResources}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Total Quantity</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Box className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Low Stock Alerts</p>
                <p className="mt-1 text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Shelters</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{shelters.length}</p>
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

        {/* Resource Form */}
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
                    {editingId ? "Edit Resource" : "Add New Resource"}
                  </h2>
                </div>
                <button onClick={() => {
                  setShowForm(false);
                  resetForm();
                }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4" onSubmit={submit}>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Shelter</label>
                  <select 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    value={form.shelterId} 
                    onChange={(e) => setForm({ ...form, shelterId: e.target.value })}
                    disabled={!!editingId}
                  >
                    {shelters.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="food">Food</option>
                      <option value="water">Water</option>
                      <option value="medical">Medical</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g., Rice, Water Bottles, First Aid Kit"
                      value={form.itemName} 
                      onChange={(e) => setForm({ ...form, itemName: e.target.value })} 
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      type="number" 
                      placeholder="0"
                      value={form.quantity} 
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} 
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g., kg, liters, boxes"
                      value={form.unit} 
                      onChange={(e) => setForm({ ...form, unit: e.target.value })} 
                      required
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingId ? "Update Resource" : "Save Resource"}
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button 
                      className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                      type="button" 
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Resources in Selected Shelter */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Resources in Selected Shelter</h2>
              </div>
              {selectedShelter && (
                <p className="mt-1 text-sm text-gray-500">
                  {selectedShelter.name}
                </p>
              )}
            </div>
            
            <div className="p-6">
              {resources.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {resources.map((resource) => {
                    const stockStatus = getStockStatus(resource.quantity);
                    return (
                      <div 
                        key={resource._id} 
                        className="p-4 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
                              <h3 className="font-semibold text-gray-900">{resource.itemName}</h3>
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${stockStatus.color}`}>
                                {stockStatus.label}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Quantity: <span className="font-semibold text-gray-900">{resource.quantity}</span> {resource.unit}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-50"
                              onClick={() => editResource(resource)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button 
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                              onClick={() => removeResource(resource._id)}
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
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No resources found for this shelter.</p>
                  <p className="mt-1 text-sm text-gray-400">Click "Add Resource" to add items</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Items</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Items below threshold (50 units)
              </p>
            </div>
            
            <div className="p-6">
              {lowStock.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {lowStock.map((item) => (
                    <div 
                      key={item._id} 
                      className="p-4 transition-all border border-yellow-200 rounded-xl bg-yellow-50 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                            <h3 className="font-semibold text-gray-900">{item.itemName}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-600">
                              Quantity: <span className="font-semibold text-red-600">{item.quantity}</span> {item.unit}
                            </span>
                            <span className="text-gray-600">
                              Category: <span className="capitalize">{item.category}</span>
                            </span>
                          </div>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
                  <p className="text-gray-500">No low-stock warnings at the moment.</p>
                  <p className="mt-1 text-sm text-gray-400">All inventory levels are healthy</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Inventory Management Tips</h4>
              <p className="text-sm text-blue-800">
                Keep track of resources across all shelters. Set up regular inventory checks and restock low items promptly.
                The system automatically flags items below 50 units for quick action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}