import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages - Named Imports
import { LandingPage } from './pages/Landing/LandingPage';
import { AIIntroPage } from './pages/AIIntro/AIIntroPage';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CreateFormPage } from './pages/CreateForm/CreateFormPage';
import { AIProcessingPage } from './pages/AIProcessing/AIProcessingPage';
import { FormBuilderPage } from './pages/FormBuilder/FormBuilderPage';
import { PreviewPage } from './pages/Preview/PreviewPage';
import { PublishPage } from './pages/Publish/PublishPage';
import { MyFormsPage } from './pages/MyForms/MyFormsPage';
import { ResponsesPage } from './pages/Responses/ResponsesPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { AITemplatesPage } from './pages/Templates/AITemplatesPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { HelpPage } from './pages/Help/HelpPage';
import { AboutPage } from './pages/About/AboutPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { AIAssistantPage } from './pages/AIAssistantPage/AIAssistantPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage/EmailVerifiedPage';

// Authenticated Dashboard Shell Layout
const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <FormProvider>
      <Router>
        <Routes>
          {/* Public / Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/intro" element={<AIIntroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Standalone Interactive AI Assistant & Preview Routes */}
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/preview" element={<PreviewPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-form" element={<CreateFormPage />} />
            <Route path="/ai-processing" element={<AIProcessingPage />} />
            <Route path="/form-builder" element={<FormBuilderPage />} />
            <Route path="/templates" element={<AITemplatesPage />} />
            <Route path="/publish" element={<PublishPage />} />
            <Route path="/forms" element={<MyFormsPage />} />
            <Route path="/responses" element={<ResponsesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </FormProvider>
  );
}

export default App;