// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { Home, AlertCircle, Cloud, ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      
      {/* Main Container */}
      <div className="w-full max-w-2xl">
        
        {/* Curved Card Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
          
          {/* Content */}
          <div className="p-8 text-center md:p-12">
            
            {/* 404 Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 shadow-inner bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                <AlertCircle className="w-12 h-12 text-amber-600" />
              </div>
            </div>
            
            {/* Error Code */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1 text-xs font-semibold tracking-wide uppercase rounded-full text-amber-700 bg-amber-100">
                404 Error
              </span>
            </div>
            
            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Page not found
            </h1>
            
            {/* Description */}
            <p className="max-w-md mx-auto mb-8 text-sm text-gray-600 md:text-base">
              The page you requested is not available. Return to the dashboard to continue exploring the app.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300"
              >
                <Cloud className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
            
            {/* Help Text */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Need assistance?{" "}
                <Link to="/contact" className="transition-colors text-emerald-600 hover:text-emerald-700 hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}