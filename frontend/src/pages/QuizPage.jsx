// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/QuizPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import { 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Send
} from "lucide-react";

export default function QuizPage() {
  const navigate = useNavigate();
  const [disasterType, setDisasterType] = useState("Flood");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { 
    endpoints.quiz(disasterType)
      .then((res) => {
        setQuestions(res.data.data.slice(0, 10));
        setAnswers({});
        setCurrentQuestionIndex(0);
        setError("");
      })
      .catch(() => {
        setQuestions([]);
        setError("Failed to load questions. Please try again.");
      });
  }, [disasterType]);

  const handleAnswer = (questionId, selectedIndex) => {
    setAnswers({ ...answers, [questionId]: selectedIndex });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submit = async () => {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < totalQuestions) {
      setError(`Please answer all ${totalQuestions} questions before submitting. (${answeredCount}/${totalQuestions} answered)`);
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const payload = { 
        disasterType, 
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ 
          questionId, 
          selectedIndex 
        })) 
      };
      const res = await endpoints.submitQuiz(payload);
      navigate("/quiz/result", { state: res.data.data });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  
  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = currentQuestion ? answers[currentQuestion._id] !== undefined : false;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-12xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide uppercase rounded-lg bg-emerald-100 text-emerald-700">
                  Preparedness Quiz
                </div>
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-100 rounded-lg">
                  Test Your Knowledge
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Test your climate readiness knowledge
              </h1>
              <p className="text-gray-600">
                Switch disaster categories, answer the questions, and see how well prepared you are across key safety topics.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select 
                  className="px-4 py-2 pr-8 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-700 outline-none transition-all cursor-pointer appearance-none min-w-[160px]"
                  value={disasterType} 
                  onChange={(e) => setDisasterType(e.target.value)}
                >
                  <option>Flood</option>
                  <option>Cyclone</option>
                  <option>Heat</option>
                  <option>Earthquake</option>
                  <option>Landslide</option>
                </select>
                <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {totalQuestions} Questions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-12xl sm:px-6 lg:px-8">
        {/* Progress Section */}
        {totalQuestions > 0 && (
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Your Progress</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-sm font-medium text-emerald-600">
                  {answeredCount}/{totalQuestions} Answered
                </span>
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex h-2 overflow-hidden text-xs bg-gray-200 rounded-full">
                <div 
                  style={{ width: `${progress}%` }}
                  className="flex flex-col justify-center text-center text-white transition-all duration-500 rounded-full shadow-none whitespace-nowrap bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
            </div>
            
            {/* Question Counter Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-8 h-8 rounded-lg text-xs font-semibold transition-all
                    ${currentQuestionIndex === idx 
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-200' 
                      : answers[questions[idx]._id] !== undefined
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
            <AlertCircle className="flex-shrink-0 w-4 h-4" />
            {error}
          </div>
        )}

        {/* Current Question Card */}
        {questions.length > 0 && currentQuestion && (
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl">
                  <span className="text-lg font-bold text-emerald-600">{currentQuestionIndex + 1}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                  <h3 className="text-xl font-semibold leading-relaxed text-gray-900">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion._id] === idx;
                  return (
                    <label 
                      key={idx} 
                      className={`flex cursor-pointer items-start gap-3 p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-emerald-300 bg-emerald-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={currentQuestion._id} 
                        value={idx}
                        checked={isSelected}
                        onChange={() => handleAnswer(currentQuestion._id, idx)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className={`text-base ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {questions.length > 0 && (
          <div className="flex justify-between mt-8">
            <button 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={goToPreviousQuestion}
              disabled={isFirstQuestion}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            {!isLastQuestion ? (
              <button 
                className="flex items-center gap-2 px-6 py-3 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600 hover:shadow-md"
                onClick={goToNextQuestion}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                className="flex items-center gap-2 px-6 py-3 text-white transition-all shadow-sm bg-emerald-500 rounded-xl hover:bg-emerald-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={submit}
                disabled={isSubmitting || answeredCount < totalQuestions}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {questions.length === 0 && !error && (
          <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Loading questions...</p>
          </div>
        )}

        {/* Tips Section */}
        {questions.length > 0 && (
          <div className="p-4 mt-8 border border-blue-200 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-1 font-semibold text-blue-900">Quiz Tips</h4>
                <p className="text-sm text-blue-800">
                  Take your time to read each question carefully. You can navigate between questions using the 
                  Previous/Next buttons or click on the question numbers above. Your progress is automatically saved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}