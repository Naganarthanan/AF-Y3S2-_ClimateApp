// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/QuizResultPage.jsx
import { useLocation, Link } from "react-router-dom";
import { 
  Award, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Share2, 
  Home,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Star,
  ArrowRight
} from "lucide-react";

export default function QuizResultPage() {
  const location = useLocation();
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const percent = total ? Math.round((score / total) * 100) : 0;
  
  // Determine performance level
  const getPerformanceLevel = () => {
    if (percent >= 90) return { label: "Excellent", color: "text-purple-600", bg: "bg-purple-100", icon: Star };
    if (percent >= 75) return { label: "Good", color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle };
    if (percent >= 50) return { label: "Average", color: "text-yellow-600", bg: "bg-yellow-100", icon: TrendingUp };
    return { label: "Needs Improvement", color: "text-red-600", bg: "bg-red-100", icon: AlertCircle };
  };
  
  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;
  
  // Generate feedback message
  const getFeedbackMessage = () => {
    if (percent >= 90) {
      return "Outstanding! You're exceptionally well-prepared for climate emergencies. Keep sharing your knowledge with others in your community.";
    }
    if (percent >= 75) {
      return "Strong work! Your readiness is looking good. Review a few more resources to become an expert.";
    }
    if (percent >= 50) {
      return "Good effort! There's room to improve. Review the learning resources and try the quiz again to boost your score.";
    }
    return "Don't worry! Everyone starts somewhere. Visit the Education Hub to learn more about climate preparedness, then take the quiz again.";
  };
  
  // Get recommendation links based on score
  const getRecommendations = () => {
    if (percent >= 75) {
      return [
        { title: "Advanced Preparedness", link: "/education", icon: BookOpen },
        { title: "Share Your Knowledge", link: "/education", icon: Share2 },
        { title: "Review Checklist", link: "/prep-plan", icon: Target }
      ];
    }
    return [
      { title: "Education Hub", link: "/education", icon: BookOpen },
      { title: "Preparedness Plan", link: "/prep-plan", icon: Target },
      { title: "Take Quiz Again", link: "/quiz", icon: TrendingUp }
    ];
  };
  
  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Quiz Results
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Performance Summary
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Your preparedness score is ready
              </h1>
              <p className="text-gray-600">
                Use the result as a quick health check, then keep building confidence through the education hub and checklist pages.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                Score {score}/{total}
              </div>
              <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${performance.bg} ${performance.color}`}>
                {percent}% Correct
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Main Score Card */}
        <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-8 text-center">
            {/* Performance Icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${performance.bg} mb-6`}>
              <PerformanceIcon className={`w-10 h-10 ${performance.color}`} />
            </div>
            
            {/* Score Display */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">Final Score</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black text-gray-900">{score}</span>
                <span className="text-2xl text-gray-400">/</span>
                <span className="text-3xl font-semibold text-gray-500">{total}</span>
              </div>
            </div>
            
            {/* Percentage Circle */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className={`${percent >= 75 ? 'text-emerald-500' : percent >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                  strokeWidth="8"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 - (351.86 * percent) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${performance.color}`}>{percent}%</span>
              </div>
            </div>
            
            {/* Performance Level Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${performance.bg} ${performance.color} mb-4`}>
              <PerformanceIcon className="w-4 h-4" />
              <span className="font-semibold">{performance.label}</span>
            </div>
            
            {/* Feedback Message */}
            <p className="max-w-md mx-auto leading-relaxed text-gray-600">
              {getFeedbackMessage()}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 mb-8 md:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Correct Answers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{score}</p>
            <p className="mt-1 text-xs text-gray-400">Out of {total} questions</p>
          </div>
          
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Incorrect Answers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{total - score}</p>
            <p className="mt-1 text-xs text-gray-400">Review these topics</p>
          </div>
          
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Accuracy Rate</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{percent}%</p>
            <p className="mt-1 text-xs text-gray-400">Overall performance</p>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recommended Next Steps</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Based on your performance, here's what we recommend
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <Link
                    key={idx}
                    to={rec.link}
                    className="flex items-center justify-between p-4 transition-all border border-gray-200 group bg-gray-50 rounded-xl hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 transition-colors bg-white rounded-lg group-hover:bg-emerald-100">
                        <Icon className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-emerald-700">
                        {rec.title}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/quiz"
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600 hover:shadow-md"
          >
            <TrendingUp className="w-4 h-4" />
            Take Quiz Again
          </Link>
          <Link
            to="/education"
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <BookOpen className="w-4 h-4" />
            Visit Education Hub
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Share Section */}
        <div className="p-4 mt-8 border border-gray-200 bg-gray-50 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Share Your Achievement</p>
                <p className="text-xs text-gray-500">Celebrate your progress with friends and family</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Copy Score
              </button>
              <button className="px-4 py-2 text-sm text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600">
                Share Result
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}