// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/pages/RegisterPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { endpoints } from "../api/endpoints";
import { 
  User, Mail, Phone, Lock, AlertCircle, Eye, EyeOff, 
  Cloud, Map, Bell, Shield, CheckCircle, 
  MapPin, Users, Sparkles, ArrowRight
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    defaultRegionId: "" 
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    endpoints.regions().then((res) => setRegions(res.data.data)).catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      
      {/* Main Container - Not covering full page */}
      <div className="w-full max-w-6xl">
        
        {/* Curved Card Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
          
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row">
            
            {/* LEFT SIDE - Green Panel with Curved Corners */}
            <div className="relative lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 lg:rounded-r-[2rem] overflow-hidden">
              
              {/* Curved corner effect */}
              <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-white/10 blur-2xl"></div>
              <div className="absolute w-32 h-32 rounded-full -bottom-10 -left-10 bg-white/10 blur-2xl"></div>
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-white/10 blur-3xl animate-pulse"></div>
                <div className="absolute delay-1000 rounded-full -bottom-40 -left-40 w-80 h-80 bg-white/10 blur-3xl animate-pulse"></div>
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-white/5 blur-3xl"></div>
                
                {/* Floating elements */}
                <div className="absolute top-10 left-10 animate-bounce-slow">
                  <Sparkles className="w-5 h-5 text-white/20" />
                </div>
                <div className="absolute delay-1000 bottom-10 right-10 animate-bounce-slow">
                  <Sparkles className="w-4 h-4 text-white/20" />
                </div>
              </div>

              <div className="relative z-10 p-8 md:p-10 lg:p-12">
                {/* Logo/Brand */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 shadow-lg bg-white/20 backdrop-blur-sm rounded-xl">
                    <Cloud className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white md:text-2xl">ClimateSafe</span>
                </div>

                <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                  Join a resilient<br />climate-ready community
                </h1>
                
                <p className="mb-8 text-base leading-relaxed md:text-lg text-white/90">
                  Create your account to personalize alerts, assign a default region, 
                  and access preparedness guidance designed for day-to-day use.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8 md:gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-300" />
                      <span className="text-xs font-medium text-white md:text-sm">Personal</span>
                    </div>
                    <p className="text-xs text-white/80">Default region preferences and tailored alerts</p>
                  </div>
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-300" />
                      <span className="text-xs font-medium text-white md:text-sm">Practical</span>
                    </div>
                    <p className="text-xs text-white/80">Checklists, shelter details, and route guidance</p>
                  </div>
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-300" />
                      <span className="text-xs font-medium text-white md:text-sm">Trusted</span>
                    </div>
                    <p className="text-xs text-white/80">A cleaner interface for everyday readiness</p>
                  </div>
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-300" />
                      <span className="text-xs font-medium text-white md:text-sm">24/7 Support</span>
                    </div>
                    <p className="text-xs text-white/80">Round-the-clock emergency assistance</p>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="pt-6 mt-2 border-t border-white/20">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white md:text-2xl">50K+</div>
                      <div className="text-xs text-white/80">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white md:text-2xl">98%</div>
                      <div className="text-xs text-white/80">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white md:text-2xl">150+</div>
                      <div className="text-xs text-white/80">Communities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Registration Form */}
            <div className="p-6 bg-white lg:w-1/2 md:p-8 lg:p-10">
              
              {/* Header */}
              <div className="mb-6 text-center md:mb-8">
                <div className="inline-flex items-center justify-center mb-4 shadow-inner w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                  Create an Account
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold transition-all text-emerald-600 hover:text-emerald-700 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number and Password - Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type="tel"
                        placeholder="+9477XXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-9 md:pl-10 pr-10 md:pr-12 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800 placeholder:text-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Default Region */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Region
                  </label>
                  <div className="relative">
                    <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                    <select
                      value={form.defaultRegionId}
                      onChange={(e) => setForm({ ...form, defaultRegionId: e.target.value })}
                      className="w-full pl-9 md:pl-10 pr-8 py-2.5 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800"
                      required
                    >
                      <option value="">Select default region</option>
                      {regions.map((r) => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                    <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Select your primary region for personalized alerts and updates</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 p-3 text-xs text-red-700 border border-red-200 md:text-sm rounded-xl bg-red-50">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-2.5 md:py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 md:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-500 bg-white">Benefits of joining</span>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 mt-0.5 bg-emerald-100 rounded-lg">
                    <Bell className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Personalized Alerts</p>
                    <p className="text-xs text-gray-500">Get region-specific emergency notifications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 mt-0.5 bg-emerald-100 rounded-lg">
                    <Map className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Safety Routes</p>
                    <p className="text-xs text-gray-500">Access real-time evacuation guidance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 mt-0.5 bg-emerald-100 rounded-lg">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Climate Monitoring</p>
                    <p className="text-xs text-gray-500">Advanced risk assessment tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-center text-gray-400">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="transition-colors text-emerald-600 hover:text-emerald-700 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="transition-colors text-emerald-600 hover:text-emerald-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}