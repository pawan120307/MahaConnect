import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Protected Route Guard
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ServicesCatalog from './pages/citizen/ServicesCatalog';
import ApplyService from './pages/citizen/ApplyService';
import ApplicationsList from './pages/citizen/ApplicationsList';
import ApplicationDetail from './pages/citizen/ApplicationDetail';
import NotificationsPage from './pages/citizen/NotificationsPage';
import CitizenProfile from './pages/citizen/CitizenProfile';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerApplications from './pages/officer/OfficerApplications';
import OfficerReview from './pages/officer/OfficerReview';
import OfficerProfile from './pages/officer/OfficerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import UserManagement from './pages/admin/UserManagement';
import AllApplications from './pages/admin/AllApplications';
import ApiLogsPage from './pages/admin/ApiLogsPage';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Citizen Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardLayout>
                    <CitizenDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin']}>
                  <DashboardLayout>
                    <ServicesCatalog />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/:id/apply"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardLayout>
                    <ApplyService />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardLayout>
                    <ApplicationsList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin']}>
                  <DashboardLayout>
                    <ApplicationDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin']}>
                  <DashboardLayout>
                    <NotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardLayout>
                    <CitizenProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Officer Protected Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <DashboardLayout>
                    <OfficerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/applications"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <DashboardLayout>
                    <OfficerApplications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/applications/:id"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <DashboardLayout>
                    <OfficerReview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/profile"
              element={
                <ProtectedRoute allowedRoles={['officer', 'admin']}>
                  <DashboardLayout>
                    <OfficerProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <DepartmentManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ServiceManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <UserManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AllApplications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/api-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <ApiLogsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <AdminProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
