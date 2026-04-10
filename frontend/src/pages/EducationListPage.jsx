// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/EducationListPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import { BookOpen, Video, ExternalLink, Edit2, Trash2, X, CheckCircle } from "lucide-react";

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function EducationListPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const [data, setData] = useState([]);
  const [youtubeData, setYouTubeData] = useState([]);
  const [youtubeError, setYouTubeError] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({ type: "article", title: "", bodyOrUrl: "", disasterType: "Flood", tags: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const loadEducation = () => {
    endpoints.education().then((res) => setData(res.data.data)).catch(() => setData([]));
  };

  useEffect(() => {
    loadEducation();
    endpoints.educationYouTube("", "Flood", 18)
      .then((res) => {
        setYouTubeData(shuffle(res.data.data || []).slice(0, 6));
        setYouTubeError("");
      })
      .catch((error) => {
        setYouTubeData([]);
        setYouTubeError(error?.response?.data?.message || "Failed to load YouTube videos.");
      });
  }, []);

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      type: item.type,
      title: item.title,
      bodyOrUrl: item.bodyOrUrl,
      disasterType: item.disasterType,
      tags: (item.tags || []).join(", "),
    });
    setError("");
    setSuccessMessage("");
  };

  const onCancel = () => {
    setEditingId("");
    setForm({ type: "article", title: "", bodyOrUrl: "", disasterType: "Flood", tags: "" });
    setError("");
    setSuccessMessage("");
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await endpoints.updateEducation(editingId, {
        type: form.type,
        title: form.title,
        bodyOrUrl: form.bodyOrUrl,
        disasterType: form.disasterType,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      loadEducation();
      setSuccessMessage("Content updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      onCancel();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update content");
    }
  };

  const onDelete = async (id) => {
    setError("");
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      await endpoints.deleteEducation(id);
      loadEducation();
      if (editingId === id) onCancel();
      setSuccessMessage("Content deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete content");
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
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Education Hub
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-purple-700 uppercase bg-purple-100 rounded-lg">
                  Learning Resources
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Preparedness knowledge in a more engaging learning space
              </h1>
              <p className="text-gray-600">
                Browse local education content, explore video resources, and manage entries with a cleaner editorial layout.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {data.length} Local Items
              </div>
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {youtubeData.length} Videos
              </div>
              {isAdmin && (
                <div className="px-3 py-2 text-sm rounded-lg bg-emerald-100 text-emerald-700">
                  Admin Editing
                </div>
              )}
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
          <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        {/* Edit Form - Only shown when editing */}
        {isAdmin && editingId && (
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Content</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={onUpdate}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Content Type</label>
                    <select 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      value={form.type} 
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Disaster Type</label>
                    <input 
                      className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g., Flood, Cyclone, Earthquake"
                      value={form.disasterType} 
                      onChange={(e) => setForm({ ...form, disasterType: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Content title"
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Body or URL</label>
                  <textarea 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    rows="3"
                    placeholder="Content body or video URL"
                    value={form.bodyOrUrl} 
                    onChange={(e) => setForm({ ...form, bodyOrUrl: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma separated)</label>
                  <input 
                    className="w-full px-4 py-2 text-gray-700 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    placeholder="preparedness, safety, guide"
                    value={form.tags} 
                    onChange={(e) => setForm({ ...form, tags: e.target.value })} 
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button className="px-4 py-2 text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600" type="submit">
                    Update Content
                  </button>
                  <button className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300" type="button" onClick={onCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Local Content Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Local Content</h2>
          </div>
          
          {data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
              {data.map((item) => (
                <div key={item._id} className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg">
                        {item.type}
                      </span>
                      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-lg">
                        {item.disasterType}
                      </span>
                      {item.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      to={`/education/${item._id}`} 
                      className="block mb-3 text-lg font-semibold text-gray-900 transition-colors hover:text-emerald-600"
                    >
                      {item.title}
                    </Link>
                    
                    <p className="text-sm leading-relaxed text-gray-600">
                      {String(item.bodyOrUrl).slice(0, 120)}
                      {String(item.bodyOrUrl).length > 120 ? "..." : ""}
                    </p>
                    
                    {isAdmin && (
                      <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                        <button 
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                          onClick={() => onEdit(item)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button 
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
                          onClick={() => onDelete(item._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No local education content available.</p>
            </div>
          )}
        </div>

        {/* YouTube Videos Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Video className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">YouTube Preparedness Videos</h2>
          </div>
          
          {youtubeError ? (
            <div className="p-4 text-sm text-yellow-700 border border-yellow-200 bg-yellow-50 rounded-xl">
              YouTube error: {youtubeError}
            </div>
          ) : youtubeData.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {youtubeData.map((item) => (
                <div key={item.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md group">
                  <div className="p-6">
                    <a 
                      className="block mb-2 text-lg font-semibold text-gray-900 transition-colors hover:text-emerald-600 line-clamp-2"
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {item.channelTitle || "YouTube Channel"}
                      </p>
                      <ExternalLink className="w-4 h-4 text-gray-400 transition-colors group-hover:text-emerald-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
              <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No YouTube videos available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}