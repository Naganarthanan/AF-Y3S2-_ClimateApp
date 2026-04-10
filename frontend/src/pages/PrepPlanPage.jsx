// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/PrepPlanPage.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api/endpoints";
import { 
  CheckCircle, 
  Circle, 
  Save, 
  TrendingUp, 
  AlertCircle,
  Shield,
  Target,
  Calendar,
  CheckSquare
} from "lucide-react";

export default function PrepPlanPage() {
  const [plan, setPlan] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { 
    endpoints.prepPlan()
      .then((res) => setPlan(res.data.data))
      .catch(() => setError("Failed to load preparedness plan. Please try again."));
  }, []);

  const toggle = (index) => {
    setPlan({ 
      ...plan, 
      checklistItems: plan.checklistItems.map((item, i) => 
        i === index ? { ...item, done: !item.done } : item
      ) 
    });
  };

  const save = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setError("");
    
    try {
      await endpoints.updatePrepPlan({ checklistItems: plan.checklistItems });
      setSaveMessage("Preparedness plan saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setError("Failed to save plan. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error && !plan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md p-8 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 rounded-full border-emerald-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading your preparedness plan...</p>
          </div>
        </div>
      </div>
    );
  }

  const completed = plan.checklistItems.filter((item) => item.done).length;
  const total = plan.checklistItems.length;
  const progress = (completed / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Preparedness Plan
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Action Checklist
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Turn awareness into a practical action checklist
              </h1>
              <p className="text-gray-600">
                Track your readiness progress, update completed items, and maintain a clear plan 
                you can revisit before high-risk periods.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {completed}/{total} Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Progress Section */}
        <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Your Readiness Progress</h3>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex h-3 overflow-hidden text-xs bg-gray-200 rounded-full">
              <div 
                style={{ width: `${progress}%` }}
                className="flex flex-col justify-center text-center text-white transition-all duration-500 rounded-full shadow-none whitespace-nowrap bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-600">{completed} tasks completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{total - completed} tasks remaining</span>
            </div>
          </div>
          
          {progress === 100 && (
            <div className="flex items-center gap-2 p-3 mt-4 text-sm border bg-emerald-50 border-emerald-200 rounded-xl text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              Amazing! You've completed all preparedness tasks. Stay safe!
            </div>
          )}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm border bg-emerald-50 border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Checklist Section */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Emergency Preparedness Checklist</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Check off items as you complete them to track your progress
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {plan.checklistItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`group rounded-xl border transition-all duration-200 ${
                    item.done 
                      ? 'border-emerald-200 bg-emerald-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    <div className="flex-shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={item.done} 
                        onChange={() => toggle(idx)}
                        className="w-5 h-5 border-gray-300 rounded cursor-pointer text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm transition-colors ${
                        item.done 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {item.text}
                      </span>
                    </div>
                    {item.done && (
                      <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-600" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button 
            className="flex items-center gap-2 px-6 py-3 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={save}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Checklist
              </>
            )}
          </button>
          
          <button 
            className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            onClick={() => {
              if (window.confirm("Reset all checklist items? This cannot be undone.")) {
                setPlan({
                  ...plan,
                  checklistItems: plan.checklistItems.map(item => ({ ...item, done: false }))
                });
              }
            }}
          >
            <Circle className="w-4 h-4" />
            Reset All
          </button>
        </div>

        {/* Tips Section */}
        <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Why Preparedness Matters</h4>
              <p className="text-sm text-blue-800">
                Being prepared can significantly reduce risk during emergencies. Review this checklist regularly,
                especially before high-risk seasons, and keep your family and community informed about your plan.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mt-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Review recommended monthly</span>
          </div>
        </div>
      </div>
    </div>
  );
}