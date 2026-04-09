import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, AlertCircle, Eye, EyeOff, Cloud, Map, Bell, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
              
              {/* Curved corner effect on top right */}
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
                  Welcome Back to<br />ClimateSafe
                </h1>
                
                <p className="mb-8 text-base leading-relaxed md:text-lg text-white/90">
                  Your trusted partner in climate resilience and community safety. 
                  Access real-time alerts, safety routes, and advanced monitoring tools.
                </p>

                {/* Feature Highlights */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Bell className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-sm transition-colors md:text-base text-white/90 group-hover:text-white">Real-time emergency alerts</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Map className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-sm transition-colors md:text-base text-white/90 group-hover:text-white">Dynamic safety route mapping</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-sm transition-colors md:text-base text-white/90 group-hover:text-white">Advanced risk monitoring</span>
                  </div>
                </div>

                {/* Stats/Testimonial */}
                <div className="pt-6 mt-6 border-t md:pt-8 md:mt-8 border-white/20">
                  <div className="flex gap-6 md:gap-8">
                    <div>
                      <div className="text-xl font-bold text-white md:text-2xl">50K+</div>
                      <div className="text-xs md:text-sm text-white/80">Active Users</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white md:text-2xl">98%</div>
                      <div className="text-xs md:text-sm text-white/80">Alert Accuracy</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white md:text-2xl">24/7</div>
                      <div className="text-xs md:text-sm text-white/80">Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="p-6 bg-white lg:w-1/2 md:p-8 lg:p-10">
              
              {/* Header */}
              <div className="mb-6 text-center md:mb-8">
                <div className="inline-flex items-center justify-center mb-4 shadow-inner w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                  <Cloud className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                  Sign In to Your Account
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-semibold transition-all text-emerald-600 hover:text-emerald-700 hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
                
                {/* Email Field */}
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

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium transition-all md:text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign In
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
                  <span className="px-4 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <button className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 transition-all border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>
                
                <button className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 transition-all border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>
                
                <button className="flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 transition-all border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="#000" viewBox="0 0 24 24">
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.393.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
                  </svg>
                  <span className="hidden sm:inline">Twitter</span>
                </button>
              </div>

              {/* Footer Note */}
              <p className="mt-6 text-xs text-center text-gray-400">
                By signing in, you agree to our{" "}
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
        </div>
      </div>
    </div>
  );
}