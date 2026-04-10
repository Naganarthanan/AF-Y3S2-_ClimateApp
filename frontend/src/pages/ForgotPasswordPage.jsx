// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import { 
  Mail, Key, Lock, AlertCircle, CheckCircle, ArrowLeft, 
  Shield, Clock, Smartphone, Cloud, ChevronRight, Sparkles
} from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submitEmail(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await endpoints.forgotPassword({ email: form.email });
      setMessage(res.data.message || "OTP sent if the account exists.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await endpoints.verifyResetOtp({ email: form.email, otp: form.otp });
      setMessage(res.data.message || "OTP verified.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await endpoints.resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      setMessage(res.data.message || "Password reset successful.");
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  }

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
                  Reset access without<br />losing your workflow
                </h1>
                
                <p className="mb-8 text-base leading-relaxed md:text-lg text-white/90">
                  Use the secure OTP flow to verify your account and set a new password 
                  in a few guided steps.
                </p>

                {/* Security Features */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white md:text-base">End-to-end encryption</p>
                      <p className="text-xs text-white/80">Your data is always protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Clock className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white md:text-base">24/7 Support</p>
                      <p className="text-xs text-white/80">Get help anytime you need it</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 transition-all rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30">
                      <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white md:text-base">Mobile Ready</p>
                      <p className="text-xs text-white/80">Access from any device</p>
                    </div>
                  </div>
                </div>

                {/* Recovery Steps Overview */}
                <div className="pt-6 mt-2 border-t border-white/20">
                  <p className="mb-3 text-sm font-medium text-white/90">Recovery Process:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-white/20">1</div>
                      <span className="text-white/90">Request OTP to your email</span>
                      {step > 1 && <CheckCircle className="w-4 h-4 ml-auto text-emerald-300" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-white/20">2</div>
                      <span className="text-white/90">Verify the code we send</span>
                      {step > 2 && <CheckCircle className="w-4 h-4 ml-auto text-emerald-300" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-white/20">3</div>
                      <span className="text-white/90">Set a new password</span>
                      {step > 3 && <CheckCircle className="w-4 h-4 ml-auto text-emerald-300" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Password Reset Form */}
            <div className="p-6 bg-white lg:w-1/2 md:p-8 lg:p-10">
              
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <Link to="/login" className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 transition-colors hover:text-emerald-600">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center mb-4 shadow-inner w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                    <Key className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                    Forgot Your Password?
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Don't worry, we'll help you reset it
                  </p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="relative flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm
                          transition-all duration-300
                          ${step > item ? 'bg-emerald-600 text-white' : ''}
                          ${step === item ? 'bg-emerald-600 text-white ring-4 ring-emerald-200' : ''}
                          ${step < item ? 'bg-gray-200 text-gray-500' : ''}
                        `}>
                          {step > item ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : item}
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600">
                          {item === 1 && "Request"}
                          {item === 2 && "Verify"}
                          {item === 3 && "Reset"}
                        </div>
                      </div>
                      {item < 3 && (
                        <div className="absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2">
                          <div className={`
                            h-full transition-all duration-300
                            ${step > item ? 'bg-emerald-600' : 'bg-gray-200'}
                          `} style={{ width: '100%' }}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Email Request */}
              {step === 1 && (
                <form onSubmit={submitEmail} className="space-y-5">
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
                    <p className="text-xs text-gray-500">
                      We'll send a verification code to this email address
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-2.5 md:py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <form onSubmit={submitOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base text-gray-600 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Verification Code (OTP)
                    </label>
                    <div className="relative">
                      <Key className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={form.otp}
                        onChange={(e) => setForm({ ...form, otp: e.target.value })}
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-xl md:text-2xl tracking-widest text-center transition-all border border-gray-200 outline-none rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-gray-50 focus:bg-white text-gray-800"
                        maxLength="6"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-2.5 md:py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={submitReset} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base text-gray-600 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Verified OTP
                    </label>
                    <div className="relative">
                      <CheckCircle className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5 text-emerald-600" />
                      <input
                        type="text"
                        value={form.otp}
                        disabled
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base text-gray-600 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 md:w-5 md:h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a new password"
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
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
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-2.5 md:py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                        <span>Resetting...</span>
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}

              {/* Step 4: Success Message */}
              {step === 4 && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full md:w-20 md:h-20 bg-emerald-100">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-800 md:text-xl">
                    Password Reset Successful!
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 md:text-base">
                    Your password has been reset successfully. You can now sign in with your new password.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center w-full gap-2 py-2.5 md:py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 text-sm md:text-base"
                  >
                    Go to Login
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Messages */}
              {message && step !== 4 && (
                <div className="flex items-start gap-2 p-3 mt-4 text-xs border md:text-sm text-emerald-700 border-emerald-200 rounded-xl bg-emerald-50">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 mt-4 text-xs text-red-700 border border-red-200 md:text-sm rounded-xl bg-red-50">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Help Text */}
              {step < 4 && (
                <div className="pt-6 mt-6 text-center border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Need help?{" "}
                    <Link to="/contact" className="transition-colors text-emerald-600 hover:text-emerald-700 hover:underline">
                      Contact Support
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}