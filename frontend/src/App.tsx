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

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />

          <Route path="/standards" element={<StandardsPage />} />
          <Route
            path="/standards/:standardId"
            element={<StandardDetailPage />}
          />

          <Route path="/certification" element={<CertificationPage />} />
          <Route
            path="/certification/:schemeId"
            element={<CertificationSchemePage />}
          />

          <Route path="/hallmarking" element={<HallmarkingPage />} />

          <Route path="/testing" element={<TestingPage />} />
          <Route
            path="/testing/labs/:labId"
            element={<LaboratoryDetailPage />}
          />

          <Route path="/services" element={<ServicesPage />} />
          <Route
            path="/services/:serviceId"
            element={<ServiceDetailPage />}
          />

          <Route path="/sources" element={<SourcesPage />} />
          <Route
            path="/sources/:documentId"
            element={<DocumentViewerPage />}
          />

          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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