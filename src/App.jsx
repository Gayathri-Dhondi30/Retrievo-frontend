import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastNotifications from './components/common/ToastNotifications';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportLostPage from './pages/ReportLostPage';
import ReportFoundPage from './pages/ReportFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-brand-cream text-brand-main selection:bg-brand-caramel selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/items/:id" element={<ItemDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/help" element={<HelpPage />} />

                {/* Authenticated User Routes */}
                <Route
                  path="/report/lost"
                  element={
                    <ProtectedRoute>
                      <ReportLostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report/found"
                  element={
                    <ProtectedRoute>
                      <ReportFoundPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/my-items"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="my-items" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/matches"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="matches" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/claims"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="claims" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/messages"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="messages" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="overview" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardPage initialTab="profile" />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/audit-logs"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastNotifications />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
