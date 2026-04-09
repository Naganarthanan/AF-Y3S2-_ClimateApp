// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import AdminAlertsPage from "./pages/AdminAlertsPage";
import MapPage from "./pages/MapPage";
import ShelterDetailPage from "./pages/ShelterDetailPage";
import AdminSheltersPage from "./pages/AdminSheltersPage";
import AdminZonesPage from "./pages/AdminZonesPage";
import AdminResourcesPage from "./pages/AdminResourcesPage";
import EducationListPage from "./pages/EducationListPage";
import EducationDetailPage from "./pages/EducationDetailPage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import PrepPlanPage from "./pages/PrepPlanPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/shelters/:id" element={<ProtectedRoute><ShelterDetailPage /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><EducationListPage /></ProtectedRoute>} />
        <Route path="/education/:id" element={<ProtectedRoute><EducationDetailPage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/quiz/result" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route path="/prep-plan" element={<ProtectedRoute><PrepPlanPage /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminAlertsPage /></ProtectedRoute>} />
        <Route path="/admin/shelters" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminSheltersPage /></ProtectedRoute>} />
        <Route path="/admin/zones" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminZonesPage /></ProtectedRoute>} />
        <Route path="/admin/resources" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminResourcesPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={["admin", "superadmin"]}><AdminAnalyticsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
