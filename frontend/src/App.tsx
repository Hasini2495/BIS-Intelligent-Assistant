import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import AssistantPage from './pages/AssistantPage';
import StandardsPage from './pages/StandardsPage';
import StandardDetailPage from './pages/StandardDetailPage';
import CertificationPage from './pages/CertificationPage';
import CertificationSchemePage from './pages/CertificationSchemePage';
import HallmarkingPage from './pages/HallmarkingPage';
import TestingPage from './pages/TestingPage';
import LaboratoryDetailPage from './pages/LaboratoryDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import SourcesPage from './pages/SourcesPage';
import DocumentViewerPage from './pages/DocumentViewerPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// 20-screen reference pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ComplianceValidatorPage from './pages/ComplianceValidatorPage';
import ValidationResultPage from './pages/ValidationResultPage';
import DocumentCenterPage from './pages/DocumentCenterPage';
import BookmarksPage from './pages/BookmarksPage';
import NotificationsPage from './pages/NotificationsPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminKnowledgeBasePage from './pages/AdminKnowledgeBasePage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Public Portal & Auth (Screen 01, 02, 03) */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Core Dashboard & Assistant (Screen 04, 05) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />

          {/* Standards Catalogue & Details (Screen 06, 07) */}
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/standards/:standardId" element={<StandardDetailPage />} />

          {/* Compliance Validator & Results (Screen 08, 09) */}
          <Route path="/compliance" element={<ComplianceValidatorPage />} />
          <Route path="/compliance/result" element={<ValidationResultPage />} />

          {/* Document Center & Sources (Screen 10) */}
          <Route path="/documents" element={<DocumentCenterPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/sources/:documentId" element={<DocumentViewerPage />} />

          {/* Certification & Schemes (Screen 11, 12) */}
          <Route path="/certification" element={<CertificationPage />} />
          <Route path="/certification/:schemeId" element={<CertificationSchemePage />} />

          {/* Hallmarking, Testing, Services */}
          <Route path="/hallmarking" element={<HallmarkingPage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/testing/labs/:labId" element={<LaboratoryDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />

          {/* Bookmarks, History, Notifications, Settings, Feedback (Screen 13, 14, 15, 16, 17) */}
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* Admin Management & Analytics (Screen 18, 19, 20) */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/knowledge-base" element={<AdminKnowledgeBasePage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

          {/* Support & Errors */}
          <Route path="/help" element={<HelpPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;